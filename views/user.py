from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from database import get_db
from models import User, TokenBlacklist
from domain.user.schemas import UserCreate, UserLogin
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# 비밀번호 암호화 및 인증을 위한 설정
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()
security = HTTPBearer()

# 비밀번호 확인
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# 비밀번호 해싱
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# JWT 토큰 생성
def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# JWT 토큰 검증
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    if db.query(TokenBlacklist).filter(TokenBlacklist.token == token).first():
        raise HTTPException(status_code=401, detail="Token is blacklisted")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")  # "user_id"로 수정
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    return user_id



# Register route
@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """회원가입 엔드포인트"""
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully", "user_id": new_user.id}


# Login route
@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user is None or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if db_user:
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": db_user.email, "user_id": db_user.id},
            expires_delta=access_token_expires
        )
        username = db_user.email.split('@')[0] if db_user.email else "Unknown"
        return {"access_token": access_token, "username": username, "token_type": "bearer"}


# Logout route
@router.post("/logout")
def logout(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing token")

    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    if db.query(TokenBlacklist).filter(TokenBlacklist.token == token).first():
        return {"message": "Token already logged out"}

    blacklist_entry = TokenBlacklist(token=token)
    db.add(blacklist_entry)
    db.commit()

    return {"message": "Successfully logged out"}




# Profile route
@router.get("/profile")
def read_profile(
    current_user: int = Depends(get_current_user), db: Session = Depends(get_db)
):
    """사용자 프로필 조회"""
    user = db.query(User).filter(User.id == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "email": user.email, "username": user.username}
