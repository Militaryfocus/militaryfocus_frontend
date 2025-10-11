# 🎯 Military Focus Installer

**Автоматический установщик для платформы Military Focus**

## 🚀 Быстрый запуск

### Одним кликом
```bash
./one_click_install.sh
```

### Альтернативные способы

#### 1. Автозапуск с браузером
```bash
python3 auto_browser_start.py
```

#### 2. Ручной запуск
```bash
python3 auto_start.py
```

#### 3. Обычный запуск
```bash
python3 run_installer.py
```

## 📋 Доступные скрипты

| Скрипт | Описание | Использование |
|--------|----------|---------------|
| `one_click_install.sh` | Полная автоматическая установка | `./one_click_install.sh` |
| `auto_browser_start.py` | Запуск + автобраузер | `python3 auto_browser_start.py` |
| `auto_start.py` | Автозапуск установщика | `python3 auto_start.py` |
| `run_installer.py` | Обычный запуск | `python3 run_installer.py` |
| `install_service.sh` | Установка systemd сервиса | `sudo ./install_service.sh` |
| `install_desktop.sh` | Установка Desktop ярлыка | `./install_desktop.sh` |
| `install_autostart.sh` | Установка автозапуска | `./install_autostart.sh` |

## 🔧 Установка сервисов

### Systemd сервис
```bash
# Установить как системный сервис
sudo ./install_service.sh

# Управление
sudo systemctl start military-focus-installer
sudo systemctl stop military-focus-installer
sudo systemctl status military-focus-installer
```

### Desktop ярлык
```bash
# Создать ярлык на рабочем столе
./install_desktop.sh

# Дважды кликните по ярлыку "Military Focus Installer"
```

### Автозапуск при входе
```bash
# Настроить автозапуск
./install_autostart.sh

# Установщик будет запускаться автоматически при входе в систему
```

## 🌐 API Endpoints

### Основные эндпоинты
- `GET /` - Главная страница установщика
- `GET /step/1` - Проверка системных требований
- `GET /step/2` - Настройка базы данных
- `GET /step/3` - Настройка администратора
- `GET /step/4` - Установка и запуск

### API для проверки
- `POST /api/check-requirements` - Проверка системных требований
- `POST /api/install-missing-dependencies` - Установка недостающих зависимостей
- `POST /api/validate-config` - Валидация конфигурации
- `GET /api/get-installation-logs` - Получение логов установки
- `POST /api/check-port` - Проверка доступности порта

## 🎨 Интерфейс

### Особенности UI
- **Адаптивный дизайн** - работает на всех устройствах
- **Темная/светлая тема** - автоматическое переключение
- **Реальное время** - обновление статуса в реальном времени
- **Прогресс-бары** - визуальный контроль процесса
- **Детальные логи** - полная информация об установке

### Автоматические функции
- **Автопроверка** - запуск проверки при загрузке страницы
- **Автопереход** - автоматический переход к следующему шагу
- **Автобраузер** - автоматическое открытие браузера
- **Автоустановка** - установка недостающих зависимостей

## 🔧 Конфигурация

### Переменные окружения
```bash
# Основные настройки
export FLASK_APP=app.py
export FLASK_ENV=production
export PYTHONPATH=/workspace

# Настройки базы данных
export DATABASE_URL=postgresql://militaryfocus:militaryfocus123@localhost/militaryfocus

# Настройки Redis
export REDIS_URL=redis://localhost:6379/0
```

### Настройки установщика
```python
# В app.py
INSTALLER_CONFIG = {
    'host': '0.0.0.0',
    'port': 5000,
    'debug': False,
    'auto_open_browser': True,
    'auto_redirect': True,
    'check_interval': 2
}
```

## 🐛 Отладка

### Логи установщика
```bash
# Просмотр логов systemd
sudo journalctl -u military-focus-installer -f

# Просмотр логов Flask
tail -f /var/log/military-focus-installer.log
```

### Проверка статуса
```bash
# Проверить процесс
ps aux | grep installer

# Проверить порт
sudo netstat -tlnp | grep :5000

# Проверить сервис
sudo systemctl status military-focus-installer
```

### Тестирование API
```bash
# Проверить API
curl http://localhost:5000/api/check-requirements

# Проверить health check
curl http://localhost:5000/health
```

## 📦 Зависимости

### Python пакеты
```
Flask==2.3.3
requests==2.31.0
psutil==5.9.5
psycopg2-binary==2.9.7
redis==4.6.0
```

### Системные пакеты
```
python3 python3-pip
nodejs npm
postgresql postgresql-contrib
redis-server
git curl
```

## 🚀 Развертывание

### Локальное развертывание
```bash
# Клонировать репозиторий
git clone https://github.com/Militaryfocus/militaryfocus_frontend.git
cd militaryfocus_frontend/installer

# Запустить установщик
python3 auto_browser_start.py
```

### Продакшен развертывание
```bash
# Установить как сервис
sudo ./install_service.sh

# Настроить автозапуск
./install_autostart.sh

# Установщик будет работать в фоне
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `sudo journalctl -u military-focus-installer -f`
2. Проверьте статус: `sudo systemctl status military-focus-installer`
3. Перезапустите: `sudo systemctl restart military-focus-installer`
4. Создайте issue на GitHub

---

**🎯 Military Focus Installer - Установка без командной строки!**