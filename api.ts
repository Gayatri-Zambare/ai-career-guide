const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

class ApiService {
    private getToken(): string | null {
        return localStorage.getItem('career_guide_token');
    }

    public setToken(token: string) {
        localStorage.setItem('career_guide_token', token);
    }

    public clearToken() {
        localStorage.removeItem('career_guide_token');
        localStorage.removeItem('career_guide_user');
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const token = this.getToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string> || {}),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired or invalid
                    this.clearToken();
                }
                let errorData: any = {};
                try {
                    errorData = await response.json();
                } catch {
                    // non-JSON error
                }
                const message = errorData.detail || errorData.message || 'Something went wrong. Please try again.';
                throw new Error(message);
            }

            return (await response.json()) as T;
        } catch (err: any) {
            if (err.message && err.message.includes('Failed to fetch')) {
                throw new Error('Unable to connect to the server. Please ensure the backend is running.');
            }
            throw err;
        }
    }

    public get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    public post<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data !== undefined ? JSON.stringify(data) : undefined,
        });
    }

    public put<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data !== undefined ? JSON.stringify(data) : undefined,
        });
    }

    public delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

export const api = new ApiService();
