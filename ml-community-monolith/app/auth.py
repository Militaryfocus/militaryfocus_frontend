from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.models import User, UserSession
from app.schemas import TokenData

# Password hashing
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# JWT token scheme
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str, credentials_exception):
    """Verify a JWT token and return the username."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
        return token_data
    except JWTError:
        raise credentials_exception

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """Get the current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = verify_token(credentials.credentials, credentials_exception)
    user = db.query(User).filter(User.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(current_user: User = Depends(get_current_user)):
    """Get the current active user."""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def get_current_admin_user(current_user: User = Depends(get_current_active_user)):
    """Get the current admin user."""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

def get_current_user_from_cookie(request: Request, db: Session = Depends(get_db)):
    """Get current user from cookie session."""
    session_token = request.cookies.get("access_token")
    if not session_token:
        return None
    
    user = get_user_from_session(db, session_token)
    return user

def get_current_user_optional(request: Request, db: Session = Depends(get_db)):
    """Get current user from cookie (optional, returns None if not authenticated)."""
    return get_current_user_from_cookie(request, db)

def authenticate_user(db: Session, username: str, password: str):
    """Authenticate a user with username and password."""
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_user_session(db: Session, user_id: int, session_token: str, 
                       ip_address: str = None, user_agent: str = None):
    """Create a new user session."""
    # Deactivate old sessions for this user
    db.query(UserSession).filter(
        UserSession.user_id == user_id,
        UserSession.is_active == True
    ).update({"is_active": False})
    
    # Create new session
    expires_at = datetime.utcnow() + timedelta(days=30)  # 30 days session
    session = UserSession(
        user_id=user_id,
        session_token=session_token,
        ip_address=ip_address,
        user_agent=user_agent,
        expires_at=expires_at
    )
    db.add(session)
    db.commit()
    return session

def get_user_from_session(db: Session, session_token: str):
    """Get user from session token."""
    session = db.query(UserSession).filter(
        UserSession.session_token == session_token,
        UserSession.is_active == True,
        UserSession.expires_at > datetime.utcnow()
    ).first()
    
    if not session:
        return None
    
    # Update last activity
    session.last_activity = datetime.utcnow()
    db.commit()
    
    return session.user

def deactivate_session(db: Session, session_token: str):
    """Deactivate a user session."""
    session = db.query(UserSession).filter(
        UserSession.session_token == session_token
    ).first()
    
    if session:
        session.is_active = False
        db.commit()

def get_user_sessions(db: Session, user_id: int):
    """Get all active sessions for a user."""
    return db.query(UserSession).filter(
        UserSession.user_id == user_id,
        UserSession.is_active == True
    ).all()

def cleanup_expired_sessions(db: Session):
    """Clean up expired sessions."""
    db.query(UserSession).filter(
        UserSession.expires_at < datetime.utcnow()
    ).update({"is_active": False})
    db.commit()