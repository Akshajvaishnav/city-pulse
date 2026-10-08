import json
from datetime import datetime, timedelta
from pathlib import Path
from PIL import Image, ImageDraw
from sqlalchemy.orm import Session
from .models import InfrastructureIssue, StatusHistory, User
from .config import settings

SAMPLE_ISSUES = [
    {
        "report_id": "SC-2026-00101",
        "defect_type": "Pothole",
        "filename": "pothole_sector62.jpg",
        "description": "Deep crater on outer ring road lane. Multiple vehicles experienced rim damage during evening rush hour.",
        "latitude": 28.6280,
        "longitude": 77.3649,
        "location_name": "Sector 62, Expressway Junction",
        "severity": "High",
        "confidence": 0.94,
        "status": "Pending",
        "reported_by": "Rohit Verma (Citizen)",
        "reporter_contact": "+91-9876543210",
        "boxes": [{"label": "Pothole (Grade-A)", "confidence": 0.94, "box": [0.35, 0.25, 0.72, 0.75], "color": "#EF4444"}],
        "days_ago": 0,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "System Registration", "notes": "AI detection scan verified 94% pothole severity.", "hours_ago": 2}
        ]
    },
    {
        "report_id": "SC-2026-00102",
        "defect_type": "Road Damage",
        "filename": "road_crack_sector18.jpg",
        "description": "Extensive structural longitudinal cracking and surface settlement along the commercial corridor.",
        "latitude": 28.5708,
        "longitude": 77.3260,
        "location_name": "Sector 18, Market Avenue",
        "severity": "Medium",
        "confidence": 0.89,
        "status": "In Progress",
        "reported_by": "Priya Sharma (Inspector)",
        "reporter_contact": "priya.pwd@smartcity.gov",
        "boxes": [{"label": "Alligator Cracks", "confidence": 0.89, "box": [0.28, 0.15, 0.82, 0.85], "color": "#F59E0B"}],
        "days_ago": 3,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Inspector Priya", "notes": "Reported during ward inspection.", "hours_ago": 72},
            {"old_status": "Pending", "new_status": "Verified", "by": "Chief Engineer", "notes": "Assigned road rehabilitation crew.", "hours_ago": 48},
            {"old_status": "Verified", "new_status": "In Progress", "by": "Contractor Works", "notes": "Milling and hot-mix asphalt patching started.", "hours_ago": 12}
        ]
    },
    {
        "report_id": "SC-2026-00103",
        "defect_type": "Broken Street Light",
        "filename": "street_light_sector15.jpg",
        "description": "High-mast public streetlight luminaire broken and shorted after storm. Zero illumination on pedestrian crosswalk.",
        "latitude": 28.7180,
        "longitude": 77.1350,
        "location_name": "Sector 15, Crossway Boulevard",
        "severity": "High",
        "confidence": 0.96,
        "status": "Resolved",
        "reported_by": "Amitabh Sen (Resident)",
        "reporter_contact": "+91-9811223344",
        "boxes": [{"label": "Broken Luminaire", "confidence": 0.96, "box": [0.10, 0.35, 0.60, 0.68], "color": "#3B82F6"}],
        "days_ago": 5,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Resident Alert", "notes": "Reported via mobile smart app.", "hours_ago": 120},
            {"old_status": "Pending", "new_status": "In Progress", "by": "Electrical Dept", "notes": "Hydraulic lift and replacement LED bulb dispatched.", "hours_ago": 72},
            {"old_status": "In Progress", "new_status": "Resolved", "by": "Electrical Super", "notes": "New 150W LED fixture installed and verified live.", "hours_ago": 24}
        ]
    },
    {
        "report_id": "SC-2026-00104",
        "defect_type": "Garbage Overflow",
        "filename": "garbage_sector21.jpg",
        "description": "Municipal dump container overflowing onto pedestrian sidewalk. Organic waste scattering causing sanitary hazard.",
        "latitude": 28.5830,
        "longitude": 77.0580,
        "location_name": "Sector 21, Metro Station Gate 2",
        "severity": "Medium",
        "confidence": 0.91,
        "status": "Pending",
        "reported_by": "Kavita Rao (Commuter)",
        "reporter_contact": "+91-9922334455",
        "boxes": [{"label": "Waste Overflow", "confidence": 0.91, "box": [0.30, 0.20, 0.85, 0.80], "color": "#10B981"}],
        "days_ago": 1,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "AI Camera Trigger", "notes": "CCTV snapshot AI detector flagged 91% waste pile index.", "hours_ago": 8}
        ]
    },
    {
        "report_id": "SC-2026-00105",
        "defect_type": "Water Leakage",
        "filename": "water_leak_cp.jpg",
        "description": "Underground main line leak creating continuous water gushing and road subgrade subsidence.",
        "latitude": 28.6315,
        "longitude": 77.2167,
        "location_name": "Connaught Place, Inner Circle Block B",
        "severity": "High",
        "confidence": 0.93,
        "status": "In Progress",
        "reported_by": "Vikram Seth (Trader Assoc)",
        "reporter_contact": "+91-9711002233",
        "boxes": [{"label": "Water Rupture", "confidence": 0.93, "box": [0.40, 0.20, 0.85, 0.82], "color": "#06B6D4"}],
        "days_ago": 2,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Shopkeeper Alert", "notes": "Reported urgent flooding.", "hours_ago": 48},
            {"old_status": "Pending", "new_status": "In Progress", "by": "Delhi Jal Board", "notes": "Excavation and pipe isolation underway.", "hours_ago": 18}
        ]
    },
    {
        "report_id": "SC-2026-00106",
        "defect_type": "Damaged Sign",
        "filename": "sign_cyberhub.jpg",
        "description": "Overhead direction gantry sign bent at 45 degree angle after heavy truck collision.",
        "latitude": 28.4986,
        "longitude": 77.0878,
        "location_name": "Cyber Hub, Rapid Metro Pillar 42",
        "severity": "Low",
        "confidence": 0.88,
        "status": "In Progress",
        "reported_by": "Traffic Police Ward 4",
        "reporter_contact": "traffic.ward4@delhipolice.gov",
        "boxes": [{"label": "Damaged Sign", "confidence": 0.88, "box": [0.15, 0.30, 0.70, 0.70], "color": "#8B5CF6"}],
        "days_ago": 4,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Traffic Police", "notes": "Reported collision damage.", "hours_ago": 96},
            {"old_status": "Pending", "new_status": "In Progress", "by": "Signage Division", "notes": "Replacement frame fabrication queued.", "hours_ago": 36}
        ]
    },
    {
        "report_id": "SC-2026-00107",
        "defect_type": "Pothole",
        "filename": "pothole_indirapuram.jpg",
        "description": "Twin potholes on Kala Patthar road near residential society gate. High risk for two-wheelers.",
        "latitude": 28.6410,
        "longitude": 77.3750,
        "location_name": "Indirapuram, Kala Patthar Marg",
        "severity": "High",
        "confidence": 0.95,
        "status": "In Progress",
        "reported_by": "Sanjay Gupta",
        "reporter_contact": "+91-9899112233",
        "boxes": [{"label": "Critical Pothole", "confidence": 0.95, "box": [0.38, 0.22, 0.78, 0.80], "color": "#EF4444"}],
        "days_ago": 3,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Citizen App", "notes": "Geotagged citizen report.", "hours_ago": 70},
            {"old_status": "Pending", "new_status": "In Progress", "by": "GDA Maintenance", "notes": "Road crew filling with quick-set cold mix.", "hours_ago": 16}
        ]
    },
    {
        "report_id": "SC-2026-00108",
        "defect_type": "Garbage Overflow",
        "filename": "garbage_karolbagh.jpg",
        "description": "Uncollected commercial cardboard and waste accumulation blocking half of the lane.",
        "latitude": 28.6517,
        "longitude": 77.1906,
        "location_name": "Karol Bagh, Ajmal Khan Road",
        "severity": "Medium",
        "confidence": 0.90,
        "status": "Resolved",
        "reported_by": "MCD Sanitation Inspector",
        "reporter_contact": "mcd.sanitation@delhi.gov",
        "boxes": [{"label": "Waste Accumulation", "confidence": 0.90, "box": [0.25, 0.20, 0.80, 0.75], "color": "#10B981"}],
        "days_ago": 6,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Sanitation App", "notes": "Identified by morning sweepers.", "hours_ago": 140},
            {"old_status": "Pending", "new_status": "In Progress", "by": "MCD Compactors", "notes": "Compactor truck dispatched.", "hours_ago": 90},
            {"old_status": "In Progress", "new_status": "Resolved", "by": "MCD Officer", "notes": "Area completely cleared, sanitized and washed.", "hours_ago": 40}
        ]
    }
]

