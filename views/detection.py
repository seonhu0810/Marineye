import io
import os
from fastapi import APIRouter, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse
from PIL import Image, ImageDraw
from sqlalchemy.orm import Session
from ultralytics import YOLO
from database import get_db
from models import DetectionResult, Detection

# 라우터 생성
router = APIRouter()

# YOLO 모델 로드
MODEL_PATH = "./models/best.pt"  # 모델 경로를 프로젝트에 맞게 수정하세요.
model = YOLO(MODEL_PATH)

SAVE_DIR = "./uploaded_images"

@router.post("/detect/")
async def detect_objects(file: UploadFile, db: Session = Depends(get_db)):
    """
    객체 감지 엔드포인트: 이미지를 업로드받아 객체 감지 결과를 반환합니다.
    """
    try:
        # 파일 읽기 및 PIL 이미지로 변환
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {e}")

    try:
        # YOLO 모델에 이미지 전달
        results = model(image)

        # 결과가 리스트인지 확인 (단일 이미지 처리의 경우 results는 단일 객체여야 함)
        if isinstance(results, list):
            results = results[0]

        # 감지 결과 처리
        detections = []
        if results.boxes:
            # 바운딩 박스를 그리기 위한 ImageDraw 객체
            draw = ImageDraw.Draw(image)

            for box in results.boxes:
                class_name = results.names[int(box.cls[0])]  # 클래스 이름 추출
                confidence = float(box.conf[0])  # 신뢰도 추출
                x1, y1, x2, y2 = box.xyxy[0].tolist()  # 좌표를 리스트로 변환

                # 바운딩 박스 그리기
                draw.rectangle([x1, y1, x2, y2], outline="red", width=3)
                draw.text((x1, y1), f"{class_name} {confidence:.2f}", fill="red")

                # 감지된 결과 추가
                detections.append({
                    "class": class_name,
                    "confidence": confidence,
                    "coordinates": [x1, y1, x2, y2]
                })

            # 저장할 이미지 파일 경로 생성
            image_filename = f"{file.filename}"
            image_path = os.path.join(SAVE_DIR, image_filename)

            # 이미지 저장
            image.save(image_path)

            # 감지 결과를 데이터베이스에 저장
            detection_result = DetectionResult(
                image_path=image_path
            )
            db.add(detection_result)
            db.commit()
            db.refresh(detection_result)

            # 개별 감지된 객체들 저장
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

            # 저장된 이미지 경로와 감지 결과 반환
            return JSONResponse(content={
                "image_path": image_path,
                "detections": detections
            })
    except Exception as e:
        print(f"Error during model inference: {e}")
        raise HTTPException(status_code=500, detail=f"Model inference error: {e}")

    return JSONResponse(content={"detections": detections})


@router.get("/history/")
async def get_detection_history(db: Session = Depends(get_db)):
    """
    감지 이력 반환
    """
    results = db.query(DetectionResult).all()

    history = []
    for result in results:
        detections = db.query(Detection).filter(Detection.result_id == result.id).all()
        detection_details = [
            {
                "class_name": detection.class_name,
                "confidence": detection.confidence,
                "coordinates": [detection.x1, detection.y1, detection.x2, detection.y2]
            }
            for detection in detections
        ]
        history.append({
            "image_path": result.image_path,
            "created_at": result.create_at,  # 'create_at' 데이터 처리
            "detections": detection_details
        })

    return {"history": history}
