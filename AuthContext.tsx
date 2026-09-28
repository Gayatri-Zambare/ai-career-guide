import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, StudentProfile } from '../types';

interface AuthContextType {
    user: User | null;
    profile: StudentProfile | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('career_guide_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const refreshProfile = async () => {
        try {
            if (!localStorage.getItem('career_guide_token')) return;
            const prof = await api.get<StudentProfile>('/student/profile');
            setProfile(prof);
        } catch (err) {
            console.error('Failed to load profile:', err);
        }
    };

    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem('career_guide_token');
            if (token) {
                try {
                    const me = await api.get<{ id: number; name: string; email: string; role: 'student' | 'admin' }>('/auth/me');
                    setUser(me);
                    localStorage.setItem('career_guide_user', JSON.stringify(me));
                    if (me.role === 'student') {
                        await refreshProfile();
                    }
                } catch {
                    api.clearToken();
                    setUser(null);
                    setProfile(null);
                }
            }
            setLoading(false);
        };
        init();
    }, []);

    const login = async (email: string, password: string) => {
        const res = await api.post<{ access_token: string; user: User }>('/auth/login', { email, password });
        api.setToken(res.access_token);
        setUser(res.user);
        localStorage.setItem('career_guide_user', JSON.stringify(res.user));
        if (res.user.role === 'student') {
            await refreshProfile();
        }
    };

    const register = async (data: any) => {
        const res = await api.post<{ access_token: string; user: User }>('/auth/register', data);
        api.setToken(res.access_token);
        setUser(res.user);
        localStorage.setItem('career_guide_user', JSON.stringify(res.user));
        await refreshProfile();
    };

    const logout = () => {
        api.clearToken();
        setUser(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, login, register, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
