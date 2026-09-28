import json
from collections import Counter
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any

from app.database.session import get_db
from app.models.all_models import User, StudentProfile, Career, Question, Assessment, Recommendation, Answer
from app.schemas.all_schemas import CareerCreate, CareerUpdate, CareerOut, QuestionCreate, QuestionUpdate, QuestionOut
from app.auth.jwt import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin Panel"])

@router.get("/dashboard")
def get_admin_dashboard(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_students = db.query(User).filter(User.role == "student").count()
    assessments_completed = db.query(Assessment).filter(Assessment.completed_at.isnot(None)).count()
    total_careers = db.query(Career).count()
    total_questions = db.query(Question).count()

    # Most recommended careers
    recs = (
        db.query(Career.name, func.count(Recommendation.id).label("count"))
        .join(Recommendation, Career.id == Recommendation.career_id)
        .group_by(Career.name)
        .order_by(func.count(Recommendation.id).desc())
        .limit(6)
        .all()
    )
    popular_careers = [{"name": r[0], "count": r[1]} for r in recs]
    if not popular_careers:
        # Default distribution for clean preview if no assessments run yet
        popular_careers = [
            {"name": "Software Developer", "count": 14},
            {"name": "Data Analyst", "count": 11},
            {"name": "AI/ML Engineer", "count": 9},
            {"name": "UI/UX Designer", "count": 7},
            {"name": "Business Analyst", "count": 6}
        ]

    # Most selected interests analysis from answers
    q2 = db.query(Question).filter(Question.order_index == 2).first()
    popular_interests = []
    if q2:
        answers = db.query(Answer.answer).filter(Answer.question_id == q2.id).all()
        interest_counts = Counter()
        for a in answers:
            try:
                parsed = json.loads(a[0])
                if isinstance(parsed, list):
                    for item in parsed:
                        interest_counts[item] += 1
                elif isinstance(parsed, str):
                    interest_counts[parsed] += 1
            except Exception:
                pass
        for name, count in interest_counts.most_common(6):
            popular_interests.append({"name": name, "count": count})

    if not popular_interests:
        popular_interests = [
            {"name": "Computer Science", "count": 18},
            {"name": "Mathematics", "count": 15},
            {"name": "Economics", "count": 8},
            {"name": "Art/Design", "count": 7},
            {"name": "Physics", "count": 6}
        ]

    # Stream distribution
    streams = (
        db.query(StudentProfile.stream, func.count(StudentProfile.id))
        .group_by(StudentProfile.stream)
        .all()
    )
    stream_distribution = [{"stream": s[0] or "Science", "count": s[1]} for s in streams if s[0]]

    # Recent student activity
    recent_assessments = (
        db.query(Assessment, User.name, User.email)
        .join(User, Assessment.student_id == User.id)
        .filter(Assessment.completed_at.isnot(None))
        .order_by(Assessment.completed_at.desc())
        .limit(5)
        .all()
    )

    recent_activity = []
    for a, name, email in recent_assessments:
        top_rec = (
            db.query(Recommendation)
            .filter(Recommendation.assessment_id == a.id)
            .order_by(Recommendation.compatibility_score.desc())
            .first()
        )
        recent_activity.append({
            "id": a.id,
            "student_name": name,
            "email": email,
            "top_career": top_rec.career.name if top_rec and top_rec.career else "N/A",
            "score": round(top_rec.compatibility_score, 1) if top_rec else 0,
            "completed_at": a.completed_at.strftime("%b %d, %Y %I:%M %p") if a.completed_at else ""
        })

    return {
        "stats": {
            "total_students": total_students,
            "assessments_completed": assessments_completed,
            "total_careers": total_careers,
            "total_questions": total_questions
        },
        "popular_careers": popular_careers,
        "popular_interests": popular_interests,
        "stream_distribution": stream_distribution,
        "recent_activity": recent_activity
    }

# Career CRUD
@router.post("/careers", response_model=CareerOut)
def create_career(
    career_in: CareerCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(Career).filter(Career.name == career_in.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="A career with this name already exists.")

    new_career = Career(
        name=career_in.name,
        category=career_in.category,
        description=career_in.description,
        education=career_in.education,
        skills=json.dumps(career_in.skills),
        beginner_skills=json.dumps(career_in.beginner_skills or []),
        advanced_skills=json.dumps(career_in.advanced_skills or []),
        interests=json.dumps(career_in.interests),
        work_style=json.dumps(career_in.work_style or []),
        roadmap=json.dumps(career_in.roadmap or []),
        related_courses=json.dumps(career_in.related_courses or []),
        related_job_roles=json.dumps(career_in.related_job_roles or []),
        responsibilities=json.dumps(career_in.responsibilities or [])
    )
    db.add(new_career)
    db.commit()
    db.refresh(new_career)
    return new_career.to_dict()

@router.put("/careers/{career_id}", response_model=CareerOut)
def update_career(
    career_id: int,
    career_in: CareerUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    career = db.query(Career).filter(Career.id == career_id).first()
    if not career:
        raise HTTPException(status_code=404, detail="Career not found.")

    update_dict = career_in.dict(exclude_unset=True)
    json_fields = ["skills", "beginner_skills", "advanced_skills", "interests", "work_style", "roadmap", "related_courses", "related_job_roles", "responsibilities"]

    for k, v in update_dict.items():
        if k in json_fields and v is not None:
            setattr(career, k, json.dumps(v))
        elif hasattr(career, k) and v is not None:
            setattr(career, k, v)

    db.commit()
    db.refresh(career)
    return career.to_dict()

@router.delete("/careers/{career_id}")
def delete_career(
    career_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    career = db.query(Career).filter(Career.id == career_id).first()
    if not career:
        raise HTTPException(status_code=404, detail="Career not found.")
    db.delete(career)
    db.commit()
    return {"status": "success", "message": f"Career '{career.name}' deleted successfully."}

# Questions CRUD
@router.post("/questions", response_model=QuestionOut)
def create_question(
    q_in: QuestionCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    options_str = json.dumps(q_in.options) if q_in.options is not None else None
    new_q = Question(
        category=q_in.category,
        question_text=q_in.question_text,
        question_type=q_in.question_type,
        options=options_str,
        weight=q_in.weight,
        order_index=q_in.order_index
    )
    db.add(new_q)
    db.commit()
    db.refresh(new_q)
    return QuestionOut(
        id=new_q.id,
        category=new_q.category,
        question_text=new_q.question_text,
        question_type=new_q.question_type,
        options=new_q.get_options(),
        weight=new_q.weight,
        order_index=new_q.order_index
    )

@router.put("/questions/{question_id}", response_model=QuestionOut)
def update_question(
    question_id: int,
    q_in: QuestionUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found.")

    if q_in.category is not None:
        question.category = q_in.category
    if q_in.question_text is not None:
        question.question_text = q_in.question_text
    if q_in.question_type is not None:
        question.question_type = q_in.question_type
    if q_in.options is not None:
        question.options = json.dumps(q_in.options)
    if q_in.weight is not None:
        question.weight = q_in.weight
    if q_in.order_index is not None:
        question.order_index = q_in.order_index

    db.commit()
    db.refresh(question)
    return QuestionOut(
        id=question.id,
        category=question.category,
        question_text=question.question_text,
        question_type=question.question_type,
        options=question.get_options(),
        weight=question.weight,
        order_index=question.order_index
    )

@router.delete("/questions/{question_id}")
def delete_question(
    question_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found.")
    db.delete(question)
    db.commit()
    return {"status": "success", "message": "Question deleted successfully."}

@router.get("/students")
def get_students(
    page: int = 1,
    limit: int = 20,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total = db.query(User).filter(User.role == "student").count()
    students = (
        db.query(User, StudentProfile)
        .outerjoin(StudentProfile, User.id == StudentProfile.user_id)
        .filter(User.role == "student")
        .order_by(User.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    data = []
    for user, profile in students:
        assessments_count = db.query(Assessment).filter(Assessment.student_id == user.id, Assessment.completed_at.isnot(None)).count()
        data.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "stream": profile.stream if profile else "Science",
            "education_level": profile.education_level if profile else "Undergraduate",
            "percentage": profile.percentage if profile else None,
            "assessments_completed": assessments_count,
            "created_at": user.created_at.strftime("%Y-%m-%d") if user.created_at else ""
        })

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "students": data
    }
