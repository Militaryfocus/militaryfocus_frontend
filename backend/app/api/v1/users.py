from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models import User
from app.schemas.user import UserResponse, UserProfile, UserStats, UserUpdate
from app.crud import user as user_crud
from app.core.security import get_current_user, get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Получить список пользователей (только для админов)"""
    users = user_crud.get_users(db=db, skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=UserProfile)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """Получить профиль пользователя"""
    user = user_crud.get_user(db=db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Здесь можно добавить дополнительную статистику
    return user

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновить профиль пользователя"""
    # Пользователь может обновлять только свой профиль, админы - любой
    if user_id != current_user.id and current_user.role not in ["Admin", "Moderator"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    user = user_crud.update_user(db=db, user_id=user_id, user_update=user_update)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Удалить пользователя (только для админов)"""
    success = user_crud.delete_user(db=db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User deleted successfully"}

@router.get("/{user_id}/guides")
async def get_user_guides(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Получить гайды пользователя"""
    user = user_crud.get_user(db=db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Здесь нужно импортировать guide_crud
    from app.crud import guide as guide_crud
    guides = guide_crud.get_user_guides(db=db, user_id=user_id, skip=skip, limit=limit)
    return guides

@router.get("/{user_id}/stats")
async def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    """Получить статистику пользователя"""
    user = user_crud.get_user(db=db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Здесь можно добавить подсчет статистики пользователя
    return {
        "user_id": user_id,
        "guides_count": 0,  # Заглушка
        "total_views": 0,   # Заглушка
        "total_likes": 0,   # Заглушка
        "average_rating": 0.0  # Заглушка
    }

@router.get("/stats/overview", response_model=UserStats)
async def get_users_overview_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Получить общую статистику пользователей (только для админов)"""
    stats = user_crud.get_user_stats(db=db)
    return stats

@router.post("/{user_id}/verify")
async def verify_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Верифицировать пользователя (только для админов)"""
    success = user_crud.verify_user(db=db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User verified successfully"}

@router.post("/{user_id}/deactivate")
async def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Деактивировать пользователя (только для админов)"""
    success = user_crud.deactivate_user(db=db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User deactivated successfully"}

@router.post("/{user_id}/activate")
async def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Активировать пользователя (только для админов)"""
    success = user_crud.activate_user(db=db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User activated successfully"}

@router.post("/{user_id}/change-role")
async def change_user_role(
    user_id: int,
    new_role: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Изменить роль пользователя (только для админов)"""
    valid_roles = ["User", "Content Creator", "Moderator", "Admin"]
    if new_role not in valid_roles:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    success = user_crud.change_user_role(db=db, user_id=user_id, new_role=new_role)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": f"User role changed to {new_role}"}