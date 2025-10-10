from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from datetime import datetime, timedelta
from app.models import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password

def get_user(db: Session, user_id: int) -> Optional[User]:
    """Получить пользователя по ID"""
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Получить пользователя по email"""
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """Получить пользователя по username"""
    return db.query(User).filter(User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Получить список пользователей"""
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate) -> User:
    """Создать нового пользователя"""
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        ign=user.ign,
        current_rank=user.current_rank,
        main_heroes=user.main_heroes
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
    """Обновить пользователя"""
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    update_data = user_update.model_dump(exclude_unset=True)
    
    # Если обновляется пароль, нужно его захешировать
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data["password"])
        del update_data["password"]
    
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int) -> bool:
    """Удалить пользователя"""
    db_user = get_user(db, user_id)
    if not db_user:
        return False
    
    db.delete(db_user)
    db.commit()
    return True

def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """Аутентификация пользователя"""
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def get_user_stats(db: Session) -> dict:
    """Получить статистику пользователей"""
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    content_creators = db.query(User).filter(User.role == "Content Creator").count()
    moderators = db.query(User).filter(User.role == "Moderator").count()
    admins = db.query(User).filter(User.role == "Admin").count()
    
    # Новые пользователи за сегодня
    today = datetime.now().date()
    new_users_today = db.query(User).filter(
        func.date(User.created_at) == today
    ).count()
    
    # Новые пользователи за неделю
    week_ago = datetime.now() - timedelta(days=7)
    new_users_this_week = db.query(User).filter(
        User.created_at >= week_ago
    ).count()
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "content_creators": content_creators,
        "moderators": moderators,
        "admins": admins,
        "new_users_today": new_users_today,
        "new_users_this_week": new_users_this_week
    }

def search_users(db: Session, query: str, limit: int = 10) -> List[User]:
    """Поиск пользователей"""
    return (
        db.query(User)
        .filter(
            User.username.ilike(f"%{query}%") |
            User.ign.ilike(f"%{query}%")
        )
        .limit(limit)
        .all()
    )

def get_users_by_role(db: Session, role: str, skip: int = 0, limit: int = 20) -> List[User]:
    """Получить пользователей по роли"""
    return (
        db.query(User)
        .filter(User.role == role)
        .offset(skip)
        .limit(limit)
        .all()
    )

def verify_user(db: Session, user_id: int) -> bool:
    """Верифицировать пользователя"""
    user = get_user(db, user_id)
    if not user:
        return False
    
    user.is_verified = True
    db.commit()
    return True

def deactivate_user(db: Session, user_id: int) -> bool:
    """Деактивировать пользователя"""
    user = get_user(db, user_id)
    if not user:
        return False
    
    user.is_active = False
    db.commit()
    return True

def activate_user(db: Session, user_id: int) -> bool:
    """Активировать пользователя"""
    user = get_user(db, user_id)
    if not user:
        return False
    
    user.is_active = True
    db.commit()
    return True

def change_user_role(db: Session, user_id: int, new_role: str) -> bool:
    """Изменить роль пользователя"""
    user = get_user(db, user_id)
    if not user:
        return False
    
    user.role = new_role
    db.commit()
    return True