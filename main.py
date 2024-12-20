from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from views.user import router as user_router
from views.detection import router as detection_router
from database import Base, engine
from fastapi.staticfiles import StaticFiles  # 정적 파일 서빙 추가
from pathlib import Path

# 이미지 저장 경로 설정
BASE_DIR = Path(__file__).resolve().parent
SAVE_DIR = BASE_DIR / "uploaded_images"
SAVE_DIR.mkdir(parents=True, exist_ok=True)  # 폴더 생성

# FastAPI 앱 생성
app = FastAPI()

# CORS 설정
origins = [
    "http://localhost:5173",  # 프론트엔드 주소
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 정적 파일 서빙 추가
app.mount("/images", StaticFiles(directory=SAVE_DIR), name="images")

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# 라우터 등록
app.include_router(user_router, prefix="/api/users", tags=["users"])
app.include_router(detection_router, prefix="/api/detection", tags=["detection"])

@app.get("/")
def read_root():
    return {"message": "Marineye Object Detection Service"}

# hello 엔드포인트는 테스트용이라면 삭제 가능합니다.
@app.get("/hello")
def hello():
    return {"message": "Marineye"}
