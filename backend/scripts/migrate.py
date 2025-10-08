#!/usr/bin/env python3
"""
Скрипт для создания миграций Alembic
"""

import os
import sys
from alembic.config import Config
from alembic import command

def create_migration(message: str):
    """Создать новую миграцию"""
    # Путь к alembic.ini
    alembic_cfg = Config("alembic.ini")
    
    # Создать миграцию
    command.revision(alembic_cfg, message=message, autogenerate=True)
    print(f"✅ Миграция '{message}' создана успешно!")

def upgrade_database():
    """Применить миграции"""
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    print("✅ Миграции применены успешно!")

def downgrade_database(revision: str = "-1"):
    """Откатить миграции"""
    alembic_cfg = Config("alembic.ini")
    command.downgrade(alembic_cfg, revision)
    print(f"✅ Миграции откачены до {revision}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Использование:")
        print("  python migrate.py create 'описание миграции'")
        print("  python migrate.py upgrade")
        print("  python migrate.py downgrade [revision]")
        sys.exit(1)
    
    action = sys.argv[1]
    
    if action == "create":
        if len(sys.argv) < 3:
            print("❌ Укажите описание миграции")
            sys.exit(1)
        message = sys.argv[2]
        create_migration(message)
    elif action == "upgrade":
        upgrade_database()
    elif action == "downgrade":
        revision = sys.argv[2] if len(sys.argv) > 2 else "-1"
        downgrade_database(revision)
    else:
        print(f"❌ Неизвестное действие: {action}")
        sys.exit(1)