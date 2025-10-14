"""
Health Check API endpoints
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
import redis
import psycopg2
from app.core.config import settings

router = APIRouter()

@router.get("/")
async def health_check():
    """Базовый health check"""
    return {
        "status": "healthy",
        "service": "Mobile Legends Community Platform",
        "version": "1.0.0"
    }

@router.get("/detailed")
async def detailed_health_check(db: Session = Depends(get_db)):
    """Детальный health check с проверкой всех сервисов"""
    health_status = {
        "status": "healthy",
        "service": "Mobile Legends Community Platform",
        "version": "1.0.0",
        "checks": {}
    }
    
    # Проверка базы данных
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        health_status["checks"]["database"] = {
            "status": "healthy",
            "message": "PostgreSQL connection successful"
        }
    except Exception as e:
        health_status["checks"]["database"] = {
            "status": "unhealthy",
            "message": f"PostgreSQL connection failed: {str(e)}"
        }
        health_status["status"] = "unhealthy"
    
    # Проверка Redis
    try:
        r = redis.from_url(settings.REDIS_URL)
        r.ping()
        health_status["checks"]["redis"] = {
            "status": "healthy",
            "message": "Redis connection successful"
        }
    except Exception as e:
        health_status["checks"]["redis"] = {
            "status": "unhealthy",
            "message": f"Redis connection failed: {str(e)}"
        }
        health_status["status"] = "unhealthy"
    
    # Проверка количества записей в базе
    try:
        from app.models import User, Hero, Item, Emblem, News
        health_status["checks"]["data"] = {
            "status": "healthy",
            "message": "Data access successful",
            "counts": {
                "users": db.query(User).count(),
                "heroes": db.query(Hero).count(),
                "items": db.query(Item).count(),
                "emblems": db.query(Emblem).count(),
                "news": db.query(News).count()
            }
        }
    except Exception as e:
        health_status["checks"]["data"] = {
            "status": "unhealthy",
            "message": f"Data access failed: {str(e)}"
        }
        health_status["status"] = "unhealthy"
    
    return health_status