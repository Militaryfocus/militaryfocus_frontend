#!/bin/bash

# ML Community Platform - Check Updates Script
# Проверка доступных обновлений

echo "🔍 Проверка обновлений ML Community Platform"
echo "============================================"

# Get current version
CURRENT=$(git describe --tags 2>/dev/null || echo "unknown")
echo "Текущая версия: $CURRENT"

# Fetch latest tags
git fetch origin --tags >/dev/null 2>&1

# Get latest version
LATEST=$(git tag --sort=-version:refname | head -1)
echo "Последняя версия: $LATEST"

# Compare versions
if [ "$CURRENT" = "$LATEST" ]; then
    echo "✅ У вас установлена последняя версия!"
else
    echo "🆕 Доступно обновление: $CURRENT → $LATEST"
    echo ""
    echo "Изменения в новой версии:"
    git tag -l --format='%(contents)' "$LATEST" | head -15
    echo ""
    echo "Для обновления выполните: ./update_platform.sh"
fi

# Show recent versions
echo ""
echo "📋 Последние 5 версий:"
git tag --sort=-version:refname | head -5 | while read tag; do
    date=$(git log -1 --format=%ai $tag 2>/dev/null | cut -d' ' -f1)
    echo "  $tag ($date)"
done