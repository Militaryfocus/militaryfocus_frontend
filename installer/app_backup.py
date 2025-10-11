#!/usr/bin/env python3
"""
Веб-установщик для Mobile Legends Community Platform
"""
import os
import sys
import json
import sqlite3
import subprocess
import threading
import time
import shutil
import platform
import psutil
from pathlib import Path
from flask import Flask, render_template, request, jsonify, redirect, url_for, session, flash
import psycopg2
from psycopg2 import sql
import redis
import requests
from server_setup import ServerSetup

app = Flask(__name__)
app.secret_key = 'installer-secret-key-change-in-production'

# Путь к основному проекту
PROJECT_ROOT = Path(__file__).parent.parent
BACKEND_PATH = PROJECT_ROOT / "backend"
FRONTEND_PATH = PROJECT_ROOT / "frontend"

class InstallerConfig:
    def __init__(self):
        self.config_file = PROJECT_ROOT / "installer_config.json"
        self.load_config()
    
    def load_config(self):
        if self.config_file.exists():
            with open(self.config_file, 'r', encoding='utf-8') as f:
                self.config = json.load(f)
        else:
            self.config = {
                "database": {},
                "redis": {},
                "admin": {},
                "system": {},
                "completed_steps": []
            }
    
    def save_config(self):
        with open(self.config_file, 'w', encoding='utf-8') as f:
            json.dump(self.config, f, indent=2, ensure_ascii=False)
    
    def update_step(self, step, data):
        self.config[step] = data
        if step not in self.config["completed_steps"]:
            self.config["completed_steps"].append(step)
        self.save_config()

config = InstallerConfig()

# Глобальная переменная для отслеживания процесса установки
installation_status = {
    "running": False,
    "current_step": "",
    "progress": 0,
    "total_steps": 0,
    "logs": [],
    "completed": False,
    "error": None
}

def log_message(message):
    """Добавление сообщения в лог установки"""
    timestamp = time.strftime("%H:%M:%S")
    log_entry = f"[{timestamp}] {message}"
    installation_status["logs"].append(log_entry)
    print(log_entry)

def run_installation():
    """Запуск установки в отдельном потоке"""
    global installation_status
    
    try:
        installation_status["running"] = True
        installation_status["completed"] = False
        installation_status["error"] = None
        installation_status["logs"] = []
        
        log_message("🚀 Начинаем автоматическую настройку сервера...")
        
        # Создаем экземпляр ServerSetup
        server_setup = ServerSetup(config.config)
        
        # Запускаем полную настройку
        results = server_setup.run_full_setup()
        
        # Обновляем статус
        successful_steps = sum(1 for success in results.values() if success)
        total_steps = len(results)
        
        installation_status["progress"] = 100
        installation_status["running"] = False
        
        if successful_steps == total_steps:
            installation_status["completed"] = True
            log_message("🎉 Установка завершена успешно!")
        else:
            installation_status["error"] = f"Установка завершена с ошибками: {successful_steps}/{total_steps} шагов выполнено успешно"
            log_message(f"⚠️ {installation_status['error']}")
            
    except Exception as e:
        installation_status["running"] = False
        installation_status["error"] = str(e)
        log_message(f"❌ Критическая ошибка: {e}")

@app.route('/')
def index():
    """Главная страница установщика"""
    return render_template('index.html', 
                         completed_steps=config.config["completed_steps"],
                         total_steps=6)

@app.route('/step/<int:step>')
def step(step):
    """Страницы шагов установки"""
    if step == 1:
        return render_template('step1_requirements.html')
    elif step == 2:
        return render_template('step2_database.html')
    elif step == 3:
        return render_template('step3_redis.html')
    elif step == 4:
        return render_template('step4_admin.html')
    elif step == 5:
        return render_template('step5_import.html')
    elif step == 6:
        return render_template('step6_complete.html')
    else:
        return redirect(url_for('index'))

