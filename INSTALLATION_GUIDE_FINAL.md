# 🚀 ФИНАЛЬНАЯ ИНСТРУКЦИЯ ПО УСТАНОВКЕ

## ❌ **ВАША ПРОБЛЕМА:**
```
docker: command not found
Connection timed out [IP: 199.232.174.132 80]
```

## ✅ **РЕШЕНИЯ:**

### **СПОСОБ 1: УСТАНОВИТЬ DOCKER (РЕКОМЕНДУЕТСЯ)**

```bash
# 1. Установить Docker
sudo apt-get update
sudo apt-get install -y docker.io docker-compose

# 2. Запустить Docker
sudo systemctl start docker
sudo systemctl enable docker

# 3. Добавить пользователя в группу
sudo usermod -aG docker $USER
newgrp docker

# 4. Исправить проблемы с Docker
cd /workspace
./fix-docker-network.sh

# 5. Запустить проект
docker-compose up --build
```

### **СПОСОБ 2: РУЧНАЯ УСТАНОВКА (БЕЗ DOCKER)**

```bash
# Запустить автоматическую ручную установку
cd /workspace
./manual-install.sh
```

### **СПОСОБ 3: БЫСТРАЯ УСТАНОВКА DOCKER**

```bash
# Установить Docker одной командой
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Затем запустить проект
cd /workspace
./fix-docker-network.sh
docker-compose up --build
```

---

## 🎯 **РЕКОМЕНДУЕМЫЙ ПОРЯДОК ДЕЙСТВИЙ:**

### **1. Попробуйте быструю установку Docker:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
```

### **2. Если Docker установился:**
```bash
cd /workspace
./fix-docker-network.sh
docker-compose up --build
```

### **3. Если Docker не установился:**
```bash
cd /workspace
./manual-install.sh
```

---

## 🔍 **ПРОВЕРКА УСТАНОВКИ:**

### **После установки Docker:**
```bash
# Проверить Docker
docker --version
docker-compose --version

# Проверить контейнеры
docker-compose ps

# Открыть в браузере:
# http://localhost (Frontend)
# http://localhost:8001 (Backend)
```

### **После ручной установки:**
```bash
# Проверить сервисы
sudo systemctl status ml-backend
sudo systemctl status postgresql
sudo systemctl status redis
sudo systemctl status nginx

# Открыть в браузере:
# http://localhost (Frontend)
# http://localhost:8001 (Backend)
```

---

## 🆘 **ЕСЛИ НИЧЕГО НЕ РАБОТАЕТ:**

### **1. Проверить систему:**
```bash
# Версия ОС
lsb_release -a

# Архитектура
uname -m

# Свободное место
df -h

# Память
free -h
```

### **2. Проверить порты:**
```bash
# Какие порты заняты
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :8001
sudo netstat -tlnp | grep :5432
```

### **3. Проверить логи:**
```bash
# Docker логи
docker-compose logs

# Systemd логи
sudo journalctl -u ml-backend
sudo journalctl -u nginx
```

---

## 📞 **ПОДДЕРЖКА:**

### **Файлы помощи:**
- `DOCKER_INSTALL_GUIDE.md` - Подробная установка Docker
- `fix-docker-network.sh` - Исправление проблем Docker
- `manual-install.sh` - Ручная установка без Docker

### **Полезные команды:**
```bash
# Очистка Docker
docker system prune -a

# Перезапуск сервисов
sudo systemctl restart ml-backend
sudo systemctl restart nginx

# Проверка конфигурации
sudo nginx -t
```

---

## 🎉 **ОЖИДАЕМЫЙ РЕЗУЛЬТАТ:**

После успешной установки вы увидите:
- ✅ Frontend доступен по http://localhost
- ✅ Backend API доступен по http://localhost:8001
- ✅ API документация по http://localhost:8001/docs
- ✅ Все сервисы работают стабильно

**Выберите один из способов и следуйте инструкциям!** 🚀