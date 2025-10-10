#!/usr/bin/env python3
"""
Скрипт для импорта данных героев Mobile Legends
"""

import json
import sys
import os
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import Hero

def import_heroes_data():
    """Импорт данных героев из JSON файла"""
    db: Session = SessionLocal()
    
    try:
        # Путь к файлу с данными героев
        heroes_file = os.path.join(os.path.dirname(__file__), '..', 'data', 'heroes.json')
        
        if not os.path.exists(heroes_file):
            print("❌ Файл heroes.json не найден")
            print("Создайте файл backend/data/heroes.json с данными героев")
            return False
        
        with open(heroes_file, 'r', encoding='utf-8') as f:
            heroes_data = json.load(f)
        
        imported_count = 0
        skipped_count = 0
        
        for hero_data in heroes_data:
            # Проверить, существует ли уже герой с таким именем
            existing_hero = db.query(Hero).filter(Hero.name == hero_data['name']).first()
            if existing_hero:
                print(f"⚠️  Герой {hero_data['name']} уже существует, пропускаем")
                skipped_count += 1
                continue
            
            # Создать нового героя
            hero = Hero(
                name=hero_data['name'],
                role=hero_data['role'],
                specialty=hero_data['specialty'],
                lane=hero_data.get('lane', []),
                durability=hero_data.get('stats', {}).get('durability'),
                offense=hero_data.get('stats', {}).get('offense'),
                control=hero_data.get('stats', {}).get('control'),
                difficulty=hero_data.get('stats', {}).get('difficulty'),
                passive_skill=hero_data.get('skills', {}).get('passive'),
                first_skill=hero_data.get('skills', {}).get('first'),
                second_skill=hero_data.get('skills', {}).get('second'),
                ultimate_skill=hero_data.get('skills', {}).get('ultimate'),
                release_date=hero_data.get('release_date'),
                price=hero_data.get('price'),
                image_url=hero_data.get('images', {}).get('main'),
                avatar_url=hero_data.get('images', {}).get('avatar'),
                win_rate=hero_data.get('meta_stats', {}).get('win_rate', 0.0),
                pick_rate=hero_data.get('meta_stats', {}).get('pick_rate', 0.0),
                ban_rate=hero_data.get('meta_stats', {}).get('ban_rate', 0.0)
            )
            
            db.add(hero)
            imported_count += 1
            print(f"✅ Импортирован герой: {hero_data['name']}")
        
        db.commit()
        print(f"\n🎉 Импорт завершен!")
        print(f"📊 Импортировано: {imported_count} героев")
        print(f"⚠️  Пропущено: {skipped_count} героев")
        
        return True
        
    except Exception as e:
        print(f"❌ Ошибка импорта: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def create_sample_heroes():
    """Создать примеры героев для тестирования"""
    db: Session = SessionLocal()
    
    try:
        sample_heroes = [
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
                    "description": "Layla fires a bomb that deals physical damage"
                },
                "second_skill": {
                    "name": "Void Projectile",
                    "description": "Layla fires a projectile that slows enemies"
                },
                "ultimate_skill": {
                    "name": "Destruction Rush",
                    "description": "Layla fires a powerful shot that deals massive damage"
                },
                "release_date": "2016-07-01",
                "price": {"bp": 2000, "diamond": 0},
                "image_url": "/static/heroes/layla.jpg",
                "avatar_url": "/static/heroes/layla_avatar.jpg",
                "win_rate": 48.5,
                "pick_rate": 15.2,
                "ban_rate": 2.1
            },
            {
                "name": "Tigreal",
                "role": "Tank",
                "specialty": "Crowd Control",
                "lane": ["EXP", "Roam"],
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
                    "description": "Tigreal slashes forward dealing physical damage"
                },
                "second_skill": {
                    "name": "Sacred Hammer",
                    "description": "Tigreal charges forward and knocks up enemies"
                },
                "ultimate_skill": {
                    "name": "Implosion",
                    "description": "Tigreal pulls nearby enemies and stuns them"
                },
                "release_date": "2016-07-01",
                "price": {"bp": 2000, "diamond": 0},
                "image_url": "/static/heroes/tigreal.jpg",
                "avatar_url": "/static/heroes/tigreal_avatar.jpg",
                "win_rate": 52.1,
                "pick_rate": 8.7,
                "ban_rate": 12.3
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
                    "description": "Eudora's skills mark enemies for extra damage"
                },
                "first_skill": {
                    "name": "Forked Lightning",
                    "description": "Eudora fires lightning that bounces between enemies"
                },
                "second_skill": {
                    "name": "Electric Arrow",
                    "description": "Eudora fires an electric arrow that stuns enemies"
                },
                "ultimate_skill": {
                    "name": "Thunder's Wrath",
                    "description": "Eudora calls down lightning dealing massive magic damage"
                },
                "release_date": "2016-07-01",
                "price": {"bp": 2000, "diamond": 0},
                "image_url": "/static/heroes/eudora.jpg",
                "avatar_url": "/static/heroes/eudora_avatar.jpg",
                "win_rate": 49.8,
                "pick_rate": 12.4,
                "ban_rate": 5.6
            }
        ]
        
        for hero_data in sample_heroes:
            existing_hero = db.query(Hero).filter(Hero.name == hero_data['name']).first()
            if existing_hero:
                continue
            
            hero = Hero(**hero_data)
            db.add(hero)
            print(f"✅ Создан герой: {hero_data['name']}")
        
        db.commit()
        print("🎉 Примеры героев созданы!")
        
    except Exception as e:
        print(f"❌ Ошибка создания примеров: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🎮 Импорт данных героев Mobile Legends")
    print("=" * 50)
    
    # Попробовать импортировать из файла, если не получится - создать примеры
    if not import_heroes_data():
        print("\n📝 Создание примеров героев для тестирования...")
        create_sample_heroes()
    
    print("\n✅ Готово!")