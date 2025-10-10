from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from app.models import BuildGuide, GuideRating, Comment
from app.schemas.guide import GuideCreate, GuideUpdate

def get_guide(db: Session, guide_id: int) -> Optional[BuildGuide]:
    """Получить гайд по ID"""
    return db.query(BuildGuide).filter(BuildGuide.id == guide_id).first()

def get_guides(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    hero_id: Optional[int] = None,
    author_id: Optional[int] = None,
    difficulty: Optional[str] = None,
    play_style: Optional[str] = None,
    tags: Optional[str] = None
) -> List[BuildGuide]:
    """Получить список гайдов с фильтрацией"""
    query = db.query(BuildGuide).filter(BuildGuide.is_published == True)
    
    if hero_id:
        query = query.filter(BuildGuide.hero_id == hero_id)
    
    if author_id:
        query = query.filter(BuildGuide.author_id == author_id)
    
    if difficulty:
        query = query.filter(BuildGuide.difficulty == difficulty)
    
    if play_style:
        query = query.filter(BuildGuide.play_style == play_style)
    
    if tags:
        # Поиск по тегам (упрощенная версия)
        query = query.filter(BuildGuide.tags.contains([tags]))
    
    return query.order_by(desc(BuildGuide.rating)).offset(skip).limit(limit).all()

def create_guide(db: Session, guide: GuideCreate, author_id: int) -> BuildGuide:
    """Создать новый гайд"""
    guide_data = guide.model_dump()
    guide_data["author_id"] = author_id
    
    db_guide = BuildGuide(**guide_data)
    db.add(db_guide)
    db.commit()
    db.refresh(db_guide)
    return db_guide

def update_guide(db: Session, guide_id: int, guide_update: GuideUpdate) -> Optional[BuildGuide]:
    """Обновить гайд"""
    db_guide = get_guide(db, guide_id)
    if not db_guide:
        return None
    
    update_data = guide_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_guide, field, value)
    
    db.commit()
    db.refresh(db_guide)
    return db_guide

def delete_guide(db: Session, guide_id: int) -> bool:
    """Удалить гайд"""
    db_guide = get_guide(db, guide_id)
    if not db_guide:
        return False
    
    db.delete(db_guide)
    db.commit()
    return True

def increment_views(db: Session, guide_id: int) -> bool:
    """Увеличить счетчик просмотров"""
    db_guide = get_guide(db, guide_id)
    if not db_guide:
        return False
    
    db_guide.views += 1
    db.commit()
    return True

def rate_guide(
    db: Session, 
    guide_id: int, 
    user_id: int, 
    rating: int, 
    review: Optional[str] = None
) -> dict:
    """Оценить гайд"""
    # Проверить, не оценивал ли пользователь уже этот гайд
    existing_rating = db.query(GuideRating).filter(
        GuideRating.guide_id == guide_id,
        GuideRating.user_id == user_id
    ).first()
    
    if existing_rating:
        # Обновить существующую оценку
        existing_rating.rating = rating
        existing_rating.review = review
        db.commit()
    else:
        # Создать новую оценку
        new_rating = GuideRating(
            guide_id=guide_id,
            user_id=user_id,
            rating=rating,
            review=review
        )
        db.add(new_rating)
        db.commit()
    
    # Пересчитать средний рейтинг гайда
    guide = get_guide(db, guide_id)
    if guide:
        ratings = db.query(GuideRating).filter(GuideRating.guide_id == guide_id).all()
        if ratings:
            avg_rating = sum(r.rating for r in ratings) / len(ratings)
            guide.rating = avg_rating
            guide.rating_count = len(ratings)
            db.commit()
    
    return {"message": "Guide rated successfully", "rating": rating}

def like_guide(db: Session, guide_id: int, user_id: int) -> dict:
    """Лайкнуть гайд"""
    guide = get_guide(db, guide_id)
    if not guide:
        return {"error": "Guide not found"}
    
    # Проверить, не лайкал ли пользователь уже этот гайд
    # В реальном приложении здесь должна быть таблица лайков
    # Пока что просто увеличиваем счетчик
    guide.likes += 1
    db.commit()
    
    return {"message": "Guide liked successfully", "likes": guide.likes}

def get_guide_comments(
    db: Session, 
    guide_id: int, 
    skip: int = 0, 
    limit: int = 20
) -> List[Comment]:
    """Получить комментарии к гайду"""
    return (
        db.query(Comment)
        .filter(Comment.guide_id == guide_id, Comment.is_approved == True)
        .order_by(desc(Comment.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_trending_guides(db: Session, skip: int = 0, limit: int = 10) -> List[BuildGuide]:
    """Получить популярные гайды"""
    return (
        db.query(BuildGuide)
        .filter(BuildGuide.is_published == True)
        .order_by(desc(BuildGuide.views), desc(BuildGuide.likes))
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_latest_guides(db: Session, skip: int = 0, limit: int = 10) -> List[BuildGuide]:
    """Получить последние гайды"""
    return (
        db.query(BuildGuide)
        .filter(BuildGuide.is_published == True)
        .order_by(desc(BuildGuide.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_guides_by_hero(db: Session, hero_id: int, limit: int = 5) -> List[BuildGuide]:
    """Получить гайды для конкретного героя"""
    return (
        db.query(BuildGuide)
        .filter(BuildGuide.hero_id == hero_id, BuildGuide.is_published == True)
        .order_by(desc(BuildGuide.rating))
        .limit(limit)
        .all()
    )

def get_user_guides(db: Session, user_id: int, skip: int = 0, limit: int = 20) -> List[BuildGuide]:
    """Получить гайды пользователя"""
    return (
        db.query(BuildGuide)
        .filter(BuildGuide.author_id == user_id)
        .order_by(desc(BuildGuide.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )

def search_guides(db: Session, query: str, limit: int = 10) -> List[BuildGuide]:
    """Поиск гайдов по заголовку или описанию"""
    return (
        db.query(BuildGuide)
        .filter(
            BuildGuide.is_published == True,
            BuildGuide.title.ilike(f"%{query}%") | BuildGuide.description.ilike(f"%{query}%")
        )
        .order_by(desc(BuildGuide.rating))
        .limit(limit)
        .all()
    )

def get_guide_stats(db: Session) -> dict:
    """Получить статистику по гайдам"""
    total_guides = db.query(BuildGuide).count()
    published_guides = db.query(BuildGuide).filter(BuildGuide.is_published == True).count()
    
    # Статистика по сложности
    difficulty_stats = {}
    difficulties = db.query(BuildGuide.difficulty, func.count(BuildGuide.id)).group_by(BuildGuide.difficulty).all()
    for diff, count in difficulties:
        difficulty_stats[diff] = count
    
    # Статистика по стилю игры
    play_style_stats = {}
    styles = db.query(BuildGuide.play_style, func.count(BuildGuide.id)).group_by(BuildGuide.play_style).all()
    for style, count in styles:
        play_style_stats[style] = count
    
    # Средний рейтинг
    avg_rating = db.query(func.avg(BuildGuide.rating)).scalar() or 0.0
    
    return {
        "total_guides": total_guides,
        "published_guides": published_guides,
        "guides_by_difficulty": difficulty_stats,
        "guides_by_play_style": play_style_stats,
        "avg_rating": float(avg_rating)
    }