import io
from fastapi import APIRouter, UploadFile, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from PIL import Image, ImageDraw
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
            results = results[0]

        # 감지 결과 처리
        detections = []
        if results.boxes:
            # 바운딩 박스를 그리기 위한 ImageDraw 객체
            draw = ImageDraw.Draw(image)

            for box in results.boxes:
                class_name = results.names[int(box.cls[0])]
                confidence = float(box.conf[0])
                x1, y1, x2, y2 = box.xyxy[0]

                # 바운딩 박스 그리기
                draw.rectangle([x1, y1, x2, y2], outline="red", width=3)
                draw.text((x1, y1), f"{class_name} {confidence:.2f}", fill="red")

                # 감지된 결과 추가
                detections.append({
                    "class": class_name,
                    "confidence": confidence,
                    "coordinates": [x1, y1, x2, y2]
                })

            # 이미지 수정 후 메모리로 저장
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format="JPEG")
            img_byte_arr.seek(0)

            # 이미지와 JSON 응답을 함께 반환
            return StreamingResponse(img_byte_arr, media_type="image/jpeg",
                                     headers={"Content-Disposition": "inline; filename=result.jpg"})
    except Exception as e:
        print(f"Error during model inference: {e}")
        raise HTTPException(status_code=500, detail=f"Model inference error: {e}")

    # 감지 결과 반환
    return JSONResponse(content={"detections": detections})
