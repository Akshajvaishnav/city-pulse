from ..config import settings
from .detector_base import BaseDefectDetector
from .mock_detector import MockDefectDetector
from .yolo_adapter import YOLOv8DefectDetector

_detector_instance = None

def get_detector() -> BaseDefectDetector:
    global _detector_instance
    if _detector_instance is None:
        if settings.AI_DETECTION_MODE == "yolo":
            _detector_instance = YOLOv8DefectDetector(
                model_path=settings.YOLO_MODEL_PATH,
                upload_dir=settings.UPLOAD_DIR
            )
        else:
            _detector_instance = MockDefectDetector(upload_dir=settings.UPLOAD_DIR)
    return _detector_instance
