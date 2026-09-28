from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.all_models import User, StudentProfile, Recommendation, Career, Assessment
from app.schemas.all_schemas import ChatRequest, ChatResponse
from app.auth.jwt import get_current_user
from app.recommendation.chat_assistant import AIChatAssistant

router = APIRouter(prefix="/chat", tags=["AI Chat Assistant"])

@router.post("", response_model=ChatResponse)
def chat_with_assistant(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()

    # Get recent assessment recommendations if available
    recent_recs = []
    latest_assessment = (
        db.query(Assessment)
        .filter(Assessment.student_id == current_user.id, Assessment.completed_at.isnot(None))
        .order_by(Assessment.id.desc())
        .first()
    )
    if latest_assessment:
        recent_recs = (
            db.query(Recommendation)
            .filter(Recommendation.assessment_id == latest_assessment.id)
            .order_by(Recommendation.compatibility_score.desc())
            .limit(5)
            .all()
        )

    # Fetch career catalog for reference
    all_careers = [c.to_dict() for c in db.query(Career).all()]

    result = AIChatAssistant.answer_query(
        user_message=payload.message,
        student_profile=profile,
        user_name=current_user.name,
        recent_recommendations=recent_recs,
        career_list=all_careers
    )

    return ChatResponse(
        reply=result["reply"],
        suggestions=result.get("suggestions", []),
        disclaimer=result.get("disclaimer", "")
    )
