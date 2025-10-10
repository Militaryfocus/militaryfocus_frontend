from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime

class GuideBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    emblems: Optional[Dict[str, Any]] = None
    battle_spell: Optional[str] = Field(None, max_length=100)
    item_build: Optional[Dict[str, Any]] = None
    skill_priority: Optional[List[int]] = None
    play_style: Optional[str] = Field(None, max_length=50)
    difficulty: Optional[str] = Field(None, max_length=20)
    tags: Optional[List[str]] = None
    
    @validator('difficulty')
    def validate_difficulty(cls, v):
        if v and v not in ['Easy', 'Medium', 'Hard']:
            raise ValueError('Difficulty must be Easy, Medium, or Hard')
        return v
    
    @validator('play_style')
    def validate_play_style(cls, v):
        if v and v not in ['Aggressive', 'Defensive', 'Balanced']:
            raise ValueError('Play style must be Aggressive, Defensive, or Balanced')
        return v
    
    @validator('skill_priority')
    def validate_skill_priority(cls, v):
        if v and len(v) > 10:
            raise ValueError('Skill priority list too long')
        return v

class GuideCreate(GuideBase):
    hero_id: int

class GuideUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    emblems: Optional[Dict[str, Any]] = None
    battle_spell: Optional[str] = None
    item_build: Optional[Dict[str, Any]] = None
    skill_priority: Optional[List[int]] = None
    play_style: Optional[str] = None
    difficulty: Optional[str] = None
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None
    version: Optional[str] = None

class GuideResponse(GuideBase):
    id: int
    hero_id: int
    author_id: int
    views: int
    likes: int
    rating: float
    rating_count: int
    is_published: bool
    version: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class GuideDetail(GuideResponse):
    """Детальная информация о гайде с дополнительными данными"""
    hero_name: Optional[str] = None
    author_name: Optional[str] = None
    comments_count: Optional[int] = None

class GuideRating(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    review: Optional[str] = Field(None, max_length=1000)

class GuideComment(BaseModel):
    content: str
    parent_id: Optional[int] = None

class GuideCommentResponse(BaseModel):
    id: int
    content: str
    author_id: int
    author_name: str
    likes: int
    created_at: datetime
    parent_id: Optional[int] = None

    class Config:
        from_attributes = True

class GuideStats(BaseModel):
    total_guides: int
    guides_by_difficulty: Dict[str, int]
    guides_by_play_style: Dict[str, int]
    avg_rating: float
    most_popular_heroes: List[str]

class BuildTemplate(BaseModel):
    """Шаблон для создания сборки"""
    hero_id: int
    title: str
    description: str
    early_items: List[int]
    mid_items: List[int]
    late_items: List[int]
    emblem_setup: Dict[str, Any]
    battle_spell: str
    skill_order: List[int]
    play_style: str
    difficulty: str
    tags: List[str]