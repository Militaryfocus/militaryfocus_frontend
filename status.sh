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