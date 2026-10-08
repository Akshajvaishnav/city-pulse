from typing import Dict, Any, List
import copy

# 5 Target Cities Metadata & Characteristics
CITY_METADATA = {
    "Gurugram": {
        "name": "Gurugram",
        "state": "Haryana",
        "role_description": "Primary Demo City: High-density commercial/corporate hub with rapid private infrastructure and critical drainage/transit bottlenecks.",
        "center_coords": [28.4595, 77.0266],
        "default_pillars": {
            "infrastructure": 68.0,
            "sustainability": 64.0,
            "mobility": 71.0,
            "technology": 86.0,
            "resilience": 59.0,
            "planning": 66.0
        },
        "indicators": [
            {"name": "Pothole & Surface Cavity Rate", "score": 65.0, "benchmark": "Moderate to High defect frequency", "status": "Needs Triage"},
            {"name": "Cyber City Smart Tech & IoT Readiness", "score": 92.0, "benchmark": "Leading IT & Corporate Sensor Grid", "status": "Advanced"},
            {"name": "Stormwater Drainage & Flood Resilience", "score": 52.0, "benchmark": "Monsoon waterlogging vulnerability", "status": "Critical"},
            {"name": "Public Transit & Rapid Metro Coverage", "score": 68.0, "benchmark": "Private vehicle dominant / arterial congestion", "status": "Moderate"},
            {"name": "Solar & Commercial Green Building Ratio", "score": 74.0, "benchmark": "High LEED certified office footprint", "status": "Good"}
        ],
        "strengths": [
            "Highest technology adoption, 5G smart-city grid, and private IT cluster sensor integration",
            "High commercial building energy-efficiency standards and corporate CSR engagement",
            "Rapid economic expansion driving municipal infrastructure budgets"
        ],
        "challenges": [
            "Severe monsoon waterlogging on arterial expressway underpasses and drainage deficit",
            "High road surface wear-and-tear due to heavy construction logistics and transit volume",
            "Asymmetric public transit coverage outside corporate metro corridors"
        ]
    },
    "Delhi": {
        "name": "Delhi",
        "state": "NCT Delhi",
        "role_description": "National Capital Territory: Vast historical and metropolitan expanse with high transit maturity and complex jurisdictional layers.",
        "center_coords": [28.6139, 77.2090],
        "default_pillars": {
            "infrastructure": 72.0,
            "sustainability": 58.0,
            "mobility": 84.0,
            "technology": 78.0,
            "resilience": 62.0,
            "planning": 60.0
        },
        "indicators": [
            {"name": "Delhi Metro Multimodal Integration", "score": 94.0, "benchmark": "World-class extensive rapid transit grid", "status": "Exceptional"},
            {"name": "Air Quality & Urban Clean Air Index", "score": 48.0, "benchmark": "Seasonal particulate and emission challenges", "status": "Critical"},
            {"name": "Sanitation & Waste Processing Volume", "score": 66.0, "benchmark": "High municipal waste load / landfill remediation", "status": "Moderate"},
            {"name": "Streetlight Illumination Coverage", "score": 88.0, "benchmark": "Comprehensive LED transition across NCT", "status": "Advanced"},
            {"name": "Yamuna River Water Sustainability Index", "score": 53.0, "benchmark": "Subsurface depletion and effluent stress", "status": "Critical"}
        ],
        "strengths": [
            "Extensive, mature Delhi Metro mass-transit network and EV public bus fleet",
            "Comprehensive street lighting and civic sensor installations across municipal wards",
            "Centralized civic digital redressal platforms and emergency response times"
        ],
        "challenges": [
            "Severe air quality index (AQI) winter stress and industrial/vehicular emissions",
            "High legacy population density limiting greenfield master-plan expansion",
            "Complex multi-agency administrative coordination across central, state, and MCD bodies"
        ]
    },
    "Noida": {
        "name": "Noida",
        "state": "Uttar Pradesh",
        "role_description": "Planned Industrial & IT Satellite: Wide gridded sector layouts, strong green belt allocation, and planned drainage infrastructure.",
        "center_coords": [28.5708, 77.3260],
        "default_pillars": {
            "infrastructure": 78.0,
            "sustainability": 72.0,
            "mobility": 76.0,
            "technology": 77.0,
            "resilience": 70.0,
            "planning": 82.0
        },
        "indicators": [
            {"name": "Gridded Master Plan Sectorization", "score": 88.0, "benchmark": "Well-demarcated industrial, commercial, residential zones", "status": "Advanced"},
            {"name": "Expressway Road Pavement Quality", "score": 82.0, "benchmark": "Modern high-speed transit corridors", "status": "Good"},
            {"name": "Green Belt & Urban Tree Canopy Ratio", "score": 79.0, "benchmark": "Substantial reserved green buffer zones", "status": "Good"},
            {"name": "Sewage Treatment & Recycled Water Grid", "score": 73.0, "benchmark": "Dual plumbing and tertiary STPs in new sectors", "status": "Moderate"},
            {"name": "Last-Mile Non-Motorized Transport", "score": 64.0, "benchmark": "Wide avenues but limited segregated cycle tracks", "status": "Moderate"}
        ],
        "strengths": [
            "Planned sector grid layout with reserved rights-of-way for utility expansion",
            "High road surface quality along key expressways and commercial avenues",
            "Healthy urban tree canopy and planned municipal green buffers"
        ],
        "challenges": [
            "Rapid population influx requiring faster secondary stormwater line upgrades",
            "Last-mile feeder connectivity between inner sectors and Aqua/Blue line metro stations",
            "Groundwater extraction pressures in peripheral expanding sectors"
        ]
    },
    "Bengaluru": {
        "name": "Bengaluru",
        "state": "Karnataka",
        "role_description": "Established Technology Metropolitan City: Global innovation capital with high digital literacy, facing rapid suburban mobility and water catchment challenges.",
        "center_coords": [12.9716, 77.5946],
        "default_pillars": {
            "infrastructure": 69.0,
            "sustainability": 71.0,
            "mobility": 63.0,
            "technology": 93.0,
            "resilience": 67.0,
            "planning": 64.0
        },
        "indicators": [
            {"name": "AI, IoT & Smart City Innovation Ecosystem", "score": 96.0, "benchmark": "Premier global technology & startup capital", "status": "Industry Leader"},
            {"name": "Traffic Bottleneck & Commute Congestion", "score": 52.0, "benchmark": "High peak-hour delays along ORR and IT corridors", "status": "Critical"},
            {"name": "Urban Lake Rejuvenation & Rainwater Harvesting", "score": 68.0, "benchmark": "Active civic and municipal catchment restoration", "status": "Progressing"},
            {"name": "EV Charging & Clean Mobility Adoption", "score": 86.0, "benchmark": "High EV two-wheeler and fleet penetration", "status": "Advanced"},
            {"name": "Underground Utility Mapping & Pavement Integrity", "score": 61.0, "benchmark": "Frequent utility digging causing road cavity risks", "status": "Needs Triage"}
        ],
        "strengths": [
            "Unrivaled technology talent pool, deep-tech AI integration, and civic-tech innovations",
            "Strong citizen activism and community-driven lake restoration initiatives",
            "High rate of electric vehicle adoption and renewable power purchasing"
        ],
        "challenges": [
            "Severe arterial road congestion along Outer Ring Road, Whitefield, and Silk Board",
            "Recurrent utility pipe excavation without synchronous pavement restoration",
            "Groundwater depletion in peripheral tech corridors dependent on water tankers"
        ]
    },
    "Bhubaneswar": {
        "name": "Bhubaneswar",
        "state": "Odisha",
        "role_description": "Planned Growth & High-Potential Smart City: Compact master planning, celebrated civic disaster resilience, and forward-looking institutional governance.",
        "center_coords": [20.2961, 85.8245],
        "default_pillars": {
            "infrastructure": 77.0,
            "sustainability": 81.0,
            "mobility": 74.0,
            "technology": 76.0,
            "resilience": 87.0,
            "planning": 84.0
        },
        "indicators": [
            {"name": "Climate & Cyclone Disaster Preparedness", "score": 93.0, "benchmark": "Nationally recognized early-warning & storm resilience", "status": "Benchmark"},
            {"name": "Otto & Mo Bus Transit Inclusivity", "score": 84.0, "benchmark": "High public satisfaction and digital ticketing grid", "status": "Advanced"},
            {"name": "Planned Urban Headroom & Population Density Buffer", "score": 88.0, "benchmark": "Substantial land reserves for organized expansion", "status": "Exceptional"},
            {"name": "Green Open Space & Heritage Protection Ratio", "score": 82.0, "benchmark": "Preserved ecological corridors and clean public parks", "status": "Good"},
            {"name": "IT & Industrial Cluster Scale", "score": 71.0, "benchmark": "Growing Tier-1 IT hub (Infocity) with expansion scope", "status": "Expanding"}
        ],
        "strengths": [
            "Exceptional climate disaster management and institutional storm preparedness protocols",
            "High urban planning headroom with unburdened land buffers for future clean expansion",
            "Effective municipal social programs, clean public spaces, and awarded smart public transit (Mo Bus)"
        ],
        "challenges": [
            "Current total industrial and IT ecosystem scale smaller than mega-metros like Bengaluru or Gurugram",
            "Need for accelerated private capital investment in specialized deep-tech infrastructure",
            "Expansion of high-speed mass transit as population grows toward 2050"
        ]
    }
}

