from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from domain.user.schemas import UserCreate, UserLogin
from models import User
from database import get_db
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt  # PyJWT를 사용

# 비밀번호 암호화 및 인증을 위한 설정
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()

# 비밀번호 확인 함수
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# 비밀번호 해싱 함수
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# JWT 토큰 생성 함수
def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)  # PyJWT로 수정
    return encoded_jwt

@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """회원가입 엔드포인트"""
    # 이메일 중복 확인
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # 비밀번호 확인
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # 새로운 유저 생성
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully", "user_id": new_user.id}

@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    print(f"User found: {db_user}")  # db_user가 제대로 조회되는지 확인

    if db_user is None or not verify_password(user.password, db_user.hashed_password):
        print("Invalid credentials")  # 잘못된 비밀번호나 이메일 처리 여부 확인
        raise HTTPException(status_code=400, detail="Invalid email or password")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}
