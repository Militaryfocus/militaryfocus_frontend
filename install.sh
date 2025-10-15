#!/bin/bash

# Mobile Legends Community Platform - Unified Installer
# Version: 1.0.0
# Author: Cursor Agent

set -e  # Exit on any error

echo "🚀 Mobile Legends Community Platform - Unified Installer"
echo "========================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root - ALLOWED for server installation
if [[ $EUID -eq 0 ]]; then
   print_warning "Running as root - this is allowed for server installation"
   print_status "Continuing with root privileges..."
   ROOT_USER=true
else
   ROOT_USER=false
fi

# Update system packages
print_status "Updating system packages..."
if [[ "$ROOT_USER" == "true" ]]; then
    apt update -y
else
    sudo apt update -y
fi

# Install system dependencies
print_status "Installing system dependencies..."
if [[ "$ROOT_USER" == "true" ]]; then
    apt install -y \
        python3 \
        python3-pip \
        python3-venv \
        python3-dev \
        postgresql \
        postgresql-contrib \
        postgresql-server-dev-all \
        libpq-dev \
        redis-server \
        nodejs \
        npm \
        git \
        curl \
        wget \
        build-essential \
        libssl-dev \
        libffi-dev \
        libjpeg-dev \
        zlib1g-dev
else
    sudo apt install -y \
        python3 \
        python3-pip \
        python3-venv \
        python3-dev \
        postgresql \
        postgresql-contrib \
        postgresql-server-dev-all \
        libpq-dev \
        redis-server \
        nodejs \
        npm \
        git \
        curl \
        wget \
        build-essential \
        libssl-dev \
        libffi-dev \
        libjpeg-dev \
        zlib1g-dev
fi

# Install Docker and Docker Compose
print_status "Installing Docker and Docker Compose..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    if [[ "$ROOT_USER" == "true" ]]; then
        sh get-docker.sh
        usermod -aG docker $USER
    else
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
    fi
    rm get-docker.sh
    print_success "Docker installed successfully"
else
    print_warning "Docker already installed"
fi

if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    if [[ "$ROOT_USER" == "true" ]]; then
        chmod +x /usr/local/bin/docker-compose
    else
        sudo chmod +x /usr/local/bin/docker-compose
    fi
    print_success "Docker Compose installed successfully"
else
    print_warning "Docker Compose already installed"
fi

# Start and enable services
print_status "Starting and enabling services..."
if [[ "$ROOT_USER" == "true" ]]; then
    systemctl start postgresql
    systemctl enable postgresql
    systemctl start redis-server
    systemctl enable redis-server
else
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    sudo systemctl start redis-server
    sudo systemctl enable redis-server
fi

# Configure PostgreSQL
print_status "Configuring PostgreSQL..."
if [[ "$ROOT_USER" == "true" ]]; then
    sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';" || true
    sudo -u postgres psql -c "CREATE USER ml_user WITH PASSWORD 'ml_password' CREATEDB SUPERUSER;" || true
    sudo -u postgres createdb ml_community || true
else
    postgres psql -c "ALTER USER postgres PASSWORD 'postgres';" || true
    postgres psql -c "CREATE USER ml_user WITH PASSWORD 'ml_password' CREATEDB SUPERUSER;" || true
    postgres createdb ml_community || true
fi

# Grant privileges
if [[ "$ROOT_USER" == "true" ]]; then
    sudo -u postgres psql -d ml_community -c "GRANT ALL PRIVILEGES ON DATABASE ml_community TO ml_user;" || true
else
    postgres psql -d ml_community -c "GRANT ALL PRIVILEGES ON DATABASE ml_community TO ml_user;" || true
fi

# Setup backend
print_status "Setting up backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Fix configuration for localhost
sed -i 's/db:5432/localhost:5432/g' app/core/config.py || true
sed -i 's/redis:6379/localhost:6379/g' app/core/config.py || true

# Initialize database
print_status "Initializing database..."
if [[ "$ROOT_USER" == "true" ]]; then
    PGPASSWORD=ml_password sudo -u postgres psql -h localhost -U ml_user -d ml_community -f ../init_database.sql || true
    python3 simple_db_init.py || true
else
    PGPASSWORD=ml_password psql -h localhost -U ml_user -d ml_community -f ../init_database.sql || true
    python3 simple_db_init.py || true
fi

