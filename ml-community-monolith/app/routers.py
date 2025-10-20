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
from app.models import User, Hero, Item, Emblem, BuildGuide, Comment, News
from app.schemas import UserCreate, UserUpdate, HeroCreate, HeroUpdate, BuildGuideCreate, NewsCreate
from app.auth import (get_password_hash, authenticate_user, create_access_token, 
                     get_current_user, get_current_active_user, get_current_admin_user,
                     create_user_session, deactivate_session, get_user_sessions,
                     get_current_user_from_cookie, get_current_user_optional, verify_password)

# Create router
router = APIRouter()

# Templates
templates = Jinja2Templates(directory="app/templates")

# Template context processor for user info
def get_template_context(request: Request, db: Session = Depends(get_db)):
    """Get template context with user information."""
    user = get_current_user_optional(request, db)
    return {"request": request, "user": user}

# Home page
@router.get("/", response_class=HTMLResponse)
async def home(request: Request, db: Session = Depends(get_db)):
    """Home page with stats and featured content."""
    # Get user info
    user = get_current_user_optional(request, db)
    
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
        "user": user,
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
            "error": "Неверное имя пользователя или пароль"
        })
    
    if not user.is_active:
        return templates.TemplateResponse("auth/login.html", {
            "request": request,
            "error": "Аккаунт заблокирован"
        })
    
    # Create session
    access_token = create_access_token(data={"sub": user.username})
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    
    create_user_session(db, user.id, access_token, ip_address, user_agent)
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    response = RedirectResponse(url="/", status_code=status.HTTP_302_FOUND)
    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=True,
        secure=True,  # Only over HTTPS in production
        samesite="lax",
        max_age=30 * 24 * 60 * 60  # 30 days
    )
    return response

@router.get("/register", response_class=HTMLResponse)
async def register_page(request: Request):
    """Register page."""
    return templates.TemplateResponse("auth/register.html", {"request": request})

@router.post("/register")
async def register(request: Request, username: str = Form(...), email: str = Form(...),
                  password: str = Form(...), confirm_password: str = Form(...),
                  first_name: str = Form(None), last_name: str = Form(None),
                  db: Session = Depends(get_db)):
    """Register user."""
    # Validate passwords match
    if password != confirm_password:
        return templates.TemplateResponse("auth/register.html", {
            "request": request,
            "error": "Пароли не совпадают"
        })
    
    # Validate password strength
    if len(password) < 6:
        return templates.TemplateResponse("auth/register.html", {
            "request": request,
            "error": "Пароль должен содержать минимум 6 символов"
        })
    
    # Check if user exists
    if db.query(User).filter(User.username == username).first():
        return templates.TemplateResponse("auth/register.html", {
            "request": request,
            "error": "Пользователь с таким именем уже существует"
        })
    
    if db.query(User).filter(User.email == email).first():
        return templates.TemplateResponse("auth/register.html", {
            "request": request,
            "error": "Пользователь с таким email уже существует"
        })
    
    # Create user
    hashed_password = get_password_hash(password)
    user = User(
        username=username,
        email=email,
        hashed_password=hashed_password,
        first_name=first_name,
        last_name=last_name
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create session and login user
    access_token = create_access_token(data={"sub": user.username})
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    
    create_user_session(db, user.id, access_token, ip_address, user_agent)
    
    response = RedirectResponse(url="/", status_code=status.HTTP_302_FOUND)
    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=True,
        secure=True,  # Only over HTTPS in production
        samesite="lax",
        max_age=30 * 24 * 60 * 60  # 30 days
    )
    return response

@router.get("/logout")
async def logout(request: Request, db: Session = Depends(get_db)):
    """Logout user."""
    session_token = request.cookies.get("access_token")
    if session_token:
        deactivate_session(db, session_token)
    
    response = RedirectResponse(url="/", status_code=status.HTTP_302_FOUND)
    response.delete_cookie(key="access_token")
    return response

