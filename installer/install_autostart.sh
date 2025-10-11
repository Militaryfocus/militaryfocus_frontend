#!/bin/bash
# Скрипт установки автозапуска Military Focus Installer

set -e

echo "🚀 Установка автозапуска Military Focus Installer..."

# Определяем пути
AUTOSTART_DIR="$HOME/.config/autostart"
AUTOSTART_FILE="$AUTOSTART_DIR/military-focus-installer.desktop"
SCRIPT_PATH="/workspace/installer/auto_browser_start.py"

# Создаем директорию autostart если её нет
mkdir -p "$AUTOSTART_DIR"

# Создаем desktop файл для автозапуска
echo "📋 Создаем файл автозапуска..."
cat > "$AUTOSTART_FILE" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Military Focus Installer
Comment=Автоматический запуск установщика Military Focus
Exec=$SCRIPT_PATH
Icon=/workspace/installer/icon.png
Path=/workspace/installer
Terminal=false
StartupNotify=false
Hidden=false
X-GNOME-Autostart-enabled=true
Categories=System;Setup;
Keywords=installer;military;focus;autostart;
EOF

# Делаем файл исполняемым
chmod +x "$AUTOSTART_FILE"

# Создаем иконку если её нет
if [ ! -f "/workspace/installer/icon.png" ]; then
    echo "🎨 Создаем иконку..."
    if command -v convert >/dev/null 2>&1; then
        convert -size 64x64 xc:blue -fill white -pointsize 20 -gravity center -annotate +0+0 "MF" /workspace/installer/icon.png
    else
        touch /workspace/installer/icon.png
    fi
fi

echo ""
echo "🎉 Автозапуск установлен!"
echo "🔄 Military Focus Installer будет запускаться автоматически при входе в систему"
echo "🌐 Браузер откроется автоматически с установщиком"
echo "📝 Файл автозапуска: $AUTOSTART_FILE"
echo ""
echo "🔧 Для отключения автозапуска:"
echo "   rm $AUTOSTART_FILE"
echo ""
echo "🔧 Для включения автозапуска:"
echo "   $0"