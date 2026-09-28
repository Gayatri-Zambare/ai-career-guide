from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.all_models import User, StudentProfile
from app.schemas.all_schemas import UserRegister, UserLogin, Token
from app.auth.security import get_password_hash, verify_password
from app.auth.jwt import create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Create User
    new_user = User(
        name=user_in.name,
        email=user_in.email.lower(),
        password_hash=get_password_hash(user_in.password),
        role="student"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create associated StudentProfile
    profile = StudentProfile(
        user_id=new_user.id,
        age=user_in.age,
        education_level=user_in.education_level or "Undergraduate",
        current_class_year=user_in.current_class_year,
        stream=user_in.stream or "Science"
    )
    db.add(profile)
    db.commit()

    token = create_access_token(data={"sub": new_user.email, "role": new_user.role, "id": new_user.id})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role,
            "stream": profile.stream,
            "education_level": profile.education_level
        }
    }

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email.lower()).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please verify your credentials."
        )

    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()

    token = create_access_token(data={"sub": user.email, "role": user.role, "id": user.id})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "stream": profile.stream if profile else "Science",
            "education_level": profile.education_level if profile else "Undergraduate"
        }
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "profile": {
            "age": profile.age if profile else None,
            "education_level": profile.education_level if profile else None,
            "current_class_year": profile.current_class_year if profile else None,
            "stream": profile.stream if profile else None,
            "percentage": profile.percentage if profile else None,
            "goals": profile.goals if profile else None
        } if profile else None
    }
