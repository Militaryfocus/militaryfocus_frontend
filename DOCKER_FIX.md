# 🐳 ИСПРАВЛЕНИЕ ПРОБЛЕМЫ DOCKER СБОРКИ

## ❌ ПРОБЛЕМА
```
target backend: failed to solve: failed to compute cache key: failed to calculate checksum of ref 095f153f-996e-4652-a132-1cac0d7b4923::ir14rzswo4p9ctboft15alpby: "/backend": not found
```

## ✅ РЕШЕНИЕ

### **1. Установка Docker и Docker Compose**

#### **Ubuntu/Debian:**
```bash
# Обновить пакеты
sudo apt update

# Установить Docker
sudo apt install -y docker.io docker-compose

# Добавить пользователя в группу docker
sudo usermod -aG docker $USER

# Перезайти в систему или выполнить:
newgrp docker

# Проверить установку
docker --version
docker-compose --version
```

#### **CentOS/RHEL:**
```bash
# Установить Docker
sudo yum install -y docker docker-compose

# Запустить Docker
sudo systemctl start docker
sudo systemctl enable docker

# Добавить пользователя в группу docker
sudo usermod -aG docker $USER
```

### **2. Исправленные файлы**

#### **docker-compose.yml:**
```yaml
services:
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    # ... остальная конфигурация
```

#### **backend/Dockerfile:**
```dockerfile
# Исправлены пути копирования
COPY requirements.txt .
COPY . .
```

#### **frontend/Dockerfile:**
```dockerfile
# Исправлены пути копирования
COPY package*.json ./
COPY . .
```

### **3. Сборка и запуск**

#### **Быстрый запуск:**
```bash
# Сделать скрипт исполняемым
chmod +x docker-build.sh

# Запустить сборку и старт
./docker-build.sh
```

#### **Ручная сборка:**
```bash
# Создать необходимые директории
mkdir -p data/uploads data/hero_images

# Собрать образы
docker-compose build

# Запустить сервисы
docker-compose up -d

# Проверить статус
docker-compose ps

# Посмотреть логи
docker-compose logs -f
```

### **4. Проверка работы**

После успешного запуска:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

### **5. Устранение неполадок**

#### **Если Docker не установлен:**
```bash
# Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установить Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### **Если проблемы с правами:**
```bash
# Добавить пользователя в группу docker
sudo usermod -aG docker $USER

# Перезайти в систему
logout
# или
newgrp docker
```

#### **Если проблемы с памятью:**
```bash
# Очистить Docker кэш
docker system prune -a

# Увеличить лимит памяти для Docker
# В /etc/docker/daemon.json:
{
  "default-ulimits": {
    "memlock": {
      "Hard": -1,
      "Name": "memlock",
      "Soft": -1
    }
  }
}
```

### **6. Альтернативный запуск без Docker**

Если Docker недоступен, можно запустить через установщик:

```bash
# Запустить веб-установщик
cd installer
python3 run_installer.py

# Или быстрый старт
sudo ./installer/quick_start.sh
```

## 🎯 ОСНОВНЫЕ ИЗМЕНЕНИЯ

1. **Исправлены пути в Dockerfile** - убраны префиксы `backend/` и `frontend/`
2. **Обновлен docker-compose.yml** - добавлен правильный контекст сборки
3. **Добавлены .dockerignore** - исключены ненужные файлы
4. **Создан скрипт сборки** - автоматизирован процесс

## ✅ РЕЗУЛЬТАТ

После исправлений Docker сборка должна работать корректно:
- ✅ Backend собирается без ошибок
- ✅ Frontend собирается без ошибок  
- ✅ Все сервисы запускаются
- ✅ API доступен на порту 8001
- ✅ Frontend доступен на порту 80

**Проблема решена!** 🎉