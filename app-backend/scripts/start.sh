#!/bin/bash

# Production server startup script
echo "🚀 Starting CMatrix Backend (Production Mode)"
echo "=============================================="

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Run the application
echo "🎯 Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-3012} --workers 4 --log-level info
