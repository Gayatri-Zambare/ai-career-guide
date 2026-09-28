from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.session import get_db
from app.models.all_models import User, StudentProfile, Skill, StudentSkill, Assessment
from app.schemas.all_schemas import ProfileUpdate, StudentProfileOut
from app.auth.jwt import get_current_user

router = APIRouter(prefix="/student", tags=["Student Profile"])

def calculate_completion(profile: StudentProfile) -> int:
    if not profile:
        return 20
    fields = [
        profile.age,
        profile.education_level,
        profile.current_class_year,
        profile.stream,
        profile.percentage,
        profile.math_score or profile.cs_score or profile.science_score,
        profile.goals
    ]
    completed = sum(1 for f in fields if f is not None and str(f).strip() != "")
    # Baseline is 30% for having account, up to 100%
    return min(100, 30 + int((completed / len(fields)) * 70))

@router.get("/profile", response_model=StudentProfileOut)
def get_student_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    # Determine assessment status
    latest_assessment = (
        db.query(Assessment)
        .filter(Assessment.student_id == current_user.id)
        .order_by(Assessment.id.desc())
        .first()
    )

    assessment_status = "Not Started"
    latest_id = None
    if latest_assessment:
        latest_id = latest_assessment.id
        if latest_assessment.completed_at:
            assessment_status = "Completed"
        else:
            assessment_status = "In Progress"

    completion_pct = calculate_completion(profile)

    return {
        "id": profile.id,
        "user_id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "age": profile.age,
        "education_level": profile.education_level,
        "current_class_year": profile.current_class_year,
        "stream": profile.stream,
        "percentage": profile.percentage,
        "math_score": profile.math_score,
        "science_score": profile.science_score,
        "cs_score": profile.cs_score,
        "english_score": profile.english_score,
        "commerce_score": profile.commerce_score,
        "goals": profile.goals,
        "profile_completion_pct": completion_pct,
        "assessment_status": assessment_status,
        "latest_assessment_id": latest_id
    }

@router.put("/profile", response_model=StudentProfileOut)
def update_student_profile(
    update_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)

    if update_data.name is not None and update_data.name.strip():
        current_user.name = update_data.name.strip()

    for attr, val in update_data.dict(exclude_unset=True).items():
        if attr != "name" and hasattr(profile, attr):
            setattr(profile, attr, val)

    db.commit()
    db.refresh(profile)
    db.refresh(current_user)

    return get_student_profile(current_user=current_user, db=db)

@router.get("/skills")
def get_student_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    all_skills = db.query(Skill).all()
    user_skills = {
        ss.skill_id: ss.rating
        for ss in db.query(StudentSkill).filter(StudentSkill.student_id == current_user.id).all()
    }

    result = []
    for s in all_skills:
        result.append({
            "id": s.id,
            "name": s.name,
            "category": s.category,
            "rating": user_skills.get(s.id, 3)  # default 3/5
        })
    return result

@router.post("/skills")
def update_student_skills(
    skills_ratings: List[Dict[str, Any]],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    for item in skills_ratings:
        s_id = item.get("skill_id")
        rating = item.get("rating", 3)
        if s_id:
            record = (
                db.query(StudentSkill)
                .filter(StudentSkill.student_id == current_user.id, StudentSkill.skill_id == s_id)
                .first()
            )
            if record:
                record.rating = rating
            else:
                db.add(StudentSkill(student_id=current_user.id, skill_id=s_id, rating=rating))
    db.commit()
    return {"status": "success", "message": "Skills updated successfully."}