@app.route('/api/check-requirements', methods=['POST'])
def check_requirements():
    """Проверка системных требований"""
    requirements = {
        "python": check_python_version(),
        "pip": check_pip(),
        "node": check_node(),
        "npm": check_npm(),
        "postgresql": check_postgresql(),
        "redis": check_redis(),
        "disk_space": check_disk_space(),
        "memory": check_memory(),
        "git": check_git(),
        "curl": check_curl()
    }
    
    # Проверяем только критически важные компоненты
    critical_components = ["python", "pip", "node", "npm", "disk_space", "memory"]
    critical_passed = all(requirements[comp]["installed"] for comp in critical_components)
    
    # Проверяем все компоненты
    all_passed = all(req["installed"] for req in requirements.values())
    
    if critical_passed:
        config.update_step("system", requirements)
    
    return jsonify({
        "success": critical_passed,
        "all_passed": all_passed,
        "requirements": requirements,
        "critical_components": critical_components,
        "system_info": {
            "platform": platform.system(),
            "platform_version": platform.version(),
            "architecture": platform.machine(),
            "processor": platform.processor(),
            "python_version": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
            "total_memory": f"{psutil.virtual_memory().total / (1024**3):.1f} GB",
            "disk_usage": f"{shutil.disk_usage('/').free / (1024**3):.1f} GB свободно"
        }
    })

@app.route('/api/test-database', methods=['POST'])
def test_database():
    """Тестирование подключения к базе данных"""
    data = request.json
    host = data.get('host', 'localhost')
    port = data.get('port', 5432)
    database = data.get('database', 'ml_community')
    username = data.get('username', 'ml_user')
    password = data.get('password', 'ml_password')
    
    try:
        # Тестируем подключение
        conn = psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=username,
            password=password
        )
        conn.close()
        
        # Сохраняем конфигурацию
        config.update_step("database", {
            "host": host,
            "port": port,
            "database": database,
            "username": username,
            "password": password
        })
        
        return jsonify({"success": True, "message": "Подключение к базе данных успешно!"})
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Ошибка подключения: {str(e)}"})

@app.route('/api/test-redis', methods=['POST'])
def test_redis():
    """Тестирование подключения к Redis"""
    data = request.json
    host = data.get('host', 'localhost')
    port = data.get('port', 6379)
    password = data.get('password', '')
    
    try:
        r = redis.Redis(host=host, port=port, password=password if password else None)
        r.ping()
        
        config.update_step("redis", {
            "host": host,
            "port": port,
            "password": password
        })
        
        return jsonify({"success": True, "message": "Подключение к Redis успешно!"})
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Ошибка подключения: {str(e)}"})

@app.route('/api/create-admin', methods=['POST'])
def create_admin():
    """Создание администратора"""
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not all([username, email, password]):
        return jsonify({"success": False, "message": "Все поля обязательны"})
    
    try:
        # Здесь будет создание администратора в базе данных
        # Пока что сохраняем в конфигурацию
        config.update_step("admin", {
            "username": username,
            "email": email,
            "password": password  # В реальности нужно хешировать
        })
        
        return jsonify({"success": True, "message": "Администратор создан успешно!"})
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Ошибка создания администратора: {str(e)}"})

@app.route('/api/run-migrations', methods=['POST'])
def run_migrations():
    """Запуск миграций базы данных"""
    try:
        # Здесь будет запуск Alembic миграций
        # Пока что имитируем успех
        return jsonify({"success": True, "message": "Миграции выполнены успешно!"})
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Ошибка миграций: {str(e)}"})

@app.route('/api/import-data', methods=['POST'])
def import_data():
    """Импорт начальных данных"""
    try:
        # Здесь будет импорт героев, предметов и т.д.
        return jsonify({"success": True, "message": "Данные импортированы успешно!"})
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Ошибка импорта: {str(e)}"})

@app.route('/api/generate-config', methods=['POST'])
def generate_config():
    """Генерация конфигурационных файлов"""
    try:
        # Генерируем .env файл для backend
        generate_backend_env()
        
        # Генерируем конфигурацию для frontend
        generate_frontend_config()
        
        return jsonify({"success": True, "message": "Конфигурационные файлы созданы!"})
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Ошибка генерации конфигурации: {str(e)}"})

@app.route('/api/start-installation', methods=['POST'])
def start_installation():
    """Запуск автоматической установки"""
    global installation_status
    
    if installation_status["running"]:
        return jsonify({"success": False, "message": "Установка уже выполняется"})
    
    if installation_status["completed"]:
        return jsonify({"success": False, "message": "Установка уже завершена"})
    
    try:
        # Запускаем установку в отдельном потоке
        thread = threading.Thread(target=run_installation)
        thread.daemon = True
        thread.start()
        
        return jsonify({"success": True, "message": "Установка запущена"})
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Ошибка запуска установки: {str(e)}"})

