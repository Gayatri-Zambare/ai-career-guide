from datetime import datetime
import json
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="student")  # 'student' or 'admin'
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="student", cascade="all, delete-orphan")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    age = Column(Integer, nullable=True)
    education_level = Column(String(80), nullable=True)  # High School, Undergraduate, etc.
    current_class_year = Column(String(80), nullable=True)  # e.g., "12th Grade", "3rd Year"
    stream = Column(String(80), nullable=True)  # Science, Commerce, Arts/Humanities, etc.
    percentage = Column(Float, nullable=True)  # CGPA or Percentage
    math_score = Column(Float, nullable=True)
    science_score = Column(Float, nullable=True)
    cs_score = Column(Float, nullable=True)
    english_score = Column(Float, nullable=True)
    commerce_score = Column(Float, nullable=True)
    goals = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), unique=True, nullable=False)
    category = Column(String(50), nullable=False)  # Technical, Soft, Analytical, Creative


class StudentSkill(Base):
    __tablename__ = "student_skills"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    rating = Column(Integer, nullable=False, default=3)  # 1 to 5


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), nullable=False)  # interests, skills, personality, academic, goals
    question_text = Column(Text, nullable=False)
    question_type = Column(String(30), nullable=False)  # single_choice, multi_choice, rating, scenario
    options = Column(Text, nullable=True)  # JSON-encoded options or rating metadata
    weight = Column(Float, default=1.0)
    order_index = Column(Integer, default=0)

    def get_options(self):
        if self.options:
            try:
                return json.loads(self.options)
            except Exception:
                return []
        return []


class Career(Base):
    __tablename__ = "careers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), unique=True, nullable=False)
    category = Column(String(80), nullable=False)  # Technology, Business, Finance, etc.
    description = Column(Text, nullable=False)
    education = Column(Text, nullable=False)
    skills = Column(Text, nullable=False)  # JSON list of primary skills
    beginner_skills = Column(Text, nullable=True)  # JSON list
    advanced_skills = Column(Text, nullable=True)  # JSON list
    interests = Column(Text, nullable=False)  # JSON list
    work_style = Column(Text, nullable=True)  # JSON list
    roadmap = Column(Text, nullable=False)  # JSON list of step objects {step, title, description}
    related_courses = Column(Text, nullable=True)  # JSON list
    related_job_roles = Column(Text, nullable=True)  # JSON list
    responsibilities = Column(Text, nullable=True)  # JSON list
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        def parse_json(val, default):
            if not val:
                return default
            try:
                return json.loads(val)
            except Exception:
                return default

        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "education": self.education,
            "skills": parse_json(self.skills, []),
            "beginner_skills": parse_json(self.beginner_skills, []),
            "advanced_skills": parse_json(self.advanced_skills, []),
            "interests": parse_json(self.interests, []),
            "work_style": parse_json(self.work_style, []),
            "roadmap": parse_json(self.roadmap, []),
            "related_courses": parse_json(self.related_courses, []),
            "related_job_roles": parse_json(self.related_job_roles, []),
            "responsibilities": parse_json(self.responsibilities, []),
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    total_score = Column(Float, nullable=True)
    profile_summary = Column(Text, nullable=True)  # JSON dict with radar scores

    student = relationship("User", back_populates="assessments")
    answers = relationship("Answer", back_populates="assessment", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="assessment", cascade="all, delete-orphan")

    def get_profile_summary(self):
        if self.profile_summary:
            try:
                return json.loads(self.profile_summary)
            except Exception:
                return {}
        return {}


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    answer = Column(Text, nullable=False)  # JSON string or plain text

    assessment = relationship("Assessment", back_populates="answers")
    question = relationship("Question")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    career_id = Column(Integer, ForeignKey("careers.id"), nullable=False)
    compatibility_score = Column(Float, nullable=False)
    interest_score = Column(Float, default=0.0)
    skill_score = Column(Float, default=0.0)
    academic_score = Column(Float, default=0.0)
    personality_score = Column(Float, default=0.0)
    goal_score = Column(Float, default=0.0)
    matched_factors = Column(Text, nullable=True)  # JSON list of strings
    growth_areas = Column(Text, nullable=True)  # JSON list of strings
    explanation = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    assessment = relationship("Assessment", back_populates="recommendations")
    career = relationship("Career")

    def to_dict(self):
        def parse_json(val, default):
            if not val:
                return default
            try:
                return json.loads(val)
            except Exception:
                return default

        return {
            "id": self.id,
            "assessment_id": self.assessment_id,
            "career_id": self.career_id,
            "career": self.career.to_dict() if self.career else None,
            "compatibility_score": round(self.compatibility_score, 1),
            "interest_score": round(self.interest_score, 1),
            "skill_score": round(self.skill_score, 1),
            "academic_score": round(self.academic_score, 1),
            "personality_score": round(self.personality_score, 1),
            "goal_score": round(self.goal_score, 1),
            "matched_factors": parse_json(self.matched_factors, []),
            "growth_areas": parse_json(self.growth_areas, []),
            "explanation": self.explanation,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
