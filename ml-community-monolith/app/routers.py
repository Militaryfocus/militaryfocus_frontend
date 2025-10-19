from fastapi import APIRouter, Depends, HTTPException, status, Request, Form, File, UploadFile
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc
from typing import Optional, List
from datetime import datetime, timedelta
import json
import os

from app.core.database import get_db
from app.core.config import settings
from app.models import User, Hero, Item, Emblem, BuildGuide, Comment, News, UserStatistic, UserFavorite, Achievement, Notification
from app.schemas import UserCreate, UserUpdate, HeroCreate, HeroUpdate, BuildGuideCreate, NewsCreate, UserFavoriteCreate, NotificationCreate
from app.auth import get_password_hash, authenticate_user, create_access_token, get_current_user, get_current_active_user

# Helper function for admin users
def get_current_admin_user(current_user: User = Depends(get_current_active_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

# Create router
router = APIRouter()

# Templates
templates = Jinja2Templates(directory="app/templates")

# Home page
@router.get("/", response_class=HTMLResponse)
async def home(request: Request, db: Session = Depends(get_db)):
    """Home page with stats and featured content."""
    # Get stats
    total_heroes = db.query(Hero).count()
    total_guides = db.query(BuildGuide).filter(BuildGuide.is_public == True).count()
    total_news = db.query(News).filter(News.is_published == True).count()
    
    # Get featured content
    featured_heroes = db.query(Hero).order_by(desc(Hero.pick_rate)).limit(8).all()
    trending_guides = db.query(BuildGuide).filter(BuildGuide.is_public == True).order_by(desc(BuildGuide.views)).limit(6).all()
    latest_news = db.query(News).filter(News.is_published == True).order_by(desc(News.created_at)).limit(3).all()
    
    # Calculate average win rate
    avg_win_rate = db.query(func.avg(Hero.win_rate)).scalar() or 0
    avg_pick_rate = db.query(func.avg(Hero.pick_rate)).scalar() or 0
    
    context = {
        "request": request,
        "total_heroes": total_heroes,
        "total_guides": total_guides,
        "total_news": total_news,
        "avg_win_rate": round(avg_win_rate, 1),
        "avg_pick_rate": round(avg_pick_rate, 1),
        "featured_heroes": featured_heroes,
        "trending_guides": trending_guides,
        "latest_news": latest_news
    }
    
    return templates.TemplateResponse("home.html", context)

# Heroes pages
@router.get("/heroes", response_class=HTMLResponse)
async def heroes_list(request: Request, db: Session = Depends(get_db), 
                     role: Optional[str] = None, search: Optional[str] = None,
                     page: int = 1, size: int = 20):
    """Heroes list page."""
    query = db.query(Hero)
    
    # Filter by role
    if role:
        query = query.filter(Hero.role == role)
    
    # Search by name
    if search:
        query = query.filter(Hero.name.ilike(f"%{search}%"))
    
    # Get total count
    total = query.count()
    
    # Pagination
    offset = (page - 1) * size
    heroes = query.order_by(asc(Hero.name)).offset(offset).limit(size).all()
    
    # Get unique roles for filter
    roles = db.query(Hero.role).distinct().all()
    roles = [r[0] for r in roles]
    
    context = {
        "request": request,
        "heroes": heroes,
        "roles": roles,
        "current_role": role,
        "search": search,
        "page": page,
        "size": size,
        "total": total,
        "pages": (total + size - 1) // size
    }
    
    return templates.TemplateResponse("heroes/list.html", context)

@router.get("/heroes/{hero_id}", response_class=HTMLResponse)
async def hero_detail(request: Request, hero_id: int, db: Session = Depends(get_db)):
    """Hero detail page."""
    hero = db.query(Hero).filter(Hero.id == hero_id).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    
    # Get hero guides
    guides = db.query(BuildGuide).filter(
        BuildGuide.hero_id == hero_id,
        BuildGuide.is_public == True
    ).order_by(desc(BuildGuide.views)).limit(10).all()
    
    # Get counters and synergies
    counters = hero.counters[:5]  # Top 5 counters
    synergies = hero.synergies[:5]  # Top 5 synergies
    
    context = {
        "request": request,
        "hero": hero,
        "guides": guides,
        "counters": counters,
        "synergies": synergies
    }
    
    return templates.TemplateResponse("heroes/detail.html", context)

# Guides pages
@router.get("/guides", response_class=HTMLResponse)
async def guides_list(request: Request, db: Session = Depends(get_db),
                     hero_id: Optional[int] = None, search: Optional[str] = None,
                     page: int = 1, size: int = 20):
    """Guides list page."""
    query = db.query(BuildGuide).filter(BuildGuide.is_public == True)
    
    # Filter by hero
    if hero_id:
        query = query.filter(BuildGuide.hero_id == hero_id)
    
    # Search by title
    if search:
        query = query.filter(BuildGuide.title.ilike(f"%{search}%"))
    
    # Get total count
    total = query.count()
    
    # Pagination
    offset = (page - 1) * size
    guides = query.order_by(desc(BuildGuide.created_at)).offset(offset).limit(size).all()
    
    # Get heroes for filter
    heroes = db.query(Hero).order_by(asc(Hero.name)).all()
    
    context = {
        "request": request,
        "guides": guides,
        "heroes": heroes,
        "current_hero_id": hero_id,
        "search": search,
        "page": page,
        "size": size,
        "total": total,
        "pages": (total + size - 1) // size
    }
    
    return templates.TemplateResponse("guides/list.html", context)

@router.get("/guides/{guide_id}", response_class=HTMLResponse)
async def guide_detail(request: Request, guide_id: int, db: Session = Depends(get_db)):
    """Guide detail page."""
    guide = db.query(BuildGuide).filter(BuildGuide.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    
    # Increment view count
    guide.views += 1
    db.commit()
    
    # Get guide comments
    comments = db.query(Comment).filter(
        Comment.guide_id == guide_id,
        Comment.is_deleted == False
    ).order_by(asc(Comment.created_at)).all()
    
    # Parse items and emblem if they exist
    items_data = []
    emblem_data = {}
    
    if guide.items:
        try:
            items_data = json.loads(guide.items)
        except:
            pass
    
    if guide.emblem:
        try:
            emblem_data = json.loads(guide.emblem)
        except:
            pass
    
    context = {
        "request": request,
        "guide": guide,
        "comments": comments,
        "items_data": items_data,
        "emblem_data": emblem_data
    }
    
    return templates.TemplateResponse("guides/detail.html", context)

# News pages
@router.get("/news", response_class=HTMLResponse)
async def news_list(request: Request, db: Session = Depends(get_db),
                   page: int = 1, size: int = 20):
    """News list page."""
    query = db.query(News).filter(News.is_published == True)
    
    # Get total count
    total = query.count()
    
    # Pagination
    offset = (page - 1) * size
    news_list = query.order_by(desc(News.created_at)).offset(offset).limit(size).all()
    
    context = {
        "request": request,
        "news": news_list,
        "page": page,
        "size": size,
        "total": total,
        "pages": (total + size - 1) // size
    }
    
    return templates.TemplateResponse("news/list.html", context)

@router.get("/news/{news_id}", response_class=HTMLResponse)
async def news_detail(request: Request, news_id: int, db: Session = Depends(get_db)):
    """News detail page."""
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    
    # Increment view count
    news.views += 1
    db.commit()
    
    context = {
        "request": request,
        "news": news
    }
    
    return templates.TemplateResponse("news/detail.html", context)

# Authentication pages
@router.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    """Login page."""
    return templates.TemplateResponse("auth/login.html", {"request": request})

@router.post("/login")
async def login(request: Request, username: str = Form(...), password: str = Form(...), 
                db: Session = Depends(get_db)):
    """Login user."""
    user = authenticate_user(db, username, password)
    if not user:
        return templates.TemplateResponse("auth/login.html", {
            "request": request,
            "error": "Invalid username or password"
        })
    
    access_token = create_access_token(data={"sub": user.username})
    response = RedirectResponse(url="/", status_code=status.HTTP_302_FOUND)
    response.set_cookie(key="access_token", value=access_token, httponly=True)
    return response

@router.get("/register", response_class=HTMLResponse)
async def register_page(request: Request):
    """Register page."""
    return templates.TemplateResponse("auth/register.html", {"request": request})

@router.post("/register")
async def register(request: Request, username: str = Form(...), email: str = Form(...),
                  password: str = Form(...), db: Session = Depends(get_db)):
    """Register user."""
    # Check if user exists
    if db.query(User).filter(User.username == username).first():
        return templates.TemplateResponse("auth/register.html", {
            "request": request,
            "error": "Username already registered"
        })
    
    if db.query(User).filter(User.email == email).first():
        return templates.TemplateResponse("auth/register.html", {
            "request": request,
            "error": "Email already registered"
        })
    
    # Create user
    hashed_password = get_password_hash(password)
    user = User(
        username=username,
        email=email,
        hashed_password=hashed_password
    )
    db.add(user)
    db.commit()
    
    # Login user
    access_token = create_access_token(data={"sub": user.username})
    response = RedirectResponse(url="/", status_code=status.HTTP_302_FOUND)
    response.set_cookie(key="access_token", value=access_token, httponly=True)
    return response

@router.get("/logout")
async def logout():
    """Logout user."""
    response = RedirectResponse(url="/", status_code=status.HTTP_302_FOUND)
    response.delete_cookie(key="access_token")
    return response

# Profile page
@router.get("/profile", response_class=HTMLResponse)
async def profile(request: Request, current_user: User = Depends(get_current_active_user),
                 db: Session = Depends(get_db)):
    """User profile page."""
    # Get user guides
    guides = db.query(BuildGuide).filter(BuildGuide.author_id == current_user.id).all()
    
    # Get or create user statistics
    stats = db.query(UserStatistic).filter(UserStatistic.user_id == current_user.id).first()
    if not stats:
        stats = UserStatistic(user_id=current_user.id)
        db.add(stats)
        db.commit()
        db.refresh(stats)
    
    # Get favorites count
    favorites_count = db.query(UserFavorite).filter(UserFavorite.user_id == current_user.id).count()
    
    # Get unread notifications count
    notifications_count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).count()
    
    context = {
        "request": request,
        "user": current_user,
        "guides": guides,
        "stats": stats,
        "favorites_count": favorites_count,
        "notifications_count": notifications_count
    }
    
    return templates.TemplateResponse("profile/index.html", context)

# Search page
@router.get("/search", response_class=HTMLResponse)
async def search(request: Request, q: Optional[str] = None, db: Session = Depends(get_db)):
    """Search page."""
    results = {"heroes": [], "guides": [], "news": []}
    
    if q:
        # Search heroes
        heroes = db.query(Hero).filter(Hero.name.ilike(f"%{q}%")).limit(10).all()
        results["heroes"] = heroes
        
        # Search guides
        guides = db.query(BuildGuide).filter(
            BuildGuide.is_public == True,
            BuildGuide.title.ilike(f"%{q}%")
        ).limit(10).all()
        results["guides"] = guides
        
        # Search news
        news = db.query(News).filter(
            News.is_published == True,
            News.title.ilike(f"%{q}%")
        ).limit(10).all()
        results["news"] = news
    
    context = {
        "request": request,
        "query": q,
        "results": results
    }
    
    return templates.TemplateResponse("search.html", context)

# Guide Builder page
@router.get("/guides/builder", response_class=HTMLResponse)
async def guide_builder(request: Request, current_user: User = Depends(get_current_active_user)):
    """Guide builder page."""
    return templates.TemplateResponse("guides/builder.html", {"request": request})

# Admin panel
@router.get("/admin", response_class=HTMLResponse)
async def admin_panel(request: Request, current_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    """Admin panel page."""
    # Get statistics
    total_heroes = db.query(Hero).count()
    total_guides = db.query(BuildGuide).count()
    total_users = db.query(User).count()
    total_news = db.query(News).count()
    
    # Get recent activity
    recent_guides = db.query(BuildGuide).order_by(desc(BuildGuide.created_at)).limit(5).all()
    recent_users = db.query(User).order_by(desc(User.created_at)).limit(5).all()
    
    context = {
        "request": request,
        "stats": {
            "total_heroes": total_heroes,
            "total_guides": total_guides,
            "total_users": total_users,
            "total_news": total_news
        },
        "recent_guides": recent_guides,
        "recent_users": recent_users
    }
    
    return templates.TemplateResponse("admin/dashboard.html", context)

# Statistics page
@router.get("/stats", response_class=HTMLResponse)
async def statistics(request: Request, db: Session = Depends(get_db)):
    """Statistics page."""
    # Get overview stats
    total_heroes = db.query(Hero).count()
    total_guides = db.query(BuildGuide).filter(BuildGuide.is_public == True).count()
    total_news = db.query(News).filter(News.is_published == True).count()
    total_users = db.query(User).count()
    
    # Calculate average win rate
    avg_win_rate = db.query(func.avg(Hero.win_rate)).scalar() or 0
    avg_pick_rate = db.query(func.avg(Hero.pick_rate)).scalar() or 0
    
    # Get top heroes by pick rate
    top_heroes = db.query(Hero).order_by(desc(Hero.pick_rate)).limit(10).all()
    
    # Get most active users
    most_active_users = db.query(User).join(UserStatistic).order_by(desc(UserStatistic.guides_created)).limit(10).all()
    
    context = {
        "request": request,
        "stats": {
            "total_heroes": total_heroes,
            "total_guides": total_guides,
            "total_news": total_news,
            "total_users": total_users,
            "avg_win_rate": round(avg_win_rate, 1),
            "avg_pick_rate": round(avg_pick_rate, 1)
        },
        "top_heroes": top_heroes,
        "most_active_users": most_active_users
    }
    
    return templates.TemplateResponse("stats/index.html", context)

# Favorites functionality
@router.post("/api/favorites")
async def add_favorite(favorite: UserFavoriteCreate, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """Add item to favorites."""
    # Check if already favorited
    existing = db.query(UserFavorite).filter(
        UserFavorite.user_id == current_user.id,
        UserFavorite.favorite_type == favorite.favorite_type,
        UserFavorite.favorite_id == favorite.favorite_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already in favorites")
    
    # Add to favorites
    user_favorite = UserFavorite(
        user_id=current_user.id,
        favorite_type=favorite.favorite_type,
        favorite_id=favorite.favorite_id
    )
    db.add(user_favorite)
    db.commit()
    
    return {"message": "Added to favorites"}

@router.delete("/api/favorites/{favorite_type}/{favorite_id}")
async def remove_favorite(favorite_type: str, favorite_id: int, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """Remove item from favorites."""
    favorite = db.query(UserFavorite).filter(
        UserFavorite.user_id == current_user.id,
        UserFavorite.favorite_type == favorite_type,
        UserFavorite.favorite_id == favorite_id
    ).first()
    
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    db.delete(favorite)
    db.commit()
    
    return {"message": "Removed from favorites"}

@router.get("/favorites", response_class=HTMLResponse)
async def favorites_page(request: Request, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """User favorites page."""
    # Get user favorites
    favorites = db.query(UserFavorite).filter(UserFavorite.user_id == current_user.id).all()
    
    # Separate heroes and guides
    favorite_heroes = []
    favorite_guides = []
    
    for fav in favorites:
        if fav.favorite_type == "hero":
            hero = db.query(Hero).filter(Hero.id == fav.favorite_id).first()
            if hero:
                favorite_heroes.append(hero)
        elif fav.favorite_type == "guide":
            guide = db.query(BuildGuide).filter(BuildGuide.id == fav.favorite_id).first()
            if guide:
                favorite_guides.append(guide)
    
    context = {
        "request": request,
        "favorite_heroes": favorite_heroes,
        "favorite_guides": favorite_guides
    }
    
    return templates.TemplateResponse("favorites.html", context)

# Notifications
@router.get("/notifications", response_class=HTMLResponse)
async def notifications_page(request: Request, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """User notifications page."""
    # Get user notifications
    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(desc(Notification.created_at)).limit(50).all()
    
    # Mark as read
    for notification in notifications:
        if not notification.is_read:
            notification.is_read = True
    db.commit()
    
    context = {
        "request": request,
        "notifications": notifications
    }
    
    return templates.TemplateResponse("notifications.html", context)

@router.get("/api/notifications/count")
async def get_notifications_count(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """Get unread notifications count."""
    count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).count()
    
    return {"count": count}

# Enhanced profile with statistics
@router.get("/profile/stats", response_class=HTMLResponse)
async def profile_stats(request: Request, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """User profile statistics page."""
    # Get or create user statistics
    stats = db.query(UserStatistic).filter(UserStatistic.user_id == current_user.id).first()
    if not stats:
        stats = UserStatistic(user_id=current_user.id)
        db.add(stats)
        db.commit()
        db.refresh(stats)
    
    # Get user achievements
    user_achievements = []
    if stats.achievements:
        user_achievements = db.query(Achievement).filter(Achievement.id.in_(stats.achievements)).all()
    
    # Get available achievements
    all_achievements = db.query(Achievement).filter(Achievement.is_active == True).all()
    
    context = {
        "request": request,
        "user": current_user,
        "stats": stats,
        "user_achievements": user_achievements,
        "all_achievements": all_achievements
    }
    
    return templates.TemplateResponse("profile/stats.html", context)