import React, { useState } from 'react';
import { Compass, User, Mail, Lock, GraduationCap, BookOpen, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RegisterPageProps {
    onNavigate: (tab: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState<number | ''>(19);
    const [educationLevel, setEducationLevel] = useState('Undergraduate');
    const [currentClassYear, setCurrentClassYear] = useState('2nd Year');
    const [stream, setStream] = useState('Science');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await register({
                name,
                email,
                password,
                age: age ? Number(age) : null,
                education_level: educationLevel,
                current_class_year: currentClassYear,
                stream,
            });
            onNavigate('dashboard');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-card">

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-accent-indigo to-accent-purple text-white items-center justify-center shadow-md shadow-brand-500/20 mb-2">
                        <Compass className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                        Create Student Account
                    </h2>
                    <p className="text-xs text-slate-500">
                        Join AI CareerGuide to unlock personalized career matchmaking
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Full Name */}
                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Full Name *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <User className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Jordan Smith"
                                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Email & Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Email Address *
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
                                    placeholder="student@domain.edu"
                                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Password *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min 6 characters"
                                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Age & Academic Stream */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Age
                            </label>
                            <input
                                type="number"
                                min={13}
                                max={60}
                                value={age}
                                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                                placeholder="e.g. 19"
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Academic Stream *
                            </label>
                            <select
                                value={stream}
                                onChange={(e) => setStream(e.target.value)}
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white cursor-pointer"
                            >
                                <option value="Science">Science (PCM / PCB / CS)</option>
                                <option value="Commerce">Commerce / Business Studies</option>
                                <option value="Arts/Humanities">Arts / Humanities</option>
                                <option value="Diploma">Diploma / Polytechnic</option>
                                <option value="Undergraduate">Undergraduate (B.Tech / B.Sc / BBA)</option>
                                <option value="Other">Other / Exploring</option>
                            </select>
                        </div>
                    </div>

                    {/* Education Level & Current Class/Year */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Education Level
                            </label>
                            <select
                                value={educationLevel}
                                onChange={(e) => setEducationLevel(e.target.value)}
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white cursor-pointer"
                            >
                                <option value="High School">High School (10th - 12th)</option>
                                <option value="Undergraduate">Undergraduate Degree</option>
                                <option value="Postgraduate">Postgraduate / Master's</option>
                                <option value="Diploma">Diploma / Vocational</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Class / Year
                            </label>
                            <input
                                type="text"
                                value={currentClassYear}
                                onChange={(e) => setCurrentClassYear(e.target.value)}
                                placeholder="e.g. 12th Grade or 2nd Year"
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-accent-indigo hover:from-brand-700 hover:to-accent-indigo/90 shadow-md shadow-brand-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Creating Profile...' : 'Complete Registration'}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                </form>

                {/* Footer Link */}
                <div className="text-center pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-600">
                        Already registered?{' '}
                        <button
                            onClick={() => onNavigate('login')}
                            className="font-bold text-brand-600 hover:underline"
                        >
                            Sign in to your account
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
};