# Profile page
@router.get("/profile", response_class=HTMLResponse)
async def profile(request: Request, db: Session = Depends(get_db)):
    """User profile page."""
    current_user = get_current_user_from_cookie(request, db)
    if not current_user:
        return RedirectResponse(url="/login", status_code=status.HTTP_302_FOUND)
    
    # Get user guides
    guides = db.query(BuildGuide).filter(BuildGuide.author_id == current_user.id).all()
    
    # Get user sessions
    sessions = get_user_sessions(db, current_user.id)
    
    context = {
        "request": request,
        "user": current_user,
        "guides": guides,
        "sessions": sessions
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
    
    # Calculate average win rate
    avg_win_rate = db.query(func.avg(Hero.win_rate)).scalar() or 0
    avg_pick_rate = db.query(func.avg(Hero.pick_rate)).scalar() or 0
    
    context = {
        "request": request,
        "stats": {
            "total_heroes": total_heroes,
            "total_guides": total_guides,
            "total_news": total_news,
            "avg_win_rate": round(avg_win_rate, 1),
            "avg_pick_rate": round(avg_pick_rate, 1)
        }
    }
    
    return templates.TemplateResponse("stats/index.html", context)

# Profile management routes
@router.get("/profile/edit", response_class=HTMLResponse)
async def edit_profile_page(request: Request, db: Session = Depends(get_db)):
    """Edit profile page."""
    current_user = get_current_user_from_cookie(request, db)
    if not current_user:
        return RedirectResponse(url="/login", status_code=status.HTTP_302_FOUND)
    
    return templates.TemplateResponse("profile/edit.html", {
        "request": request,
        "user": current_user
    })

@router.post("/profile/edit")
async def update_profile(request: Request, 
                        first_name: str = Form(None),
                        last_name: str = Form(None),
                        bio: str = Form(None),
                        db: Session = Depends(get_db)):
    """Update user profile."""
    current_user = get_current_user_from_cookie(request, db)
    if not current_user:
        return RedirectResponse(url="/login", status_code=status.HTTP_302_FOUND)
    
    # Update user fields
    if first_name is not None:
        current_user.first_name = first_name
    if last_name is not None:
        current_user.last_name = last_name
    if bio is not None:
        current_user.bio = bio
    
    current_user.updated_at = datetime.utcnow()
    db.commit()
    
    return RedirectResponse(url="/profile", status_code=status.HTTP_302_FOUND)

@router.get("/profile/sessions", response_class=HTMLResponse)
async def profile_sessions(request: Request, db: Session = Depends(get_db)):
    """User sessions management page."""
    current_user = get_current_user_from_cookie(request, db)
    if not current_user:
        return RedirectResponse(url="/login", status_code=status.HTTP_302_FOUND)
    
    sessions = get_user_sessions(db, current_user.id)
    
    return templates.TemplateResponse("profile/sessions.html", {
        "request": request,
        "user": current_user,
        "sessions": sessions
    })

@router.post("/profile/sessions/{session_id}/revoke")
async def revoke_session(request: Request, session_id: int, db: Session = Depends(get_db)):
    """Revoke a specific session."""
    current_user = get_current_user_from_cookie(request, db)
    if not current_user:
        return RedirectResponse(url="/login", status_code=status.HTTP_302_FOUND)
    
    session = db.query(UserSession).filter(
        UserSession.id == session_id,
        UserSession.user_id == current_user.id
    ).first()
    
    if session:
        session.is_active = False
        db.commit()
    
    return RedirectResponse(url="/profile/sessions", status_code=status.HTTP_302_FOUND)

@router.post("/profile/sessions/revoke-all")
async def revoke_all_sessions(request: Request, db: Session = Depends(get_db)):
    """Revoke all user sessions except current one."""
    current_user = get_current_user_from_cookie(request, db)
    if not current_user:
        return RedirectResponse(url="/login", status_code=status.HTTP_302_FOUND)
    
    current_session_token = request.cookies.get("access_token")
    
    # Revoke all sessions except current one
    db.query(UserSession).filter(
        UserSession.user_id == current_user.id,
        UserSession.session_token != current_session_token
    ).update({"is_active": False})
    db.commit()
    
    return RedirectResponse(url="/profile/sessions", status_code=status.HTTP_302_FOUND)

# Password change
@router.get("/profile/change-password", response_class=HTMLResponse)
async def change_password_page(request: Request, db: Session = Depends(get_db)):
    """Change password page."""
    current_user = get_current_user_from_cookie(request, db)
    if not current_user:
        return RedirectResponse(url="/login", status_code=status.HTTP_302_FOUND)
    
    return templates.TemplateResponse("profile/change-password.html", {
        "request": request,
        "user": current_user
    })

@router.post("/profile/change-password")
async def change_password(request: Request,
                         current_password: str = Form(...),
                         new_password: str = Form(...),
                         confirm_password: str = Form(...),
                         db: Session = Depends(get_db)):
    """Change user password."""
    current_user = get_current_user_from_cookie(request, db)
    if not current_user:
        return RedirectResponse(url="/login", status_code=status.HTTP_302_FOUND)
    
    # Verify current password
    if not verify_password(current_password, current_user.hashed_password):
        return templates.TemplateResponse("profile/change-password.html", {
            "request": request,
            "user": current_user,
            "error": "Неверный текущий пароль"
        })
    
    # Validate new password
    if new_password != confirm_password:
        return templates.TemplateResponse("profile/change-password.html", {
            "request": request,
            "user": current_user,
            "error": "Новые пароли не совпадают"
        })
    
    if len(new_password) < 6:
        return templates.TemplateResponse("profile/change-password.html", {
            "request": request,
            "user": current_user,
            "error": "Пароль должен содержать минимум 6 символов"
        })
    
    # Update password
    current_user.hashed_password = get_password_hash(new_password)
    current_user.updated_at = datetime.utcnow()
    db.commit()
    
    return RedirectResponse(url="/profile", status_code=status.HTTP_302_FOUND)