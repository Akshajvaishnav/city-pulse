import uuid
import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import Optional

from ..config import settings
from ..ai import get_detector
from ..schemas import DetectionResponse

router = APIRouter(prefix="/detect", tags=["AI Detection"])

@router.post("", response_model=DetectionResponse)
async def detect_infrastructure_flaw(
    file: Optional[UploadFile] = File(None),
    sample_name: Optional[str] = Form(None)
):
    """
    Analyzes an uploaded infrastructure photograph using Computer Vision.
    Detects defect type, calculates confidence, draws bounding boxes,
    and returns suggested severity and location analysis.
    """
    detector = get_detector()
    
    # If sample image requested
    if sample_name:
        sample_path = settings.UPLOAD_DIR / sample_name
        if sample_path.exists():
            result = detector.detect(sample_path, sample_name)
            return DetectionResponse(**result)
    
    if not file:
        raise HTTPException(status_code=400, detail="Either an image file or sample_name must be provided.")
    
    # Validate extension
    ext = Path(file.filename).suffix.lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Supported formats: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4().hex[:12]}_{file.filename.replace(' ', '_')}"
    target_path = settings.UPLOAD_DIR / unique_filename

    try:
        with target_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded image: {str(e)}")

    # Run AI Detection Engine
    try:
        detection_result = detector.detect(target_path, unique_filename)
        return DetectionResponse(**detection_result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection engine error: {str(e)}")
