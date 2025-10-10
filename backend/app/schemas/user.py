from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str
    ign: Optional[str] = None
    current_rank: Optional[str] = None
    main_heroes: Optional[List[int]] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    ign: Optional[str] = None
    current_rank: Optional[str] = None
    main_heroes: Optional[List[int]] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserProfile(UserResponse):
    """Расширенный профиль пользователя"""
    guides_count: Optional[int] = None
    total_views: Optional[int] = None
    total_likes: Optional[int] = None
    average_rating: Optional[float] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class PasswordReset(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class UserStats(BaseModel):
    total_users: int
    active_users: int
    content_creators: int
    moderators: int
    admins: int
    new_users_today: int
    new_users_this_week: int