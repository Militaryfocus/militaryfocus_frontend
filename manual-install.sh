#!/bin/bash

echo "🚀 РУЧНАЯ УСТАНОВКА ML Community Platform v1.1.2"
echo "=================================================="

# Проверка системы
echo "🔍 Проверяем систему..."
if command -v python3 &> /dev/null; then
    echo "✅ Python3 найден: $(python3 --version)"
else
    echo "❌ Python3 не найден. Установите Python 3.9+"
    exit 1
fi

if command -v node &> /dev/null; then
    echo "✅ Node.js найден: $(node --version)"
else
    echo "❌ Node.js не найден. Установите Node.js 18+"
    exit 1
fi

# Установка системных зависимостей
echo "📦 Устанавливаем системные зависимости..."
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib redis-server nginx

# Настройка PostgreSQL
echo "🗄️ Настраиваем PostgreSQL..."
sudo -u postgres psql -c "CREATE DATABASE ml_community;"
sudo -u postgres psql -c "CREATE USER ml_user WITH PASSWORD 'ml_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ml_community TO ml_user;"

# Установка Backend
echo "🐍 Устанавливаем Backend..."
cd backend

# Создание виртуального окружения
python3 -m venv venv
source venv/bin/activate

# Установка зависимостей
pip install --upgrade pip
pip install -r requirements.txt

# Настройка переменных окружения
cat > .env << 'EOF'
DATABASE_URL=postgresql://ml_user:ml_password@localhost:5432/ml_community
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key-change-in-production-12345678901234567890
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost
EOF

# Запуск миграций
echo "🔄 Запускаем миграции базы данных..."
alembic upgrade head

# Создание директорий
mkdir -p static/uploads static/heroes

echo "✅ Backend готов!"
echo "🚀 Для запуска Backend:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn app.main:app --host 0.0.0.0 --port 8001"

cd ..

# Установка Frontend
echo "⚛️ Устанавливаем Frontend..."
cd frontend

# Установка зависимостей
npm install --legacy-peer-deps

# Сборка проекта
npm run build

echo "✅ Frontend готов!"
echo "🚀 Для запуска Frontend:"
echo "   cd frontend"
echo "   npm start"

cd ..

# Настройка Nginx
echo "🌐 Настраиваем Nginx..."
sudo tee /etc/nginx/sites-available/ml-community > /dev/null << 'EOF'
server {
    listen 80;
    server_name localhost;
    
    # Frontend
    location / {
        root /var/www/www-root/data/www/militaryfocus.ru/frontend/build;
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
}
EOF

# Активация сайта
sudo ln -sf /etc/nginx/sites-available/ml-community /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Nginx настроен!"

# Создание systemd сервисов
echo "🔧 Создаем systemd сервисы..."

# Backend сервис
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

# Запуск сервисов
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

echo ""
echo "🎉 УСТАНОВКА ЗАВЕРШЕНА!"
echo "=========================="
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost:8001"
echo "📊 API Docs: http://localhost:8001/docs"
echo ""
echo "📋 Полезные команды:"
echo "   sudo systemctl status ml-backend    # Статус Backend"
echo "   sudo systemctl restart ml-backend   # Перезапуск Backend"
echo "   sudo systemctl logs ml-backend      # Логи Backend"
echo "   sudo nginx -t                       # Проверка Nginx"
echo "   sudo systemctl reload nginx         # Перезагрузка Nginx"