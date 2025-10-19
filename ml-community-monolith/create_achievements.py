#!/usr/bin/env python3
"""
Script to create default achievements for ML Community Platform
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import Achievement

def create_achievements():
    """Create default achievements."""
    db = SessionLocal()
    
    try:
        # Check if achievements already exist
        existing_count = db.query(Achievement).count()
        if existing_count > 0:
            print(f"Achievements already exist ({existing_count} found). Skipping creation.")
            return
        
        achievements = [
            # Guide Creation Achievements
            {
                "name": "Первый гайд",
                "description": "Создайте свой первый гайд",
                "icon": "file-text",
                "category": "guides",
                "requirement": {"guides_created": 1},
                "points": 10
            },
            {
                "name": "Автор",
                "description": "Создайте 5 гайдов",
                "icon": "edit",
                "category": "guides",
                "requirement": {"guides_created": 5},
                "points": 50
            },
            {
                "name": "Эксперт",
                "description": "Создайте 10 гайдов",
                "icon": "award",
                "category": "guides",
                "requirement": {"guides_created": 10},
                "points": 100
            },
            {
                "name": "Мастер гайдов",
                "description": "Создайте 25 гайдов",
                "icon": "crown",
                "category": "guides",
                "requirement": {"guides_created": 25},
                "points": 250
            },
            
            # Social Achievements
            {
                "name": "Первый комментарий",
                "description": "Оставьте свой первый комментарий",
                "icon": "message-circle",
                "category": "social",
                "requirement": {"comments_posted": 1},
                "points": 5
            },
            {
                "name": "Активный участник",
                "description": "Оставьте 10 комментариев",
                "icon": "message-square",
                "category": "social",
                "requirement": {"comments_posted": 10},
                "points": 25
            },
            {
                "name": "Популярный автор",
                "description": "Получите 50 лайков на свои гайды",
                "icon": "heart",
                "category": "social",
                "requirement": {"likes_received": 50},
                "points": 75
            },
            {
                "name": "Звезда сообщества",
                "description": "Получите 100 лайков на свои гайды",
                "icon": "star",
                "category": "social",
                "requirement": {"likes_received": 100},
                "points": 150
            },
            
            # Activity Achievements
            {
                "name": "Первые просмотры",
                "description": "Наберите 100 просмотров на свои гайды",
                "icon": "eye",
                "category": "activity",
                "requirement": {"total_views": 100},
                "points": 20
            },
            {
                "name": "Популярность",
                "description": "Наберите 1000 просмотров на свои гайды",
                "icon": "trending-up",
                "category": "activity",
                "requirement": {"total_views": 1000},
                "points": 100
            },
            {
                "name": "Высокий рейтинг",
                "description": "Достигните среднего рейтинга 4.5 звезд",
                "icon": "star",
                "category": "activity",
                "requirement": {"average_rating": 4.5},
                "points": 200
            },
            {
                "name": "Щедрый на лайки",
                "description": "Поставьте 50 лайков другим авторам",
                "icon": "thumbs-up",
                "category": "social",
                "requirement": {"likes_given": 50},
                "points": 30
            }
        ]
        
        for achievement_data in achievements:
            achievement = Achievement(**achievement_data)
            db.add(achievement)
        
        db.commit()
        print(f"Successfully created {len(achievements)} achievements!")
        
        # Print created achievements
        print("\nCreated achievements:")
        for achievement in achievements:
            print(f"- {achievement['name']}: {achievement['description']} ({achievement['points']} points)")
            
    except Exception as e:
        print(f"Error creating achievements: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating default achievements...")
    create_achievements()
    print("Done!")