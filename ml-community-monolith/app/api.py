from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc
from typing import Optional, List
from datetime import datetime

from app.core.database import get_db
from app.models import User, Hero, Item, Emblem, BuildGuide, Comment, News, GuideRating, GuideLike, CommentLike
from app.schemas import (
    UserCreate, UserUpdate, UserResponse,
    HeroCreate, HeroUpdate, HeroResponse,
    BuildGuideCreate, BuildGuideUpdate, BuildGuideResponse,
    NewsCreate, NewsUpdate, NewsResponse,
    CommentCreate, CommentResponse,
    GuideRatingCreate, GuideRatingResponse
)
from app.auth import get_current_active_user, get_current_admin_user

# Create API router
api_router = APIRouter(prefix="/api/v1", tags=["API"])

# ==================== USERS API ====================

@api_router.get("/users/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Get current user information."""
    return current_user

@api_router.put("/users/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user information."""
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@api_router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ==================== HEROES API ====================

@api_router.get("/heroes", response_model=List[HeroResponse])
async def get_heroes(
    role: Optional[str] = Query(None, description="Filter by hero role"),
    search: Optional[str] = Query(None, description="Search by hero name"),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Page size"),
    sort_by: str = Query("name", description="Sort field"),
    sort_order: str = Query("asc", description="Sort order (asc/desc)"),
    db: Session = Depends(get_db)
):
    """Get heroes with filtering and pagination."""
    query = db.query(Hero)
    
    # Filter by role
    if role:
        query = query.filter(Hero.role == role)
    
    # Search by name
    if search:
        query = query.filter(Hero.name.ilike(f"%{search}%"))
    
    # Sorting
    sort_column = getattr(Hero, sort_by, Hero.name)
    if sort_order == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))
    
    # Pagination
    offset = (page - 1) * size
    heroes = query.offset(offset).limit(size).all()
    
    return heroes

@api_router.get("/heroes/{hero_id}", response_model=HeroResponse)
async def get_hero(hero_id: int, db: Session = Depends(get_db)):
    """Get hero by ID."""
    hero = db.query(Hero).filter(Hero.id == hero_id).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    return hero

