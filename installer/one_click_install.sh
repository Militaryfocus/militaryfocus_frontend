#!/bin/bash
# Military Focus - Однокликовый установщик
# Устанавливает и запускает Military Focus без командной строки

set -e

echo "🎯 Military Focus - Однокликовый установщик"
echo "=============================================="

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для цветного вывода
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

# Проверяем права root для некоторых операций
check_root() {
    if [ "$EUID" -eq 0 ]; then
        ROOT_USER=true
        print_status "Запущено с правами root"
    else
        ROOT_USER=false
        print_status "Запущено без прав root"
    fi
}

# Устанавливаем зависимости
install_dependencies() {
    print_status "Проверяем и устанавливаем зависимости..."
    
    # Обновляем пакеты
    if command -v apt >/dev/null 2>&1; then
        print_status "Обновляем пакеты..."
        if [ "$ROOT_USER" = true ]; then
            apt update
        else
            sudo apt update
        fi
        
        # Устанавливаем необходимые пакеты
        print_status "Устанавливаем Python, Node.js, PostgreSQL, Redis..."
        PACKAGES="python3 python3-pip python3-venv nodejs npm postgresql postgresql-contrib redis-server git curl"
        
        if [ "$ROOT_USER" = true ]; then
            apt install -y $PACKAGES
        else
            sudo apt install -y $PACKAGES
        fi
    else
        print_warning "apt не найден, пропускаем установку системных пакетов"
    fi
}

# Настраиваем Python окружение
setup_python() {
    print_status "Настраиваем Python окружение..."
    
    # Создаем виртуальное окружение
    if [ ! -d "/workspace/venv" ]; then
        python3 -m venv /workspace/venv
    fi
    
    # Активируем виртуальное окружение
    source /workspace/venv/bin/activate
    
    # Устанавливаем Python зависимости
    print_status "Устанавливаем Python зависимости..."
    pip install --upgrade pip
    pip install -r /workspace/backend/requirements.txt
    pip install -r /workspace/installer/requirements.txt
}

# Настраиваем Node.js
setup_nodejs() {
    print_status "Настраиваем Node.js..."
    
    # Устанавливаем зависимости frontend
    if [ -f "/workspace/frontend/package.json" ]; then
        print_status "Устанавливаем зависимости frontend..."
        cd /workspace/frontend
        npm install
        npm run build
        cd /workspace
    fi
}

# Настраиваем базу данных
setup_database() {
    print_status "Настраиваем базу данных..."
    
    if [ "$ROOT_USER" = true ]; then
        systemctl start postgresql
        systemctl enable postgresql
    else
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
    fi
    
    # Создаем пользователя и базу данных
    print_status "Создаем пользователя и базу данных..."
    sudo -u postgres psql -c "CREATE USER militaryfocus WITH PASSWORD 'militaryfocus123';" 2>/dev/null || true
    sudo -u postgres psql -c "CREATE DATABASE militaryfocus OWNER militaryfocus;" 2>/dev/null || true
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE militaryfocus TO militaryfocus;" 2>/dev/null || true
}

# Настраиваем Redis
setup_redis() {
    print_status "Настраиваем Redis..."
    
    if [ "$ROOT_USER" = true ]; then
        systemctl start redis-server
        systemctl enable redis-server
    else
        sudo systemctl start redis-server
        sudo systemctl enable redis-server
    fi
}

# Устанавливаем автозапуск
install_autostart() {
    print_status "Настраиваем автозапуск..."
    
    # Устанавливаем systemd сервис
    if [ "$ROOT_USER" = true ]; then
        /workspace/installer/install_service.sh
    else
        sudo /workspace/installer/install_service.sh
    fi
    
    # Устанавливаем desktop файл
    /workspace/installer/install_desktop.sh
    
    # Устанавливаем автозапуск в браузере
    /workspace/installer/install_autostart.sh
}

# Запускаем установщик
start_installer() {
    print_status "Запускаем установщик..."
    
    # Запускаем автозапуск
    python3 /workspace/installer/auto_browser_start.py &
    
    print_success "Установщик запущен!"
    print_status "Браузер должен открыться автоматически"
    print_status "Если браузер не открылся, перейдите по адресу: http://localhost:5000"
}

# Основная функция
main() {
    print_status "Начинаем установку Military Focus..."
    
    check_root
    install_dependencies
    setup_python
    setup_nodejs
    setup_database
    setup_redis
    install_autostart
    start_installer
    
    echo ""
    print_success "🎉 Military Focus успешно установлен и запущен!"
    print_status "🌐 Установщик доступен по адресу: http://localhost:5000"
    print_status "🔄 Установщик будет запускаться автоматически при перезагрузке"
    print_status "🖥️ Ярлык создан на рабочем столе"
    print_status "📱 Приложение добавлено в меню приложений"
    echo ""
    print_status "Для остановки установщика:"
    print_status "  sudo systemctl stop military-focus-installer"
    print_status "Для запуска установщика:"
    print_status "  sudo systemctl start military-focus-installer"
    echo ""
}

# Обработка ошибок
trap 'print_error "Установка прервана!"; exit 1' INT TERM

# Запуск
main "$@"