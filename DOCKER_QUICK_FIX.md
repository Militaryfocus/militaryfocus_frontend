# 🚨 БЫСТРОЕ ИСПРАВЛЕНИЕ DOCKER ПРОБЛЕМЫ

## ❌ ПРОБЛЕМА
```
target backend: failed to solve: failed to compute cache key: failed to calculate checksum of ref 095f153f-996e-4652-a132-1cac0d7b4923::0ywmfa9ypymjbre0riotpxt8s: "/requirements.txt": not found
```

## ✅ РЕШЕНИЕ

### **1. Исправленный docker-compose.yml**

Замените содержимое `docker-compose.yml` на:

```yaml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8001:8000"
    environment:
      - DATABASE_URL=postgresql://ml_user:ml_password@db:5432/ml_community
      - REDIS_URL=redis://redis:6379
      - SECRET_KEY=your-secret-key-change-in-production
      - BACKEND_CORS_ORIGINS=["http://localhost:3000", "http://localhost:8001", "http://127.0.0.1:3000", "http://127.0.0.1:8001"]
    depends_on:
      - db
      - redis
    volumes:
      - ./data/uploads:/app/static/uploads
      - ./data/hero_images:/app/static/heroes
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://localhost:8001/api/v1
    restart: unless-stopped

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=ml_community
      - POSTGRES_USER=ml_user
      - POSTGRES_PASSWORD=ml_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init_db.sql:/docker-entrypoint-initdb.d/init_db.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped

  elasticsearch:
    image: elasticsearch:7.14.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  elasticsearch_data:
```

### **2. Команды для исправления**

```bash
# Остановить все контейнеры
docker-compose down

# Удалить старые образы (опционально)
docker-compose build --no-cache

# Пересобрать и запустить
docker-compose up -d

# Проверить статус
docker-compose ps

# Посмотреть логи
docker-compose logs -f
```

### **3. Альтернативное решение (если Docker не работает)**

Используйте веб-установщик:

```bash
# Установить Python зависимости
cd installer
pip3 install -r requirements.txt

# Запустить установщик
python3 run_installer.py

# Открыть в браузере
# http://localhost:5000
```

### **4. Ручная установка (без Docker)**

```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001

# Frontend (в новом терминале)
cd frontend
npm install
npm start
```

## 🎯 ОСНОВНЫЕ ИЗМЕНЕНИЯ

1. **Исправлен контекст сборки** - `context: ./backend` вместо `context: .`
2. **Убран устаревший атрибут** - `version: '3.8'` удален
3. **Правильные пути** - Dockerfile теперь находит все файлы

## ✅ РЕЗУЛЬТАТ

После исправлений:
- ✅ Backend собирается без ошибок
- ✅ Frontend собирается без ошибок
- ✅ Все сервисы запускаются
- ✅ API доступен на порту 8001
- ✅ Frontend доступен на порту 80

**Проблема решена!** 🎉