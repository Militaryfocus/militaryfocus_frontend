#!/bin/bash

echo "🔧 Исправление проблем с Docker и сетью..."

# Остановить все контейнеры
echo "⏹️ Останавливаем контейнеры..."
docker-compose down 2>/dev/null || true

# Очистить Docker кэш
echo "🧹 Очищаем Docker кэш..."
docker system prune -f
docker builder prune -f

# Создать .dockerignore для backend
echo "📝 Создаем .dockerignore для backend..."
cat > backend/.dockerignore << 'EOF'
__pycache__
*.pyc
*.pyo
*.pyd
.Python
env
pip-log.txt
pip-delete-this-directory.txt
.tox
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git
.mypy_cache
.pytest_cache
.hypothesis
.DS_Store
.vscode
.idea
*.swp
*.swo
*~
EOF

# Создать .dockerignore для frontend
echo "📝 Создаем .dockerignore для frontend..."
cat > frontend/.dockerignore << 'EOF'
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.git
.gitignore
README.md
.env
.nyc_output
coverage
.DS_Store
.vscode
.idea
*.swp
*.swo
*~
EOF

# Обновить docker-compose.yml с правильными контекстами
echo "🔧 Обновляем docker-compose.yml..."
cat > docker-compose.yml << 'EOF'
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8001:8001"
    environment:
      - DATABASE_URL=postgresql://ml_user:ml_password@postgres:5432/ml_community
      - REDIS_URL=redis://redis:6379
      - SECRET_KEY=your-secret-key-change-in-production
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=http://localhost:8001/api/v1
    depends_on:
      - backend
    restart: unless-stopped

  postgres:
    image: postgres:13-alpine
    environment:
      - POSTGRES_DB=ml_community
      - POSTGRES_USER=ml_user
      - POSTGRES_PASSWORD=ml_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
EOF

echo "✅ Исправления применены!"
echo "🚀 Теперь попробуйте: docker-compose up --build"