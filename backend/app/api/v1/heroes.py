from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models import Hero, HeroCounter, HeroSynergy
from app.schemas.hero import HeroResponse, HeroDetail, HeroCounterResponse
from app.crud import hero as hero_crud

router = APIRouter()

@router.get("/", response_model=List[HeroResponse])
async def get_heroes(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    role: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Получить список всех героев с фильтрацией"""
    try:
        heroes = hero_crud.get_heroes(
            db=db, 
            skip=skip, 
            limit=limit, 
            role=role, 
            search=search
        )
        return heroes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{hero_id}", response_model=HeroDetail)
async def get_hero(hero_id: int, db: Session = Depends(get_db)):
    """Получить детальную информацию о герое"""
    hero = hero_crud.get_hero(db=db, hero_id=hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    return hero

@router.get("/{hero_id}/counters", response_model=List[HeroCounterResponse])
async def get_hero_counters(hero_id: int, db: Session = Depends(get_db)):
    """Получить контрпики для героя"""
    hero = hero_crud.get_hero(db=db, hero_id=hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    
    counters = hero_crud.get_hero_counters(db=db, hero_id=hero_id)
    return counters

@router.get("/{hero_id}/synergies", response_model=List[HeroCounterResponse])
async def get_hero_synergies(hero_id: int, db: Session = Depends(get_db)):
    """Получить союзников для героя"""
    hero = hero_crud.get_hero(db=db, hero_id=hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    
    synergies = hero_crud.get_hero_synergies(db=db, hero_id=hero_id)
    return synergies

@router.get("/{hero_id}/guides")
async def get_hero_guides(
    hero_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Получить гайды для героя"""
    hero = hero_crud.get_hero(db=db, hero_id=hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    
    guides = hero_crud.get_hero_guides(db=db, hero_id=hero_id, skip=skip, limit=limit)
    return guides

@router.get("/roles/list")
async def get_hero_roles(db: Session = Depends(get_db)):
    """Получить список всех ролей героев"""
    roles = hero_crud.get_hero_roles(db=db)
    return {"roles": roles}

@router.get("/stats/overview")
async def get_heroes_stats(db: Session = Depends(get_db)):
    """Получить общую статистику по героям"""
    stats = hero_crud.get_heroes_stats(db=db)
    return stats