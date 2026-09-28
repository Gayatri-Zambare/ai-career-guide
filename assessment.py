from datetime import datetime
import json
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.all_models import (
    User, StudentProfile, Question, Career, Assessment, Answer, Recommendation, Skill, StudentSkill
)
from app.schemas.all_schemas import (
    QuestionOut, AssessmentStartResponse, AssessmentSubmitRequest,
    AssessmentResultOut, RecommendationOut, AssessmentHistoryItem
)
from app.auth.jwt import get_current_user
from app.recommendation.engine import RecommendationEngine

router = APIRouter(prefix="", tags=["Career Assessment"])

@router.get("/questions", response_model=List[QuestionOut])
def get_assessment_questions(db: Session = Depends(get_db)):
    questions = db.query(Question).order_by(Question.order_index.asc()).all()
    result = []
    for q in questions:
        result.append(QuestionOut(
            id=q.id,
            category=q.category,
            question_text=q.question_text,
            question_type=q.question_type,
            options=q.get_options(),
            weight=q.weight,
            order_index=q.order_index
        ))
    return result

@router.post("/assessment/start", response_model=AssessmentStartResponse)
def start_assessment(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_assessment = Assessment(
        student_id=current_user.id,
        started_at=datetime.utcnow()
    )
    db.add(new_assessment)
    db.commit()
    db.refresh(new_assessment)

    return {
        "assessment_id": new_assessment.id,
        "student_id": current_user.id,
        "message": "Assessment initialized successfully."
    }

@router.post("/assessment/submit", response_model=AssessmentResultOut)
def submit_assessment(
    payload: AssessmentSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessment = db.query(Assessment).filter(
        Assessment.id == payload.assessment_id,
        Assessment.student_id == current_user.id
    ).first()

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment session not found or does not belong to current user."
        )

    # 1. Save answers & gather answer dictionaries
    answers_dict = {}
    skill_ratings = {}
    structured_answers = {
        "interests": [],
        "fav_activity": "",
        "problem_style": "",
        "work_env": "",
        "self_desc": "",
        "tech_comfort": 3,
        "public_speaking": 3,
        "main_goal": "",
        "preferred_industry": "",
        "flexibility": 3,
        "entrepreneur_interest": 3
    }

    # Delete any prior answers for this assessment if retrying
    db.query(Answer).filter(Answer.assessment_id == assessment.id).delete()

    for item in payload.answers:
        raw_ans = item.answer
        ans_str = json.dumps(raw_ans) if not isinstance(raw_ans, str) else raw_ans
        db_answer = Answer(
            assessment_id=assessment.id,
            question_id=item.question_id,
            answer=ans_str
        )
        db.add(db_answer)
        answers_dict[item.question_id] = raw_ans

        # Map to questions
        question = db.query(Question).filter(Question.id == item.question_id).first()
        if question:
            opts = question.get_options()
            if question.category == "Skills" and isinstance(opts, dict) and "skill_key" in opts:
                try:
                    r_val = int(raw_ans)
                    skill_ratings[opts["skill_key"]] = r_val
                    # Also update or insert in StudentSkill table
                    skill_db = db.query(Skill).filter(Skill.name == opts["skill_key"]).first()
                    if skill_db:
                        ss = db.query(StudentSkill).filter(
                            StudentSkill.student_id == current_user.id,
                            StudentSkill.skill_id == skill_db.id
                        ).first()
                        if ss:
                            ss.rating = r_val
                        else:
                            db.add(StudentSkill(student_id=current_user.id, skill_id=skill_db.id, rating=r_val))
                except (ValueError, TypeError):
                    pass
            elif question.order_index == 1:
                structured_answers["fav_activity"] = str(raw_ans)
            elif question.order_index == 2:
                structured_answers["interests"] = raw_ans if isinstance(raw_ans, list) else [str(raw_ans)]
            elif question.order_index == 3:
                structured_answers["problem_type"] = str(raw_ans)
            elif question.order_index == 20:
                structured_answers["problem_style"] = str(raw_ans)
            elif question.order_index == 21:
                structured_answers["work_env"] = str(raw_ans)
            elif question.order_index == 22:
                structured_answers["self_desc"] = str(raw_ans)
            elif question.order_index == 23:
                try:
                    structured_answers["tech_comfort"] = int(raw_ans)
                except Exception:
                    pass
            elif question.order_index == 24:
                try:
                    structured_answers["public_speaking"] = int(raw_ans)
                except Exception:
                    pass
            elif question.order_index == 26:
                structured_answers["main_goal"] = str(raw_ans)
            elif question.order_index == 27:
                structured_answers["preferred_industry"] = str(raw_ans)
            elif question.order_index == 28:
                try:
                    structured_answers["flexibility"] = int(raw_ans)
                except Exception:
                    pass
            elif question.order_index == 29:
                try:
                    structured_answers["entrepreneur_interest"] = int(raw_ans)
                except Exception:
                    pass

    # 2. Get student profile & stream
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    stream = profile.stream if profile else "Science"

    # 3. Compute Radar Scores
    radar_summary = RecommendationEngine.calculate_profile_radar(answers_dict, profile)

    # 4. Evaluate against all Careers in database
    careers = db.query(Career).all()
    evaluated_careers = []

    for c in careers:
        eval_result = RecommendationEngine.evaluate_career_compatibility(
            career_data=c.to_dict(),
            student_answers=structured_answers,
            student_skills=skill_ratings,
            student_profile=profile,
            user_stream=stream
        )
        evaluated_careers.append((c, eval_result))

    # Sort descending by compatibility_score
    evaluated_careers.sort(key=lambda x: x[1]["compatibility_score"], reverse=True)

    # Delete previous recommendations for this assessment
    db.query(Recommendation).filter(Recommendation.assessment_id == assessment.id).delete()

    recommendations_out = []
    # Save top 5 (and can save up to 10)
    for c, ev in evaluated_careers[:10]:
        rec = Recommendation(
            assessment_id=assessment.id,
            career_id=c.id,
            compatibility_score=ev["compatibility_score"],
            interest_score=ev["interest_score"],
            skill_score=ev["skill_score"],
            academic_score=ev["academic_score"],
            personality_score=ev["personality_score"],
            goal_score=ev["goal_score"],
            matched_factors=json.dumps(ev["matched_factors"]),
            growth_areas=json.dumps(ev["growth_areas"]),
            explanation=ev["explanation"]
        )
        db.add(rec)
        db.flush()
        db.refresh(rec)

        recommendations_out.append(RecommendationOut(
            id=rec.id,
            career_id=c.id,
            career=c.to_dict(),
            compatibility_score=rec.compatibility_score,
            interest_score=rec.interest_score,
            skill_score=rec.skill_score,
            academic_score=rec.academic_score,
            personality_score=rec.personality_score,
            goal_score=rec.goal_score,
            matched_factors=ev["matched_factors"],
            growth_areas=ev["growth_areas"],
            explanation=rec.explanation
        ))

    # Update assessment record
    top_score = evaluated_careers[0][1]["compatibility_score"] if evaluated_careers else 85.0
    assessment.completed_at = datetime.utcnow()
    assessment.total_score = top_score
    assessment.profile_summary = json.dumps(radar_summary)
    db.commit()

    return {
        "assessment_id": assessment.id,
        "completed_at": assessment.completed_at.isoformat(),
        "profile_summary": radar_summary,
        "recommendations": recommendations_out[:5]
    }

@router.get("/recommendations/latest", response_model=AssessmentResultOut)
def get_latest_recommendation(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    latest_assessment = (
        db.query(Assessment)
        .filter(Assessment.student_id == current_user.id, Assessment.completed_at.isnot(None))
        .order_by(Assessment.id.desc())
        .first()
    )

    if not latest_assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No completed assessment found for this student. Please take the assessment first."
        )

    return get_recommendation_by_id(assessment_id=latest_assessment.id, current_user=current_user, db=db)

@router.get("/recommendations/{assessment_id}", response_model=AssessmentResultOut)
def get_recommendation_by_id(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found.")

    if assessment.student_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Unauthorized to view this assessment.")

    recs = (
        db.query(Recommendation)
        .filter(Recommendation.assessment_id == assessment.id)
        .order_by(Recommendation.compatibility_score.desc())
        .all()
    )

    recs_out = []
    for r in recs:
        def parse_j(val):
            try:
                return json.loads(val) if val else []
            except Exception:
                return []

        recs_out.append(RecommendationOut(
            id=r.id,
            career_id=r.career_id,
            career=r.career.to_dict() if r.career else None,
            compatibility_score=r.compatibility_score,
            interest_score=r.interest_score,
            skill_score=r.skill_score,
            academic_score=r.academic_score,
            personality_score=r.personality_score,
            goal_score=r.goal_score,
            matched_factors=parse_j(r.matched_factors),
            growth_areas=parse_j(r.growth_areas),
            explanation=r.explanation
        ))

    return {
        "assessment_id": assessment.id,
        "completed_at": assessment.completed_at.isoformat() if assessment.completed_at else datetime.utcnow().isoformat(),
        "profile_summary": assessment.get_profile_summary(),
        "recommendations": recs_out[:5]
    }

@router.get("/assessment/history", response_model=List[AssessmentHistoryItem])
def get_assessment_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessments = (
        db.query(Assessment)
        .filter(Assessment.student_id == current_user.id, Assessment.completed_at.isnot(None))
        .order_by(Assessment.id.desc())
        .all()
    )

    history = []
    for a in assessments:
        top_rec = (
            db.query(Recommendation)
            .filter(Recommendation.assessment_id == a.id)
            .order_by(Recommendation.compatibility_score.desc())
            .first()
        )
        history.append(AssessmentHistoryItem(
            assessment_id=a.id,
            completed_at=a.completed_at.strftime("%b %d, %Y %I:%M %p") if a.completed_at else "",
            top_career=top_rec.career.name if top_rec and top_rec.career else "General Match",
            compatibility_score=top_rec.compatibility_score if top_rec else 80.0,
            category=top_rec.career.category if top_rec and top_rec.career else "Technology",
            total_recommendations=db.query(Recommendation).filter(Recommendation.assessment_id == a.id).count()
        ))
    return history
