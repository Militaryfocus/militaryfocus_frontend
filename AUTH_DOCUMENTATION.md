# Authentication & Authorization Documentation

## Оглавление
1. [Обзор системы аутентификации](#обзор-системы-аутентификации)
2. [Архитектура](#архитектура)
3. [API Endpoints](#api-endpoints)
4. [Frontend Integration](#frontend-integration)
5. [Роли пользователей](#роли-пользователей)
6. [Безопасность](#безопасность)
7. [Использование](#использование)
8. [Примеры кода](#примеры-кода)

---

## Обзор системы аутентификации

Mobile Legends Community Platform использует JWT (JSON Web Tokens) для аутентификации пользователей. Система обеспечивает:

- ✅ Безопасную регистрацию пользователей
- ✅ Аутентификацию через username/password
- ✅ JWT токены для авторизации API запросов
- ✅ Систему ролей и прав доступа
- ✅ Защиту от несанкционированного доступа
- ✅ Управление профилем пользователя

---

## Архитектура

### Backend (FastAPI)

```
backend/
├── app/
│   ├── api/v1/
│   │   ├── auth.py          # Endpoints для аутентификации
│   │   └── users.py         # Endpoints для управления пользователями
│   ├── core/
│   │   ├── security.py      # Утилиты безопасности (JWT, хеширование)
│   │   └── config.py        # Конфигурация приложения
│   ├── crud/
│   │   └── user.py          # CRUD операции для пользователей
│   ├── models/
│   │   └── user.py          # SQLAlchemy модель User
│   └── schemas/
│       └── user.py          # Pydantic схемы для валидации
```

### Frontend (React + TypeScript)

```
frontend/src/
├── services/
│   ├── auth.tsx             # AuthContext и хуки для аутентификации
│   └── api.ts               # API клиент с автоматической авторизацией
├── pages/
│   ├── LoginPage.tsx        # Страница входа
│   ├── RegisterPage.tsx     # Страница регистрации
│   └── ProfilePage.tsx      # Страница профиля
└── types/
    └── index.ts             # TypeScript типы
```

---

## API Endpoints

### Аутентификация

#### POST `/api/v1/auth/register`
Регистрация нового пользователя.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "ign": "GameNickname",          // Опционально
  "current_rank": "Epic"           // Опционально
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "ign": "GameNickname",
  "current_rank": "Epic",
  "role": "User",
  "is_active": true,
  "is_verified": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Email или username уже заняты
- `422 Unprocessable Entity` - Невалидные данные

---

#### POST `/api/v1/auth/login`
Вход в систему.

**Request Body (form-data):**
```
username: string
password: string
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Error Responses:**
- `401 Unauthorized` - Неверные учетные данные
- `422 Unprocessable Entity` - Отсутствуют обязательные поля

---

#### GET `/api/v1/auth/me`
Получить информацию о текущем пользователе.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "ign": "GameNickname",
  "current_rank": "Epic",
  "main_heroes": [1, 5, 12],
  "role": "User",
  "is_active": true,
  "is_verified": false,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-02T00:00:00Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Токен отсутствует или недействителен

---

#### POST `/api/v1/auth/refresh`
Обновить access token.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

#### POST `/api/v1/auth/logout`
Выйти из системы.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

---

#### POST `/api/v1/auth/forgot-password`
Запрос на восстановление пароля.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset email sent"
}
```

**Note:** В текущей версии email не отправляется, требуется настройка SMTP.

---

#### POST `/api/v1/auth/reset-password`
Сброс пароля по токену.

**Request Body:**
```json
{
  "token": "reset_token_here",
  "new_password": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successfully"
}
```

---

### Управление пользователями

#### GET `/api/v1/users`
Получить список пользователей (только для админов).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**
- `skip` (int, default: 0) - Пропустить N записей
- `limit` (int, default: 100, max: 1000) - Количество записей

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "role": "User",
    "is_active": true,
    "is_verified": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

#### GET `/api/v1/users/{user_id}`
Получить профиль пользователя.

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "ign": "GameNickname",
  "current_rank": "Epic",
  "main_heroes": [1, 5, 12],
  "role": "User",
  "is_active": true,
  "is_verified": false,
  "created_at": "2024-01-01T00:00:00Z",
  "guides_count": 5,
  "total_views": 1250,
  "total_likes": 89,
  "average_rating": 4.5
}
```

**Error Responses:**
- `404 Not Found` - Пользователь не найден

---

#### PUT `/api/v1/users/{user_id}`
Обновить профиль пользователя.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "username": "newusername",
  "ign": "NewGameNick",
  "current_rank": "Legend",
  "main_heroes": [2, 6, 13]
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "newemail@example.com",
  "username": "newusername",
  "ign": "NewGameNick",
  "current_rank": "Legend",
  "main_heroes": [2, 6, 13],
  "role": "User",
  "is_active": true,
  "is_verified": false,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-03T00:00:00Z"
}
```

**Permissions:**
- Пользователь может обновлять только свой профиль
- Админы и модераторы могут обновлять любой профиль

---

#### GET `/api/v1/users/{user_id}/guides`
Получить гайды пользователя.

**Query Parameters:**
- `skip` (int, default: 0)
- `limit` (int, default: 20, max: 100)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "hero_id": 5,
    "author_id": 1,
    "title": "Guide Title",
    "description": "Guide description",
    "views": 250,
    "likes": 18,
    "rating": 4.5,
    "rating_count": 12,
    "difficulty": "Medium",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

#### GET `/api/v1/users/{user_id}/stats`
Получить статистику пользователя.

**Response (200 OK):**
```json
{
  "user_id": 1,
  "guides_count": 5,
  "total_views": 1250,
  "total_likes": 89,
  "average_rating": 4.5
}
```

---

#### POST `/api/v1/users/{user_id}/verify`
Верифицировать пользователя (только для админов).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response (200 OK):**
```json
{
  "message": "User verified successfully"
}
```

---

#### POST `/api/v1/users/{user_id}/change-role`
Изменить роль пользователя (только для админов).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Request Body:**
```json
{
  "new_role": "Content Creator"
}
```

**Valid Roles:**
- `User` - Обычный пользователь
- `Content Creator` - Создатель контента
- `Moderator` - Модератор
- `Admin` - Администратор

**Response (200 OK):**
```json
{
  "message": "User role changed to Content Creator"
}
```

---

## Frontend Integration

### AuthContext

AuthContext предоставляет централизованное управление аутентификацией в приложении.

**Доступные методы и свойства:**

```typescript
interface AuthContextType {
  user: User | null;              // Текущий пользователь
  isAuthenticated: boolean;       // Статус аутентификации
  isLoading: boolean;             // Загрузка данных
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}
```

### Использование useAuth Hook

```typescript
import { useAuth } from '@/services/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginButton />;
  }

  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Использование useRole Hook

```typescript
import { useRole } from '@/services/auth';

function AdminPanel() {
  const { isAdmin, isContentCreator, userRole } = useRole();

  if (!isAdmin()) {
    return <div>Access Denied</div>;
  }

  return <div>Admin Panel Content</div>;
}
```

### Защита маршрутов

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/services/auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
```

### API Client

API клиент автоматически добавляет токен к каждому запросу:

```typescript
import apiService from '@/services/api';

// Токен автоматически добавляется к headers
const user = await apiService.getCurrentUser();
const guides = await apiService.getUserGuides(userId);
```

---

## Роли пользователей

### User (Пользователь)
- Просмотр контента
- Создание комментариев
- Лайки и оценки гайдов
- Управление своим профилем

### Content Creator (Создатель контента)
Все права User плюс:
- Создание гайдов
- Редактирование своих гайдов
- Публикация контента

### Moderator (Модератор)
Все права Content Creator плюс:
- Модерация комментариев
- Редактирование чужих гайдов
- Удаление неуместного контента
- Управление пользователями

### Admin (Администратор)
Все права Moderator плюс:
- Управление всеми пользователями
- Изменение ролей
- Верификация пользователей
- Доступ к административной панели
- Полный контроль над системой

---

## Безопасность

### JWT Токены

**Конфигурация:**
```python
# backend/app/core/config.py
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
```

**Структура токена:**
```json
{
  "sub": "username",
  "exp": 1234567890,
  "iat": 1234567890
}
```

### Хеширование паролей

Используется библиотека `passlib` с алгоритмом bcrypt:

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Хеширование
hashed_password = pwd_context.hash("password123")

# Проверка
is_valid = pwd_context.verify("password123", hashed_password)
```

### Защита от атак

1. **SQL Injection** - Использование SQLAlchemy ORM
2. **XSS** - Валидация входных данных с Pydantic
3. **CSRF** - CORS настройки
4. **Brute Force** - Rate limiting (рекомендуется настроить)
5. **Token Theft** - HTTPS в production (рекомендуется)

### CORS настройки

```python
# backend/app/core/config.py
BACKEND_CORS_ORIGINS = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
]
```

---

## Использование

### Регистрация нового пользователя

1. Пользователь заходит на `/register`
2. Заполняет форму:
   - Email (обязательно)
   - Username (обязательно, 3-20 символов)
   - Password (обязательно, минимум 6 символов)
   - IGN - игровой ник (опционально)
   - Current Rank - текущий ранг (опционально)
3. Принимает условия использования
4. Нажимает "Зарегистрироваться"
5. Автоматически входит в систему после успешной регистрации

### Вход в систему

1. Пользователь заходит на `/login`
2. Вводит username и password
3. Нажимает "Войти"
4. Перенаправляется на главную страницу

### Просмотр и редактирование профиля

1. Авторизованный пользователь заходит на `/profile`
2. Вкладки:
   - **Обзор** - общая информация, email, username, игровой ник, ранг
   - **Гайды** - список созданных пользователем гайдов
   - **Настройки** - редактирование профиля (только для своего профиля)
3. Для редактирования нажимает "Редактировать"
4. Изменяет данные и сохраняет

### Выход из системы

1. Нажимает кнопку "Выйти" в профиле или навигации
2. Токен удаляется из localStorage
3. Перенаправляется на главную страницу

---

## Примеры кода

### Backend: Создание пользователя

```python
# backend/app/crud/user.py
from sqlalchemy.orm import Session
from app.models import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        ign=user.ign,
        current_rank=user.current_rank,
        role="User"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
```

### Backend: Аутентификация

```python
# backend/app/crud/user.py
from app.core.security import verify_password

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user
```

### Backend: Проверка прав доступа

```python
# backend/app/core/security.py
from fastapi import Depends, HTTPException, status
from app.models import User

async def get_current_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    if current_user.role not in ["Admin", "Moderator"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user
```

### Frontend: Login Form

```typescript
// frontend/src/pages/LoginPage.tsx
import { useAuth } from '@/services/auth';
import { useForm } from 'react-hook-form';

function LoginPage() {
  const { login, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate('/');
    } catch (error) {
      // Ошибка обработана в useAuth
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('username', { required: true })}
        placeholder="Username"
      />
      <input
        {...register('password', { required: true })}
        type="password"
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading}>
        Login
      </button>
    </form>
  );
}
```

### Frontend: Protected Component

```typescript
// Компонент доступен только для админов
import { useRole } from '@/services/auth';

function AdminDashboard() {
  const { isAdmin } = useRole();

  if (!isAdmin()) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Admin content */}
    </div>
  );
}
```

### Frontend: API Request с токеном

```typescript
// frontend/src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8001/api/v1',
});

// Interceptor автоматически добавляет токен
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Пример использования
export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data;
}
```

---

## Troubleshooting

### Ошибка 401 Unauthorized

**Причины:**
- Токен истек (истекает через 30 минут)
- Токен недействителен
- Токен отсутствует

**Решение:**
1. Выполнить logout и login заново
2. Проверить срок действия токена
3. Использовать `/auth/refresh` для обновления токена

### Ошибка 403 Forbidden

**Причины:**
- Недостаточно прав для выполнения операции
- Попытка редактировать чужой профиль

**Решение:**
- Проверить роль пользователя
- Убедиться, что пользователь имеет необходимые права

### Ошибка 400 Bad Request при регистрации

**Причины:**
- Email или username уже заняты
- Невалидный формат email
- Пароль слишком короткий

**Решение:**
- Использовать другой email/username
- Проверить формат данных
- Убедиться в соответствии требованиям

---

## Best Practices

### Backend

1. ✅ Всегда хешируйте пароли перед сохранением
2. ✅ Используйте сильные SECRET_KEY в production
3. ✅ Включайте HTTPS в production
4. ✅ Настройте rate limiting для защиты от brute force
5. ✅ Валидируйте входные данные с Pydantic
6. ✅ Логируйте попытки входа
7. ✅ Регулярно обновляйте зависимости

### Frontend

1. ✅ Храните токены в localStorage (или httpOnly cookies для большей безопасности)
2. ✅ Очищайте токены при logout
3. ✅ Проверяйте isAuthenticated перед отображением защищенного контента
4. ✅ Обрабатывайте ошибки аутентификации
5. ✅ Используйте HTTPS в production
6. ✅ Не храните чувствительные данные в состоянии
7. ✅ Используйте защищенные маршруты

---

## Дополнительные ресурсы

- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [JWT.io](https://jwt.io/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [React Authentication Best Practices](https://reactjs.org/docs/authentication.html)

---

**Версия документации:** 1.2.0  
**Дата обновления:** 2025-10-19  
**Автор:** ML Community Platform Team
