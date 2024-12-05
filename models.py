
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    detection_results = relationship("DetectionResult", back_populates="user")

class DetectionResult(Base):
    __tablename__ = "detection_results"

    id = Column(Integer, primary_key=True, index=True)
    image_path = Column(String, nullable=False) # 저장된 이미지 경로
    create_at = Column(DateTime, default=datetime.utcnow)   # 생성 시간
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="detection_results")
    detections = relationship("Detection", back_populates="result")

class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    class_name = Column(String, nullable=False)     # 감지된 객체 클래스
    confidence = Column(Float, nullable=False)
    x1 = Column(Float, nullable=False)
    y1 = Column(Float, nullable=False)
    x2 = Column(Float, nullable=False)
    y2 = Column(Float, nullable=False)
    result_id = Column(Integer, ForeignKey("detection_results.id"))
    result = relationship("DetectionResult", back_populates="detections")


