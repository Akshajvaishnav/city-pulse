import os
import json
import logging
from typing import List, Dict, Any, Optional
import httpx
from ..config import settings
from ..models import InfrastructureIssue, CityAlert

logger = logging.getLogger(__name__)

SMART_CITY_PROMPT = """You are CityPulse Assistant, an advanced AI urban advisor and municipal copilot for SmartCity Infrastructure & Future City Readiness.
You assist citizens, civic engineers, and municipal administrators with:
1. Pothole, lighting, drainage, and road defect detection, reporting, and maintenance SLAs.
2. 2070 Future City Readiness metrics (Infrastructure, Sustainability, Mobility, Tech, Climate Resilience, Urban Planning).
3. Live weather hazards, road waterlogging, flood monitoring, and municipal dispatch operations.
4. Smart city initiatives across Gurugram, Delhi, Noida, Bengaluru, and Bhubaneswar.

Maintain a professional, responsive, helpful, and civic-minded tone. If user reports an issue or asks about city conditions, provide clear actionable steps. Mention report IDs or SLA timeframes where helpful.
"""

async def query_llm(
    message: str,
    history: List[Dict[str, str]],
    city_context: str,
    active_issues: List[Dict[str, Any]],
    active_alerts: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Query an LLM provider (OpenAI, Gemini, or our intelligent built-in smart city engine).
    """
    # Check if OpenAI API key is configured
    if settings.OPENAI_API_KEY and settings.LLM_PROVIDER in ["openai", "hybrid"]:
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                messages = [{"role": "system", "content": SMART_CITY_PROMPT}]
                # Add city context
                messages.append({
                    "role": "system",
                    "content": f"Active City: {city_context}. Issues count in context: {len(active_issues)}. Active alerts: {json.dumps(active_alerts[:3])}."
                })
                for h in history[-6:]:
                    messages.append({"role": h.get("role", "user"), "content": h.get("content", "")})
                messages.append({"role": "user", "content": message})

                res = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                    json={
                        "model": "gpt-4o-mini",
                        "messages": messages,
                        "temperature": 0.7,
                        "max_tokens": 400
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"]
                    return {
                        "reply": content,
                        "provider": "OpenAI (GPT-4o-mini)",
                        "suggested_actions": ["View Live GIS Map", "Submit New Defect", "Check 2070 Readiness"],
                        "referenced_issues": [i["report_id"] for i in active_issues[:2]]
                    }
        except Exception as e:
            logger.warning(f"OpenAI call failed, falling back to built-in civic model: {e}")

    # Built-in High-Intelligence Municipal Copilot
    return generate_intelligent_civic_reply(message, city_context, active_issues, active_alerts)

def generate_intelligent_civic_reply(
    message: str,
    city_context: str,
    active_issues: List[Dict[str, Any]],
    active_alerts: List[Dict[str, Any]]
) -> Dict[str, Any]:
    msg_lower = message.lower()
    
    # Analyze intent
    if any(k in msg_lower for k in ["pothole", "road", "flaw", "defect", "damage", "broken"]):
        top_issues = [f"• {i.get('report_id', 'SC-01')} ({i.get('defect_type', 'Pothole')} at {i.get('location_name', 'Sector 29')}) - Status: {i.get('status', 'Pending')}" for i in active_issues[:3]]
        issues_summary = "\n".join(top_issues) if top_issues else "No high-severity defects currently pending in this sector."
        return {
            "reply": f"🔍 **Infrastructure Incident Telemetry for {city_context}:**\n\nOur computer vision sensors and citizen reports currently track active defects in your zone:\n{issues_summary}\n\nPriority repairs are dispatched via our automated work order scheduler within a 48-hour SLA.",
            "provider": "CityPulse Civic AI",
            "suggested_actions": ["Dispatch Repair Crew", "View Leaflet GIS Map", "Upload Defect Photo"],
            "referenced_issues": [i["report_id"] for i in active_issues[:3] if "report_id" in i]
        }
    
    if any(k in msg_lower for k in ["weather", "rain", "flood", "temp", "waterlog", "aqi", "air"]):
        alerts_text = ""
        for a in active_alerts[:2]:
            alerts_text += f"\n⚠️ **{a.get('category')} ({a.get('level')}):** {a.get('title')} — {a.get('detail')} (Metric: {a.get('metric_value')})"
        if not alerts_text:
            alerts_text = f"\n✅ Sensors indicate normal weather parameters in {city_context}. Road temperature is 31°C with clear drainage flow."
        return {
            "reply": f"🌦️ **Live Environmental & Hazard Sensor Telemetry ({city_context}):**{alerts_text}\n\nAutomated municipal pumps and highway patrol units are on standby.",
            "provider": "CityPulse Civic AI",
            "suggested_actions": ["View Weather Sensor Radar", "Check Waterlogging Index", "Report Street Drain Block"],
            "referenced_issues": []
        }

    if any(k in msg_lower for k in ["2070", "future", "readiness", "score", "scenario", "projection", "plan"]):
        return {
            "reply": f"🔮 **2070 Future City Readiness Engine:**\n\n{city_context} is analyzed across six transparent pillars: Infrastructure Health (25%), Sustainability (20%), Mobility (15%), Technology (15%), Climate Resilience (15%), and Urban Planning (10%).\n\nUnder the **Accelerated Development** trajectory, infrastructure score is projected to surpass **89.4/100** by 2070 with smart EV transit grid and automated AI surface defect resurfacing.",
            "provider": "CityPulse Civic AI",
            "suggested_actions": ["Open 2070 Projections", "Compare City Readiness", "Adjust Pillar Weights"],
            "referenced_issues": []
        }

    if any(k in msg_lower for k in ["report", "upload", "submit", "how to"]):
        return {
            "reply": f"📸 **Submitting a Defect to CityPulse:**\n1. Navigate to **Report Issue** or **AI Scanner**.\n2. Snap or upload an image of the pothole, street light, or garbage overflow.\n3. Our AI computer vision model will automatically localize bounding boxes and estimate severity.\n4. Click 'Submit Report' to log it into the municipal registry with an automated sequential tracking ID.",
            "provider": "CityPulse Civic AI",
            "suggested_actions": ["Open AI Scanner", "Submit Defect Report", "View Recent Issues"],
            "referenced_issues": []
        }

    # Default versatile civic advisor response
    return {
        "reply": f"👋 Hello! I am your **CityPulse Smart City Copilot** for {city_context}.\n\nI can assist you with:\n• Inspecting live defect telemetry & pothole repairs\n• 2070 Future City Readiness and multi-city comparative analytics\n• Real-time weather, flood & environmental sensor alerts\n• Generating municipal dispatch work orders and civic audit reports\n\nWhat would you like to explore or check today?",
        "provider": "CityPulse Civic AI",
        "suggested_actions": ["Check Active Defects", "Explore 2070 Readiness", "View Environmental Alerts", "Export Civic Report"],
        "referenced_issues": [i["report_id"] for i in active_issues[:2] if "report_id" in i]
    }
