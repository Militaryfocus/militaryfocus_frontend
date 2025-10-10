#!/bin/bash

# Скрипт для автоматического развертывания Military Focus Frontend
# Использование: ./deploy.sh [environment]

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для логирования
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Проверка аргументов
ENVIRONMENT=${1:-production}
PROJECT_NAME="military-focus-frontend"

log "Начинаем развертывание Military Focus Frontend в режиме: $ENVIRONMENT"

# Проверка зависимостей
command -v docker >/dev/null 2>&1 || error "Docker не установлен"
command -v docker-compose >/dev/null 2>&1 || error "Docker Compose не установлен"

# Создание директории для SSL сертификатов (если не существует)
mkdir -p ssl

# Проверка SSL сертификатов
if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
    warning "SSL сертификаты не найдены. Создаем самоподписанные сертификаты для разработки..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/key.pem \
        -out ssl/cert.pem \
        -subj "/C=RU/ST=Moscow/L=Moscow/O=MilitaryFocus/CN=localhost"
    success "Самоподписанные SSL сертификаты созданы"
fi

# Остановка существующих контейнеров
log "Остановка существующих контейнеров..."
docker-compose down --remove-orphans || true

# Очистка старых образов (опционально)
if [ "$2" = "--clean" ]; then
    log "Очистка старых Docker образов..."
    docker system prune -f
fi

# Сборка и запуск контейнеров
log "Сборка Docker образов..."
docker-compose build --no-cache

log "Запуск контейнеров..."
docker-compose up -d

# Ожидание готовности приложения
log "Ожидание готовности приложения..."
sleep 10

# Проверка здоровья приложения
log "Проверка здоровья приложения..."
for i in {1..30}; do
    if curl -f http://localhost:3000/health >/dev/null 2>&1; then
        success "Приложение успешно запущено и отвечает на запросы"
        break
    fi
    
    if [ $i -eq 30 ]; then
        error "Приложение не отвечает после 30 попыток"
    fi
    
    log "Попытка $i/30: ожидание готовности приложения..."
    sleep 2
done

# Показ статуса контейнеров
log "Статус контейнеров:"
docker-compose ps

# Показ логов
log "Последние логи приложения:"
docker-compose logs --tail=20 military-focus-app

success "Развертывание завершено успешно!"
log "Приложение доступно по адресам:"
log "  HTTP:  http://localhost (редирект на HTTPS)"
log "  HTTPS: https://localhost"
log "  Прямой доступ к Next.js: http://localhost:3000"

log "Для просмотра логов используйте: docker-compose logs -f"
log "Для остановки используйте: docker-compose down"