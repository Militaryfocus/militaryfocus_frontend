from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

# Association tables for many-to-many relationships
hero_counters = Table(
    'hero_counters',
    Base.metadata,
    Column('hero_id', Integer, ForeignKey('heroes.id'), primary_key=True),
    Column('counter_id', Integer, ForeignKey('heroes.id'), primary_key=True)
)

hero_synergies = Table(
    'hero_synergies',
    Base.metadata,
    Column('hero_id', Integer, ForeignKey('heroes.id'), primary_key=True),
    Column('synergy_id', Integer, ForeignKey('heroes.id'), primary_key=True)
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    guides = relationship("BuildGuide", back_populates="author")
    comments = relationship("Comment", back_populates="author")
    ratings = relationship("GuideRating", back_populates="user")

class Hero(Base):
    __tablename__ = "heroes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(100), nullable=False)
    role = Column(String(50), nullable=False)  # Tank, Fighter, Assassin, Mage, Marksman, Support
    specialty = Column(String(50), nullable=False)  # Burst, Charge, Regen, Push, etc.
    difficulty = Column(String(20), nullable=False)  # Easy, Medium, Hard
    description = Column(Text)
    lore = Column(Text)
    image_url = Column(String(255))
    icon_url = Column(String(255))
    
    # Stats
    hp = Column(Integer, default=0)
    mana = Column(Integer, default=0)
    physical_attack = Column(Integer, default=0)
    magic_power = Column(Integer, default=0)
    armor = Column(Integer, default=0)
    magic_resistance = Column(Integer, default=0)
    attack_speed = Column(Float, default=0.0)
    movement_speed = Column(Integer, default=0)
    
    # Win/Pick rates
    win_rate = Column(Float, default=0.0)
    pick_rate = Column(Float, default=0.0)
    ban_rate = Column(Float, default=0.0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    guides = relationship("BuildGuide", back_populates="hero")
    counters = relationship("Hero", secondary=hero_counters, 
                          primaryjoin=id == hero_counters.c.hero_id,
                          secondaryjoin=id == hero_counters.c.counter_id)
    synergies = relationship("Hero", secondary=hero_synergies,
                           primaryjoin=id == hero_synergies.c.hero_id,
                           secondaryjoin=id == hero_synergies.c.synergy_id)

class Item(Base):
    __tablename__ = "items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text)
    category = Column(String(50), nullable=False)  # Attack, Defense, Magic, Movement, etc.
    price = Column(Integer, default=0)
    image_url = Column(String(255))
    stats = Column(Text)  # JSON string with item stats
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Emblem(Base):
    __tablename__ = "emblems"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text)
    category = Column(String(50), nullable=False)  # Physical, Magic, Tank, etc.
    image_url = Column(String(255))
    stats = Column(Text)  # JSON string with emblem stats
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class BuildGuide(Base):
    __tablename__ = "build_guides"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    hero_id = Column(Integer, ForeignKey("heroes.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Build configuration
    items = Column(Text)  # JSON string with item IDs
    emblem = Column(Text)  # JSON string with emblem configuration
    battle_spell = Column(String(50))
    
    # Stats
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)
    
    is_public = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
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
    content = Column(Text, nullable=False)
    guide_id = Column(Integer, ForeignKey("build_guides.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent_id = Column(Integer, ForeignKey("comments.id"), nullable=True)
    
    likes = Column(Integer, default=0)
    is_deleted = Column(Boolean, default=False)
    
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
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    guide = relationship("BuildGuide", back_populates="ratings")
    user = relationship("User", back_populates="ratings")

class News(Base):
    __tablename__ = "news"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    summary = Column(Text)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Media
    image_url = Column(String(255))
    video_url = Column(String(255))
    
    # Stats
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    
    # Status
    is_published = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    author = relationship("User")