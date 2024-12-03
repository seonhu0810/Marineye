from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from views.user import router as user_router
from views.detection import router as detection_router
from database import Base, engine

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

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# 라우터 등록
app.include_router(user_router, prefix="/api/users", tags=["users"])
app.include_router(detection_router, prefix="/api/detection", tags=["detection"])

@app.get("/")
def read_root():
    return {"message": "Marineye Object Detection Service"}

@app.get("/hello")
def hello():
    return {"message": "Marineye"}
