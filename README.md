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

### Одна команда для настройки базы данных

```bash
# Настройка базы данных одной командой
./setup_database.sh
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

## 🎯 Модули платформы

### 🦸 Герои
- **База данных героев** - Полная информация о всех героях Mobile Legends
- **Характеристики** - Статы, роли, сложность, специализация
- **Навыки** - Пассивные, активные и ультимейт способности
- **Контрпики и синергии** - Система взаимоотношений между героями
- **Статистика** - Винрейты, пикрейты, банрейты

### 📚 Гайды
- **Сборки предметов** - Оптимальные билды для каждого героя
- **Эмблимы** - Настройка талантов и эмблимов
- **Стратегии** - Игровые тактики и советы
- **Конструктор гайдов** - Создание собственных гайдов
- **Рейтинговая система** - Оценка и отзывы на гайды

### 📰 Новости
- **Актуальные события** - Последние новости и обновления
- **Турниры** - Информация о соревнованиях
- **Обновления игры** - Патч-ноты и изменения
- **Сообщество** - Новости от пользователей

### 🔍 Поиск
- **Умный поиск** - Поиск по героям, гайдам, новостям
- **Фильтры** - Расширенные возможности фильтрации
- **Автодополнение** - Подсказки при вводе
- **История поиска** - Сохранение предыдущих запросов

### 👤 Профиль пользователя
- **Личный кабинет** - Управление аккаунтом
- **Мои гайды** - Созданные пользователем гайды
- **Статистика** - Персональная статистика
- **Настройки** - Конфигурация профиля

## 🛠️ Технические возможности

- **REST API** - Полнофункциональное API для интеграций
- **Real-time обновления** - Мгновенные обновления данных
- **Мобильная адаптация** - Оптимизация для всех устройств
- **PWA поддержка** - Возможность установки как приложение
- **SEO оптимизация** - Поисковая оптимизация
- **Кэширование** - Быстрая загрузка контента

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
GET    /api/v1/users               # Список пользователей (admin)
GET    /api/v1/users/{id}          # Профиль пользователя
PUT    /api/v1/users/{id}          # Обновить профиль
GET    /api/v1/users/{id}/guides   # Гайды пользователя
GET    /api/v1/users/{id}/stats    # Статистика пользователя
POST   /api/v1/users/{id}/verify   # Верифицировать (admin)
POST   /api/v1/users/{id}/change-role # Изменить роль (admin)

# Аутентификация
POST   /api/v1/auth/login          # Вход
POST   /api/v1/auth/register       # Регистрация
GET    /api/v1/auth/me             # Текущий пользователь
POST   /api/v1/auth/refresh        # Обновить токен
POST   /api/v1/auth/logout         # Выход
POST   /api/v1/auth/forgot-password # Восстановление пароля
POST   /api/v1/auth/reset-password  # Сброс пароля

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
   - ✅ Регистрация с валидацией
   - ✅ Вход через JWT
   - ✅ Личный кабинет со статистикой
   - ✅ Система ролей (User, Content Creator, Moderator, Admin)
   - 📖 [Документация](./AUTH_DOCUMENTATION.md)

2. **Герои**
   - Полный каталог героев (120+ персонажей)
   - Детальные характеристики и навыки
   - Сравнение героев
   - Контрпики и синергии

3. **Гайды и сборки** ✨ NEW!
   - ✅ **Guide Builder** - Визуальный конструктор гайдов
     - Выбор героя с поиском
     - Настройка эмблем (тип, уровень, таланты)
     - Сборка предметов (early/mid/late game)
     - Боевые заклинания
     - Теги и категоризация
     - Сохранение черновиков
   - ✅ **Rating & Like System** - Система оценок
     - Рейтинг 1-5 звезд с отзывами
     - Лайки/анлайки
     - Статистика просмотров
     - Расчет среднего рейтинга
   - ✅ Версионность гайдов
   - ✅ Фильтрация по сложности, стилю, героям
   - 📖 [Подробная документация](./FEATURES_v1.2.0.md)

4. **Поиск**
   - Универсальный поиск по платформе
   - Автодополнение
   - Фильтрация результатов

5. **Новости и события**
   - Новости игры
   - События сообщества
   - Патч notes

6. **Admin Panel** ✨ NEW!
   - ✅ **Управление пользователями**
     - Верификация пользователей
     - Смена ролей
     - Активация/деактивация
   - ✅ **Управление контентом**
     - Модерация гайдов
     - Редактирование и удаление
   - ✅ **Статистика платформы**
     - Пользователи, гайды, просмотры
     - Быстрые действия
   - 🔒 Доступ только для Admin и Moderator

7. **Statistics Dashboard** ✨ NEW!
   - ✅ **Обзор платформы**
     - Карточки с ключевыми метриками
     - Графики и диаграммы
   - ✅ **Топ-рейтинги**
     - Топ героев по гайдам
     - Топ гайдов по просмотрам/рейтингу/лайкам
   - ✅ **Распределения**
     - Гайды по сложности
     - Герои по ролям
     - Пользователи по ролям
   - 📊 Доступно всем пользователям

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

### Реализовано:
- ✅ **JWT токены** для аутентификации (30 минут срок действия)
- ✅ **Хеширование паролей** (bcrypt через passlib)
- ✅ **CORS настройки** для защиты от XSS
- ✅ **Валидация входных данных** (Pydantic)
- ✅ **SQL injection защита** (SQLAlchemy ORM)
- ✅ **Система ролей** и прав доступа
- ✅ **Автоматическая обработка** истекших токенов

### Рекомендуется для Production:
- 🔄 Rate limiting для API endpoints
- 🔄 HTTPS/SSL сертификаты (Let's Encrypt)
- 🔄 Email верификация при регистрации
- 🔄 2FA (двухфакторная аутентификация)
- 🔄 Логирование попыток входа
- 🔄 httpOnly cookies для токенов

📖 **[Полная документация по безопасности](./AUTH_DOCUMENTATION.md#безопасность)**

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

## 📖 Документация

- **[Аутентификация и авторизация](./AUTH_DOCUMENTATION.md)** - Полное руководство по системе аутентификации
- **[API Документация](http://localhost:8000/docs)** - Swagger UI (после запуска)
- **[Deployment Guide](./DEPLOYMENT.md)** - Инструкции по развертыванию
- **[Contributing](./CONTRIBUTING.md)** - Руководство для разработчиков

## 📄 Лицензия

MIT License - см. файл LICENSE

## 🆘 Поддержка

- **Issues:** GitHub Issues
- **Discord:** [Ссылка на Discord сервер]
- **Email:** support@mlcommunity.com

## 🎯 Roadmap

### ✅ Версия 1.2.0 (Текущая)
- ✅ Полная система аутентификации и регистрации
- ✅ Личный кабинет пользователя
- ✅ Статистика пользователей
- ✅ Управление профилем
- ✅ Система ролей и прав доступа

### 🔜 Планируется
- [ ] Email верификация при регистрации
- [ ] Восстановление пароля через email
- [ ] Мобильное приложение (React Native)
- [ ] Интеграция с официальным API ML
- [ ] Система турниров
- [ ] Машинное обучение для рекомендаций
- [ ] Мультиязычность
- [ ] PWA возможности
- [ ] Система уведомлений (push, email)
- [ ] Расширенная аналитика и статистика
- [ ] Социальные функции (друзья, сообщения)

---

**Создано с ❤️ для сообщества Mobile Legends**