# 🔧 Исправление проблемы с Alembic

## Проблема
При запуске `alembic upgrade head` возникает ошибка:
```
configparser.InterpolationSyntaxError: '%' must be followed by '%' or '(', found: '%04d'
```

## Причина
В файле `alembic.ini` строка `version_num_format = %04d` содержит неправильный синтаксис интерполяции. В файлах конфигурации Python символ `%` нужно экранировать как `%%`.

## Решение

### Автоматическое исправление
```bash
# Запустите скрипт исправления
./fix_and_run_migrations.sh
```

### Ручное исправление
1. Откройте файл `alembic.ini`
2. Найдите строку: `version_num_format = %04d`
3. Замените на: `version_num_format = %%04d`
4. Сохраните файл

## Запуск приложения

### После исправления
```bash
# Запустите приложение
./start_app.sh
```

### Или вручную
```bash
# Активируйте виртуальное окружение
source venv/bin/activate

# Запустите миграции
alembic upgrade head

# Запустите приложение
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Проверка работы

После запуска приложение будет доступно по адресам:
- **Главная страница**: http://localhost:8000
- **API документация**: http://localhost:8000/api/docs
- **Проверка здоровья**: http://localhost:8000/health

## Создание администратора

Скрипт автоматически создаст администратора:
- **Логин**: admin
- **Пароль**: admin123
- **Email**: admin@militaryfocus.ru

## Структура проекта

```
ml-community-monolith/
├── app/
│   ├── main.py              # Главный файл FastAPI
│   ├── models.py            # SQLAlchemy модели
│   ├── routers.py           # FastAPI роуты
│   ├── auth.py              # Аутентификация
│   ├── core/
│   │   ├── config.py        # Конфигурация
│   │   └── database.py      # Настройка БД
│   ├── templates/           # HTML шаблоны
│   └── static/              # Статические файлы
├── alembic/                 # Миграции БД
├── fix_and_run_migrations.sh # Скрипт исправления
├── start_app.sh             # Скрипт запуска
└── .env                     # Переменные окружения
```

## Возможные проблемы

### 1. Ошибка подключения к базе данных
```bash
# Проверьте, что PostgreSQL запущен
sudo systemctl status postgresql

# Проверьте подключение
psql -U ml_admin -d ml_community -h localhost
```

### 2. Ошибка виртуального окружения
```bash
# Создайте виртуальное окружение
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Ошибка прав доступа
```bash
# Сделайте скрипты исполняемыми
chmod +x fix_and_run_migrations.sh
chmod +x start_app.sh
```

## Логи

Для просмотра логов приложения:
```bash
# Логи uvicorn
tail -f app/logs/app.log

# Логи системы
journalctl -u your-service-name -f
```

## Остановка приложения

```bash
# Нажмите Ctrl+C в терминале где запущено приложение
# Или найдите процесс и завершите его
ps aux | grep uvicorn
kill <PID>
```

## Перезапуск

```bash
# Остановите приложение (Ctrl+C)
# Запустите заново
./start_app.sh
```

---

**🎯 ML Community Platform - Монолитная версия готова к работе!**