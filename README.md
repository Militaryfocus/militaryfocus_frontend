# 🎯 Military Focus - Автоматический установщик

**Полностью автоматическая установка и настройка платформы Military Focus без командной строки!**

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](https://github.com/Militaryfocus/militaryfocus_frontend)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://python.org)
[![Node.js](https://img.shields.io/badge/node.js-16+-green.svg)](https://nodejs.org)

## 🚀 Быстрый старт

### Одним кликом (рекомендуется)

```bash
# Скачайте и запустите
wget https://raw.githubusercontent.com/Militaryfocus/militaryfocus_frontend/main/installer/one_click_install.sh
chmod +x one_click_install.sh
./one_click_install.sh
```

**Всё!** Установщик автоматически:
- ✅ Установит все зависимости
- ✅ Настроит базу данных и Redis
- ✅ Соберет frontend и backend
- ✅ Запустит установщик
- ✅ Откроет браузер
- ✅ Настроит автозапуск

### Альтернативные способы запуска

#### 1. Через Desktop (GUI)
```bash
# Установить ярлык на рабочий стол
./installer/install_desktop.sh

# Дважды кликните по ярлыку "Military Focus Installer"
```

#### 2. Через systemd сервис
```bash
# Установить как системный сервис
sudo ./installer/install_service.sh

# Установщик будет запускаться автоматически при загрузке системы
```

#### 3. Автозапуск в браузере
```bash
# Настроить автозапуск при входе в систему
./installer/install_autostart.sh
```

#### 4. Ручной запуск
```bash
# Запустить установщик вручную
python3 installer/auto_start.py
```

## 🎯 Основные возможности

### ✨ Полностью автоматический процесс
- **Нулевая настройка** - просто запустите и всё работает
- **Интеллектуальная проверка** системных требований
- **Автоматическая установка** недостающих зависимостей
- **Умная навигация** между шагами установки

### 🔧 Технические возможности
- **Python 3.8+** с FastAPI backend
- **React + TypeScript** frontend
- **PostgreSQL** база данных
- **Redis** кэширование
- **Docker** контейнеризация
- **Nginx** веб-сервер

### 🎨 Современный интерфейс
- **Адаптивный дизайн** для всех устройств
- **Темная/светлая тема** на выбор
- **Реальное время** проверки и установки
- **Детальные логи** процесса установки
- **Прогресс-бары** для визуального контроля

## 📋 Системные требования

### Минимальные требования
- **ОС:** Ubuntu 18.04+ / Debian 10+ / CentOS 7+
- **RAM:** 2 GB
- **Диск:** 5 GB свободного места
- **CPU:** 2 ядра

### Рекомендуемые требования
- **ОС:** Ubuntu 20.04+ / Debian 11+
- **RAM:** 4 GB
- **Диск:** 10 GB свободного места
- **CPU:** 4 ядра

### Автоматически устанавливаемые компоненты
- Python 3.8+ и pip
- Node.js 16+ и npm
- PostgreSQL 12+
- Redis 6+
- Git и curl
- Python зависимости (FastAPI, SQLAlchemy, etc.)
- Node.js зависимости (React, TypeScript, etc.)

## 🛠️ Управление установщиком

### Запуск и остановка
```bash
# Запустить установщик
sudo systemctl start military-focus-installer

# Остановить установщик
sudo systemctl stop military-focus-installer

# Перезапустить установщик
sudo systemctl restart military-focus-installer

# Статус установщика
sudo systemctl status military-focus-installer

# Логи установщика
sudo journalctl -u military-focus-installer -f
```

### Управление автозапуском
```bash
# Включить автозапуск
sudo systemctl enable military-focus-installer

# Отключить автозапуск
sudo systemctl disable military-focus-installer

# Удалить автозапуск браузера
rm ~/.config/autostart/military-focus-installer.desktop
```

## 🌐 Доступ к установщику

После запуска установщик доступен по адресу:
- **Локально:** http://localhost:5000
- **В сети:** http://YOUR_IP:5000

## 📁 Структура проекта

```
militaryfocus_frontend/
├── installer/                 # Автоматический установщик
│   ├── auto_start.py         # Основной скрипт автозапуска
│   ├── auto_browser_start.py # Запуск с открытием браузера
│   ├── one_click_install.sh  # Однокликовая установка
│   ├── install_service.sh    # Установка systemd сервиса
│   ├── install_desktop.sh    # Установка Desktop ярлыка
│   ├── install_autostart.sh  # Установка автозапуска
│   └── templates/            # HTML шаблоны установщика
├── backend/                  # FastAPI backend
├── frontend/                 # React frontend
└── docker-compose.yml        # Docker конфигурация
```

## 🔧 Разработка

### Локальная разработка
```bash
# Клонировать репозиторий
git clone https://github.com/Militaryfocus/militaryfocus_frontend.git
cd militaryfocus_frontend

# Запустить в режиме разработки
docker-compose up -d

# Или запустить установщик локально
python3 installer/run_installer.py
```

### Сборка для продакшена
```bash
# Собрать frontend
cd frontend && npm run build

# Запустить через Docker
docker-compose -f docker-compose.prod.yml up -d
```

## 🐛 Решение проблем

### Установщик не запускается
```bash
# Проверить логи
sudo journalctl -u military-focus-installer -f

# Проверить порт 5000
sudo netstat -tlnp | grep :5000

# Перезапустить сервис
sudo systemctl restart military-focus-installer
```

### Браузер не открывается
```bash
# Запустить вручную
python3 installer/auto_browser_start.py

# Или открыть вручную
xdg-open http://localhost:5000
```

### Проблемы с зависимостями
```bash
# Переустановить зависимости
sudo apt update && sudo apt install -y python3 python3-pip nodejs npm postgresql redis-server

# Переустановить Python пакеты
pip3 install -r backend/requirements.txt
pip3 install -r installer/requirements.txt
```

## 📞 Поддержка

- **GitHub Issues:** [Создать issue](https://github.com/Militaryfocus/militaryfocus_frontend/issues)
- **Документация:** [Wiki проекта](https://github.com/Militaryfocus/militaryfocus_frontend/wiki)
- **Обсуждения:** [Discussions](https://github.com/Militaryfocus/militaryfocus_frontend/discussions)

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 🙏 Благодарности

- FastAPI за отличный веб-фреймворк
- React за мощный frontend
- PostgreSQL за надежную базу данных
- Redis за быстрое кэширование
- Всем контрибьюторам проекта

---

**🎯 Military Focus - Сделано для военных, создано для всех!**