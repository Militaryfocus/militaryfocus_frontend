#!/usr/bin/env python3
"""
Скрипт для добавления тестовых героев в базу данных
"""
import sys
import os
sys.path.append('/workspace/backend')

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import Hero

def add_test_heroes():
    db = SessionLocal()
    try:
        # Проверяем, есть ли уже герои
        existing_heroes = db.query(Hero).count()
        if existing_heroes > 0:
            print(f"В базе уже есть {existing_heroes} героев")
            return
        
        # Добавляем тестовых героев
        test_heroes = [
            {
                "name": "Layla",
                "role": "Marksman",
                "specialty": "Damage",
                "lane": ["Gold"],
                "durability": 2,
                "offense": 9,
                "control": 2,
                "difficulty": 1,
                "passive_skill": {
                    "name": "Malefic Gun",
                    "description": "Layla's basic attacks deal extra damage"
                },
                "first_skill": {
                    "name": "Malefic Bomb",
                    "description": "Fires a bomb that deals area damage"
                },
                "second_skill": {
                    "name": "Void Projectile",
                    "description": "Fires a projectile that slows enemies"
                },
                "ultimate_skill": {
                    "name": "Destruction Rush",
                    "description": "Fires a powerful beam that deals massive damage"
                },
                "release_date": "2016-07-14",
                "price": {"bp": 2000, "diamond": 0},
                "image_url": "https://example.com/layla.jpg",
                "avatar_url": "https://example.com/layla_avatar.jpg",
                "win_rate": 48.5,
                "pick_rate": 15.2,
                "ban_rate": 2.1
            },
            {
                "name": "Tigreal",
                "role": "Tank",
                "specialty": "Crowd Control",
                "lane": ["Roam", "EXP"],
                "durability": 9,
                "offense": 3,
                "control": 8,
                "difficulty": 2,
                "passive_skill": {
                    "name": "Fearless",
                    "description": "Tigreal gains damage reduction when low on health"
                },
                "first_skill": {
                    "name": "Attack Wave",
                    "description": "Sends a wave that damages and slows enemies"
                },
                "second_skill": {
                    "name": "Sacred Hammer",
                    "description": "Charges forward and knocks up enemies"
                },
                "ultimate_skill": {
                    "name": "Implosion",
                    "description": "Pulls nearby enemies and stuns them"
                },
                "release_date": "2016-07-14",
                "price": {"bp": 2000, "diamond": 0},
                "image_url": "https://example.com/tigreal.jpg",
                "avatar_url": "https://example.com/tigreal_avatar.jpg",
                "win_rate": 52.1,
                "pick_rate": 8.7,
                "ban_rate": 5.3
            },
            {
                "name": "Eudora",
                "role": "Mage",
                "specialty": "Burst",
                "lane": ["Mid"],
                "durability": 3,
                "offense": 8,
                "control": 6,
                "difficulty": 2,
                "passive_skill": {
                    "name": "Superconductor",
                    "description": "Eudora's skills mark enemies with Superconductor"
                },
                "first_skill": {
                    "name": "Forked Lightning",
                    "description": "Fires lightning that bounces between enemies"
                },
                "second_skill": {
                    "name": "Electric Arrow",
                    "description": "Fires an arrow that stuns the first enemy hit"
                },
                "ultimate_skill": {
                    "name": "Thunder's Wrath",
                    "description": "Calls down lightning that deals massive damage"
                },
                "release_date": "2016-07-14",
                "price": {"bp": 2000, "diamond": 0},
                "image_url": "https://example.com/eudora.jpg",
                "avatar_url": "https://example.com/eudora_avatar.jpg",
                "win_rate": 49.8,
                "pick_rate": 12.4,
                "ban_rate": 1.8
            }
        ]
        
        for hero_data in test_heroes:
            hero = Hero(**hero_data)
            db.add(hero)
        
        db.commit()
        print(f"Добавлено {len(test_heroes)} тестовых героев")
        
    except Exception as e:
        print(f"Ошибка при добавлении героев: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_test_heroes()