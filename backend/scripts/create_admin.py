#!/usr/bin/env python3
"""
Скрипт для создания администратора
"""

import os
import sys
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import User
from app.core.security import get_password_hash

def create_admin():
    """Создать администратора"""
    db: Session = SessionLocal()
    
    try:
        # Проверить, существует ли уже администратор
        admin = db.query(User).filter(User.username == "admin").first()
        if admin:
            print("⚠️  Администратор уже существует")
            return True
        
        # Создать администратора
        admin = User(
            email="admin@mlcommunity.com",
            username="admin",
            hashed_password=get_password_hash("admin123"),
            ign="MLAdmin",
            current_rank="Mythic",
            role="Admin",
            is_active=True,
            is_verified=True
        )
        
        db.add(admin)
        db.commit()
        
        print("✅ Администратор создан успешно!")
        print("📧 Email: admin@mlcommunity.com")
        print("👤 Username: admin")
        print("🔑 Password: admin123")
        print("⚠️  Не забудьте изменить пароль после первого входа!")
        
        return True
        
    except Exception as e:
        print(f"❌ Ошибка создания администратора: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("👑 Создание администратора")
    print("=" * 30)
    
    create_admin()
    
    print("\n✅ Готово!")