from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Hero schemas
class HeroBase(BaseModel):
    name: str
    title: str
    role: str
    specialty: str
    difficulty: str
    description: Optional[str] = None
    lore: Optional[str] = None
    image_url: Optional[str] = None
    icon_url: Optional[str] = None

class HeroCreate(HeroBase):
    pass

class HeroUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    role: Optional[str] = None
    specialty: Optional[str] = None
    difficulty: Optional[str] = None
    description: Optional[str] = None
    lore: Optional[str] = None
    image_url: Optional[str] = None
    icon_url: Optional[str] = None
    hp: Optional[int] = None
    mana: Optional[int] = None
    physical_attack: Optional[int] = None
    magic_power: Optional[int] = None
    armor: Optional[int] = None
    magic_resistance: Optional[int] = None
    attack_speed: Optional[float] = None
    movement_speed: Optional[int] = None
    win_rate: Optional[float] = None
    pick_rate: Optional[float] = None
    ban_rate: Optional[float] = None

class Hero(HeroBase):
    id: int
    hp: int
    mana: int
    physical_attack: int
    magic_power: int
    armor: int
    magic_resistance: int
    attack_speed: float
    movement_speed: int
    win_rate: float
    pick_rate: float
    ban_rate: float
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Item schemas
class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    price: int
    image_url: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Emblem schemas
class EmblemBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    image_url: Optional[str] = None

class EmblemCreate(EmblemBase):
    pass

class Emblem(EmblemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Build Guide schemas
class BuildGuideBase(BaseModel):
    title: str
    description: Optional[str] = None
    hero_id: int
    items: Optional[str] = None
    emblem: Optional[str] = None
    battle_spell: Optional[str] = None

class BuildGuideCreate(BuildGuideBase):
    pass

class BuildGuideUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    items: Optional[str] = None
    emblem: Optional[str] = None
    battle_spell: Optional[str] = None
    is_public: Optional[bool] = None

class BuildGuide(BuildGuideBase):
    id: int
    author_id: int
    views: int
    likes: int
    rating: float
    rating_count: int
    is_public: bool
    is_featured: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Comment schemas
class CommentBase(BaseModel):
    content: str
    guide_id: int
    parent_id: Optional[int] = None

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    author_id: int
    likes: int
    is_deleted: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# News schemas
class NewsBase(BaseModel):
    title: str
    content: str
    summary: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None

class NewsCreate(NewsBase):
    pass

class NewsUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None

class News(NewsBase):
    id: int
    author_id: int
    views: int
    likes: int
    is_published: bool
    is_featured: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Response schemas
class Message(BaseModel):
    message: str

class PaginatedResponse(BaseModel):
    items: List[dict]
    total: int
    page: int
    size: int
    pages: int