# 🚀 ИНСТРУКЦИЯ ПО УСТАНОВКЕ ДЛЯ MILITARYFOCUS.RU

## 📍 **ВАША СТРУКТУРА ДИРЕКТОРИЙ:**
```
/var/www/www-root/data/www/militaryfocus.ru/
├── backend/
├── frontend/
├── docker-compose.yml
└── другие файлы...
```

---

## 🐳 **СПОСОБ 1: DOCKER (РЕКОМЕНДУЕТСЯ)**

### **Шаг 1: Перейти в вашу директорию**
```bash
cd /var/www/www-root/data/www/militaryfocus.ru/
```

### **Шаг 2: Проверить наличие файлов**
```bash
ls -la
# Должны быть: backend/, frontend/, docker-compose.yml
```

### **Шаг 3: Установить Docker (если не установлен)**
```bash
# Быстрая установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Проверить установку
docker --version
docker-compose --version
```

### **Шаг 4: Исправить проблемы с Docker**
```bash
# Запустить скрипт исправления
chmod +x fix-docker-network.sh
./fix-docker-network.sh
```

### **Шаг 5: Собрать и запустить**
```bash
# Собрать и запустить все сервисы
docker-compose up --build -d

# Проверить статус
docker-compose ps

# Просмотр логов
docker-compose logs -f
```

### **Шаг 6: Проверить работу**
```bash
# Проверить API
curl http://localhost:8001/api/health

# Открыть в браузере:
# Frontend: http://militaryfocus.ru
# Backend API: http://militaryfocus.ru:8001
# API Docs: http://militaryfocus.ru:8001/docs
```

---

## 🛠️ **СПОСОБ 2: РУЧНАЯ УСТАНОВКА**

### **Шаг 1: Перейти в директорию**
```bash
cd /var/www/www-root/data/www/militaryfocus.ru/
```

### **Шаг 2: Установить системные зависимости**
```bash
# Обновить систему
sudo apt-get update
sudo apt-get upgrade -y

# Установить необходимые пакеты
sudo apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    nodejs \
    npm \
    postgresql \
    postgresql-contrib \
    redis-server \
    nginx \
    git \
    curl \
    build-essential \
    libpq-dev
```

### **Шаг 3: Настроить базу данных**
```bash
# Запустить PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Создать базу данных и пользователя
sudo -u postgres psql -c "CREATE DATABASE ml_community;"
sudo -u postgres psql -c "CREATE USER ml_user WITH PASSWORD 'ml_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ml_community TO ml_user;"
sudo -u postgres psql -c "ALTER USER ml_user CREATEDB;"
```

### **Шаг 4: Настроить Redis**
```bash
# Запустить Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Проверить работу
redis-cli ping
```

### **Шаг 5: Установить Backend**
```bash
# Перейти в директорию backend
cd /var/www/www-root/data/www/militaryfocus.ru/backend

# Создать виртуальное окружение
python3 -m venv venv

# Активировать виртуальное окружение
source venv/bin/activate

# Обновить pip
pip install --upgrade pip

# Установить зависимости
pip install -r requirements.txt

# Создать файл конфигурации
cat > .env << 'EOF'
DATABASE_URL=postgresql://ml_user:ml_password@localhost:5432/ml_community
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key-change-in-production-12345678901234567890
BACKEND_CORS_ORIGINS=http://militaryfocus.ru,https://militaryfocus.ru
DEBUG=True
EOF

# Запустить миграции
alembic upgrade head

# Создать директории для загрузок
mkdir -p static/uploads static/heroes

# Запустить Backend (в отдельном терминале)
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### **Шаг 6: Установить Frontend**
```bash
# Перейти в директорию frontend (в новом терминале)
cd /var/www/www-root/data/www/militaryfocus.ru/frontend

# Установить зависимости
npm install --legacy-peer-deps

# Создать файл конфигурации
cat > .env << 'EOF'
REACT_APP_API_URL=http://militaryfocus.ru:8001/api/v1
REACT_APP_VERSION=1.1.3
EOF

# Собрать проект
npm run build

