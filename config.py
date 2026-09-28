import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI CareerGuide"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "ai-career-guide-super-secret-jwt-key-2026-fai")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # SQLite default, easily interchangeable with postgresql://user:pass@localhost/db
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./career_guide.db")
    
    # Optional external AI API
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    class Config:
        case_sensitive = True

settings = Settings()
