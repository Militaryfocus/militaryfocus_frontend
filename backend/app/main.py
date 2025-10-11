from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api.v1 import heroes, guides, users, auth, search, news

app = FastAPI(
    title="Mobile Legends Community API",
    description="Фан-сообщество Mobile Legends: Bang Bang - API для управления героями, гайдами и тактиками",
    version="1.1.4",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include API routes
app.include_router(heroes.router, prefix="/api/v1/heroes", tags=["heroes"])
app.include_router(guides.router, prefix="/api/v1/guides", tags=["guides"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(search.router, prefix="/api/v1/search", tags=["search"])
app.include_router(news.router, prefix="/api/v1/news", tags=["news"])

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "ml-community-api",
        "version": "1.1.4",
        "message": "Mobile Legends Community Platform is running"
    }

@app.get("/")
async def root():
    return {
        "message": "Welcome to Mobile Legends Community API",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/api/v1")
async def api_info():
    return {
        "api_version": "v1",
        "endpoints": {
            "heroes": "/api/v1/heroes",
            "guides": "/api/v1/guides", 
            "users": "/api/v1/users",
            "auth": "/api/v1/auth",
            "search": "/api/v1/search",
            "news": "/api/v1/news"
        }
    }