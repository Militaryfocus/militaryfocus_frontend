#!/usr/bin/env python3
"""
Модуль для автоматической настройки сервера
"""
import os
import sys
import subprocess
import shutil
import json
import time
from pathlib import Path
import psutil
import requests

class ServerSetup:
    def __init__(self, config):
        self.config = config
        self.project_root = Path(__file__).parent.parent
        self.backend_path = self.project_root / "backend"
        self.frontend_path = self.project_root / "frontend"
        self.installer_path = self.project_root / "installer"
        
    def install_system_dependencies(self):
        """Установка системных зависимостей"""
        print("🔧 Установка системных зависимостей...")
        
        # Обновление пакетов
        self.run_command("apt update -y")
        
        # Установка основных пакетов
        packages = [
            "python3", "python3-pip", "python3-venv", "python3-dev",
            "postgresql", "postgresql-contrib", "redis-server",
            "nginx", "certbot", "python3-certbot-nginx",
            "git", "curl", "wget", "unzip", "build-essential",
            "nodejs", "npm", "supervisor"
        ]
        
        for package in packages:
            try:
                self.run_command(f"apt install -y {package}")
                print(f"✅ {package} установлен")
            except Exception as e:
                print(f"❌ Ошибка установки {package}: {e}")
                return False
        
        return True
    
    def setup_postgresql(self):
        """Настройка PostgreSQL"""
        print("🐘 Настройка PostgreSQL...")
        
        db_config = self.config.get("database", {})
        db_name = db_config.get("database", "ml_community")
        db_user = db_config.get("username", "ml_user")
        db_password = db_config.get("password", "ml_password")
        
        try:
            # Запуск PostgreSQL
            self.run_command("systemctl start postgresql")
            self.run_command("systemctl enable postgresql")
            
            # Создание пользователя и базы данных
            commands = [
                f"sudo -u postgres psql -c \"CREATE USER {db_user} WITH PASSWORD '{db_password}';\"",
                f"sudo -u postgres psql -c \"CREATE DATABASE {db_name} OWNER {db_user};\"",
                f"sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE {db_name} TO {db_user};\"",
                f"sudo -u postgres psql -c \"ALTER USER {db_user} CREATEDB;\""
            ]
            
            for cmd in commands:
                self.run_command(cmd)
            
            print("✅ PostgreSQL настроен успешно")
            return True
            
        except Exception as e:
            print(f"❌ Ошибка настройки PostgreSQL: {e}")
            return False
    
    def setup_redis(self):
        """Настройка Redis"""
        print("🔴 Настройка Redis...")
        
        try:
            # Запуск Redis
            self.run_command("systemctl start redis-server")
            self.run_command("systemctl enable redis-server")
            
            # Настройка Redis (если нужен пароль)
            redis_config = self.config.get("redis", {})
            if redis_config.get("password"):
                # Настройка пароля для Redis
                redis_conf = "/etc/redis/redis.conf"
                with open(redis_conf, "a") as f:
                    f.write(f"\nrequirepass {redis_config['password']}\n")
                
                self.run_command("systemctl restart redis-server")
            
            print("✅ Redis настроен успешно")
            return True
            
        except Exception as e:
            print(f"❌ Ошибка настройки Redis: {e}")
            return False
    
    def install_python_dependencies(self):
        """Установка Python зависимостей"""
        print("🐍 Установка Python зависимостей...")
        
        try:
            # Создание виртуального окружения
            venv_path = self.backend_path / "venv"
            if not venv_path.exists():
                self.run_command(f"python3 -m venv {venv_path}")
            
            # Активация виртуального окружения и установка зависимостей
            pip_path = venv_path / "bin" / "pip"
            requirements_path = self.backend_path / "requirements.txt"
            
            self.run_command(f"{pip_path} install --upgrade pip")
            self.run_command(f"{pip_path} install -r {requirements_path}")
            
            print("✅ Python зависимости установлены")
            return True
            
        except Exception as e:
            print(f"❌ Ошибка установки Python зависимостей: {e}")
            return False
    
    def install_node_dependencies(self):
        """Установка Node.js зависимостей"""
        print("📦 Установка Node.js зависимостей...")
        
        try:
            # Установка зависимостей frontend
            self.run_command(f"cd {self.frontend_path} && npm install")
            
            # Сборка frontend
            self.run_command(f"cd {self.frontend_path} && npm run build")
            
            print("✅ Node.js зависимости установлены")
            return True
            
        except Exception as e:
            print(f"❌ Ошибка установки Node.js зависимостей: {e}")
            return False
    
    def run_database_migrations(self):
        """Запуск миграций базы данных"""
        print("🗄️ Выполнение миграций базы данных...")
        
        try:
            venv_python = self.backend_path / "venv" / "bin" / "python"
            
            # Инициализация Alembic
            self.run_command(f"cd {self.backend_path} && {venv_python} -m alembic upgrade head")
            
            print("✅ Миграции выполнены успешно")
            return True
            
        except Exception as e:
            print(f"❌ Ошибка выполнения миграций: {e}")
            return False
    
    def create_admin_user(self):
        """Создание администратора"""
        print("👤 Создание администратора...")
        
        try:
            admin_config = self.config.get("admin", {})
            venv_python = self.backend_path / "venv" / "bin" / "python"
            
            # Создание скрипта для создания администратора
            create_admin_script = self.backend_path / "create_admin.py"
            script_content = f'''
import sys
sys.path.append('{self.backend_path}')
from app.core.database import SessionLocal
from app.models import User
from app.core.security import get_password_hash

def create_admin():
    db = SessionLocal()
    try:
        # Проверяем, существует ли уже администратор
        existing_admin = db.query(User).filter(User.username == "{admin_config.get('username', 'admin')}").first()
        if existing_admin:
            print("Администратор уже существует")
            return
        
        # Создаем нового администратора
        admin = User(
            username="{admin_config.get('username', 'admin')}",
            email="{admin_config.get('email', 'admin@example.com')}",
            hashed_password=get_password_hash("{admin_config.get('password', 'admin123')}"),
            ign="{admin_config.get('ign', '')}",
            current_rank="{admin_config.get('current_rank', '')}",
            role="Admin",
            is_active=True,
            is_verified=True
        )
        
        db.add(admin)
        db.commit()
        print("Администратор создан успешно")
        
    except Exception as e:
        print(f"Ошибка создания администратора: {{e}}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
'''
            
            with open(create_admin_script, 'w') as f:
                f.write(script_content)
            
            # Запуск скрипта
            self.run_command(f"cd {self.backend_path} && {venv_python} create_admin.py")
            
            print("✅ Администратор создан успешно")
            return True
            
        except Exception as e:
            print(f"❌ Ошибка создания администратора: {e}")
            return False
    
    def setup_nginx(self):
        """Настройка Nginx"""
        print("🌐 Настройка Nginx...")
        
        try:
            # Создание конфигурации Nginx
            nginx_config = f'''
server {{
    listen 80;
    server_name {self.config.get('domain', 'localhost')};
    
    # Frontend
    location / {{
        root {self.frontend_path}/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }}
    
    # Backend API
    location /api/ {{
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }}
    
    # Static files
    location /static/ {{
        alias {self.backend_path}/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }}
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}}
'''
            
            # Запись конфигурации
            with open("/etc/nginx/sites-available/ml-community", "w") as f:
                f.write(nginx_config)
            
            # Активация сайта
            self.run_command("ln -sf /etc/nginx/sites-available/ml-community /etc/nginx/sites-enabled/")
            self.run_command("rm -f /etc/nginx/sites-enabled/default")
            
            # Проверка конфигурации и перезапуск
            self.run_command("nginx -t")
            self.run_command("systemctl restart nginx")
            self.run_command("systemctl enable nginx")
            
            print("✅ Nginx настроен успешно")
            return True
            
        except Exception as e:
            print(f"❌ Ошибка настройки Nginx: {e}")
            return False
    
    def setup_systemd_services(self):
        """Настройка systemd сервисов"""
        print("⚙️ Настройка systemd сервисов...")
        
        try:
            # Backend сервис
            backend_service = f'''
[Unit]
Description=ML Community Backend
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=www-data
WorkingDirectory={self.backend_path}
Environment=PATH={self.backend_path}/venv/bin
ExecStart={self.backend_path}/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8001
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
'''
            
            with open("/etc/systemd/system/ml-community-backend.service", "w") as f:
                f.write(backend_service)
            
            # Перезагрузка systemd и запуск сервисов
            self.run_command("systemctl daemon-reload")
            self.run_command("systemctl enable ml-community-backend")
            self.run_command("systemctl start ml-community-backend")
            
            print("✅ Systemd сервисы настроены")
            return True
            
        except Exception as e:
            print(f"❌ Ошибка настройки systemd сервисов: {e}")
            return False
    
    def setup_ssl(self):
        """Настройка SSL сертификатов"""
        print("🔒 Настройка SSL сертификатов...")
        
        domain = self.config.get('domain')
        if not domain or domain == 'localhost':
            print("⚠️ SSL пропущен (localhost)")
            return True
        
        try:
            # Получение SSL сертификата
            self.run_command(f"certbot --nginx -d {domain} --non-interactive --agree-tos --email admin@{domain}")
            
            print("✅ SSL сертификат настроен")
            return True
            
        except Exception as e:
            print(f"❌ Ошибка настройки SSL: {e}")
            return False
    
    def import_initial_data(self):
        """Импорт начальных данных"""
        print("📊 Импорт начальных данных...")
        
        try:
            venv_python = self.backend_path / "venv" / "bin" / "python"
            
            # Импорт героев
            import_script = self.backend_path / "import_data.py"
            script_content = '''
import sys
sys.path.append('.')
from app.core.database import SessionLocal
from app.models import Hero, Item, Emblem
import json

def import_heroes():
    """Импорт героев Mobile Legends"""
    db = SessionLocal()
    try:
        # Примеры героев
        heroes_data = [
            {
                "name": "Layla",
                "role": "Marksman",
                "specialty": "Reap/Burst",
                "lane": ["Gold"],
                "durability": 2,
                "offense": 8,
                "control": 2,
                "difficulty": 1,
                "win_rate": 50.5,
                "pick_rate": 15.2,
                "ban_rate": 0.1
            },
            {
                "name": "Tigreal",
                "role": "Tank",
                "specialty": "Initiator/Guardian",
                "lane": ["Roam"],
                "durability": 9,
                "offense": 3,
                "control": 8,
                "difficulty": 2,
                "win_rate": 48.3,
                "pick_rate": 8.7,
                "ban_rate": 2.1
            },
            {
                "name": "Eudora",
                "role": "Mage",
                "specialty": "Burst",
                "lane": ["Mid"],
                "durability": 3,
                "offense": 8,
                "control": 6,
                "difficulty": 2,
                "win_rate": 49.8,
                "pick_rate": 12.4,
                "ban_rate": 0.5
            }
        ]
        
        for hero_data in heroes_data:
            existing = db.query(Hero).filter(Hero.name == hero_data["name"]).first()
            if not existing:
                hero = Hero(**hero_data)
                db.add(hero)
        
        db.commit()
        print(f"Импортировано {len(heroes_data)} героев")
        
    except Exception as e:
        print(f"Ошибка импорта героев: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import_heroes()
'''
            
            with open(import_script, 'w') as f:
                f.write(script_content)
            
            self.run_command(f"cd {self.backend_path} && {venv_python} import_data.py")
            
            print("✅ Начальные данные импортированы")
            return True
            
        except Exception as e:
            print(f"❌ Ошибка импорта данных: {e}")
            return False
    
    def run_command(self, command):
        """Выполнение команды"""
        try:
            result = subprocess.run(
                command, 
                shell=True, 
                check=True, 
                capture_output=True, 
                text=True
            )
            return result.stdout
        except subprocess.CalledProcessError as e:
            raise Exception(f"Команда '{command}' завершилась с ошибкой: {e.stderr}")
    
    def setup_firewall(self):
        """Настройка файрвола"""
        print("🔥 Настройка файрвола...")
        
        try:
            # Разрешение необходимых портов
            ports = ["22", "80", "443", "8001"]
            
            for port in ports:
                self.run_command(f"ufw allow {port}")
            
            # Включение файрвола
            self.run_command("ufw --force enable")
            
            print("✅ Файрвол настроен")
            return True
            
        except Exception as e:
            print(f"❌ Ошибка настройки файрвола: {e}")
            return False
    
    def create_monitoring_script(self):
        """Создание скрипта мониторинга"""
        print("📊 Создание скрипта мониторинга...")
        
        try:
            monitoring_script = "/usr/local/bin/ml-community-monitor.sh"
            script_content = '''#!/bin/bash

# ML Community Monitoring Script
echo "=== ML Community Status ==="
echo "Date: $(date)"
echo

# Backend service
echo "Backend Service:"
systemctl is-active ml-community-backend
echo

# Database
echo "PostgreSQL:"
systemctl is-active postgresql
echo

# Redis
echo "Redis:"
systemctl is-active redis-server
echo

# Nginx
echo "Nginx:"
systemctl is-active nginx
echo

# Disk usage
echo "Disk Usage:"
df -h /
echo

# Memory usage
echo "Memory Usage:"
free -h
echo

# Backend logs (last 10 lines)
echo "Backend Logs (last 10 lines):"
journalctl -u ml-community-backend -n 10 --no-pager
'''
            
            with open(monitoring_script, 'w') as f:
                f.write(script_content)
            
            self.run_command(f"chmod +x {monitoring_script}")
            
            print("✅ Скрипт мониторинга создан")
            return True
            
        except Exception as e:
            print(f"❌ Ошибка создания скрипта мониторинга: {e}")
            return False
    
    def run_full_setup(self):
        """Полная настройка сервера"""
        print("🚀 Начинаем полную настройку сервера...")
        
        steps = [
            ("Установка системных зависимостей", self.install_system_dependencies),
            ("Настройка PostgreSQL", self.setup_postgresql),
            ("Настройка Redis", self.setup_redis),
            ("Установка Python зависимостей", self.install_python_dependencies),
            ("Установка Node.js зависимостей", self.install_node_dependencies),
            ("Выполнение миграций", self.run_database_migrations),
            ("Создание администратора", self.create_admin_user),
            ("Настройка Nginx", self.setup_nginx),
            ("Настройка systemd сервисов", self.setup_systemd_services),
            ("Настройка файрвола", self.setup_firewall),
            ("Импорт начальных данных", self.import_initial_data),
            ("Создание скрипта мониторинга", self.create_monitoring_script),
        ]
        
        # SSL настройка только если указан домен
        if self.config.get('domain') and self.config.get('domain') != 'localhost':
            steps.append(("Настройка SSL", self.setup_ssl))
        
        results = {}
        
        for step_name, step_func in steps:
            print(f"\n{'='*50}")
            print(f"Выполнение: {step_name}")
            print(f"{'='*50}")
            
            try:
                success = step_func()
                results[step_name] = success
                
                if success:
                    print(f"✅ {step_name} - УСПЕШНО")
                else:
                    print(f"❌ {step_name} - ОШИБКА")
                    
            except Exception as e:
                print(f"❌ {step_name} - ИСКЛЮЧЕНИЕ: {e}")
                results[step_name] = False
        
        # Итоговый отчет
        print(f"\n{'='*50}")
        print("ИТОГОВЫЙ ОТЧЕТ")
        print(f"{'='*50}")
        
        successful = sum(1 for success in results.values() if success)
        total = len(results)
        
        for step_name, success in results.items():
            status = "✅ УСПЕШНО" if success else "❌ ОШИБКА"
            print(f"{step_name}: {status}")
        
        print(f"\nРезультат: {successful}/{total} шагов выполнено успешно")
        
        if successful == total:
            print("🎉 Настройка сервера завершена успешно!")
            print(f"🌐 Сайт доступен по адресу: http://{self.config.get('domain', 'localhost')}")
            print("👤 Администратор создан с данными из конфигурации")
            print("📊 Мониторинг: /usr/local/bin/ml-community-monitor.sh")
        else:
            print("⚠️ Настройка завершена с ошибками. Проверьте логи выше.")
        
        return results