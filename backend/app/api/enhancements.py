from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import datetime

from ..database import get_db
from ..models import InfrastructureIssue, CityAlert, WorkOrder
from ..schemas import (
    CommentCreate,
    CommentResponse,
    WorkOrderCreate,
    WorkOrderUpdate,
    WorkOrderResponse,
    CityAlertCreate,
    CityAlertResponse,
    ChatRequest,
    ChatResponse,
    IssueResponse
)
from ..services import issue_service
from ..services.chat_service import query_llm

router = APIRouter(tags=["Municipal Enhancements & Civic Engagement"])

# ==================== CITIZEN ENGAGEMENT: UPVOTING & COMMENTS ====================

@router.post("/issues/{id}/upvote", response_model=IssueResponse)
def upvote_issue(id: int, db: Session = Depends(get_db)):
    """
    Allow citizens to upvote/endorse an infrastructure issue report to increase urgency.
    """
    issue = issue_service.upvote_issue(db, id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found.")
    return issue

@router.post("/issues/{id}/comments", response_model=CommentResponse)
def add_comment(id: int, comment_in: CommentCreate, db: Session = Depends(get_db)):
    """
    Post a citizen discussion note or municipal update to an issue report.
    """
    new_comment = issue_service.add_issue_comment(
        db, id, comment_in.author_name, comment_in.comment, comment_in.is_official
    )
    if not new_comment:
        raise HTTPException(status_code=404, detail="Issue not found.")
    return new_comment

# ==================== AI MAINTENANCE WORK ORDERS & DISPATCH ====================

@router.post("/issues/{id}/work-order", response_model=WorkOrderResponse)
def dispatch_work_order(id: int, data: WorkOrderCreate, db: Session = Depends(get_db)):
    """
    Generate or auto-assign a municipal maintenance work order to repair crews.
    """
    wo = issue_service.create_or_update_work_order(db, id, data.dict())
    if not wo:
        raise HTTPException(status_code=404, detail="Issue not found.")
    return wo

@router.patch("/work-orders/{id}", response_model=WorkOrderResponse)
def update_work_order(id: int, data: WorkOrderUpdate, db: Session = Depends(get_db)):
    """
    Update work order status, progress, cost, or assigned unit.
    """
    wo = db.query(WorkOrder).filter(WorkOrder.id == id).first()
    if not wo:
        raise HTTPException(status_code=404, detail="Work order not found.")
    for k, v in data.dict(exclude_unset=True).items():
        setattr(wo, k, v)
    db.commit()
    db.refresh(wo)
    return wo

@router.get("/work-orders", response_model=List[WorkOrderResponse])
def list_work_orders(db: Session = Depends(get_db)):
    """
    List all active municipal work orders across cities.
    """
    return db.query(WorkOrder).order_by(WorkOrder.created_at.desc()).all()

# ==================== REAL-TIME WEATHER & SENSOR ALERTS ====================

@router.get("/alerts", response_model=List[CityAlertResponse])
def get_city_alerts(city: Optional[str] = Query(None), db: Session = Depends(get_db)):
    """
    Retrieve real-time environmental sensors, waterlogging warnings, and traffic alerts.
    """
    query = db.query(CityAlert).filter(CityAlert.is_active == True)
    if city and city != "All":
        query = query.filter(CityAlert.city == city)
    alerts = query.order_by(CityAlert.created_at.desc()).all()
    
    # If no alerts in DB yet, auto-seed realistic live sensor telemetry
    if not alerts:
        default_alerts = [
            CityAlert(
                city="Gurugram",
                category="Road Surface",
                level="Warning",
                title="Pavement Thermal Strain Alert",
                detail="Surface temperature at NH-48 Sector 29 elevated to 44°C. Bitumen softness caution.",
                metric_value="44°C Surface Temp",
                affected_zone="NH-48 Corridor",
                is_active=True
            ),
            CityAlert(
                city="Gurugram",
                category="Drainage Telemetry",
                level="Critical",
                title="Sub-surface Sump Waterlogging Risk",
                detail="Drainage sensor #88 detecting 78% capacity backlog near Cyber City underpass.",
                metric_value="78% Sump Load",
                affected_zone="Cyber City DLF Phase II",
                is_active=True
            ),
            CityAlert(
                city="Bengaluru",
                category="Traffic Density",
                level="Advisory",
                title="Outer Ring Road Bottleneck Sensor",
                detail="Congestion index elevated at Bellandur junction due to pothole lane closure.",
                metric_value="Congestion 8.4/10",
                affected_zone="Bellandur Outer Ring Road",
                is_active=True
            ),
            CityAlert(
                city="Delhi",
                category="Air Quality & Dust",
                level="Warning",
                title="Particulate Sensor Spike near Construction Zone",
                detail="Anti-smog gun automated activation suggested near Ring Road redevelopment.",
                metric_value="AQI 310",
                affected_zone="Ring Road South",
                is_active=True
            ),
            CityAlert(
                city="Bhubaneswar",
                category="Storm Water Flow",
                level="Normal",
                title="Stormwater Canal Velocity Optimal",
                detail="Canal sensor telemetry confirms unobstructed gravity drain to Daya River basin.",
                metric_value="Flow 2.4 m/s",
                affected_zone="Janpath Smart Corridor",
                is_active=True
            )
        ]
        db.add_all(default_alerts)
        db.commit()
        alerts = db.query(CityAlert).filter(CityAlert.is_active == True).all()

    return alerts

# ==================== LLM SMART CITY CHATBOT ====================

@router.post("/chat", response_model=ChatResponse)
async def chat_with_city_copilot(req: ChatRequest, db: Session = Depends(get_db)):
    """
    Intelligent LLM Municipal Assistant for inquiries, issue lookup, weather alerts, and 2070 metrics.
    """
    city = req.city_context or "Gurugram"
    issues = db.query(InfrastructureIssue).filter(
        InfrastructureIssue.city == city
    ).limit(5).all()
    issues_summary = [
        {"report_id": i.report_id, "defect_type": i.defect_type, "location_name": i.location_name, "status": i.status}
        for i in issues
    ]
    
    alerts = db.query(CityAlert).filter(
        CityAlert.city == city,
        CityAlert.is_active == True
    ).limit(3).all()
    alerts_summary = [
        {"category": a.category, "level": a.level, "title": a.title, "detail": a.detail, "metric_value": a.metric_value}
        for a in alerts
    ]

    history_dicts = [{"role": m.role, "content": m.content} for m in req.conversation_history]
    
    response = await query_llm(
        message=req.message,
        history=history_dicts,
        city_context=city,
        active_issues=issues_summary,
        active_alerts=alerts_summary
    )
    return ChatResponse(**response)

# ==================== MUNICIPAL AUDIT REPORT SUITE ====================

@router.get("/reports/executive-summary")
def get_executive_report(city: Optional[str] = Query(None), db: Session = Depends(get_db)):
    """
    Generate comprehensive municipal executive report data for downloadable audit summaries.
    """
    target_city = city if (city and city != "All") else "All Cities"
    stats = issue_service.get_statistics(db, city=city)
    active_alerts = db.query(CityAlert).filter(CityAlert.is_active == True).count()
    work_orders_count = db.query(WorkOrder).count()

    return {
        "report_title": f"CityPulse Municipal Infrastructure Health & Audit Dossier ({target_city})",
        "generated_at": datetime.utcnow().isoformat(),
        "audit_period": "Q1 2026 - Real-time Assessment",
        "target_city": target_city,
        "executive_summary": (
            f"Municipal inspection systems processed {stats['total_issues']} total incidents across "
            f"{target_city}. Active resolution rate stands at {stats['resolution_rate']}%, with an average "
            f"resolution turnaround of {stats['avg_resolution_time_days']} days. {stats['high_priority']} defects "
            f"require priority dispatch. {work_orders_count} maintenance crews are actively assigned."
        ),
        "kpi_metrics": {
            "total_incidents": stats["total_issues"],
            "pending_verification": stats["pending"],
            "under_repair": stats["in_progress"],
            "resolved_defects": stats["resolved"],
            "high_severity_critical": stats["high_priority"],
            "resolution_rate_percent": stats["resolution_rate"],
            "avg_turnaround_days": stats["avg_resolution_time_days"],
            "active_iot_alerts": active_alerts,
            "dispatched_work_orders": work_orders_count
        },
        "defect_breakdown": stats["defect_distribution"],
        "severity_breakdown": stats["severity_distribution"],
        "recommendations": [
            "Prioritize deep bitumen patching along arterial cyber corridors before monsoon season.",
            "Accelerate work order sign-offs to sustain an SLA turnaround under 2.5 days.",
            "Deploy optical thermal sensors in high-density junctions showing surface temperature anomalies.",
            "Integrate citizen upvoted reports into weekly municipal council prioritization."
        ]
    }