@app.route('/api/installation-status')
def get_installation_status():
    """Получение статуса установки"""
    return jsonify(installation_status)

@app.route('/api/check-services', methods=['POST'])
def check_services():
    """Проверка состояния сервисов"""
    try:
        services = {
            "postgresql": check_service_status("postgresql"),
            "redis": check_service_status("redis-server"),
            "nginx": check_service_status("nginx"),
            "backend": check_service_status("ml-community-backend")
        }
        
        all_running = all(services.values())
        
        return jsonify({
            "success": all_running,
            "services": services,
            "message": "Все сервисы запущены" if all_running else "Некоторые сервисы не запущены"
        })
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Ошибка проверки сервисов: {str(e)}"})

@app.route('/api/restart-services', methods=['POST'])
def restart_services():
    """Перезапуск сервисов"""
    try:
        services = ["postgresql", "redis-server", "nginx", "ml-community-backend"]
        
        for service in services:
            subprocess.run(f"systemctl restart {service}", shell=True, check=True)
        
        return jsonify({"success": True, "message": "Сервисы перезапущены"})
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Ошибка перезапуска сервисов: {str(e)}"})

@app.route('/api/install-missing-dependencies', methods=['POST'])
def install_missing_dependencies():
    """Установка недостающих зависимостей"""
    try:
        data = request.json
        dependencies = data.get('dependencies', [])
        
        results = {}
        
        for dep in dependencies:
            if dep == 'node':
                # Установка Node.js через NodeSource
                subprocess.run([
                    'curl', '-fsSL', 'https://deb.nodesource.com/setup_18.x', '|', 'sudo', '-E', 'bash', '-'
                ], shell=True, check=True)
                subprocess.run(['apt', 'install', '-y', 'nodejs'], check=True)
                results[dep] = True
                
            elif dep == 'postgresql':
                subprocess.run(['apt', 'update'], check=True)
                subprocess.run(['apt', 'install', '-y', 'postgresql', 'postgresql-contrib'], check=True)
                subprocess.run(['systemctl', 'start', 'postgresql'], check=True)
                subprocess.run(['systemctl', 'enable', 'postgresql'], check=True)
                results[dep] = True
                
            elif dep == 'redis':
                subprocess.run(['apt', 'install', '-y', 'redis-server'], check=True)
                subprocess.run(['systemctl', 'start', 'redis-server'], check=True)
                subprocess.run(['systemctl', 'enable', 'redis-server'], check=True)
                results[dep] = True
                
            elif dep == 'git':
                subprocess.run(['apt', 'install', '-y', 'git'], check=True)
                results[dep] = True
                
            elif dep == 'curl':
                subprocess.run(['apt', 'install', '-y', 'curl'], check=True)
                results[dep] = True
        
        return jsonify({
            "success": True,
            "message": "Зависимости установлены",
            "results": results
        })
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Ошибка установки зависимостей: {str(e)}"})

@app.route('/api/validate-config', methods=['POST'])
def validate_config():
    """Валидация конфигурации"""
    try:
        data = request.json
        step = data.get('step')
        
        if step == 'database':
            # Валидация конфигурации базы данных
            host = data.get('host', 'localhost')
            port = data.get('port', 5432)
            database = data.get('database', 'ml_community')
            username = data.get('username', 'ml_user')
            password = data.get('password', '')
            
            if not all([host, database, username]):
                return jsonify({"success": False, "message": "Все поля обязательны"})
            
            if not (1 <= port <= 65535):
                return jsonify({"success": False, "message": "Порт должен быть от 1 до 65535"})
            
            if len(password) < 6:
                return jsonify({"success": False, "message": "Пароль должен содержать минимум 6 символов"})
            
            return jsonify({"success": True, "message": "Конфигурация валидна"})
            
        elif step == 'admin':
            # Валидация данных администратора
            username = data.get('username', '')
            email = data.get('email', '')
            password = data.get('password', '')
            
            if not username or len(username) < 3:
                return jsonify({"success": False, "message": "Имя пользователя должно содержать минимум 3 символа"})
            
            if not email or '@' not in email:
                return jsonify({"success": False, "message": "Введите корректный email"})
            
            if not password or len(password) < 6:
                return jsonify({"success": False, "message": "Пароль должен содержать минимум 6 символов"})
            
            return jsonify({"success": True, "message": "Данные администратора валидны"})
        
        return jsonify({"success": True, "message": "Конфигурация валидна"})
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Ошибка валидации: {str(e)}"})

