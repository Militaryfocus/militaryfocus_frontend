#!/bin/bash
# install.sh - Mobile Legends Community Platform

set -e

echo "🎮 Установка Mobile Legends Community Platform..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка зависимостей
check_dependencies() {
    print_status "Проверка зависимостей..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker не установлен. Пожалуйста, установите Docker и попробуйте снова."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose не установлен. Пожалуйста, установите Docker Compose и попробуйте снова."
        exit 1
    fi
    
    print_success "Все зависимости установлены"
}

# Создание необходимых директорий
create_directories() {
    print_status "Создание директорий..."
    
    mkdir -p data/{postgres,redis,uploads,hero_images}
    mkdir -p logs
    mkdir -p backups
    mkdir -p media
    
    print_success "Директории созданы"
}

# Настройка environment файла
setup_environment() {
    print_status "Настройка конфигурации..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        print_warning "Создан файл .env из шаблона"
        print_warning "Пожалуйста, настройте .env файл и запустите скрипт снова"
        exit 1
    fi
    
    print_success "Конфигурация настроена"
}

# Запуск Docker сервисов
start_services() {
    print_status "Запуск Docker сервисов..."
    
    docker-compose up -d
    
    print_status "Ожидание запуска сервисов..."
    sleep 30
    
    # Проверка статуса сервисов
    if ! docker-compose ps | grep -q "Up"; then
        print_error "Не все сервисы запустились успешно"
        docker-compose logs
        exit 1
    fi
    
    print_success "Все сервисы запущены"
}

# Применение миграций БД
run_migrations() {
    print_status "Применение миграций базы данных..."
    
    # Ждем пока база данных будет готова
    print_status "Ожидание готовности базы данных..."
    sleep 15
    
    # Создание миграций Alembic
    docker-compose exec backend alembic revision --autogenerate -m "Initial migration"
    
    # Применение миграций
    docker-compose exec backend alembic upgrade head
    
    print_success "Миграции применены"
}

# Загрузка начальных данных
load_initial_data() {
    print_status "Загрузка начальных данных..."
    
    # Проверяем наличие файлов с данными
    if [ -f "backend/data/heroes.json" ]; then
        print_status "Загрузка данных героев..."
        docker-compose exec backend python scripts/import_heroes.py
    else
        print_warning "Файл heroes.json не найден, пропускаем загрузку героев"
    fi
    
    if [ -f "backend/data/items.json" ]; then
        print_status "Загрузка данных предметов..."
        docker-compose exec backend python scripts/import_items.py
    else
        print_warning "Файл items.json не найден, пропускаем загрузку предметов"
    fi
    
    if [ -f "backend/data/emblems.json" ]; then
        print_status "Загрузка данных эмблем..."
        docker-compose exec backend python scripts/import_emblems.py
    else
        print_warning "Файл emblems.json не найден, пропускаем загрузку эмблем"
    fi
    
    print_success "Начальные данные загружены"
}

# Создание администратора
create_admin() {
    print_status "Создание администратора..."
    
    docker-compose exec backend python scripts/create_admin.py
    
    print_success "Администратор создан"
}

# Проверка установки
verify_installation() {
    print_status "Проверка установки..."
    
    # Проверка API
    if curl -f http://localhost:8000/api/health > /dev/null 2>&1; then
        print_success "API работает корректно"
    else
        print_error "API недоступен"
        return 1
    fi
    
    # Проверка фронтенда
    if curl -f http://localhost > /dev/null 2>&1; then
        print_success "Фронтенд работает корректно"
    else
        print_error "Фронтенд недоступен"
        return 1
    fi
    
    print_success "Установка завершена успешно!"
}

# Основная функция
main() {
    echo "=========================================="
    echo "  Mobile Legends Community Platform"
    echo "  Автоматическая установка"
    echo "=========================================="
    echo
    
    check_dependencies
    create_directories
    setup_environment
    start_services
    run_migrations
    load_initial_data
    create_admin
    verify_installation
    
    echo
    echo "=========================================="
    echo "  Установка завершена!"
    echo "=========================================="
    echo
    echo "🌐 Фронтенд: http://localhost"
    echo "🔧 API: http://localhost:8000"
    echo "📊 Документация API: http://localhost:8000/docs"
    echo "📈 Redoc: http://localhost:8000/redoc"
    echo
    echo "Для остановки сервисов выполните:"
    echo "  docker-compose down"
    echo
    echo "Для просмотра логов выполните:"
    echo "  docker-compose logs -f"
    echo
}

# Запуск основной функции
main "$@"