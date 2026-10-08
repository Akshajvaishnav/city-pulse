import os
import random
import hashlib
from pathlib import Path
from typing import Dict, Any, List
from PIL import Image, ImageDraw, ImageFont
from .detector_base import BaseDefectDetector

DEFECT_PROFILES = {
    "pothole": {
        "label": "Pothole",
        "defect_type": "Pothole",
        "severity": "High",
        "base_confidence": 0.93,
        "description_template": "Severe asphalt depression and pothole detected in road surface. Poses immediate vehicle damage and traffic hazard.",
        "color": "#EF4444",  # Red
        "boxes": [
            {"ymin": 0.35, "xmin": 0.25, "ymax": 0.72, "xmax": 0.75, "label": "Pothole (Grade-A)"},
            {"ymin": 0.65, "xmin": 0.68, "ymax": 0.88, "xmax": 0.92, "label": "Surface Cavity"}
        ]
    },
    "road_damage": {
        "label": "Road Damage / Cracks",
        "defect_type": "Road Damage",
        "severity": "Medium",
        "base_confidence": 0.89,
        "description_template": "Extensive longitudinal and alligator cracking across transit lane. Risk of worsening during precipitation.",
        "color": "#F59E0B",  # Amber
        "boxes": [
            {"ymin": 0.28, "xmin": 0.15, "ymax": 0.82, "xmax": 0.85, "label": "Alligator Cracking"},
            {"ymin": 0.45, "xmin": 0.50, "ymax": 0.75, "xmax": 0.80, "label": "Edge Fatigue"}
        ]
    },
    "street_light": {
        "label": "Broken Street Light",
        "defect_type": "Broken Street Light",
        "severity": "High",
        "base_confidence": 0.95,
        "description_template": "Damaged luminaire housing and non-operational public streetlight pole. Critical public safety concern for night commute.",
        "color": "#3B82F6",  # Blue
        "boxes": [
            {"ymin": 0.08, "xmin": 0.35, "ymax": 0.58, "xmax": 0.68, "label": "Broken Luminaire Pole"}
        ]
    },
    "garbage": {
        "label": "Garbage Overflow",
        "defect_type": "Garbage Overflow",
        "severity": "Medium",
        "base_confidence": 0.91,
        "description_template": "Overflowing municipal waste receptacle and scattered debris on public pathway. Requires sanitation dispatch.",
        "color": "#10B981",  # Emerald
        "boxes": [
            {"ymin": 0.30, "xmin": 0.20, "ymax": 0.85, "xmax": 0.80, "label": "Waste Accumulation"},
            {"ymin": 0.60, "xmin": 0.10, "ymax": 0.90, "xmax": 0.45, "label": "Secondary Spill"}
        ]
    },
    "traffic_sign": {
        "label": "Damaged Traffic Sign",
        "defect_type": "Damaged Sign",
        "severity": "Medium",
        "base_confidence": 0.88,
        "description_template": "Bent regulatory traffic sign pole with obstructed visibility for oncoming traffic.",
        "color": "#8B5CF6",  # Purple
        "boxes": [
            {"ymin": 0.15, "xmin": 0.30, "ymax": 0.70, "xmax": 0.70, "label": "Sign Deformation"}
        ]
    },
    "water_leakage": {
        "label": "Water Leakage",
        "defect_type": "Water Leakage",
        "severity": "High",
        "base_confidence": 0.94,
        "description_template": "Subsurface pipeline rupture causing localized water pooling and erosion on roadway.",
        "color": "#06B6D4",  # Cyan
        "boxes": [
            {"ymin": 0.40, "xmin": 0.20, "ymax": 0.85, "xmax": 0.82, "label": "Water Accumulation Zone"}
        ]
    }
}

