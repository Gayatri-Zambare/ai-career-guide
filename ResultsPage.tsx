import React, { useEffect, useState } from 'react';
import {
    Sparkles, RefreshCw, AlertCircle, ArrowRight, CheckCircle2,
    Map, Target, ShieldCheck, ChevronRight, BookOpen, Layers, Award
} from 'lucide-react';
import { api } from '../services/api';
import { AssessmentResult, Recommendation } from '../types';
import { RadarProfileChart } from '../components/RadarProfileChart';

interface ResultsPageProps {
    assessmentId?: number | null;
    onNavigate: (tab: string, param?: any) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ assessmentId, onNavigate }) => {
    const [result, setResult] = useState<AssessmentResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                const endpoint = assessmentId
                    ? `/recommendations/${assessmentId}`
                    : `/recommendations/latest`;
                const data = await api.get<AssessmentResult>(endpoint);
                setResult(data);
            } catch (err: any) {
                setError(err.message || 'No completed assessment found. Please complete the assessment first.');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [assessmentId]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
                <p className="text-sm font-semibold text-slate-600">
                    Generating personalized explainable recommendations...
                </p>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-5 shadow-card">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-xl font-sans">
                    No Assessment Results Found
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                    {error || "You haven't completed a career assessment yet. Take our quick assessment to calculate your career matches."}
                </p>
                <button
                    onClick={() => onNavigate('assessment')}
                    className="px-6 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 text-xs shadow-md transition-all inline-flex items-center gap-1.5"
                >
                    <Sparkles className="w-4 h-4" /> Start Career Assessment
                </button>
            </div>
        );
    }

    const topMatch = result.recommendations[0];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

            {/* HEADER SECTION */}
            <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-accent-indigo text-white rounded-3xl p-8 sm:p-10 shadow-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-100 text-xs font-semibold backdrop-blur-md">
                            <Award className="w-4 h-4 text-cyan-300" />
                            <span>Assessment Completed • {result.completed_at ? new Date(result.completed_at).toLocaleDateString() : 'Recent'}</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-sans">
                            Your Personalized Career Insights
                        </h1>

                        <p className="text-sm text-brand-100/90 max-w-2xl leading-relaxed">
                            Based on your multi-attribute evaluation across interests, self-rated skills, academic profile, and preferred work environment, we've identified your top career compatibility matches.
                        </p>
                    </div>

                    <button
                        onClick={() => onNavigate('assessment')}
                        className="shrink-0 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4 text-brand-600" />
                        Retake Assessment
                    </button>
                </div>
            </div>

            {/* OVERALL PROFILE RADAR & APTITUDE SECTION */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
                        Overall Aptitude Profile
                    </h2>
                    <p className="text-xs text-slate-500">
                        Multi-factor synthesis of your analytical, creative, and technical inclinations
                    </p>
                </div>

                <RadarProfileChart scores={result.profile_summary} />
            </div>

            {/* TOP 5 CAREER MATCHES */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
                            Top 5 Recommended Career Matches
                        </h2>
                        <p className="text-xs text-slate-500">
                            Ranked by overall multi-attribute compatibility formula
                        </p>
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        5 Matches
                    </span>
                </div>

                <div className="space-y-6">
                    {result.recommendations.map((rec, index) => (
                        <div
                            key={rec.id}
                            className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-soft hover:shadow-card p-6 sm:p-8 ${index === 0 ? 'border-brand-300 ring-2 ring-brand-100' : 'border-slate-200/90'
                                }`}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                                {/* Left Overview Column */}
                                <div className="lg:col-span-7 space-y-4">

                                    {/* Rank & Category */}
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center">
                                            #{index + 1}
                                        </span>
                                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                                            {rec.career.category}
                                        </span>
                                        {index === 0 && (
                                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                                                <Sparkles className="w-3 h-3 text-amber-500" />
                                                Highest Match
                                            </span>
                                        )}
                                    </div>

                                    {/* Career Title & Description */}
                                    <div>
                                        <h3 className="text-2xl font-extrabold text-slate-900 font-sans">
                                            {rec.career.name}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                                            {rec.career.description}
                                        </p>
                                    </div>

                                    {/* Explainable AI summary */}
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                                        <p className="text-xs text-slate-700 italic leading-relaxed">
                                            "{rec.explanation}"
                                        </p>
                                    </div>

                                    {/* Sub-Score Breakdown Pills */}
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-center">
                                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Interest (30%)</p>
                                            <p className="text-xs font-extrabold text-slate-800">{rec.interest_score}%</p>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Skills (25%)</p>
                                            <p className="text-xs font-extrabold text-slate-800">{rec.skill_score}%</p>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Academics (15%)</p>
                                            <p className="text-xs font-extrabold text-slate-800">{rec.academic_score}%</p>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Preferences (15%)</p>
                                            <p className="text-xs font-extrabold text-slate-800">{rec.personality_score}%</p>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Goals (15%)</p>
                                            <p className="text-xs font-extrabold text-slate-800">{rec.goal_score}%</p>
                                        </div>
                                    </div>

                                </div>

                                {/* Right Details Column (Factors & Gaps) */}
                                <div className="lg:col-span-5 bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4 flex flex-col justify-between">

                                    {/* Top score banner */}
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-slate-400">Compatibility Score</span>
                                            <p className="text-2xl font-black text-brand-600 font-sans">
                                                {Math.round(rec.compatibility_score)}% Match
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => onNavigate('career-details', rec.career_id)}
                                            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all flex items-center gap-1.5"
                                        >
                                            <Map className="w-3.5 h-3.5" />
                                            View Roadmap
                                        </button>
                                    </div>

                                    {/* Why this matches you */}
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            Why this career matches you:
                                        </p>
                                        <ul className="space-y-1.5">
                                            {rec.matched_factors.slice(0, 3).map((f, i) => (
                                                <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5 leading-tight">
                                                    <span className="text-emerald-500 font-bold">✓</span>
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Skills to Improve / Skill Gaps */}
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                                            <Target className="w-4 h-4 text-amber-600" />
                                            Areas to develop next:
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {rec.growth_areas.slice(0, 3).map((area, i) => (
                                                <span
                                                    key={i}
                                                    className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200"
                                                >
                                                    → {area}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ethical AI Notice Banner */}
            <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 text-xs text-slate-500 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                    <strong>Explainable AI Principle:</strong> The recommendations above represent decision-support guidance calculated by comparing your assessment responses against empirical career profiles. They provide structured milestones to empower your self-discovery and do not dictate or restrict your potential.
                </p>
            </div>

        </div>
    );
};
