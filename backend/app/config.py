import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

class Settings:
    PROJECT_NAME: str = "SmartCity Infrastructure Flaw Detection System"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/smartcity.db")
    
    # Uploads
    UPLOAD_DIR: Path = UPLOAD_DIR
    MAX_UPLOAD_SIZE: int = 15 * 1024 * 1024  # 15MB
    ALLOWED_EXTENSIONS: set = {".jpg", ".jpeg", ".png", ".webp"}
    
    # Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "smartcity-super-secret-jwt-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Admin Demo Credentials
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin@smartcity.gov")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "cityadmin2026")
    
    # AI Engine Settings
    AI_DETECTION_MODE: str = os.getenv("AI_DETECTION_MODE", "mock")  # "mock" or "yolo"
    YOLO_MODEL_PATH: str = os.getenv("YOLO_MODEL_PATH", "models/yolov8_infrastructure.pt")

settings = Settings()
