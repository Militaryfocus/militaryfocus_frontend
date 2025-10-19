#!/bin/bash

# ML Community Platform - System Requirements Check
# Проверка системных требований перед установкой

echo "🔍 Проверка системных требований ML Community Platform"
echo "====================================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

check_ok() { echo -e "${GREEN}✅ $1${NC}"; }
check_fail() { echo -e "${RED}❌ $1${NC}"; }
check_warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
check_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

ERRORS=0
WARNINGS=0

# Check OS
echo "📋 Операционная система:"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        check_ok "OS: $PRETTY_NAME"
    else
        check_ok "OS: Linux (неизвестная версия)"
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    check_ok "OS: macOS $(sw_vers -productVersion)"
else
    check_warn "OS: $OSTYPE (может потребоваться дополнительная настройка)"
    ((WARNINGS++))
fi

# Check architecture
ARCH=$(uname -m)
if [[ "$ARCH" == "x86_64" || "$ARCH" == "amd64" ]]; then
    check_ok "Архитектура: $ARCH"
elif [[ "$ARCH" == "aarch64" || "$ARCH" == "arm64" ]]; then
    check_ok "Архитектура: $ARCH (ARM64)"
else
    check_warn "Архитектура: $ARCH (может быть несовместима)"
    ((WARNINGS++))
fi

# Check memory
echo ""
echo "💾 Память и диск:"
if command -v free >/dev/null 2>&1; then
    MEMORY_MB=$(free -m | awk 'NR==2{printf "%.0f", $2}')
    if [ "$MEMORY_MB" -ge 4096 ]; then
        check_ok "RAM: ${MEMORY_MB}MB (отлично)"
    elif [ "$MEMORY_MB" -ge 2048 ]; then
        check_ok "RAM: ${MEMORY_MB}MB (достаточно)"
    else
        check_warn "RAM: ${MEMORY_MB}MB (минимум, может быть медленно)"
        ((WARNINGS++))
    fi
elif command -v vm_stat >/dev/null 2>&1; then
    # macOS
    PAGES=$(vm_stat | grep "Pages free" | awk '{print $3}' | tr -d '.')
    MEMORY_MB=$((PAGES * 4096 / 1024 / 1024))
    check_ok "RAM: ~${MEMORY_MB}MB (macOS)"
else
    check_warn "Не удалось определить объем RAM"
    ((WARNINGS++))
fi

# Check disk space
DISK_SPACE=$(df . | tail -1 | awk '{print $4}')
DISK_SPACE_GB=$((DISK_SPACE / 1024 / 1024))
if [ "$DISK_SPACE_GB" -ge 10 ]; then
    check_ok "Свободное место: ${DISK_SPACE_GB}GB"
elif [ "$DISK_SPACE_GB" -ge 5 ]; then
    check_warn "Свободное место: ${DISK_SPACE_GB}GB (минимум)"
    ((WARNINGS++))
else
    check_fail "Свободное место: ${DISK_SPACE_GB}GB (недостаточно, нужно минимум 5GB)"
    ((ERRORS++))
fi

# Check Python
echo ""
echo "🐍 Python:"
if command -v python3 >/dev/null 2>&1; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d'.' -f1)
    PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d'.' -f2)
    
    if [ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -ge 8 ]; then
        check_ok "Python: $PYTHON_VERSION"
    else
        check_fail "Python: $PYTHON_VERSION (нужен Python 3.8+)"
        ((ERRORS++))
    fi
else
    check_fail "Python 3 не установлен"
    ((ERRORS++))
fi

# Check pip
if command -v pip3 >/dev/null 2>&1; then
    PIP_VERSION=$(pip3 --version | cut -d' ' -f2)
    check_ok "pip: $PIP_VERSION"
else
    check_fail "pip3 не установлен"
    ((ERRORS++))
fi

# Check git
echo ""
echo "📦 Инструменты:"
if command -v git >/dev/null 2>&1; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    check_ok "Git: $GIT_VERSION"
else
    check_fail "Git не установлен"
    ((ERRORS++))
fi

# Check curl
if command -v curl >/dev/null 2>&1; then
    check_ok "curl: установлен"
else
    check_warn "curl не установлен (рекомендуется для проверки здоровья)"
    ((WARNINGS++))
fi

# Check PostgreSQL
echo ""
echo "🐘 База данных:"
if command -v psql >/dev/null 2>&1; then
    PSQL_VERSION=$(psql --version | cut -d' ' -f3)
    check_ok "PostgreSQL client: $PSQL_VERSION"
