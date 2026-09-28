import React from 'react';
import { Brain, Sparkles, TrendingUp } from 'lucide-react';

interface RadarProfileChartProps {
    scores: Record<string, number>;
}

export const RadarProfileChart: React.FC<RadarProfileChartProps> = ({ scores }) => {
    const dimensions = [
        { key: 'Analytical Skills', label: 'Analytical', color: '#2563eb', bg: 'bg-blue-500' },
        { key: 'Creativity', label: 'Creativity', color: '#9333ea', bg: 'bg-purple-500' },
        { key: 'Communication', label: 'Communication', color: '#0d9488', bg: 'bg-teal-500' },
        { key: 'Leadership', label: 'Leadership', color: '#ea580c', bg: 'bg-orange-500' },
        { key: 'Technical Interest', label: 'Technical', color: '#4f46e5', bg: 'bg-indigo-500' },
        { key: 'Research Interest', label: 'Research', color: '#0284c7', bg: 'bg-sky-500' },
    ];

    const size = 320;
    const center = size / 2;
    const radius = 100;
    const totalAxes = dimensions.length;

    // Calculate polygon points
    const points = dimensions.map((dim, i) => {
        const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
        const value = Math.max(15, Math.min(100, scores[dim.key] || 50));
        const r = (value / 100) * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');

    // Grid rings (20%, 40%, 60%, 80%, 100%)
    const rings = [0.25, 0.5, 0.75, 1.0];

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-soft">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                        <Brain className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-base font-sans">
                            Personalized Aptitude Profile
                        </h3>
                        <p className="text-xs text-slate-500">6-Dimensional AI Evaluation</p>
                    </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    AI Computed
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

                {/* Radar Graphic */}
                <div className="flex justify-center relative">
                    <svg width={size} height={size} className="overflow-visible">
                        {/* Background circular / polygon rings */}
                        {rings.map((factor, idx) => {
                            const r = radius * factor;
                            const ringPoints = dimensions.map((_, i) => {
                                const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
                                return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
                            }).join(' ');
                            return (
                                <polygon
                                    key={idx}
                                    points={ringPoints}
                                    fill="none"
                                    stroke="#e2e8f0"
                                    strokeWidth="1"
                                    strokeDasharray={idx < 3 ? "3 3" : undefined}
                                />
                            );
                        })}

                        {/* Axes lines */}
                        {dimensions.map((_, i) => {
                            const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
                            const x = center + radius * Math.cos(angle);
                            const y = center + radius * Math.sin(angle);
                            return (
                                <line
                                    key={i}
                                    x1={center}
                                    y1={center}
                                    x2={x}
                                    y2={y}
                                    stroke="#cbd5e1"
                                    strokeWidth="1"
                                />
                            );
                        })}

                        {/* Student Score Polygon */}
                        <polygon
                            points={points}
                            fill="rgba(50, 126, 255, 0.22)"
                            stroke="#2563eb"
                            strokeWidth="2.5"
                            className="transition-all duration-700 ease-out"
                        />

                        {/* Point circles & labels */}
                        {dimensions.map((dim, i) => {
                            const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
                            const value = Math.max(15, Math.min(100, scores[dim.key] || 50));
                            const r = (value / 100) * radius;
                            const x = center + r * Math.cos(angle);
                            const y = center + r * Math.sin(angle);

                            // Label placement outside radius
                            const labelR = radius + 24;
                            const lx = center + labelR * Math.cos(angle);
                            const ly = center + labelR * Math.sin(angle);

                            return (
                                <g key={i}>
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r="4.5"
                                        fill="#ffffff"
                                        stroke={dim.color}
                                        strokeWidth="2.5"
                                    />
                                    <text
                                        x={lx}
                                        y={ly}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="text-[11px] font-semibold fill-slate-700"
                                    >
                                        {dim.label}
                                    </text>
                                    <text
                                        x={lx}
                                        y={ly + 13}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="text-[10px] font-bold fill-brand-600"
                                    >
                                        {Math.round(value)}%
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Dimension Breakdown Bars */}
                <div className="space-y-3.5">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                        Factor Strengths
                    </h4>
                    {dimensions.map((dim) => {
                        const scoreVal = Math.round(scores[dim.key] || 50);
                        return (
                            <div key={dim.key} className="space-y-1">
                                <div className="flex items-center justify-between text-xs font-semibold">
                                    <span className="text-slate-700">{dim.key}</span>
                                    <span className="text-slate-900 font-bold">{scoreVal}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${dim.bg}`}
                                        style={{ width: `${scoreVal}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};
