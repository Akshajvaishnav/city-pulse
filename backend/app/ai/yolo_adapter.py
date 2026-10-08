from pathlib import Path
from typing import Dict, Any
from .detector_base import BaseDefectDetector

class YOLOv8DefectDetector(BaseDefectDetector):
    """
    Production adapter for Ultralytics YOLOv8/YOLOv9/YOLOv11 models.
    To enable:
    1. Install ultralytics: pip install ultralytics
    2. Place model weights at models/yolov8_infrastructure.pt
    3. Set AI_DETECTION_MODE=yolo in environment variables.
    """

    def __init__(self, model_path: str, upload_dir: Path):
        self.model_path = model_path
        self.upload_dir = upload_dir
        self.model = None
        self._load_model()

    def _load_model(self):
        try:
            # Conditional import so mock mode runs without heavy ultralytics package
            from ultralytics import YOLO
            if Path(self.model_path).exists():
                self.model = YOLO(self.model_path)
            else:
                print(f"[YOLO Adapter] Model weights not found at {self.model_path}. Will fallback if called.")
        except ImportError:
            print("[YOLO Adapter] ultralytics package not installed. Run 'pip install ultralytics' to activate real YOLO inference.")

    def detect(self, image_path: Path, filename: str) -> Dict[str, Any]:
        if self.model is None:
            raise RuntimeError("YOLO model is not initialized. Ensure ultralytics is installed and model weights exist.")
        
        # Real YOLO inference logic
        results = self.model(str(image_path))
        result = results[0]
        
        # Save annotated image rendered by YOLO
        annotated_filename = f"annotated_{filename}"
        annotated_path = self.upload_dir / annotated_filename
        result.save(filename=str(annotated_path))
        
        boxes = []
        class_names = result.names
        highest_conf = 0.0
        primary_defect = "Road Damage"
        
        for box in result.boxes:
            conf = float(box.conf[0])
            cls_id = int(box.cls[0])
            label = class_names.get(cls_id, f"Class {cls_id}")
            xyxyn = box.xyxyn[0].tolist()  # [xmin, ymin, xmax, ymax]
            
            boxes.append({
                "label": label,
                "confidence": round(conf, 2),
                "box": [xyxyn[1], xyxyn[0], xyxyn[3], xyxyn[2]], # [ymin, xmin, ymax, xmax]
                "color": "#EF4444"
            })
            if conf > highest_conf:
                highest_conf = conf
                primary_defect = label

        severity = "High" if highest_conf > 0.85 else "Medium"
        return {
            "defect_type": primary_defect,
            "confidence": round(highest_conf, 2),
            "severity": severity,
            "detected_flaws_count": len(boxes),
            "bounding_boxes": boxes,
            "image_url": f"/uploads/{filename}",
            "annotated_image_url": f"/uploads/{annotated_filename}",
            "suggested_description": f"Real-time YOLO detected {len(boxes)} infrastructure defects.",
            "model_version": "YOLOv8-Custom-Infrastructure",
            "is_mock": False,
            "analysis_details": {
                "inference_time_ms": float(result.speed.get("inference", 25.0)),
                "model_weights": self.model_path
            }
        }
