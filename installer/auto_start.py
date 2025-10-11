#!/usr/bin/env python3
"""
Автоматический запуск установщика Military Focus
Запускает установщик и автоматически открывает браузер
"""

import os
import sys
import time
import subprocess
import webbrowser
import threading
import signal
from pathlib import Path

class AutoInstaller:
    def __init__(self):
        self.installer_process = None
        self.browser_opened = False
        self.installer_url = "http://localhost:5000"
        
    def start_installer(self):
        """Запускает установщик в фоновом режиме"""
        try:
            print("🚀 Запускаем установщик Military Focus...")
            
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
            
            print("✅ Установщик запущен в фоновом режиме")
            return True
            
        except Exception as e:
            print(f"❌ Ошибка запуска установщика: {e}")
            return False
    
    def wait_for_installer(self, timeout=30):
        """Ждет готовности установщика"""
        print("⏳ Ожидаем готовности установщика...")
        
        start_time = time.time()
        while time.time() - start_time < timeout:
            try:
                import requests
                response = requests.get(self.installer_url, timeout=2)
                if response.status_code == 200:
                    print("✅ Установщик готов!")
                    return True
            except:
                pass
            time.sleep(1)
        
        print("⚠️ Таймаут ожидания установщика")
        return False
    
    def open_browser(self):
        """Открывает браузер с установщиком"""
        try:
            print("🌐 Открываем браузер...")
            webbrowser.open(self.installer_url)
            self.browser_opened = True
            print("✅ Браузер открыт!")
            return True
        except Exception as e:
            print(f"❌ Ошибка открытия браузера: {e}")
            return False
    
    def monitor_installer(self):
        """Мониторит работу установщика"""
        while self.installer_process and self.installer_process.poll() is None:
            time.sleep(1)
        
        if self.installer_process:
            return_code = self.installer_process.returncode
            if return_code != 0:
                print(f"❌ Установщик завершился с ошибкой (код: {return_code})")
            else:
                print("✅ Установщик завершил работу")
    
    def cleanup(self):
        """Очистка ресурсов"""
        if self.installer_process:
            try:
                self.installer_process.terminate()
                self.installer_process.wait(timeout=5)
            except:
                try:
                    self.installer_process.kill()
                except:
                    pass
    
    def run(self):
        """Основной метод запуска"""
        print("=" * 60)
        print("🎯 Military Focus - Автоматический установщик")
        print("=" * 60)
        
        # Обработчик сигналов для корректного завершения
        def signal_handler(signum, frame):
            print("\n🛑 Получен сигнал завершения...")
            self.cleanup()
            sys.exit(0)
        
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)
        
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
            
            print("\n" + "=" * 60)
            print("🎉 Установщик запущен и готов к работе!")
            print(f"🌐 Адрес: {self.installer_url}")
            print("📝 Для остановки нажмите Ctrl+C")
            print("=" * 60)
            
            # 4. Мониторим работу установщика
            self.monitor_installer()
            
        except KeyboardInterrupt:
            print("\n🛑 Остановка по запросу пользователя...")
        except Exception as e:
            print(f"❌ Неожиданная ошибка: {e}")
        finally:
            self.cleanup()
        
        return True

def main():
    """Точка входа"""
    installer = AutoInstaller()
    success = installer.run()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()