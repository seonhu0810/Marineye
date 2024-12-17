from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from models import User, DetectionResult, Detection
from database import get_db
from datetime import datetime

router = APIRouter()

from pydantic import BaseModel
from typing import List

class Detection(BaseModel):
    class_name: str
    confidence: float
    coordinates: List[float]

class SaveHistoryRequest(BaseModel):
    detections: List[Detection]
    image_url: str
    username: str

@router.post("/save")
async def save_history(request: SaveHistoryRequest, db: Session = Depends(get_db)):
    # 사용자 확인
    user = db.query(User).filter(User.username == request.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        # DetectionResult 저장
        detection_result = DetectionResult(
            image_path=request.image_url,
            create_at=datetime.utcnow(),
            user_id=user.id
        )
        db.add(detection_result)
        db.commit()
        db.refresh(detection_result)

        # Detection 저장
        for detection in request.detections:
            db_detection = Detection(
                class_name=detection.class_name,
                confidence=detection.confidence,
                x1=detection.coordinates[0],
                y1=detection.coordinates[1],
                x2=detection.coordinates[2],
                y2=detection.coordinates[3],
                result_id=detection_result.id
            )
            db.add(db_detection)

        db.commit()

        return {"message": "History saved successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error saving history: " + str(e))
