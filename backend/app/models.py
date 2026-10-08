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
    severity = Column(String(20), nullable=False, default="Medium")  # High, Medium, Low
    confidence = Column(Float, nullable=False, default=0.85)  # 0.0 - 1.0 (or percentage)
    status = Column(String(30), nullable=False, default="Pending")  # Pending, Verified, In Progress, Resolved, Rejected
    reported_by = Column(String(100), nullable=False, default="Anonymous Citizen")
    reporter_contact = Column(String(100), nullable=True)
    ai_detected = Column(Boolean, default=True)
    bounding_boxes_json = Column(Text, nullable=True)  # JSON string of detected bounding boxes
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to history
    history = relationship("StatusHistory", back_populates="issue", cascade="all, delete-orphan", order_by="StatusHistory.timestamp.desc()")


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
