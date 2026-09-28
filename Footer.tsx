import React from 'react';
import { Compass, Heart, ShieldCheck, Cpu, Sparkles } from 'lucide-react';

interface FooterProps {
    onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Brand */}
                    <div className="space-y-4 md:col-span-1">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-accent-purple flex items-center justify-center text-white">
                                <Compass className="w-4 h-4" />
                            </div>
                            <span className="font-extrabold text-lg text-white font-sans tracking-tight">
                                AI CareerGuide
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            An intelligent, explainable student career guidance platform designed for Foundations of Artificial Intelligence (FAI).
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>Explainable Multi-Criteria Scoring</span>
                        </div>
                    </div>

                    {/* Quick Nav */}
                    <div>
                        <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 font-sans">
                            Navigation
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">
                                    Home
                                </button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('explorer')} className="hover:text-white transition-colors">
                                    Explore Careers
                                </button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('assessment')} className="hover:text-white transition-colors">
                                    AI Career Assessment
                                </button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                                    Student Dashboard
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 font-sans">
                            Career Clusters
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li>Technology & Software</li>
                            <li>Data Science & Artificial Intelligence</li>
                            <li>Business & Management</li>
                            <li>Finance & Quantitative Analysis</li>
                            <li>Design, UI/UX & Media</li>
                            <li>Scientific Research & Healthcare</li>
                        </ul>
                    </div>

                    {/* AI Principles */}
                    <div className="space-y-3">
                        <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 font-sans flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 text-brand-400" />
                            AI Ethics & Methodology
                        </h4>
                        <p className="text-[11px] leading-relaxed text-slate-400">
                            Recommendations are calculated using multi-attribute decision analysis (Interest 30%, Skills 25%, Academic 15%, Preferences 15%, Goals 15%). Output is intended as intelligent decision-support guidance, not deterministic predictions.
                        </p>
                        <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-300">
                            <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
                            <span>Offline Local Rule-Based Engine Supported</span>
                        </div>
                    </div>

                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
                    <p>© {new Date().getFullYear()} AI CareerGuide. Built for FAI Mini-Project Demonstration.</p>
                    <div className="flex items-center gap-1 text-slate-300">
                        <span>Powered by Explainable AI</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