DEFAULT_WEIGHTS = {
    "infrastructure": 0.25,
    "sustainability": 0.20,
    "mobility": 0.15,
    "technology": 0.15,
    "resilience": 0.15,
    "planning": 0.10
}

YEAR_STEPS = [2026, 2035, 2045, 2055, 2065, 2070]

# Scenario Multipliers for 2026 -> 2070 growth
# Conservative: slower growth, decay risks in poorly planned cities
# Current-Trend: realistic continuous progress
# Accelerated: major smart city capex and green transition
SCENARIO_GROWTH_FACTORS = {
    "conservative": {
        "Gurugram": 0.12,
        "Delhi": 0.10,
        "Noida": 0.14,
        "Bengaluru": 0.15,
        "Bhubaneswar": 0.16
    },
    "current_trend": {
        "Gurugram": 0.22,
        "Delhi": 0.18,
        "Noida": 0.23,
        "Bengaluru": 0.25,
        "Bhubaneswar": 0.27
    },
    "accelerated": {
        "Gurugram": 0.35,
        "Delhi": 0.30,
        "Noida": 0.34,
        "Bengaluru": 0.37,
        "Bhubaneswar": 0.39
    }
}

class FutureReadinessService:
    @staticmethod
    def calculate_city_readiness_score(pillars: Dict[str, float], weights: Dict[str, float]) -> float:
        score = sum(pillars.get(k, 70.0) * weights.get(k, 0.16) for k in weights)
        return round(score, 1)

    @staticmethod
    def compute_projection_trajectory(base_score: float, growth_factor: float, planning_buffer: float) -> List[float]:
        """
        Computes scenario trajectory for years [2026, 2035, 2045, 2055, 2065, 2070].
        Incorporates logarithmic diminishing returns as score approaches 98.
        """
        trajectory = []
        for i, year in enumerate(YEAR_STEPS):
            if year == 2026:
                trajectory.append(base_score)
            else:
                progress_fraction = (year - 2026) / (2070 - 2026)
                # Headroom calculation
                headroom = 100.0 - base_score
                # Impact of planning buffer (cities with high planning/resilience preserve headroom better)
                boost = (growth_factor * (1.0 + (planning_buffer - 70.0) / 100.0)) * progress_fraction
                projected = base_score + (headroom * boost)
                trajectory.append(round(min(98.5, max(45.0, projected)), 1))
        return trajectory

    @classmethod
    def get_readiness_comparison(
        cls,
        scenario: str = "current_trend",
        custom_weights: Dict[str, float] = None,
        db_defect_counts: Dict[str, int] = None
    ) -> Dict[str, Any]:
        weights = custom_weights or DEFAULT_WEIGHTS
        # Normalize weights to sum to 1.0
        w_sum = sum(weights.values())
        if w_sum > 0:
            weights = {k: round(v / w_sum, 4) for k, v in weights.items()}

        cities_data = {}
        comparison_table = []
        max_score = -1.0
        leading_city = None

        db_counts = db_defect_counts or {}

        for city_name, meta in CITY_METADATA.items():
            pillars = copy.deepcopy(meta["default_pillars"])
            
            # Dynamically adjust Infrastructure pillar slightly based on active flaw count in DB
            city_flaws = db_counts.get(city_name, 0)
            if city_flaws > 0:
                # Penalty between 0 and 5 points based on logged flaw density
                flaw_adjustment = min(5.0, city_flaws * 0.3)
                pillars["infrastructure"] = round(max(40.0, pillars["infrastructure"] - flaw_adjustment), 1)

            base_readiness = cls.calculate_city_readiness_score(pillars, weights)

            # Generate projections for all 3 scenarios
            projections = {}
            for sc_name, factors in SCENARIO_GROWTH_FACTORS.items():
                gf = factors.get(city_name, 0.20)
                planning_val = pillars.get("planning", 70.0)
                projections[sc_name] = cls.compute_projection_trajectory(base_readiness, gf, planning_val)

            # Current active scenario 2070 score
            current_2070_score = projections.get(scenario, projections["current_trend"])[-1]
            if current_2070_score > max_score:
                max_score = current_2070_score
                leading_city = city_name

            profile = {
                "city": city_name,
                "role_description": meta["role_description"],
                "center_coords": meta["center_coords"],
                "pillars": pillars,
                "readiness_score": base_readiness,
                "infrastructure_flaw_count": city_flaws,
                "infrastructure_health_score": pillars["infrastructure"],
                "strengths": meta["strengths"],
                "challenges": meta["challenges"],
                "indicators_breakdown": meta["indicators"],
                "projections": projections
            }
            cities_data[city_name] = profile

            comparison_table.append({
                "city": city_name,
                "infrastructure": pillars["infrastructure"],
                "sustainability": pillars["sustainability"],
                "mobility": pillars["mobility"],
                "technology": pillars["technology"],
                "resilience": pillars["resilience"],
                "planning": pillars["planning"],
                "readiness_score_2026": base_readiness,
                "projected_score_2070": current_2070_score
            })

        # Sort comparison table by projected 2070 score descending
        comparison_table.sort(key=lambda x: x["projected_score_2070"], reverse=True)

        lead_meta = CITY_METADATA.get(leading_city, {})
        insights = {
            "leading_city": leading_city,
            "projected_score_2070": max_score,
            "summary_statement": f"Under the selected '{scenario.replace('_', ' ').title()}' scenario and available indicators, {leading_city} currently shows the highest projected future-readiness score ({max_score}/100) among the five cities in this analytical demonstration.",
            "drivers": lead_meta.get("strengths", []),
            "key_tradeoffs": lead_meta.get("challenges", []),
            "comparative_notes": {
                "Gurugram": "Demonstrates industry-leading commercial technology & corporate revenue generation, but requires aggressive flood drainage and public transit investment.",
                "Bengaluru": "Leads nationally in deep-tech, IoT ecosystem, and EV momentum, with long-term trajectory shaped by suburban traffic debottlenecking and lake rejuvenation.",
                "Bhubaneswar": "Benefits strongly from pre-planned expansion headroom, recognized cyclone resilience protocols, and clean master-plan governance.",
                "Delhi": "Maintains unparalleled metro mass-transit density and street-level LED coverage, with primary future gains linked to clean air and pollution mitigation.",
                "Noida": "Exhibits robust gridded sector layouts and wide right-of-way avenues, balanced by the need for upgraded secondary drainage lines."
            }
        }

        return {
            "years": YEAR_STEPS,
            "active_scenario": scenario,
            "scenarios": ["conservative", "current_trend", "accelerated"],
            "weights": weights,
            "cities": cities_data,
            "comparison_table": comparison_table,
            "insights": insights,
            "disclaimer": "The 2070 projection is an analytical scenario, not a guaranteed prediction. Results depend on the indicators, data quality, assumptions and weighting used by the system."
        }
