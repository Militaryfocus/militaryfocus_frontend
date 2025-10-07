from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class HeroBase(BaseModel):
    name: str
    role: str
    specialty: str
    lane: List[str]
    durability: Optional[int] = None
    offense: Optional[int] = None
    control: Optional[int] = None
    difficulty: Optional[int] = None
    passive_skill: Optional[Dict[str, Any]] = None
    first_skill: Optional[Dict[str, Any]] = None
    second_skill: Optional[Dict[str, Any]] = None
    ultimate_skill: Optional[Dict[str, Any]] = None
    release_date: Optional[str] = None
    price: Optional[Dict[str, Any]] = None
    image_url: Optional[str] = None
    avatar_url: Optional[str] = None

class HeroCreate(HeroBase):
    pass

class HeroUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    specialty: Optional[str] = None
    lane: Optional[List[str]] = None
    durability: Optional[int] = None
    offense: Optional[int] = None
    control: Optional[int] = None
    difficulty: Optional[int] = None
    passive_skill: Optional[Dict[str, Any]] = None
    first_skill: Optional[Dict[str, Any]] = None
    second_skill: Optional[Dict[str, Any]] = None
    ultimate_skill: Optional[Dict[str, Any]] = None
    release_date: Optional[str] = None
    price: Optional[Dict[str, Any]] = None
    image_url: Optional[str] = None
    avatar_url: Optional[str] = None
    win_rate: Optional[float] = None
    pick_rate: Optional[float] = None
    ban_rate: Optional[float] = None

class HeroResponse(HeroBase):
    id: int
    win_rate: Optional[float] = None
    pick_rate: Optional[float] = None
    ban_rate: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class HeroDetail(HeroResponse):
    """Детальная информация о герое с дополнительными данными"""
    pass

class HeroCounterResponse(BaseModel):
    id: int
    name: str
    role: str
    specialty: str
    avatar_url: Optional[str] = None
    counter_type: Optional[str] = None
    win_rate: Optional[float] = None

    class Config:
        from_attributes = True

class HeroStats(BaseModel):
    total_heroes: int
    roles_count: Dict[str, int]
    avg_win_rate: float
    avg_pick_rate: float
    most_picked: List[str]
    highest_win_rate: List[str]

class HeroComparison(BaseModel):
    hero1_id: int
    hero2_id: int
    comparison_data: Dict[str, Any]