# Скопировать собранные файлы в веб-директорию
sudo cp -r build/* /var/www/www-root/data/www/militaryfocus.ru/
```

### **Шаг 7: Настроить Nginx**
```bash
# Создать конфигурацию Nginx
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

# Проверить конфигурацию
sudo nginx -t

# Перезагрузить Nginx
sudo systemctl reload nginx
```

---

## 🔧 **СПОСОБ 3: АВТОМАТИЧЕСКАЯ УСТАНОВКА**

### **Создать скрипт автоматической установки:**
```bash
cd /var/www/www-root/data/www/militaryfocus.ru/

# Создать скрипт установки
cat > install-militaryfocus.sh << 'EOF'
#!/bin/bash

echo "🚀 УСТАНОВКА ML Community Platform для militaryfocus.ru"
echo "====================================================="

# Перейти в директорию проекта
cd /var/www/www-root/data/www/militaryfocus.ru/

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
sudo -u postgres psql -c "CREATE DATABASE ml_community;"
sudo -u postgres psql -c "CREATE USER ml_user WITH PASSWORD 'ml_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ml_community TO ml_user;"

# Настроить Redis
echo "🔴 Настраиваем Redis..."
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Установить Backend
echo "🐍 Устанавливаем Backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Создать .env
cat > .env << 'ENVEOF'
DATABASE_URL=postgresql://ml_user:ml_password@localhost:5432/ml_community
REDIS_URL=redis://localhost:6379
SECRET_KEY=militaryfocus-secret-key-12345678901234567890
BACKEND_CORS_ORIGINS=http://militaryfocus.ru,https://militaryfocus.ru
DEBUG=True
ENVEOF

# Запустить миграции
alembic upgrade head
mkdir -p static/uploads static/heroes

# Установить Frontend
echo "⚛️ Устанавливаем Frontend..."
cd ../frontend
npm install --legacy-peer-deps

# Создать .env
cat > .env << 'ENVEOF'
REACT_APP_API_URL=http://militaryfocus.ru:8001/api/v1
REACT_APP_VERSION=1.1.3
ENVEOF

# Собрать проект
npm run build

# Скопировать в веб-директорию
sudo cp -r build/* /var/www/www-root/data/www/militaryfocus.ru/

# Настроить Nginx
echo "🌐 Настраиваем Nginx..."
sudo tee /etc/nginx/sites-available/militaryfocus.ru > /dev/null << 'NGINXEOF'
server {
    listen 80;
    server_name militaryfocus.ru www.militaryfocus.ru;
    
    location / {
        root /var/www/www-root/data/www/militaryfocus.ru;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /static/ {
        alias /var/www/www-root/data/www/militaryfocus.ru/backend/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINXEOF

# Активировать сайт
sudo ln -sf /etc/nginx/sites-available/militaryfocus.ru /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Создать systemd сервис для Backend
echo "🔧 Создаем systemd сервис..."
sudo tee /etc/systemd/system/ml-backend.service > /dev/null << 'SERVICEEOF'
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
SERVICEEOF

# Запустить сервисы
sudo systemctl daemon-reload
sudo systemctl enable ml-backend
sudo systemctl start ml-backend

echo "✅ УСТАНОВКА ЗАВЕРШЕНА!"
echo "=========================="
echo "🌐 Frontend: http://militaryfocus.ru"
echo "🔧 Backend API: http://militaryfocus.ru:8001"
echo "📊 API Docs: http://militaryfocus.ru:8001/docs"
echo ""
echo "📋 Полезные команды:"
echo "   sudo systemctl status ml-backend    # Статус Backend"
echo "   sudo systemctl restart ml-backend   # Перезапуск Backend"
echo "   sudo systemctl logs ml-backend      # Логи Backend"
EOF

# Сделать скрипт исполняемым
chmod +x install-militaryfocus.sh

# Запустить установку
./install-militaryfocus.sh
```

---

## 🔍 **ПРОВЕРКА УСТАНОВКИ**

### **Проверить статус сервисов:**
```bash
# Backend
sudo systemctl status ml-backend

# PostgreSQL
sudo systemctl status postgresql

# Redis
sudo systemctl status redis-server

# Nginx
sudo systemctl status nginx
```

### **Проверить API:**
```bash
# Health check
curl http://militaryfocus.ru:8001/api/health

# Должен вернуть:
# {
#   "status": "healthy",
#   "service": "ml-community-api",
#   "version": "1.1.3",
#   "message": "Mobile Legends Community Platform is running"
# }
```

### **Проверить Frontend:**
```bash
# Проверить доступность
curl http://militaryfocus.ru

# Должна вернуться HTML страница
```

---

## 🆘 **УСТРАНЕНИЕ НЕПОЛАДОК**

### **Проблема: Права доступа**
```bash
# Исправить права доступа
sudo chown -R www-data:www-data /var/www/www-root/data/www/militaryfocus.ru/
sudo chmod -R 755 /var/www/www-root/data/www/militaryfocus.ru/
```

### **Проблема: Порт 8001 занят**
```bash
# Найти процесс, использующий порт
sudo lsof -i :8001

# Остановить процесс
sudo kill -9 PID
```

### **Проблема: Nginx не работает**
```bash
# Проверить конфигурацию
sudo nginx -t

# Перезапустить Nginx
sudo systemctl restart nginx

# Проверить логи
sudo tail -f /var/log/nginx/error.log
```

---

## 📋 **ПОЛЕЗНЫЕ КОМАНДЫ**

### **Управление сервисами:**
```bash
# Backend
sudo systemctl start ml-backend
sudo systemctl stop ml-backend
sudo systemctl restart ml-backend
sudo systemctl status ml-backend

# Логи
sudo journalctl -u ml-backend -f
sudo tail -f /var/log/nginx/access.log
```

### **Обновление:**
```bash
# Обновить код
cd /var/www/www-root/data/www/militaryfocus.ru/
git pull origin master

# Пересобрать Frontend
cd frontend
npm run build
sudo cp -r build/* /var/www/www-root/data/www/militaryfocus.ru/

# Перезапустить Backend
sudo systemctl restart ml-backend
```

---

## 🎉 **РЕЗУЛЬТАТ**

После успешной установки у вас будет:

- ✅ **Frontend**: http://militaryfocus.ru
- ✅ **Backend API**: http://militaryfocus.ru:8001
- ✅ **API Docs**: http://militaryfocus.ru:8001/docs
- ✅ **База данных**: PostgreSQL
- ✅ **Кэш**: Redis
- ✅ **Веб-сервер**: Nginx

**ML Community Platform v1.1.3 готова к работе на militaryfocus.ru!** 🚀