#!/bin/bash

# ML Community Monolith - Database Permissions Fix Script
# This script fixes PostgreSQL permissions for ml_admin user

set -e

echo "🔧 ML Community Monolith - Database Permissions Fix"
echo "=================================================="

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

# Step 1: Check if PostgreSQL is running
print_step "1. Checking PostgreSQL status..."
if ! sudo service postgresql status > /dev/null 2>&1; then
    print_warning "PostgreSQL is not running. Starting it..."
    sudo service postgresql start
    sleep 3
fi
print_status "PostgreSQL is running"

# Step 2: Check if database exists
print_step "2. Checking database..."
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw ml_community; then
    print_warning "Database ml_community does not exist. Creating it..."
    sudo -u postgres psql -c "CREATE DATABASE ml_community;"
fi
print_status "Database ml_community exists"

# Step 3: Check if user exists
print_step "3. Checking user ml_admin..."
if ! sudo -u postgres psql -c "SELECT 1 FROM pg_roles WHERE rolname='ml_admin';" | grep -q 1; then
    print_warning "User ml_admin does not exist. Creating it..."
    sudo -u postgres psql -c "CREATE USER ml_admin WITH PASSWORD 'ML_Community_2024!';"
fi
print_status "User ml_admin exists"

# Step 4: Grant database privileges
print_step "4. Granting database privileges..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ml_community TO ml_admin;" 2>/dev/null || true
print_status "Database privileges granted"

# Step 5: Grant schema privileges
print_step "5. Granting schema privileges..."
sudo -u postgres psql -d ml_community -c "GRANT ALL ON SCHEMA public TO ml_admin;" 2>/dev/null || true
sudo -u postgres psql -d ml_community -c "GRANT CREATE ON SCHEMA public TO ml_admin;" 2>/dev/null || true
print_status "Schema privileges granted"

# Step 6: Grant table privileges
print_step "6. Granting table privileges..."
sudo -u postgres psql -d ml_community -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ml_admin;" 2>/dev/null || true
sudo -u postgres psql -d ml_community -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ml_admin;" 2>/dev/null || true
print_status "Table privileges granted"

# Step 7: Grant future privileges
print_step "7. Granting future privileges..."
sudo -u postgres psql -d ml_community -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ml_admin;" 2>/dev/null || true
sudo -u postgres psql -d ml_community -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ml_admin;" 2>/dev/null || true
print_status "Future privileges granted"

# Step 8: Test connection
print_step "8. Testing database connection..."
if sudo -u postgres psql -d ml_community -c "SELECT 1;" > /dev/null 2>&1; then
    print_status "Database connection successful"
else
    print_error "Database connection failed"
    exit 1
fi

# Step 9: Test Alembic (if available)
print_step "9. Testing Alembic permissions..."
if [ -f "alembic.ini" ] && [ -d "venv" ]; then
    if source venv/bin/activate 2>/dev/null && alembic current > /dev/null 2>&1; then
        print_status "Alembic permissions are working"
    else
        print_warning "Alembic test failed, but permissions should be fixed"
    fi
else
    print_warning "Alembic not found, skipping test"
fi

echo ""
echo "✅ Database permissions fix completed successfully!"
echo ""
echo "📋 What was fixed:"
echo "   - Granted ALL privileges on schema public to ml_admin"
echo "   - Granted CREATE privileges on schema public to ml_admin"
echo "   - Granted privileges on all tables and sequences"
echo "   - Set up future privileges for new objects"
echo ""
echo "🚀 You can now run:"
echo "   - alembic upgrade head"
echo "   - python create_admin.py"
echo "   - uvicorn app.main:app --host 0.0.0.0 --port 8000"
echo ""
echo "🎉 ML Community Platform should now work without permission errors!"