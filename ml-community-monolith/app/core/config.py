from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional
import os

class Settings(BaseSettings):
    # Database
    # Database: ml_community
    # User: ml_admin
    # Password: ML_Community_2024!
    # Host: localhost (development) / db (docker)
    DATABASE_URL: str = "postgresql://ml_admin:ML_Community_2024!@localhost:5432/ml_community"
    
    # Redis
    # Host: localhost (development) / redis (docker)
    REDIS_URL: str = "redis://localhost:6379"
    
    # Security
    SECRET_KEY: str = Field(default="ML_Community_Super_Secret_Key_2024_Change_In_Production_At_Least_32_Chars", min_length=32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, ge=1, le=1440)
    
    # CORS
    ALLOWED_ORIGINS: list = ["http://localhost:3000", "http://localhost:8000", "http://127.0.0.1:8000"]
    
    # File Upload
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    UPLOAD_DIR: str = "static/uploads"
    ALLOWED_EXTENSIONS: set = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    # ML Official API
    ML_OFFICIAL_API_URL: str = "https://api.mobilelegends.com"
    ML_OFFICIAL_API_KEY: str = ""
    
    # Database Connection Pool Settings
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 3600
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Global settings instance
settings = Settings()