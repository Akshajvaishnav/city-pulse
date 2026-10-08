from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import StatisticsResponse
from ..services import issue_service

router = APIRouter(prefix="/statistics", tags=["City Analytics"])

@router.get("", response_model=StatisticsResponse)
def get_city_statistics(db: Session = Depends(get_db)):
    """
    Returns aggregated city-wide infrastructure monitoring metrics:
    - Status counts (Pending, In-Progress, Resolved)
    - Severity breakdown (High, Medium, Low)
    - Defect distribution percentages
    - Hotspot locations
    - Historical trend analytics
    """
    return issue_service.get_statistics(db)
