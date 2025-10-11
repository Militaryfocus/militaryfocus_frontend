import logging
import sys
from pathlib import Path
from datetime import datetime
from app.core.config import settings

def setup_logging():
    """Настройка логирования для приложения"""
    
    # Создаем директорию для логов
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Настройка форматирования
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Основной логгер
    logger = logging.getLogger("ml_community")
    logger.setLevel(logging.INFO)
    
    # Очищаем существующие обработчики
    logger.handlers.clear()
    
    # Консольный обработчик
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # Файловый обработчик для общих логов
    file_handler = logging.FileHandler(
        log_dir / f"app_{datetime.now().strftime('%Y%m%d')}.log",
        encoding='utf-8'
    )
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)
    
    # Файловый обработчик для ошибок
    error_handler = logging.FileHandler(
        log_dir / f"errors_{datetime.now().strftime('%Y%m%d')}.log",
        encoding='utf-8'
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(formatter)
    logger.addHandler(error_handler)
    
    # Логгер для API запросов
    api_logger = logging.getLogger("ml_community.api")
    api_handler = logging.FileHandler(
        log_dir / f"api_{datetime.now().strftime('%Y%m%d')}.log",
        encoding='utf-8'
    )
    api_handler.setLevel(logging.INFO)
    api_handler.setFormatter(formatter)
    api_logger.addHandler(api_handler)
    
    # Логгер для безопасности
    security_logger = logging.getLogger("ml_community.security")
    security_handler = logging.FileHandler(
        log_dir / f"security_{datetime.now().strftime('%Y%m%d')}.log",
        encoding='utf-8'
    )
    security_handler.setLevel(logging.WARNING)
    security_handler.setFormatter(formatter)
    security_logger.addHandler(security_handler)
    
    # Логгер для базы данных
    db_logger = logging.getLogger("ml_community.database")
    db_handler = logging.FileHandler(
        log_dir / f"database_{datetime.now().strftime('%Y%m%d')}.log",
        encoding='utf-8'
    )
    db_handler.setLevel(logging.INFO)
    db_handler.setFormatter(formatter)
    db_logger.addHandler(db_handler)
    
    return logger

def get_logger(name: str) -> logging.Logger:
    """Получить логгер по имени"""
    return logging.getLogger(f"ml_community.{name}")

# Инициализация логирования
logger = setup_logging()