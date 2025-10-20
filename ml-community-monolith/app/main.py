from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import HTMLResponse
import os

from app.core.config import settings
from app.core.database import engine, Base
from app.routers import router
from app.api import api_router

# Create FastAPI app
app = FastAPI(
    title="ML Community Platform",
    description="Фан-сообщество Mobile Legends: Bang Bang",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Include routers
app.include_router(router)
app.include_router(api_router)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "ML Community Platform is running"}

# API endpoints (for backward compatibility)
@app.get("/api/health")
async def api_health():
    """API health check."""
    return {"status": "healthy", "api": "running"}

# Root redirect to home (handled by router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)