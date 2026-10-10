from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class InfrastructureIssue(Base):
    __tablename__ = "infrastructure_issues"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String(50), unique=True, index=True, nullable=False)
    defect_type = Column(String(50), nullable=False, index=True)  # Pothole, Road Damage, Broken Street Light, Garbage Overflow, Damaged Sign, Water Leakage
    image_url = Column(String(500), nullable=False)
    annotated_image_url = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_name = Column(String(255), nullable=False)
    city = Column(String(50), nullable=False, default="Gurugram", index=True)  # Gurugram, Delhi, Noida, Bengaluru, Bhubaneswar
    severity = Column(String(20), nullable=False, default="Medium")  # High, Medium, Low
    confidence = Column(Float, nullable=False, default=0.85)  # 0.0 - 1.0 (or percentage)
    status = Column(String(30), nullable=False, default="Pending")  # Pending, Verified, In Progress, Resolved, Rejected
    reported_by = Column(String(100), nullable=False, default="Anonymous Citizen")
    reporter_contact = Column(String(100), nullable=True)
    ai_detected = Column(Boolean, default=True)
    bounding_boxes_json = Column(Text, nullable=True)  # JSON string of detected bounding boxes
    resolution_notes = Column(Text, nullable=True)
    upvotes = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    history = relationship("StatusHistory", back_populates="issue", cascade="all, delete-orphan", order_by="StatusHistory.timestamp.desc()")
    comments = relationship("IssueComment", back_populates="issue", cascade="all, delete-orphan", order_by="IssueComment.created_at.asc()")
    work_order = relationship("WorkOrder", back_populates="issue", uselist=False, cascade="all, delete-orphan")


class IssueComment(Base):
    __tablename__ = "issue_comments"

    id = Column(Integer, primary_key=True, index=True)
    issue_id = Column(Integer, ForeignKey("infrastructure_issues.id", ondelete="CASCADE"), nullable=False)
    author_name = Column(String(100), nullable=False, default="Concerned Citizen")
    is_official = Column(Boolean, default=False)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    issue = relationship("InfrastructureIssue", back_populates="comments")


class WorkOrder(Base):
    __tablename__ = "work_orders"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(50), unique=True, index=True, nullable=False)
    issue_id = Column(Integer, ForeignKey("infrastructure_issues.id", ondelete="CASCADE"), nullable=False)
    crew_assigned = Column(String(100), nullable=False)
    priority = Column(String(20), nullable=False, default="High")  # Urgent, High, Medium, Low
    estimated_cost = Column(Float, nullable=False, default=15000.0)
    estimated_completion_days = Column(Integer, nullable=False, default=3)
    equipment_required = Column(String(255), nullable=True)
    work_status = Column(String(30), nullable=False, default="Assigned")  # Assigned, In Progress, Review, Completed
    scheduled_date = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    issue = relationship("InfrastructureIssue", back_populates="work_order")


class CityAlert(Base):
    __tablename__ = "city_alerts"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String(50), nullable=False, index=True)
    category = Column(String(50), nullable=False)  # Weather, Road Hazard, Flood Warning, Air Quality
    level = Column(String(20), nullable=False)     # Warning, Critical, Advisory, Normal
    title = Column(String(200), nullable=False)
    detail = Column(Text, nullable=False)
    metric_value = Column(String(50), nullable=True)  # e.g. "AQI 320", "Rain 45mm/h", "Surface Temp 48°C"
    affected_zone = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class StatusHistory(Base):
    __tablename__ = "status_history"

    id = Column(Integer, primary_key=True, index=True)
    issue_id = Column(Integer, ForeignKey("infrastructure_issues.id", ondelete="CASCADE"), nullable=False)
    old_status = Column(String(30), nullable=True)
    new_status = Column(String(30), nullable=False)
    changed_by = Column(String(100), nullable=False, default="System Admin")
    notes = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    issue = relationship("InfrastructureIssue", back_populates="history")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(30), nullable=False, default="admin")  # admin, inspector, citizen
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

