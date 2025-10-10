from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class NewsBase(BaseModel):
    title: str
    content: str
    summary: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    image_url: Optional[str] = None

class NewsCreate(NewsBase):
    pass

class NewsUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    image_url: Optional[str] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None

class NewsResponse(NewsBase):
    id: int
    author_id: int
    views: int
    is_published: bool
    is_featured: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class NewsDetail(NewsResponse):
    """Детальная информация о новости с дополнительными данными"""
    author_name: Optional[str] = None

class NewsStats(BaseModel):
    total_news: int
    published_news: int
    featured_news: int
    news_by_category: Dict[str, int]
    avg_views: float
    most_popular: List[str]