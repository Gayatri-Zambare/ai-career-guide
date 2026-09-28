import React from 'react';

interface ProgressBarProps {
    current: number;
    total: number;
    category?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, category }) => {
    const percentage = Math.min(100, Math.round(((current + 1) / total) * 100));

    return (
        <div className="w-full bg-white rounded-2xl p-4 border border-slate-200 shadow-soft mb-6">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <div className="flex items-center gap-2">
                    {category && (
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 font-bold border border-brand-200">
                            {category}
                        </span>
                    )}
                    <span className="text-slate-600 font-medium">
                        Question <span className="text-slate-900 font-bold">{current + 1}</span> of {total}
                    </span>
                </div>
                <span className="text-brand-600 font-bold text-sm">{percentage}% Completed</span>
            </div>

            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div
                    className="h-full bg-gradient-to-r from-brand-600 via-accent-indigo to-accent-purple rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
