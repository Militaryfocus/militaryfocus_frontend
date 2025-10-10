#!/usr/bin/env python3
"""
Скрипт для проверки исправлений и поиска оставшихся проблем
"""
import os
import sys
import subprocess
from pathlib import Path

def check_python_syntax():
    """Проверка синтаксиса Python файлов"""
    print("🔍 Проверка синтаксиса Python файлов...")
    
    backend_path = Path("backend")
    python_files = list(backend_path.rglob("*.py"))
    
    errors = []
    for file_path in python_files:
        try:
            result = subprocess.run(
                [sys.executable, "-m", "py_compile", str(file_path)],
                capture_output=True,
                text=True
            )
            if result.returncode != 0:
                errors.append(f"{file_path}: {result.stderr}")
        except Exception as e:
            errors.append(f"{file_path}: {e}")
    
    if errors:
        print("❌ Найдены ошибки синтаксиса:")
        for error in errors:
            print(f"  {error}")
        return False
    else:
        print("✅ Синтаксис Python файлов корректен")
        return True

def check_imports():
    """Проверка импортов"""
    print("🔍 Проверка импортов...")
    
    backend_path = Path("backend")
    
    # Проверяем наличие файлов модулей
    modules_to_check = [
        "app/main.py",
        "app/core/config.py",
        "app/core/database.py",
        "app/core/security.py",
        "app/models/__init__.py",
        "app/schemas/user.py",
        "app/schemas/hero.py",
        "app/schemas/guide.py",
        "app/schemas/news.py",
        "app/crud/user.py",
        "app/crud/hero.py",
        "app/crud/guide.py",
        "app/crud/news.py",
        "app/api/v1/auth.py",
        "app/api/v1/heroes.py",
        "app/api/v1/guides.py",
        "app/api/v1/users.py",
        "app/api/v1/news.py",
        "app/api/v1/search.py"
    ]
    
    missing_files = []
    for module_path in modules_to_check:
        full_path = backend_path / module_path
        if not full_path.exists():
            missing_files.append(module_path)
    
    if missing_files:
        print("❌ Отсутствуют файлы модулей:")
        for file_path in missing_files:
            print(f"  {file_path}")
        return False
    else:
        print("✅ Все файлы модулей присутствуют")
        return True

def check_frontend_dependencies():
    """Проверка зависимостей frontend"""
    print("🔍 Проверка зависимостей frontend...")
    
    frontend_path = Path("frontend")
    package_json = frontend_path / "package.json"
    
    if not package_json.exists():
        print("❌ package.json не найден")
        return False
    
    try:
        import json
        with open(package_json, 'r') as f:
            data = json.load(f)
        
        required_deps = [
            "react", "react-dom", "react-router-dom",
            "axios", "react-query", "react-hook-form",
            "react-hot-toast", "framer-motion", "lucide-react"
        ]
        
        missing_deps = []
        for dep in required_deps:
            if dep not in data.get("dependencies", {}):
                missing_deps.append(dep)
        
        if missing_deps:
            print(f"❌ Отсутствуют зависимости: {', '.join(missing_deps)}")
            return False
        else:
            print("✅ Все зависимости frontend присутствуют")
            return True
            
    except Exception as e:
        print(f"❌ Ошибка проверки package.json: {e}")
        return False

def check_database_models():
    """Проверка моделей базы данных"""
    print("🔍 Проверка моделей базы данных...")
    
    try:
        # Проверяем наличие файла моделей
        models_file = Path("backend/app/models/__init__.py")
        if not models_file.exists():
            print("❌ Файл моделей не найден")
            return False
        
        # Читаем файл и проверяем наличие основных классов
        with open(models_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        required_classes = [
            "class User",
            "class Hero", 
            "class BuildGuide",
            "class News",
            "class Comment",
            "class GuideRating"
        ]
        
        missing_classes = []
        for class_name in required_classes:
            if class_name not in content:
                missing_classes.append(class_name)
        
        if missing_classes:
            print(f"❌ Отсутствуют классы моделей: {', '.join(missing_classes)}")
            return False
        
        print("✅ Модели базы данных присутствуют")
        return True
        
    except Exception as e:
        print(f"❌ Ошибка проверки моделей: {e}")
        return False

def check_api_routes():
    """Проверка API роутов"""
    print("🔍 Проверка API роутов...")
    
    try:
        # Проверяем наличие файлов API роутов
        api_files = [
            "backend/app/api/v1/auth.py",
            "backend/app/api/v1/heroes.py", 
            "backend/app/api/v1/guides.py",
            "backend/app/api/v1/users.py",
            "backend/app/api/v1/news.py",
            "backend/app/api/v1/search.py"
        ]
        
        missing_files = []
        for file_path in api_files:
            if not Path(file_path).exists():
                missing_files.append(file_path)
        
        if missing_files:
            print(f"❌ Отсутствуют файлы API: {', '.join(missing_files)}")
            return False
        
        # Проверяем main.py
        main_file = Path("backend/app/main.py")
        if not main_file.exists():
            print("❌ Файл main.py не найден")
            return False
        
        # Читаем main.py и проверяем наличие основных роутов
        with open(main_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        expected_routes = [
            "@app.get(\"/api/health\")",
            "@app.get(\"/\")",
            "@app.get(\"/api/v1\")",
            "app.include_router(heroes.router",
            "app.include_router(guides.router",
            "app.include_router(users.router",
            "app.include_router(auth.router",
            "app.include_router(search.router",
            "app.include_router(news.router"
        ]
        
        missing_routes = []
        for route in expected_routes:
            if route not in content:
                missing_routes.append(route)
        
        if missing_routes:
            print(f"❌ Отсутствуют роуты в main.py: {', '.join(missing_routes)}")
            return False
        
        print("✅ API роуты присутствуют")
        return True
        
    except Exception as e:
        print(f"❌ Ошибка проверки API роутов: {e}")
        return False

def check_installer():
    """Проверка установщика"""
    print("🔍 Проверка установщика...")
    
    installer_path = Path("installer")
    
    required_files = [
        "app.py",
        "server_setup.py",
        "run_installer.py",
        "requirements.txt",
        "templates/base.html",
        "templates/index.html"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not (installer_path / file_path).exists():
            missing_files.append(file_path)
    
    if missing_files:
        print(f"❌ Отсутствуют файлы установщика: {', '.join(missing_files)}")
        return False
    else:
        print("✅ Все файлы установщика присутствуют")
        return True

def main():
    """Главная функция проверки"""
    print("🔧 Проверка исправлений и поиск проблем")
    print("=" * 50)
    
    checks = [
        ("Синтаксис Python", check_python_syntax),
        ("Импорты", check_imports),
        ("Зависимости Frontend", check_frontend_dependencies),
        ("Модели БД", check_database_models),
        ("API роуты", check_api_routes),
        ("Установщик", check_installer)
    ]
    
    results = []
    for name, check_func in checks:
        print(f"\n📋 {name}:")
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print(f"❌ Ошибка проверки {name}: {e}")
            results.append((name, False))
    
    print("\n" + "=" * 50)
    print("📊 ИТОГОВЫЙ ОТЧЕТ")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for name, result in results:
        status = "✅ ПРОЙДЕНО" if result else "❌ ОШИБКА"
        print(f"{name}: {status}")
        if result:
            passed += 1
    
    print(f"\nРезультат: {passed}/{total} проверок пройдено")
    
    if passed == total:
        print("🎉 Все проверки пройдены успешно!")
        return 0
    else:
        print("⚠️ Некоторые проверки не пройдены. Проверьте ошибки выше.")
        return 1

if __name__ == "__main__":
    sys.exit(main())