# 🚀 Быстрый старт ML Community Platform

## ⚡ Установка за 3 команды

```bash
# 1. Клонировать репозиторий
git clone https://github.com/Militaryfocus/militaryfocus_frontend.git
cd militaryfocus_frontend/ml-community-monolith

# 2. Проверить систему (опционально)
chmod +x check_system.sh && ./check_system.sh

# 3. Установить платформу
chmod +x one_click_install.sh && ./one_click_install.sh
```

**Готово!** 🎉 Платформа доступна по адресу: http://localhost:8000

## 📋 Что устанавливается автоматически

- ✅ **Python 3.8+** и все зависимости
- ✅ **PostgreSQL** база данных с настройкой
- ✅ **Redis** для кэширования (опционально)
- ✅ **57 героев Mobile Legends** с русскими описаниями
- ✅ **12 достижений** для геймификации
- ✅ **Администратор** (admin/admin123)
- ✅ **Веб-интерфейс** с современным дизайном

## 🎯 Первые шаги после установки

### 1. Войти в систему
- Откройте http://localhost:8000
- Нажмите "Войти" → admin / admin123
- **Смените пароль** в профиле!

### 2. Изучить платформу
- 🦸 **Герои**: /heroes - база из 57 героев
- 📚 **Гайды**: /guides - создание и просмотр гайдов  
- 👤 **Профиль**: /profile - ваша статистика
- 🏆 **Достижения**: /profile/stats - прогресс и награды
- ❤️ **Избранное**: /favorites - сохраненные герои и гайды

### 3. Создать контент
- **Создать гайд**: /guides/builder
- **Добавить новость**: /admin (только админ)
- **Комментировать** гайды других пользователей

## 🔧 Альтернативные методы установки

### Docker (если предпочитаете контейнеры)
```bash
git clone https://github.com/Militaryfocus/militaryfocus_frontend.git
cd militaryfocus_frontend/ml-community-monolith
docker-compose up -d
```

### Ручная установка (для опытных пользователей)
```bash
# Установить зависимости
sudo apt install python3 python3-pip postgresql redis-server

# Настроить базу данных
sudo -u postgres createdb ml_community
sudo -u postgres createuser ml_admin -P

# Клонировать и настроить
git clone https://github.com/Militaryfocus/militaryfocus_frontend.git
cd militaryfocus_frontend/ml-community-monolith
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# Инициализировать данные
alembic upgrade head
python create_achievements.py
python import_heroes.py import
python create_admin.py

# Запустить
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 🚨 Если что-то пошло не так

### Проверить установку
```bash
./check_installation.sh
```

### Посмотреть логи
```bash
tail -f app.log
```

### Перезапустить приложение
```bash
pkill -f uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Переустановить
```bash
./one_click_install.sh  # Скрипт спросит о переустановке
```

## 🔄 Обновление

```bash
# Проверить обновления
./check_updates.sh

# Обновить до последней версии
./update_platform.sh

# Откатиться при проблемах
./rollback.sh
```

## 📱 Доступные URL

После успешной установки:

- 🏠 **Главная**: http://localhost:8000
- 🦸 **Герои**: http://localhost:8000/heroes
- 📚 **Гайды**: http://localhost:8000/guides
- 🔍 **Поиск**: http://localhost:8000/search
- 👤 **Профиль**: http://localhost:8000/profile
- 🔧 **Админ**: http://localhost:8000/admin
- 📖 **API Docs**: http://localhost:8000/api/docs
- ❤️ **Health**: http://localhost:8000/health

## 👤 Учетные данные по умолчанию

- **Логин**: admin
- **Пароль**: admin123
- **Email**: admin@militaryfocus.ru

**⚠️ Обязательно смените пароль после первого входа!**

## 🎮 Что дальше?

1. **Изучите героев** - 57 героев Mobile Legends с полными описаниями
2. **Создайте гайд** - поделитесь своими знаниями о сборках
3. **Добавьте в избранное** - сохраняйте интересных героев
4. **Получайте достижения** - 12 категорий наград за активность
5. **Общайтесь** - комментируйте и оценивайте контент

## 📞 Поддержка

- 📖 **Полная документация**: INSTALLATION_GUIDE.md
- 🐛 **Сообщить о проблеме**: https://github.com/Militaryfocus/militaryfocus_frontend/issues
- 💬 **Сообщество**: Создавайте гайды и обсуждайте стратегии!

---

**Добро пожаловать в ML Community Platform!** 🎉

*Платформа для русскоязычного сообщества Mobile Legends: Bang Bang*