#!/usr/bin/env python3
"""
Добавление дополнительных данных в базу
"""
import sys
import os
sys.path.append('/workspace/backend')

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import User, Hero, Item, Emblem, BuildGuide, News
import hashlib
import secrets
from datetime import datetime

def simple_hash_password(password: str) -> str:
    """Простое хеширование пароля с солью"""
    salt = secrets.token_hex(16)
    password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}:{password_hash}"

def add_more_heroes():
    """Добавить больше героев"""
    heroes_data = [
        {
            "name": "Gusion",
            "role": "Assassin",
            "specialty": "Burst",
            "lane": ["Mid", "Jungle"],
            "durability": 4,
            "offense": 9,
            "control": 6,
            "difficulty": 8,
            "passive_skill": {"name": "Soul Steal", "description": "Gusion gains energy from killing enemies"},
            "first_skill": {"name": "Sword Spike", "description": "Throws daggers that deal damage"},
            "second_skill": {"name": "Shadowblade Slaughter", "description": "Teleports and deals massive damage"},
            "ultimate_skill": {"name": "Incandescence", "description": "Becomes invisible and gains movement speed"},
            "release_date": "2017-08-08",
            "price": {"bp": 32000, "diamond": 599},
            "image_url": "https://example.com/gusion.jpg",
            "avatar_url": "https://example.com/gusion_avatar.jpg",
            "win_rate": 52.3,
            "pick_rate": 12.1,
            "ban_rate": 15.7
        },
        {
            "name": "Lunox",
            "role": "Mage",
            "specialty": "Burst",
            "lane": ["Mid"],
            "durability": 3,
            "offense": 9,
            "control": 7,
            "difficulty": 6,
            "passive_skill": {"name": "Cosmic Balance", "description": "Lunox switches between light and dark powers"},
            "first_skill": {"name": "Starlight Pulse", "description": "Fires light energy that bounces between enemies"},
            "second_skill": {"name": "Chaos Assault", "description": "Fires dark energy that slows enemies"},
            "ultimate_skill": {"name": "Order & Chaos", "description": "Switches between light and dark forms"},
            "release_date": "2018-03-20",
            "price": {"bp": 32000, "diamond": 599},
            "image_url": "https://example.com/lunox.jpg",
            "avatar_url": "https://example.com/lunox_avatar.jpg",
            "win_rate": 48.9,
            "pick_rate": 8.3,
            "ban_rate": 22.1
        },
        {
            "name": "Khufra",
            "role": "Tank",
            "specialty": "Crowd Control",
            "lane": ["Roam", "EXP"],
            "durability": 9,
            "offense": 4,
            "control": 9,
            "difficulty": 5,
            "passive_skill": {"name": "Spell Cursed", "description": "Khufra gains shield when using skills"},
            "first_skill": {"name": "Bouncing Ball", "description": "Rolls forward and knocks up enemies"},
            "second_skill": {"name": "Tyrant's Revenge", "description": "Pulls nearby enemies and stuns them"},
            "ultimate_skill": {"name": "Tyrant's Rage", "description": "Creates a barrier that blocks enemy movement"},
            "release_date": "2018-07-17",
            "price": {"bp": 32000, "diamond": 599},
            "image_url": "https://example.com/khufra.jpg",
            "avatar_url": "https://example.com/khufra_avatar.jpg",
            "win_rate": 51.7,
            "pick_rate": 6.8,
            "ban_rate": 18.4
        },
        {
            "name": "Granger",
            "role": "Marksman",
            "specialty": "Damage",
            "lane": ["Gold"],
            "durability": 3,
            "offense": 9,
            "control": 4,
            "difficulty": 4,
            "passive_skill": {"name": "Rhapsody", "description": "Granger's basic attacks deal extra damage"},
            "first_skill": {"name": "Rondo", "description": "Fires bullets that deal area damage"},
            "second_skill": {"name": "Caprice", "description": "Dashes and gains attack speed"},
            "ultimate_skill": {"name": "Death Sonata", "description": "Fires a powerful shot that deals massive damage"},
            "release_date": "2019-01-15",
            "price": {"bp": 32000, "diamond": 599},
            "image_url": "https://example.com/granger.jpg",
            "avatar_url": "https://example.com/granger_avatar.jpg",
            "win_rate": 49.2,
            "pick_rate": 11.5,
            "ban_rate": 3.2
        },
        {
            "name": "Esmeralda",
            "role": "Mage",
            "specialty": "Burst",
            "lane": ["Mid", "EXP"],
            "durability": 5,
            "offense": 8,
            "control": 6,
            "difficulty": 7,
            "passive_skill": {"name": "Frostmoon", "description": "Esmeralda's skills mark enemies with frost"},
            "first_skill": {"name": "Frostmoon", "description": "Fires ice shards that slow enemies"},
            "second_skill": {"name": "Frostmoon", "description": "Creates an ice field that deals damage over time"},
            "ultimate_skill": {"name": "Frostmoon", "description": "Freezes all marked enemies and deals massive damage"},
            "release_date": "2019-06-11",
            "price": {"bp": 32000, "diamond": 599},
            "image_url": "https://example.com/esmeralda.jpg",
            "avatar_url": "https://example.com/esmeralda_avatar.jpg",
            "win_rate": 47.8,
            "pick_rate": 9.7,
            "ban_rate": 12.3
        }
    ]
    
    db = SessionLocal()
    try:
        for hero_data in heroes_data:
            existing = db.query(Hero).filter(Hero.name == hero_data["name"]).first()
            if not existing:
                hero = Hero(**hero_data)
                db.add(hero)
                print(f"✅ Герой {hero_data['name']} добавлен")
            else:
                print(f"⚠️ Герой {hero_data['name']} уже существует")
        db.commit()
    except Exception as e:
        print(f"❌ Ошибка при добавлении героев: {e}")
        db.rollback()
    finally:
        db.close()

