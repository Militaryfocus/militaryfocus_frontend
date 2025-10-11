#!/bin/bash
# Скрипт установки Desktop файла для Military Focus Installer

set -e

echo "🖥️ Установка Desktop файла для Military Focus Installer..."

# Определяем пути
DESKTOP_FILE="/workspace/installer/MilitaryFocusInstaller.desktop"
USER_DESKTOP="$HOME/Desktop/MilitaryFocusInstaller.desktop"
APPLICATIONS_DIR="$HOME/.local/share/applications"
SYSTEM_APPLICATIONS="/usr/share/applications"

# Создаем иконку если её нет
if [ ! -f "/workspace/installer/icon.png" ]; then
    echo "🎨 Создаем иконку..."
    # Создаем простую иконку с помощью ImageMagick или fallback
    if command -v convert >/dev/null 2>&1; then
        convert -size 64x64 xc:blue -fill white -pointsize 20 -gravity center -annotate +0+0 "MF" /workspace/installer/icon.png
    else
        # Fallback - создаем пустой файл
        touch /workspace/installer/icon.png
    fi
fi

# Копируем на рабочий стол
echo "📋 Копируем на рабочий стол..."
mkdir -p "$HOME/Desktop"
cp "$DESKTOP_FILE" "$USER_DESKTOP"
chmod +x "$USER_DESKTOP"

# Копируем в приложения пользователя
echo "📱 Добавляем в меню приложений..."
mkdir -p "$APPLICATIONS_DIR"
cp "$DESKTOP_FILE" "$APPLICATIONS_DIR/"

# Обновляем кэш приложений
if command -v update-desktop-database >/dev/null 2>&1; then
    echo "🔄 Обновляем кэш приложений..."
    update-desktop-database "$APPLICATIONS_DIR"
fi

# Делаем файл исполняемым
chmod +x "$USER_DESKTOP"
chmod +x "$APPLICATIONS_DIR/MilitaryFocusInstaller.desktop"

echo ""
echo "🎉 Desktop файл установлен!"
echo "🖥️ Ярлык создан на рабочем столе: Military Focus Installer"
echo "📱 Приложение добавлено в меню приложений"
echo "🚀 Для запуска просто дважды кликните по ярлыку!"