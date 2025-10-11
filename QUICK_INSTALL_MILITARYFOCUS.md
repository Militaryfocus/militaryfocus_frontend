# 🚀 БЫСТРАЯ УСТАНОВКА ДЛЯ MILITARYFOCUS.RU

## 📍 **ВАША ДИРЕКТОРИЯ:**
```bash
cd /var/www/www-root/data/www/militaryfocus.ru/
```

---

## ⚡ **БЫСТРЫЙ СТАРТ (3 СПОСОБА):**

### **Способ 1: Автоматическая установка (РЕКОМЕНДУЕТСЯ)**
```bash
cd /var/www/www-root/data/www/militaryfocus.ru/
chmod +x install-militaryfocus.sh
./install-militaryfocus.sh
```

### **Способ 2: Docker**
```bash
cd /var/www/www-root/data/www/militaryfocus.ru/
chmod +x fix-docker-network.sh
./fix-docker-network.sh
docker-compose up --build -d
```

### **Способ 3: Ручная установка**
```bash
cd /var/www/www-root/data/www/militaryfocus.ru/
chmod +x manual-install.sh
./manual-install.sh
```

---

## 🎯 **РЕЗУЛЬТАТ:**
- **Frontend**: http://militaryfocus.ru
- **Backend API**: http://militaryfocus.ru:8001
- **API Docs**: http://militaryfocus.ru:8001/docs

---

## 🔍 **ПРОВЕРКА:**
```bash
# Проверить API
curl http://militaryfocus.ru:8001/api/health

# Проверить статус сервисов
sudo systemctl status ml-backend
sudo systemctl status nginx
```

---

## 🆘 **ЕСЛИ ЧТО-ТО НЕ РАБОТАЕТ:**
```bash
# Проверить логи
sudo journalctl -u ml-backend -f

# Перезапустить Backend
sudo systemctl restart ml-backend

# Проверить Nginx
sudo nginx -t
sudo systemctl reload nginx
```

**Выберите любой способ и запустите!** 🚀