else
    check_warn "PostgreSQL client не установлен (будет установлен автоматически)"
fi

if command -v pg_config >/dev/null 2>&1; then
    check_ok "PostgreSQL development headers: установлены"
else
    check_warn "PostgreSQL dev headers не установлены (будут установлены автоматически)"
fi

# Check Redis (optional)
if command -v redis-cli >/dev/null 2>&1; then
    check_ok "Redis client: установлен"
else
    check_info "Redis не установлен (опционально, будет установлен при необходимости)"
fi

# Check Docker (optional)
echo ""
echo "🐳 Docker (опционально):"
if command -v docker >/dev/null 2>&1; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | tr -d ',')
    check_ok "Docker: $DOCKER_VERSION"
    
    if command -v docker-compose >/dev/null 2>&1; then
        COMPOSE_VERSION=$(docker-compose --version | cut -d' ' -f3 | tr -d ',')
        check_ok "Docker Compose: $COMPOSE_VERSION"
    else
        check_warn "Docker Compose не установлен"
    fi
else
    check_info "Docker не установлен (опционально для контейнерной установки)"
fi

# Check network ports
echo ""
echo "🌐 Сетевые порты:"
if command -v netstat >/dev/null 2>&1; then
    if netstat -tlnp 2>/dev/null | grep -q ":8000 "; then
        check_warn "Порт 8000 уже используется"
        ((WARNINGS++))
    else
        check_ok "Порт 8000 свободен"
    fi
    
    if netstat -tlnp 2>/dev/null | grep -q ":5432 "; then
        check_info "Порт 5432 (PostgreSQL) используется"
    else
        check_ok "Порт 5432 свободен"
    fi
else
    check_info "netstat недоступен, проверка портов пропущена"
fi

# Check internet connection
echo ""
echo "🌍 Интернет соединение:"
if curl -s --connect-timeout 5 https://github.com >/dev/null; then
    check_ok "Интернет соединение работает"
else
    check_fail "Нет доступа к интернету (нужен для загрузки зависимостей)"
    ((ERRORS++))
fi

# Check permissions
echo ""
echo "🔐 Права доступа:"
if [ -w "." ]; then
    check_ok "Права на запись в текущую директорию"
else
    check_fail "Нет прав на запись в текущую директорию"
    ((ERRORS++))
fi

if [ "$EUID" -eq 0 ]; then
    check_warn "Запущено от root (не рекомендуется для production)"
    ((WARNINGS++))
else
    check_ok "Запущено от обычного пользователя"
fi

# Summary
echo ""
echo "📊 Итоги проверки:"
echo "=================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    check_ok "Система готова к установке ML Community Platform!"
    echo ""
    echo "🚀 Для установки выполните:"
    echo "   git clone https://github.com/Militaryfocus/militaryfocus_frontend.git"
    echo "   cd militaryfocus_frontend/ml-community-monolith"
    echo "   chmod +x one_click_install.sh"
    echo "   ./one_click_install.sh"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    check_warn "Система готова к установке с предупреждениями ($WARNINGS)"
    echo ""
    echo "⚠️  Предупреждения не критичны, установка должна пройти успешно"
    echo ""
    echo "🚀 Для установки выполните:"
    echo "   git clone https://github.com/Militaryfocus/militaryfocus_frontend.git"
    echo "   cd militaryfocus_frontend/ml-community-monolith"
    echo "   chmod +x one_click_install.sh"
    echo "   ./one_click_install.sh"
    exit 0
else
    check_fail "Обнаружены критические проблемы ($ERRORS ошибок, $WARNINGS предупреждений)"
    echo ""
    echo "❌ Необходимо устранить ошибки перед установкой:"
    echo ""
    
    if ! command -v python3 >/dev/null 2>&1; then
        echo "   sudo apt install python3 python3-pip python3-venv  # Ubuntu/Debian"
        echo "   sudo yum install python3 python3-pip              # CentOS/RHEL"
        echo "   brew install python3                              # macOS"
    fi
    
    if ! command -v git >/dev/null 2>&1; then
        echo "   sudo apt install git     # Ubuntu/Debian"
        echo "   sudo yum install git     # CentOS/RHEL" 
        echo "   brew install git         # macOS"
    fi
    
    if [ "$DISK_SPACE_GB" -lt 5 ]; then
        echo "   Освободите минимум 5GB дискового пространства"
    fi
    
    echo ""
    echo "После устранения проблем запустите проверку снова:"
    echo "   ./check_system.sh"
    
    exit 1
fi