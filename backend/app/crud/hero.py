from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from typing import List, Optional
from app.models import Hero, HeroCounter, HeroSynergy, BuildGuide
from app.schemas.hero import HeroCreate, HeroUpdate

def get_hero(db: Session, hero_id: int) -> Optional[Hero]:
    """Получить героя по ID"""
    return db.query(Hero).filter(Hero.id == hero_id).first()

def get_hero_by_name(db: Session, name: str) -> Optional[Hero]:
    """Получить героя по имени"""
    return db.query(Hero).filter(Hero.name == name).first()

def get_heroes(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    role: Optional[str] = None,
    search: Optional[str] = None
) -> List[Hero]:
    """Получить список героев с фильтрацией"""
    query = db.query(Hero)
    
    if role:
        query = query.filter(Hero.role == role)
    
    if search:
        query = query.filter(Hero.name.ilike(f"%{search}%"))
    
    return query.offset(skip).limit(limit).all()

def create_hero(db: Session, hero: HeroCreate) -> Hero:
    """Создать нового героя"""
    db_hero = Hero(**hero.model_dump())
    db.add(db_hero)
    db.commit()
    db.refresh(db_hero)
    return db_hero

def update_hero(db: Session, hero_id: int, hero_update: HeroUpdate) -> Optional[Hero]:
    """Обновить героя"""
    db_hero = get_hero(db, hero_id)
    if not db_hero:
        return None
    
    update_data = hero_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_hero, field, value)
    
    db.commit()
    db.refresh(db_hero)
    return db_hero

def delete_hero(db: Session, hero_id: int) -> bool:
    """Удалить героя"""
    db_hero = get_hero(db, hero_id)
    if not db_hero:
        return False
    
    db.delete(db_hero)
    db.commit()
    return True

def get_hero_counters(db: Session, hero_id: int) -> List[HeroCounter]:
    """Получить контрпики для героя"""
    return db.query(HeroCounter).filter(HeroCounter.hero_id == hero_id).all()

def get_hero_synergies(db: Session, hero_id: int) -> List[HeroSynergy]:
    """Получить союзников для героя"""
    return db.query(HeroSynergy).filter(HeroSynergy.hero_id == hero_id).all()

def get_hero_guides(db: Session, hero_id: int, skip: int = 0, limit: int = 20) -> List[BuildGuide]:
    """Получить гайды для героя"""
    return (
        db.query(BuildGuide)
        .filter(BuildGuide.hero_id == hero_id, BuildGuide.is_published == True)
        .order_by(BuildGuide.rating.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_hero_roles(db: Session) -> List[str]:
    """Получить список всех ролей героев"""
    roles = db.query(distinct(Hero.role)).all()
    return [role[0] for role in roles]

def get_heroes_stats(db: Session) -> dict:
    """Получить общую статистику по героям"""
    total_heroes = db.query(Hero).count()
    
    # Подсчет героев по ролям
    roles_count = {}
    roles = get_hero_roles(db)
    for role in roles:
        count = db.query(Hero).filter(Hero.role == role).count()
        roles_count[role] = count
    
    # Средние показатели
    avg_stats = db.query(
        func.avg(Hero.win_rate),
        func.avg(Hero.pick_rate)
    ).first()
    
    # Самые популярные герои
    most_picked = (
        db.query(Hero.name)
        .order_by(Hero.pick_rate.desc())
        .limit(5)
        .all()
    )
    
    # Герои с самым высоким винрейтом
    highest_win_rate = (
        db.query(Hero.name)
        .order_by(Hero.win_rate.desc())
        .limit(5)
        .all()
    )
    
    return {
        "total_heroes": total_heroes,
        "roles_count": roles_count,
        "avg_win_rate": float(avg_stats[0]) if avg_stats[0] else 0.0,
        "avg_pick_rate": float(avg_stats[1]) if avg_stats[1] else 0.0,
        "most_picked": [hero[0] for hero in most_picked],
        "highest_win_rate": [hero[0] for hero in highest_win_rate]
    }

def search_heroes(db: Session, query: str, limit: int = 10) -> List[Hero]:
    """Поиск героев по имени или специальности"""
    return (
        db.query(Hero)
        .filter(
            Hero.name.ilike(f"%{query}%") | 
            Hero.specialty.ilike(f"%{query}%")
        )
        .limit(limit)
        .all()
    )