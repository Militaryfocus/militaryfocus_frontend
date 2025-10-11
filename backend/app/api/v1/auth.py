from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.core.database import get_db
from app.core.config import settings
from app.core.logging import get_logger
from app.models import User
from app.schemas.user import UserCreate, UserResponse, Token
from app.crud import user as user_crud
from app.core.security import create_access_token, oauth2_scheme, get_current_user

# Инициализация логгеров
logger = get_logger("auth")
security_logger = get_logger("security")

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Регистрация нового пользователя"""
    logger.info(f"Registration attempt for email: {user.email}, username: {user.username}")
    
    # Проверить, существует ли пользователь с таким email
    db_user = user_crud.get_user_by_email(db, email=user.email)
    if db_user:
        security_logger.warning(f"Registration failed: Email already exists - {user.email}")
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Проверить, существует ли пользователь с таким username
    db_user = user_crud.get_user_by_username(db, username=user.username)
    if db_user:
        security_logger.warning(f"Registration failed: Username already taken - {user.username}")
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )
    
    # Создать нового пользователя
    try:
        new_user = user_crud.create_user(db=db, user=user)
        logger.info(f"User registered successfully: {new_user.id} - {new_user.username}")
        return new_user
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Registration failed")

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Аутентификация пользователя"""
    logger.info(f"Login attempt for username: {form_data.username}")
    
    user = user_crud.authenticate_user(
        db, form_data.username, form_data.password
    )
    if not user:
        security_logger.warning(f"Failed login attempt for username: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    logger.info(f"Successful login for user: {user.id} - {user.username}")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Получить информацию о текущем пользователе"""
    return current_user

@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: User = Depends(get_current_user)):
    """Обновить токен доступа"""
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout():
    """Выход из системы"""
    return {"message": "Successfully logged out"}

@router.post("/forgot-password")
async def forgot_password(email: str, db: Session = Depends(get_db)):
    """Запрос на восстановление пароля"""
    user = user_crud.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Здесь должна быть логика отправки email с токеном сброса
    # Пока что просто возвращаем сообщение
    return {"message": "Password reset email sent"}

@router.post("/reset-password")
async def reset_password(
    token: str,
    new_password: str,
    db: Session = Depends(get_db)
):
    """Сброс пароля по токену"""
    # Здесь должна быть логика проверки токена и сброса пароля
    # Пока что просто возвращаем сообщение
    return {"message": "Password reset successfully"}