#!/bin/bash

# ML Community Platform - Update Script
# Автоматическое обновление до последней версии

set -e

echo "🔄 ML Community Platform - Обновление"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "app/main.py" ]; then
    print_error "Не найден файл app/main.py. Убедитесь, что вы находитесь в директории ml-community-monolith"
    exit 1
fi

# Step 1: Check current version
print_step "1. Проверка текущей версии..."
CURRENT_VERSION=$(git describe --tags 2>/dev/null || echo "unknown")
print_status "Текущая версия: $CURRENT_VERSION"

# Step 2: Backup database
print_step "2. Создание резервной копии базы данных..."
BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
if command -v pg_dump >/dev/null 2>&1; then
    pg_dump ml_community > "$BACKUP_FILE" 2>/dev/null || print_warning "Не удалось создать бэкап БД"
    if [ -f "$BACKUP_FILE" ]; then
        print_status "Бэкап создан: $BACKUP_FILE"
    fi
else
    print_warning "pg_dump не найден, пропускаем создание бэкапа"
fi

# Step 3: Stop application
print_step "3. Остановка приложения..."
pkill -f uvicorn || print_warning "Приложение не было запущено"

# Step 4: Fetch latest changes
print_step "4. Получение последних изменений..."
git fetch origin --tags
git fetch origin

# Step 5: Check for latest version
print_step "5. Проверка доступных обновлений..."
LATEST_VERSION=$(git tag --sort=-version:refname | head -1)
print_status "Последняя версия: $LATEST_VERSION"

if [ "$CURRENT_VERSION" = "$LATEST_VERSION" ]; then
    print_status "У вас уже установлена последняя версия!"
    exit 0
fi

# Step 6: Stash local changes
print_step "6. Сохранение локальных изменений..."
git stash push -m "Auto-stash before update $(date)"

# Step 7: Update to latest version
print_step "7. Обновление до версии $LATEST_VERSION..."
git checkout master
git reset --hard origin/master
git checkout "$LATEST_VERSION"

# Step 8: Update dependencies
print_step "8. Обновление зависимостей..."
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
else
    print_warning "Виртуальное окружение не найдено, устанавливаем зависимости глобально"
    pip install -r requirements.txt
fi

# Step 9: Run database migrations
print_step "9. Выполнение миграций базы данных..."
alembic upgrade head

# Step 10: Update heroes data (if needed)
print_step "10. Обновление данных героев..."
python import_heroes.py import

# Step 11: Update achievements (if needed)
print_step "11. Обновление достижений..."
python create_achievements.py

# Step 12: Restart application
print_step "12. Запуск обновленного приложения..."
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 > app.log 2>&1 &
sleep 5

# Step 13: Verify update
print_step "13. Проверка обновления..."
if curl -s http://localhost:8000/health > /dev/null; then
    print_status "✅ Обновление успешно завершено!"
    print_status "Версия: $(git describe --tags)"
    echo ""
    echo "🌐 Приложение доступно по адресу: http://localhost:8000"
    echo "📊 API документация: http://localhost:8000/api/docs"
    echo "📝 Логи: tail -f app.log"
else
    print_error "❌ Приложение не запустилось. Проверьте логи: tail -f app.log"
    
    # Restore from backup if available
    if [ -f "$BACKUP_FILE" ]; then
        print_warning "Попытка восстановления из бэкапа..."
        psql ml_community < "$BACKUP_FILE"
    fi
    exit 1
fi

# Cleanup old backups (keep last 5)
print_step "14. Очистка старых бэкапов..."
ls -t backup_*.sql 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null || true

echo ""
print_status "🎉 Обновление завершено успешно!"
echo "Изменения в версии $LATEST_VERSION:"
git tag -l --format='%(contents)' "$LATEST_VERSION" | head -10