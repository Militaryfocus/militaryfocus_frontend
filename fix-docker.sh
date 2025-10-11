#!/bin/bash

echo "🔧 Исправление Docker проблемы..."

# Остановить все контейнеры
echo "⏹️ Останавливаем контейнеры..."
docker-compose down 2>/dev/null || docker compose down 2>/dev/null || echo "Контейнеры не запущены"

# Удалить старые образы
echo "🗑️ Удаляем старые образы..."
docker-compose build --no-cache 2>/dev/null || docker compose build --no-cache 2>/dev/null || echo "Docker не установлен"

# Создать необходимые директории
echo "📁 Создаем директории..."
mkdir -p data/uploads data/hero_images

# Запустить сервисы
echo "🚀 Запускаем сервисы..."
docker-compose up -d 2>/dev/null || docker compose up -d 2>/dev/null || {
    echo "❌ Docker не установлен. Используйте веб-установщик:"
    echo "cd installer && python3 run_installer.py"
    exit 1
}

# Проверить статус
echo "🔍 Проверяем статус..."
docker-compose ps 2>/dev/null || docker compose ps 2>/dev/null

echo ""
echo "✅ Исправление завершено!"
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost:8001"
echo "📊 API Docs: http://localhost:8001/docs"
echo ""
echo "Для просмотра логов: docker-compose logs -f"