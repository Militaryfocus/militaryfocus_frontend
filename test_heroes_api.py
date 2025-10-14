#!/usr/bin/env python3
"""
Тест Heroes API для отладки
"""
import sys
import os
sys.path.append('/workspace/backend')

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import Hero
from app.schemas.hero import HeroResponse

def test_heroes():
    db = SessionLocal()
    try:
        # Получаем героев из базы
        heroes = db.query(Hero).all()
        print(f"Найдено героев: {len(heroes)}")
        
        for hero in heroes:
            print(f"Герой: {hero.name}, Роль: {hero.role}")
            print(f"Lane type: {type(hero.lane)}, Lane value: {hero.lane}")
            
            # Пробуем создать HeroResponse
            try:
                hero_response = HeroResponse.from_orm(hero)
                print(f"HeroResponse создан успешно: {hero_response.name}")
            except Exception as e:
                print(f"Ошибка создания HeroResponse: {e}")
                print(f"Hero data: {hero.__dict__}")
            
            print("---")
            
    except Exception as e:
        print(f"Ошибка: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_heroes()