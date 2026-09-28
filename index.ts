export interface User {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'admin';
    stream?: string;
    education_level?: string;
}

export interface StudentProfile {
    id: number;
    user_id: number;
    name: string;
    email: string;
    role: string;
    age: number | null;
    education_level: string | null;
    current_class_year: string | null;
    stream: string | null;
    percentage: number | null;
    math_score: number | null;
    science_score: number | null;
    cs_score: number | null;
    english_score: number | null;
    commerce_score: number | null;
    goals: string | null;
    profile_completion_pct: number;
    assessment_status: 'Not Started' | 'In Progress' | 'Completed';
    latest_assessment_id: number | null;
}

export interface Question {
    id: number;
    category: string;
    question_text: string;
    question_type: 'single_choice' | 'multi_choice' | 'rating' | 'scenario';
    options: any;
    weight: number;
    order_index: number;
}

export interface RoadmapStep {
    step: number;
    title: string;
    description: string;
}

export interface CourseItem {
    name: string;
    platform: string;
    level: string;
}

export interface Career {
    id: number;
    name: string;
    category: string;
    description: string;
    education: string;
    skills: string[];
    beginner_skills?: string[];
    advanced_skills?: string[];
    interests: string[];
    work_style?: string[];
    roadmap: RoadmapStep[];
    related_courses?: CourseItem[];
    related_job_roles?: string[];
    responsibilities?: string[];
    created_at?: string;
}

export interface Recommendation {
    id: number;
    career_id: number;
    career: Career;
    compatibility_score: number;
    interest_score: number;
    skill_score: number;
    academic_score: number;
    personality_score: number;
    goal_score: number;
    matched_factors: string[];
    growth_areas: string[];
    explanation: string;
}

export interface AssessmentResult {
    assessment_id: number;
    completed_at: string;
    profile_summary: Record<string, number>;
    recommendations: Recommendation[];
}

export interface AssessmentHistoryItem {
    assessment_id: number;
    completed_at: string;
    top_career: string;
    compatibility_score: number;
    category: string;
    total_recommendations: number;
}

export interface SkillGapItem {
    skill: string;
    rating?: number;
    status?: string;
    importance?: string;
    recommendation?: string;
}

export interface CareerSkillGap {
    career_name: string;
    you_have: SkillGapItem[];
    you_should_improve: SkillGapItem[];
}

export interface SkillItem {
    id: number;
    name: string;
    category: string;
    rating: number;
}
