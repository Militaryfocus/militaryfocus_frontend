from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models import Hero, User, BuildGuide
from app.crud import hero as hero_crud, user as user_crud, guide as guide_crud

router = APIRouter()

@router.get("/")
async def search(
    q: str = Query(..., min_length=1, max_length=100),
    type: Optional[str] = Query(None, regex="^(hero|guide|user)$"),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Универсальный поиск по платформе"""
    results = {
        "query": q,
        "total_results": 0,
        "heroes": [],
        "guides": [],
        "users": []
    }
    
    # Поиск героев
    if not type or type == "hero":
        heroes = hero_crud.search_heroes(db=db, query=q, limit=limit)
        results["heroes"] = [
            {
                "id": hero.id,
                "name": hero.name,
                "role": hero.role,
                "specialty": hero.specialty,
                "avatar_url": hero.avatar_url
            }
            for hero in heroes
        ]
    
    # Поиск гайдов
    if not type or type == "guide":
        guides = guide_crud.search_guides(db=db, query=q, limit=limit)
        results["guides"] = [
            {
                "id": guide.id,
                "title": guide.title,
                "description": guide.description,
                "hero_id": guide.hero_id,
                "author_id": guide.author_id,
                "rating": guide.rating,
                "views": guide.views
            }
            for guide in guides
        ]
    
    # Поиск пользователей
    if not type or type == "user":
        users = user_crud.search_users(db=db, query=q, limit=limit)
        results["users"] = [
            {
                "id": user.id,
                "username": user.username,
                "ign": user.ign,
                "role": user.role,
                "current_rank": user.current_rank
            }
            for user in users
        ]
    
    # Подсчет общего количества результатов
    results["total_results"] = len(results["heroes"]) + len(results["guides"]) + len(results["users"])
    
    return results

@router.get("/heroes")
async def search_heroes(
    q: str = Query(..., min_length=1, max_length=100),
    role: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Поиск героев"""
    heroes = hero_crud.search_heroes(db=db, query=q, limit=limit)
    
    # Фильтрация по роли если указана
    if role:
        heroes = [hero for hero in heroes if hero.role == role]
    
    return {
        "query": q,
        "role_filter": role,
        "results": [
            {
                "id": hero.id,
                "name": hero.name,
                "role": hero.role,
                "specialty": hero.specialty,
                "lane": hero.lane,
                "durability": hero.durability,
                "offense": hero.offense,
                "control": hero.control,
                "difficulty": hero.difficulty,
                "win_rate": hero.win_rate,
                "pick_rate": hero.pick_rate,
                "avatar_url": hero.avatar_url
            }
            for hero in heroes
        ],
        "total": len(heroes)
    }

@router.get("/guides")
async def search_guides(
    q: str = Query(..., min_length=1, max_length=100),
    hero_id: Optional[int] = Query(None),
    difficulty: Optional[str] = Query(None),
    play_style: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Поиск гайдов"""
    guides = guide_crud.search_guides(db=db, query=q, limit=limit)
    
    # Дополнительные фильтры
    if hero_id:
        guides = [guide for guide in guides if guide.hero_id == hero_id]
    
    if difficulty:
        guides = [guide for guide in guides if guide.difficulty == difficulty]
    
    if play_style:
        guides = [guide for guide in guides if guide.play_style == play_style]
    
    return {
        "query": q,
        "filters": {
            "hero_id": hero_id,
            "difficulty": difficulty,
            "play_style": play_style
        },
        "results": [
            {
                "id": guide.id,
                "title": guide.title,
                "description": guide.description,
                "hero_id": guide.hero_id,
                "author_id": guide.author_id,
                "difficulty": guide.difficulty,
                "play_style": guide.play_style,
                "rating": guide.rating,
                "views": guide.views,
                "likes": guide.likes,
                "created_at": guide.created_at
            }
            for guide in guides
        ],
        "total": len(guides)
    }

@router.get("/users")
async def search_users(
    q: str = Query(..., min_length=1, max_length=100),
    role: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Поиск пользователей"""
    users = user_crud.search_users(db=db, query=q, limit=limit)
    
    # Фильтрация по роли если указана
    if role:
        users = [user for user in users if user.role == role]
    
    return {
        "query": q,
        "role_filter": role,
        "results": [
            {
                "id": user.id,
                "username": user.username,
                "ign": user.ign,
                "role": user.role,
                "current_rank": user.current_rank,
                "is_active": user.is_active,
                "is_verified": user.is_verified,
                "created_at": user.created_at
            }
            for user in users
        ],
        "total": len(users)
    }

@router.get("/suggestions")
async def get_search_suggestions(
    q: str = Query(..., min_length=1, max_length=50),
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Получить предложения для автодополнения поиска"""
    suggestions = []
    
    # Предложения по героям
    heroes = hero_crud.search_heroes(db=db, query=q, limit=limit)
    for hero in heroes:
        suggestions.append({
            "type": "hero",
            "id": hero.id,
            "text": hero.name,
            "subtitle": f"{hero.role} • {hero.specialty}"
        })
    
    # Предложения по гайдам
    guides = guide_crud.search_guides(db=db, query=q, limit=limit)
    for guide in guides:
        suggestions.append({
            "type": "guide",
            "id": guide.id,
            "text": guide.title,
            "subtitle": f"Guide by {guide.author_id}"
        })
    
    # Предложения по пользователям
    users = user_crud.search_users(db=db, query=q, limit=limit)
    for user in users:
        suggestions.append({
            "type": "user",
            "id": user.id,
            "text": user.username,
            "subtitle": f"{user.role} • {user.ign or 'No IGN'}"
        })
    
    return {
        "query": q,
        "suggestions": suggestions[:limit]
    }