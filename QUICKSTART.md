# 🚀 Military Focus - Быстрый старт

**Установка и запуск за 3 минуты!**

## ⚡ Супер быстрый старт

### 1. Скачайте и запустите
```bash
wget https://raw.githubusercontent.com/Militaryfocus/militaryfocus_frontend/main/installer/one_click_install.sh
chmod +x one_click_install.sh
./one_click_install.sh
```

### 2. Готово! 🎉
- Установщик автоматически откроется в браузере
- Следуйте инструкциям на экране
- Всё настроится автоматически

## 🎯 Что происходит автоматически

1. **Проверка системы** - проверяются все требования
2. **Установка зависимостей** - Python, Node.js, PostgreSQL, Redis
3. **Настройка базы данных** - создание пользователей и БД
4. **Сборка приложения** - frontend и backend
5. **Запуск сервисов** - все компоненты запускаются
6. **Открытие браузера** - установщик открывается автоматически

## 🌐 Доступ к системе

После установки система доступна по адресу:
- **Установщик:** http://localhost:5000
- **Приложение:** http://localhost:3000 (после завершения установки)

## 🔧 Альтернативные способы запуска

### Через ярлык на рабочем столе
```bash
# Создать ярлык
./installer/install_desktop.sh

# Дважды кликните по ярлыку "Military Focus Installer"
```

### Через systemd сервис
```bash
# Установить как сервис
sudo ./installer/install_service.sh

# Установщик будет запускаться автоматически
```

### Автозапуск при входе в систему
```bash
# Настроить автозапуск
./installer/install_autostart.sh

# При каждом входе в систему установщик запустится автоматически
```

## 🛠️ Управление после установки

### Запуск/остановка
```bash
# Запустить
sudo systemctl start military-focus-installer

# Остановить
sudo systemctl stop military-focus-installer

# Статус
sudo systemctl status military-focus-installer
```

### Просмотр логов
```bash
# Логи в реальном времени
sudo journalctl -u military-focus-installer -f

# Последние логи
sudo journalctl -u military-focus-installer --lines=50
```

## 🐛 Если что-то пошло не так

### Установщик не запускается
```bash
# Проверить логи
sudo journalctl -u military-focus-installer -f

# Перезапустить
sudo systemctl restart military-focus-installer
```

### Браузер не открылся
```bash
# Открыть вручную
xdg-open http://localhost:5000

# Или запустить автобраузер
python3 installer/auto_browser_start.py
```

### Проблемы с портом
```bash
# Проверить занятые порты
sudo netstat -tlnp | grep :5000

# Освободить порт
sudo fuser -k 5000/tcp
```

## 📋 Системные требования

- **ОС:** Ubuntu 18.04+ / Debian 10+ / CentOS 7+
- **RAM:** 2 GB (рекомендуется 4 GB)
- **Диск:** 5 GB свободного места
- **Сеть:** Доступ в интернет для загрузки зависимостей

## 🎉 Готово!

Теперь у вас есть полностью рабочая платформа Military Focus с автоматическим установщиком!

**Следующие шаги:**
1. Откройте http://localhost:5000 в браузере
2. Следуйте инструкциям установщика
3. Настройте администратора
4. Начните использовать платформу!

---

**🎯 Military Focus - Быстро, просто, надежно!**