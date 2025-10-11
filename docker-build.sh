#!/bin/bash

echo "🐳 Building ML Community Platform with Docker..."

# Create necessary directories
mkdir -p data/uploads data/hero_images

# Build and start services
echo "📦 Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=20

echo ""
echo "✅ ML Community Platform is starting up!"
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost:8001"
echo "📊 API Docs: http://localhost:8001/docs"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"