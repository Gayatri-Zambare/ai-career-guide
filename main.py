from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database.session import engine, Base, SessionLocal
from app.database.seed_data import seed_database
from app.routes import auth, student, assessment, careers, chat, admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and auto-seed if needed
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown logic if any

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Based Student Career Guidance System API — FAI Mini-Project",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local development and demonstration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(student.router, prefix=settings.API_V1_STR)
app.include_router(assessment.router, prefix=settings.API_V1_STR)
app.include_router(careers.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "project": "AI CareerGuide",
        "tagline": "Discover Your Strengths. Explore Your Future.",
        "status": "online",
        "documentation": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "database": "connected"}
