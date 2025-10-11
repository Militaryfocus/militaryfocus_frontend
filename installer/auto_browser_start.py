#!/usr/bin/env python3
"""
Автоматический запуск установщика с открытием браузера
Запускается при старте системы и открывает браузер
"""

import os
import sys
import time
import subprocess
import webbrowser
import threading
import signal
from pathlib import Path

class AutoBrowserInstaller:
    def __init__(self):
        self.installer_process = None
        self.installer_url = "http://localhost:5000"
        self.max_retries = 5
        self.retry_delay = 3
        
    def start_installer(self):
        """Запускает установщик в фоновом режиме"""
        try:
            print("🚀 Запускаем Military Focus Installer...")
            
            # Определяем путь к run_installer.py
            installer_script = Path(__file__).parent / "run_installer.py"
            
            if not installer_script.exists():
                print("❌ Ошибка: Файл run_installer.py не найден!")
                return False
                
            # Запускаем установщик
            self.installer_process = subprocess.Popen(
                [sys.executable, str(installer_script)],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                cwd=installer_script.parent
            )
            
            print("✅ Установщик запущен")
            return True
            
        except Exception as e:
            print(f"❌ Ошибка запуска установщика: {e}")
            return False
    
    def wait_for_installer(self):
        """Ждет готовности установщика с повторными попытками"""
        print("⏳ Ожидаем готовности установщика...")
        
        for attempt in range(self.max_retries):
            try:
                import requests
                response = requests.get(self.installer_url, timeout=2)
                if response.status_code == 200:
                    print("✅ Установщик готов!")
                    return True
            except Exception as e:
                print(f"🔄 Попытка {attempt + 1}/{self.max_retries}: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
        
        print("⚠️ Не удалось подключиться к установщику")
        return False
    
    def open_browser(self):
        """Открывает браузер с установщиком"""
        try:
            print("🌐 Открываем браузер...")
            
            # Пробуем разные браузеры
            browsers = [
                'xdg-open',  # Linux default
                'google-chrome',
                'chromium-browser',
                'firefox',
                'opera',
                'safari'
            ]
            
            for browser in browsers:
                try:
                    if browser == 'xdg-open':
                        subprocess.Popen([browser, self.installer_url])
                    else:
                        subprocess.Popen([browser, self.installer_url])
                    print(f"✅ Браузер {browser} открыт!")
                    return True
                except FileNotFoundError:
                    continue
            
            # Fallback - используем webbrowser модуль
            webbrowser.open(self.installer_url)
            print("✅ Браузер открыт через webbrowser!")
            return True
            
        except Exception as e:
            print(f"❌ Ошибка открытия браузера: {e}")
            return False
    
    def run(self):
        """Основной метод запуска"""
        print("=" * 50)
        print("🎯 Military Focus - Автозапуск")
        print("=" * 50)
        
        try:
            # 1. Запускаем установщик
            if not self.start_installer():
                return False
            
            # 2. Ждем готовности
            if not self.wait_for_installer():
                return False
            
            # 3. Открываем браузер
            if not self.open_browser():
                return False
            
            print("\n🎉 Установщик запущен и браузер открыт!")
            print(f"🌐 Адрес: {self.installer_url}")
            
            # 4. Ждем завершения установщика
            if self.installer_process:
                self.installer_process.wait()
            
        except KeyboardInterrupt:
            print("\n🛑 Остановка...")
        except Exception as e:
            print(f"❌ Ошибка: {e}")
        finally:
            if self.installer_process:
                self.installer_process.terminate()
        
        return True

def main():
    """Точка входа"""
    installer = AutoBrowserInstaller()
    success = installer.run()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()