def add_more_items():
    """Добавить больше предметов"""
    items_data = [
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
        },
        {
            "name": "Demon Shoes",
            "description": "Increases movement speed and mana regeneration",
            "price": 710,
            "category": "Movement",
            "stats": {"movement_speed": 0.05, "mana_regen": 15},
            "passive_effect": {"name": "Mana Spring", "description": "Restores mana over time"},
            "active_effect": None,
            "image_url": "https://example.com/demon_shoes.jpg"
        },
        {
            "name": "Wind of Nature",
            "description": "Increases attack speed and physical lifesteal",
            "price": 1910,
            "category": "Attack",
            "stats": {"attack_speed": 0.25, "physical_lifesteal": 0.1},
            "passive_effect": {"name": "Wind Walk", "description": "Gains movement speed when attacking"},
            "active_effect": None,
            "image_url": "https://example.com/wind_of_nature.jpg"
        }
    ]
    
    db = SessionLocal()
    try:
        for item_data in items_data:
            existing = db.query(Item).filter(Item.name == item_data["name"]).first()
            if not existing:
                item = Item(**item_data)
                db.add(item)
                print(f"✅ Предмет {item_data['name']} добавлен")
            else:
                print(f"⚠️ Предмет {item_data['name']} уже существует")
        db.commit()
    except Exception as e:
        print(f"❌ Ошибка при добавлении предметов: {e}")
        db.rollback()
    finally:
        db.close()

