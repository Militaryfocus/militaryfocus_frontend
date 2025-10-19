#!/bin/bash

# ML Community Monolith - One Click Install Script
# This script installs and runs the ML Community Platform monolith

set -e

echo "🚀 ML Community Monolith - One Click Install"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_warning "Running as root. This is not recommended for production."
fi

# Step 1: Update system
print_step "1. Updating system packages..."
sudo apt update -y
print_status "System updated"

# Step 2: Install dependencies
print_step "2. Installing system dependencies..."
sudo apt install -y python3 python3-pip python3-venv python3-dev python3-full git curl
sudo apt install -y postgresql postgresql-contrib postgresql-server-dev-all libpq-dev
sudo apt install -y redis-server
sudo apt install -y libjpeg-dev zlib1g-dev libpng-dev libfreetype6-dev liblcms2-dev libwebp-dev libharfbuzz-dev libfribidi-dev libxcb1-dev
print_status "Dependencies installed"

# Step 3: Start services
print_step "3. Starting database and Redis services..."
sudo service postgresql start
sudo service redis-server start
print_status "Services started"

# Step 4: Create database and user
print_step "4. Setting up database..."
sudo -u postgres psql -c "CREATE DATABASE ml_community;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE USER ml_admin WITH PASSWORD 'ML_Community_2024!';" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ml_community TO ml_admin;" 2>/dev/null || true
sudo -u postgres psql -d ml_community -c "GRANT ALL ON SCHEMA public TO ml_admin;" 2>/dev/null || true
sudo -u postgres psql -d ml_community -c "GRANT CREATE ON SCHEMA public TO ml_admin;" 2>/dev/null || true
sudo -u postgres psql -d ml_community -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ml_admin;" 2>/dev/null || true
sudo -u postgres psql -d ml_community -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ml_admin;" 2>/dev/null || true
print_status "Database configured"

# Step 5: Create virtual environment
print_step "5. Setting up Python environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install --upgrade pip setuptools wheel
print_status "Virtual environment ready"

# Step 6: Install Python dependencies
print_step "6. Installing Python packages..."
pip install fastapi uvicorn jinja2 python-multipart sqlalchemy alembic psycopg2-binary redis python-jose[cryptography] passlib[bcrypt] python-dotenv pydantic-settings httpx aiofiles pillow email-validator
print_status "Python packages installed"

# Step 7: Fix alembic configuration
print_step "7. Configuring Alembic..."
sed -i 's/version_num_format = %04d/version_num_format = %%04d/' alembic.ini
print_status "Alembic configured"

# Step 8: Create .env file
print_step "8. Creating configuration file..."
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
SECRET_KEY=ML_Community_Super_Secret_Key_2024_Change_In_Production_At_Least_32_Chars
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
print_status "Configuration file created"

# Step 9: Create necessary directories
print_step "9. Creating directories..."
mkdir -p alembic/versions
mkdir -p app/static/uploads
mkdir -p app/logs
print_status "Directories created"

# Step 10: Run database migrations
print_step "10. Running database migrations..."
alembic revision --autogenerate -m "Initial migration" 2>/dev/null || true
alembic upgrade head
print_status "Database migrations completed"

# Step 11: Create admin user
print_step "11. Creating admin user..."
python create_admin.py
print_status "Admin user created"

# Step 12: Start application
print_step "12. Starting application..."
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 > app.log 2>&1 &
sleep 5

# Step 13: Verify installation
print_step "13. Verifying installation..."
if curl -s http://localhost:8000/health > /dev/null; then
    print_status "✅ Application is running successfully!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   Main site: http://localhost:8000"
    echo "   API docs: http://localhost:8000/api/docs"
    echo "   Health check: http://localhost:8000/health"
    echo ""
    echo "👤 Admin credentials:"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo "   Email: admin@militaryfocus.ru"
    echo ""
    echo "📝 Logs:"
    echo "   Application logs: tail -f app.log"
    echo "   Process: ps aux | grep uvicorn"
    echo ""
    echo "🛑 To stop the application:"
    echo "   pkill -f uvicorn"
    echo ""
    echo "🎉 Installation completed successfully!"
else
    print_error "❌ Application failed to start. Check logs: tail -f app.log"
    exit 1
fi