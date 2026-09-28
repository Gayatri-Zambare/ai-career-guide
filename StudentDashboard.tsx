import React, { useEffect, useState } from 'react';
import {
    Sparkles, Compass, CheckCircle2, Clock, AlertCircle, ArrowRight,
    Map, UserCheck, TrendingUp, RefreshCw, BarChart2, BookOpen, Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Recommendation, Career } from '../types';
import { CareerCard } from '../components/CareerCard';

interface StudentDashboardProps {
    onNavigate: (tab: string, param?: any) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
    const { user, profile, refreshProfile } = useAuth();
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                await refreshProfile();
                // Try fetching latest recommendations if completed
                try {
                    const res = await api.get<{ recommendations: Recommendation[] }>('/recommendations/latest');
                    setRecommendations(res.recommendations || []);
                } catch {
                    // No completed assessment yet; fallback to default top careers
                    const popularCareers = await api.get<Career[]>('/careers');
                    // Map to recommendations structure with baseline scores
                    const baselineRecs = popularCareers.slice(0, 3).map((c, i) => ({
                        id: i + 1,
                        career_id: c.id,
                        career: c,
                        compatibility_score: 85 - (i * 3),
                        interest_score: 80,
                        skill_score: 80,
                        academic_score: 80,
                        personality_score: 80,
                        goal_score: 80,
                        matched_factors: ["General interest & aptitude match", "Popular high-growth industry path"],
                        growth_areas: c.beginner_skills || [],
                        explanation: `Based on current general metrics, ${c.name} is a high-growth career path matching your stream.`
                    }));
                    setRecommendations(baselineRecs as Recommendation[]);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const completionPct = profile?.profile_completion_pct || 70;
    const assessmentStatus = profile?.assessment_status || 'Not Started';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-accent-indigo text-white rounded-3xl p-6 sm:p-8 shadow-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-100 text-xs font-semibold">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                            <span>Student Career Command Center</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
                            Welcome, {user?.name || 'Student'}! 👋
                        </h1>
                        <p className="text-sm text-brand-100/90 max-w-xl">
                            Track your career compatibility scores, review skill gaps, and explore tailored milestones designed for your academic stream ({profile?.stream || 'Science'}).
                        </p>
                    </div>

                    {/* Quick Assessment CTA button */}
                    <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => onNavigate('assessment')}
                            className="px-6 py-3 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            <Sparkles className="w-4 h-4 text-accent-purple" />
                            {assessmentStatus === 'Completed' ? 'Retake Assessment' : 'Start Assessment'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile & Assessment Status Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Profile Completion Circular Gauge */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-soft flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Profile Readiness
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 font-sans">
                            Profile Completion
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Add marks and skills to boost precision
                        </p>
                        <button
                            onClick={() => onNavigate('profile')}
                            className="mt-3 text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                        >
                            Update Profile <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Circular Progress Gauge */}
                    <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-slate-100"
                                strokeWidth="3.5"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className="text-brand-600 transition-all duration-1000 ease-out"
                                strokeDasharray={`${completionPct}, 100`}
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <span className="absolute text-sm font-extrabold text-slate-900">
                            {completionPct}%
                        </span>
                    </div>
                </div>

