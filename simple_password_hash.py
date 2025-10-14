#!/usr/bin/env python3
"""
Простое хеширование паролей без bcrypt
"""
import hashlib
import secrets

def simple_hash_password(password: str) -> str:
    """Простое хеширование пароля с солью"""
    salt = secrets.token_hex(16)
    password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}:{password_hash}"

def verify_simple_password(password: str, hashed: str) -> bool:
    """Проверка пароля"""
    try:
        salt, stored_hash = hashed.split(':')
        password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return password_hash == stored_hash
    except:
        return False

if __name__ == "__main__":
    # Тестируем
    password = "admin123"
    hashed = simple_hash_password(password)
    print(f"Пароль: {password}")
    print(f"Хеш: {hashed}")
    print(f"Проверка: {verify_simple_password(password, hashed)}")