# Start backend in background
print_status "Starting backend server..."
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > ../backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../backend.pid
print_success "Backend started with PID: $BACKEND_PID"

# Setup frontend
print_status "Setting up frontend..."
cd ../frontend

# Install Node.js dependencies
print_status "Installing frontend dependencies..."
npm install --legacy-peer-deps

# Start frontend in background
print_status "Starting frontend server..."
nohup npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../frontend.pid
print_success "Frontend started with PID: $FRONTEND_PID"

# Wait for services to start
print_status "Waiting for services to start..."
sleep 10

# Test services
print_status "Testing services..."

# Test backend
if curl -s http://localhost:8000/api/v1/health/ > /dev/null; then
    print_success "Backend API is running at http://localhost:8000"
else
    print_warning "Backend API may not be ready yet"
fi

# Test frontend
if curl -s http://localhost:3000 > /dev/null; then
    print_success "Frontend is running at http://localhost:3000"
else
    print_warning "Frontend may not be ready yet"
fi

# Test database
if [[ "$ROOT_USER" == "true" ]]; then
    if PGPASSWORD=ml_password sudo -u postgres psql -h localhost -U ml_user -d ml_community -c "SELECT 1;" > /dev/null 2>&1; then
        print_success "Database connection successful"
    else
        print_warning "Database connection may have issues"
    fi
else
    if PGPASSWORD=ml_password psql -h localhost -U ml_user -d ml_community -c "SELECT 1;" > /dev/null 2>&1; then
        print_success "Database connection successful"
    else
        print_warning "Database connection may have issues"
    fi
fi

# Test Redis
if redis-cli ping > /dev/null 2>&1; then
    print_success "Redis is running"
else
    print_warning "Redis may not be running"
fi

# Create management scripts
print_status "Creating management scripts..."

# Create start script
cat > ../start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Mobile Legends Community Platform..."

# Start backend
cd backend
source venv/bin/activate
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > ../backend.log 2>&1 &
echo $! > ../backend.pid
echo "✅ Backend started"

# Start frontend
cd ../frontend
nohup npm start > ../frontend.log 2>&1 &
echo $! > ../frontend.pid
echo "✅ Frontend started"

echo "🌐 Platform is running:"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo "   API Docs: http://localhost:8000/docs"
EOF

# Create stop script
cat > ../stop.sh << 'EOF'
#!/bin/bash
echo "🛑 Stopping Mobile Legends Community Platform..."

# Stop backend
if [ -f backend.pid ]; then
    kill $(cat backend.pid) 2>/dev/null || true
    rm backend.pid
    echo "✅ Backend stopped"
fi

# Stop frontend
if [ -f frontend.pid ]; then
    kill $(cat frontend.pid) 2>/dev/null || true
    rm frontend.pid
    echo "✅ Frontend stopped"
fi

echo "🛑 Platform stopped"
EOF

# Create status script
cat > ../status.sh << 'EOF'
#!/bin/bash
echo "📊 Mobile Legends Community Platform Status"
echo "==========================================="

# Check backend
if curl -s http://localhost:8000/api/v1/health/ > /dev/null; then
    echo "✅ Backend:  http://localhost:8000 (Running)"
else
    echo "❌ Backend:  Not responding"
fi

# Check frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend: http://localhost:3000 (Running)"
else
    echo "❌ Frontend: Not responding"
fi

# Check database
if PGPASSWORD=ml_password psql -h localhost -U ml_user -d ml_community -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ Database: PostgreSQL (Connected)"
else
    echo "❌ Database: Not connected"
fi

# Check Redis
if redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis:    Running"
else
    echo "❌ Redis:    Not running"
fi
EOF

# Make scripts executable
if [[ "$ROOT_USER" == "true" ]]; then
    chmod +x ../start.sh ../stop.sh ../status.sh
else
    chmod +x ../start.sh ../stop.sh ../status.sh
fi

# Final status
print_success "🎉 Installation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Wait 1-2 minutes for all services to fully start"
echo "   2. Open http://localhost:3000 in your browser"
echo "   3. API documentation: http://localhost:8000/docs"
echo ""
echo "🛠️  Management commands:"
echo "   ./start.sh  - Start all services"
echo "   ./stop.sh   - Stop all services"
echo "   ./status.sh - Check service status"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
print_success "Installation completed! 🚀"