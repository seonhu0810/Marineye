import io
from fastapi import APIRouter, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
from ultralytics import YOLO

# 라우터 생성
router = APIRouter()

# YOLO 모델 로드
MODEL_PATH = "./models/best.pt"  # 모델 경로를 프로젝트에 맞게 수정하세요.
model = YOLO(MODEL_PATH)


@router.post("/detect/")
async def detect_objects(file: UploadFile):
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
            # 여러 이미지를 처리한 경우 첫 번째 결과를 사용
            results = results[0]

        # 디버깅: 모델 출력 확인
        print(f"Results: {results}")
        print(f"Boxes: {results.boxes}")  # 바운딩 박스 출력

        # 감지 결과 처리
        detections = []
        if results.boxes:  # 감지된 바운딩 박스가 있을 경우
            for box in results.boxes:
                detection = {
                    "class": results.names[int(box.cls[0])],  # 클래스 이름
                    "confidence": float(box.conf[0]),  # 신뢰도
                    "coordinates": [  # 바운딩 박스 좌표
                        float(box.xyxy[0][0]),  # x1
                        float(box.xyxy[0][1]),  # y1
                        float(box.xyxy[0][2]),  # x2
                        float(box.xyxy[0][3])   # y2
                    ]
                }
                detections.append(detection)
    except Exception as e:
        print(f"Error during model inference: {e}")  # 디버깅용 예외 출력
        raise HTTPException(status_code=500, detail=f"Model inference error: {e}")

    # 감지 결과 반환
    return JSONResponse(content={"detections": detections})


