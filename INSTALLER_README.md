# ML Community Platform - Полноценный Веб-Установщик

## 🎯 Обзор

Создан полноценный веб-установщик, который автоматически настраивает весь сервер для работы платформы Mobile Legends Community. Установщик включает в себя:

- ✅ **Автоматическую установку всех зависимостей**
- ✅ **Настройку PostgreSQL и Redis**
- ✅ **Создание администратора**
- ✅ **Импорт начальных данных**
- ✅ **Настройку Nginx с SSL**
- ✅ **Systemd сервисы**
- ✅ **Мониторинг и логирование**

## 🚀 Быстрый запуск

### Вариант 1: Автоматический запуск (рекомендуется)

```bash
# Клонируйте проект
git clone <repository-url>
cd ml-community-platform

# Запустите автоматический установщик
sudo ./installer/quick_start.sh
```

### Вариант 2: Ручной запуск

```bash
# Перейдите в папку установщика
cd installer

# Установите зависимости
pip3 install -r requirements.txt

# Запустите установщик
python3 run_installer.py
```

## 🌐 Веб-интерфейс

После запуска откройте браузер и перейдите по адресу: **http://localhost:5000**

## 📋 Шаги установки

### 1. Проверка системных требований
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- Redis 6+
- 2GB RAM минимум
- 1GB свободного места

### 2. Настройка базы данных
- Автоматическая установка PostgreSQL
- Создание базы данных `ml_community`
- Настройка пользователя и прав

### 3. Настройка Redis
- Установка Redis сервера
- Настройка кэширования
- Конфигурация паролей (опционально)

### 4. Создание администратора
- Форма создания первого пользователя
- Настройка ролей и разрешений
- Валидация данных

### 5. Импорт данных
- Миграции базы данных
- Импорт героев Mobile Legends
- Загрузка предметов и экипировки
- Примеры гайдов

### 6. Автоматическая установка
- Установка всех системных пакетов
- Настройка Python и Node.js зависимостей
- Конфигурация Nginx
- Настройка SSL сертификатов
- Создание systemd сервисов
- Настройка файрвола

## 🛠️ Что устанавливается автоматически

### Системные пакеты
```bash
# Основные пакеты
python3 python3-pip python3-venv python3-dev
postgresql postgresql-contrib
redis-server
nginx
certbot python3-certbot-nginx
git curl wget unzip build-essential
nodejs npm
supervisor
ufw
```

### Python зависимости
- FastAPI 0.104.1
- SQLAlchemy 2.0.23
- Alembic 1.12.1
- psycopg2-binary 2.9.9
- Redis 5.0.1
- Pydantic 2.5.0
- И другие (см. requirements.txt)

### Node.js зависимости
- React 18.2.0
- TypeScript 5.0.0
- Tailwind CSS 3.3.0
- Axios 1.6.0
- React Query 3.39.0
- И другие (см. package.json)

## 🔧 Управление сервисами

После установки все сервисы управляются через systemd:

```bash
# Статус сервисов
systemctl status ml-community-backend postgresql redis-server nginx

# Перезапуск backend
systemctl restart ml-community-backend

# Просмотр логов
journalctl -u ml-community-backend -f

# Мониторинг системы
/usr/local/bin/ml-community-monitor.sh
```

## 🌐 Доступ к платформе

После успешной установки:

- **Frontend**: http://localhost (или ваш домен)
- **Backend API**: http://localhost/api
- **Документация API**: http://localhost/api/docs
- **Админ панель**: http://localhost/admin (если настроена)

## 📊 Мониторинг

Установщик создает скрипт мониторинга:

```bash
# Запуск мониторинга
/usr/local/bin/ml-community-monitor.sh
```

Скрипт показывает:
- Статус всех сервисов
- Использование ресурсов
- Последние логи
- Общее состояние системы

## 🔒 Безопасность

Автоматически настраивается:
- UFW файрвол с правильными правилами
- SSL сертификаты через Let's Encrypt
- Безопасные заголовки Nginx
- Изоляция сервисов
- Регулярные обновления

## 📁 Структура проекта

```
ml-community-platform/
├── backend/                 # FastAPI backend
│   ├── app/
│   ├── requirements.txt
│   └── ...
├── frontend/               # React frontend
│   ├── src/
│   ├── package.json
│   └── ...
├── installer/              # Веб-установщик
│   ├── app.py             # Flask приложение
│   ├── server_setup.py    # Автоматическая настройка
│   ├── templates/         # HTML шаблоны
│   ├── requirements.txt
│   └── quick_start.sh     # Скрипт быстрого запуска
└── README.md
```

## 🐛 Устранение неполадок

### Проблемы с правами
```bash
# Убедитесь, что у вас есть sudo права
sudo -v

# Если нужно, добавьте пользователя в группу sudo
sudo usermod -aG sudo $USER
```

### Проблемы с портами
```bash
# Проверьте занятые порты
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :5432
sudo netstat -tlnp | grep :6379
sudo netstat -tlnp | grep :8001
```

### Проблемы с сервисами
```bash
# Проверьте статус
systemctl status ml-community-backend
journalctl -u ml-community-backend -n 50

# Перезапустите
sudo systemctl restart ml-community-backend
sudo systemctl restart nginx
```

### Проблемы с базой данных
```bash
# Проверьте подключение
sudo -u postgres psql -c "\\l"

# Перезапустите PostgreSQL
sudo systemctl restart postgresql
```

## 📝 Логи

Логи установки доступны в веб-интерфейсе установщика. После установки:

- **Backend логи**: `journalctl -u ml-community-backend -f`
- **Nginx логи**: `/var/log/nginx/error.log`
- **PostgreSQL логи**: `/var/log/postgresql/`
- **Redis логи**: `/var/log/redis/`

## 🔄 Обновление

Для обновления платформы:

```bash
# Остановите сервисы
sudo systemctl stop ml-community-backend

# Обновите код
git pull

# Обновите зависимости
cd backend && pip install -r requirements.txt
cd ../frontend && npm install && npm run build

# Перезапустите сервисы
sudo systemctl start ml-community-backend
```

## 📞 Поддержка

Если у вас возникли проблемы:

1. Проверьте логи установки в веб-интерфейсе
2. Запустите скрипт мониторинга
3. Проверьте статус сервисов
4. Обратитесь к документации

## 🎉 Готово!

После успешной установки у вас будет полностью настроенная платформа Mobile Legends Community с:

- ✅ Веб-интерфейсом на React
- ✅ REST API на FastAPI
- ✅ База данных PostgreSQL
- ✅ Кэширование Redis
- ✅ Веб-сервер Nginx
- ✅ SSL сертификаты
- ✅ Автозапуск сервисов
- ✅ Мониторинг и логирование

**Добро пожаловать в ML Community! 🎮**