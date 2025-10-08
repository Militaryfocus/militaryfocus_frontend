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
    """Детальная информация о новости"""
    author_name: Optional[str] = None
    reading_time: Optional[int] = None  # в минутах

class NewsStats(BaseModel):
    total_news: int
    published_news: int
    featured_news: int
    news_by_category: Dict[str, int]
    total_views: int
    avg_views_per_news: float
    most_popular_news: List[str]

class NewsSearch(BaseModel):
    query: str
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None