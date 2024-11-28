from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """비밀번호를 bcrypt로 암호화합니다."""
    return pwd_context.hash(password)

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from domain.user.schemas import UserCreate
from models import User
from database import get_db

router = APIRouter()

@router.post("/register")
def register_user(user:UserCreate, db: Session=Depends(get_db)):
    """회원가입 엔드포인트"""
    # 이메일 중복 확인
    if db.query(User).filter(User.email==user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # 새로운 유저 생성
    new_user = User(
        username=user.username,
        email=user.email,
        hash_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user) # 새로 저장된 유저 정보 반환
    return {"message": "User created successfully", "user_id": new_user.id}
