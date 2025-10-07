from sqlalchemy.orm import Session
from sqlalchemy import func, desc, distinct
from typing import List, Optional
from app.models import News
from app.schemas.news import NewsCreate, NewsUpdate

def get_news(db: Session, news_id: int) -> Optional[News]:
    """Получить новость по ID"""
    return db.query(News).filter(News.id == news_id).first()

def get_news_list(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    category: Optional[str] = None,
    featured: Optional[bool] = None
) -> List[News]:
    """Получить список новостей с фильтрацией"""
    query = db.query(News).filter(News.is_published == True)
    
    if category:
        query = query.filter(News.category == category)
    
    if featured is not None:
        query = query.filter(News.is_featured == featured)
    
    return query.order_by(desc(News.created_at)).offset(skip).limit(limit).all()

def create_news(db: Session, news: NewsCreate, author_id: int) -> News:
    """Создать новую новость"""
    news_data = news.dict()
    news_data["author_id"] = author_id
    
    db_news = News(**news_data)
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    return db_news

def update_news(db: Session, news_id: int, news_update: NewsUpdate) -> Optional[News]:
    """Обновить новость"""
    db_news = get_news(db, news_id)
    if not db_news:
        return None
    
    update_data = news_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_news, field, value)
    
    db.commit()
    db.refresh(db_news)
    return db_news

def delete_news(db: Session, news_id: int) -> bool:
    """Удалить новость"""
    db_news = get_news(db, news_id)
    if not db_news:
        return False
    
    db.delete(db_news)
    db.commit()
    return True

def increment_views(db: Session, news_id: int) -> bool:
    """Увеличить счетчик просмотров"""
    db_news = get_news(db, news_id)
    if not db_news:
        return False
    
    db_news.views += 1
    db.commit()
    return True

def get_featured_news(db: Session, limit: int = 5) -> List[News]:
    """Получить рекомендуемые новости"""
    return (
        db.query(News)
        .filter(News.is_published == True, News.is_featured == True)
        .order_by(desc(News.created_at))
        .limit(limit)
        .all()
    )

def get_latest_news(db: Session, limit: int = 10) -> List[News]:
    """Получить последние новости"""
    return (
        db.query(News)
        .filter(News.is_published == True)
        .order_by(desc(News.created_at))
        .limit(limit)
        .all()
    )

def get_news_categories(db: Session) -> List[str]:
    """Получить список категорий новостей"""
    categories = db.query(distinct(News.category)).filter(News.category.isnot(None)).all()
    return [category[0] for category in categories]

def search_news(db: Session, query: str, limit: int = 20) -> List[News]:
    """Поиск новостей"""
    return (
        db.query(News)
        .filter(
            News.is_published == True,
            News.title.ilike(f"%{query}%") | 
            News.content.ilike(f"%{query}%") |
            News.summary.ilike(f"%{query}%")
        )
        .order_by(desc(News.created_at))
        .limit(limit)
        .all()
    )

def get_news_by_category(db: Session, category: str, limit: int = 10) -> List[News]:
    """Получить новости по категории"""
    return (
        db.query(News)
        .filter(News.category == category, News.is_published == True)
        .order_by(desc(News.created_at))
        .limit(limit)
        .all()
    )

def get_news_stats(db: Session) -> dict:
    """Получить статистику по новостям"""
    total_news = db.query(News).count()
    published_news = db.query(News).filter(News.is_published == True).count()
    featured_news = db.query(News).filter(News.is_featured == True).count()
    
    # Статистика по категориям
    category_stats = {}
    categories = db.query(News.category, func.count(News.id)).group_by(News.category).all()
    for category, count in categories:
        if category:
            category_stats[category] = count
    
    # Общее количество просмотров
    total_views = db.query(func.sum(News.views)).scalar() or 0
    
    # Среднее количество просмотров на новость
    avg_views = db.query(func.avg(News.views)).scalar() or 0.0
    
    # Самые популярные новости
    most_popular = (
        db.query(News.title)
        .filter(News.is_published == True)
        .order_by(desc(News.views))
        .limit(5)
        .all()
    )
    
    return {
        "total_news": total_news,
        "published_news": published_news,
        "featured_news": featured_news,
        "news_by_category": category_stats,
        "total_views": total_views,
        "avg_views_per_news": float(avg_views),
        "most_popular_news": [news[0] for news in most_popular]
    }