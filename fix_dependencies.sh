#!/bin/bash
# Quick fix script for Docker dependency issues

echo "🔧 Fixing Docker Dependency Conflicts..."
echo ""

cd /home/nishan/Documents/cmatrix/backend

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found"
    echo "Creating new venv..."
    python3 -m venv venv
fi

echo "📦 Reinstalling dependencies with fixed versions..."
./venv/bin/pip install --upgrade pip
./venv/bin/pip uninstall -y langgraph langgraph-checkpoint langgraph-checkpoint-postgres 2>/dev/null
./venv/bin/pip install -r requirements.txt --force-reinstall --no-cache-dir

echo ""
echo "✅ Dependencies fixed!"
echo ""
echo "To verify:"
echo "  ./venv/bin/python -c 'from app.services.orchestrator import get_orchestrator_service; print(\"OK\")'"
echo ""  
echo "Docker build should now work:"
echo "  docker-compose build backend"
echo ""
