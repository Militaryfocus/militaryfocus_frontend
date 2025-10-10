from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, get_current_active_user, get_current_admin_user
from app.models import User

# Переэкспорт зависимостей для удобства
def get_current_user_dependency():
    return Depends(get_current_user)

def get_current_active_user_dependency():
    return Depends(get_current_active_user)

def get_current_admin_user_dependency():
    return Depends(get_current_admin_user)

def get_db_dependency():
    return Depends(get_db)