def add_more_emblems():
    """Добавить больше эмблем"""
    emblems_data = [
        {
            "name": "Tank Emblem",
            "type": "Defense",
            "level": 60,
            "stats": {"hp": 300, "physical_defense": 15, "magic_defense": 15},
            "talents": {
                "tier1": ["Toughness", "Vitality"],
                "tier2": ["Inspire", "Courage"],
                "tier3": ["Concussive Blast", "Vengeance"]
            },
            "image_url": "https://example.com/tank_emblem.jpg"
        },
        {
            "name": "Marksman Emblem",
            "type": "Physical",
            "level": 60,
            "stats": {"physical_attack": 15, "attack_speed": 0.05, "critical_chance": 0.05},
            "talents": {
                "tier1": ["Fatal", "Bounty Hunter"],
                "tier2": ["Weapon Master", "High and Dry"],
                "tier3": ["Weakness Finder", "Killing Spree"]
            },
            "image_url": "https://example.com/marksman_emblem.jpg"
        },
        {
            "name": "Support Emblem",
            "type": "Utility",
            "level": 60,
            "stats": {"hp": 200, "movement_speed": 0.05, "cooldown_reduction": 0.05},
            "talents": {
                "tier1": ["Agility", "Inspire"],
                "tier2": ["Focus", "Pull Yourself Together"],
                "tier3": ["Avarice", "Impure Rage"]
            },
            "image_url": "https://example.com/support_emblem.jpg"
        }
    ]
    
    db = SessionLocal()
    try:
        for emblem_data in emblems_data:
            existing = db.query(Emblem).filter(Emblem.name == emblem_data["name"]).first()
            if not existing:
                emblem = Emblem(**emblem_data)
                db.add(emblem)
                print(f"✅ Эмблема {emblem_data['name']} добавлена")
            else:
                print(f"⚠️ Эмблема {emblem_data['name']} уже существует")
        db.commit()
    except Exception as e:
        print(f"❌ Ошибка при добавлении эмблем: {e}")
        db.rollback()
    finally:
        db.close()

def add_more_news():
    """Добавить больше новостей"""
    news_data = [
        {
            "title": "Новый герой Valentina - Мастер иллюзий",
            "content": "Valentina - новый герой-маг, который может копировать ультиматы врагов. Её способности позволяют создавать иллюзии и контролировать поле боя.",
            "summary": "Valentina - новый маг с уникальной механикой копирования ультиматов",
            "author_id": 1,
            "category": "Герои",
            "tags": ["новый герой", "маг", "Valentina"],
            "image_url": "https://example.com/valentina_news.jpg",
            "is_published": True,
            "is_featured": True
        },
        {
            "title": "Обновление 1.8.52 - Баланс героев",
            "content": "В новом обновлении были изменены характеристики многих героев. Gusion получил усиление, а Lunox была немного ослаблена для баланса.",
            "summary": "Обновление баланса героев в версии 1.8.52",
            "author_id": 1,
            "category": "Обновления",
            "tags": ["обновление", "баланс", "герои"],
            "image_url": "https://example.com/balance_update.jpg",
            "is_published": True,
            "is_featured": False
        },
        {
            "title": "Турнир MPL Season 13 - Регистрация открыта",
            "content": "Регистрация на Mobile Legends Professional League Season 13 официально открыта. Призовой фонд составляет $800,000.",
            "summary": "MPL Season 13 - регистрация команд открыта",
            "author_id": 1,
            "category": "Турниры",
            "tags": ["MPL", "турнир", "регистрация"],
            "image_url": "https://example.com/mpl_s13.jpg",
            "is_published": True,
            "is_featured": True
        }
    ]
    
    db = SessionLocal()
    try:
        for news_data_item in news_data:
            existing = db.query(News).filter(News.title == news_data_item["title"]).first()
            if not existing:
                news = News(**news_data_item)
                db.add(news)
                print(f"✅ Новость '{news_data_item['title']}' добавлена")
            else:
                print(f"⚠️ Новость '{news_data_item['title']}' уже существует")
        db.commit()
    except Exception as e:
        print(f"❌ Ошибка при добавлении новостей: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """Основная функция"""
    print("🚀 Добавление дополнительных данных в базу...")
    
    print("\n🦸 Добавление героев...")
    add_more_heroes()
    
    print("\n⚔️ Добавление предметов...")
    add_more_items()
    
    print("\n🏆 Добавление эмблем...")
    add_more_emblems()
    
    print("\n📰 Добавление новостей...")
    add_more_news()
    
    print("\n✅ Добавление данных завершено!")

if __name__ == "__main__":
    main()