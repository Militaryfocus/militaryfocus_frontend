# Contributing to Mobile Legends Community Platform

Спасибо за интерес к участию в разработке Mobile Legends Community Platform! 

## 🚀 Быстрый старт для разработчиков

### Предварительные требования
- Python 3.9+
- Node.js 18+
- Docker & Docker Compose
- Git

### Настройка окружения разработки

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/Militaryfocus/Baga.git
   cd Baga
   ```

2. **Настройте окружение:**
   ```bash
   cp .env.example .env
   # Отредактируйте .env файл
   ```

3. **Запустите сервисы:**
   ```bash
   docker-compose up -d
   ```

4. **Настройте backend для разработки:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # или
   venv\Scripts\activate  # Windows
   
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

5. **Настройте frontend для разработки:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 📋 Процесс разработки

### 1. Создание issue
Перед началом работы создайте issue с описанием:
- Проблемы или новой функциональности
- Ожидаемого поведения
- Критериев приемки

### 2. Создание ветки
```bash
git checkout -b feature/your-feature-name
# или
git checkout -b fix/your-bug-fix
```

### 3. Разработка
- Следуйте существующим паттернам кода
- Пишите тесты для новой функциональности
- Обновляйте документацию при необходимости

### 4. Тестирование
```bash
# Backend тесты
cd backend
pytest

# Frontend тесты
cd frontend
npm test

# E2E тесты
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

### 5. Commit и Push
```bash
git add .
git commit -m "feat: add new hero search functionality"
git push origin feature/your-feature-name
```

### 6. Pull Request
- Создайте Pull Request с подробным описанием
- Укажите связанные issues
- Добавьте скриншоты для UI изменений

## 📝 Стандарты кода

### Python (Backend)
- Следуйте PEP 8
- Используйте type hints
- Документируйте функции и классы
- Покрывайте код тестами

```python
def get_hero(db: Session, hero_id: int) -> Optional[Hero]:
    """
    Получить героя по ID.
    
    Args:
        db: Сессия базы данных
        hero_id: ID героя
        
    Returns:
        Объект героя или None если не найден
    """
    return db.query(Hero).filter(Hero.id == hero_id).first()
```

### TypeScript (Frontend)
- Используйте строгую типизацию
- Следуйте ESLint правилам
- Используйте функциональные компоненты
- Применяйте React Hooks

```typescript
interface HeroCardProps {
  hero: Hero;
  onClick?: (hero: Hero) => void;
  showStats?: boolean;
}

const HeroCard: React.FC<HeroCardProps> = ({ 
  hero, 
  onClick,
  showStats = false 
}) => {
  // Component implementation
};
```

### CSS
- Используйте Tailwind CSS классы
- Создавайте кастомные компоненты при необходимости
- Следуйте mobile-first подходу

## 🧪 Тестирование

### Backend тесты
```bash
cd backend
pytest tests/ -v --cov=app
```

### Frontend тесты
```bash
cd frontend
npm test -- --coverage
```

### Интеграционные тесты
```bash
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 📚 Документация

### API документация
- Обновляется автоматически через FastAPI
- Доступна по адресу: http://localhost:8000/docs

### Код документация
- Используйте docstrings для Python
- Комментируйте сложную логику
- Обновляйте README при изменении архитектуры

## 🐛 Сообщение об ошибках

При создании issue об ошибке укажите:

1. **Описание проблемы**
2. **Шаги для воспроизведения**
3. **Ожидаемое поведение**
4. **Фактическое поведение**
5. **Окружение:**
   - ОС и версия
   - Версия Python/Node.js
   - Версия Docker
6. **Логи и скриншоты**

## 💡 Предложения улучшений

При предложении новой функциональности:

1. **Описание идеи**
2. **Обоснование необходимости**
3. **Предлагаемая реализация**
4. **Альтернативы**
5. **Дополнительный контекст**

## 🏷️ Типы изменений

Используйте следующие префиксы в commit сообщениях:

- `feat:` - новая функциональность
- `fix:` - исправление ошибки
- `docs:` - изменения в документации
- `style:` - форматирование, отсутствующие точки с запятой и т.д.
- `refactor:` - рефакторинг кода
- `test:` - добавление тестов
- `chore:` - изменения в build процессе или вспомогательных инструментах

## 🔄 Процесс ревью

### Для авторов PR:
- Отвечайте на комментарии ревьюеров
- Вносите необходимые изменения
- Обновляйте PR при необходимости

### Для ревьюеров:
- Проверяйте код на соответствие стандартам
- Тестируйте функциональность
- Предлагайте улучшения
- Будьте конструктивными в комментариях

## 📞 Получение помощи

- 💬 [GitHub Discussions](https://github.com/Militaryfocus/Baga/discussions)
- 🐛 [GitHub Issues](https://github.com/Militaryfocus/Baga/issues)
- 📧 Email: support@mlcommunity.com

## 🎉 Признание контрибьюторов

Все контрибьюторы будут добавлены в:
- README файл
- CONTRIBUTORS.md
- GitHub Contributors страницу

Спасибо за ваш вклад в развитие проекта! 🚀