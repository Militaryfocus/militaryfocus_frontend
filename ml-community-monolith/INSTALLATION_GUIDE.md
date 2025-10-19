# 🚀 Полное руководство по установке ML Community Platform

## 📋 Системные требования

### Минимальные требования:
- **CPU**: 2 ядра
- **RAM**: 2GB
- **Диск**: 5GB свободного места
- **ОС**: Ubuntu 18.04+, Debian 10+, CentOS 7+, macOS, Windows (WSL2)

### Рекомендуемые требования:
- **CPU**: 4 ядра
- **RAM**: 4GB+
- **Диск**: 10GB+ свободного места
- **SSD**: для лучшей производительности БД

### Программное обеспечение:
- **Python**: 3.8+ (рекомендуется 3.11+)
- **PostgreSQL**: 12+ (рекомендуется 15+)
- **Redis**: 6+ (опционально)
- **Git**: для клонирования репозитория
- **curl**: для проверки работоспособности

## 🚀 Методы установки

### 1. 🤖 Автоматическая установка (One-Click)

**Самый простой способ - всё настроится автоматически!**

```bash
# 1. Клонировать репозиторий
git clone https://github.com/Militaryfocus/militaryfocus_frontend.git
cd militaryfocus_frontend/ml-community-monolith

# 2. Запустить автоматическую установку
chmod +x one_click_install.sh
sudo ./one_click_install.sh
```

**Что делает скрипт:**
- ✅ Обновляет систему (`apt update`)
- ✅ Устанавливает зависимости (Python, PostgreSQL, Redis)
- ✅ Настраивает базу данных PostgreSQL
- ✅ Создает пользователя БД с правильными правами
- ✅ Создает виртуальное окружение Python
- ✅ Устанавливает все Python пакеты
- ✅ Настраивает конфигурацию (.env файл)
- ✅ Выполняет миграции базы данных
- ✅ Загружает 57 героев Mobile Legends с русскими описаниями
- ✅ Создает 12 базовых достижений
- ✅ Создает администратора (admin/admin123)
- ✅ Запускает приложение на порту 8000
- ✅ Проверяет работоспособность

**После установки доступно:**
- 🌐 **Основной сайт**: http://localhost:8000
- 📚 **API документация**: http://localhost:8000/api/docs
- 🔍 **ReDoc**: http://localhost:8000/api/redoc
- ❤️ **Health check**: http://localhost:8000/health

### 2. 🐳 Docker установка

**Для тех, кто предпочитает контейнеры:**

```bash
# 1. Клонировать репозиторий
git clone https://github.com/Militaryfocus/militaryfocus_frontend.git
cd militaryfocus_frontend/ml-community-monolith

# 2. Запустить с Docker Compose
docker-compose up -d

# 3. Выполнить инициализацию данных
docker-compose exec app alembic upgrade head
docker-compose exec app python create_achievements.py
docker-compose exec app python import_heroes.py import
docker-compose exec app python create_admin.py

# 4. Проверить статус
docker-compose ps
```

**Docker Compose включает:**
- 🐍 **FastAPI приложение** (порт 8000)
- 🐘 **PostgreSQL база данных** (порт 5432)
- 🔴 **Redis** для кэширования (порт 6379)
- 📊 **Nginx** для production (опционально)

### 3. 🛠️ Ручная установка

**Для опытных пользователей или кастомной настройки:**

#### Шаг 1: Подготовка системы
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y python3 python3-pip python3-venv python3-dev
sudo apt install -y postgresql postgresql-contrib libpq-dev
sudo apt install -y redis-server git curl

# CentOS/RHEL
sudo yum update
sudo yum install -y python3 python3-pip python3-devel
sudo yum install -y postgresql-server postgresql-devel redis git curl

# macOS (с Homebrew)
brew install python postgresql redis git
```

#### Шаг 2: Настройка PostgreSQL
```bash
# Запустить PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Создать базу данных и пользователя
sudo -u postgres psql << EOF
CREATE DATABASE ml_community;
CREATE USER ml_admin WITH PASSWORD 'ML_Community_2024!';
GRANT ALL PRIVILEGES ON DATABASE ml_community TO ml_admin;
ALTER USER ml_admin CREATEDB;
\q
EOF

# Настроить права доступа
sudo -u postgres psql -d ml_community << EOF
GRANT ALL ON SCHEMA public TO ml_admin;
GRANT CREATE ON SCHEMA public TO ml_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ml_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ml_admin;
\q
EOF
```

#### Шаг 3: Клонирование и настройка
```bash
# Клонировать репозиторий
git clone https://github.com/Militaryfocus/militaryfocus_frontend.git
cd militaryfocus_frontend/ml-community-monolith

# Создать виртуальное окружение
python3 -m venv venv
source venv/bin/activate

# Обновить pip и установить зависимости
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

#### Шаг 4: Конфигурация
```bash
# Создать .env файл
cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://ml_admin:ML_Community_2024!@localhost:5432/ml_community

# Redis Configuration  
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=ML_Community_Super_Secret_Key_2024_Change_In_Production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Configuration
ALLOWED_ORIGINS=["http://localhost:8000", "http://127.0.0.1:8000"]

# Environment
ENVIRONMENT=production
DEBUG=false
EOF
```

