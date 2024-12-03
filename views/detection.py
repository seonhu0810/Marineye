import io
from fastapi import APIRouter, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
import torch

router = APIRouter()

# YOLO 모델 로드
MODEL_PATH = "path/to/your/best.pt"  # 실제 경로로 교체
model = torch.hub.load("ultralytics/yolov5", "custom", path=MODEL_PATH)


@router.post("/detect/")
async def detect_objects(file: UploadFile):
    """객체 인식을 수행하는 API 엔드포인트"""
    try:
        # 파일을 PIL Image로 변환
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {e}")

    # 모델에 이미지 전달
    results = model(image)
    detections = results.pandas().xyxy[0].to_dict(orient="records")

    return JSONResponse(content={"detections": detections})
