#!/bin/bash

# ML Community Platform - Rollback Script
# Откат к предыдущей версии

echo "⏪ ML Community Platform - Откат к предыдущей версии"
echo "==================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Get current version
CURRENT=$(git describe --tags 2>/dev/null || echo "unknown")
print_status "Текущая версия: $CURRENT"

# Get previous version
PREVIOUS=$(git tag --sort=-version:refname | sed -n '2p')
if [ -z "$PREVIOUS" ]; then
    print_error "Предыдущая версия не найдена"
    exit 1
fi

print_warning "Откат к версии: $PREVIOUS"
read -p "Продолжить? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Откат отменен"
    exit 0
fi

# Stop application
print_status "Остановка приложения..."
pkill -f uvicorn

# Create backup
BACKUP_FILE="rollback_backup_$(date +%Y%m%d_%H%M%S).sql"
pg_dump ml_community > "$BACKUP_FILE" 2>/dev/null || print_warning "Не удалось создать бэкап"

# Rollback to previous version
print_status "Откат к версии $PREVIOUS..."
git checkout "$PREVIOUS"

# Restore dependencies
print_status "Восстановление зависимостей..."
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi
pip install -r requirements.txt

# Note about database
print_warning "ВНИМАНИЕ: Возможно потребуется откат миграций базы данных"
print_warning "Если возникнут проблемы, восстановите БД из бэкапа: $BACKUP_FILE"

# Restart application
print_status "Запуск приложения..."
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 > app.log 2>&1 &
sleep 5

# Verify
if curl -s http://localhost:8000/health > /dev/null; then
    print_status "✅ Откат выполнен успешно!"
    print_status "Текущая версия: $(git describe --tags)"
else
    print_error "❌ Приложение не запустилось после отката"
    print_error "Восстановите БД из бэкапа: psql ml_community < $BACKUP_FILE"
fi