from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models import BuildGuide, User
from app.schemas.guide import GuideResponse, GuideCreate, GuideUpdate, GuideDetail
from app.crud import guide as guide_crud
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[GuideResponse])
async def get_guides(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    hero_id: Optional[int] = Query(None),
    author_id: Optional[int] = Query(None),
    difficulty: Optional[str] = Query(None),
    play_style: Optional[str] = Query(None),
    tags: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Получить список гайдов с фильтрацией"""
    guides = guide_crud.get_guides(
        db=db,
        skip=skip,
        limit=limit,
        hero_id=hero_id,
        author_id=author_id,
        difficulty=difficulty,
        play_style=play_style,
        tags=tags
    )
    return guides

@router.post("/", response_model=GuideResponse)
async def create_guide(
    guide: GuideCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новый гайд"""
    return guide_crud.create_guide(db=db, guide=guide, author_id=current_user.id)

@router.get("/{guide_id}", response_model=GuideDetail)
async def get_guide(guide_id: int, db: Session = Depends(get_db)):
    """Получить детальную информацию о гайде"""
    guide = guide_crud.get_guide(db=db, guide_id=guide_id)
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    
    # Увеличить счетчик просмотров
    guide_crud.increment_views(db=db, guide_id=guide_id)
    
    return guide

@router.put("/{guide_id}", response_model=GuideResponse)
async def update_guide(
    guide_id: int,
    guide_update: GuideUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновить гайд"""
    guide = guide_crud.get_guide(db=db, guide_id=guide_id)
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    
    # Проверить права на редактирование
    if guide.author_id != current_user.id and current_user.role not in ["Moderator", "Admin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return guide_crud.update_guide(db=db, guide_id=guide_id, guide_update=guide_update)

@router.delete("/{guide_id}")
async def delete_guide(
    guide_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить гайд"""
    guide = guide_crud.get_guide(db=db, guide_id=guide_id)
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    
    # Проверить права на удаление
    if guide.author_id != current_user.id and current_user.role not in ["Moderator", "Admin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    success = guide_crud.delete_guide(db=db, guide_id=guide_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete guide")
    
    return {"message": "Guide deleted successfully"}

@router.post("/{guide_id}/rate")
async def rate_guide(
    guide_id: int,
    rating: int,
    review: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Оценить гайд"""
    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    guide = guide_crud.get_guide(db=db, guide_id=guide_id)
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    
    return guide_crud.rate_guide(
        db=db, 
        guide_id=guide_id, 
        user_id=current_user.id, 
        rating=rating, 
        review=review
    )

@router.post("/{guide_id}/like")
async def like_guide(
    guide_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Лайкнуть гайд"""
    guide = guide_crud.get_guide(db=db, guide_id=guide_id)
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    
    return guide_crud.like_guide(db=db, guide_id=guide_id, user_id=current_user.id)

@router.get("/{guide_id}/comments")
async def get_guide_comments(
    guide_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Получить комментарии к гайду"""
    guide = guide_crud.get_guide(db=db, guide_id=guide_id)
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    
    comments = guide_crud.get_guide_comments(
        db=db, 
        guide_id=guide_id, 
        skip=skip, 
        limit=limit
    )
    return comments

@router.get("/trending/")
async def get_trending_guides(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Получить популярные гайды"""
    guides = guide_crud.get_trending_guides(db=db, skip=skip, limit=limit)
    return guides

@router.get("/latest/")
async def get_latest_guides(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Получить последние гайды"""
    guides = guide_crud.get_latest_guides(db=db, skip=skip, limit=limit)
    return guides