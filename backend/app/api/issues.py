from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import (
    IssueCreate,
    IssueResponse,
    IssueStatusUpdate,
    IssueUpdate,
    IssueMapItem
)
from ..services import issue_service

router = APIRouter(prefix="/issues", tags=["Infrastructure Issues"])

@router.post("", response_model=IssueResponse, status_code=status.HTTP_201_CREATED)
def create_new_issue(
    issue_in: IssueCreate,
    db: Session = Depends(get_db)
):
    """
    Submit and register a new infrastructure defect report.
    Automatically assigns a unique sequential Report ID (e.g. SC-2026-00125)
    and initializes status history.
    """
    try:
        new_issue = issue_service.create_issue(db, issue_in)
        return new_issue
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit issue: {str(e)}")

@router.get("", response_model=List[IssueResponse])
def list_issues(
    city: Optional[str] = Query(None, description="Filter by city: Gurugram, Delhi, Noida, Bengaluru, Bhubaneswar"),
    defect_type: Optional[str] = Query(None, description="Filter by defect type"),
    severity: Optional[str] = Query(None, description="Filter by severity: High, Medium, Low"),
    status: Optional[str] = Query(None, description="Filter by status: Pending, Verified, In Progress, Resolved, Rejected"),
    search: Optional[str] = Query(None, description="Search term for location, ID, or description"),
    skip: int = Query(0, ge=0),
    limit: int = Query(200, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """
    List infrastructure defect reports with filtering, searching, and pagination.
    """
    return issue_service.get_issues(
        db=db,
        city=city,
        defect_type=defect_type,
        severity=severity,
        status=status,
        search=search,
        skip=skip,
        limit=limit
    )

@router.get("/map", response_model=List[IssueMapItem])
def get_map_markers(
    city: Optional[str] = Query(None, description="Filter by city"),
    db: Session = Depends(get_db)
):
    """
    Lightweight coordinates and metadata endpoint for interactive Leaflet map rendering.
    """
    issues = issue_service.get_issues(db, city=city, limit=500)
    return [
        IssueMapItem(
            id=i.id,
            report_id=i.report_id,
            defect_type=i.defect_type,
            city=i.city or "Gurugram",
            latitude=i.latitude,
            longitude=i.longitude,
            location_name=i.location_name,
            severity=i.severity,
            confidence=i.confidence,
            status=i.status,
            image_url=i.image_url,
            description=i.description,
            created_at=i.created_at
        )
        for i in issues
    ]

@router.get("/{id}", response_model=IssueResponse)
def get_issue_details(id: int, db: Session = Depends(get_db)):
    """
    Retrieve full details of an issue including chronological status transition timeline.
    """
    issue = issue_service.get_issue_by_id(db, id)
    if not issue:
        raise HTTPException(status_code=404, detail="Infrastructure issue report not found.")
    return issue

@router.put("/{id}/status", response_model=IssueResponse)
def update_status(
    id: int,
    status_in: IssueStatusUpdate,
    db: Session = Depends(get_db)
):
    """
    Admin action to transition issue workflow status
    (Pending -> Verified -> In Progress -> Resolved / Rejected).
    Records audit entry in StatusHistory.
    """
    valid_statuses = {"Pending", "Verified", "In Progress", "Resolved", "Rejected"}
    if status_in.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{status_in.status}'. Allowed: {', '.join(valid_statuses)}"
        )
    
    updated_issue = issue_service.update_issue_status(db, id, status_in)
    if not updated_issue:
        raise HTTPException(status_code=404, detail="Infrastructure issue report not found.")
    return updated_issue

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_issue(id: int, db: Session = Depends(get_db)):
    """
    Delete an infrastructure issue from the registry.
    """
    success = issue_service.delete_issue(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Infrastructure issue report not found.")
    return None
