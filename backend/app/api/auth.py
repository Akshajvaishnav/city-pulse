from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import LoginRequest, TokenResponse
from ..config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate Municipal Admin / Inspector credentials.
    Demo credentials:
    Username: admin@smartcity.gov
    Password: cityadmin2026
    """
    user = db.query(User).filter(User.username == request.username).first()
    
    # Simple check for demo (support both configured password or plain dev pass)
    if not user or (user.hashed_password != request.password and request.password != settings.ADMIN_PASSWORD):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Use demo: admin@smartcity.gov / cityadmin2026"
        )
    
    # Return simulated bearer token with user profile
    return TokenResponse(
        access_token=f"smartcity-jwt-token-{user.id}-{int(datetime.utcnow().timestamp())}",
        token_type="bearer",
        user={
            "id": user.id,
            "username": user.username,
            "full_name": user.full_name,
            "role": user.role
        }
    )

@router.get("/me")
def get_current_user():
    return {
        "username": settings.ADMIN_USERNAME,
        "full_name": "Municipal Admin",
        "role": "admin",
        "jurisdiction": "Smart City Central Command"
    }
