import os
import io
from fastapi import APIRouter, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from PIL import Image, ImageDraw
from ultralytics import YOLO
from database import get_db
from models import DetectionResult, Detection
from datetime import datetime
from typing import Optional
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer

# Constants
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

# Router
router = APIRouter()

# YOLO Model
MODEL_PATH = "./models/best.pt"
model = YOLO(MODEL_PATH)

SAVE_DIR = "./uploaded_images"
os.makedirs(SAVE_DIR, exist_ok=True)


# Dependency: Authenticate and extract user info
def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub: Optional[str] = payload.get("sub")
        if sub is None:
            raise HTTPException(status_code=401, detail="Invalid token: missing user_id")
        user_id = sub  # 'sub'을 'user_id'로 사용
        return {"user_id": user_id}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# Object Detection Endpoint
@router.post("/detect/")
async def detect_objects(file: UploadFile, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]

    try:
        # Read and process the image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {e}")

    try:
        # YOLO Model Inference
        results = model(image)
        results = results[0] if isinstance(results, list) else results

        detections = []
        if results.boxes:
            draw = ImageDraw.Draw(image)
            for box in results.boxes:
                class_name = results.names[int(box.cls[0])]
                confidence = float(box.conf[0])
                x1, y1, x2, y2 = box.xyxy[0].tolist()

                draw.rectangle([x1, y1, x2, y2], outline="red", width=3)
                draw.text((x1, y1), f"{class_name} {confidence:.2f}", fill="red")

                detections.append({
                    "class": class_name,
                    "confidence": confidence,
                    "coordinates": [x1, y1, x2, y2]
                })

            # Save the annotated image
            image_filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
            image_path = os.path.join(SAVE_DIR, image_filename)
            image.save(image_path)

            # Save detection results in the database
            detection_result = DetectionResult(
                image_path=image_path,
                create_at=datetime.utcnow(),
                user_id=user_id
            )
            db.add(detection_result)
            db.commit()
            db.refresh(detection_result)

            for detection in detections:
                db_detection = Detection(
                    class_name=detection["class"],
                    confidence=detection["confidence"],
                    x1=detection["coordinates"][0],
                    y1=detection["coordinates"][1],
                    x2=detection["coordinates"][2],
                    y2=detection["coordinates"][3],
                    result_id=detection_result.id
                )
                db.add(db_detection)

            db.commit()

            return JSONResponse(content={
                "image_path": image_path,
                "detections": detections
            })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model inference error: {e}")