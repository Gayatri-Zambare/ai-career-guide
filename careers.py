from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.database.session import get_db
from app.models.all_models import Career, StudentSkill, Skill, User
from app.schemas.all_schemas import CareerOut
from app.auth.jwt import get_current_user

router = APIRouter(prefix="/careers", tags=["Careers"])

@router.get("", response_model=List[CareerOut])
def get_careers(
    search: Optional[str] = Query(None, description="Search by career name, description, or skills"),
    category: Optional[str] = Query(None, description="Filter by career category"),
    db: Session = Depends(get_db)
):
    query = db.query(Career)
    if category and category.lower() != "all":
        query = query.filter(Career.category.ilike(f"%{category}%"))
    
    careers = query.order_by(Career.name.asc()).all()
    results = [c.to_dict() for c in careers]

    if search and search.strip():
        term = search.lower().strip()
        filtered = []
        for c in results:
            if (term in c["name"].lower() or 
                term in c["description"].lower() or 
                any(term in s.lower() for s in c["skills"]) or
                any(term in i.lower() for i in c["interests"])):
                filtered.append(c)
        results = filtered

    return results

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Career.category).distinct().all()
    return [c[0] for c in categories if c[0]]

@router.get("/{career_id}", response_model=CareerOut)
def get_career_by_id(career_id: int, db: Session = Depends(get_db)):
    career = db.query(Career).filter(Career.id == career_id).first()
    if not career:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career path not found."
        )
    return career.to_dict()

@router.get("/{career_id}/skill-gap")
def get_career_skill_gap(
    career_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    career = db.query(Career).filter(Career.id == career_id).first()
    if not career:
        raise HTTPException(status_code=404, detail="Career not found.")

    career_dict = career.to_dict()
    required_skills = career_dict.get("skills", [])
    beginner_skills = career_dict.get("beginner_skills", [])

    # Fetch student's ratings
    student_skills = (
        db.query(Skill.name, StudentSkill.rating)
        .join(StudentSkill, Skill.id == StudentSkill.skill_id)
        .filter(StudentSkill.student_id == current_user.id)
        .all()
    )
    user_skills_map = {name.lower(): rating for name, rating in student_skills}

    you_have = []
    you_should_improve = []

    for s in required_skills:
        rating = next((r for name, r in user_skills_map.items() if s.lower() in name or name in s.lower()), None)
        if rating is not None and rating >= 4:
            you_have.append({"skill": s, "rating": rating, "status": "Proficient"})
        elif rating is not None and rating == 3:
            you_have.append({"skill": s, "rating": rating, "status": "Intermediate"})
        else:
            you_should_improve.append({
                "skill": s,
                "rating": rating or 2,
                "importance": "High Priority",
                "recommendation": f"Focus on core {s} practice and project applications."
            })

    for bs in beginner_skills:
        if not any(bs.lower() in item["skill"].lower() for item in you_have + you_should_improve):
            you_should_improve.append({
                "skill": bs,
                "rating": 2,
                "importance": "Foundational",
                "recommendation": f"Recommended stepping stone for {career.name}."
            })

    return {
        "career_name": career.name,
        "you_have": you_have,
        "you_should_improve": you_should_improve
    }