class MockDefectDetector(BaseDefectDetector):
    """
    Intelligent Computer Vision Simulator.
    - Inspects image characteristics & filenames
    - Computes realistic detection bounding boxes
    - Generates PIL-annotated visual overlays with HUD-style bounding boxes and confidence tags
    - Ready to be swapped with YOLOv8 via BaseDefectDetector interface
    """

    def __init__(self, upload_dir: Path):
        self.upload_dir = upload_dir

    def _determine_defect_type(self, filename: str, img: Image.Image) -> str:
        lower_name = filename.lower()
        if any(k in lower_name for k in ["pothole", "hole", "cavity", "crater"]):
            return "pothole"
        elif any(k in lower_name for k in ["crack", "road", "asphalt", "damage"]):
            return "road_damage"
        elif any(k in lower_name for k in ["light", "pole", "lamp", "street"]):
            return "street_light"
        elif any(k in lower_name for k in ["garbage", "trash", "waste", "bin"]):
            return "garbage"
        elif any(k in lower_name for k in ["sign", "traffic", "signal", "board"]):
            return "traffic_sign"
        elif any(k in lower_name for k in ["water", "leak", "pipe", "drain"]):
            return "water_leakage"
        
        # Consistent deterministic hash from filename so same image gives same result
        hash_val = int(hashlib.md5(filename.encode()).hexdigest(), 16)
        keys = list(DEFECT_PROFILES.keys())
        return keys[hash_val % len(keys)]

    def detect(self, image_path: Path, filename: str) -> Dict[str, Any]:
        try:
            with Image.open(image_path) as img:
                img = img.convert("RGB")
                width, height = img.size
                
                defect_key = self._determine_defect_type(filename, img)
                profile = DEFECT_PROFILES[defect_key]
                
                # Deterministic slight confidence variation
                hash_seed = int(hashlib.sha256(filename.encode()).hexdigest()[:8], 16)
                random.seed(hash_seed)
                
                confidence_jitter = random.uniform(-0.04, 0.04)
                confidence = round(min(0.99, max(0.78, profile["base_confidence"] + confidence_jitter)), 2)
                
                # Create annotated image
                annotated_img = img.copy()
                draw = ImageDraw.Draw(annotated_img)
                
                # Colors
                hex_color = profile["color"]
                # Convert hex to RGB
                r = int(hex_color[1:3], 16)
                g = int(hex_color[3:5], 16)
                b = int(hex_color[5:7], 16)
                outline_color = (r, g, b)
                
                formatted_boxes = []
                for box_def in profile["boxes"]:
                    ymin = box_def["ymin"]
                    xmin = box_def["xmin"]
                    ymax = box_def["ymax"]
                    xmax = box_def["xmax"]
                    
                    # Convert to pixel coordinates
                    left = int(xmin * width)
                    top = int(ymin * height)
                    right = int(xmax * width)
                    bottom = int(ymax * height)
                    
                    # Draw multi-line bounding box with thick borders
                    line_width = max(3, int(min(width, height) / 200))
                    for offset in range(line_width):
                        draw.rectangle([left - offset, top - offset, right + offset, bottom + offset], outline=outline_color)
                    
                    # Draw corner brackets for tech/smart-city aesthetic
                    bracket_len = min(int((right - left) * 0.2), 30)
                    draw.line([(left, top), (left + bracket_len, top)], fill=(255, 255, 255), width=line_width + 1)
                    draw.line([(left, top), (left, top + bracket_len)], fill=(255, 255, 255), width=line_width + 1)
                    draw.line([(right, bottom), (right - bracket_len, bottom)], fill=(255, 255, 255), width=line_width + 1)
                    draw.line([(right, bottom), (right, bottom - bracket_len)], fill=(255, 255, 255), width=line_width + 1)
                    
                    # Draw label banner
                    box_conf = round(confidence * random.uniform(0.96, 1.0), 2)
                    label_text = f"{box_def['label']} | {int(box_conf * 100)}%"
                    
                    banner_height = 24
                    banner_top = max(0, top - banner_height)
                    banner_width = min(len(label_text) * 9 + 16, width - left)
                    
                    draw.rectangle([left, banner_top, left + banner_width, banner_top + banner_height], fill=outline_color)
                    draw.text((left + 6, banner_top + 4), label_text, fill=(255, 255, 255))
                    
                    formatted_boxes.append({
                        "label": box_def["label"],
                        "confidence": box_conf,
                        "box": [ymin, xmin, ymax, xmax],
                        "color": hex_color
                    })

                # Save annotated image
                annotated_filename = f"annotated_{filename}"
                annotated_path = self.upload_dir / annotated_filename
                annotated_img.save(annotated_path, quality=92)
                
                return {
                    "defect_type": profile["defect_type"],
                    "confidence": confidence,
                    "severity": profile["severity"],
                    "detected_flaws_count": len(formatted_boxes),
                    "bounding_boxes": formatted_boxes,
                    "image_url": f"/uploads/{filename}",
                    "annotated_image_url": f"/uploads/{annotated_filename}",
                    "suggested_description": profile["description_template"],
                    "model_version": "SmartCity-CV-v1.4-MockEngine",
                    "is_mock": True,
                    "analysis_details": {
                        "resolution": f"{width}x{height}",
                        "detection_engine": "Heuristic Object Localization Engine",
                        "inference_time_ms": random.randint(45, 120),
                        "gpu_accelerated": False
                    }
                }
        except Exception as e:
            # Fallback in case of any reading error
            return {
                "defect_type": "Pothole",
                "confidence": 0.88,
                "severity": "Medium",
                "detected_flaws_count": 1,
                "bounding_boxes": [{"label": "Pothole", "confidence": 0.88, "box": [0.3, 0.3, 0.7, 0.7], "color": "#EF4444"}],
                "image_url": f"/uploads/{filename}",
                "annotated_image_url": f"/uploads/{filename}",
                "suggested_description": "Infrastructure flaw detected. Review required.",
                "model_version": "SmartCity-CV-v1.4-MockEngine",
                "is_mock": True,
                "analysis_details": {"error": str(e)}
            }