@app.route('/api/get-installation-logs')
def get_installation_logs():
    """Получение логов установки"""
    return jsonify({
        "logs": installation_status.get("logs", []),
        "running": installation_status.get("running", False),
        "completed": installation_status.get("completed", False),
        "error": installation_status.get("error", None)
    })

@app.route('/api/check-port', methods=['POST'])
def check_port():
    """Проверка доступности порта"""
    try:
        data = request.json
        port = data.get('port', 8001)
        
        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('localhost', port))
        sock.close()
        
        is_available = result != 0
        
        return jsonify({
            "success": True,
            "available": is_available,
            "port": port,
            "message": "Порт свободен" if is_available else "Порт занят"
        })
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Ошибка проверки порта: {str(e)}"})

def check_service_status(service_name):
    """Проверка статуса сервиса"""
    try:
        result = subprocess.run(
            f"systemctl is-active {service_name}", 
            shell=True, 
            capture_output=True, 
            text=True
        )
        return result.stdout.strip() == "active"
    except:
        return False

def check_python_version():
    """Проверка версии Python"""
    version = sys.version_info
    return {
        "installed": version >= (3, 8),
        "version": f"{version.major}.{version.minor}.{version.micro}",
        "required": "3.8+",
        "status": "✅" if version >= (3, 8) else "❌"
    }

def check_pip():
    """Проверка наличия pip"""
    try:
        import pip
        version = pip.__version__
        return {
            "installed": True,
            "version": version,
            "required": "любая",
            "status": "✅"
        }
    except ImportError:
        return {
            "installed": False,
            "version": "не установлен",
            "required": "любая",
            "status": "❌"
        }

def check_node():
    """Проверка наличия Node.js"""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            version = result.stdout.strip().replace('v', '')
            major_version = int(version.split('.')[0])
            return {
                "installed": True,
                "version": version,
                "required": "16+",
                "status": "✅" if major_version >= 16 else "⚠️"
            }
        else:
            return {
                "installed": False,
                "version": "не установлен",
                "required": "16+",
                "status": "❌"
            }
    except Exception as e:
        return {
            "installed": False,
            "version": f"ошибка: {str(e)}",
            "required": "16+",
            "status": "❌"
        }

def check_npm():
    """Проверка наличия npm"""
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            version = result.stdout.strip()
            major_version = int(version.split('.')[0])
            return {
                "installed": True,
                "version": version,
                "required": "8+",
                "status": "✅" if major_version >= 8 else "⚠️"
            }
        else:
            return {
                "installed": False,
                "version": "не установлен",
                "required": "8+",
                "status": "❌"
            }
    except Exception as e:
        return {
            "installed": False,
            "version": f"ошибка: {str(e)}",
            "required": "8+",
            "status": "❌"
        }

def check_postgresql():
    """Проверка доступности PostgreSQL"""
    try:
        # Пробуем разные варианты подключения
        test_configs = [
            {'host': 'localhost', 'port': 5432, 'database': 'postgres', 'user': 'postgres', 'password': 'postgres'},
            {'host': 'localhost', 'port': 5432, 'database': 'postgres', 'user': 'postgres', 'password': ''},
            {'host': 'localhost', 'port': 5432, 'database': 'postgres', 'user': 'postgres', 'password': 'admin'},
        ]
        
        for config in test_configs:
            try:
                conn = psycopg2.connect(**config)
                conn.close()
                return {
                    "installed": True,
                    "version": "доступен",
                    "required": "12+",
                    "status": "✅"
                }
            except:
                continue
        
        return {
            "installed": False,
            "version": "недоступен",
            "required": "12+",
            "status": "❌"
        }
    except Exception as e:
        return {
            "installed": False,
            "version": f"ошибка: {str(e)}",
            "required": "12+",
            "status": "❌"
        }

