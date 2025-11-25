#!/bin/bash

# Quick test to verify the knowledge base (Qdrant) is working

set -e

echo "🧪 Testing CMatrix Knowledge Base..."
echo ""

# Check if Qdrant is accessible
echo "1. Checking Qdrant connection..."
if curl -sf http://localhost:6333/healthz > /dev/null 2>&1; then
    echo "   ✓ Qdrant is accessible"
else
    echo "   ✗ Qdrant is not accessible"
    echo "   Please run: docker start qdrant"
    exit 1
fi

# Check if collection exists
echo "2. Checking knowledge base collection..."
if curl -sf http://localhost:6333/collections 2>/dev/null | grep -q "cmatrix_memory"; then
    echo "   ✓ Collection 'cmatrix_memory' exists"
    
    # Get collection stats
    points=$(curl -sf http://localhost:6333/collections/cmatrix_memory 2>/dev/null | grep -o '"points_count":[0-9]*' | grep -o '[0-9]*' || echo "0")
    echo "   ℹ Currently storing $points memories"
else
    echo "   ⚠ Collection not created yet (will be created on first use)"
fi

# Test adding a memory
echo "3. Testing memory storage..."
python3 - <<'PYTHON'
import sys
sys.path.insert(0, '/home/nishan/Documents/cmatrix/backend')

from app.services.vector_store import get_vector_store

try:
    store = get_vector_store()
    
    # Test data
    test_content = "Test: Port scan on 192.168.1.100 found ports 22, 80, 443 open"
    test_metadata = {
        "user_id": 999,
        "type": "test",
        "target": "192.168.1.100"
    }
    
    # Try to add memory
    success = store.add_memory(test_content, test_metadata)
    
    if success:
        print("   ✓ Successfully stored test memory")
        
        # Try to search for it
        results = store.search_memory("192.168.1.100", limit=1, filter_metadata={"user_id": 999})
        
        if results and len(results) > 0:
            print("   ✓ Successfully retrieved test memory")
            print(f"   ℹ Found: {results[0]['content'][:60]}...")
        else:
            print("   ⚠ Could not retrieve test memory")
    else:
        print("   ✗ Failed to store test memory")
        sys.exit(1)
        
except Exception as e:
    print(f"   ✗ Error: {e}")
    sys.exit(1)
PYTHON

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Knowledge Base is working correctly!"
    echo ""
    echo "You can now:"
    echo "  • Ask the agent to scan ports and save results"
    echo "  • Search for past scan results"
    echo "  • Store any important findings"
else
    echo ""
    echo "❌ Knowledge Base test failed"
    echo "Please check the logs for more details"
    exit 1
fi
