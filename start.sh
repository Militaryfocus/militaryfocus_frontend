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