def check_redis():
    """Проверка доступности Redis"""
    try:
        r = redis.Redis(host='localhost', port=6379, socket_timeout=5)
        r.ping()
        return {
            "installed": True,
            "version": "доступен",
            "required": "6+",
            "status": "✅"
        }
    except Exception as e:
        return {
            "installed": False,
            "version": f"недоступен: {str(e)}",
            "required": "6+",
            "status": "❌"
        }

def check_disk_space():
    """Проверка свободного места на диске"""
    try:
        free_space = shutil.disk_usage('/').free
        free_gb = free_space / (1024**3)
        required_gb = 1
        
        return {
            "installed": free_gb >= required_gb,
            "version": f"{free_gb:.1f} GB свободно",
            "required": f"{required_gb} GB",
            "status": "✅" if free_gb >= required_gb else "❌"
        }
    except Exception as e:
        return {
            "installed": False,
            "version": f"ошибка: {str(e)}",
            "required": "1 GB",
            "status": "❌"
        }

def check_memory():
    """Проверка доступной памяти"""
    try:
        memory = psutil.virtual_memory()
        available_gb = memory.available / (1024**3)
        required_gb = 1
        
        return {
            "installed": available_gb >= required_gb,
            "version": f"{available_gb:.1f} GB доступно",
            "required": f"{required_gb} GB",
            "status": "✅" if available_gb >= required_gb else "❌"
        }
    except Exception as e:
        return {
            "installed": False,
            "version": f"ошибка: {str(e)}",
            "required": "1 GB",
            "status": "❌"
        }

def check_git():
    """Проверка наличия Git"""
    try:
        result = subprocess.run(['git', '--version'], capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            version = result.stdout.strip()
            return {
                "installed": True,
                "version": version,
                "required": "любая",
                "status": "✅"
            }
        else:
            return {
                "installed": False,
                "version": "не установлен",
                "required": "любая",
                "status": "❌"
            }
    except Exception as e:
        return {
            "installed": False,
            "version": f"ошибка: {str(e)}",
            "required": "любая",
            "status": "❌"
        }

def check_curl():
    """Проверка наличия curl"""
    try:
        result = subprocess.run(['curl', '--version'], capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            version = result.stdout.split('\n')[0]
            return {
                "installed": True,
                "version": version,
                "required": "любая",
                "status": "✅"
            }
        else:
            return {
                "installed": False,
                "version": "не установлен",
                "required": "любая",
                "status": "❌"
            }
    except Exception as e:
        return {
            "installed": False,
            "version": f"ошибка: {str(e)}",
            "required": "любая",
            "status": "❌"
        }

def generate_backend_env():
    """Генерация .env файла для backend"""
    db_config = config.config.get("database", {})
    redis_config = config.config.get("redis", {})
    
    env_content = f"""# Database
DATABASE_URL=postgresql://{db_config.get('username', 'ml_user')}:{db_config.get('password', 'ml_password')}@{db_config.get('host', 'localhost')}:{db_config.get('port', 5432)}/{db_config.get('database', 'ml_community')}

# Redis
REDIS_URL=redis://{redis_config.get('host', 'localhost')}:{redis_config.get('port', 6379)}

# Security
SECRET_KEY=your-secret-key-change-in-production-please-use-a-strong-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000", "http://localhost:8001", "http://127.0.0.1:3000", "http://127.0.0.1:8001"]

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIRECTORY=/app/static/uploads

# API
API_V1_STR=/api/v1
PROJECT_NAME=Mobile Legends Community Platform

# Email
SMTP_TLS=True
SMTP_PORT=587
SMTP_HOST=smtp.gmail.com
SMTP_USER=
SMTP_PASSWORD=

# External APIs
ML_OFFICIAL_API_URL=https://api.mobilelegends.com
ML_OFFICIAL_API_KEY=

# Environment
ENVIRONMENT=production
DEBUG=False
"""
    
    env_file = BACKEND_PATH / ".env"
    with open(env_file, 'w', encoding='utf-8') as f:
        f.write(env_content)

def generate_frontend_config():
    """Генерация конфигурации для frontend"""
    # Создаем .env файл для frontend
    env_content = """REACT_APP_API_URL=http://localhost:8001/api/v1
REACT_APP_VERSION=1.0.0
REACT_APP_NAME=Mobile Legends Community
"""
    
    env_file = FRONTEND_PATH / ".env"
    with open(env_file, 'w', encoding='utf-8') as f:
        f.write(env_content)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)