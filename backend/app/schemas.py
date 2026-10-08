from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class BoundingBox(BaseModel):
    label: str
    confidence: float
    box: List[float]  # [ymin, xmin, ymax, xmax] normalized 0.0 to 1.0 or pixel coords
    color: Optional[str] = "#ef4444"

class DetectionResponse(BaseModel):
    defect_type: str
    confidence: float
    severity: str
    detected_flaws_count: int
    bounding_boxes: List[BoundingBox]
    image_url: str
    annotated_image_url: Optional[str] = None
    suggested_description: str
    model_version: str = "SmartCity-CV-v1.4"
    is_mock: bool = True
    analysis_details: Dict[str, Any] = {}

class StatusHistoryResponse(BaseModel):
    id: int
    issue_id: int
    old_status: Optional[str] = None
    new_status: str
    changed_by: str
    notes: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class IssueCreate(BaseModel):
    defect_type: str
    image_url: str
    annotated_image_url: Optional[str] = None
    description: Optional[str] = None
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    location_name: str
    severity: str = "Medium"  # High, Medium, Low
    confidence: float = 0.85
    reported_by: Optional[str] = "Citizen Reporter"
    reporter_contact: Optional[str] = None
    ai_detected: bool = True
    bounding_boxes_json: Optional[str] = None

class IssueStatusUpdate(BaseModel):
    status: str  # Pending, Verified, In Progress, Resolved, Rejected
    changed_by: Optional[str] = "Admin Authority"
    notes: Optional[str] = None

class IssueUpdate(BaseModel):
    defect_type: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: Optional[str] = None
    resolution_notes: Optional[str] = None

class IssueResponse(BaseModel):
    id: int
    report_id: str
    defect_type: str
    image_url: str
    annotated_image_url: Optional[str] = None
    description: Optional[str] = None
    latitude: float
    longitude: float
    location_name: str
    severity: str
    confidence: float
    status: str
    reported_by: str
    reporter_contact: Optional[str] = None
    ai_detected: bool
    bounding_boxes_json: Optional[str] = None
    resolution_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    history: List[StatusHistoryResponse] = []

    class Config:
        from_attributes = True

class IssueMapItem(BaseModel):
    id: int
    report_id: str
    defect_type: str
    latitude: float
    longitude: float
    location_name: str
    severity: str
    confidence: float = 0.85
    status: str
    image_url: str
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class StatisticsResponse(BaseModel):
    total_issues: int
    pending: int
    verified: int
    in_progress: int
    resolved: int
    rejected: int
    high_priority: int
    medium_priority: int
    low_priority: int
    detected_today: int
    resolution_rate: float
    avg_resolution_time_days: float
    defect_distribution: Dict[str, int]
    severity_distribution: Dict[str, int]
    status_distribution: Dict[str, int]
    area_distribution: Dict[str, int]
    timeline_trends: List[Dict[str, Any]]
    recent_issues: List[IssueResponse]

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]
