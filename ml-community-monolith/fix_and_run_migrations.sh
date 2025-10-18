#!/bin/bash

# ML Community Monolith - Fix and Run Migrations Script

set -e

echo "=== ML Community Monolith - Fix and Run Migrations ==="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "alembic.ini" ]; then
    print_error "alembic.ini not found. Please run this script from the ml-community-monolith directory."
    exit 1
fi

# Fix alembic.ini file
print_status "Fixing alembic.ini file..."
sed -i 's/version_num_format = %04d/version_num_format = %%04d/' alembic.ini
print_status "Fixed version_num_format in alembic.ini"

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    cat > .env << EOF
# ML Community Monolith Environment Configuration

# Database Configuration
DATABASE_URL=postgresql://ml_admin:ML_Community_2024!@localhost:5432/ml_community
POSTGRES_DB=ml_community
POSTGRES_USER=ml_admin
POSTGRES_PASSWORD=ML_Community_2024!

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=your-super-secret-key-change-in-production-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Configuration
ALLOWED_ORIGINS=["http://localhost:8000", "http://127.0.0.1:8000", "http://militaryfocus.ru"]

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DIRECTORY=/app/app/static/uploads

# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=ML Community Platform

# Environment
ENVIRONMENT=production
DEBUG=false
EOF
    print_status ".env file created"
fi

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    print_warning "Virtual environment not activated. Activating..."
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
        print_status "Virtual environment activated"
    else
        print_error "Virtual environment not found. Please create one first."
        exit 1
    fi
fi

# Install dependencies
print_status "Installing Python dependencies..."
pip install -r requirements.txt

# Check database connection
print_status "Testing database connection..."
python -c "
import os
import sys
sys.path.append('.')
from app.core.database import engine
try:
    with engine.connect() as conn:
        result = conn.execute('SELECT 1').scalar()
        print('Database connection successful')
except Exception as e:
    print(f'Database connection failed: {e}')
    sys.exit(1)
"

# Create initial migration if it doesn't exist
if [ ! -d "alembic/versions" ] || [ -z "$(ls -A alembic/versions)" ]; then
    print_status "Creating initial migration..."
    alembic revision --autogenerate -m "Initial migration"
    print_status "Initial migration created"
fi

# Run migrations
print_status "Running database migrations..."
alembic upgrade head
print_status "Database migrations completed successfully!"

# Create admin user
print_status "Creating admin user..."
python -c "
import os
import sys
sys.path.append('.')
from app.core.database import SessionLocal
from app.models import User
from app.auth import get_password_hash

db = SessionLocal()
try:
    # Check if admin user already exists
    admin_user = db.query(User).filter(User.username == 'admin').first()
    if not admin_user:
        admin_user = User(
            username='admin',
            email='admin@militaryfocus.ru',
            hashed_password=get_password_hash('admin123'),
            is_active=True,
            is_admin=True
        )
        db.add(admin_user)
        db.commit()
        print('Admin user created successfully')
    else:
        print('Admin user already exists')
finally:
    db.close()
"

print_status "Setup completed successfully!"
echo ""
echo "You can now start the application with:"
echo "  uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
echo ""
echo "Or with Docker:"
echo "  docker-compose up -d"
echo ""
echo "Admin credentials:"
echo "  Username: admin"
echo "  Password: admin123"