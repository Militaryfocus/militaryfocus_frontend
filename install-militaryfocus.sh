#!/bin/bash

echo "🚀 УСТАНОВКА ML Community Platform для militaryfocus.ru"
echo "====================================================="

# Перейти в директорию проекта
cd /var/www/www-root/data/www/militaryfocus.ru/

# Проверить наличие файлов
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Ошибка: Не найдены директории backend/ или frontend/"
    echo "Убедитесь, что вы находитесь в правильной директории:"
    echo "/var/www/www-root/data/www/militaryfocus.ru/"
    exit 1
fi

echo "✅ Найдены необходимые директории"

# Установить системные зависимости
echo "📦 Устанавливаем системные зависимости..."
sudo apt-get update
sudo apt-get install -y \
    python3 python3-pip python3-venv \
    nodejs npm \
    postgresql postgresql-contrib \
    redis-server nginx \
    build-essential libpq-dev

# Настроить PostgreSQL
echo "🗄️ Настраиваем PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Проверить, существует ли база данных
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw ml_community; then
    sudo -u postgres psql -c "CREATE DATABASE ml_community;"
    echo "✅ База данных ml_community создана"
else
    echo "✅ База данных ml_community уже существует"
fi

# Проверить, существует ли пользователь
if ! sudo -u postgres psql -t -c '\du' | cut -d \| -f 1 | grep -qw ml_user; then
    sudo -u postgres psql -c "CREATE USER ml_user WITH PASSWORD 'ml_password';"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ml_community TO ml_user;"
    sudo -u postgres psql -c "ALTER USER ml_user CREATEDB;"
    echo "✅ Пользователь ml_user создан"
else
    echo "✅ Пользователь ml_user уже существует"
fi

# Настроить Redis
echo "🔴 Настраиваем Redis..."
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Проверить работу Redis
if redis-cli ping | grep -q "PONG"; then
    echo "✅ Redis работает"
else
    echo "❌ Ошибка: Redis не отвечает"
    exit 1
fi

# Установить Backend
echo "🐍 Устанавливаем Backend..."
cd backend

# Создать виртуальное окружение
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Виртуальное окружение создано"
else
    echo "✅ Виртуальное окружение уже существует"
fi

# Активировать виртуальное окружение
source venv/bin/activate

# Обновить pip
pip install --upgrade pip

# Установить зависимости
pip install -r requirements.txt

# Создать .env
cat > .env << 'EOF'
DATABASE_URL=postgresql://ml_user:ml_password@localhost:5432/ml_community
REDIS_URL=redis://localhost:6379
SECRET_KEY=militaryfocus-secret-key-12345678901234567890
BACKEND_CORS_ORIGINS=http://militaryfocus.ru,https://militaryfocus.ru
DEBUG=True
EOF

echo "✅ Конфигурация Backend создана"

# Запустить миграции
echo "🔄 Запускаем миграции базы данных..."
alembic upgrade head

# Создать директории
mkdir -p static/uploads static/heroes

echo "✅ Backend готов!"

# Установить Frontend
echo "⚛️ Устанавливаем Frontend..."
cd ../frontend

# Установить зависимости
npm install --legacy-peer-deps

# Создать .env
cat > .env << 'EOF'
REACT_APP_API_URL=http://militaryfocus.ru:8001/api/v1
REACT_APP_VERSION=1.1.3
EOF

echo "✅ Конфигурация Frontend создана"

# Собрать проект
echo "🔨 Собираем Frontend..."
npm run build

# Скопировать в веб-директорию
echo "📁 Копируем собранные файлы..."
sudo cp -r build/* /var/www/www-root/data/www/militaryfocus.ru/

echo "✅ Frontend готов!"

# Настроить Nginx
echo "🌐 Настраиваем Nginx..."
sudo tee /etc/nginx/sites-available/militaryfocus.ru > /dev/null << 'EOF'
server {
    listen 80;
    server_name militaryfocus.ru www.militaryfocus.ru;
    
    # Frontend
    location / {
        root /var/www/www-root/data/www/militaryfocus.ru;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Статические файлы
    location /static/ {
        alias /var/www/www-root/data/www/militaryfocus.ru/backend/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Активировать сайт
sudo ln -sf /etc/nginx/sites-available/militaryfocus.ru /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Проверить конфигурацию Nginx
if sudo nginx -t; then
    sudo systemctl reload nginx
    echo "✅ Nginx настроен и перезагружен"
else
    echo "❌ Ошибка в конфигурации Nginx"
    exit 1
fi

# Создать systemd сервис для Backend
echo "🔧 Создаем systemd сервис..."
sudo tee /etc/systemd/system/ml-backend.service > /dev/null << 'EOF'
[Unit]
Description=ML Community Backend
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/www-root/data/www/militaryfocus.ru/backend
Environment=PATH=/var/www/www-root/data/www/militaryfocus.ru/backend/venv/bin
ExecStart=/var/www/www-root/data/www/militaryfocus.ru/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8001
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Запустить сервисы
sudo systemctl daemon-reload
sudo systemctl enable ml-backend
sudo systemctl start ml-backend

echo "✅ Сервисы созданы и запущены!"

# Проверка статуса
echo "🔍 Проверяем статус..."
echo "Backend статус:"
sudo systemctl status ml-backend --no-pager -l

echo "PostgreSQL статус:"
sudo systemctl status postgresql --no-pager -l

echo "Redis статус:"
sudo systemctl status redis --no-pager -l

echo "Nginx статус:"
sudo systemctl status nginx --no-pager -l

# Проверка API
echo "🔍 Проверяем API..."
sleep 5
if curl -s http://localhost:8001/api/health | grep -q "healthy"; then
    echo "✅ API работает"
else
    echo "⚠️ API не отвечает, проверьте логи: sudo journalctl -u ml-backend -f"
fi

echo ""
echo "🎉 УСТАНОВКА ЗАВЕРШЕНА!"
echo "=========================="
echo "🌐 Frontend: http://militaryfocus.ru"
echo "🔧 Backend API: http://militaryfocus.ru:8001"
echo "📊 API Docs: http://militaryfocus.ru:8001/docs"
echo ""
echo "📋 Полезные команды:"
echo "   sudo systemctl status ml-backend    # Статус Backend"
echo "   sudo systemctl restart ml-backend   # Перезапуск Backend"
echo "   sudo systemctl logs ml-backend      # Логи Backend"
echo "   sudo nginx -t                       # Проверка Nginx"
echo "   sudo systemctl reload nginx         # Перезагрузка Nginx"
echo ""
echo "🔄 Для обновления:"
echo "   cd /var/www/www-root/data/www/militaryfocus.ru/"
echo "   git pull origin master"
echo "   cd frontend && npm run build"
echo "   sudo cp -r build/* /var/www/www-root/data/www/militaryfocus.ru/"
echo "   sudo systemctl restart ml-backend"