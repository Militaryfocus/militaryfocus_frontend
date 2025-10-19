#!/bin/bash

# Setup automatic updates via cron
echo "⚙️ Настройка автоматических обновлений"

# Create cron job for checking updates daily
CRON_JOB="0 2 * * * cd $(pwd) && ./check_updates.sh >> update_check.log 2>&1"

# Add to crontab
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "✅ Автоматическая проверка обновлений настроена"
echo "   Проверка будет выполняться каждый день в 02:00"
echo "   Логи: update_check.log"
echo ""
echo "Для автоматического обновления добавьте:"
echo "0 3 * * 0 cd $(pwd) && ./update_platform.sh >> auto_update.log 2>&1"