                {/* Assessment Status Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-soft flex flex-col justify-between">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            AI Evaluation Status
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 font-sans">
                            Assessment Status
                        </h3>
                        <div className="mt-3 flex items-center gap-2">
                            {assessmentStatus === 'Completed' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    Assessment Completed
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                    <Clock className="w-4 h-4 text-amber-600" />
                                    {assessmentStatus}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 mt-4">
                        <button
                            onClick={() => onNavigate(assessmentStatus === 'Completed' ? 'results' : 'assessment')}
                            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                        >
                            {assessmentStatus === 'Completed' ? 'View Full AI Insights' : 'Take 5-Min Assessment'}
                            <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Academic Stream & Education */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-soft flex flex-col justify-between">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Academic Background
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 font-sans">
                            {profile?.stream || 'Science'} Stream
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            {profile?.education_level || 'Undergraduate'} • {profile?.current_class_year || 'Current Student'}
                        </p>
                        {profile?.percentage && (
                            <p className="text-xs font-semibold text-emerald-600 mt-2">
                                Reported Score: {profile.percentage}% / CGPA
                            </p>
                        )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 mt-4">
                        <button
                            onClick={() => onNavigate('explorer')}
                            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                        >
                            <Compass className="w-3.5 h-3.5" /> Explore All Stream Careers
                        </button>
                    </div>
                </div>

            </div>

            {/* QUICK ACTIONS BAR */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">
                    Quick Actions
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    <button
                        onClick={() => onNavigate('assessment')}
                        className="p-3 rounded-xl bg-white hover:bg-brand-50 border border-slate-200/80 hover:border-brand-300 text-left transition-all shadow-2xs group"
                    >
                        <Sparkles className="w-5 h-5 text-accent-purple mb-1 group-hover:scale-110 transition-transform" />
                        <p className="text-xs font-bold text-slate-800">Take Assessment</p>
                        <p className="text-[10px] text-slate-400">Evaluate fit</p>
                    </button>

                    <button
                        onClick={() => onNavigate('results')}
                        className="p-3 rounded-xl bg-white hover:bg-brand-50 border border-slate-200/80 hover:border-brand-300 text-left transition-all shadow-2xs group"
                    >
                        <BarChart2 className="w-5 h-5 text-brand-600 mb-1 group-hover:scale-110 transition-transform" />
                        <p className="text-xs font-bold text-slate-800">View Matches</p>
                        <p className="text-[10px] text-slate-400">Personalized scores</p>
                    </button>

                    <button
                        onClick={() => onNavigate('explorer')}
                        className="p-3 rounded-xl bg-white hover:bg-brand-50 border border-slate-200/80 hover:border-brand-300 text-left transition-all shadow-2xs group"
                    >
                        <Compass className="w-5 h-5 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                        <p className="text-xs font-bold text-slate-800">Explore Careers</p>
                        <p className="text-[10px] text-slate-400">Search 20+ fields</p>
                    </button>

                    <button
                        onClick={() => onNavigate('history')}
                        className="p-3 rounded-xl bg-white hover:bg-brand-50 border border-slate-200/80 hover:border-brand-300 text-left transition-all shadow-2xs group"
                    >
                        <Clock className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                        <p className="text-xs font-bold text-slate-800">History & Progress</p>
                        <p className="text-[10px] text-slate-400">Past assessments</p>
                    </button>

                    <button
                        onClick={() => onNavigate('profile')}
                        className="p-3 rounded-xl bg-white hover:bg-brand-50 border border-slate-200/80 hover:border-brand-300 text-left transition-all shadow-2xs group"
                    >
                        <UserCheck className="w-5 h-5 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                        <p className="text-xs font-bold text-slate-800">Update Profile</p>
                        <p className="text-[10px] text-slate-400">Marks & skills</p>
                    </button>
                </div>
            </div>

            {/* TOP RECOMMENDED CAREERS SECTION */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
                            Recommended Career Matches
                        </h2>
                        <p className="text-xs text-slate-500">
                            {assessmentStatus === 'Completed'
                                ? 'Calculated from your latest multi-attribute assessment'
                                : 'Top career recommendations for your academic stream'}
                        </p>
                    </div>

                    <button
                        onClick={() => onNavigate('results')}
                        className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                    >
                        View All Insights <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                {loading ? (
                    <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-brand-600" />
                        Loading personalized career recommendations...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recommendations.slice(0, 3).map((rec) => (
                            <CareerCard
                                key={rec.id}
                                career={rec.career}
                                compatibilityScore={rec.compatibility_score}
                                matchedFactors={rec.matched_factors}
                                explanation={rec.explanation}
                                onExplore={(careerId) => onNavigate('career-details', careerId)}
                            />
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};
