#!/usr/bin/env python3
"""
Script to import Mobile Legends heroes data into the database
"""

import sys
import os
import json
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import Hero

def load_heroes_data():
    """Load heroes data from JSON files."""
    heroes = []
    
    # Load main heroes data
    try:
        with open('data/heroes_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            heroes.extend(data['heroes'])
    except FileNotFoundError:
        print("Warning: heroes_data.json not found")
    
    # Load extended heroes data
    try:
        with open('data/heroes_extended.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            heroes.extend(data['heroes'])
    except FileNotFoundError:
        print("Warning: heroes_extended.json not found")
    
    # Load complete heroes data
    try:
        with open('data/heroes_complete.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            heroes.extend(data['heroes'])
    except FileNotFoundError:
        print("Warning: heroes_complete.json not found")
    
    return heroes

def create_hero_image_url(hero_name):
    """Generate image URL for hero."""
    # Convert hero name to URL-friendly format
    name_clean = hero_name.lower().replace(' ', '_').replace('ъ', '').replace('ь', '')
    return f"https://images.mobilelegends.com/heroes/{name_clean}_icon.jpg"

def import_heroes():
    """Import heroes into the database."""
    db = SessionLocal()
    
    try:
        # Check if heroes already exist
        existing_count = db.query(Hero).count()
        if existing_count > 0:
            print(f"Heroes already exist ({existing_count} found).")
            response = input("Do you want to clear existing heroes and reimport? (y/N): ")
            if response.lower() != 'y':
                print("Import cancelled.")
                return
            
            # Clear existing heroes
            db.query(Hero).delete()
            db.commit()
            print("Existing heroes cleared.")
        
        # Load heroes data
        heroes_data = load_heroes_data()
        
        if not heroes_data:
            print("No heroes data found. Please check the JSON files.")
            return
        
        print(f"Found {len(heroes_data)} heroes to import...")
        
        imported_count = 0
        
        for hero_data in heroes_data:
            try:
                # Create hero object
                hero = Hero(
                    name=hero_data['name'],
                    title=hero_data['title'],
                    role=hero_data['role'],
                    specialty=hero_data['specialty'],
                    difficulty=hero_data['difficulty'],
                    description=hero_data['description'],
                    lore=hero_data['lore'],
                    hp=hero_data['hp'],
                    mana=hero_data['mana'],
                    physical_attack=hero_data['physical_attack'],
                    magic_power=hero_data['magic_power'],
                    armor=hero_data['armor'],
                    magic_resistance=hero_data['magic_resistance'],
                    attack_speed=hero_data['attack_speed'],
                    movement_speed=hero_data['movement_speed'],
                    win_rate=hero_data['win_rate'],
                    pick_rate=hero_data['pick_rate'],
                    ban_rate=hero_data['ban_rate'],
                    icon_url=create_hero_image_url(hero_data['name']),
                    image_url=f"https://images.mobilelegends.com/heroes/{hero_data['name'].lower().replace(' ', '_')}_full.jpg"
                )
                
                db.add(hero)
                imported_count += 1
                print(f"✓ Imported: {hero_data['name']} ({hero_data['role']})")
                
            except Exception as e:
                print(f"✗ Error importing {hero_data['name']}: {e}")
                continue
        
        # Commit all changes
        db.commit()
        print(f"\n🎉 Successfully imported {imported_count} heroes!")
        
        # Print statistics by role
        print("\nHeroes by role:")
        roles = db.query(Hero.role).distinct().all()
        for role_tuple in roles:
            role = role_tuple[0]
            count = db.query(Hero).filter(Hero.role == role).count()
            print(f"  {role}: {count} heroes")
            
    except Exception as e:
        print(f"Error during import: {e}")
        db.rollback()
    finally:
        db.close()

def list_heroes():
    """List all heroes in the database."""
    db = SessionLocal()
    
    try:
        heroes = db.query(Hero).order_by(Hero.role, Hero.name).all()
        
        if not heroes:
            print("No heroes found in database.")
            return
        
        print(f"\nTotal heroes in database: {len(heroes)}")
        print("=" * 60)
        
        current_role = None
        for hero in heroes:
            if hero.role != current_role:
                current_role = hero.role
                print(f"\n{current_role.upper()}:")
                print("-" * 30)
            
            print(f"  {hero.name} - {hero.title}")
            print(f"    Difficulty: {hero.difficulty} | WR: {hero.win_rate}% | PR: {hero.pick_rate}%")
            
    except Exception as e:
        print(f"Error listing heroes: {e}")
    finally:
        db.close()

def add_more_heroes():
    """Add additional popular heroes."""
    additional_heroes = [
        {
            "name": "Гуинвер",
            "title": "Мистический стрелок",
            "role": "Mage",
            "specialty": "Burst",
            "difficulty": "Medium",
            "description": "Гуинвер - эльфийская принцесса-маг, владеющая энергетической магией. Её заклинания могут поражать несколько целей и усиливаться от попаданий.",
            "lore": "Гуинвер - наследница древнего эльфийского королевства магов. Она изучает боевую магию, чтобы защитить свой народ от надвигающейся угрозы.",
            "hp": 2345,
            "mana": 485,
            "physical_attack": 0,
            "magic_power": 139,
            "armor": 13,
            "magic_resistance": 25,
            "attack_speed": 0.76,
            "movement_speed": 240,
            "win_rate": 50.8,
            "pick_rate": 8.2,
            "ban_rate": 9.7
        },
        {
            "name": "Хильда",
            "title": "Дикая сила",
            "role": "Fighter",
            "specialty": "Charge",
            "difficulty": "Easy",
            "description": "Хильда - воительница из северных земель, владеющая топором и щитом. Её ярость в бою делает её практически неостановимой.",
            "lore": "Хильда выросла среди суровых северных племён, где сила решает всё. Она стала величайшей воительницей своего поколения.",
            "hp": 2598,
            "mana": 0,
            "physical_attack": 133,
            "magic_power": 0,
            "armor": 19,
            "magic_resistance": 15,
            "attack_speed": 0.84,
            "movement_speed": 260,
            "win_rate": 52.7,
            "pick_rate": 6.8,
            "ban_rate": 3.9
        },
        {
            "name": "Валир",
            "title": "Сын пламени",
            "role": "Mage",
            "specialty": "Burst",
            "difficulty": "Easy",
            "description": "Валир - молодой маг огня с невероятным талантом. Его пламенные заклинания могут сжечь целые армии врагов.",
            "lore": "Валир родился с редким даром управления огнём. Он изучает древние огненные заклинания, чтобы стать величайшим магом огня.",
            "hp": 2401,
            "mana": 475,
            "physical_attack": 0,
            "magic_power": 137,
            "armor": 14,
            "magic_resistance": 25,
            "attack_speed": 0.73,
            "movement_speed": 240,
            "win_rate": 51.4,
            "pick_rate": 7.6,
            "ban_rate": 6.8
        },
        {
            "name": "Лапу-Лапу",
            "title": "Великий вождь",
            "role": "Fighter",
            "specialty": "Charge",
            "difficulty": "Hard",
            "description": "Лапу-Лапу - легендарный воин-вождь, способный трансформировать своё оружие. Его боевые навыки и лидерские качества вдохновляют союзников.",
            "lore": "Лапу-Лапу - вождь племени воинов, который объединил разрозненные кланы против общего врага. Его имя стало символом сопротивления.",
            "hp": 2567,
            "mana": 0,
            "physical_attack": 135,
            "magic_power": 0,
            "armor": 18,
            "magic_resistance": 15,
            "attack_speed": 0.87,
            "movement_speed": 260,
            "win_rate": 49.9,
            "pick_rate": 5.3,
            "ban_rate": 4.2
        },
        {
            "name": "Рафаэла",
            "title": "Биоангел",
            "role": "Support",
            "specialty": "Regen",
            "difficulty": "Easy",
            "description": "Рафаэла - ангел-целитель, спустившийся с небес для помощи смертным. Её божественная сила может исцелять и защищать союзников.",
            "lore": "Рафаэла - архангел исцеления, которая покинула небесные сферы, чтобы помочь в великой битве между добром и злом.",
            "hp": 2234,
            "mana": 520,
            "physical_attack": 0,
            "magic_power": 126,
            "armor": 11,
            "magic_resistance": 20,
            "attack_speed": 0.67,
            "movement_speed": 250,
            "win_rate": 55.1,
            "pick_rate": 4.7,
            "ban_rate": 2.1
        }
    ]
    
    db = SessionLocal()
    
    try:
        added_count = 0
        
        for hero_data in additional_heroes:
            # Check if hero already exists
            existing = db.query(Hero).filter(Hero.name == hero_data['name']).first()
            if existing:
                print(f"Hero {hero_data['name']} already exists, skipping...")
                continue
            
            try:
                hero = Hero(
                    name=hero_data['name'],
                    title=hero_data['title'],
                    role=hero_data['role'],
                    specialty=hero_data['specialty'],
                    difficulty=hero_data['difficulty'],
                    description=hero_data['description'],
                    lore=hero_data['lore'],
                    hp=hero_data['hp'],
                    mana=hero_data['mana'],
                    physical_attack=hero_data['physical_attack'],
                    magic_power=hero_data['magic_power'],
                    armor=hero_data['armor'],
                    magic_resistance=hero_data['magic_resistance'],
                    attack_speed=hero_data['attack_speed'],
                    movement_speed=hero_data['movement_speed'],
                    win_rate=hero_data['win_rate'],
                    pick_rate=hero_data['pick_rate'],
                    ban_rate=hero_data['ban_rate'],
                    icon_url=create_hero_image_url(hero_data['name']),
                    image_url=f"https://images.mobilelegends.com/heroes/{hero_data['name'].lower().replace(' ', '_')}_full.jpg"
                )
                
                db.add(hero)
                added_count += 1
                print(f"✓ Added: {hero_data['name']} ({hero_data['role']})")
                
            except Exception as e:
                print(f"✗ Error adding {hero_data['name']}: {e}")
                continue
        
        db.commit()
        print(f"\n🎉 Successfully added {added_count} additional heroes!")
        
    except Exception as e:
        print(f"Error adding heroes: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🦸 Mobile Legends Heroes Import Tool")
    print("=" * 40)
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "import":
            import_heroes()
        elif command == "list":
            list_heroes()
        elif command == "add":
            add_more_heroes()
        else:
            print(f"Unknown command: {command}")
            print("Available commands: import, list, add")
    else:
        print("Available commands:")
        print("  python import_heroes.py import  - Import all heroes from JSON files")
        print("  python import_heroes.py list    - List all heroes in database")
        print("  python import_heroes.py add     - Add additional popular heroes")
        print()
        
        command = input("Enter command (import/list/add): ").strip().lower()
        
        if command == "import":
            import_heroes()
        elif command == "list":
            list_heroes()
        elif command == "add":
            add_more_heroes()
        else:
            print("Invalid command. Please use 'import', 'list', or 'add'.")