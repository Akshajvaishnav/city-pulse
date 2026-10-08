import json
from datetime import datetime, timedelta
from pathlib import Path
from PIL import Image, ImageDraw
from sqlalchemy.orm import Session
from .models import InfrastructureIssue, StatusHistory, User
from .config import settings

# Multi-City Demonstration Reports
# 1. Gurugram (Primary demo city, 18+ realistic reports across key corporate and residential hubs)
# 2. Bengaluru (Established technology hub, Whitefield, Electronic City, Koramangala, Indiranagar, ORR)
# 3. Bhubaneswar (Planned growth & resilience hub, Patia, Khandagiri, Chandrasekharpur, Jayadev Vihar, Infocity)
# 4. Delhi (National capital expanse, Connaught Place, Karol Bagh, Rohini, Dwarka)
# 5. Noida (Planned gridded satellite, Sector 62, 18, 15, 44)

SAMPLE_ISSUES = [
    # === GURUGRAM (Primary Demo City - 18 Reports) ===
    {
        "report_id": "SC-2026-GGN001",
        "city": "Gurugram",
        "defect_type": "Pothole",
        "filename": "pothole_cybercity.jpg",
        "description": "Deep impact crater on Cyber City DLF Phase 2 rapid transit feeder road. Causing vehicular deceleration and rim hazard. (Demo Data)",
        "latitude": 28.4950,
        "longitude": 77.0895,
        "location_name": "Cyber City, Gateway Tower Underpass, Gurugram",
        "severity": "High",
        "confidence": 0.95,
        "status": "Pending",
        "reported_by": "Rohit Verma (Corporate Commuter)",
        "reporter_contact": "+91-9876543210",
        "boxes": [{"label": "Pothole (Grade-A)", "confidence": 0.95, "box": [0.35, 0.25, 0.72, 0.75], "color": "#EF4444"}],
        "days_ago": 0,
        "history": [{"old_status": None, "new_status": "Pending", "by": "System Registration", "notes": "AI camera detected Grade-A crater at Cyber City underpass.", "hours_ago": 3}]
    },
    {
        "report_id": "SC-2026-GGN002",
        "city": "Gurugram",
        "defect_type": "Road Damage",
        "filename": "road_crack_golfcourse.jpg",
        "description": "Substantial longitudinal pavement fracture along Golf Course Road rapid corridor near Sector 54 metro pillar. (Demo Data)",
        "latitude": 28.4385,
        "longitude": 77.1025,
        "location_name": "Golf Course Road, Sector 54 Rapid Metro, Gurugram",
        "severity": "Medium",
        "confidence": 0.91,
        "status": "In Progress",
        "reported_by": "GMDA Pavement Inspection Van",
        "reporter_contact": "gmda.inspect@gurugram.gov",
        "boxes": [{"label": "Longitudinal Crack", "confidence": 0.91, "box": [0.28, 0.15, 0.82, 0.85], "color": "#F59E0B"}],
        "days_ago": 2,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "GMDA Van", "notes": "Automated road telemetry scan.", "hours_ago": 48},
            {"old_status": "Pending", "new_status": "In Progress", "by": "Highway Maintenance", "notes": "Hot-pour crack sealant truck dispatched.", "hours_ago": 16}
        ]
    },
    {
        "report_id": "SC-2026-GGN003",
        "city": "Gurugram",
        "defect_type": "Broken Street Light",
        "filename": "light_mgroad.jpg",
        "description": "Twin high-mast streetlight pole blackout across IFFCO Chowk junction. Zero illumination on pedestrian crosswalk. (Demo Data)",
        "latitude": 28.4720,
        "longitude": 77.0725,
        "location_name": "MG Road, Near IFFCO Chowk Junction, Gurugram",
        "severity": "High",
        "confidence": 0.96,
        "status": "In Progress",
        "reported_by": "Traffic Police Ward 1",
        "reporter_contact": "traffic.ward1@gurugram.gov",
        "boxes": [{"label": "Luminaire Blackout", "confidence": 0.96, "box": [0.10, 0.35, 0.60, 0.68], "color": "#3B82F6"}],
        "days_ago": 1,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Traffic Police", "notes": "Reported safety hazard for night commuters.", "hours_ago": 24},
            {"old_status": "Pending", "new_status": "In Progress", "by": "DHBVN Power Dept", "notes": "Hydraulic lift truck assigned for driver repair.", "hours_ago": 8}
        ]
    },
    {
        "report_id": "SC-2026-GGN004",
        "city": "Gurugram",
        "defect_type": "Water Leakage",
        "filename": "water_sohnaroad.jpg",
        "description": "Subsurface municipal distribution pipe leakage causing water pooling on outer lane near Subhash Chowk. (Demo Data)",
        "latitude": 28.4280,
        "longitude": 77.0420,
        "location_name": "Sohna Road, Subhash Chowk Flyover, Gurugram",
        "severity": "High",
        "confidence": 0.93,
        "status": "Pending",
        "reported_by": "Kunal Singhania (Resident)",
        "reporter_contact": "+91-9811224488",
        "boxes": [{"label": "Water Rupture", "confidence": 0.93, "box": [0.40, 0.20, 0.85, 0.82], "color": "#06B6D4"}],
        "days_ago": 0,
        "history": [{"old_status": None, "new_status": "Pending", "by": "Resident Alert", "notes": "Leakage eroding newly laid asphalt foundation.", "hours_ago": 5}]
    },
    {
        "report_id": "SC-2026-GGN005",
        "city": "Gurugram",
        "defect_type": "Garbage Overflow",
        "filename": "garbage_sec29.jpg",
        "description": "Commercial entertainment zone waste containers overflowing onto public sidewalk along leisure valley perimeter. (Demo Data)",
        "latitude": 28.4680,
        "longitude": 77.0635,
        "location_name": "Sector 29, Leisure Valley Market, Gurugram",
        "severity": "Medium",
        "confidence": 0.92,
        "status": "Resolved",
        "reported_by": "MCG Sanitation Inspector",
        "reporter_contact": "mcg.sanitation@gurugram.gov",
        "boxes": [{"label": "Waste Accumulation", "confidence": 0.92, "box": [0.30, 0.20, 0.85, 0.80], "color": "#10B981"}],
        "days_ago": 4,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Citizen App", "notes": "Reported waste overflow.", "hours_ago": 96},
            {"old_status": "Pending", "new_status": "In Progress", "by": "EcoGreen Fleet", "notes": "Compactor truck dispatched.", "hours_ago": 48},
            {"old_status": "In Progress", "new_status": "Resolved", "by": "Sanitation Super", "notes": "Dumpster cleared and pathway sanitized.", "hours_ago": 12}
        ]
    },
    {
        "report_id": "SC-2026-GGN006",
        "city": "Gurugram",
        "defect_type": "Pothole",
        "filename": "pothole_sec14.jpg",
        "description": "Twin asphalt potholes near main market entrance road. Hazardous for two-wheelers. (Demo Data)",
        "latitude": 28.4750,
        "longitude": 77.0450,
        "location_name": "Sector 14, Main Market Road, Gurugram",
        "severity": "High",
        "confidence": 0.94,
        "status": "In Progress",
        "reported_by": "RWA Sector 14",
        "reporter_contact": "rwa.sec14@gmail.com",
        "boxes": [{"label": "Twin Potholes", "confidence": 0.94, "box": [0.35, 0.20, 0.75, 0.78], "color": "#EF4444"}],
        "days_ago": 3,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "RWA", "notes": "Requested urgent repair before school hours.", "hours_ago": 70},
            {"old_status": "Pending", "new_status": "In Progress", "by": "MCG Road Maintenance", "notes": "Patchwork cold-mix applied.", "hours_ago": 18}
        ]
    },
    {
        "report_id": "SC-2026-GGN007",
        "city": "Gurugram",
        "defect_type": "Road Damage",
        "filename": "crack_udyogvihar.jpg",
        "description": "Severe heavy-truck surface rutting and fatigue cracks along Udyog Vihar Phase 4 industrial spine. (Demo Data)",
        "latitude": 28.5020,
        "longitude": 77.0820,
        "location_name": "Udyog Vihar Phase 4, Main Spine, Gurugram",
        "severity": "Medium",
        "confidence": 0.88,
        "status": "Pending",
        "reported_by": "Industrial Logistics Officer",
        "reporter_contact": "+91-9810055221",
        "boxes": [{"label": "Rutting & Fatigue", "confidence": 0.88, "box": [0.25, 0.18, 0.80, 0.85], "color": "#F59E0B"}],
        "days_ago": 1,
        "history": [{"old_status": None, "new_status": "Pending", "by": "Logistics Patrol", "notes": "Heavy vehicle traffic causing progressive subsidence.", "hours_ago": 20}]
    },
    {
        "report_id": "SC-2026-GGN008",
        "city": "Gurugram",
        "defect_type": "Broken Street Light",
        "filename": "light_sec56.jpg",
        "description": "Non-operational smart LED luminaire pole outside Sector 56 Huda market parking. (Demo Data)",
        "latitude": 28.4310,
        "longitude": 77.1080,
        "location_name": "Sector 56, Huda Market Circle, Gurugram",
        "severity": "Low",
        "confidence": 0.90,
        "status": "Resolved",
        "reported_by": "Sector 56 Resident",
        "reporter_contact": "+91-9871144229",
        "boxes": [{"label": "Lamp Failure", "confidence": 0.90, "box": [0.12, 0.38, 0.58, 0.65], "color": "#3B82F6"}],
        "days_ago": 5,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Resident", "notes": "Dark spot in front of shops.", "hours_ago": 120},
            {"old_status": "Pending", "new_status": "Resolved", "by": "Electrical Sub-Div", "notes": "Replaced fuse and smart LED fixture.", "hours_ago": 22}
        ]
    },
    {
        "report_id": "SC-2026-GGN009",
        "city": "Gurugram",
        "defect_type": "Pothole",
        "filename": "pothole_sec57.jpg",
        "description": "Asphalt depression near Boom Plaza intersection. Surface erosion following plumbing work. (Demo Data)",
        "latitude": 28.4240,
        "longitude": 77.0980,
        "location_name": "Sector 57, Boom Plaza Junction, Gurugram",
        "severity": "High",
        "confidence": 0.93,
        "status": "In Progress",
        "reported_by": "Citizen Vikram",
        "reporter_contact": "+91-9988112233",
        "boxes": [{"label": "Pothole Cavity", "confidence": 0.93, "box": [0.38, 0.28, 0.76, 0.72], "color": "#EF4444"}],
        "days_ago": 2,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Citizen App", "notes": "Plumbing trench settled unevenly.", "hours_ago": 46},
            {"old_status": "Pending", "new_status": "In Progress", "by": "MCG Contractor", "notes": "Compaction in progress.", "hours_ago": 14}
        ]
    },
    {
        "report_id": "SC-2026-GGN010",
        "city": "Gurugram",
        "defect_type": "Garbage Overflow",
        "filename": "garbage_palamvihar.jpg",
        "description": "Secondary waste spill around community bin on Vyapar Kendra road. (Demo Data)",
        "latitude": 28.5120,
        "longitude": 77.0390,
        "location_name": "Palam Vihar, Vyapar Kendra Road, Gurugram",
        "severity": "Medium",
        "confidence": 0.91,
        "status": "Pending",
        "reported_by": "Palam Vihar Citizen Council",
        "reporter_contact": "council.pv@gmail.com",
        "boxes": [{"label": "Waste Accumulation", "confidence": 0.91, "box": [0.32, 0.22, 0.82, 0.78], "color": "#10B981"}],
        "days_ago": 1,
        "history": [{"old_status": None, "new_status": "Pending", "by": "Council", "notes": "Sanitary risk along school walking route.", "hours_ago": 16}]
    },
    {
        "report_id": "SC-2026-GGN011",
        "city": "Gurugram",
        "defect_type": "Damaged Sign",
        "filename": "sign_sec44.jpg",
        "description": "Bent directional overhead signpost near Sector 44 institutional tech park. (Demo Data)",
        "latitude": 28.4520,
        "longitude": 77.0650,
        "location_name": "Sector 44, Institutional Area Gate, Gurugram",
        "severity": "Low",
        "confidence": 0.89,
        "status": "Resolved",
        "reported_by": "Tech Park Security",
        "reporter_contact": "+91-9871100998",
        "boxes": [{"label": "Sign Deformation", "confidence": 0.89, "box": [0.15, 0.30, 0.70, 0.70], "color": "#8B5CF6"}],
        "days_ago": 4,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Security", "notes": "Delivery truck brushed signpost.", "hours_ago": 90},
            {"old_status": "Pending", "new_status": "Resolved", "by": "Road Signs Team", "notes": "Re-straightened and anchored.", "hours_ago": 30}
        ]
    },
    {
        "report_id": "SC-2026-GGN012",
        "city": "Gurugram",
        "defect_type": "Road Damage",
        "filename": "crack_sohna_elevated.jpg",
        "description": "Surface micro-cracks and expansion joint wear near Rajiv Chowk junction. (Demo Data)",
        "latitude": 28.4550,
        "longitude": 77.0310,
        "location_name": "Rajiv Chowk Flyover Approach, Sohna Road, Gurugram",
        "severity": "Medium",
        "confidence": 0.90,
        "status": "In Progress",
        "reported_by": "NHAI Bridge Inspection Unit",
        "reporter_contact": "nhai.inspection@gov.in",
        "boxes": [{"label": "Joint Wear", "confidence": 0.90, "box": [0.30, 0.20, 0.78, 0.82], "color": "#F59E0B"}],
        "days_ago": 3,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "NHAI", "notes": "Expansion joint settlement identified.", "hours_ago": 68},
            {"old_status": "Pending", "new_status": "In Progress", "by": "Bridge Engineering", "notes": "Night sealing scheduled.", "hours_ago": 24}
        ]
    },

    # === BENGALURU (Technology Hub - 6 Representative Reports) ===
    {
        "report_id": "SC-2026-BLR001",
        "city": "Bengaluru",
        "defect_type": "Road Damage",
        "filename": "crack_whitefield.jpg",
        "description": "Severe longitudinal asphalt rupture on ITPL Main Road near Hope Farm junction. High vehicular friction. (Demo Data)",
        "latitude": 12.9850,
        "longitude": 77.7400,
        "location_name": "Whitefield, ITPL Main Road Near Hope Farm, Bengaluru",
        "severity": "High",
        "confidence": 0.94,
        "status": "Pending",
        "reported_by": "Whitefield Rising Volunteer",
        "reporter_contact": "tech.commuter@blr.in",
        "boxes": [{"label": "Asphalt Rupture", "confidence": 0.94, "box": [0.28, 0.16, 0.80, 0.84], "color": "#F59E0B"}],
        "days_ago": 1,
        "history": [{"old_status": None, "new_status": "Pending", "by": "Citizen Forum", "notes": "Severe monsoon rutting on IT corridor.", "hours_ago": 18}]
    },
    {
        "report_id": "SC-2026-BLR002",
        "city": "Bengaluru",
        "defect_type": "Pothole",
        "filename": "pothole_ecity.jpg",
        "description": "Deep surface depression on Electronic City Phase 1 toll connector. Rim hazard for night tech workers. (Demo Data)",
        "latitude": 12.8450,
        "longitude": 77.6650,
        "location_name": "Electronic City Phase 1, Toll Connector, Bengaluru",
        "severity": "High",
        "confidence": 0.95,
        "status": "In Progress",
        "reported_by": "ELCITA Smart Patrol",
        "reporter_contact": "patrol@elcita.in",
        "boxes": [{"label": "Grade-A Crater", "confidence": 0.95, "box": [0.36, 0.24, 0.74, 0.76], "color": "#EF4444"}],
        "days_ago": 2,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "ELCITA Patrol", "notes": "Smart sensor vehicle flagged depression.", "hours_ago": 40},
            {"old_status": "Pending", "new_status": "In Progress", "by": "ELCITA Maintenance", "notes": "Asphalt patcher active.", "hours_ago": 12}
        ]
    },
    {
        "report_id": "SC-2026-BLR003",
        "city": "Bengaluru",
        "defect_type": "Water Leakage",
        "filename": "water_koramangala.jpg",
        "description": "BWSSB clean water pipeline fracture creating continuous localized flooding along 80 Feet Road. (Demo Data)",
        "latitude": 12.9350,
        "longitude": 77.6250,
        "location_name": "Koramangala 4th Block, 80 Feet Road, Bengaluru",
        "severity": "High",
        "confidence": 0.93,
        "status": "In Progress",
        "reported_by": "Citizen S. Nambiar",
        "reporter_contact": "+91-9845011223",
        "boxes": [{"label": "Pipeline Rupture", "confidence": 0.93, "box": [0.38, 0.22, 0.82, 0.80], "color": "#06B6D4"}],
        "days_ago": 1,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Resident Alert", "notes": "Fresh water wasting onto street.", "hours_ago": 22},
            {"old_status": "Pending", "new_status": "In Progress", "by": "BWSSB Works", "notes": "Valve isolation and repair team on-site.", "hours_ago": 6}
        ]
    },
    {
        "report_id": "SC-2026-BLR004",
        "city": "Bengaluru",
        "defect_type": "Broken Street Light",
        "filename": "light_indiranagar.jpg",
        "description": "Luminaire head detachment on 100 Feet Road pedestrian pavement. (Demo Data)",
        "latitude": 12.9780,
        "longitude": 77.6400,
        "location_name": "Indiranagar, 100 Feet Road Cross, Bengaluru",
        "severity": "Medium",
        "confidence": 0.91,
        "status": "Resolved",
        "reported_by": "Indiranagar RWA",
        "reporter_contact": "rwa.indiranagar@gmail.com",
        "boxes": [{"label": "Broken Luminaire", "confidence": 0.91, "box": [0.14, 0.36, 0.59, 0.64], "color": "#3B82F6"}],
        "days_ago": 4,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "RWA", "notes": "Dark walking lane outside metro.", "hours_ago": 90},
            {"old_status": "Pending", "new_status": "Resolved", "by": "BBMP Electrical", "notes": "Replaced with 120W LED fixture.", "hours_ago": 24}
        ]
    },
    {
        "report_id": "SC-2026-BLR005",
        "city": "Bengaluru",
        "defect_type": "Garbage Overflow",
        "filename": "garbage_yelahanka.jpg",
        "description": "Uncollected organic waste spill on Major Sandeep Unnikrishnan Road. (Demo Data)",
        "latitude": 13.1000,
        "longitude": 77.5950,
        "location_name": "Yelahanka New Town, Sector 4 Main Road, Bengaluru",
        "severity": "Medium",
        "confidence": 0.89,
        "status": "Pending",
        "reported_by": "BBMP Ward Marshal",
        "reporter_contact": "marshal.yelahanka@bbmp.gov",
        "boxes": [{"label": "Waste Overflow", "confidence": 0.89, "box": [0.28, 0.20, 0.80, 0.78], "color": "#10B981"}],
        "days_ago": 0,
        "history": [{"old_status": None, "new_status": "Pending", "by": "Marshal", "notes": "Early morning waste accumulation.", "hours_ago": 4}]
    },
    {
        "report_id": "SC-2026-BLR006",
        "city": "Bengaluru",
        "defect_type": "Pothole",
        "filename": "pothole_orr.jpg",
        "description": "Large road cavity along Bellandur Outer Ring Road bus priority lane. Severe commute delay. (Demo Data)",
        "latitude": 12.9280,
        "longitude": 77.6780,
        "location_name": "Outer Ring Road (ORR), Near Bellandur Eco-Space, Bengaluru",
        "severity": "High",
        "confidence": 0.96,
        "status": "In Progress",
        "reported_by": "ORRCA Commuter Network",
        "reporter_contact": "orrca.alerts@gmail.com",
        "boxes": [{"label": "Bus Lane Cavity", "confidence": 0.96, "box": [0.34, 0.26, 0.76, 0.74], "color": "#EF4444"}],
        "days_ago": 2,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "ORRCA", "notes": "Causes 45-min bottleneck on ring road.", "hours_ago": 44},
            {"old_status": "Pending", "new_status": "In Progress", "by": "BBMP Rapid Squad", "notes": "Quick-mix filler dispatched.", "hours_ago": 16}
        ]
    },

    # === BHUBANESWAR (Planned Growth & Resilience Hub - 6 Representative Reports) ===
    {
        "report_id": "SC-2026-BBI001",
        "city": "Bhubaneswar",
        "defect_type": "Road Damage",
        "filename": "crack_patia.jpg",
        "description": "Surface wear and alligator crack cluster along Patia KIIT Square institutional corridor. (Demo Data)",
        "latitude": 20.3550,
        "longitude": 85.8180,
        "location_name": "Patia, KIIT Square Avenue, Bhubaneswar",
        "severity": "Medium",
        "confidence": 0.92,
        "status": "Pending",
        "reported_by": "BDA Smart City Surveillance",
        "reporter_contact": "bda.patrol@bhubaneswar.me",
        "boxes": [{"label": "Surface Fatigue", "confidence": 0.92, "box": [0.28, 0.18, 0.80, 0.82], "color": "#F59E0B"}],
        "days_ago": 1,
        "history": [{"old_status": None, "new_status": "Pending", "by": "Smart Camera", "notes": "Optical detector identified asphalt cracks.", "hours_ago": 20}]
    },
    {
        "report_id": "SC-2026-BBI002",
        "city": "Bhubaneswar",
        "defect_type": "Pothole",
        "filename": "pothole_khandagiri.jpg",
        "description": "Road surface cavity near Khandagiri Caves heritage tourist approach. (Demo Data)",
        "latitude": 20.2580,
        "longitude": 85.7850,
        "location_name": "Khandagiri Square, NH-16 Heritage Approach, Bhubaneswar",
        "severity": "Medium",
        "confidence": 0.90,
        "status": "In Progress",
        "reported_by": "Tourism Development Wing",
        "reporter_contact": "tourism.bhubaneswar@gov.in",
        "boxes": [{"label": "Pothole", "confidence": 0.90, "box": [0.36, 0.28, 0.72, 0.72], "color": "#EF4444"}],
        "days_ago": 2,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Tourism Officer", "notes": "Heritage transit lane needs leveling.", "hours_ago": 42},
            {"old_status": "Pending", "new_status": "In Progress", "by": "BMC Works", "notes": "Road crew rolling cold patch.", "hours_ago": 14}
        ]
    },
    {
        "report_id": "SC-2026-BBI003",
        "city": "Bhubaneswar",
        "defect_type": "Broken Street Light",
        "filename": "light_chandrasekharpur.jpg",
        "description": "Non-functional solar-hybrid smart luminaire pole near BDA colony park. (Demo Data)",
        "latitude": 20.3250,
        "longitude": 85.8150,
        "location_name": "Chandrasekharpur, BDA Colony Sector 3, Bhubaneswar",
        "severity": "Low",
        "confidence": 0.93,
        "status": "Resolved",
        "reported_by": "BDA Resident Welfare",
        "reporter_contact": "bda.res@bhubaneswar.in",
        "boxes": [{"label": "Solar Luminaire", "confidence": 0.93, "box": [0.12, 0.35, 0.58, 0.65], "color": "#3B82F6"}],
        "days_ago": 5,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Resident", "notes": "Park border light out.", "hours_ago": 110},
            {"old_status": "Pending", "new_status": "Resolved", "by": "Smart Lighting Unit", "notes": "Battery controller replaced.", "hours_ago": 20}
        ]
    },
    {
        "report_id": "SC-2026-BBI004",
        "city": "Bhubaneswar",
        "defect_type": "Water Leakage",
        "filename": "water_jayadev_vihar.jpg",
        "description": "Drainage conduit backflow and minor valve leakage on Jayadev Vihar overpass lane. (Demo Data)",
        "latitude": 20.3000,
        "longitude": 85.8220,
        "location_name": "Jayadev Vihar Square, Flyover Approach, Bhubaneswar",
        "severity": "High",
        "confidence": 0.91,
        "status": "In Progress",
        "reported_by": "Watco Water Utility",
        "reporter_contact": "watco.service@odisha.gov.in",
        "boxes": [{"label": "Valve Leak", "confidence": 0.91, "box": [0.42, 0.24, 0.84, 0.82], "color": "#06B6D4"}],
        "days_ago": 1,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Watco Sensor", "notes": "Pressure drop alert triggered.", "hours_ago": 26},
            {"old_status": "Pending", "new_status": "In Progress", "by": "Watco Crew", "notes": "Valve gasket replacement underway.", "hours_ago": 8}
        ]
    },
    {
        "report_id": "SC-2026-BBI005",
        "city": "Bhubaneswar",
        "defect_type": "Garbage Overflow",
        "filename": "garbage_infocity.jpg",
        "description": "Overflowing segregation receptacle outside Infocity tech gateway. (Demo Data)",
        "latitude": 20.3600,
        "longitude": 85.8050,
        "location_name": "Infocity, Software Park Main Gate, Bhubaneswar",
        "severity": "Medium",
        "confidence": 0.90,
        "status": "Resolved",
        "reported_by": "Infocity Campus Manager",
        "reporter_contact": "+91-9937001122",
        "boxes": [{"label": "Recycling Spill", "confidence": 0.90, "box": [0.30, 0.22, 0.82, 0.78], "color": "#10B981"}],
        "days_ago": 3,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Campus Security", "notes": "E-waste and dry waste bin full.", "hours_ago": 72},
            {"old_status": "Pending", "new_status": "Resolved", "by": "BMC Clean Squad", "notes": "Emptied and segregated for recycling.", "hours_ago": 18}
        ]
    },
    {
        "report_id": "SC-2026-BBI006",
        "city": "Bhubaneswar",
        "defect_type": "Pothole",
        "filename": "pothole_central_bbi.jpg",
        "description": "Pothole on Janpath commercial avenue near Ram Mandir square. (Demo Data)",
        "latitude": 20.2850,
        "longitude": 85.8400,
        "location_name": "Janpath, Near Ram Mandir Square, Bhubaneswar",
        "severity": "Medium",
        "confidence": 0.92,
        "status": "Pending",
        "reported_by": "Mo Bus Route Captain",
        "reporter_contact": "mobus.captain@odisha.in",
        "boxes": [{"label": "Surface Cavity", "confidence": 0.92, "box": [0.35, 0.25, 0.74, 0.75], "color": "#EF4444"}],
        "days_ago": 0,
        "history": [{"old_status": None, "new_status": "Pending", "by": "Mo Bus Alert", "notes": "Driver reported pothole on bus lane.", "hours_ago": 5}]
    },

    # === DELHI (National Capital Expanse - 3 Reports) ===
    {
        "report_id": "SC-2026-DEL001",
        "city": "Delhi",
        "defect_type": "Water Leakage",
        "filename": "water_leak_cp.jpg",
        "description": "Underground main line leak creating continuous water gushing and road subgrade subsidence in Connaught Place. (Demo Data)",
        "latitude": 28.6315,
        "longitude": 77.2167,
        "location_name": "Connaught Place, Inner Circle Block B, Delhi",
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
        "report_id": "SC-2026-DEL002",
        "city": "Delhi",
        "defect_type": "Garbage Overflow",
        "filename": "garbage_karolbagh.jpg",
        "description": "Uncollected commercial cardboard and waste accumulation blocking half of the lane in Karol Bagh. (Demo Data)",
        "latitude": 28.6517,
        "longitude": 77.1906,
        "location_name": "Karol Bagh, Ajmal Khan Road, Delhi",
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
    },
    {
        "report_id": "SC-2026-DEL003",
        "city": "Delhi",
        "defect_type": "Broken Street Light",
        "filename": "street_light_sector15.jpg",
        "description": "High-mast public streetlight luminaire broken after storm in Sector 15 Rohini. (Demo Data)",
        "latitude": 28.7180,
        "longitude": 77.1350,
        "location_name": "Sector 15, Rohini Crossway, Delhi",
        "severity": "High",
        "confidence": 0.96,
        "status": "Resolved",
        "reported_by": "Resident Alert",
        "reporter_contact": "+91-9811223344",
        "boxes": [{"label": "Broken Luminaire", "confidence": 0.96, "box": [0.10, 0.35, 0.60, 0.68], "color": "#3B82F6"}],
        "days_ago": 4,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Resident Alert", "notes": "Reported via mobile smart app.", "hours_ago": 90},
            {"old_status": "Pending", "new_status": "Resolved", "by": "Electrical Super", "notes": "New LED fixture installed.", "hours_ago": 20}
        ]
    },

    # === NOIDA (Planned Satellite - 3 Reports) ===
    {
        "report_id": "SC-2026-NOI001",
        "city": "Noida",
        "defect_type": "Pothole",
        "filename": "pothole_sector62.jpg",
        "description": "Deep crater on outer ring road lane. Multiple vehicles experienced rim damage during evening rush hour. (Demo Data)",
        "latitude": 28.6280,
        "longitude": 77.3649,
        "location_name": "Sector 62, Expressway Junction, Noida",
        "severity": "High",
        "confidence": 0.94,
        "status": "Pending",
        "reported_by": "Rohit Verma (Citizen)",
        "reporter_contact": "+91-9876543210",
        "boxes": [{"label": "Pothole (Grade-A)", "confidence": 0.94, "box": [0.35, 0.25, 0.72, 0.75], "color": "#EF4444"}],
        "days_ago": 0,
        "history": [{"old_status": None, "new_status": "Pending", "by": "System Registration", "notes": "AI detection scan verified 94% pothole severity.", "hours_ago": 2}]
    },
    {
        "report_id": "SC-2026-NOI002",
        "city": "Noida",
        "defect_type": "Road Damage",
        "filename": "road_crack_sector18.jpg",
        "description": "Extensive structural longitudinal cracking and surface settlement along the commercial corridor. (Demo Data)",
        "latitude": 28.5708,
        "longitude": 77.3260,
        "location_name": "Sector 18, Market Avenue, Noida",
        "severity": "Medium",
        "confidence": 0.89,
        "status": "In Progress",
        "reported_by": "Priya Sharma (Inspector)",
        "reporter_contact": "priya.pwd@smartcity.gov",
        "boxes": [{"label": "Alligator Cracks", "confidence": 0.89, "box": [0.28, 0.15, 0.82, 0.85], "color": "#F59E0B"}],
        "days_ago": 3,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Inspector Priya", "notes": "Reported during ward inspection.", "hours_ago": 72},
            {"old_status": "Pending", "new_status": "In Progress", "by": "Contractor Works", "notes": "Milling and hot-mix asphalt patching started.", "hours_ago": 12}
        ]
    },
    {
        "report_id": "SC-2026-NOI003",
        "city": "Noida",
        "defect_type": "Damaged Sign",
        "filename": "sign_sector44.jpg",
        "description": "Overhead highway direction gantry bent near Sector 44 expressway exit. (Demo Data)",
        "latitude": 28.5520,
        "longitude": 77.3450,
        "location_name": "Sector 44, Expressway Toll Exit, Noida",
        "severity": "Low",
        "confidence": 0.88,
        "status": "In Progress",
        "reported_by": "Noida Authority Patrol",
        "reporter_contact": "patrol@noidaauthority.in",
        "boxes": [{"label": "Gantry Deformation", "confidence": 0.88, "box": [0.15, 0.30, 0.70, 0.70], "color": "#8B5CF6"}],
        "days_ago": 2,
        "history": [
            {"old_status": None, "new_status": "Pending", "by": "Patrol", "notes": "Gantry bent by oversized truck.", "hours_ago": 50},
            {"old_status": "Pending", "new_status": "In Progress", "by": "Signage Division", "notes": "Fabrication scheduled.", "hours_ago": 16}
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

    themes = {
        "Pothole": ((50, 45, 45), (20, 20, 20), (239, 68, 68)),
        "Road Damage": ((60, 55, 45), (30, 28, 24), (245, 158, 11)),
        "Broken Street Light": ((30, 40, 65), (15, 20, 35), (59, 130, 246)),
        "Garbage Overflow": ((35, 55, 45), (18, 30, 22), (16, 185, 129)),
        "Water Leakage": ((25, 50, 65), (12, 28, 40), (6, 182, 212)),
        "Damaged Sign": ((45, 35, 60), (24, 18, 35), (139, 92, 246))
    }
    top_col, bot_col, accent_col = themes.get(defect_type, ((40, 40, 45), (20, 20, 25), (239, 68, 68)))

    for y in range(height):
        ratio = y / height
        r = int(top_col[0] * (1 - ratio) + bot_col[0] * ratio)
        g = int(top_col[1] * (1 - ratio) + bot_col[1] * ratio)
        b = int(top_col[2] * (1 - ratio) + bot_col[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    draw.polygon([(340, 0), (460, 0), (700, height), (100, height)], fill=(45, 55, 72))
    for y_step in range(0, height, 60):
        w_dash = int(8 + (y_step / height) * 16)
        draw.rectangle([400 - w_dash//2, y_step, 400 + w_dash//2, y_step + 35], fill=(226, 232, 240))

    if defect_type in ["Pothole", "Road Damage"]:
        draw.ellipse([260, 280, 560, 480], fill=(15, 18, 25), outline=(71, 85, 105), width=4)
        draw.ellipse([290, 310, 520, 440], fill=(8, 10, 15))
        draw.line([(260, 360), (180, 390)], fill=(71, 85, 105), width=3)
        draw.line([(560, 380), (640, 410)], fill=(71, 85, 105), width=3)
    elif defect_type == "Broken Street Light":
        draw.rectangle([390, 100, 410, 550], fill=(148, 163, 184))
        draw.polygon([(360, 100), (440, 100), (410, 60), (390, 60)], fill=(203, 213, 225))
        draw.line([(370, 110), (350, 140)], fill=(239, 68, 68), width=3)
    elif defect_type == "Garbage Overflow":
        draw.rectangle([300, 260, 500, 480], fill=(71, 85, 105), outline=(100, 116, 139), width=3)
        draw.ellipse([270, 320, 530, 470], fill=(52, 211, 153), outline=(16, 185, 129), width=2)
    elif defect_type == "Water Leakage":
        draw.ellipse([220, 320, 580, 500], fill=(14, 116, 144), outline=(6, 182, 212), width=3)
        draw.ellipse([270, 360, 530, 470], fill=(6, 182, 212))

    draw.rectangle([20, 20, 450, 70], fill=(15, 23, 42))
    draw.text((35, 30), f"DEMO SIMULATION: {defect_type.upper()}", fill=(248, 250, 252))
    draw.text((35, 48), "PROTOTYPE / DEMONSTRATION DATASET", fill=(148, 163, 184))

    img.save(img_path, quality=92)

    annotated = img.copy()
    ann_draw = ImageDraw.Draw(annotated)
    ann_draw.rectangle([220, 240, 600, 510], outline=accent_col, width=4)
    ann_draw.rectangle([220, 205, 520, 240], fill=accent_col)
    ann_draw.text((230, 212), f"[AI] {defect_type} DETECTED (94%)", fill=(255, 255, 255))
    annotated.save(annotated_path, quality=92)


def seed_database(db: Session, force_reseed: bool = False):
    # Ensure default admin user exists
    admin = db.query(User).filter(User.username == settings.ADMIN_USERNAME).first()
    if not admin:
        admin_user = User(
            username=settings.ADMIN_USERNAME,
            hashed_password=settings.ADMIN_PASSWORD,
            full_name="Municipal Systems Administrator",
            role="admin",
            is_active=True
        )
        db.add(admin_user)
        db.commit()

    # If force_reseed is True, clear existing issues to populate full multi-city data
    existing_count = db.query(InfrastructureIssue).count()
    if existing_count > 0 and not force_reseed:
        # Check if Gurugram exists; if not, reseed
        has_ggn = db.query(InfrastructureIssue).filter(InfrastructureIssue.city == "Gurugram").count()
        if has_ggn >= 10:
            return

    print("Populating SmartCity Multi-City Demonstration Infrastructure Reports...")
    # Clear old issues for clean multi-city dataset
    db.query(StatusHistory).delete()
    db.query(InfrastructureIssue).delete()
    db.commit()

    for item in SAMPLE_ISSUES:
        create_sample_image(item["filename"], item["defect_type"], item["severity"], settings.UPLOAD_DIR)
        
        created_time = datetime.utcnow() - timedelta(days=item["days_ago"])
        issue = InfrastructureIssue(
            report_id=item["report_id"],
            city=item.get("city", "Gurugram"),
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
    print(f"Multi-City Seeding Complete: {len(SAMPLE_ISSUES)} reports across Gurugram, Bengaluru, Bhubaneswar, Delhi, and Noida.")
