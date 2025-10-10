#!/usr/bin/env python3
"""
Скрипт запуска веб-установщика
"""
import os
import sys
import subprocess
from pathlib import Path

def check_requirements():
    """Проверка требований для установщика"""
    print("🔍 Проверка требований...")
    
    # Проверка Python
    if sys.version_info < (3, 8):
        print("❌ Требуется Python 3.8 или выше")
        return False
    
    # Проверка pip
    try:
        import pip
    except ImportError:
        print("❌ pip не установлен")
        return False
    
    print("✅ Требования выполнены")
    return True

def install_dependencies():
    """Установка зависимостей установщика"""
    print("📦 Установка зависимостей...")
    
    try:
        installer_path = Path(__file__).parent
        requirements_file = installer_path / "requirements.txt"
        
        subprocess.run([
            sys.executable, "-m", "pip", "install", "-r", str(requirements_file)
        ], check=True)
        
        print("✅ Зависимости установлены")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Ошибка установки зависимостей: {e}")
        return False

def run_installer():
    """Запуск установщика"""
    print("🚀 Запуск веб-установщика...")
    
    try:
        installer_path = Path(__file__).parent
        app_file = installer_path / "app.py"
        
        # Установка переменных окружения
        os.environ['FLASK_APP'] = str(app_file)
        os.environ['FLASK_ENV'] = 'development'
        
        # Запуск Flask приложения
        subprocess.run([
            sys.executable, str(app_file)
        ], check=True)
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Ошибка запуска установщика: {e}")
        return False
    except KeyboardInterrupt:
        print("\n👋 Установщик остановлен пользователем")
        return True

def main():
    """Главная функция"""
    print("=" * 60)
    print("🌐 ML Community Web Installer")
    print("=" * 60)
    print()
    
    # Проверка требований
    if not check_requirements():
        sys.exit(1)
    
    # Установка зависимостей
    if not install_dependencies():
        sys.exit(1)
    
    print()
    print("🎯 Установщик готов к запуску!")
    print("📱 Откройте браузер и перейдите по адресу: http://localhost:5000")
    print("⏹️  Для остановки нажмите Ctrl+C")
    print()
    
    # Запуск установщика
    run_installer()

if __name__ == "__main__":
    main()