from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from models import TokenBlacklist
from database import get_db

security = HTTPBearer()

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials

    # 블랙리스트 확인
    if db.query(TokenBlacklist).filter(TokenBlacklist.token == token).first():
        raise HTTPException(status_code=401, detail="Token is blacklisted")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    return user_id
