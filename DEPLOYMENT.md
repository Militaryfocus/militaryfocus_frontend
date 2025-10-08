# 📦 Mobile Legends Community Platform - Архив для развертывания

## 📋 Содержимое архива

Архив `ml-community-platform.zip` содержит полную платформу для фан-сообщества Mobile Legends:

### 🏗️ Структура проекта
```
ml-community-platform/
├── 📁 backend/              # FastAPI бекенд
│   ├── app/                 # Основное приложение
│   ├── scripts/             # Скрипты управления
│   ├── alembic/             # Миграции БД
│   └── requirements.txt     # Python зависимости
├── 📁 frontend/             # React фронтенд
│   ├── src/                 # Исходный код
│   ├── public/              # Статические файлы
│   └── package.json         # Node.js зависимости
├── 📁 scripts/              # Скрипты установки
├── 📄 docker-compose.yml    # Docker конфигурация
├── 📄 docker-compose.prod.yml # Production конфигурация
├── 📄 .env.example          # Шаблон переменных окружения
├── 📄 .env.production       # Production настройки
├── 📄 README.md             # Основная документация
├── 📄 QUICKSTART.md         # Быстрый старт
└── 📄 CONTRIBUTING.md       # Правила участия
```

## 🚀 Развертывание на сервере

### Вариант 1: Автоматическое развертывание

1. **Загрузите архив на сервер:**
   ```bash
   scp ml-community-platform.zip user@your-server-ip:~/
   ```

2. **Подключитесь к серверу:**
   ```bash
   ssh user@your-server-ip
   ```

3. **Распакуйте и запустите:**
   ```bash
   unzip ml-community-platform.zip
   cd ml-community-platform
   cp .env.example .env
   # Отредактируйте .env при необходимости
   chmod +x scripts/install.sh
   ./scripts/install.sh
   ```

### Вариант 2: Ручное развертывание

1. **Распакуйте архив:**
   ```bash
   unzip ml-community-platform.zip
   cd ml-community-platform
   ```

2. **Настройте окружение:**
   ```bash
   cp .env.example .env
   nano .env  # Отредактируйте настройки
   ```

3. **Запустите через Docker:**
   ```bash
   # Для разработки
   docker-compose up -d
   
   # Для продакшена
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Примените миграции:**
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

5. **Создайте администратора:**
   ```bash
   docker-compose exec backend python scripts/create_admin.py
   ```

6. **Загрузите данные героев:**
   ```bash
   docker-compose exec backend python scripts/import_heroes.py
   ```

## 🌐 Доступ к приложению

После успешного развертывания:

- **🌐 Фронтенд:** http://your-server-ip
- **🔧 API:** http://your-server-ip:8000
- **📊 API Docs:** http://your-server-ip:8000/docs
- **📈 ReDoc:** http://your-server-ip:8000/redoc

## 👤 Демо аккаунт

- **Логин:** admin
- **Пароль:** admin123
- **Email:** admin@mlcommunity.com

## 🔧 Настройка для продакшена

### 1. Измените переменные окружения:
```bash
# В файле .env
SECRET_KEY=your-very-secure-secret-key
DEBUG=false
ENVIRONMENT=production
BACKEND_CORS_ORIGINS=["https://yourdomain.com"]
```

### 2. Настройте домен:
```bash
# Обновите настройки в .env
DOMAIN=yourdomain.com
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

### 3. Настройте HTTPS (рекомендуется):
```bash
# Используйте Let's Encrypt
sudo apt install certbot
sudo certbot --nginx -d yourdomain.com
```

## 📊 Мониторинг

### Проверка статуса:
```bash
docker-compose ps
```

### Просмотр логов:
```bash
docker-compose logs -f
```

### Проверка здоровья:
```bash
curl http://localhost:8000/api/health
```

## 🛠️ Управление

### Остановка:
```bash
docker-compose down
```

### Перезапуск:
```bash
docker-compose restart
```

### Обновление:
```bash
docker-compose pull
docker-compose up -d
```

### Резервное копирование БД:
```bash
docker-compose exec db pg_dump -U ml_user ml_community > backup.sql
```

## 🆘 Поддержка

Если возникли проблемы:

1. **Проверьте логи:** `docker-compose logs`
2. **Проверьте статус:** `docker-compose ps`
3. **Проверьте порты:** `netstat -tlnp`
4. **Перезапустите:** `docker-compose restart`

## 📞 Контакты

- **GitHub:** https://github.com/Militaryfocus/Baga
- **Issues:** https://github.com/Militaryfocus/Baga/issues
- **Discussions:** https://github.com/Militaryfocus/Baga/discussions

---

**🎮 Наслаждайтесь использованием Mobile Legends Community Platform!**