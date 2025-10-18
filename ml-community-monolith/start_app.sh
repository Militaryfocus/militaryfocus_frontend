#!/bin/bash

# ML Community Monolith - Start Application Script

set -e

echo "=== ML Community Monolith - Starting Application ==="

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
if [ ! -f "app/main.py" ]; then
    print_error "app/main.py not found. Please run this script from the ml-community-monolith directory."
    exit 1
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

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found. Please run fix_and_run_migrations.sh first."
    exit 1
fi

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

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p app/static/uploads
mkdir -p app/logs
print_status "Directories created"

# Start the application
print_status "Starting ML Community Monolith application..."
echo ""
echo "Application will be available at:"
echo "  - Main site: http://localhost:8000"
echo "  - API docs: http://localhost:8000/api/docs"
echo "  - Health check: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload