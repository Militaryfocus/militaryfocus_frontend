# 🔄 Руководство по обновлению ML Community Platform

## 🎯 Краткий обзор

ML Community Platform регулярно обновляется с новыми функциями, исправлениями и улучшениями. Это руководство поможет вам безопасно обновить платформу до последней версии.

## 📋 Перед обновлением

### Проверка текущей версии
```bash
cd /path/to/ml-community-monolith
git describe --tags
```

### Создание резервной копии
```bash
# Бэкап базы данных
pg_dump ml_community > backup_$(date +%Y%m%d_%H%M%S).sql

# Бэкап конфигурации
cp .env .env.backup
```

## 🚀 Методы обновления

### 1. 🤖 Автоматическое обновление (рекомендуется)

```bash
# Запустить скрипт автообновления
./update_platform.sh
```

**Что делает скрипт:**
- ✅ Создает бэкап базы данных
- ✅ Останавливает приложение
- ✅ Получает последние изменения
- ✅ Обновляет зависимости
- ✅ Выполняет миграции БД
- ✅ Обновляет данные героев и достижений
- ✅ Перезапускает приложение
- ✅ Проверяет работоспособность

### 2. 🔍 Проверка доступных обновлений

```bash
# Проверить наличие обновлений
./check_updates.sh
```

### 3. 🛠️ Ручное обновление

```bash
# Остановить приложение
pkill -f uvicorn

# Получить изменения
git fetch origin --tags

# Обновиться до последней версии
LATEST=$(git tag --sort=-version:refname | head -1)
git checkout $LATEST

# Обновить зависимости
pip install -r requirements.txt

# Миграции БД
alembic upgrade head

# Обновить данные
python import_heroes.py import

# Запустить приложение
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 🐳 Docker обновление

```bash
# Остановить контейнеры
docker-compose down

# Получить изменения
git pull origin master

# Пересобрать и запустить
docker-compose up -d --build

# Выполнить миграции и обновления
docker-compose exec app alembic upgrade head
docker-compose exec app python import_heroes.py import
```

## ⏪ Откат к предыдущей версии

Если что-то пошло не так:

```bash
# Автоматический откат
./rollback.sh

# Или ручной откат
git checkout PREVIOUS_TAG
pip install -r requirements.txt
# Восстановить БД из бэкапа при необходимости
psql ml_community < backup_file.sql
```

## 📊 Версии и changelog

### Текущие версии:
- **v2.0.1-final-integration** - Финальная интегрированная платформа
- **v2.0.0-complete-platform** - Полная платформа
- **v1.6.0-heroes-database** - База данных героев
- **v1.5.0-enhanced-features** - Расширенные функции

### Проверка изменений:
```bash
# Посмотреть изменения в версии
git tag -l --format='%(contents)' v2.0.1-final-integration

# Сравнить версии
git log --oneline v1.6.0..v2.0.1
```

## 🔧 Автоматические обновления

### Настройка cron для проверки обновлений:
```bash
# Добавить в crontab
0 2 * * * cd /path/to/ml-community-monolith && ./check_updates.sh >> update_check.log
```

### Настройка автообновления (осторожно!):
```bash
# Еженедельное автообновление по воскресеньям в 3:00
0 3 * * 0 cd /path/to/ml-community-monolith && ./update_platform.sh >> auto_update.log
```

## 🚨 Устранение проблем

### Проблема: Приложение не запускается после обновления
```bash
# Проверить логи
tail -f app.log

# Проверить зависимости
pip install -r requirements.txt

# Проверить БД
alembic current
alembic upgrade head
```

### Проблема: Ошибки миграции БД
```bash
# Посмотреть текущую версию БД
alembic current

# Откатить миграцию
alembic downgrade -1

# Или восстановить из бэкапа
psql ml_community < backup_file.sql
```

### Проблема: Конфликты в git
```bash
# Сохранить локальные изменения
git stash

# Выполнить обновление
git checkout LATEST_TAG

# Применить изменения обратно (если нужно)
git stash pop
```

## 📱 Мониторинг после обновления

### Проверка работоспособности:
```bash
# Health check
curl http://localhost:8000/health

# Проверка API
curl http://localhost:8000/api/docs

# Проверка БД
psql ml_community -c "SELECT COUNT(*) FROM heroes;"
```

### Мониторинг логов:
```bash
# Логи приложения
tail -f app.log

# Системные логи
journalctl -u ml-community-platform -f
```

## 📋 Чеклист обновления

- [ ] Создан бэкап базы данных
- [ ] Сохранены локальные настройки (.env)
- [ ] Остановлено приложение
- [ ] Получены последние изменения из git
- [ ] Обновлены зависимости Python
- [ ] Выполнены миграции базы данных
- [ ] Обновлены данные героев и достижений
- [ ] Перезапущено приложение
- [ ] Проверена работоспособность
- [ ] Удалены старые бэкапы

## 🆘 Экстренное восстановление

Если обновление критически сломало систему:

```bash
# 1. Остановить приложение
pkill -f uvicorn

# 2. Откатиться к предыдущей версии
git checkout PREVIOUS_WORKING_TAG

# 3. Восстановить БД из бэкапа
psql ml_community < backup_file.sql

# 4. Восстановить зависимости
pip install -r requirements.txt

# 5. Запустить приложение
uvicorn app.main:app --host 0.0.0.0 --port 8000

# 6. Сообщить о проблеме в GitHub Issues
```

---

## 📞 Поддержка

Если возникли проблемы с обновлением:

1. **Проверьте логи**: `tail -f app.log`
2. **Посмотрите документацию**: README.md файлы
3. **Создайте Issue**: https://github.com/Militaryfocus/militaryfocus_frontend/issues
4. **Используйте откат**: `./rollback.sh`

**Всегда делайте бэкап перед обновлением!** 💾