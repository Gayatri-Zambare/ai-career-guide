import React, { useState } from 'react';
import { Compass, Sparkles, User as UserIcon, LogOut, Menu, X, Shield, BookOpen, BarChart3, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
    currentTab: string;
    onNavigate: (tab: string, param?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const handleNav = (tab: string, param?: any) => {
        onNavigate(tab, param);
        setMobileMenuOpen(false);
        setUserDropdownOpen(false);
    };

    return (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo & Brand */}
                    <div
                        onClick={() => handleNav('landing')}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-accent-indigo to-accent-purple flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                            <Compass className="w-5 h-5 text-white animate-spin-slow" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-700 via-accent-indigo to-accent-purple font-sans">
                                    AI CareerGuide
                                </span>
                                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-brand-50 text-brand-600 rounded border border-brand-200/60">
                                    FAI AI
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium hidden sm:block -mt-0.5">
                                Discover Your Strengths. Explore Your Future.
                            </p>
                        </div>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-1">
                        <button
                            onClick={() => handleNav('landing')}
                            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${currentTab === 'landing' ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                                }`}
                        >
                            Home
                        </button>

                        <button
                            onClick={() => handleNav('explorer')}
                            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${currentTab === 'explorer' ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                                }`}
                        >
                            Explore Careers
                        </button>

                        {user && (
                            <>
                                <button
                                    onClick={() => handleNav('dashboard')}
                                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${currentTab === 'dashboard' ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                                        }`}
                                >
                                    Dashboard
                                </button>

                                <button
                                    onClick={() => handleNav('assessment')}
                                    className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${currentTab === 'assessment' ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                                        }`}
                                >
                                    <Sparkles className="w-4 h-4 text-accent-purple" />
                                    Take Assessment
                                </button>

                                <button
                                    onClick={() => handleNav('history')}
                                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${currentTab === 'history' ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                                        }`}
                                >
                                    History
                                </button>
                            </>
                        )}

                        {user?.role === 'admin' && (
                            <button
                                onClick={() => handleNav('admin')}
                                className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${currentTab === 'admin' ? 'text-accent-purple bg-purple-50' : 'text-purple-700 hover:bg-purple-50/70'
                                    }`}
                            >
                                <Shield className="w-4 h-4 text-accent-purple" />
                                Admin Panel
                            </button>
                        )}
                    </nav>

                    {/* Right Action / Auth */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all shadow-sm"
                                >
                                    <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 max-w-[120px] truncate">
                                        {user.name}
                                    </span>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                </button>

                                {userDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                        <div className="px-4 py-2 border-b border-slate-100">
                                            <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                                            <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                                            <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                                                {user.role}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => handleNav('profile')}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                        >
                                            <UserIcon className="w-4 h-4 text-slate-400" />
                                            Student Profile
                                        </button>

                                        <button
                                            onClick={() => handleNav('dashboard')}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                        >
                                            <BarChart3 className="w-4 h-4 text-slate-400" />
                                            Dashboard & Insights
                                        </button>

                                        {user.role === 'admin' && (
                                            <button
                                                onClick={() => handleNav('admin')}
                                                className="w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                                            >
                                                <Shield className="w-4 h-4 text-purple-500" />
                                                Admin Dashboard
                                            </button>
                                        )}

                                        <div className="border-t border-slate-100 my-1"></div>

                                        <button
                                            onClick={() => {
                                                logout();
                                                handleNav('landing');
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                                        >
                                            <LogOut className="w-4 h-4 text-red-500" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleNav('login')}
                                    className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => handleNav('register')}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-accent-indigo hover:from-brand-700 hover:to-accent-indigo/90 rounded-lg shadow-sm shadow-brand-500/20 hover:shadow transition-all"
                                >
                                    Get Started
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
                            aria-label="Toggle Menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
                    <button
                        onClick={() => handleNav('landing')}
                        className="w-full text-left px-3 py-2 text-base font-medium rounded-lg text-slate-800 hover:bg-slate-50"
                    >
                        Home
                    </button>
                    <button
                        onClick={() => handleNav('explorer')}
                        className="w-full text-left px-3 py-2 text-base font-medium rounded-lg text-slate-800 hover:bg-slate-50"
                    >
                        Explore Careers
                    </button>

                    {user ? (
                        <>
                            <button
                                onClick={() => handleNav('dashboard')}
                                className="w-full text-left px-3 py-2 text-base font-medium rounded-lg text-slate-800 hover:bg-slate-50"
                            >
                                Student Dashboard
                            </button>
                            <button
                                onClick={() => handleNav('assessment')}
                                className="w-full text-left px-3 py-2 text-base font-medium rounded-lg text-brand-600 font-semibold hover:bg-brand-50"
                            >
                                Take Assessment
                            </button>
                            <button
                                onClick={() => handleNav('history')}
                                className="w-full text-left px-3 py-2 text-base font-medium rounded-lg text-slate-800 hover:bg-slate-50"
                            >
                                Assessment History
                            </button>
                            <button
                                onClick={() => handleNav('profile')}
                                className="w-full text-left px-3 py-2 text-base font-medium rounded-lg text-slate-800 hover:bg-slate-50"
                            >
                                My Profile
                            </button>
                            {user.role === 'admin' && (
                                <button
                                    onClick={() => handleNav('admin')}
                                    className="w-full text-left px-3 py-2 text-base font-medium rounded-lg text-purple-700 font-semibold hover:bg-purple-50"
                                >
                                    Admin Panel
                                </button>
                            )}
                            <div className="pt-2 border-t border-slate-100">
                                <button
                                    onClick={() => {
                                        logout();
                                        handleNav('landing');
                                    }}
                                    className="w-full text-left px-3 py-2 text-base font-medium text-red-600 rounded-lg hover:bg-red-50"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                            <button
                                onClick={() => handleNav('login')}
                                className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => handleNav('register')}
                                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-brand-600 rounded-lg"
                            >
                                Get Started
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};