#### Шаг 5: Инициализация данных
```bash
# Выполнить миграции
alembic upgrade head

# Создать достижения
python create_achievements.py

# Импортировать героев
python import_heroes.py import

# Создать администратора
python create_admin.py
```

#### Шаг 6: Запуск приложения
```bash
# Запуск для разработки
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Запуск для production
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 > app.log 2>&1 &

# Или с Gunicorn (рекомендуется для production)
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 🔧 Настройка для production

### 1. Systemd сервис
```bash
# Создать сервис
sudo tee /etc/systemd/system/ml-community.service << EOF
[Unit]
Description=ML Community Platform
After=network.target postgresql.service

[Service]
Type=exec
User=www-data
WorkingDirectory=/path/to/ml-community-monolith
Environment=PATH=/path/to/ml-community-monolith/venv/bin
ExecStart=/path/to/ml-community-monolith/venv/bin/gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Запустить сервис
sudo systemctl daemon-reload
sudo systemctl enable ml-community
sudo systemctl start ml-community
```

### 2. Nginx reverse proxy
```bash
# Установить Nginx
sudo apt install nginx

# Создать конфигурацию
sudo tee /etc/nginx/sites-available/ml-community << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /static/ {
        alias /path/to/ml-community-monolith/app/static/;
    }
}
EOF

# Активировать сайт
sudo ln -s /etc/nginx/sites-available/ml-community /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. SSL сертификат (Let's Encrypt)
```bash
# Установить Certbot
sudo apt install certbot python3-certbot-nginx

# Получить сертификат
sudo certbot --nginx -d your-domain.com

# Автообновление сертификата
sudo crontab -e
# Добавить: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Проверка установки

### Базовая проверка
```bash
# Проверить статус приложения
curl http://localhost:8000/health

# Проверить API
curl http://localhost:8000/api/docs

# Проверить базу данных
psql -h localhost -U ml_admin -d ml_community -c "SELECT COUNT(*) FROM heroes;"
```

### Расширенная проверка
```bash
# Проверить все компоненты
./check_installation.sh

# Проверить логи
tail -f app.log

# Проверить процессы
ps aux | grep uvicorn
```

## 🚨 Устранение проблем

### Проблема: База данных не подключается
```bash
# Проверить статус PostgreSQL
sudo systemctl status postgresql

# Проверить подключение
psql -h localhost -U ml_admin -d ml_community -c "SELECT 1;"

# Проверить права пользователя
sudo -u postgres psql -c "\du ml_admin"
```

### Проблема: Ошибки миграций
```bash
# Проверить текущую версию БД
alembic current

# Сбросить миграции (ОСТОРОЖНО!)
alembic downgrade base
alembic upgrade head
```

### Проблема: Приложение не запускается
```bash
# Проверить зависимости
pip install -r requirements.txt

# Проверить конфигурацию
python -c "from app.core.config import settings; print(settings.DATABASE_URL)"

# Проверить порт
sudo netstat -tlnp | grep :8000
```

### Проблема: Нет героев в базе
```bash
# Переимпортировать героев
python import_heroes.py import

# Проверить количество
python -c "
from app.core.database import SessionLocal
from app.models import Hero
db = SessionLocal()
print(f'Heroes in DB: {db.query(Hero).count()}')
"
```

## 📱 Мобильная установка (Termux на Android)

```bash
# Установить Termux из F-Droid или Google Play
# В Termux выполнить:

pkg update && pkg upgrade
pkg install python postgresql git
pip install --upgrade pip

# Далее следовать обычной процедуре установки
```

## 🔄 Автоматические обновления

После установки настройте автоматические обновления:

```bash
# Настроить проверку обновлений
./setup_auto_updates.sh

# Или добавить в cron вручную
crontab -e
# Добавить: 0 2 * * * cd /path/to/ml-community-monolith && ./check_updates.sh
```

## 📋 Чеклист после установки

- [ ] Приложение доступно по http://localhost:8000
- [ ] API документация открывается: /api/docs
- [ ] Можно войти как admin (admin/admin123)
- [ ] В базе 57 героев: /heroes
- [ ] Работают достижения: /profile/stats
- [ ] Функционирует поиск: /search
- [ ] Можно создать гайд: /guides/builder
- [ ] Работают уведомления и избранное
- [ ] Настроены автообновления
- [ ] Созданы бэкапы базы данных

## 🎯 Что дальше?

После успешной установки:

1. **Смените пароль администратора**
2. **Настройте домен и SSL** (для production)
3. **Создайте пользователей** и начните добавлять контент
4. **Настройте мониторинг** и логирование
5. **Изучите документацию** по использованию платформы

---

## 📞 Поддержка

Если возникли проблемы с установкой:

- 📖 **Документация**: README.md файлы в репозитории
- 🐛 **Issues**: https://github.com/Militaryfocus/militaryfocus_frontend/issues
- 📧 **Email**: support@mlcommunity.com

**Добро пожаловать в ML Community Platform!** 🎮