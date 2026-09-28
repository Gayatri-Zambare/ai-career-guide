import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Map, Target } from 'lucide-react';
import { Career } from '../types';

interface CareerCardProps {
    career: Career;
    compatibilityScore?: number;
    matchedFactors?: string[];
    explanation?: string;
    onExplore: (careerId: number) => void;
    showExplanation?: boolean;
}

export const CareerCard: React.FC<CareerCardProps> = ({
    career,
    compatibilityScore,
    matchedFactors = [],
    explanation,
    onExplore,
    showExplanation = true,
}) => {
    const getBadgeColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'technology':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'design':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'business':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'finance':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'science':
                return 'bg-cyan-50 text-cyan-700 border-cyan-200';
            case 'healthcare':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-brand-300 p-6 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col justify-between group">
            <div>
                {/* Top Header Row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                        <span className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-1.5 ${getBadgeColor(career.category)}`}>
                            {career.category}
                        </span>
                        <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-brand-600 transition-colors font-sans leading-snug">
                            {career.name}
                        </h3>
                    </div>

                    {/* Compatibility Score Pill if present */}
                    {compatibilityScore !== undefined && (
                        <div className="flex flex-col items-end">
                            <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-brand-600 to-accent-indigo text-white shadow-sm flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-cyan-200" />
                                <span className="font-black text-sm">{Math.round(compatibilityScore)}%</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Match</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                    {career.description}
                </p>

                {/* Explainability factors if available */}
                {showExplanation && matchedFactors && matchedFactors.length > 0 && (
                    <div className="mb-4 bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                        <p className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5 text-brand-600" />
                            Why this matches you:
                        </p>
                        <ul className="space-y-1">
                            {matchedFactors.slice(0, 2).map((factor, idx) => (
                                <li key={idx} className="text-[11px] text-slate-600 flex items-start gap-1.5 leading-tight">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                                    <span>{factor}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Required Skills Chips */}
                <div className="mb-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Key Competencies
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {career.skills.slice(0, 4).map((skill, idx) => (
                            <span
                                key={idx}
                                className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md"
                            >
                                {skill}
                            </span>
                        ))}
                        {career.skills.length > 4 && (
                            <span className="text-[10px] font-medium text-slate-400 px-1 py-0.5">
                                +{career.skills.length - 4} more
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                    onClick={() => onExplore(career.id)}
                    className="text-xs font-semibold text-slate-600 hover:text-brand-600 flex items-center gap-1"
                >
                    <Map className="w-3.5 h-3.5" />
                    View Roadmap
                </button>

                <button
                    onClick={() => onExplore(career.id)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-600 hover:text-white transition-all flex items-center gap-1"
                >
                    Explore Details
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};
