# ML Community Platform - Monolith

Фан-сообщество Mobile Legends: Bang Bang с системой управления героями, гайдами, сборками и тактиками.

## 🚀 Особенности

- **Монолитная архитектура** - Одно приложение, один сервер, простое развертывание
- **FastAPI + HTML Templates** - Современный Python веб-фреймворк с серверным рендерингом
- **PostgreSQL** - Надежная база данных для хранения всех данных
- **Redis** - Кэширование и сессии
- **Responsive Design** - Адаптивный дизайн для всех устройств
- **SEO-friendly** - Серверный рендеринг для лучшей индексации

## 📋 Предварительные требования

- **Python**: 3.8+ (рекомендуется 3.11+)
- **PostgreSQL**: 12+ (рекомендуется 15+)
- **Redis**: 6+ (опционально)
- **Git**: для клонирования репозитория

## 🔧 Установка

### Автоматическая установка

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd ml-community-monolith

# Запустите автоматическую установку
chmod +x scripts/init_database.sh
./scripts/init_database.sh
```

### Ручная установка

1. **Установите зависимости:**
```bash
pip install -r requirements.txt
```

2. **Настройте базу данных:**
```bash
# Создайте базу данных PostgreSQL
sudo -u postgres psql
CREATE DATABASE ml_community;
CREATE USER ml_admin WITH PASSWORD 'ML_Community_2024!';
GRANT ALL PRIVILEGES ON DATABASE ml_community TO ml_admin;
\q
```

3. **Настройте переменные окружения:**
```bash
cp .env.example .env
# Отредактируйте .env файл с вашими настройками
```

4. **Запустите миграции:**
```bash
alembic upgrade head
```

5. **Запустите приложение:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## 🐳 Docker установка

```bash
# Запустите с Docker Compose
docker-compose up -d

# Инициализируйте базу данных
docker-compose exec app alembic upgrade head
```

## 🌐 Доступ к приложению

- **Приложение**: http://localhost:8000
- **API документация**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## 📁 Структура проекта

```
ml-community-monolith/
├── app/
│   ├── __init__.py
│   ├── main.py              # Главный файл приложения
│   ├── models.py            # SQLAlchemy модели
│   ├── schemas.py           # Pydantic схемы
│   ├── routers.py           # FastAPI роуты
│   ├── auth.py              # Аутентификация
│   ├── core/
│   │   ├── config.py        # Конфигурация
│   │   └── database.py      # Настройка БД
│   ├── templates/           # HTML шаблоны
│   │   ├── base.html
│   │   ├── home.html
│   │   ├── heroes/
│   │   ├── guides/
│   │   ├── news/
│   │   └── auth/
│   └── static/              # Статические файлы
│       ├── css/
│       ├── js/
│       └── images/
├── alembic/                 # Миграции БД
├── scripts/                 # Скрипты установки
├── requirements.txt         # Python зависимости
├── Dockerfile              # Docker конфигурация
├── docker-compose.yml      # Docker Compose
└── README.md
```

## 🎯 Модули платформы

### 🦸 Герои
- База данных всех героев Mobile Legends
- Характеристики, навыки, контрпики и синергии
- Статистика винрейтов и пикрейтов
- Детальные страницы героев

### 📚 Гайды
- Создание и просмотр гайдов по героям
- Сборки предметов и эмблимов
- Рейтинговая система и комментарии
- Поиск и фильтрация гайдов

### 📰 Новости
- Новостная лента с актуальными событиями
- Обновления игры и турниры
- Система лайков и просмотров

### 🔍 Поиск
- Умный поиск по героям, гайдам и новостям
- Фильтрация и сортировка результатов
- Автодополнение и подсказки

### 👤 Пользователи
- Регистрация и аутентификация
- Личные профили и статистика
- Создание собственных гайдов

## 🛠️ Разработка

### Запуск в режиме разработки

```bash
# Активируйте виртуальное окружение
python -m venv venv
source venv/bin/activate  # Linux/macOS
# или
venv\Scripts\activate     # Windows

# Установите зависимости
pip install -r requirements.txt

# Запустите приложение
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Создание миграций

```bash
# Создайте новую миграцию
alembic revision --autogenerate -m "Description of changes"

# Примените миграции
alembic upgrade head
```

### Тестирование

```bash
# Запустите тесты (если есть)
pytest

# Проверьте код
flake8 app/
black app/
```

## 📊 API Endpoints

### Основные страницы
- `GET /` - Главная страница
- `GET /heroes` - Список героев
- `GET /heroes/{id}` - Детали героя
- `GET /guides` - Список гайдов
- `GET /guides/{id}` - Детали гайда
- `GET /news` - Список новостей
- `GET /news/{id}` - Детали новости
- `GET /search` - Поиск

### Аутентификация
- `GET /login` - Страница входа
- `POST /login` - Вход пользователя
- `GET /register` - Страница регистрации
- `POST /register` - Регистрация пользователя
- `GET /logout` - Выход пользователя
- `GET /profile` - Профиль пользователя

### API
- `GET /health` - Проверка здоровья
- `GET /api/docs` - Swagger документация
- `GET /api/redoc` - ReDoc документация

## 🔒 Безопасность

- JWT токены для аутентификации
- Хеширование паролей с bcrypt
- CORS настройки
- Валидация входных данных
- Защита от SQL инъекций

## 📈 Производительность

- Connection pooling для PostgreSQL
- Кэширование с Redis
- Сжатие gzip
- Оптимизированные SQL запросы
- Lazy loading для изображений

## 🚀 Развертывание

### Production настройки

1. **Обновите .env файл:**
```env
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=postgresql://user:password@host:port/database
```

2. **Запустите с Gunicorn:**
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

3. **Настройте Nginx (опционально):**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл LICENSE для подробностей.

## 🆘 Поддержка

Если у вас возникли проблемы:

1. Проверьте логи приложения
2. Убедитесь, что все зависимости установлены
3. Проверьте настройки базы данных
4. Создайте issue в репозитории

## 📞 Контакты

- **GitHub**: [repository-url]
- **Email**: support@mlcommunity.com
- **Discord**: [discord-invite]