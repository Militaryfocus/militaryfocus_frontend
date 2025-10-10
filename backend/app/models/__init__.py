from sqlalchemy import Column, Integer, String, JSON, Text, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    ign = Column(String(100))  # In-Game Name
    current_rank = Column(String(50))  # Warrior, Elite, Master, etc.
    main_heroes = Column(JSON)  # List of main hero IDs
    role = Column(String(50), default="User")  # User, Content Creator, Moderator, Admin
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    guides = relationship("BuildGuide", back_populates="author")
    comments = relationship("Comment", back_populates="author")
    news = relationship("News", back_populates="author")

class Hero(Base):
    __tablename__ = "heroes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    role = Column(String(50), nullable=False)  # Tank, Assassin, Mage, Marksman, Support, Fighter
    specialty = Column(String(100), nullable=False)
    lane = Column(JSON)  # ['EXP', 'Gold', 'Mid', 'Jungle', 'Roam']
    
    # Статистика
    durability = Column(Integer)
    offense = Column(Integer)
    control = Column(Integer)
    difficulty = Column(Integer)
    
    # Навыки
    passive_skill = Column(JSON)
    first_skill = Column(JSON)
    second_skill = Column(JSON)
    ultimate_skill = Column(JSON)
    
    # Мета-данные
    release_date = Column(String(50))
    price = Column(JSON)  # {"bp": 32000, "diamond": 599}
    
    # Изображения
    image_url = Column(String(500))
    avatar_url = Column(String(500))
    
    # Статистика использования
    win_rate = Column(Float, default=0.0)
    pick_rate = Column(Float, default=0.0)
    ban_rate = Column(Float, default=0.0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    guides = relationship("BuildGuide", back_populates="hero")
    counters = relationship("HeroCounter", foreign_keys="HeroCounter.hero_id", back_populates="hero")
    synergies = relationship("HeroSynergy", foreign_keys="HeroSynergy.hero_id", back_populates="hero")

class Item(Base):
    __tablename__ = "items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text)
    price = Column(Integer)
    category = Column(String(50))  # Attack, Defense, Magic, Movement, etc.
    stats = Column(JSON)  # {"physical_attack": 50, "magic_power": 30}
    passive_effect = Column(JSON)
    active_effect = Column(JSON)
    image_url = Column(String(500))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Emblem(Base):
    __tablename__ = "emblems"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    type = Column(String(50), nullable=False)  # Physical, Magic, Tank, etc.
    level = Column(Integer, default=1)
    stats = Column(JSON)
    talents = Column(JSON)
    image_url = Column(String(500))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class BuildGuide(Base):
    __tablename__ = "build_guides"
    
    id = Column(Integer, primary_key=True, index=True)
    hero_id = Column(Integer, ForeignKey("heroes.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    title = Column(String(200), nullable=False)
    description = Column(Text)
    emblems = Column(JSON)  # Emblem setup
    battle_spell = Column(String(100))
    item_build = Column(JSON)  # Early/Mid/Late game items
    skill_priority = Column(JSON)  # Skill upgrade order
    play_style = Column(String(50))  # Aggressive, Defensive, Balanced
    difficulty = Column(String(20))  # Easy, Medium, Hard
    tags = Column(JSON)  # ["meta", "off-meta", "rank-specific"]
    
    # Статистика
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)
    
    is_published = Column(Boolean, default=False)
    version = Column(String(20), default="1.0")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    hero = relationship("Hero", back_populates="guides")
    author = relationship("User", back_populates="guides")
    comments = relationship("Comment", back_populates="guide")
    ratings = relationship("GuideRating", back_populates="guide")

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    guide_id = Column(Integer, ForeignKey("build_guides.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    parent_id = Column(Integer, ForeignKey("comments.id"))  # For replies
    
    likes = Column(Integer, default=0)
    is_approved = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    guide = relationship("BuildGuide", back_populates="comments")
    author = relationship("User", back_populates="comments")
    parent = relationship("Comment", remote_side=[id])

class GuideRating(Base):
    __tablename__ = "guide_ratings"
    
    id = Column(Integer, primary_key=True, index=True)
    guide_id = Column(Integer, ForeignKey("build_guides.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    review = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    guide = relationship("BuildGuide", back_populates="ratings")
    user = relationship("User")

class HeroCounter(Base):
    __tablename__ = "hero_counters"
    
    id = Column(Integer, primary_key=True, index=True)
    hero_id = Column(Integer, ForeignKey("heroes.id"), nullable=False)
    counter_hero_id = Column(Integer, ForeignKey("heroes.id"), nullable=False)
    counter_type = Column(String(20))  # "strong_against", "weak_against"
    win_rate = Column(Float)
    
    # Relationships
    hero = relationship("Hero", foreign_keys=[hero_id], back_populates="counters")
    counter_hero = relationship("Hero", foreign_keys=[counter_hero_id])

class HeroSynergy(Base):
    __tablename__ = "hero_synergies"
    
    id = Column(Integer, primary_key=True, index=True)
    hero_id = Column(Integer, ForeignKey("heroes.id"), nullable=False)
    synergy_hero_id = Column(Integer, ForeignKey("heroes.id"), nullable=False)
    synergy_type = Column(String(20))  # "good_with", "combo"
    win_rate = Column(Float)
    
    # Relationships
    hero = relationship("Hero", foreign_keys=[hero_id], back_populates="synergies")
    synergy_hero = relationship("Hero", foreign_keys=[synergy_hero_id])

class News(Base):
    __tablename__ = "news"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    summary = Column(Text)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String(50))  # "patch", "event", "tournament", "community"
    tags = Column(JSON)
    image_url = Column(String(500))
    
    views = Column(Integer, default=0)
    is_published = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    author = relationship("User", back_populates="news")