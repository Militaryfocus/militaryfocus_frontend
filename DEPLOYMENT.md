# Инструкции по развертыванию Military Focus Frontend

## Требования к серверу

- **ОС**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **RAM**: Минимум 2GB, рекомендуется 4GB+
- **CPU**: 2+ ядра
- **Диск**: 10GB+ свободного места
- **Docker**: 20.10+
- **Docker Compose**: 2.0+

## Быстрое развертывание

### 1. Клонирование репозитория

```bash
git clone https://github.com/Militaryfocus/militaryfocus_frontend.git
cd militaryfocus_frontend
git checkout cursor/refactor-frontend-for-cursor-pagination-30b1
```

### 2. Автоматическое развертывание

```bash
# Развертывание в production режиме
./deploy.sh production

# Развертывание с очисткой старых образов
./deploy.sh production --clean
```

### 3. Проверка развертывания

```bash
# Проверка статуса контейнеров
docker-compose ps

# Просмотр логов
docker-compose logs -f

# Проверка доступности
curl -k https://localhost
```

## Ручное развертывание

### 1. Установка зависимостей

```bash
# Установка Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Настройка SSL сертификатов

#### Для production (Let's Encrypt):

```bash
# Установка Certbot
sudo apt update
sudo apt install certbot

# Получение сертификата
sudo certbot certonly --standalone -d your-domain.com

# Копирование сертификатов
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*.pem
```

#### Для разработки (самоподписанные):

```bash
mkdir -p ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/key.pem \
    -out ssl/cert.pem \
    -subj "/C=RU/ST=Moscow/L=Moscow/O=MilitaryFocus/CN=your-domain.com"
```

### 3. Настройка переменных окружения

```bash
# Копирование production конфигурации
cp .env.production .env.local

# Редактирование конфигурации
nano .env.local
```

### 4. Сборка и запуск

```bash
# Сборка образов
docker-compose build

# Запуск в фоновом режиме
docker-compose up -d

# Проверка статуса
docker-compose ps
```

## Настройка Nginx

### Обновление конфигурации

Отредактируйте `nginx.conf` и замените:
- `server_name _;` на ваш домен
- Пути к SSL сертификатам
- Настройки upstream если нужно

### Перезапуск Nginx

```bash
docker-compose restart nginx
```

## Мониторинг и обслуживание

### Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Только приложение
docker-compose logs -f military-focus-app

# Только Nginx
docker-compose logs -f nginx
```

### Обновление приложения

```bash
# Остановка сервисов
docker-compose down

# Обновление кода
git pull origin cursor/refactor-frontend-for-cursor-pagination-30b1

# Пересборка и запуск
docker-compose up -d --build
```

### Резервное копирование

```bash
# Создание бэкапа
docker-compose exec military-focus-app tar -czf /tmp/backup.tar.gz /app

# Копирование бэкапа
docker cp military-focus-app:/tmp/backup.tar.gz ./backup-$(date +%Y%m%d).tar.gz
```

## Безопасность

### Firewall настройки

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# iptables (CentOS/RHEL)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### Обновление системы

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

## Troubleshooting

### Проблемы с портами

```bash
# Проверка занятых портов
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
sudo netstat -tulpn | grep :3000

# Остановка конфликтующих сервисов
sudo systemctl stop apache2  # если Apache запущен
sudo systemctl stop nginx    # если системный Nginx запущен
```

### Проблемы с Docker

```bash
# Очистка Docker
docker system prune -a

# Перезапуск Docker
sudo systemctl restart docker
```

### Проблемы с SSL

```bash
# Проверка сертификатов
openssl x509 -in ssl/cert.pem -text -noout

# Проверка подключения
openssl s_client -connect localhost:443 -servername your-domain.com
```

## Производительность

### Оптимизация Docker

```bash
# Увеличение лимитов
echo 'vm.max_map_count=262144' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Мониторинг ресурсов

```bash
# Использование ресурсов
docker stats

# Логи производительности
docker-compose logs | grep -i "performance\|memory\|cpu"
```

## Поддержка

При возникновении проблем:

1. Проверьте логи: `docker-compose logs -f`
2. Проверьте статус: `docker-compose ps`
3. Проверьте ресурсы: `docker stats`
4. Создайте issue в репозитории с подробным описанием проблемы