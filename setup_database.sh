#!/bin/bash

# One-Command Database Setup for ML Community Platform
# This script handles everything: PostgreSQL setup, database creation, and migrations

set -e

# Database Configuration
DB_NAME="ml_community"
DB_USER="ml_admin"
DB_PASSWORD="ML_Community_2024!"
DB_HOST="localhost"
DB_PORT="5432"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🚀 ML Community Platform - One-Command Database Setup${NC}"
echo -e "${BLUE}================================================${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install PostgreSQL
install_postgresql() {
    echo -e "${YELLOW}📦 Installing PostgreSQL...${NC}"
    
    if command_exists apt; then
        # Ubuntu/Debian
        sudo apt update
        sudo apt install -y postgresql postgresql-contrib postgresql-client
    elif command_exists yum; then
        # CentOS/RHEL
        sudo yum install -y postgresql-server postgresql-contrib
        sudo postgresql-setup initdb
    elif command_exists brew; then
        # macOS
        brew install postgresql
    else
        echo -e "${RED}❌ Unsupported package manager. Please install PostgreSQL manually.${NC}"
        exit 1
    fi
}

# Function to start PostgreSQL
start_postgresql() {
    echo -e "${YELLOW}🔄 Starting PostgreSQL service...${NC}"
    
    if command_exists systemctl; then
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
    elif command_exists brew; then
        brew services start postgresql
    else
        echo -e "${YELLOW}⚠️  Please start PostgreSQL manually${NC}"
    fi
}

# Function to wait for PostgreSQL
wait_for_postgresql() {
    echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if pg_isready -h $DB_HOST -p $DB_PORT > /dev/null 2>&1; then
            echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}Attempt $attempt/$max_attempts - Waiting for PostgreSQL...${NC}"
        sleep 2
        ((attempt++))
    done
    
    echo -e "${RED}❌ PostgreSQL failed to start within 60 seconds${NC}"
    exit 1
}

# Function to create database and user
create_database() {
    echo -e "${YELLOW}📊 Creating database and user...${NC}"
    
    sudo -u postgres psql << EOF
-- Create user if not exists
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
        CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD';
    END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;

\q
EOF

    echo -e "${GREEN}✅ Database and user created successfully${NC}"
}

# Function to test connection
test_connection() {
    echo -e "${YELLOW}🔍 Testing database connection...${NC}"
    
    if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Database connection successful${NC}"
    else
        echo -e "${RED}❌ Database connection failed${NC}"
        exit 1
    fi
}

# Function to install Python dependencies
install_dependencies() {
    echo -e "${YELLOW}🐍 Installing Python dependencies...${NC}"
    
    cd /workspace/backend
    
    # Install system dependencies for PostgreSQL
    if command_exists apt; then
        sudo apt install -y postgresql-client libpq-dev python3-dev build-essential
    fi
    
    # Install Python packages
    pip3 install --upgrade pip setuptools wheel
    pip3 install -r requirements.txt
    
    echo -e "${GREEN}✅ Python dependencies installed${NC}"
}

# Function to run migrations
run_migrations() {
    echo -e "${YELLOW}🔄 Running database migrations...${NC}"
    
    cd /workspace/backend
    export PATH="/home/ubuntu/.local/bin:$PATH"
    
    # Check if alembic is available
    if ! command -v alembic &> /dev/null; then
        echo -e "${RED}❌ Alembic not found. Installing dependencies...${NC}"
        install_dependencies
    fi
    
    # Run migrations
    alembic upgrade head
    
    echo -e "${GREEN}✅ Database migrations completed successfully${NC}"
}

# Function to display final information
show_final_info() {
    echo -e "${PURPLE}🎉 Database Setup Complete!${NC}"
    echo -e "${BLUE}================================${NC}"
    echo -e "${YELLOW}📋 Database Configuration:${NC}"
    echo -e "  ${YELLOW}Database Name:${NC} $DB_NAME"
    echo -e "  ${YELLOW}Username:${NC} $DB_USER"
    echo -e "  ${YELLOW}Password:${NC} $DB_PASSWORD"
    echo -e "  ${YELLOW}Host:${NC} $DB_HOST"
    echo -e "  ${YELLOW}Port:${NC} $DB_PORT"
    echo -e "  ${YELLOW}Connection String:${NC} postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
    echo ""
    echo -e "${YELLOW}🚀 Next Steps:${NC}"
    echo -e "  1. Start the backend: ${BLUE}cd backend && uvicorn app.main:app --reload${NC}"
    echo -e "  2. Start the frontend: ${BLUE}cd frontend && npm run dev${NC}"
    echo -e "  3. Access the API docs: ${BLUE}http://localhost:8000/docs${NC}"
    echo -e "  4. Access the frontend: ${BLUE}http://localhost:3000${NC}"
    echo ""
    echo -e "${GREEN}✨ ML Community Platform is ready to use!${NC}"
}

# Main execution
main() {
    # Check if PostgreSQL is installed
    if ! command_exists psql; then
        echo -e "${YELLOW}PostgreSQL not found. Installing...${NC}"
        install_postgresql
    else
        echo -e "${GREEN}✅ PostgreSQL is already installed${NC}"
    fi
    
    # Start PostgreSQL
    start_postgresql
    
    # Wait for PostgreSQL to be ready
    wait_for_postgresql
    
    # Create database and user
    create_database
    
    # Test connection
    test_connection
    
    # Install Python dependencies
    install_dependencies
    
    # Run migrations
    run_migrations
    
    # Show final information
    show_final_info
}

# Run main function
main "$@"