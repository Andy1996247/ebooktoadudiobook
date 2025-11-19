#!/bin/bash

# Function to kill process on a specific port
kill_port() {
    PORT=$1
    PID=$(lsof -t -i:$PORT)
    if [ ! -z "$PID" ]; then
        echo "Killing process on port $PORT (PID: $PID)..."
        kill -9 $PID
    fi
}

case "$1" in
    start)
        echo "Checking for existing processes..."
        kill_port 8000
        
        echo "Starting Backend..."
        source venv/bin/activate
        # Start in background and save PID
        python3 -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
        BACKEND_PID=$!
        echo $BACKEND_PID > .backend.pid
        echo "Backend started (PID: $BACKEND_PID). Logs: backend.log"
        
        echo "Starting Frontend..."
        cd frontend
        npm run dev > ../frontend.log 2>&1 &
        FRONTEND_PID=$!
        echo $FRONTEND_PID > ../.frontend.pid
        echo "Frontend started (PID: $FRONTEND_PID). Logs: frontend.log"
        cd ..
        
        echo "App is running!"
        echo "Frontend: http://localhost:5174"
        echo "Backend: http://localhost:8000"
        ;;
        
    stop)
        echo "Stopping application..."
        
        if [ -f .backend.pid ]; then
            PID=$(cat .backend.pid)
            echo "Stopping Backend (PID: $PID)..."
            kill $PID 2>/dev/null
            rm .backend.pid
        fi
        
        # Fallback: ensure port 8000 is free
        kill_port 8000
        
        if [ -f .frontend.pid ]; then
            PID=$(cat .frontend.pid)
            echo "Stopping Frontend (PID: $PID)..."
            kill $PID 2>/dev/null
            rm .frontend.pid
        fi
        
        # Fallback: kill vite
        pkill -f "vite"
        
        echo "Application stopped."
        ;;
        
    restart)
        $0 stop
        sleep 2
        $0 start
        ;;
        
    *)
        echo "Usage: $0 {start|stop|restart}"
        exit 1
        ;;
esac
