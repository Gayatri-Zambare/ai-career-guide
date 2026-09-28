import React, { useEffect, useState } from 'react';
import {
    User, Mail, GraduationCap, BookOpen, Award, CheckCircle2,
    Sparkles, RefreshCw, AlertCircle, Save, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { SkillItem } from '../types';

interface StudentProfilePageProps {
    onNavigate: (tab: string, param?: any) => void;
}

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({ onNavigate }) => {
    const { user, profile, refreshProfile } = useAuth();

    const [name, setName] = useState(user?.name || '');
    const [age, setAge] = useState<number | ''>(profile?.age || '');
    const [educationLevel, setEducationLevel] = useState(profile?.education_level || 'Undergraduate');
    const [currentClassYear, setCurrentClassYear] = useState(profile?.current_class_year || '');
    const [stream, setStream] = useState(profile?.stream || 'Science');
    const [percentage, setPercentage] = useState<number | ''>(profile?.percentage || '');
    const [mathScore, setMathScore] = useState<number | ''>(profile?.math_score || '');
    const [scienceScore, setScienceScore] = useState<number | ''>(profile?.science_score || '');
    const [csScore, setCsScore] = useState<number | ''>(profile?.cs_score || '');
    const [englishScore, setEnglishScore] = useState<number | ''>(profile?.english_score || '');
    const [commerceScore, setCommerceScore] = useState<number | ''>(profile?.commerce_score || '');
    const [goals, setGoals] = useState(profile?.goals || '');

    const [skills, setSkills] = useState<SkillItem[]>([]);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (profile) {
            setName(user?.name || '');
            setAge(profile.age || '');
            setEducationLevel(profile.education_level || 'Undergraduate');
            setCurrentClassYear(profile.current_class_year || '');
            setStream(profile.stream || 'Science');
            setPercentage(profile.percentage || '');
            setMathScore(profile.math_score || '');
            setScienceScore(profile.science_score || '');
            setCsScore(profile.cs_score || '');
            setEnglishScore(profile.english_score || '');
            setCommerceScore(profile.commerce_score || '');
            setGoals(profile.goals || '');
        }
    }, [profile, user]);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const data = await api.get<SkillItem[]>('/student/skills');
                setSkills(data);
            } catch (err) {
                console.error('Failed to load skills:', err);
            }
        };
        fetchSkills();
    }, []);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMsg(null);
        setErrorMsg(null);

        try {
            await api.put('/student/profile', {
                name,
                age: age ? Number(age) : null,
                education_level: educationLevel,
                current_class_year: currentClassYear,
                stream,
                percentage: percentage ? Number(percentage) : null,
                math_score: mathScore ? Number(mathScore) : null,
                science_score: scienceScore ? Number(scienceScore) : null,
                cs_score: csScore ? Number(csScore) : null,
                english_score: englishScore ? Number(englishScore) : null,
                commerce_score: commerceScore ? Number(commerceScore) : null,
                goals,
            });

            // Update skills batch
            if (skills.length > 0) {
                await api.post('/student/skills', skills.map(s => ({ skill_id: s.id, rating: s.rating })));
            }

            await refreshProfile();
            setSuccessMsg('Your student profile has been saved successfully!');
            setTimeout(() => setSuccessMsg(null), 4000);
        } catch (err: any) {
            setErrorMsg(err.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleSkillRatingChange = (skillId: number, rating: number) => {
        setSkills(prev => prev.map(s => s.id === skillId ? { ...s, rating } : s));
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Header Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-purple text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
                        {name ? name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 font-sans">{name || 'Student Profile'}</h1>
                        <p className="text-xs text-slate-500">{user?.email} • {stream} Stream</p>
                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {profile?.assessment_status === 'Completed' ? 'Assessment Completed' : 'Profile Active'}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onNavigate('assessment')}
                    className="px-5 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 text-xs shadow-sm flex items-center gap-2 shrink-0"
                >
                    <Sparkles className="w-4 h-4 text-cyan-200" />
                    Retake Assessment
                </button>
            </div>

            {successMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMsg}</span>
                </div>
            )}

            {errorMsg && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Main Profile Form */}
            <form onSubmit={handleProfileSubmit} className="space-y-8">

                {/* Personal & Academic Details Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft space-y-6">
                    <h2 className="text-lg font-extrabold text-slate-900 font-sans tracking-tight border-b border-slate-100 pb-3">
                        Academic & Personal Details
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase">Age</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase">Academic Stream</label>
                            <select
                                value={stream}
                                onChange={(e) => setStream(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
                            >
                                <option value="Science">Science (PCM / PCB / CS)</option>
                                <option value="Commerce">Commerce / Business Studies</option>
                                <option value="Arts/Humanities">Arts / Humanities</option>
                                <option value="Diploma">Diploma / Polytechnic</option>
                                <option value="Undergraduate">Undergraduate Degree</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase">Education Level</label>
                            <select
                                value={educationLevel}
                                onChange={(e) => setEducationLevel(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
                            >
                                <option value="High School">High School (10th - 12th)</option>
                                <option value="Undergraduate">Undergraduate</option>
                                <option value="Postgraduate">Postgraduate</option>
                                <option value="Diploma">Diploma / Vocational</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase">Current Class / Year</label>
                            <input
                                type="text"
                                value={currentClassYear}
                                onChange={(e) => setCurrentClassYear(e.target.value)}
                                placeholder="e.g. 12th Grade or 3rd Year"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase">Overall Percentage / CGPA</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="100"
                                value={percentage}
                                onChange={(e) => setPercentage(e.target.value ? Number(e.target.value) : '')}
                                placeholder="e.g. 85.5"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Academic Subject Performance (Optional Factors) */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                        <h2 className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">
                            Subject Performances (Marks / Percentage)
                        </h2>
                        <p className="text-xs text-slate-500">
                            Helps calibrate academic match without strict filtering
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-slate-700 uppercase">Math</label>
                            <input
                                type="number"
                                value={mathScore}
                                onChange={(e) => setMathScore(e.target.value ? Number(e.target.value) : '')}
                                placeholder="e.g. 88"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-slate-700 uppercase">Science</label>
                            <input
                                type="number"
                                value={scienceScore}
                                onChange={(e) => setScienceScore(e.target.value ? Number(e.target.value) : '')}
                                placeholder="e.g. 82"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-slate-700 uppercase">Comp Sci</label>
                            <input
                                type="number"
                                value={csScore}
                                onChange={(e) => setCsScore(e.target.value ? Number(e.target.value) : '')}
                                placeholder="e.g. 90"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-slate-700 uppercase">English</label>
                            <input
                                type="number"
                                value={englishScore}
                                onChange={(e) => setEnglishScore(e.target.value ? Number(e.target.value) : '')}
                                placeholder="e.g. 80"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-slate-700 uppercase">Commerce</label>
                            <input
                                type="number"
                                value={commerceScore}
                                onChange={(e) => setCommerceScore(e.target.value ? Number(e.target.value) : '')}
                                placeholder="e.g. 75"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                            />
                        </div>
                    </div>
                </div>

                {/* Goals */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft space-y-3">
                    <h2 className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">
                        Career Aspirations & Goals
                    </h2>
                    <textarea
                        rows={3}
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                        placeholder="Share your personal career vision, desired industries, or any specific ambitions you are aiming for..."
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    />
                </div>

                {/* Skills Ratings Matrix */}
                {skills.length > 0 && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft space-y-4">
                        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">
                                    Skill Self-Assessments (1-5)
                                </h2>
                                <p className="text-xs text-slate-500">Fine-tune your ratings anytime</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {skills.map((s) => (
                                <div key={s.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-slate-800">{s.name}</span>
                                        <span className="font-extrabold text-brand-600">{s.rating}/5</span>
                                    </div>
                                    <div className="flex gap-1 justify-between">
                                        {[1, 2, 3, 4, 5].map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => handleSkillRatingChange(s.id, val)}
                                                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${s.rating === val
                                                        ? 'bg-brand-600 text-white shadow-xs'
                                                        : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                                                    }`}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 hover:shadow transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving Updates...' : 'Save Profile Changes'}
                    </button>
                </div>

            </form>

        </div>
    );
};
