import React from 'react';
import {
    Compass, ArrowRight, Sparkles, Brain, CheckCircle, BarChart3,
    Map, Lightbulb, Users, Target, ShieldCheck, Zap, BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
    onNavigate: (tab: string, param?: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    const { user } = useAuth();

    return (
        <div className="space-y-24 pb-16">

            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 gradient-hero border-b border-slate-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        {/* Left Content */}
                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold tracking-wide shadow-2xs">
                                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                                <span>FAI Mini-Project | Explainable AI Recommendation System</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                                Find the Career <br />
                                <span className="gradient-text">That Fits You</span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                                AI-powered career guidance based on your interests, skills, academic strengths, and goals. Discover your compatibility score, identify skill gaps, and explore tailored career roadmaps.
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                                <button
                                    onClick={() => onNavigate(user ? 'assessment' : 'register')}
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-accent-indigo hover:from-brand-700 hover:to-accent-indigo/90 shadow-lg shadow-brand-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5"
                                >
                                    <Sparkles className="w-5 h-5 text-cyan-200" />
                                    Start Career Assessment
                                    <ArrowRight className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => onNavigate('explorer')}
                                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                >
                                    <Compass className="w-4 h-4 text-brand-600" />
                                    Explore Careers
                                </button>
                            </div>

                            {/* Key trust bullets */}
                            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" /> 20+ Curated Career Paths
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Explainable Scoring
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Interactive AI Chatbot
                                </span>
                            </div>
                        </div>

                        {/* Right Visual: Student → AI Analysis → Career Path */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="relative w-full max-w-md">

                                {/* Glow backdrop */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-accent-purple rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>

                                <div className="relative bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-4">

                                    {/* Step 1: Student Profile */}
                                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 transition-colors">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                            1
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-slate-800">Student Profiling</p>
                                            <p className="text-[11px] text-slate-500">Interests, Skills, & Academics</p>
                                        </div>
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                            Input Data
                                        </span>
                                    </div>

                                    {/* Flow Arrow */}
                                    <div className="flex justify-center -my-1 text-slate-300">
                                        ↓
                                    </div>

                                    {/* Step 2: AI Engine */}
                                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-200 shadow-xs">
                                        <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                                            <Brain className="w-5 h-5 animate-pulse" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-xs font-bold text-slate-900">AI Scoring Engine</p>
                                                <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
                                            </div>
                                            <p className="text-[11px] text-brand-700 font-medium">Weighted Multi-Attribute Match (0-100%)</p>
                                        </div>
                                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                                            Processing
                                        </span>
                                    </div>

                                    {/* Flow Arrow */}
                                    <div className="flex justify-center -my-1 text-slate-300">
                                        ↓
                                    </div>

                                    {/* Step 3: Optimal Career Guidance */}
                                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                                            3
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-slate-900">Career Match & Roadmap</p>
                                            <p className="text-[11px] text-emerald-800 font-medium">Top Matches: Data Analyst (86%), SDE (84%)</p>
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                                            Tailored Output
                                        </span>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* STATISTICS SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="text-center space-y-1 relative z-10">
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                            20+
                        </h3>
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
                            Career Paths
                        </p>
                        <p className="text-[11px] text-slate-400">Tech, Business, Design & Science</p>
                    </div>

                    <div className="text-center space-y-1 relative z-10">
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                            100+
                        </h3>
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
                            Competency Skills
                        </p>
                        <p className="text-[11px] text-slate-400">Mapped across beginner & advanced</p>
                    </div>

                    <div className="text-center space-y-1 relative z-10">
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                            100%
                        </h3>
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
                            Explainable AI
                        </p>
                        <p className="text-[11px] text-slate-400">Clear drivers & skill-gap insight</p>
                    </div>

                    <div className="text-center space-y-1 relative z-10">
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                            5 min
                        </h3>
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
                            Interactive Assessment
                        </p>
                        <p className="text-[11px] text-slate-400">Quick, engaging & intuitive</p>
                    </div>

                </div>
            </section>

            {/* FEATURES SECTION (6 CARDS) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-50 text-brand-600 border border-brand-200">
                        Comprehensive Guidance Suite
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Engineered for Modern Student Success
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600">
                        Combining machine learning principles, psychometrics, and industrial skill roadmaps into one seamless experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Card 1: AI Career Recommendations */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-200 space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 font-sans">1. AI Career Recommendations</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Intelligent multi-criteria scoring evaluates interests (30%), skills (25%), academics (15%), work styles (15%), and goals (15%) to recommend top career matches.
                        </p>
                    </div>

                    {/* Card 2: Personalized Student Profile */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-200 space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-accent-purple flex items-center justify-center">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 font-sans">2. Personalized Student Profile</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Dynamically tracks your academic background, subject marks, skill ratings, and self-reported competencies with a clear profile completion gauge.
                        </p>
                    </div>

                    {/* Card 3: Skill & Interest Analysis */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-200 space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 text-accent-teal flex items-center justify-center">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 font-sans">3. Skill & Interest Analysis</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Interactive 6-dimensional radar charts display your analytical, creative, communication, leadership, technical, and research proficiencies.
                        </p>
                    </div>

                    {/* Card 4: Career Compatibility Score */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-200 space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-accent-indigo flex items-center justify-center">
                            <Target className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 font-sans">4. Career Compatibility Score</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Every career gets a clear 0–100% compatibility score alongside transparent, explainable bullet points detailing why the career fits you.
                        </p>
                    </div>

                    {/* Card 5: Career Roadmaps */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-200 space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Map className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 font-sans">5. Career Roadmaps</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Step-by-step milestone timelines guide you from student fundamentals to advanced portfolio projects, certifications, internships, and job interviews.
                        </p>
                    </div>

                    {/* Card 6: Course & Skill Suggestions */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-200 space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 font-sans">6. Course & Skill Gap Suggestions</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Automated skill-gap analysis identifies what skills you already possess vs. what skills to learn next, complete with recommended online learning courses.
                        </p>
                    </div>

                </div>
            </section>

            {/* HOW IT WORKS (4 STEPS) */}
            <section className="bg-slate-100/70 border-y border-slate-200 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                            Simple 4-Step Process
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            How It Works
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600">
                            Navigate your transition from student confusion to confident career roadmap in minutes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">

                        {/* Step 1 */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-3 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-brand-500/30">
                                1
                            </div>
                            <h3 className="font-bold text-base text-slate-900 font-sans">Create Profile</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Sign up with your academic stream (Science, Commerce, Arts) and current educational level.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-3 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-accent-purple text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-purple-500/30">
                                2
                            </div>
                            <h3 className="font-bold text-base text-slate-900 font-sans">Take Assessment</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Answer ~28 focused, engaging questions spanning your interests, skills, and work style preferences.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-3 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-accent-indigo text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-indigo-500/30">
                                3
                            </div>
                            <h3 className="font-bold text-base text-slate-900 font-sans">AI Analyzes Profile</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Our explainable recommendation engine computes compatibility scores and identifies specific strengths.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-3 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-emerald-500/30">
                                4
                            </div>
                            <h3 className="font-bold text-base text-slate-900 font-sans">Receive Guidance</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Explore top 5 matches, detailed skill gaps, learning roadmaps, and chat with your AI assistant.
                            </p>
                        </div>

                    </div>

                    <div className="text-center pt-4">
                        <button
                            onClick={() => onNavigate(user ? 'assessment' : 'register')}
                            className="px-8 py-3.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/20 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
                        >
                            Get Started Now — It's Free
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                </div>
            </section>

        </div>
    );
};
