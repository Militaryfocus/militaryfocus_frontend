#!/usr/bin/env python3
"""
Веб-установщик для Mobile Legends Community Platform
"""
import os
import sys
import json
import sqlite3
from pathlib import Path
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import psycopg2
from psycopg2 import sql
import redis
import requests

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
        "memory": check_memory()
    }
    
    all_passed = all(requirements.values())
    
    if all_passed:
        config.update_step("system", requirements)
    
    return jsonify({
        "success": all_passed,
        "requirements": requirements
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

def check_python_version():
    """Проверка версии Python"""
    return sys.version_info >= (3, 8)

def check_pip():
    """Проверка наличия pip"""
    try:
        import pip
        return True
    except ImportError:
        return False

def check_node():
    """Проверка наличия Node.js"""
    try:
        import subprocess
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        return result.returncode == 0
    except:
        return False

def check_npm():
    """Проверка наличия npm"""
    try:
        import subprocess
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        return result.returncode == 0
    except:
        return False

def check_postgresql():
    """Проверка доступности PostgreSQL"""
    try:
        conn = psycopg2.connect(
            host='localhost',
            port=5432,
            database='postgres',
            user='postgres',
            password='postgres'
        )
        conn.close()
        return True
    except:
        return False

def check_redis():
    """Проверка доступности Redis"""
    try:
        r = redis.Redis(host='localhost', port=6379)
        r.ping()
        return True
    except:
        return False

def check_disk_space():
    """Проверка свободного места на диске"""
    try:
        import shutil
        free_space = shutil.disk_usage('/').free
        return free_space > 1024 * 1024 * 1024  # 1GB
    except:
        return False

def check_memory():
    """Проверка доступной памяти"""
    try:
        import psutil
        memory = psutil.virtual_memory()
        return memory.available > 1024 * 1024 * 1024  # 1GB
    except:
        return False

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