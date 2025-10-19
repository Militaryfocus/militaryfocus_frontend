#!/bin/bash

# Database Initialization Script for ML Community Platform
# This script creates the database, user, and runs initial migrations

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
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Initializing ML Community Database...${NC}"

# Check if PostgreSQL is running
if ! pg_isready -h $DB_HOST -p $DB_PORT > /dev/null 2>&1; then
    echo -e "${RED}❌ PostgreSQL is not running on $DB_HOST:$DB_PORT${NC}"
    echo -e "${YELLOW}Please start PostgreSQL first:${NC}"
    echo "  sudo systemctl start postgresql"
    echo "  # or"
    echo "  sudo service postgresql start"
    exit 1
fi

echo -e "${GREEN}✅ PostgreSQL is running${NC}"

# Create database and user
echo -e "${BLUE}📊 Creating database and user...${NC}"

# Connect to PostgreSQL as superuser and create database/user
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

# Test connection
echo -e "${BLUE}🔍 Testing database connection...${NC}"
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    exit 1
fi

# Run Alembic migrations
echo -e "${BLUE}🔄 Running database migrations...${NC}"
cd /workspace/backend
export PATH="/home/ubuntu/.local/bin:$PATH"

# Check if alembic is available
if ! command -v alembic &> /dev/null; then
    echo -e "${RED}❌ Alembic not found. Please install dependencies first:${NC}"
    echo "  pip3 install -r requirements.txt"
    exit 1
fi

# Run migrations
alembic upgrade head

echo -e "${GREEN}✅ Database migrations completed successfully${NC}"

# Display connection information
echo -e "${BLUE}📋 Database Configuration:${NC}"
echo -e "  ${YELLOW}Database Name:${NC} $DB_NAME"
echo -e "  ${YELLOW}Username:${NC} $DB_USER"
echo -e "  ${YELLOW}Password:${NC} $DB_PASSWORD"
echo -e "  ${YELLOW}Host:${NC} $DB_HOST"
echo -e "  ${YELLOW}Port:${NC} $DB_PORT"
echo -e "  ${YELLOW}Connection String:${NC} postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"

echo -e "${GREEN}🎉 Database initialization completed successfully!${NC}"
echo -e "${BLUE}You can now start the application with:${NC}"
echo -e "  ${YELLOW}uvicorn app.main:app --reload${NC}"