# ML Community Web Installer

Автоматический веб-установщик для платформы Mobile Legends Community.

## Возможности

- 🔍 **Проверка системных требований** - автоматическая проверка всех необходимых компонентов
- 🗄️ **Настройка базы данных** - автоматическая установка и настройка PostgreSQL
- 🔴 **Настройка Redis** - установка и конфигурация Redis для кэширования
- 👤 **Создание администратора** - настройка первого пользователя системы
- 📊 **Импорт данных** - автоматическая загрузка героев, предметов и примеров гайдов
- 🌐 **Настройка веб-сервера** - автоматическая конфигурация Nginx
- 🔒 **SSL сертификаты** - автоматическое получение SSL через Let's Encrypt
- ⚙️ **Systemd сервисы** - настройка автозапуска всех сервисов
- 📊 **Мониторинг** - создание скриптов мониторинга и логирования

## Системные требования

### Минимальные требования
- Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- 2GB RAM
- 1GB свободного места
- Root доступ или sudo права

### Рекомендуемые требования
- Ubuntu 22.04 LTS
- 4GB RAM
- 10GB свободного места
- Доменное имя (для SSL)

## Быстрый старт

### 1. Запуск установщика

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd ml-community-platform/installer

# Запустите установщик
python3 run_installer.py
```

### 2. Откройте браузер

Перейдите по адресу: http://localhost:5000

### 3. Следуйте инструкциям

Установщик проведет вас через все необходимые шаги:

1. **Проверка требований** - проверка наличия всех компонентов
2. **Настройка базы данных** - подключение к PostgreSQL
3. **Настройка Redis** - подключение к Redis
4. **Создание администратора** - настройка первого пользователя
5. **Импорт данных** - загрузка начальных данных
6. **Автоматическая установка** - полная настройка сервера

## Что устанавливается автоматически

### Системные пакеты
- Python 3.8+ и pip
- PostgreSQL 12+
- Redis 6+
- Nginx
- Node.js 16+ и npm
- Certbot (для SSL)
- Supervisor
- UFW (файрвол)

### Python зависимости
- FastAPI
- SQLAlchemy
- Alembic
- psycopg2
- Redis
- Pydantic
- и другие (см. requirements.txt)

### Node.js зависимости
- React 18
- TypeScript
- Tailwind CSS
- Axios
- React Query
- и другие (см. package.json)

### Сервисы
- PostgreSQL сервер
- Redis сервер
- Nginx веб-сервер
- Backend API (FastAPI)
- Frontend (React)

## Конфигурация

### База данных
- **Хост**: localhost
- **Порт**: 5432
- **База**: ml_community
- **Пользователь**: ml_user
- **Пароль**: ml_password (настраивается)

### Redis
- **Хост**: localhost
- **Порт**: 6379
- **Пароль**: необязательно

### Веб-сервер
- **Frontend**: http://localhost (порт 80)
- **Backend API**: http://localhost/api (прокси на порт 8001)
- **SSL**: автоматически (если указан домен)

## Управление сервисами

После установки вы можете управлять сервисами:

```bash
# Статус всех сервисов
systemctl status ml-community-backend postgresql redis-server nginx

# Перезапуск backend
systemctl restart ml-community-backend

# Просмотр логов
journalctl -u ml-community-backend -f

# Мониторинг
/usr/local/bin/ml-community-monitor.sh
```

## Структура файлов

```
installer/
├── app.py                 # Основное Flask приложение
├── server_setup.py       # Модуль автоматической настройки
├── run_installer.py      # Скрипт запуска
├── requirements.txt      # Python зависимости
├── templates/            # HTML шаблоны
│   ├── base.html
│   ├── index.html
│   ├── step1_requirements.html
│   ├── step2_database.html
│   ├── step3_redis.html
│   ├── step4_admin.html
│   ├── step5_import.html
│   └── step6_complete.html
└── README.md
```

## Безопасность

- Автоматическая настройка файрвола (UFW)
- SSL сертификаты через Let's Encrypt
- Безопасные заголовки Nginx
- Изоляция сервисов через systemd
- Регулярные обновления зависимостей

## Мониторинг

Установщик создает скрипт мониторинга:

```bash
# Запуск мониторинга
/usr/local/bin/ml-community-monitor.sh
```

Скрипт показывает:
- Статус всех сервисов
- Использование диска и памяти
- Последние логи backend
- Общее состояние системы

## Устранение неполадок

### Проблемы с правами
```bash
# Убедитесь, что у вас есть sudo права
sudo -v

# Если нужно, добавьте пользователя в группу sudo
sudo usermod -aG sudo $USER
```

### Проблемы с портами
```bash
# Проверьте, какие порты заняты
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :5432
sudo netstat -tlnp | grep :6379
```

### Проблемы с сервисами
```bash
# Проверьте статус сервисов
systemctl status ml-community-backend
journalctl -u ml-community-backend -n 50

# Перезапустите сервисы
sudo systemctl restart ml-community-backend
sudo systemctl restart nginx
```

## Поддержка

Если у вас возникли проблемы:

1. Проверьте логи установки в веб-интерфейсе
2. Запустите скрипт мониторинга
3. Проверьте статус сервисов
4. Обратитесь к документации проекта

## Лицензия

Этот установщик является частью проекта ML Community Platform и распространяется под той же лицензией.