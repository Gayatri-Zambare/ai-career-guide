import React, { useEffect, useState } from 'react';
import { Clock, Sparkles, ArrowRight, RefreshCw, AlertCircle, Award, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { AssessmentHistoryItem } from '../types';

interface AssessmentHistoryPageProps {
    onNavigate: (tab: string, param?: any) => void;
}

export const AssessmentHistoryPage: React.FC<AssessmentHistoryPageProps> = ({ onNavigate }) => {
    const [history, setHistory] = useState<AssessmentHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const data = await api.get<AssessmentHistoryItem[]>('/assessment/history');
                setHistory(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load assessment history.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-50 text-brand-600 border border-brand-200">
                        Aptitude Evolution
                    </span>
                    <h1 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight mt-1">
                        Assessment History
                    </h1>
                    <p className="text-xs text-slate-500">
                        Review how your career alignment and dimensional scores develop over time
                    </p>
                </div>

                <button
                    onClick={() => onNavigate('assessment')}
                    className="px-5 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 text-xs shadow-sm flex items-center gap-2 self-start sm:self-auto"
                >
                    <Sparkles className="w-4 h-4 text-cyan-200" />
                    Take New Assessment
                </button>
            </div>

            {loading ? (
                <div className="py-16 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-brand-600" />
                    Loading your historical assessments...
                </div>
            ) : history.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4 shadow-card">
                    <Clock className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="font-bold text-slate-900 text-lg">No Assessments Recorded Yet</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Take your first 5-minute career assessment to discover your strengths and start tracking your evolution.
                    </p>
                    <button
                        onClick={() => onNavigate('assessment')}
                        className="px-6 py-3 rounded-xl font-bold text-white bg-brand-600 text-xs shadow-sm inline-flex items-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" /> Start Career Assessment
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-soft">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="py-4 px-6">Date</th>
                                    <th className="py-4 px-6">Assessment ID</th>
                                    <th className="py-4 px-6">Top Career Match</th>
                                    <th className="py-4 px-6">Category</th>
                                    <th className="py-4 px-6">Match Score</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {history.map((item, idx) => (
                                    <tr key={item.assessment_id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4 px-6 font-semibold text-slate-700 flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            {item.completed_at}
                                        </td>
                                        <td className="py-4 px-6 text-slate-500 font-mono">
                                            #{item.assessment_id}
                                        </td>
                                        <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                                            {item.top_career}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 font-semibold text-[10px]">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1.5 font-black text-brand-600 text-sm">
                                                <Sparkles className="w-3 h-3 text-cyan-500" />
                                                {Math.round(item.compatibility_score)}%
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => onNavigate('results', item.assessment_id)}
                                                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-600 hover:text-white transition-colors inline-flex items-center gap-1"
                                            >
                                                View Insights
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
};
