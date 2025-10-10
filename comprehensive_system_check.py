#!/usr/bin/env python3
"""
Комплексная проверка всей системы ML Community Platform
"""
import os
import sys
import json
import subprocess
from pathlib import Path
import re

def print_header(title):
    """Печать заголовка секции"""
    print(f"\n{'='*60}")
    print(f"🔍 {title}")
    print(f"{'='*60}")

def print_success(message):
    """Печать успешного сообщения"""
    print(f"✅ {message}")

def print_error(message):
    """Печать сообщения об ошибке"""
    print(f"❌ {message}")

def print_warning(message):
    """Печать предупреждения"""
    print(f"⚠️ {message}")

def check_file_structure():
    """Проверка структуры файлов проекта"""
    print_header("ПРОВЕРКА СТРУКТУРЫ ФАЙЛОВ")
    
    required_structure = {
        "backend/": [
            "app/",
            "app/main.py",
            "app/core/",
            "app/core/config.py",
            "app/core/database.py", 
            "app/core/security.py",
            "app/models/",
            "app/models/__init__.py",
            "app/schemas/",
            "app/schemas/user.py",
            "app/schemas/hero.py",
            "app/schemas/guide.py",
            "app/schemas/news.py",
            "app/crud/",
            "app/crud/user.py",
            "app/crud/hero.py",
            "app/crud/guide.py",
            "app/crud/news.py",
            "app/api/",
            "app/api/v1/",
            "app/api/v1/auth.py",
            "app/api/v1/heroes.py",
            "app/api/v1/guides.py",
            "app/api/v1/users.py",
            "app/api/v1/news.py",
            "app/api/v1/search.py",
            "requirements.txt",
            "alembic.ini",
            "alembic/env.py",
            "alembic/versions/001_initial.py"
        ],
        "frontend/": [
            "src/",
            "src/App.tsx",
            "src/index.tsx",
            "src/components/",
            "src/components/Layout/Layout.tsx",
            "src/components/Hero/HeroCard.tsx",
            "src/components/Guide/GuideCard.tsx",
            "src/components/News/NewsCard.tsx",
            "src/components/Search/SearchModal.tsx",
            "src/pages/",
            "src/pages/HomePage.tsx",
            "src/pages/LoginPage.tsx",
            "src/services/",
            "src/services/api.ts",
            "src/services/auth.tsx",
            "src/types/",
            "src/types/index.ts",
            "package.json",
            "tsconfig.json",
            "tailwind.config.js"
        ],
        "installer/": [
            "app.py",
            "server_setup.py",
            "run_installer.py",
            "requirements.txt",
            "templates/",
            "templates/base.html",
            "templates/index.html",
            "templates/step1_requirements.html",
            "templates/step2_database.html",
            "templates/step3_redis.html",
            "templates/step4_admin.html",
            "templates/step5_import.html",
            "templates/step6_complete.html"
        ]
    }
    
    missing_files = []
    for directory, files in required_structure.items():
        for file_path in files:
            full_path = Path(directory) / file_path
            if not full_path.exists():
                missing_files.append(str(full_path))
    
    if missing_files:
        print_error(f"Отсутствуют файлы: {len(missing_files)}")
        for file_path in missing_files[:10]:  # Показываем только первые 10
            print(f"  - {file_path}")
        if len(missing_files) > 10:
            print(f"  ... и еще {len(missing_files) - 10} файлов")
        return False
    else:
        print_success("Все необходимые файлы присутствуют")
        return True

def check_python_syntax():
    """Проверка синтаксиса Python файлов"""
    print_header("ПРОВЕРКА СИНТАКСИСА PYTHON")
    
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
        print_error(f"Найдены ошибки синтаксиса: {len(errors)}")
        for error in errors[:5]:  # Показываем только первые 5
            print(f"  {error}")
        return False
    else:
        print_success("Синтаксис Python файлов корректен")
        return True

def check_imports_and_dependencies():
    """Проверка импортов и зависимостей"""
    print_header("ПРОВЕРКА ИМПОРТОВ И ЗАВИСИМОСТЕЙ")
    
    # Проверяем requirements.txt
    backend_req = Path("backend/requirements.txt")
    if backend_req.exists():
        with open(backend_req, 'r') as f:
            requirements = f.read()
        
        required_packages = [
            "fastapi", "uvicorn", "sqlalchemy", "alembic", 
            "psycopg2-binary", "redis", "python-jose", 
            "passlib", "python-multipart", "pydantic", 
            "python-dotenv", "httpx", "pytest"
        ]
        
        missing_packages = []
        for package in required_packages:
            if package not in requirements:
                missing_packages.append(package)
        
        if missing_packages:
            print_error(f"Отсутствуют пакеты в requirements.txt: {', '.join(missing_packages)}")
            return False
        else:
            print_success("Все необходимые пакеты в requirements.txt")
    else:
        print_error("Файл requirements.txt не найден")
        return False
    
    # Проверяем package.json
    frontend_package = Path("frontend/package.json")
    if frontend_package.exists():
        with open(frontend_package, 'r') as f:
            package_data = json.load(f)
        
        required_deps = [
            "react", "react-dom", "react-router-dom", "axios",
            "react-query", "react-hook-form", "react-hot-toast",
            "framer-motion", "lucide-react", "typescript"
        ]
        
        missing_deps = []
        for dep in required_deps:
            if dep not in package_data.get("dependencies", {}):
                missing_deps.append(dep)
        
        if missing_deps:
            print_error(f"Отсутствуют зависимости в package.json: {', '.join(missing_deps)}")
            return False
        else:
            print_success("Все необходимые зависимости в package.json")
    else:
        print_error("Файл package.json не найден")
        return False
    
    return True

