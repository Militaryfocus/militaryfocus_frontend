#!/usr/bin/env python3
"""
Simple script to create admin user without bcrypt issues
"""
import os
import sys
sys.path.append('.')

from app.core.database import SessionLocal, engine
from app.models import User
from sqlalchemy import text

def create_admin():
    # Create tables if they don't exist
    from app.models import Base
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if admin user already exists
        admin_user = db.query(User).filter(User.username == 'admin').first()
        if not admin_user:
            # Use simple hash for now
            hashed_password = "admin123"  # In production, use proper hashing
            
            admin_user = User(
                username='admin',
                email='admin@militaryfocus.ru',
                hashed_password=hashed_password,
                is_active=True,
                is_admin=True
            )
            db.add(admin_user)
            db.commit()
            print('✅ Admin user created successfully')
            print('   Username: admin')
            print('   Password: admin123')
            print('   Email: admin@militaryfocus.ru')
        else:
            print('ℹ️  Admin user already exists')
    except Exception as e:
        print(f'❌ Error creating admin user: {e}')
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()