from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models import News, User
from app.schemas.news import NewsResponse, NewsCreate, NewsUpdate, NewsDetail
from app.crud import news as news_crud
from app.core.security import get_current_user, get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[NewsResponse])
async def get_news(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    """Получить список новостей"""
    news = news_crud.get_news(
        db=db,
        skip=skip,
        limit=limit,
        category=category,
        featured=featured
    )
    return news

@router.post("/", response_model=NewsResponse)
async def create_news(
    news: NewsCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Создать новую новость (только для админов)"""
    return news_crud.create_news(db=db, news=news, author_id=current_user.id)

@router.get("/{news_id}", response_model=NewsDetail)
async def get_news_detail(news_id: int, db: Session = Depends(get_db)):
    """Получить детальную информацию о новости"""
    news = news_crud.get_news(db=db, news_id=news_id)
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    
    # Увеличить счетчик просмотров
    news_crud.increment_views(db=db, news_id=news_id)
    
    return news

@router.put("/{news_id}", response_model=NewsResponse)
async def update_news(
    news_id: int,
    news_update: NewsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Обновить новость (только для админов)"""
    news = news_crud.update_news(db=db, news_id=news_id, news_update=news_update)
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    
    return news

@router.delete("/{news_id}")
async def delete_news(
    news_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Удалить новость (только для админов)"""
    success = news_crud.delete_news(db=db, news_id=news_id)
    if not success:
        raise HTTPException(status_code=404, detail="News not found")
    
    return {"message": "News deleted successfully"}

@router.get("/featured/", response_model=List[NewsResponse])
async def get_featured_news(
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Получить рекомендуемые новости"""
    news = news_crud.get_featured_news(db=db, limit=limit)
    return news

@router.get("/latest/", response_model=List[NewsResponse])
async def get_latest_news(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Получить последние новости"""
    news = news_crud.get_latest_news(db=db, limit=limit)
    return news

@router.get("/categories/list")
async def get_news_categories(db: Session = Depends(get_db)):
    """Получить список категорий новостей"""
    categories = news_crud.get_news_categories(db=db)
    return {"categories": categories}