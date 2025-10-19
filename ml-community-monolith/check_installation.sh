#!/bin/bash

# ML Community Platform - Installation Verification Script
# Проверка корректности установки

echo "🔍 Проверка установки ML Community Platform"
echo "==========================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

check_ok() { echo -e "${GREEN}✅ $1${NC}"; }
check_fail() { echo -e "${RED}❌ $1${NC}"; }
check_warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
check_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

ERRORS=0
WARNINGS=0

# Check if we're in the right directory
if [ ! -f "app/main.py" ]; then
    check_fail "Не найден файл app/main.py. Убедитесь, что вы находитесь в директории ml-community-monolith"
    exit 1
fi

# Check Python environment
echo "🐍 Python окружение:"
if [ -d "venv" ]; then
    check_ok "Виртуальное окружение создано"
    
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
        check_ok "Виртуальное окружение активировано"
    fi
else
    check_warn "Виртуальное окружение не найдено"
    ((WARNINGS++))
fi

# Check Python packages
if python3 -c "import fastapi" 2>/dev/null; then
    FASTAPI_VERSION=$(python3 -c "import fastapi; print(fastapi.__version__)" 2>/dev/null)
    check_ok "FastAPI: $FASTAPI_VERSION"
else
    check_fail "FastAPI не установлен"
    ((ERRORS++))
fi

if python3 -c "import sqlalchemy" 2>/dev/null; then
    check_ok "SQLAlchemy установлен"
else
    check_fail "SQLAlchemy не установлен"
    ((ERRORS++))
fi

if python3 -c "import alembic" 2>/dev/null; then
    check_ok "Alembic установлен"
else
    check_fail "Alembic не установлен"
    ((ERRORS++))
fi

# Check configuration
echo ""
echo "⚙️ Конфигурация:"
if [ -f ".env" ]; then
    check_ok "Файл .env существует"
    
    if grep -q "DATABASE_URL" .env; then
        check_ok "DATABASE_URL настроен"
    else
        check_fail "DATABASE_URL не найден в .env"
        ((ERRORS++))
    fi
    
    if grep -q "SECRET_KEY" .env; then
        check_ok "SECRET_KEY настроен"
    else
        check_fail "SECRET_KEY не найден в .env"
        ((ERRORS++))
    fi
else
    check_fail "Файл .env не найден"
    ((ERRORS++))
fi

# Check database connection
echo ""
echo "🐘 База данных:"
if python3 -c "
from app.core.database import engine
try:
    with engine.connect() as conn:
        result = conn.execute('SELECT 1')
        print('OK')
except Exception as e:
    print(f'ERROR: {e}')
    exit(1)
" 2>/dev/null | grep -q "OK"; then
    check_ok "Подключение к базе данных работает"
else
    check_fail "Не удается подключиться к базе данных"
    ((ERRORS++))
fi

# Check database tables
if python3 -c "
from app.core.database import SessionLocal
from app.models import Hero, User, Achievement
try:
    db = SessionLocal()
    heroes_count = db.query(Hero).count()
    users_count = db.query(User).count()
    achievements_count = db.query(Achievement).count()
    print(f'Heroes: {heroes_count}')
    print(f'Users: {users_count}')
    print(f'Achievements: {achievements_count}')
    db.close()
except Exception as e:
    print(f'ERROR: {e}')
    exit(1)
" 2>/dev/null > /tmp/db_check.txt; then
    
    HEROES_COUNT=$(grep "Heroes:" /tmp/db_check.txt | cut -d' ' -f2)
    USERS_COUNT=$(grep "Users:" /tmp/db_check.txt | cut -d' ' -f2)
    ACHIEVEMENTS_COUNT=$(grep "Achievements:" /tmp/db_check.txt | cut -d' ' -f2)
    
    if [ "$HEROES_COUNT" -gt 0 ]; then
        check_ok "Герои в базе данных: $HEROES_COUNT"
    else
        check_warn "Нет героев в базе данных (запустите: python import_heroes.py import)"
        ((WARNINGS++))
    fi
    
    if [ "$USERS_COUNT" -gt 0 ]; then
        check_ok "Пользователи в базе данных: $USERS_COUNT"
    else
        check_warn "Нет пользователей в базе данных (запустите: python create_admin.py)"
        ((WARNINGS++))
    fi
    
    if [ "$ACHIEVEMENTS_COUNT" -gt 0 ]; then
        check_ok "Достижения в базе данных: $ACHIEVEMENTS_COUNT"
    else
        check_warn "Нет достижений в базе данных (запустите: python create_achievements.py)"
        ((WARNINGS++))
    fi
    
    rm -f /tmp/db_check.txt
else
    check_fail "Ошибка при проверке таблиц базы данных"
    ((ERRORS++))
fi

# Check Alembic migrations
echo ""
echo "🔄 Миграции:"
if alembic current 2>/dev/null | grep -q "head"; then
    check_ok "Миграции базы данных актуальны"
