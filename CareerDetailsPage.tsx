import React, { useEffect, useState } from 'react';
import {
    ArrowLeft, Map, CheckCircle2, AlertTriangle, BookOpen, GraduationCap,
    Briefcase, Building2, Sparkles, RefreshCw, Layers, Compass, Check
} from 'lucide-react';
import { api } from '../services/api';
import { Career, CareerSkillGap } from '../types';

interface CareerDetailsPageProps {
    careerId: number;
    onNavigate: (tab: string, param?: any) => void;
}

export const CareerDetailsPage: React.FC<CareerDetailsPageProps> = ({ careerId, onNavigate }) => {
    const [career, setCareer] = useState<Career | null>(null);
    const [skillGap, setSkillGap] = useState<CareerSkillGap | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCareerDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const [cData, gapData] = await Promise.all([
                    api.get<Career>(`/careers/${careerId}`),
                    api.get<CareerSkillGap>(`/careers/${careerId}/skill-gap`).catch(() => null)
                ]);
                setCareer(cData);
                setSkillGap(gapData);
            } catch (err: any) {
                setError(err.message || 'Failed to load career details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCareerDetails();
    }, [careerId]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
                <p className="text-sm font-semibold text-slate-600">Loading career details & roadmap...</p>
            </div>
        );
    }

    if (error || !career) {
        return (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
                <h3 className="font-bold text-slate-900 text-lg">Career Not Found</h3>
                <p className="text-xs text-slate-500">{error}</p>
                <button
                    onClick={() => onNavigate('explorer')}
                    className="px-5 py-2.5 rounded-xl font-bold text-white bg-brand-600 text-xs"
                >
                    Return to Career Explorer
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

            {/* Top Breadcrumb & Back */}
            <button
                onClick={() => onNavigate('explorer')}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Career Explorer
            </button>

            {/* Hero Header */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-soft space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                        {career.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                        High Growth Industry Role
                    </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
                    {career.name}
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
                    {career.description}
                </p>

                {/* Education & Work Style Meta Badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-accent-purple flex items-center justify-center shrink-0 mt-0.5">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-800">Educational Path</p>
                            <p className="text-xs text-slate-600">{career.education}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 text-accent-teal flex items-center justify-center shrink-0 mt-0.5">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-800">Typical Work Environment</p>
                            <p className="text-xs text-slate-600 capitalize">
                                {career.work_style?.join(', ') || 'Collaborative agile environment'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SKILL REQUIREMENTS & GAP ANALYSIS */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
                        Skill Requirements & Personalized Gap Analysis
                    </h2>
                    <p className="text-xs text-slate-500">
                        Compare your current skill inventory against {career.name} core competencies
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* You Have Column */}
                    <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-200/80 shadow-soft space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                                <Check className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-emerald-950 font-sans">
                                    Skills You Have
                                </h3>
                                <p className="text-[11px] text-emerald-700">Matched or Intermediate/Proficient</p>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            {skillGap?.you_have && skillGap.you_have.length > 0 ? (
                                skillGap.you_have.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs flex items-center justify-between text-xs"
                                    >
                                        <span className="font-bold text-slate-800">{item.skill}</span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                                            {item.status || 'Proficient'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                career.skills.slice(0, 3).map((s, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs flex items-center justify-between text-xs"
                                    >
                                        <span className="font-bold text-slate-800">{s}</span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                                            Foundational Fit
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* You Should Improve Column */}
                    <div className="bg-amber-50/50 rounded-3xl p-6 border border-amber-200/80 shadow-soft space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-amber-950 font-sans">
                                    Skills to Improve (Gaps)
                                </h3>
                                <p className="text-[11px] text-amber-700">Priority areas for your personal study</p>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            {skillGap?.you_should_improve && skillGap.you_should_improve.length > 0 ? (
                                skillGap.you_should_improve.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 bg-white rounded-xl border border-amber-100 shadow-2xs space-y-1 text-xs"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-800">{item.skill}</span>
                                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[10px]">
                                                {item.importance || 'Priority'}
                                            </span>
                                        </div>
                                        {item.recommendation && (
                                            <p className="text-[11px] text-slate-500">{item.recommendation}</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                (career.beginner_skills || []).map((bs, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 bg-white rounded-xl border border-amber-100 shadow-2xs flex items-center justify-between text-xs"
                                    >
                                        <span className="font-bold text-slate-800">{bs}</span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[10px]">
                                            Recommended Step
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* STEP-BY-STEP CAREER ROADMAP */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-soft space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                        <Map className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
                            Step-by-Step Career Roadmap
                        </h2>
                        <p className="text-xs text-slate-500">
                            Structured progressive milestones to transition into {career.name}
                        </p>
                    </div>
                </div>

                {/* Roadmap Timeline Steps */}
                <div className="relative pl-6 sm:pl-8 border-l-2 border-brand-200 space-y-8 my-6">
                    {career.roadmap.map((step, idx) => (
                        <div key={idx} className="relative group">

                            {/* Timeline circle badge */}
                            <div className="absolute -left-[33px] sm:-left-[41px] top-0 w-8 h-8 rounded-full bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center border-4 border-white shadow-sm group-hover:scale-110 transition-transform">
                                {step.step || idx + 1}
                            </div>

                            {/* Step Content */}
                            <div className="bg-slate-50/70 group-hover:bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 transition-all">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600 block mb-1">
                                    Milestone Phase {step.step || idx + 1}
                                </span>
                                <h4 className="font-extrabold text-slate-900 text-base font-sans">
                                    {step.title}
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {/* RECOMMENDED COURSES & RESOURCES */}
            {career.related_courses && career.related_courses.length > 0 && (
                <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-soft space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-accent-indigo flex items-center justify-center">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-900 font-sans tracking-tight">
                                Recommended Learning Resources
                            </h2>
                            <p className="text-xs text-slate-500">Curated courses and certifications</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        {career.related_courses.map((course, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-brand-200 transition-colors"
                            >
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                                    {course.level}
                                </span>
                                <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2">
                                    {course.name}
                                </h4>
                                <p className="text-[11px] text-slate-500 font-medium">
                                    Offered by: {course.platform}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TYPICAL RESPONSIBILITIES */}
            {career.responsibilities && career.responsibilities.length > 0 && (
                <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-soft space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-900 font-sans tracking-tight">
                                Daily Responsibilities
                            </h2>
                            <p className="text-xs text-slate-500">What working in this role looks like day-to-day</p>
                        </div>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {career.responsibilities.map((resp, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{resp}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
};
