# 🚀 ПОЛНАЯ ИНСТРУКЦИЯ ПО УСТАНОВКЕ ML Community Platform v1.1.3

## 📋 **СОДЕРЖАНИЕ**
1. [Системные требования](#системные-требования)
2. [Способ 1: Docker (Рекомендуется)](#способ-1-docker-рекомендуется)
3. [Способ 2: Ручная установка](#способ-2-ручная-установка)
4. [Способ 3: Готовые образы](#способ-3-готовые-образы)
5. [Настройка и конфигурация](#настройка-и-конфигурация)
6. [Проверка установки](#проверка-установки)
7. [Устранение неполадок](#устранение-неполадок)
8. [Полезные команды](#полезные-команды)

---

## 🖥️ **СИСТЕМНЫЕ ТРЕБОВАНИЯ**

### **Минимальные требования:**
- **ОС**: Ubuntu 18.04+, CentOS 7+, Debian 9+, Windows 10+, macOS 10.15+
- **RAM**: 2 GB (рекомендуется 4 GB)
- **CPU**: 2 ядра (рекомендуется 4 ядра)
- **Диск**: 10 GB свободного места
- **Интернет**: Стабильное подключение для загрузки зависимостей

### **Рекомендуемые требования:**
- **ОС**: Ubuntu 20.04+ LTS
- **RAM**: 8 GB
- **CPU**: 4+ ядра
- **Диск**: 50 GB SSD
- **Docker**: 20.10+
- **Docker Compose**: 2.0+

---

## 🐳 **СПОСОБ 1: DOCKER (РЕКОМЕНДУЕТСЯ)**

### **Шаг 1: Установка Docker**

#### **Ubuntu/Debian:**
```bash
# Обновить систему
sudo apt-get update
sudo apt-get upgrade -y

# Установить необходимые пакеты
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common

# Добавить официальный GPG ключ Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Добавить репозиторий Docker
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Обновить пакеты
sudo apt-get update

# Установить Docker
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Запустить и включить Docker
sudo systemctl start docker
sudo systemctl enable docker

# Добавить пользователя в группу docker
sudo usermod -aG docker $USER

# Перелогиниться или выполнить:
newgrp docker

# Проверить установку
docker --version
```

#### **CentOS/RHEL:**
```bash
# Установить необходимые пакеты
sudo yum install -y yum-utils

# Добавить репозиторий Docker
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

# Установить Docker
sudo yum install -y docker-ce docker-ce-cli containerd.io

# Запустить и включить Docker
sudo systemctl start docker
sudo systemctl enable docker

# Добавить пользователя в группу docker
sudo usermod -aG docker $USER
newgrp docker

# Проверить установку
docker --version
```

#### **Windows:**
1. Скачайте Docker Desktop с https://www.docker.com/products/docker-desktop
2. Установите Docker Desktop
3. Запустите Docker Desktop
4. Включите WSL 2 если используете Windows 10/11

#### **macOS:**
1. Скачайте Docker Desktop с https://www.docker.com/products/docker-desktop
2. Установите Docker Desktop
3. Запустите Docker Desktop

### **Шаг 2: Установка Docker Compose**

```bash
# Скачать Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Сделать исполняемым
sudo chmod +x /usr/local/bin/docker-compose

# Создать символическую ссылку
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# Проверить установку
docker-compose --version
```

### **Шаг 3: Скачивание проекта**

```bash
# Клонировать репозиторий
git clone -b v1.1.3 https://github.com/Militaryfocus/militaryfocus_frontend.git
cd militaryfocus_frontend

# Проверить содержимое
ls -la
```

### **Шаг 4: Исправление проблем с Docker**

```bash
# Запустить скрипт исправления
chmod +x fix-docker-network.sh
./fix-docker-network.sh
```

### **Шаг 5: Сборка и запуск**

```bash
# Собрать и запустить все сервисы
docker-compose up --build -d

# Проверить статус
docker-compose ps

# Просмотр логов
docker-compose logs -f
```

### **Шаг 6: Проверка работы**

```bash
# Проверить доступность сервисов
curl http://localhost:8001/api/health

# Открыть в браузере:
# Frontend: http://localhost
# Backend API: http://localhost:8001
# API Docs: http://localhost:8001/docs
```

---

## 🛠️ **СПОСОБ 2: РУЧНАЯ УСТАНОВКА**

### **Шаг 1: Установка системных зависимостей**

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

### **Шаг 2: Настройка базы данных**

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

### **Шаг 3: Настройка Redis**

```bash
# Запустить Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Проверить работу
redis-cli ping
```

### **Шаг 4: Установка Backend**

```bash
# Перейти в директорию backend
cd backend

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
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost
DEBUG=True
EOF

# Запустить миграции
alembic upgrade head

# Создать директории для загрузок
mkdir -p static/uploads static/heroes

# Запустить Backend (в отдельном терминале)
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### **Шаг 5: Установка Frontend**

```bash
# Перейти в директорию frontend (в новом терминале)
cd frontend

# Установить зависимости
npm install --legacy-peer-deps

# Создать файл конфигурации
cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:8001/api/v1
REACT_APP_VERSION=1.1.3
EOF

# Собрать проект
npm run build

# Запустить development сервер
npm start
```

### **Шаг 6: Настройка Nginx**

```bash
# Создать конфигурацию Nginx
sudo tee /etc/nginx/sites-available/ml-community > /dev/null << 'EOF'
server {
    listen 80;
    server_name localhost;
    
    # Frontend
    location / {
        root /path/to/your/project/frontend/build;
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

# Активировать сайт
sudo ln -sf /etc/nginx/sites-available/ml-community /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Проверить конфигурацию
sudo nginx -t

# Перезагрузить Nginx
sudo systemctl reload nginx
```

---

## 🚀 **СПОСОБ 3: ГОТОВЫЕ ОБРАЗЫ**

### **Шаг 1: Скачивание готовых образов**

```bash
# Скачать готовые образы
docker pull python:3.9-slim
docker pull node:18-alpine
docker pull postgres:13-alpine
docker pull redis:6-alpine
docker pull nginx:alpine
```

### **Шаг 2: Запуск с готовыми образами**

```bash
# Создать docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:13-alpine
    environment:
      POSTGRES_DB: ml_community
      POSTGRES_USER: ml_user
      POSTGRES_PASSWORD: ml_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    image: python:3.9-slim
    working_dir: /app
    command: >
      sh -c "pip install -r requirements.txt &&
             uvicorn app.main:app --host 0.0.0.0 --port 8001"
    ports:
      - "8001:8001"
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app

  frontend:
    image: node:18-alpine
    working_dir: /app
    command: >
      sh -c "npm install --legacy-peer-deps &&
             npm run build &&
             npx serve -s build -l 3000"
    ports:
      - "3000:3000"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app

volumes:
  postgres_data:
  redis_data:
EOF

# Запустить
docker-compose up -d
```

---

## ⚙️ **НАСТРОЙКА И КОНФИГУРАЦИЯ**

### **Переменные окружения Backend (.env):**

```bash
# База данных
DATABASE_URL=postgresql://ml_user:ml_password@localhost:5432/ml_community

# Redis
REDIS_URL=redis://localhost:6379

# Безопасность
SECRET_KEY=your-secret-key-change-in-production-12345678901234567890
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15

# CORS
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost

# Отладка
DEBUG=True
LOG_LEVEL=INFO
```

### **Переменные окружения Frontend (.env):**

```bash
# API URL
REACT_APP_API_URL=http://localhost:8001/api/v1

# Версия
REACT_APP_VERSION=1.1.3

# Режим разработки
REACT_APP_DEBUG=true
```

### **Настройка SSL (опционально):**

```bash
# Установить Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Получить SSL сертификат
sudo certbot --nginx -d your-domain.com

# Автоматическое обновление
sudo crontab -e
# Добавить: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🔍 **ПРОВЕРКА УСТАНОВКИ**

### **Проверка Docker установки:**

```bash
# Проверить статус контейнеров
docker-compose ps

# Проверить логи
docker-compose logs backend
docker-compose logs frontend

# Проверить использование ресурсов
docker stats
```

### **Проверка ручной установки:**

```bash
# Проверить сервисы
sudo systemctl status postgresql
sudo systemctl status redis-server
sudo systemctl status nginx

# Проверить порты
sudo netstat -tlnp | grep :8001
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :5432
```

### **Проверка API:**

```bash
# Health check
curl http://localhost:8001/api/health

# Должен вернуть:
# {
#   "status": "healthy",
#   "service": "ml-community-api",
#   "version": "1.1.3",
#   "message": "Mobile Legends Community Platform is running"
# }
```

### **Проверка Frontend:**

```bash
# Проверить доступность
curl http://localhost

# Должна вернуться HTML страница
```

---

## 🆘 **УСТРАНЕНИЕ НЕПОЛАДОК**

### **Проблема: Docker не установлен**

```bash
# Решение: Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
```

### **Проблема: Порт занят**

```bash
# Найти процесс, использующий порт
sudo lsof -i :8001
sudo lsof -i :80

# Остановить процесс
sudo kill -9 PID
```

### **Проблема: База данных не подключается**

```bash
# Проверить статус PostgreSQL
sudo systemctl status postgresql

# Перезапустить PostgreSQL
sudo systemctl restart postgresql

# Проверить подключение
psql -h localhost -U ml_user -d ml_community
```

### **Проблема: Frontend не собирается**

```bash
# Очистить кэш npm
npm cache clean --force

# Удалить node_modules
rm -rf node_modules package-lock.json

# Переустановить зависимости
npm install --legacy-peer-deps

# Пересобрать
npm run build
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

### **Docker команды:**

```bash
# Управление контейнерами
docker-compose up -d                    # Запуск в фоне
docker-compose down                     # Остановка
docker-compose restart                  # Перезапуск
docker-compose logs -f                  # Просмотр логов
docker-compose ps                       # Статус контейнеров

# Очистка
docker system prune -a                 # Очистить все
docker-compose down -v                 # Удалить volumes
docker image prune                     # Очистить образы
```

### **Системные команды:**

```bash
# Управление сервисами
sudo systemctl start ml-backend        # Запустить Backend
sudo systemctl stop ml-backend         # Остановить Backend
sudo systemctl restart ml-backend      # Перезапустить Backend
sudo systemctl status ml-backend       # Статус Backend

# Логи
sudo journalctl -u ml-backend -f       # Логи Backend
sudo tail -f /var/log/nginx/access.log # Логи Nginx
```

### **База данных:**

```bash
# Подключение к PostgreSQL
psql -h localhost -U ml_user -d ml_community

# Создание резервной копии
pg_dump -h localhost -U ml_user ml_community > backup.sql

# Восстановление из резервной копии
psql -h localhost -U ml_user -d ml_community < backup.sql
```

### **Мониторинг:**

```bash
# Использование ресурсов
htop                                    # Процессы
df -h                                   # Диск
free -h                                 # Память
docker stats                           # Docker статистика

# Сетевые подключения
netstat -tlnp                          # Слушающие порты
ss -tlnp                               # Современная версия netstat
```

---

## 🎉 **ЗАКЛЮЧЕНИЕ**

После успешной установки у вас будет:

- ✅ **Frontend**: http://localhost (React приложение)
- ✅ **Backend API**: http://localhost:8001 (FastAPI)
- ✅ **API Docs**: http://localhost:8001/docs (Swagger UI)
- ✅ **База данных**: PostgreSQL на порту 5432
- ✅ **Кэш**: Redis на порту 6379
- ✅ **Веб-сервер**: Nginx на порту 80

**ML Community Platform v1.1.3 готова к использованию!** 🚀

---

**Дата создания**: $(date)  
**Версия**: v1.1.3  
**Статус**: ✅ PRODUCTION READY