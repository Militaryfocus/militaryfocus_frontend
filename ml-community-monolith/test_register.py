#!/usr/bin/env python3
"""Test registration function to debug the issue."""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import get_db, engine, Base
from app.models import User
from app.auth import get_password_hash, create_access_token, create_user_session
from sqlalchemy.orm import Session

def test_registration():
    """Test the registration process step by step."""
    print("🔍 Testing registration process...")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    
    # Get database session
    db = next(get_db())
    print("✅ Database session created")
    
    try:
        # Test data
        username = "testuser"
        email = "test@example.com"
        password = "test123"
        first_name = "Test"
        last_name = "User"
        
        print(f"📝 Testing with username: {username}")
        
        # Check if user exists
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user:
            print("⚠️  User already exists, deleting...")
            db.delete(existing_user)
            db.commit()
        
        # Check email
        existing_email = db.query(User).filter(User.email == email).first()
        if existing_email:
            print("⚠️  Email already exists, deleting...")
            db.delete(existing_email)
            db.commit()
        
        print("✅ User checks passed")
        
        # Hash password
        hashed_password = get_password_hash(password)
        print("✅ Password hashed")
        
        # Create user
        user = User(
            username=username,
            email=email,
            hashed_password=hashed_password,
            first_name=first_name,
            last_name=last_name
        )
        print("✅ User object created")
        
        # Add to database
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"✅ User saved to database with ID: {user.id}")
        
        # Create access token
        access_token = create_access_token(data={"sub": user.username})
        print("✅ Access token created")
        
        # Create session
        session = create_user_session(db, user.id, access_token, "127.0.0.1", "test-agent")
        print(f"✅ Session created with ID: {session.id}")
        
        print("🎉 Registration test completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during registration test: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_registration()