from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .config import settings
from .database import engine, Base, SessionLocal
from .seed_data import seed_database
from .api import detect, issues, statistics, auth, readiness, enhancements

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Intelligent Smart City Infrastructure Flaw Detection & Future City Readiness Platform",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Mount uploads directory as static route
app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")

# Include API Routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(detect.router, prefix=settings.API_PREFIX)
app.include_router(issues.router, prefix=settings.API_PREFIX)
app.include_router(statistics.router, prefix=settings.API_PREFIX)
app.include_router(readiness.router, prefix=settings.API_PREFIX)
app.include_router(enhancements.router, prefix=settings.API_PREFIX)


@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "endpoints": {
            "docs": "/docs",
            "detect": f"{settings.API_PREFIX}/detect",
            "issues": f"{settings.API_PREFIX}/issues",
            "statistics": f"{settings.API_PREFIX}/statistics"
        }
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SmartCity Infrastructure Flaw Detection Backend",
        "ai_engine": settings.AI_DETECTION_MODE
    }
