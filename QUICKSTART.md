# 🎮 Mobile Legends Community Platform - Готов к запуску!

## ✅ Что создано

Полнофункциональная платформа для фан-сообщества Mobile Legends: Bang Bang со всеми требуемыми модулями:

### 🏗️ Архитектура
- **Backend:** FastAPI + Python 3.9+ с PostgreSQL и Redis
- **Frontend:** React 18 + TypeScript + Tailwind CSS
- **База данных:** PostgreSQL с миграциями Alembic
- **Кэширование:** Redis для производительности
- **Поиск:** Elasticsearch (опционально)
- **Контейнеризация:** Docker + Docker Compose

### 📋 Модули системы

1. **✅ Аутентификация и пользователи**
   - Регистрация через email
   - JWT токены
   - Система ролей (User, Content Creator, Moderator, Admin)
   - Профиль игрока (IGN, ранг, main heroes)

2. **✅ Герои**
   - Полный каталог героев
   - Детальные характеристики и навыки
   - Статистика (win rate, pick rate, ban rate)
   - Контрпики и синергии
   - Поиск и фильтрация

3. **✅ Гайды и сборки**
   - Создание/редактирование гайдов
   - Система рейтингов и комментариев
   - Версионность гайдов
   - Теги и фильтрация по сложности/стилю игры

4. **✅ Поиск**
   - Универсальный поиск по платформе
   - Автодополнение с предложениями
   - Фильтрация результатов
   - Поиск по героям, гайдам, пользователям

5. **✅ Новости и события**
   - Новости игры
   - События сообщества
   - Категории и теги
   - Система просмотров

6. **✅ API**
   - Полная REST API документация
   - Swagger UI и ReDoc
   - Аутентификация и авторизация
   - Валидация данных

## 🚀 Быстрый запуск

### 1. Автоматическая установка (рекомендуется)
```bash
# Сделать скрипт исполняемым и запустить
chmod +x scripts/install.sh
./scripts/install.sh
```

### 2. Ручной запуск
```bash
# Запустить все сервисы
docker-compose up -d

# Дождаться запуска (30-45 секунд)
sleep 45

# Применить миграции
docker-compose exec backend alembic upgrade head

# Создать администратора
docker-compose exec backend python scripts/create_admin.py

# Загрузить примеры героев
docker-compose exec backend python scripts/import_heroes.py
```

## 🌐 Доступ к сервисам

После запуска платформа будет доступна по адресам:

- **🌐 Фронтенд:** http://localhost
- **🔧 API:** http://localhost:8000
- **📊 API Docs:** http://localhost:8000/docs
- **📈 ReDoc:** http://localhost:8000/redoc
- **🗄️ База данных:** localhost:5432
- **⚡ Redis:** localhost:6379
- **🔍 Elasticsearch:** localhost:9200 (опционально)

## 👤 Демо аккаунт

После установки будет создан администратор:
- **Логин:** admin
- **Пароль:** admin123
- **Email:** admin@mlcommunity.com

## 📁 Структура проекта

```
ml-community-platform/
├── backend/                 # FastAPI бекенд
│   ├── app/
│   │   ├── api/v1/         # API endpoints
│   │   ├── models/         # SQLAlchemy модели
│   │   ├── schemas/        # Pydantic схемы
│   │   ├── crud/           # CRUD операции
│   │   ├── core/           # Конфигурация
│   │   └── main.py         # Главный файл
│   ├── scripts/            # Скрипты управления
│   ├── alembic/            # Миграции БД
│   └── requirements.txt    # Python зависимости
├── frontend/               # React фронтенд
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/          # Страницы
│   │   ├── services/       # API сервисы
│   │   ├── types/          # TypeScript типы
│   │   └── App.tsx         # Главный компонент
│   ├── public/             # Статические файлы
│   └── package.json        # Node.js зависимости
├── scripts/                # Скрипты установки
├── docker-compose.yml      # Docker конфигурация
├── .env                    # Переменные окружения
└── README.md              # Документация
```

## 🛠️ Управление

### Остановка сервисов
```bash
docker-compose down
```

### Просмотр логов
```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Обновление
```bash
# Остановить сервисы
docker-compose down

# Обновить образы
docker-compose pull

# Запустить заново
docker-compose up -d
```

### Резервное копирование БД
```bash
docker-compose exec db pg_dump -U ml_user ml_community > backup.sql
```

### Восстановление БД
```bash
docker-compose exec -T db psql -U ml_user ml_community < backup.sql
```

## 🔧 Разработка

### Backend разработка
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend разработка
```bash
cd frontend
npm install
npm start
```

### Создание миграций
```bash
docker-compose exec backend python scripts/migrate.py create "описание изменений"
```

## 📊 Мониторинг

### Проверка здоровья
```bash
curl http://localhost:8000/api/health
```

### Статус сервисов
```bash
docker-compose ps
```

### Использование ресурсов
```bash
docker stats
```

## 🎯 Следующие шаги

1. **Настройте production окружение:**
   - Измените SECRET_KEY в .env
   - Настройте HTTPS
   - Используйте внешнюю БД

2. **Добавьте данные:**
   - Импортируйте реальные данные героев
   - Создайте контент и гайды
   - Настройте медиа файлы

3. **Расширьте функциональность:**
   - Добавьте мобильное приложение
   - Интегрируйте с официальным API ML
   - Реализуйте систему турниров

## 🆘 Поддержка

Если возникли проблемы:

1. Проверьте логи: `docker-compose logs`
2. Убедитесь, что все порты свободны
3. Проверьте системные требования
4. Перезапустите сервисы: `docker-compose restart`

## 🎉 Готово!

Платформа Mobile Legends Community полностью готова к использованию! 

**Наслаждайтесь разработкой и игрой! 🎮**