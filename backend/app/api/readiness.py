from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import ReadinessComparisonResponse, CalculateReadinessRequest
from ..services.readiness_service import FutureReadinessService
from ..services.issue_service import get_city_flaw_counts

router = APIRouter(prefix="/readiness", tags=["Future City Readiness"])

@router.get("", response_model=ReadinessComparisonResponse)
def get_future_readiness_overview(
    scenario: str = Query("current_trend", description="conservative, current_trend, accelerated"),
    db: Session = Depends(get_db)
):
    """
    Evaluates multi-city future readiness scores and 2026 -> 2070 scenario projections
    across 6 core pillars:
    - Infrastructure Health (25%)
    - Sustainability (20%)
    - Mobility (15%)
    - Technology Readiness (15%)
    - Climate Resilience (15%)
    - Urban Planning (10%)
    """
    db_flaw_counts = get_city_flaw_counts(db)
    return FutureReadinessService.get_readiness_comparison(
        scenario=scenario,
        custom_weights=None,
        db_defect_counts=db_flaw_counts
    )

@router.post("/calculate", response_model=ReadinessComparisonResponse)
def calculate_custom_readiness(
    request: CalculateReadinessRequest,
    db: Session = Depends(get_db)
):
    """
    Enables user-driven scenario and weight experimentation:
    Dynamically recalculates all 5 cities' Future Readiness Scores and 2070 trajectories
    based on custom pillar weights and selected development scenario.
    """
    db_flaw_counts = get_city_flaw_counts(db)
    custom_weights = request.weights.model_dump() if request.weights else None

    return FutureReadinessService.get_readiness_comparison(
        scenario=request.scenario,
        custom_weights=custom_weights,
        db_defect_counts=db_flaw_counts
    )
