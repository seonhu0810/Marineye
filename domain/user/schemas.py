from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password:str
    confirm_password: str

class UserLogin(BaseModel):
    email: str
    password: str