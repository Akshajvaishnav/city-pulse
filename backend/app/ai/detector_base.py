from abc import ABC, abstractmethod
from typing import Dict, Any
from pathlib import Path

class BaseDefectDetector(ABC):
    """
    Abstract Base Class for Infrastructure Defect Detectors.
    Allows easy swapping between MockDetector, YOLOv8, YOLOv9, ONNX, or Cloud Vision APIs.
    """

    @abstractmethod
    def detect(self, image_path: Path, filename: str) -> Dict[str, Any]:
        """
        Analyze an image and return defect detection results.

        Returns:
            dict containing:
                - defect_type: str
                - confidence: float (0.0 to 1.0)
                - severity: str ("High", "Medium", "Low")
                - detected_flaws_count: int
                - bounding_boxes: list of dicts [{"label", "confidence", "box": [ymin, xmin, ymax, xmax], "color"}]
                - annotated_image_url: str (relative path to drawn image)
                - suggested_description: str
                - model_version: str
                - is_mock: bool
                - analysis_details: dict
        """
        pass
