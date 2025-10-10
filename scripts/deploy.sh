#!/bin/bash
# deploy.sh - Скрипт для развертывания на сервере

set -e

echo "🚀 Развертывание Mobile Legends Community Platform на сервер..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для вывода
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка параметров
if [ $# -eq 0 ]; then
    echo "Использование: $0 <server-ip> [username] [port]"
    echo "Пример: $0 192.168.1.100 ubuntu 22"
    exit 1
fi

SERVER_IP=$1
USERNAME=${2:-ubuntu}
PORT=${3:-22}

print_status "Подключение к серверу $USERNAME@$SERVER_IP:$PORT"

# Проверка подключения к серверу
if ! ssh -o ConnectTimeout=10 -p $PORT $USERNAME@$SERVER_IP "echo 'Подключение успешно'" > /dev/null 2>&1; then
    print_error "Не удается подключиться к серверу $SERVER_IP"
    print_error "Проверьте:"
    print_error "  - IP адрес сервера"
    print_error "  - Имя пользователя"
    print_error "  - SSH ключи или пароль"
    print_error "  - Доступность порта $PORT"
    exit 1
fi

print_success "Подключение к серверу установлено"

# Создание архива проекта
print_status "Создание архива проекта..."
tar -czf ml-community.tar.gz \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    --exclude='.env' \
    --exclude='data/postgres' \
    --exclude='data/redis' \
    --exclude='logs' \
    --exclude='backups' \
    .

print_success "Архив создан: ml-community.tar.gz"

# Загрузка на сервер
print_status "Загрузка проекта на сервер..."
scp -P $PORT ml-community.tar.gz $USERNAME@$SERVER_IP:~/

# Развертывание на сервере
print_status "Развертывание на сервере..."
ssh -p $PORT $USERNAME@$SERVER_IP << 'EOF'
    # Создание директории проекта
    mkdir -p ~/ml-community
    cd ~/ml-community
    
    # Распаковка архива
    tar -xzf ~/ml-community.tar.gz
    
    # Удаление архива
    rm ~/ml-community.tar.gz
    
    # Создание .env файла
    cp .env.example .env
    
    # Настройка переменных окружения для продакшена
    sed -i 's/localhost/0.0.0.0/g' .env
    sed -i 's/DEBUG=true/DEBUG=false/g' .env
    sed -i 's/ENVIRONMENT=development/ENVIRONMENT=production/g' .env
    
    # Создание необходимых директорий
    mkdir -p data/{postgres,redis,uploads,hero_images}
    mkdir -p logs backups media
    
    # Установка прав
    chmod +x scripts/install.sh
    
    echo "✅ Проект развернут на сервере"
    echo "📁 Директория: ~/ml-community"
    echo "🔧 Для запуска выполните: cd ~/ml-community && ./scripts/install.sh"
EOF

print_success "Проект успешно развернут на сервере!"
print_status "Для запуска подключитесь к серверу и выполните:"
print_status "  ssh -p $PORT $USERNAME@$SERVER_IP"
print_status "  cd ~/ml-community"
print_status "  ./scripts/install.sh"

# Очистка локального архива
rm ml-community.tar.gz

print_success "Развертывание завершено!"