import React, { useState } from 'react';
import { Compass, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
    onNavigate: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, password);
            onNavigate('dashboard');
        } catch (err: any) {
            setError(err.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = (role: 'student' | 'admin') => {
        if (role === 'student') {
            setEmail('student@aicareerguide.com');
            setPassword('student123');
        } else {
            setEmail('admin@aicareerguide.com');
            setPassword('admin123');
        }
        setError(null);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-card">

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-accent-indigo to-accent-purple text-white items-center justify-center shadow-md shadow-brand-500/20 mb-2">
                        <Compass className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                        Welcome Back
                    </h2>
                    <p className="text-xs text-slate-500">
                        Sign in to access your personalized career recommendations
                    </p>
                </div>

                {/* Demo Credentials Quick Pills */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 space-y-2">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-accent-purple" /> Quick Demo Credentials:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => fillDemo('student')}
                            className="text-[11px] font-bold py-1.5 px-2.5 rounded-lg bg-blue-50 text-brand-700 hover:bg-blue-100 border border-blue-200 transition-colors text-center"
                        >
                            Demo Student
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemo('admin')}
                            className="text-[11px] font-bold py-1.5 px-2.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors text-center flex items-center justify-center gap-1"
                        >
                            <Shield className="w-3 h-3 text-purple-600" />
                            Demo Admin
                        </button>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Mail className="w-4 h-4" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@university.edu"
                                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={() => alert("For this demonstration, use the Quick Demo Student button or reset via database seed.")}
                                className="text-xs text-brand-600 hover:underline font-semibold"
                            >
                                Forgot Password?
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded cursor-pointer"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 font-medium cursor-pointer">
                            Remember me on this browser
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-accent-indigo hover:from-brand-700 hover:to-accent-indigo/90 shadow-md shadow-brand-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                {/* Footer Link */}
                <div className="text-center pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-600">
                        Don't have an account yet?{' '}
                        <button
                            onClick={() => onNavigate('register')}
                            className="font-bold text-brand-600 hover:underline"
                        >
                            Register here
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
};
