from sys import prefix

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from views import router as user_router
from database import Base, engine

app = FastAPI()

origins = [
    "http://localhost:5173",    # 또는 "http://localhost:5173"
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
app.include_router(user_router, prefix="/api/users")

@app.get("/hello")
def hello():
    return {"message": "Marineye"}

