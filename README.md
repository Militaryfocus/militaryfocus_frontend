# Mobile Legends Community Platform

Фан-сообщество Mobile Legends: Bang Bang с системой управления героями, гайдами, сборками и тактиками.

## 🚀 Быстрый старт

### Автоматическая установка

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd ml-community-platform

# Запустите автоматическую установку
chmod +x scripts/install.sh
./scripts/install.sh
```

### Ручная установка

1. **Установите зависимости:**
   ```bash
   # Docker и Docker Compose
   sudo apt update
   sudo apt install docker.io docker-compose
   
   # Python 3.9+ (для скриптов)
   sudo apt install python3 python3-pip
   ```

2. **Настройте окружение:**
   ```bash
   cp .env.example .env
   # Отредактируйте .env файл под ваши нужды
   ```

3. **Запустите сервисы:**
   ```bash
   docker-compose up -d
   ```

4. **Инициализируйте базу данных:**
   ```bash
   # Автоматическая инициализация
   docker-compose exec backend ./scripts/docker_init_db.sh
   
   # Или вручную
   docker-compose exec backend alembic upgrade head
   ```

5. **Загрузите начальные данные:**
   ```bash
   docker-compose exec backend python scripts/import_heroes.py
   docker-compose exec backend python scripts/create_admin.py
   ```

## 📊 Настройка базы данных

### Параметры подключения

- **Имя базы данных:** `ml_community`
- **Пользователь:** `ml_admin`
- **Пароль:** `ML_Community_2024!`
- **Хост:** `localhost` (разработка) / `db` (Docker)
- **Порт:** `5432`

### Быстрая настройка

```bash
# Локальная разработка
cd backend
./scripts/init_database.sh

# Docker
docker-compose exec backend ./scripts/docker_init_db.sh
```

Подробная инструкция по настройке базы данных: [DATABASE_SETUP.md](DATABASE_SETUP.md)

## 📋 Системные требования

- **ОС:** Ubuntu 20.04+ / CentOS 8+ / macOS 10.15+
- **RAM:** 4GB минимум (рекомендуется 8GB)
- **Диск:** 20GB свободного места
- **Docker:** 20.10+ & Docker Compose 2.0+
- **Python:** 3.9+ (для скриптов)

## 🏗️ Архитектура

### Backend (FastAPI)
- **Фреймворк:** FastAPI + Python 3.9+
- **База данных:** PostgreSQL 13
- **Кэширование:** Redis 6
- **Поиск:** Elasticsearch 7.14 (опционально)
- **Аутентификация:** JWT токены
- **Документация:** Swagger UI / ReDoc

### Frontend (React)
- **Фреймворк:** React 18 + TypeScript
- **Стили:** Tailwind CSS
- **Состояние:** React Query
- **Роутинг:** React Router v6
- **Формы:** React Hook Form
- **Уведомления:** React Hot Toast

### Инфраструктура
- **Контейнеризация:** Docker + Docker Compose
- **Веб-сервер:** Nginx
- **Медиа:** Локальное хранилище (можно настроить AWS S3)

## 🔧 Конфигурация

### Переменные окружения (.env)

```bash
# База данных
DATABASE_URL=postgresql://ml_admin:ML_Community_2024!@db:5432/ml_community
POSTGRES_DB=ml_community
POSTGRES_USER=ml_admin
POSTGRES_PASSWORD=ML_Community_2024!

# Redis
REDIS_URL=redis://redis:6379

# Безопасность
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
BACKEND_CORS_ORIGINS=["http://localhost", "http://localhost:3000"]

# API
API_V1_STR=/api/v1
PROJECT_NAME=Mobile Legends Community Platform
```

## 📚 API Документация

После запуска сервисов документация доступна по адресам:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **OpenAPI Schema:** http://localhost:8000/openapi.json

### Основные endpoints:

```
# Герои
GET    /api/v1/heroes              # Список героев
GET    /api/v1/heroes/{id}         # Детали героя
GET    /api/v1/heroes/{id}/counters # Контрпики
GET    /api/v1/heroes/{id}/guides  # Гайды героя

