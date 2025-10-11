from fastapi import Request, HTTPException
from typing import Dict, Any
import re
from app.core.logging import get_logger

logger = get_logger("validation")

class InputValidator:
    """Класс для валидации входных данных"""
    
    @staticmethod
    def validate_search_query(query: str, max_length: int = 100) -> str:
        """Валидация поискового запроса"""
        if not query or not query.strip():
            raise HTTPException(status_code=400, detail="Search query cannot be empty")
        
        query = query.strip()
        if len(query) > max_length:
            raise HTTPException(status_code=400, detail=f"Search query too long (max {max_length} characters)")
        
        # Проверка на потенциально опасные символы
        if re.search(r'[<>"\']', query):
            logger.warning(f"Potentially dangerous characters in search query: {query}")
            raise HTTPException(status_code=400, detail="Invalid characters in search query")
        
        return query
    
    @staticmethod
    def validate_username(username: str) -> str:
        """Валидация имени пользователя"""
        if not username or not username.strip():
            raise HTTPException(status_code=400, detail="Username cannot be empty")
        
        username = username.strip()
        if len(username) < 3:
            raise HTTPException(status_code=400, detail="Username must be at least 3 characters long")
        
        if len(username) > 50:
            raise HTTPException(status_code=400, detail="Username too long (max 50 characters)")
        
        # Только буквы, цифры, подчеркивания и дефисы
        if not re.match(r'^[a-zA-Z0-9_-]+$', username):
            raise HTTPException(status_code=400, detail="Username can only contain letters, numbers, underscores and hyphens")
        
        return username
    
    @staticmethod
    def validate_email(email: str) -> str:
        """Валидация email"""
        if not email or not email.strip():
            raise HTTPException(status_code=400, detail="Email cannot be empty")
        
        email = email.strip().lower()
        if len(email) > 254:
            raise HTTPException(status_code=400, detail="Email too long")
        
        # Простая валидация email
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            raise HTTPException(status_code=400, detail="Invalid email format")
        
        return email
    
    @staticmethod
    def validate_password(password: str) -> str:
        """Валидация пароля"""
        if not password:
            raise HTTPException(status_code=400, detail="Password cannot be empty")
        
        if len(password) < 8:
            raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")
        
        if len(password) > 128:
            raise HTTPException(status_code=400, detail="Password too long (max 128 characters)")
        
        # Проверка на наличие хотя бы одной буквы и одной цифры
        if not re.search(r'[A-Za-z]', password):
            raise HTTPException(status_code=400, detail="Password must contain at least one letter")
        
        if not re.search(r'\d', password):
            raise HTTPException(status_code=400, detail="Password must contain at least one number")
        
        return password
    
    @staticmethod
    def validate_pagination_params(skip: int = 0, limit: int = 20) -> tuple[int, int]:
        """Валидация параметров пагинации"""
        if skip < 0:
            raise HTTPException(status_code=400, detail="Skip parameter cannot be negative")
        
        if limit < 1:
            raise HTTPException(status_code=400, detail="Limit parameter must be at least 1")
        
        if limit > 100:
            raise HTTPException(status_code=400, detail="Limit parameter cannot exceed 100")
        
        return skip, limit
    
    @staticmethod
    def validate_rating(rating: int) -> int:
        """Валидация рейтинга"""
        if not isinstance(rating, int):
            raise HTTPException(status_code=400, detail="Rating must be an integer")
        
        if rating < 1 or rating > 5:
            raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
        
        return rating
    
    @staticmethod
    def sanitize_string(text: str, max_length: int = 1000) -> str:
        """Очистка строки от потенциально опасных символов"""
        if not text:
            return ""
        
        # Удаляем HTML теги
        text = re.sub(r'<[^>]+>', '', text)
        
        # Ограничиваем длину
        if len(text) > max_length:
            text = text[:max_length]
        
        return text.strip()

def validate_request_data(request: Request, required_fields: list[str] = None) -> Dict[str, Any]:
    """Валидация данных запроса"""
    try:
        # Получаем данные из запроса
        if request.method == "GET":
            data = dict(request.query_params)
        else:
            data = request.json() if hasattr(request, 'json') else {}
        
        # Проверяем обязательные поля
        if required_fields:
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Missing required fields: {', '.join(missing_fields)}"
                )
        
        return data
    
    except Exception as e:
        logger.error(f"Request validation error: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid request data")