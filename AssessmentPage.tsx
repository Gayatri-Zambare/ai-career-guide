import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
    Sparkles, ArrowRight, ArrowLeft, Check, CheckCircle2,
    HelpCircle, RefreshCw, Send, AlertCircle, Award
} from 'lucide-react';
import { api } from '../services/api';
import { Question, AssessmentResult } from '../types';
import { ProgressBar } from '../components/ProgressBar';

interface AssessmentPageProps {
    onNavigate: (tab: string, param?: any) => void;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({ onNavigate }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [assessmentId, setAssessmentId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationWarning, setValidationWarning] = useState<string | null>(null);

    // Initialize Assessment session & questions
    useEffect(() => {
        const initAssessment = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Fetch questions
                const qList = await api.get<Question[]>('/questions');
                setQuestions(qList);

                // 2. Start assessment session
                const sess = await api.post<{ assessment_id: number }>('/assessment/start');
                setAssessmentId(sess.assessment_id);

                // Pre-populate sensible baseline rating of 3 for rating questions to reduce user friction
                const initialAnswers: Record<number, any> = {};
                qList.forEach(q => {
                    if (q.question_type === 'rating') {
                        initialAnswers[q.id] = 3;
                    } else if (q.question_type === 'multi_choice') {
                        initialAnswers[q.id] = [];
                    }
                });
                setAnswers(initialAnswers);
            } catch (err: any) {
                setError(err.message || 'Failed to initialize assessment. Please check backend connection.');
            } finally {
                setLoading(false);
            }
        };

        initAssessment();
    }, []);

    const currentQ = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;
    const isConfirmationStep = currentIndex === questions.length; // Step after last question

    const handleSingleSelect = (val: string) => {
        if (!currentQ) return;
        setAnswers(prev => ({ ...prev, [currentQ.id]: val }));
        setValidationWarning(null);
    };

    const handleMultiSelect = (val: string) => {
        if (!currentQ) return;
        const currentList: string[] = answers[currentQ.id] || [];
        const updated = currentList.includes(val)
            ? currentList.filter(item => item !== val)
            : [...currentList, val];
        setAnswers(prev => ({ ...prev, [currentQ.id]: updated }));
        setValidationWarning(null);
    };

    const handleRatingSelect = (ratingVal: number) => {
        if (!currentQ) return;
        setAnswers(prev => ({ ...prev, [currentQ.id]: ratingVal }));
        setValidationWarning(null);
    };

    const handleNext = () => {
        if (!currentQ) return;
        const ans = answers[currentQ.id];

        // Validation
        if (ans === undefined || ans === '' || (Array.isArray(ans) && ans.length === 0)) {
            setValidationWarning('Please select an option to continue.');
            return;
        }

        setValidationWarning(null);
        setCurrentIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        setValidationWarning(null);
        setCurrentIndex(prev => Math.max(0, prev - 1));
    };

    const handleSubmit = async () => {
        if (!assessmentId) return;
        setSubmitting(true);
        setError(null);

        const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
            question_id: Number(qId),
            answer: ans,
        }));

        try {
            const res = await api.post<AssessmentResult>('/assessment/submit', {
                assessment_id: assessmentId,
                answers: formattedAnswers,
            });

            // Celebration confetti
            try {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } catch {
                // ignore if confetti fails
            }

            // Small delay for smooth feedback transition
            setTimeout(() => {
                onNavigate('results', res.assessment_id);
            }, 1000);
        } catch (err: any) {
            setError(err.message || 'Failed to submit assessment. Please try again.');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
                <p className="text-sm font-semibold text-slate-600">
                    Loading AI Assessment questions...
                </p>
            </div>
        );
    }

    if (error && questions.length === 0) {
        return (
            <div className="max-w-md mx-auto my-16 p-6 bg-white rounded-3xl border border-red-200 text-center space-y-4 shadow-card">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
                <h3 className="font-bold text-slate-900 text-lg">Unable to Load Assessment</h3>
                <p className="text-xs text-slate-500">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-5 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 text-xs"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

            {/* Submitting Loading Overlay */}
            {submitting && (
                <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center space-y-6 animate-in fade-in">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full border-4 border-brand-400 border-t-transparent animate-spin"></div>
                        <Sparkles className="w-8 h-8 text-cyan-300 absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div className="space-y-2 max-w-sm">
                        <h3 className="text-xl font-extrabold font-sans">
                            Analyzing Your Career Profile
                        </h3>
                        <p className="text-xs text-brand-200 leading-relaxed">
                            Evaluating your interests, skills, academic match, and work preferences against 20+ specialized career paths...
                        </p>
                    </div>
                </div>
            )}

            {/* Confirmation Step: You are almost done! */}
            {isConfirmationStep ? (
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-card text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                        <Award className="w-8 h-8" />
                    </div>

                    <div className="space-y-2 max-w-md mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                            You are almost done! 🎉
                        </h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            All questions have been answered. Ready to generate your personalized career compatibility scores and skill-gap roadmap?
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 max-w-md mx-auto border border-slate-200 text-left text-xs space-y-2">
                        <p className="font-bold text-slate-700 uppercase tracking-wider">
                            Assessment Summary:
                        </p>
                        <div className="flex justify-between text-slate-600">
                            <span>Total Questions Answered:</span>
                            <span className="font-bold text-slate-900">{questions.length} / {questions.length}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Aptitude Dimensions:</span>
                            <span className="font-bold text-slate-900">Analytical, Creative, Communication, Leadership, Technical, Research</span>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-left">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-4 pt-2">
                        <button
                            onClick={handlePrev}
                            className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-sm flex items-center gap-1.5"
                        >
                            <ArrowLeft className="w-4 h-4" /> Review Previous
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-8 py-3.5 rounded-xl font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition-all text-sm flex items-center gap-2"
                        >
                            <Sparkles className="w-4 h-4" />
                            Submit Assessment & View Results
                        </button>
                    </div>
                </div>
            ) : (
                /* Active Question Runner */
                <div className="space-y-6">

                    {/* Progress Bar */}
                    <ProgressBar
                        current={currentIndex}
                        total={questions.length}
                        category={currentQ?.category}
                    />

                    {/* Question Card */}
                    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-card space-y-6">

                        {/* Category & Weight Header */}
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                                {currentQ.category}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                                Step {currentIndex + 1} of {questions.length}
                            </span>
                        </div>

                        {/* Question Text */}
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-sans leading-snug">
                            {currentQ.question_text}
                        </h2>

                        {/* Validation Warning */}
                        {validationWarning && (
                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>{validationWarning}</span>
                            </div>
                        )}

                        {/* Question Options by Type */}
                        <div className="pt-2">

                            {/* 1. Rating Scale (1 to 5) with descriptive chips */}
                            {currentQ.question_type === 'rating' && (
                                <div className="space-y-6">
                                    {(() => {
                                        const ratingOpts = currentQ.options || {};
                                        const labels = ratingOpts.labels || ["Beginner", "Basic", "Intermediate", "Good", "Excellent"];
                                        const currentRating = answers[currentQ.id] || 3;

                                        return (
                                            <div>
                                                {/* Rating Chips Grid */}
                                                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                                                    {[1, 2, 3, 4, 5].map((val) => {
                                                        const isSelected = currentRating === val;
                                                        return (
                                                            <button
                                                                key={val}
                                                                type="button"
                                                                onClick={() => handleRatingSelect(val)}
                                                                className={`p-3 sm:p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${isSelected
                                                                        ? 'bg-gradient-to-tr from-brand-600 to-accent-indigo text-white border-transparent shadow-md scale-105'
                                                                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                                                    }`}
                                                            >
                                                                <span className="text-lg sm:text-xl font-black">{val}</span>
                                                                <span className={`text-[10px] sm:text-xs font-semibold line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                                                                    {labels[val - 1]}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Slider fallback for accessibility */}
                                                <div className="mt-6 px-2">
                                                    <input
                                                        type="range"
                                                        min="1"
                                                        max="5"
                                                        step="1"
                                                        value={currentRating}
                                                        onChange={(e) => handleRatingSelect(Number(e.target.value))}
                                                        className="w-full accent-brand-600 cursor-pointer"
                                                    />
                                                    <div className="flex justify-between text-[11px] text-slate-400 font-bold mt-1">
                                                        <span>1 — Beginner</span>
                                                        <span>3 — Intermediate</span>
                                                        <span>5 — Excellent</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* 2. Single Choice (Radio List) */}
                            {(currentQ.question_type === 'single_choice' || currentQ.question_type === 'scenario') && (
                                <div className="space-y-2.5">
                                    {(Array.isArray(currentQ.options) ? currentQ.options : []).map((opt: string, idx: number) => {
                                        const isSelected = answers[currentQ.id] === opt;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => handleSingleSelect(opt)}
                                                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${isSelected
                                                        ? 'bg-brand-50/70 border-brand-500 text-brand-900 font-semibold shadow-xs'
                                                        : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200 text-slate-700'
                                                    }`}
                                            >
                                                <span className="text-xs sm:text-sm">{opt}</span>
                                                <div
                                                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isSelected
                                                            ? 'bg-brand-600 border-brand-600 text-white'
                                                            : 'border-slate-300 bg-white'
                                                        }`}
                                                >
                                                    {isSelected && <Check className="w-3.5 h-3.5" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* 3. Multi Choice (Checkboxes) */}
                            {currentQ.question_type === 'multi_choice' && (
                                <div className="space-y-2">
                                    <p className="text-[11px] text-slate-500 font-medium mb-2">
                                        (Select all that naturally appeal to you)
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {(Array.isArray(currentQ.options) ? currentQ.options : []).map((opt: string, idx: number) => {
                                            const currentSelected: string[] = answers[currentQ.id] || [];
                                            const isSelected = currentSelected.includes(opt);
                                            return (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => handleMultiSelect(opt)}
                                                    className={`text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-2 ${isSelected
                                                            ? 'bg-brand-50/80 border-brand-500 text-brand-900 font-semibold'
                                                            : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200 text-slate-700'
                                                        }`}
                                                >
                                                    <span className="text-xs sm:text-sm">{opt}</span>
                                                    <div
                                                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${isSelected
                                                                ? 'bg-brand-600 border-brand-600 text-white'
                                                                : 'border-slate-300 bg-white'
                                                            }`}
                                                    >
                                                        {isSelected && <Check className="w-3.5 h-3.5" />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Navigation Footer */}
                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1.5"
                            >
                                <ArrowLeft className="w-4 h-4" /> Previous
                            </button>

                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 hover:shadow transition-all flex items-center gap-1.5"
                            >
                                {isLastQuestion ? 'Review & Finish' : 'Next Question'}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};
