"""
Municipal Knowledge Base for Retrieval-Augmented Generation (RAG).
Contains real-time engineering standards, standard operating procedures (SOPs),
SLA guidelines, repair cost estimates, and municipal mitigation workflows.
"""

MUNICIPAL_KNOWLEDGE_DOCS = [
    {
        "id": "kb_pothole_repair_sop",
        "category": "Road Engineering",
        "keywords": ["pothole", "asphalt", "crater", "bitumen", "patch", "road damage", "fix"],
        "title": "Municipal Pothole & Road Surface Remediation Protocol (IRC:SP:100 Standards)",
        "content": (
            "Standard Operating Procedure for Potholes: "
            "1. Urgent triage: Depths > 50mm or diameters > 300mm on arterial roads are flagged High Severity with a 24-48h SLA. "
            "2. Recommended engineering repair: Square cutting around flaw perimeter, debris blow-out, tack coat emulsion (0.25 kg/m²), "
            "hot-mix or polymer-modified cold asphalt compaction using 8-10 ton vibratory roller. "
            "3. Temporary rainy/monsoon patch: Use mastic asphalt or cold bituminous patch mix with rapid curing. "
            "4. Standard crew allocation: 1 lead road supervisor, 4 crew members, 1 bitumen patch truck, vibrating tamper plate, and safety barricades. "
            "5. Average estimated cost: ₹3,500 - ₹8,000 per medium patch; ₹18,000 - ₹35,000 for deep arterial section resurfacing."
        ),
        "sla_turnaround": "24 to 48 hours for High; 72 hours for Medium",
        "recommended_crew": "Rapid Highway Response Unit A or Municipal Asphalt Patch Crew #4"
    },
    {
        "id": "kb_street_lighting_sop",
        "category": "Electrical & Public Safety",
        "keywords": ["light", "street light", "lamp", "pole", "dark", "illumination", "wire"],
        "title": "Smart City Street Light & LED Infrastructure Protocol",
        "content": (
            "Protocol for Broken or Malfunctioning Street Lights: "
            "1. Triage: Outages on primary arterial roads or intersections are prioritized for public safety and crime prevention. "
            "2. Diagnostic steps: Automated check of the Centralized Control and Monitoring System (CCMS) feeder box, "
            "photocell sensor calibration, wiring short-circuit inspection, and LED driver replacement. "
            "3. Replacement specs: Energy-efficient 90W-120W smart LED luminaire with 0-10V dimming and 4000K daylight color temp. "
            "4. SLA: Restored within 24 hours of reporting. "
            "5. Estimated cost: ₹2,200 for LED driver/sensor replacement; ₹6,500 - ₹12,000 for full pole luminaire replacement."
        ),
        "sla_turnaround": "24 hours",
        "recommended_crew": "Street Lighting & Electrical Division"
    },
    {
        "id": "kb_drainage_flood_sop",
        "category": "Stormwater & Flood Mitigation",
        "keywords": ["water", "leak", "flood", "drain", "waterlog", "sump", "sewage", "rain", "stormwater"],
        "title": "Urban Flood Prevention & Stormwater Drainage Sump SOP",
        "content": (
            "Protocol for Water Leakage, Sump Backlog, and Waterlogging: "
            "1. Sensor Alert Trigger: Sump water level exceeding 70% capacity initiates automatic high-volume submersible dewatering pumps (150 HP). "
            "2. Desilting protocol: Heavy jetting and vacuum suction machines deployed to clear silt and plastic blockages in catch basins. "
            "3. High-risk zones: Underpasses, highway depressions, and river catchment fringes (e.g. Cyber City underpass, Bellandur basin). "
            "4. SLA: Emergency de-watering within 2 hours; permanent drainage declogging within 24 hours. "
            "5. Estimated cost: ₹12,000 - ₹25,000 per de-silting and suction mobilization."
        ),
        "sla_turnaround": "2 hours emergency response; 24 hours full clearance",
        "recommended_crew": "Stormwater Drainage & Sump Squad"
    },
    {
        "id": "kb_garbage_overflow_sop",
        "category": "Solid Waste Circularity",
        "keywords": ["garbage", "trash", "overflow", "waste", "bin", "dump", "smell", "sanitation"],
        "title": "Solid Waste & Overflowing Dumper Clearance Protocol (SWM 2016 Rules)",
        "content": (
            "Protocol for Garbage Overflows & Illegal Dumps: "
            "1. Inspection: Optical detection of bin fill level > 90% or perimeter ground spillage triggers automatic compaction truck dispatch. "
            "2. Sanitation protocol: Total clearance using mechanized hydraulic compactor, followed by lime powder / bio-sanitizer wash to mitigate odor and pathogens. "
            "3. SLA: 6 to 12 hours from alert. "
            "4. Estimated cost: ₹1,500 - ₹4,000 per bin point clearing and disinfection."
        ),
        "sla_turnaround": "6 to 12 hours",
        "recommended_crew": "Municipal Solid Waste Rapid Response Fleet"
    },
    {
        "id": "kb_future_readiness_2070",
        "category": "Future City Readiness",
        "keywords": ["2070", "readiness", "score", "pillar", "sustainability", "mobility", "projection", "accelerated", "planning"],
        "title": "2070 Future City Readiness Multi-Pillar Optimization Guide",
        "content": (
            "Methodology for 2070 Smart City Readiness: "
            "Pillars: 1. Infrastructure Health (25%), 2. Sustainability & Green Canopy (20%), 3. Mobility & Public Transit (15%), "
            "4. Technology & IoT Sensor Automation (15%), 5. Climate & Flood Resilience (15%), 6. Urban Master Planning (10%). "
            "Accelerated Development Projection: Reaches 85-92+ index across metros by deploying automated drone defect patrols, "
            "100% electrified bus rapid transit (BRT), sponge city permeable pavements, and zero-landfill circular waste plants."
        ),
        "sla_turnaround": "Continuous municipal planning cycle",
        "recommended_crew": "Urban Master Planning & Smart City Directorate"
    }
]