# Гайды
GET    /api/v1/guides              # Список гайдов
POST   /api/v1/guides              # Создать гайд
GET    /api/v1/guides/{id}         # Детали гайда
PUT    /api/v1/guides/{id}         # Обновить гайд
POST   /api/v1/guides/{id}/rate   # Оценить гайд

# Пользователи
GET    /api/v1/users               # Список пользователей
GET    /api/v1/users/{id}          # Профиль пользователя
PUT    /api/v1/users/{id}          # Обновить профиль

# Аутентификация
POST   /api/v1/auth/login         # Вход
POST   /api/v1/auth/register      # Регистрация
GET    /api/v1/auth/me            # Текущий пользователь

# Поиск
GET    /api/v1/search             # Универсальный поиск
GET    /api/v1/search/heroes      # Поиск героев
GET    /api/v1/search/guides     # Поиск гайдов

# Новости
GET    /api/v1/news               # Список новостей
GET    /api/v1/news/{id}          # Детали новости
```

## 🎮 Функциональность

### Модули системы:

1. **Аутентификация и пользователи**
   - Регистрация через email
   - Система ролей (User, Content Creator, Moderator, Admin)
   - Профиль игрока (IGN, ранг, main heroes)

2. **Герои**
   - Полный каталог героев (120+ персонажей)
   - Детальные характеристики и навыки
   - Сравнение героев
   - Контрпики и синергии

3. **Гайды и сборки**
   - Создание/редактирование гайдов
   - Система рейтингов и комментариев
   - Версионность гайдов
   - Теги и фильтрация

4. **Поиск**
   - Универсальный поиск по платформе
   - Автодополнение
   - Фильтрация результатов

5. **Новости и события**
   - Новости игры
   - События сообщества
   - Патч notes

## 🛠️ Разработка

### Запуск в режиме разработки:

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend
cd frontend
npm install
npm start
```

### Создание миграций:

```bash
# Создать новую миграцию
docker-compose exec backend python scripts/migrate.py create "описание изменений"

# Применить миграции
docker-compose exec backend python scripts/migrate.py upgrade

# Откатить миграции
docker-compose exec backend python scripts/migrate.py downgrade
```

### Тестирование:

```bash
# Backend тесты
docker-compose exec backend pytest

# Frontend тесты
cd frontend && npm test
```

## 📊 Мониторинг

### Логи:
```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Статус сервисов:
```bash
docker-compose ps
```

### Проверка здоровья:
```bash
curl http://localhost:8000/api/health
```

## 🔒 Безопасность

- JWT токены для аутентификации
- Хеширование паролей (bcrypt)
- CORS настройки
- Rate limiting для API
- Валидация входных данных
- SQL injection защита

## 🚀 Развертывание

### Production настройки:

1. **Измените SECRET_KEY** в .env
2. **Настройте HTTPS** (Let's Encrypt)
3. **Используйте внешнюю БД** (AWS RDS, Google Cloud SQL)
4. **Настройте CDN** для статических файлов
5. **Включите логирование** и мониторинг

### Docker Compose для production:

```bash
# Сборка и запуск
docker-compose -f docker-compose.prod.yml up -d

# Обновление
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Участие в разработке

1. Fork репозитория
2. Создайте feature branch
3. Внесите изменения
4. Добавьте тесты
5. Создайте Pull Request

## 📄 Лицензия

MIT License - см. файл LICENSE

## 🆘 Поддержка

- **Issues:** GitHub Issues
- **Discord:** [Ссылка на Discord сервер]
- **Email:** support@mlcommunity.com

## 🎯 Roadmap

- [ ] Мобильное приложение (React Native)
- [ ] Интеграция с официальным API ML
- [ ] Система турниров
- [ ] Машинное обучение для рекомендаций
- [ ] Мультиязычность
- [ ] PWA возможности
- [ ] Система уведомлений
- [ ] Аналитика и статистика

---

**Создано с ❤️ для сообщества Mobile Legends**