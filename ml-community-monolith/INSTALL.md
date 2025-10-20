# 🚀 ML Community Platform - Production Ready

## 📋 Единая команда установки

```bash
# Клонирование и установка полной системы
git clone https://github.com/Militaryfocus/militaryfocus_frontend.git && \
cd militaryfocus_frontend && \
git checkout v3.0.0-production-ready && \
cd ml-community-monolith && \
python3 -m venv venv && \
source venv/bin/activate && \
pip install -r requirements.txt && \
python -c "from app.core.database import engine, Base; Base.metadata.create_all(bind=engine)" && \
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 🎯 Что включено в систему

### ✅ Полностью функциональная система включает:

#### 🔐 Система аутентификации:
- Регистрация пользователей с валидацией
- Безопасный вход с управлением сессиями
- Хеширование паролей (pbkdf2_sha256)
- Управление профилем пользователя
- Отслеживание сессий и безопасность
- Функция смены пароля
- Поддержка администраторов

#### 🎮 Управление игровыми данными:
- База данных героев со статистикой
- Управление предметами и эмблемами
- Система гайдов по сборкам
- Комментарии и рейтинги
- Система новостей
- Функция избранного

#### 🌐 Веб-интерфейс:
- Современный адаптивный UI с Tailwind CSS
- Мобильно-дружественный дизайн
- Панель пользователя
- Управление профилем
- Управление сессиями
- Админ-панель

#### 🔧 API система:
- RESTful API endpoints
- JWT аутентификация
- Поддержка CORS
- Мониторинг здоровья
- Валидация данных

#### 🗄️ База данных:
- SQLite для разработки
- PostgreSQL готов для продакшена
- Отслеживание пользовательских сессий
- Полные модели данных
- Поддержка миграций

#### 🛡️ Безопасность:
- Хеширование паролей
- Управление сессиями
- Защита от CSRF
- Валидация ввода
- Защита от SQL-инъекций

## 🚀 Быстрый старт

1. **Установка:**
   ```bash
   git clone https://github.com/Militaryfocus/militaryfocus_frontend.git
   cd militaryfocus_frontend
   git checkout v3.0.0-production-ready
   cd ml-community-monolith
   ```

2. **Настройка окружения:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Инициализация базы данных:**
   ```bash
   python -c "from app.core.database import engine, Base; Base.metadata.create_all(bind=engine)"
   ```

4. **Запуск сервера:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

5. **Открыть в браузере:**
   ```
   http://localhost:8000
   ```

## 📱 Доступные маршруты

### Веб-интерфейс:
- `/` - Главная страница
- `/register` - Регистрация
- `/login` - Вход
- `/logout` - Выход
- `/profile` - Профиль пользователя
- `/profile/edit` - Редактирование профиля
- `/profile/sessions` - Управление сессиями
- `/profile/change-password` - Смена пароля

### API:
- `/api/health` - Проверка здоровья API
- `/api/v1/heroes` - Список героев
- `/api/v1/items` - Список предметов
- `/api/v1/emblems` - Список эмблем
- `/api/v1/guides` - Гайды по сборкам
- `/api/v1/news` - Новости

## 🔧 Конфигурация

### Переменные окружения (.env):
```env
DATABASE_URL=sqlite:///./ml_community.db
SECRET_KEY=your-secret-key-here
DEBUG=True
```

### Для продакшена:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ml_community
SECRET_KEY=your-production-secret-key
DEBUG=False
```

## 🎉 Готово к использованию!

Система полностью готова к развертыванию и использованию. Все компоненты протестированы и работают корректно.

**Версия:** v3.0.0-production-ready  
**Статус:** ✅ Production Ready  
**Дата:** 2025-10-20