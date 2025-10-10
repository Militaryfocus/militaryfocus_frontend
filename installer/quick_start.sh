#!/bin/bash

# ML Community Platform - Quick Start Script
# Автоматический запуск установщика и всей системы

set -e

echo "🚀 ML Community Platform - Quick Start"
echo "======================================"
echo

# Проверка прав
if [ "$EUID" -ne 0 ]; then
    echo "❌ Этот скрипт должен быть запущен с правами root или через sudo"
    echo "   Используйте: sudo ./quick_start.sh"
    exit 1
fi

# Обновление системы
echo "📦 Обновление системы..."
apt update -y
apt upgrade -y

# Установка Python и pip
echo "🐍 Установка Python..."
apt install -y python3 python3-pip python3-venv python3-dev

# Установка Git
echo "📁 Установка Git..."
apt install -y git

# Переход в директорию установщика
cd "$(dirname "$0")"

# Установка зависимостей установщика
echo "📦 Установка зависимостей установщика..."
pip3 install -r requirements.txt

# Запуск установщика
echo "🌐 Запуск веб-установщика..."
echo
echo "=========================================="
echo "🎯 Установщик запущен!"
echo "📱 Откройте браузер и перейдите по адресу:"
echo "   http://localhost:5000"
echo
echo "⏹️  Для остановки нажмите Ctrl+C"
echo "=========================================="
echo

python3 app.py