def check_database_models():
    """Проверка моделей базы данных"""
    print_header("ПРОВЕРКА МОДЕЛЕЙ БАЗЫ ДАННЫХ")
    
    models_file = Path("backend/app/models/__init__.py")
    if not models_file.exists():
        print_error("Файл моделей не найден")
        return False
    
    with open(models_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    required_classes = [
        "class User", "class Hero", "class BuildGuide", 
        "class News", "class Comment", "class GuideRating",
        "class HeroCounter", "class HeroSynergy", "class Item", "class Emblem"
    ]
    
    missing_classes = []
    for class_name in required_classes:
        if class_name not in content:
            missing_classes.append(class_name)
    
    if missing_classes:
        print_error(f"Отсутствуют классы моделей: {', '.join(missing_classes)}")
        return False
    
    # Проверяем связи между моделями
    relationship_patterns = [
        r'relationship\("User"',
        r'relationship\("Hero"',
        r'relationship\("BuildGuide"',
        r'relationship\("News"'
    ]
    
    missing_relationships = []
    for pattern in relationship_patterns:
        if not re.search(pattern, content):
            missing_relationships.append(pattern)
    
    if missing_relationships:
        print_warning(f"Возможно отсутствуют связи: {len(missing_relationships)}")
    
    print_success("Модели базы данных корректны")
    return True

def check_api_endpoints():
    """Проверка API эндпоинтов"""
    print_header("ПРОВЕРКА API ЭНДПОИНТОВ")
    
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
        print_error(f"Отсутствуют файлы API: {', '.join(missing_files)}")
        return False
    
    # Проверяем main.py
    main_file = Path("backend/app/main.py")
    if not main_file.exists():
        print_error("Файл main.py не найден")
        return False
    
    with open(main_file, 'r', encoding='utf-8') as f:
        main_content = f.read()
    
    expected_patterns = [
        r'@app\.get\("/api/health"\)',
        r'@app\.get\("/"\)',
        r'@app\.get\("/api/v1"\)',
        r'app\.include_router\(heroes\.router',
        r'app\.include_router\(guides\.router',
        r'app\.include_router\(users\.router',
        r'app\.include_router\(auth\.router',
        r'app\.include_router\(search\.router',
        r'app\.include_router\(news\.router'
    ]
    
    missing_patterns = []
    for pattern in expected_patterns:
        if not re.search(pattern, main_content):
            missing_patterns.append(pattern)
    
    if missing_patterns:
        print_error(f"Отсутствуют паттерны в main.py: {len(missing_patterns)}")
        return False
    
    print_success("API эндпоинты корректны")
    return True

def check_frontend_components():
    """Проверка frontend компонентов"""
    print_header("ПРОВЕРКА FRONTEND КОМПОНЕНТОВ")
    
    # Проверяем основные компоненты
    component_files = [
        "frontend/src/components/Layout/Layout.tsx",
        "frontend/src/components/Hero/HeroCard.tsx",
        "frontend/src/components/Guide/GuideCard.tsx",
        "frontend/src/components/News/NewsCard.tsx",
        "frontend/src/components/Search/SearchModal.tsx"
    ]
    
    missing_components = []
    for file_path in component_files:
        if not Path(file_path).exists():
            missing_components.append(file_path)
    
    if missing_components:
        print_error(f"Отсутствуют компоненты: {', '.join(missing_components)}")
        return False
    
    # Проверяем CSS файл
    css_file = Path("frontend/src/components/components.css")
    if not css_file.exists():
        print_error("Файл components.css не найден")
        return False
    
    # Проверяем типы
    types_file = Path("frontend/src/types/index.ts")
    if not types_file.exists():
        print_error("Файл типов не найден")
        return False
    
    with open(types_file, 'r', encoding='utf-8') as f:
        types_content = f.read()
    
    required_types = [
        "interface Hero", "interface User", "interface BuildGuide",
        "interface News", "interface AuthResponse", "interface LoginRequest"
    ]
    
    missing_types = []
    for type_name in required_types:
        if type_name not in types_content:
            missing_types.append(type_name)
    
    if missing_types:
        print_error(f"Отсутствуют типы: {', '.join(missing_types)}")
        return False
    
    print_success("Frontend компоненты корректны")
    return True

def check_installer():
    """Проверка установщика"""
    print_header("ПРОВЕРКА УСТАНОВЩИКА")
    
    installer_files = [
        "installer/app.py",
        "installer/server_setup.py", 
        "installer/run_installer.py",
        "installer/requirements.txt",
        "installer/quick_start.sh"
    ]
    
    missing_files = []
    for file_path in installer_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
    
    if missing_files:
        print_error(f"Отсутствуют файлы установщика: {', '.join(missing_files)}")
        return False
    
    # Проверяем шаблоны
    template_files = [
        "installer/templates/base.html",
        "installer/templates/index.html",
        "installer/templates/step1_requirements.html",
        "installer/templates/step2_database.html",
        "installer/templates/step3_redis.html",
        "installer/templates/step4_admin.html",
        "installer/templates/step5_import.html",
        "installer/templates/step6_complete.html"
    ]
    
    missing_templates = []
    for file_path in template_files:
        if not Path(file_path).exists():
            missing_templates.append(file_path)
    
    if missing_templates:
        print_error(f"Отсутствуют шаблоны: {', '.join(missing_templates)}")
        return False
    
    print_success("Установщик корректен")
    return True

def check_security():
    """Проверка безопасности"""
    print_header("ПРОВЕРКА БЕЗОПАСНОСТИ")
    
    # Проверяем конфигурацию
    config_file = Path("backend/app/core/config.py")
    if not config_file.exists():
        print_error("Файл конфигурации не найден")
        return False
    
    with open(config_file, 'r', encoding='utf-8') as f:
        config_content = f.read()
    
    # Проверяем security.py
    security_file = Path("backend/app/core/security.py")
    if not security_file.exists():
        print_error("Файл security.py не найден")
        return False
    
    with open(security_file, 'r', encoding='utf-8') as f:
        security_content = f.read()
    
    security_checks = [
        ("SECRET_KEY validation", "validate_secret_key" in config_content),
        ("CORS configuration", "BACKEND_CORS_ORIGINS" in config_content),
        ("Password hashing", "get_password_hash" in security_content),
        ("JWT token validation", "verify_token" in security_content),
        ("Role-based access", "get_current_admin_user" in security_content)
    ]
    
    failed_checks = []
    for check_name, check_result in security_checks:
        if not check_result:
            failed_checks.append(check_name)
    
    if failed_checks:
        print_error(f"Проблемы безопасности: {', '.join(failed_checks)}")
        return False
    
    print_success("Проверки безопасности пройдены")
    return True

def check_documentation():
    """Проверка документации"""
    print_header("ПРОВЕРКА ДОКУМЕНТАЦИИ")
    
    doc_files = [
        "README.md",
        "INSTALLER_README.md",
        "backend/requirements.txt",
        "frontend/package.json"
    ]
    
    missing_docs = []
    for file_path in doc_files:
        if not Path(file_path).exists():
            missing_docs.append(file_path)
    
    if missing_docs:
        print_error(f"Отсутствует документация: {', '.join(missing_docs)}")
        return False
    
    print_success("Документация присутствует")
    return True

def main():
    """Главная функция проверки"""
    print("🔧 КОМПЛЕКСНАЯ ПРОВЕРКА СИСТЕМЫ ML COMMUNITY PLATFORM")
    print("=" * 60)
    
    checks = [
        ("Структура файлов", check_file_structure),
        ("Синтаксис Python", check_python_syntax),
        ("Импорты и зависимости", check_imports_and_dependencies),
        ("Модели БД", check_database_models),
        ("API эндпоинты", check_api_endpoints),
        ("Frontend компоненты", check_frontend_components),
        ("Установщик", check_installer),
        ("Безопасность", check_security),
        ("Документация", check_documentation)
    ]
    
    results = []
    for name, check_func in checks:
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print_error(f"Ошибка проверки {name}: {e}")
            results.append((name, False))
    
    print_header("ИТОГОВЫЙ ОТЧЕТ")
    
    passed = 0
    total = len(results)
    
    for name, result in results:
        status = "✅ ПРОЙДЕНО" if result else "❌ ОШИБКА"
        print(f"{name}: {status}")
        if result:
            passed += 1
    
    print(f"\nРезультат: {passed}/{total} проверок пройдено")
    
    if passed == total:
        print_success("🎉 ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ УСПЕШНО!")
        print("Система готова к развертыванию!")
        return 0
    else:
        print_error(f"⚠️ {total - passed} ПРОВЕРОК НЕ ПРОЙДЕНО")
        print("Необходимо исправить ошибки перед развертыванием")
        return 1

if __name__ == "__main__":
    sys.exit(main())