def create_sample_image(filename: str, defect_type: str, severity: str, upload_dir: Path):
    """Generate high-quality realistic placeholder defect images with gradients & icons if not present"""
    img_path = upload_dir / filename
    annotated_path = upload_dir / f"annotated_{filename}"
    
    if img_path.exists() and annotated_path.exists():
        return

    width, height = 800, 600
    img = Image.new("RGB", (width, height), color=(30, 41, 59))
    draw = ImageDraw.Draw(img)

    # Color themes
    themes = {
        "Pothole": ((50, 45, 45), (20, 20, 20), (239, 68, 68)),
        "Road Damage": ((60, 55, 45), (30, 28, 24), (245, 158, 11)),
        "Broken Street Light": ((30, 40, 65), (15, 20, 35), (59, 130, 246)),
        "Garbage Overflow": ((35, 55, 45), (18, 30, 22), (16, 185, 129)),
        "Water Leakage": ((25, 50, 65), (12, 28, 40), (6, 182, 212)),
        "Damaged Sign": ((45, 35, 60), (24, 18, 35), (139, 92, 246))
    }
    top_col, bot_col, accent_col = themes.get(defect_type, ((40, 40, 45), (20, 20, 25), (239, 68, 68)))

    # Draw vertical gradient road backdrop
    for y in range(height):
        ratio = y / height
        r = int(top_col[0] * (1 - ratio) + bot_col[0] * ratio)
        g = int(top_col[1] * (1 - ratio) + bot_col[1] * ratio)
        b = int(top_col[2] * (1 - ratio) + bot_col[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Draw perspective road markings
    draw.polygon([(340, 0), (460, 0), (700, height), (100, height)], fill=(45, 55, 72))
    # Center dashed lane
    for y_step in range(0, height, 60):
        w_dash = int(8 + (y_step / height) * 16)
        draw.rectangle([400 - w_dash//2, y_step, 400 + w_dash//2, y_step + 35], fill=(226, 232, 240))

    # Defect visual illustration
    if defect_type in ["Pothole", "Road Damage"]:
        draw.ellipse([260, 280, 560, 480], fill=(15, 18, 25), outline=(71, 85, 105), width=4)
        draw.ellipse([290, 310, 520, 440], fill=(8, 10, 15))
        # Cracks
        draw.line([(260, 360), (180, 390)], fill=(71, 85, 105), width=3)
        draw.line([(560, 380), (640, 410)], fill=(71, 85, 105), width=3)
    elif defect_type == "Broken Street Light":
        draw.rectangle([390, 100, 410, 550], fill=(148, 163, 184))
        draw.polygon([(360, 100), (440, 100), (410, 60), (390, 60)], fill=(203, 213, 225))
        draw.line([(370, 110), (350, 140)], fill=(239, 68, 68), width=3)  # Spark
    elif defect_type == "Garbage Overflow":
        draw.rectangle([300, 260, 500, 480], fill=(71, 85, 105), outline=(100, 116, 139), width=3)
        draw.ellipse([270, 320, 530, 470], fill=(52, 211, 153), outline=(16, 185, 129), width=2)
    elif defect_type == "Water Leakage":
        draw.ellipse([220, 320, 580, 500], fill=(14, 116, 144), outline=(6, 182, 212), width=3)
        draw.ellipse([270, 360, 530, 470], fill=(6, 182, 212))

    # Stamp banner
    draw.rectangle([20, 20, 420, 70], fill=(15, 23, 42))
    draw.text((35, 30), f"SMARTCITY CCTV FEED: {defect_type.upper()}", fill=(248, 250, 252))
    draw.text((35, 48), f"LOCATION: SECTOR CAM-04 | TIME: REALTIME", fill=(148, 163, 184))

    img.save(img_path, quality=92)

    # Now make the annotated version with bounding boxes & HUD
    annotated = img.copy()
    ann_draw = ImageDraw.Draw(annotated)
    
    # Draw HUD bounding box
    ann_draw.rectangle([220, 240, 600, 510], outline=accent_col, width=4)
    # Banner label
    ann_draw.rectangle([220, 205, 490, 240], fill=accent_col)
    ann_draw.text((230, 212), f"[AI] {defect_type} DETECTED (94%)", fill=(255, 255, 255))
    
    annotated.save(annotated_path, quality=92)


def seed_database(db: Session):
    # Ensure default admin user exists
    admin = db.query(User).filter(User.username == settings.ADMIN_USERNAME).first()
    if not admin:
        # Simple sha256 or mock hash for dev
        admin_user = User(
            username=settings.ADMIN_USERNAME,
            hashed_password=settings.ADMIN_PASSWORD,  # plain dev password
            full_name="Municipal Systems Administrator",
            role="admin",
            is_active=True
        )
        db.add(admin_user)
        db.commit()

    # If issues already exist, do not duplicate
    if db.query(InfrastructureIssue).count() > 0:
        return

    print("Seeding SmartCity demo infrastructure issues...")
    for item in SAMPLE_ISSUES:
        create_sample_image(item["filename"], item["defect_type"], item["severity"], settings.UPLOAD_DIR)
        
        created_time = datetime.utcnow() - timedelta(days=item["days_ago"])
        issue = InfrastructureIssue(
            report_id=item["report_id"],
            defect_type=item["defect_type"],
            image_url=f"/uploads/{item['filename']}",
            annotated_image_url=f"/uploads/annotated_{item['filename']}",
            description=item["description"],
            latitude=item["latitude"],
            longitude=item["longitude"],
            location_name=item["location_name"],
            severity=item["severity"],
            confidence=item["confidence"],
            status=item["status"],
            reported_by=item["reported_by"],
            reporter_contact=item["reporter_contact"],
            ai_detected=True,
            bounding_boxes_json=json.dumps(item["boxes"]),
            created_at=created_time,
            updated_at=created_time
        )
        db.add(issue)
        db.flush()

        for h in item["history"]:
            h_time = datetime.utcnow() - timedelta(hours=h["hours_ago"])
            history_entry = StatusHistory(
                issue_id=issue.id,
                old_status=h["old_status"],
                new_status=h["new_status"],
                changed_by=h["by"],
                notes=h["notes"],
                timestamp=h_time
            )
            db.add(history_entry)

    db.commit()
    print("Seeding completed successfully!")
