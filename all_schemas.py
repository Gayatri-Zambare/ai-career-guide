from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field

# User & Auth Schemas
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=6)
    age: Optional[int] = Field(None, ge=12, le=99)
    education_level: Optional[str] = "Undergraduate"
    current_class_year: Optional[str] = None
    stream: Optional[str] = "Science"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    education_level: Optional[str] = None
    current_class_year: Optional[str] = None
    stream: Optional[str] = None
    percentage: Optional[float] = None
    math_score: Optional[float] = None
    science_score: Optional[float] = None
    cs_score: Optional[float] = None
    english_score: Optional[float] = None
    commerce_score: Optional[float] = None
    goals: Optional[str] = None

class StudentProfileOut(BaseModel):
    id: int
    user_id: int
    name: str
    email: str
    role: str
    age: Optional[int] = None
    education_level: Optional[str] = None
    current_class_year: Optional[str] = None
    stream: Optional[str] = None
    percentage: Optional[float] = None
    math_score: Optional[float] = None
    science_score: Optional[float] = None
    cs_score: Optional[float] = None
    english_score: Optional[float] = None
    commerce_score: Optional[float] = None
    goals: Optional[str] = None
    profile_completion_pct: int = 0
    assessment_status: str = "Not Started"
    latest_assessment_id: Optional[int] = None

# Question Schemas
class QuestionOut(BaseModel):
    id: int
    category: str
    question_text: str
    question_type: str
    options: Any
    weight: float
    order_index: int

class QuestionCreate(BaseModel):
    category: str
    question_text: str
    question_type: str
    options: Optional[Any] = None
    weight: float = 1.0
    order_index: int = 0

class QuestionUpdate(BaseModel):
    category: Optional[str] = None
    question_text: Optional[str] = None
    question_type: Optional[str] = None
    options: Optional[Any] = None
    weight: Optional[float] = None
    order_index: Optional[int] = None

# Career Schemas
class RoadmapStep(BaseModel):
    step: int
    title: str
    description: str

class CourseItem(BaseModel):
    name: str
    platform: str
    level: str

class CareerOut(BaseModel):
    id: int
    name: str
    category: str
    description: str
    education: str
    skills: List[str]
    beginner_skills: List[str] = []
    advanced_skills: List[str] = []
    interests: List[str]
    work_style: List[str] = []
    roadmap: List[Dict[str, Any]] = []
    related_courses: List[Dict[str, Any]] = []
    related_job_roles: List[str] = []
    responsibilities: List[str] = []

class CareerCreate(BaseModel):
    name: str
    category: str
    description: str
    education: str
    skills: List[str]
    beginner_skills: Optional[List[str]] = []
    advanced_skills: Optional[List[str]] = []
    interests: List[str]
    work_style: Optional[List[str]] = []
    roadmap: Optional[List[Dict[str, Any]]] = []
    related_courses: Optional[List[Dict[str, Any]]] = []
    related_job_roles: Optional[List[str]] = []
    responsibilities: Optional[List[str]] = []

class CareerUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    education: Optional[str] = None
    skills: Optional[List[str]] = None
    beginner_skills: Optional[List[str]] = None
    advanced_skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    work_style: Optional[List[str]] = None
    roadmap: Optional[List[Dict[str, Any]]] = None
    related_courses: Optional[List[Dict[str, Any]]] = None
    related_job_roles: Optional[List[str]] = None
    responsibilities: Optional[List[str]] = None

# Assessment & Recommendation Schemas
class AnswerItem(BaseModel):
    question_id: int
    answer: Any  # string, int, list of strings

class AssessmentStartResponse(BaseModel):
    assessment_id: int
    student_id: int
    message: str

class AssessmentSubmitRequest(BaseModel):
    assessment_id: int
    answers: List[AnswerItem]

class RecommendationOut(BaseModel):
    id: int
    career_id: int
    career: CareerOut
    compatibility_score: float
    interest_score: float
    skill_score: float
    academic_score: float
    personality_score: float
    goal_score: float
    matched_factors: List[str]
    growth_areas: List[str]
    explanation: str

class AssessmentResultOut(BaseModel):
    assessment_id: int
    completed_at: str
    profile_summary: Dict[str, float]
    recommendations: List[RecommendationOut]

class AssessmentHistoryItem(BaseModel):
    assessment_id: int
    completed_at: str
    top_career: str
    compatibility_score: float
    category: str
    total_recommendations: int

# Chat Schemas
class ChatRequest(BaseModel):
    message: str
    assessment_id: Optional[int] = None

class ChatResponse(BaseModel):
    reply: str
    suggestions: List[str] = []
    disclaimer: str = "This advice is generated as guidance based on your profile and not a guaranteed outcome."
