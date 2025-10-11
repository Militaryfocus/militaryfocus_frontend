# 🐳 ИНСТРУКЦИЯ ПО УСТАНОВКЕ DOCKER

## ❌ **ПРОБЛЕМА:**
```
docker: command not found
```

## ✅ **РЕШЕНИЕ:**

### **1. Установка Docker на Ubuntu/Debian:**
```bash
# Обновить пакеты
sudo apt-get update

# Установить необходимые пакеты
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Добавить официальный GPG ключ Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Добавить репозиторий Docker
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Обновить пакеты
sudo apt-get update

# Установить Docker
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Запустить Docker
sudo systemctl start docker
sudo systemctl enable docker

# Добавить пользователя в группу docker
sudo usermod -aG docker $USER

# Перелогиниться или выполнить:
newgrp docker

# Проверить установку
docker --version
```

### **2. Установка Docker Compose:**
```bash
# Скачать Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Сделать исполняемым
sudo chmod +x /usr/local/bin/docker-compose

# Проверить установку
docker-compose --version
```

### **3. Альтернативная установка (простая):**
```bash
# Установить Docker из репозитория Ubuntu
sudo apt-get update
sudo apt-get install -y docker.io docker-compose

# Запустить Docker
sudo systemctl start docker
sudo systemctl enable docker

# Добавить пользователя в группу
sudo usermod -aG docker $USER
newgrp docker

# Проверить
docker --version
docker-compose --version
```

---

## 🚀 **ПОСЛЕ УСТАНОВКИ DOCKER:**

### **1. Запустить исправления:**
```bash
cd /workspace
./fix-docker-network.sh
```

### **2. Собрать и запустить проект:**
```bash
docker-compose up --build
```

### **3. Проверить работу:**
- Frontend: http://localhost
- Backend: http://localhost:8001
- API Docs: http://localhost:8001/docs

---

## 🔧 **АЛЬТЕРНАТИВНЫЕ СПОСОБЫ УСТАНОВКИ**

### **Способ 1: Без Docker (ручная установка)**
```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001

# Frontend
cd frontend
npm install --legacy-peer-deps
npm run build
# Разместить build/ в веб-сервере
```

### **Способ 2: Использовать готовые образы**
```bash
# Если Docker установлен, но есть проблемы с сборкой
docker pull python:3.9-slim
docker pull node:18-alpine
docker pull postgres:13-alpine
docker pull redis:6-alpine
```

### **Способ 3: Использовать Podman (альтернатива Docker)**
```bash
# Установить Podman
sudo apt-get install -y podman

# Использовать podman-compose вместо docker-compose
alias docker=podman
alias docker-compose=podman-compose
```

---

## 🆘 **ЕСЛИ НИЧЕГО НЕ ПОМОГАЕТ:**

### **1. Проверить права доступа:**
```bash
# Проверить группы пользователя
groups $USER

# Если docker не в списке:
sudo usermod -aG docker $USER
# Перезайти в систему
```

### **2. Проверить статус Docker:**
```bash
sudo systemctl status docker
sudo systemctl restart docker
```

### **3. Проверить логи:**
```bash
sudo journalctl -u docker.service
```

---

## 📞 **ПОДДЕРЖКА:**

Если у вас все еще проблемы:
1. Проверьте версию ОС: `lsb_release -a`
2. Проверьте архитектуру: `uname -m`
3. Попробуйте альтернативные способы установки
4. Используйте ручную установку без Docker

**Главное - Docker должен быть установлен для автоматической установки!** 🐳