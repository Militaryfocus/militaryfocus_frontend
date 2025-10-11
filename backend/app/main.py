from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import time
import uvicorn
from app.core.config import settings
from app.core.logging import get_logger
from app.api.v1 import heroes, guides, users, auth, search, news

# Инициализация логгеров
logger = get_logger("main")
api_logger = get_logger("api")

app = FastAPI(
    title="Mobile Legends Community API",
    description="Фан-сообщество Mobile Legends: Bang Bang - API для управления героями, гайдами и тактиками",
    version="1.1.6",
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

# Middleware для логирования запросов
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Логируем входящий запрос
    api_logger.info(f"Request: {request.method} {request.url.path} from {request.client.host}")
    
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Логируем ответ
        api_logger.info(f"Response: {response.status_code} in {process_time:.3f}s")
        
        return response
    except Exception as e:
        process_time = time.time() - start_time
        api_logger.error(f"Error: {str(e)} in {process_time:.3f}s")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
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
    logger.info("Health check requested")
    return {
        "status": "healthy", 
        "service": "ml-community-api",
        "version": "1.1.6",
        "message": "Mobile Legends Community Platform is running",
        "timestamp": time.time()
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