elif alembic current 2>/dev/null | grep -q "[a-f0-9]"; then
    CURRENT_REVISION=$(alembic current 2>/dev/null | cut -d' ' -f1)
    check_warn "Текущая ревизия БД: $CURRENT_REVISION (возможно не последняя)"
    ((WARNINGS++))
else
    check_fail "Проблемы с миграциями базы данных"
    ((ERRORS++))
fi

# Check application startup
echo ""
echo "🚀 Приложение:"
if pgrep -f "uvicorn.*app.main:app" >/dev/null; then
    PID=$(pgrep -f "uvicorn.*app.main:app")
    check_ok "Приложение запущено (PID: $PID)"
    
    # Check if port 8000 is listening
    if netstat -tlnp 2>/dev/null | grep -q ":8000.*$PID"; then
        check_ok "Приложение слушает порт 8000"
    else
        check_warn "Приложение запущено, но порт 8000 не прослушивается"
        ((WARNINGS++))
    fi
else
    check_warn "Приложение не запущено"
    ((WARNINGS++))
fi

# Check HTTP endpoints
echo ""
echo "🌐 HTTP эндпоинты:"
if curl -s --connect-timeout 5 http://localhost:8000/health >/dev/null; then
    check_ok "Health endpoint доступен"
    
    # Check main page
    if curl -s --connect-timeout 5 http://localhost:8000/ | grep -q "ML Community"; then
        check_ok "Главная страница загружается"
    else
        check_warn "Главная страница недоступна или некорректна"
        ((WARNINGS++))
    fi
    
    # Check API docs
    if curl -s --connect-timeout 5 http://localhost:8000/api/docs | grep -q "swagger"; then
        check_ok "API документация доступна"
    else
        check_warn "API документация недоступна"
        ((WARNINGS++))
    fi
    
else
    check_fail "HTTP endpoints недоступны (приложение не отвечает на порту 8000)"
    ((ERRORS++))
fi

# Check static files
echo ""
echo "📁 Файлы:"
if [ -d "app/static" ]; then
    check_ok "Директория static существует"
else
    check_warn "Директория app/static не найдена"
    ((WARNINGS++))
fi

if [ -d "app/templates" ]; then
    TEMPLATES_COUNT=$(find app/templates -name "*.html" | wc -l)
    check_ok "HTML шаблоны найдены: $TEMPLATES_COUNT файлов"
else
    check_fail "Директория app/templates не найдена"
    ((ERRORS++))
fi

if [ -d "data" ]; then
    JSON_FILES=$(find data -name "*.json" | wc -l)
    check_ok "JSON файлы с данными: $JSON_FILES файлов"
else
    check_warn "Директория data не найдена"
    ((WARNINGS++))
fi

# Check logs
echo ""
echo "📝 Логи:"
if [ -f "app.log" ]; then
    LOG_SIZE=$(du -h app.log | cut -f1)
    check_ok "Лог файл существует (размер: $LOG_SIZE)"
    
    # Check for errors in logs
    ERROR_COUNT=$(grep -c "ERROR" app.log 2>/dev/null || echo "0")
    if [ "$ERROR_COUNT" -eq 0 ]; then
        check_ok "Нет ошибок в логах"
    else
        check_warn "Найдено $ERROR_COUNT ошибок в логах"
        ((WARNINGS++))
    fi
else
    check_info "Лог файл не найден (приложение может не запускаться)"
fi

# Summary
echo ""
echo "📊 Итоги проверки:"
echo "=================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    check_ok "Установка прошла успешно! ML Community Platform готова к использованию."
    echo ""
    echo "🌐 Доступные URL:"
    echo "   Основной сайт: http://localhost:8000"
    echo "   API документация: http://localhost:8000/api/docs"
    echo "   Health check: http://localhost:8000/health"
    echo ""
    echo "👤 Учетные данные администратора:"
    echo "   Логин: admin"
    echo "   Пароль: admin123"
    echo "   Email: admin@militaryfocus.ru"
    
elif [ $ERRORS -eq 0 ]; then
    check_warn "Установка завершена с предупреждениями ($WARNINGS)"
    echo ""
    echo "⚠️  Предупреждения не критичны, платформа должна работать"
    echo "   Рекомендуется устранить предупреждения для оптимальной работы"
    echo ""
    echo "🌐 Платформа доступна по адресу: http://localhost:8000"
    
else
    check_fail "Обнаружены проблемы с установкой ($ERRORS ошибок, $WARNINGS предупреждений)"
    echo ""
    echo "❌ Рекомендуемые действия:"
    
    if [ $ERRORS -gt 0 ]; then
        echo "   1. Проверьте логи: tail -f app.log"
        echo "   2. Переустановите зависимости: pip install -r requirements.txt"
        echo "   3. Проверьте базу данных: alembic upgrade head"
        echo "   4. Перезапустите приложение: uvicorn app.main:app --host 0.0.0.0 --port 8000"
    fi
    
    echo ""
    echo "Для получения помощи создайте issue:"
    echo "https://github.com/Militaryfocus/militaryfocus_frontend/issues"
fi

echo ""
check_info "Для обновления платформы используйте: ./update_platform.sh"
check_info "Для отката к предыдущей версии: ./rollback.sh"