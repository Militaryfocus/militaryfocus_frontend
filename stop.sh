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