#!/bin/bash

echo "🔧 Исправляем .env файл для militaryfocus.ru..."

# Перейти в директорию backend
cd /var/www/www-root/data/www/militaryfocus.ru/backend/

# Создать правильный .env файл
cat > .env << 'EOF'
# Database
DATABASE_URL=postgresql://ml_user:ml_password@localhost:5432/ml_community

# Redis
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=militaryfocus-secret-key-12345678901234567890
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:8001,http://127.0.0.1:3000,http://127.0.0.1:8001,http://militaryfocus.ru,https://militaryfocus.ru

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIRECTORY=/var/www/www-root/data/www/militaryfocus.ru/backend/static/uploads

# API
API_V1_STR=/api/v1
PROJECT_NAME=Mobile Legends Community Platform

# Email (настройте для продакшена)
SMTP_TLS=True
SMTP_PORT=587
SMTP_HOST=smtp.gmail.com
SMTP_USER=
SMTP_PASSWORD=

# External APIs
ML_OFFICIAL_API_URL=https://api.mobilelegends.com
ML_OFFICIAL_API_KEY=

# Environment
ENVIRONMENT=production
DEBUG=False
EOF

echo "✅ .env файл исправлен!"

# Перезапустить Backend
echo "🔄 Перезапускаем Backend..."
sudo systemctl restart ml-backend

# Проверить статус
echo "🔍 Проверяем статус..."
sudo systemctl status ml-backend

echo "✅ Готово! Проверьте API: curl http://localhost:8001/api/health"