#!/usr/bin/env python3
"""
Полная инициализация базы данных с тестовыми данными
"""
import sys
import os
sys.path.append('/workspace/backend')

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import User, Hero, Item, Emblem, BuildGuide, News
from app.core.password import get_password_hash
import json

def init_database():
    db = SessionLocal()
    try:
        print("🚀 Начинаем полную инициализацию базы данных...")
        
        # 1. Создание админ-пользователя
        print("👤 Создание админ-пользователя...")
        admin_user = db.query(User).filter(User.email == "admin@ml-community.com").first()
        if not admin_user:
            admin_user = User(
                email="admin@ml-community.com",
                username="admin",
                hashed_password=get_password_hash("admin123")[:72],
                ign="ML_Admin",
                current_rank="Mythic",
                main_heroes=[1, 2, 3],
                role="Admin",
                is_active=True,
                is_verified=True
            )
            db.add(admin_user)
            print("✅ Админ-пользователь создан")
        else:
            print("ℹ️ Админ-пользователь уже существует")
        
        # 2. Создание тестового пользователя
        print("👤 Создание тестового пользователя...")
        test_user = db.query(User).filter(User.email == "test@ml-community.com").first()
        if not test_user:
            test_user = User(
                email="test@ml-community.com",
                username="testuser",
                hashed_password=get_password_hash("test123")[:72],
                ign="TestPlayer",
                current_rank="Epic",
                main_heroes=[1, 2],
                role="User",
                is_active=True,
                is_verified=True
            )
            db.add(test_user)
            print("✅ Тестовый пользователь создан")
        else:
            print("ℹ️ Тестовый пользователь уже существует")
        
        # 3. Добавление дополнительных героев
        print("🦸 Добавление дополнительных героев...")
        additional_heroes = [
            {
                "name": "Miya",
                "role": "Marksman",
                "specialty": "Damage",
                "lane": ["Gold"],
                "durability": 3,
                "offense": 8,
                "control": 3,
                "difficulty": 2,
                "passive_skill": {"name": "Moonlight Arrow", "description": "Miya's basic attacks deal extra damage"},
                "first_skill": {"name": "Frost Arrow", "description": "Fires an arrow that slows enemies"},
                "second_skill": {"name": "Twin Arrow", "description": "Fires two arrows at once"},
                "ultimate_skill": {"name": "Moonlight Shadow", "description": "Becomes invisible and gains movement speed"},
                "release_date": "2016-07-14",
                "price": {"bp": 2000, "diamond": 0},
                "image_url": "https://example.com/miya.jpg",
                "avatar_url": "https://example.com/miya_avatar.jpg",
                "win_rate": 47.2,
                "pick_rate": 18.5,
                "ban_rate": 1.2
            },
            {
                "name": "Alucard",
                "role": "Fighter",
                "specialty": "Damage",
                "lane": ["EXP", "Jungle"],
                "durability": 6,
                "offense": 8,
                "control": 4,
                "difficulty": 3,
                "passive_skill": {"name": "Pursuit", "description": "Alucard gains movement speed when chasing enemies"},
                "first_skill": {"name": "Groundsplitter", "description": "Slams the ground dealing area damage"},
                "second_skill": {"name": "Whirling Smash", "description": "Spins dealing damage to nearby enemies"},
                "ultimate_skill": {"name": "Fission Wave", "description": "Releases energy waves in all directions"},
                "release_date": "2016-07-14",
                "price": {"bp": 2000, "diamond": 0},
                "image_url": "https://example.com/alucard.jpg",
                "avatar_url": "https://example.com/alucard_avatar.jpg",
                "win_rate": 50.1,
                "pick_rate": 14.3,
                "ban_rate": 3.7
            },
            {
                "name": "Franco",
                "role": "Tank",
                "specialty": "Crowd Control",
                "lane": ["Roam"],
                "durability": 8,
                "offense": 4,
                "control": 9,
                "difficulty": 4,
                "passive_skill": {"name": "Wasteland Force", "description": "Franco gains armor and magic resistance"},
                "first_skill": {"name": "Iron Hook", "description": "Hooks an enemy and pulls them to Franco"},
                "second_skill": {"name": "Bloody Hunt", "description": "Charges forward dealing damage and stunning"},
                "ultimate_skill": {"name": "Bloody Hunt", "description": "Suppresses an enemy dealing continuous damage"},
                "release_date": "2016-07-14",
                "price": {"bp": 2000, "diamond": 0},
                "image_url": "https://example.com/franco.jpg",
                "avatar_url": "https://example.com/franco_avatar.jpg",
                "win_rate": 51.8,
                "pick_rate": 9.2,
                "ban_rate": 8.5
            }
        ]
        
        for hero_data in additional_heroes:
            existing_hero = db.query(Hero).filter(Hero.name == hero_data["name"]).first()
            if not existing_hero:
                hero = Hero(**hero_data)
                db.add(hero)
                print(f"✅ Герой {hero_data['name']} добавлен")
            else:
                print(f"ℹ️ Герой {hero_data['name']} уже существует")
        
        # 4. Добавление предметов
        print("⚔️ Добавление предметов...")
        items = [
            {
                "name": "Blade of Despair",
                "description": "Increases physical attack and critical chance",
                "price": 3010,
                "category": "Attack",
                "stats": {"physical_attack": 170, "critical_chance": 0.25},
                "passive_effect": {"name": "Despair", "description": "Increases damage against low HP enemies"},
                "active_effect": None,
                "image_url": "https://example.com/blade_of_despair.jpg"
            },
            {
                "name": "Immortality",
                "description": "Revives the hero when killed",
                "price": 2120,
                "category": "Defense",
                "stats": {"physical_defense": 40, "magic_defense": 40, "hp": 800},
                "passive_effect": {"name": "Immortal", "description": "Revives with 15% HP after death"},
                "active_effect": None,
                "image_url": "https://example.com/immortality.jpg"
            },
            {
                "name": "Lightning Truncheon",
                "description": "Increases magic power and mana",
                "price": 2250,
                "category": "Magic",
                "stats": {"magic_power": 75, "mana": 400, "cooldown_reduction": 0.1},
                "passive_effect": {"name": "Resonance", "description": "Skills deal extra magic damage"},
                "active_effect": None,
                "image_url": "https://example.com/lightning_truncheon.jpg"
            }
        ]
        
        for item_data in items:
            existing_item = db.query(Item).filter(Item.name == item_data["name"]).first()
            if not existing_item:
                item = Item(**item_data)
                db.add(item)
                print(f"✅ Предмет {item_data['name']} добавлен")
            else:
                print(f"ℹ️ Предмет {item_data['name']} уже существует")
        
        # 5. Добавление эмблем
        print("🏆 Добавление эмблем...")
        emblems = [
            {
                "name": "Assassin Emblem",
                "type": "Physical",
                "level": 60,
                "stats": {"physical_attack": 15, "armor_penetration": 10, "movement_speed": 0.05},
                "talents": {
                    "tier1": ["Bounty Hunter", "Master Assassin"],
                    "tier2": ["High and Dry", "Killing Spree"],
                    "tier3": ["Infinite Battle", "Berserker's Fury"]
                },
                "image_url": "https://example.com/assassin_emblem.jpg"
            },
            {
                "name": "Mage Emblem",
                "type": "Magic",
                "level": 60,
                "stats": {"magic_power": 15, "magic_penetration": 10, "cooldown_reduction": 0.05},
                "talents": {
                    "tier1": ["Magic Worship", "Impure Rage"],
                    "tier2": ["Mystery Shop", "Magic Power Surge"],
                    "tier3": ["Lethal Ignition", "Impure Rage"]
                },
                "image_url": "https://example.com/mage_emblem.jpg"
            }
        ]
        
        for emblem_data in emblems:
            existing_emblem = db.query(Emblem).filter(Emblem.name == emblem_data["name"]).first()
            if not existing_emblem:
                emblem = Emblem(**emblem_data)
                db.add(emblem)
                print(f"✅ Эмблема {emblem_data['name']} добавлена")
            else:
                print(f"ℹ️ Эмблема {emblem_data['name']} уже существует")
        
        # 6. Добавление новостей
        print("📰 Добавление новостей...")
        news_items = [
            {
                "title": "Новый патч 1.8.50 - Обновления героев",
                "content": "В новом патче были обновлены балансы для 15 героев, включая Layla, Tigreal и Eudora. Также добавлены новые предметы и эмблемы.",
                "summary": "Обновления баланса героев в патче 1.8.50",
                "author_id": 1,  # admin user
                "category": "patch",
                "tags": ["patch", "balance", "update"],
                "image_url": "https://example.com/patch_1_8_50.jpg",
                "views": 0,
                "is_published": True,
                "is_featured": True
            },
            {
                "title": "Турнир MPL Season 12 - Регистрация открыта",
                "content": "Регистрация на Mobile Legends Professional League Season 12 официально открыта. Призовой фонд составляет $500,000.",
                "summary": "Открыта регистрация на MPL Season 12",
                "author_id": 1,  # admin user
                "category": "tournament",
                "tags": ["tournament", "mpl", "esports"],
                "image_url": "https://example.com/mpl_s12.jpg",
                "views": 0,
                "is_published": True,
                "is_featured": False
            }
        ]
        
        for news_data in news_items:
            existing_news = db.query(News).filter(News.title == news_data["title"]).first()
            if not existing_news:
                news = News(**news_data)
                db.add(news)
                print(f"✅ Новость '{news_data['title']}' добавлена")
            else:
                print(f"ℹ️ Новость '{news_data['title']}' уже существует")
        
        # 7. Добавление гайдов
        print("📖 Добавление гайдов...")
        guides = [
            {
                "hero_id": 1,  # Layla
                "author_id": 1,  # admin
                "title": "Layla - Полный гайд для новичков",
                "description": "Подробный гайд по игре за Layla, включая сборку предметов, эмблемы и тактики.",
                "emblems": {"type": "Marksman", "level": 60, "talents": ["Bounty Hunter", "High and Dry", "Infinite Battle"]},
                "battle_spell": "Flicker",
                "item_build": {
                    "early": ["Swift Boots", "Wind of Nature"],
                    "mid": ["Berserker's Fury", "Scarlet Phantom"],
                    "late": ["Blade of Despair", "Immortality"]
                },
                "skill_priority": ["ultimate", "first", "second", "passive"],
                "play_style": "Balanced",
                "difficulty": "Easy",
                "tags": ["beginner", "marksman", "meta"],
                "views": 0,
                "likes": 0,
                "rating": 0.0,
                "rating_count": 0,
                "is_published": True,
                "version": "1.0"
            }
        ]
        
        for guide_data in guides:
            existing_guide = db.query(BuildGuide).filter(
                BuildGuide.title == guide_data["title"],
                BuildGuide.author_id == guide_data["author_id"]
            ).first()
            if not existing_guide:
                guide = BuildGuide(**guide_data)
                db.add(guide)
                print(f"✅ Гайд '{guide_data['title']}' добавлен")
            else:
                print(f"ℹ️ Гайд '{guide_data['title']}' уже существует")
        
        # Сохраняем все изменения
        db.commit()
        print("\n🎉 Полная инициализация базы данных завершена!")
        
        # Статистика
        print("\n📊 Статистика базы данных:")
        print(f"👥 Пользователи: {db.query(User).count()}")
        print(f"🦸 Герои: {db.query(Hero).count()}")
        print(f"⚔️ Предметы: {db.query(Item).count()}")
        print(f"🏆 Эмблемы: {db.query(Emblem).count()}")
        print(f"📖 Гайды: {db.query(BuildGuide).count()}")
        print(f"📰 Новости: {db.query(News).count()}")
        
    except Exception as e:
        print(f"❌ Ошибка при инициализации: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_database()