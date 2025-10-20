#!/bin/bash

# 🚀 ML Community Platform - Quick Start Script
# Production Ready Version v3.0.0

echo "🚀 ML Community Platform - Quick Start"
echo "======================================"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Clone repository
echo "📥 Cloning repository..."
git clone https://github.com/Militaryfocus/militaryfocus_frontend.git
cd militaryfocus_frontend

# Checkout production ready version
echo "🏷️ Checking out production ready version..."
git checkout v3.0.0-production-ready

# Navigate to monolith directory
cd ml-community-monolith

# Create virtual environment
echo "🐍 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Initialize database
echo "🗄️ Initializing database..."
python -c "from app.core.database import engine, Base; Base.metadata.create_all(bind=engine)"

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "🚀 Starting server..."
echo "   URL: http://localhost:8000"
echo "   Admin: http://localhost:8000/admin"
echo "   API: http://localhost:8000/api/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000