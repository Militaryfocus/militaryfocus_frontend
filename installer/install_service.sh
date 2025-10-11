#!/bin/bash
# Скрипт установки systemd сервиса для Military Focus Installer

set -e

echo "🔧 Установка Military Focus Installer Service..."

# Проверяем права root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Запустите скрипт с правами root: sudo $0"
    exit 1
fi

# Копируем сервис файл
echo "📋 Копируем сервис файл..."
cp /workspace/installer/military-focus-installer.service /etc/systemd/system/

# Перезагружаем systemd
echo "🔄 Перезагружаем systemd..."
systemctl daemon-reload

# Включаем сервис
echo "✅ Включаем сервис..."
systemctl enable military-focus-installer.service

# Запускаем сервис
echo "🚀 Запускаем сервис..."
systemctl start military-focus-installer.service

# Проверяем статус
echo "📊 Статус сервиса:"
systemctl status military-focus-installer.service --no-pager

echo ""
echo "🎉 Military Focus Installer Service установлен и запущен!"
echo "🌐 Установщик будет доступен по адресу: http://localhost:5000"
echo "📝 Для управления сервисом используйте:"
echo "   sudo systemctl start military-focus-installer"
echo "   sudo systemctl stop military-focus-installer"
echo "   sudo systemctl status military-focus-installer"
echo "   sudo systemctl restart military-focus-installer"