@api_router.get("/heroes/{hero_id}/guides", response_model=List[BuildGuideResponse])
async def get_hero_guides(
    hero_id: int,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get guides for a specific hero."""
    hero = db.query(Hero).filter(Hero.id == hero_id).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    
    query = db.query(BuildGuide).filter(
        BuildGuide.hero_id == hero_id,
        BuildGuide.is_public == True
    ).order_by(desc(BuildGuide.views))
    
    offset = (page - 1) * size
    guides = query.offset(offset).limit(size).all()
    
    return guides

@api_router.get("/heroes/{hero_id}/counters", response_model=List[HeroResponse])
async def get_hero_counters(hero_id: int, db: Session = Depends(get_db)):
    """Get hero counters."""
    hero = db.query(Hero).filter(Hero.id == hero_id).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    
    return hero.counters[:10]  # Top 10 counters

@api_router.get("/heroes/{hero_id}/synergies", response_model=List[HeroResponse])
async def get_hero_synergies(hero_id: int, db: Session = Depends(get_db)):
    """Get hero synergies."""
    hero = db.query(Hero).filter(Hero.id == hero_id).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    
    return hero.synergies[:10]  # Top 10 synergies

# ==================== GUIDES API ====================

@api_router.get("/guides", response_model=List[BuildGuideResponse])
async def get_guides(
    hero_id: Optional[int] = Query(None, description="Filter by hero ID"),
    search: Optional[str] = Query(None, description="Search by title"),
    author_id: Optional[int] = Query(None, description="Filter by author ID"),
    featured: Optional[bool] = Query(None, description="Filter featured guides"),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    sort_by: str = Query("created_at", description="Sort field"),
    sort_order: str = Query("desc", description="Sort order"),
    db: Session = Depends(get_db)
):
    """Get guides with filtering and pagination."""
    query = db.query(BuildGuide).filter(BuildGuide.is_public == True)
    
    # Filters
    if hero_id:
        query = query.filter(BuildGuide.hero_id == hero_id)
    
    if author_id:
        query = query.filter(BuildGuide.author_id == author_id)
    
    if featured is not None:
        query = query.filter(BuildGuide.is_featured == featured)
    
    if search:
        query = query.filter(BuildGuide.title.ilike(f"%{search}%"))
    
    # Sorting
    sort_column = getattr(BuildGuide, sort_by, BuildGuide.created_at)
    if sort_order == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))
    
    # Pagination
    offset = (page - 1) * size
    guides = query.offset(offset).limit(size).all()
    
    return guides

@api_router.get("/guides/{guide_id}", response_model=BuildGuideResponse)
async def get_guide(guide_id: int, db: Session = Depends(get_db)):
    """Get guide by ID."""
    guide = db.query(BuildGuide).filter(BuildGuide.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    
    # Increment view count
    guide.views += 1
    db.commit()
    
    return guide

@api_router.post("/guides", response_model=BuildGuideResponse)
async def create_guide(
    guide_data: BuildGuideCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new guide."""
    # Verify hero exists
    hero = db.query(Hero).filter(Hero.id == guide_data.hero_id).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    
    guide = BuildGuide(
        **guide_data.dict(),
        author_id=current_user.id
    )
    
    db.add(guide)
    db.commit()
    db.refresh(guide)
    
    return guide

@api_router.put("/guides/{guide_id}", response_model=BuildGuideResponse)
async def update_guide(
    guide_id: int,
    guide_update: BuildGuideUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a guide."""
    guide = db.query(BuildGuide).filter(BuildGuide.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    
    # Check if user is author or admin
    if guide.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    for field, value in guide_update.dict(exclude_unset=True).items():
        setattr(guide, field, value)
    
    db.commit()
    db.refresh(guide)
    
    return guide

@api_router.delete("/guides/{guide_id}")
async def delete_guide(
    guide_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a guide."""
    guide = db.query(BuildGuide).filter(BuildGuide.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    
    # Check if user is author or admin
    if guide.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(guide)
    db.commit()
    
    return {"message": "Guide deleted successfully"}

# ==================== COMMENTS API ====================

@api_router.get("/guides/{guide_id}/comments", response_model=List[CommentResponse])
async def get_guide_comments(
    guide_id: int,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get comments for a guide."""
    guide = db.query(BuildGuide).filter(BuildGuide.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    
    query = db.query(Comment).filter(
        Comment.guide_id == guide_id,
        Comment.is_deleted == False
    ).order_by(asc(Comment.created_at))
    
    offset = (page - 1) * size
    comments = query.offset(offset).limit(size).all()
    
    return comments

@api_router.post("/guides/{guide_id}/comments", response_model=CommentResponse)
async def create_comment(
    guide_id: int,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a comment on a guide."""
    guide = db.query(BuildGuide).filter(BuildGuide.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    
    comment = Comment(
        **comment_data.dict(),
        guide_id=guide_id,
        author_id=current_user.id
    )
    
    db.add(comment)
    db.commit()
    db.refresh(comment)
    
    return comment

# ==================== RATINGS API ====================

@api_router.post("/guides/{guide_id}/rate", response_model=GuideRatingResponse)
async def rate_guide(
    guide_id: int,
    rating_data: GuideRatingCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Rate a guide."""
    guide = db.query(BuildGuide).filter(BuildGuide.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    
    # Check if user already rated this guide
    existing_rating = db.query(GuideRating).filter(
        GuideRating.guide_id == guide_id,
        GuideRating.user_id == current_user.id
    ).first()
    
    if existing_rating:
        # Update existing rating
        existing_rating.rating = rating_data.rating
        db.commit()
        db.refresh(existing_rating)
        return existing_rating
    else:
        # Create new rating
        rating = GuideRating(
            guide_id=guide_id,
            user_id=current_user.id,
            rating=rating_data.rating
        )
        db.add(rating)
        db.commit()
        db.refresh(rating)
        
        # Update guide rating stats
        guide_ratings = db.query(GuideRating).filter(GuideRating.guide_id == guide_id).all()
        if guide_ratings:
            total_rating = sum(r.rating for r in guide_ratings)
            guide.rating = total_rating / len(guide_ratings)
            guide.rating_count = len(guide_ratings)
            db.commit()
        
        return rating

# ==================== LIKES API ====================

@api_router.post("/guides/{guide_id}/like")
async def like_guide(
    guide_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Like or unlike a guide."""
    guide = db.query(BuildGuide).filter(BuildGuide.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    
    # Check if user already liked this guide
    existing_like = db.query(GuideLike).filter(
        GuideLike.guide_id == guide_id,
        GuideLike.user_id == current_user.id
    ).first()
    
    if existing_like:
        # Unlike
        db.delete(existing_like)
        guide.likes -= 1
        db.commit()
        return {"message": "Guide unliked", "liked": False}
    else:
        # Like
        like = GuideLike(
            guide_id=guide_id,
            user_id=current_user.id
        )
        db.add(like)
        guide.likes += 1
        db.commit()
        return {"message": "Guide liked", "liked": True}

@api_router.post("/comments/{comment_id}/like")
async def like_comment(
    comment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Like or unlike a comment."""
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Check if user already liked this comment
    existing_like = db.query(CommentLike).filter(
        CommentLike.comment_id == comment_id,
        CommentLike.user_id == current_user.id
    ).first()
    
    if existing_like:
        # Unlike
        db.delete(existing_like)
        comment.likes -= 1
        db.commit()
        return {"message": "Comment unliked", "liked": False}
    else:
        # Like
        like = CommentLike(
            comment_id=comment_id,
            user_id=current_user.id
        )
        db.add(like)
        comment.likes += 1
        db.commit()
        return {"message": "Comment liked", "liked": True}

# ==================== NEWS API ====================

@api_router.get("/news", response_model=List[NewsResponse])
async def get_news(
    featured: Optional[bool] = Query(None, description="Filter featured news"),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get news with filtering and pagination."""
    query = db.query(News).filter(News.is_published == True)
    
    if featured is not None:
        query = query.filter(News.is_featured == featured)
    
    query = query.order_by(desc(News.created_at))
    
    offset = (page - 1) * size
    news = query.offset(offset).limit(size).all()
    
    return news

@api_router.get("/news/{news_id}", response_model=NewsResponse)
async def get_news_item(news_id: int, db: Session = Depends(get_db)):
    """Get news item by ID."""
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    
    # Increment view count
    news.views += 1
    db.commit()
    
    return news

# ==================== STATISTICS API ====================

@api_router.get("/stats/overview")
async def get_overview_stats(db: Session = Depends(get_db)):
    """Get platform overview statistics."""
    total_heroes = db.query(Hero).count()
    total_guides = db.query(BuildGuide).filter(BuildGuide.is_public == True).count()
    total_news = db.query(News).filter(News.is_published == True).count()
    total_users = db.query(User).count()
    
    # Calculate average win rate
    avg_win_rate = db.query(func.avg(Hero.win_rate)).scalar() or 0
    avg_pick_rate = db.query(func.avg(Hero.pick_rate)).scalar() or 0
    
    return {
        "total_heroes": total_heroes,
        "total_guides": total_guides,
        "total_news": total_news,
        "total_users": total_users,
        "avg_win_rate": round(avg_win_rate, 1),
        "avg_pick_rate": round(avg_pick_rate, 1)
    }

@api_router.get("/stats/heroes/top")
async def get_top_heroes(
    sort_by: str = Query("win_rate", description="Sort by win_rate, pick_rate, or ban_rate"),
    limit: int = Query(10, ge=1, le=50, description="Number of heroes to return"),
    db: Session = Depends(get_db)
):
    """Get top heroes by various metrics."""
    sort_column = getattr(Hero, sort_by, Hero.win_rate)
    heroes = db.query(Hero).order_by(desc(sort_column)).limit(limit).all()
    
    return [
        {
            "id": hero.id,
            "name": hero.name,
            "role": hero.role,
            "win_rate": hero.win_rate,
            "pick_rate": hero.pick_rate,
            "ban_rate": hero.ban_rate
        }
        for hero in heroes
    ]

@api_router.get("/stats/guides/popular")
async def get_popular_guides(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Get most popular guides."""
    guides = db.query(BuildGuide).filter(
        BuildGuide.is_public == True
    ).order_by(desc(BuildGuide.views)).limit(limit).all()
    
    return [
        {
            "id": guide.id,
            "title": guide.title,
            "hero_name": guide.hero.name,
            "author_name": guide.author.username,
            "views": guide.views,
            "likes": guide.likes,
            "rating": guide.rating
        }
        for guide in guides
    ]