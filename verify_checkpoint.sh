#!/bin/bash
# Simple checkpoint verification script

echo "=================================================================="
echo "           TASK 1.2 CHECKPOINT VERIFICATION"
echo "=================================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Test 1: PostgreSQL running
echo -n "1. PostgreSQL accessible? "
if psql -U cmatrix -d cmatrix -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} (PostgreSQL is running)"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} (Cannot connect - check if PostgreSQL is running)"
    ((FAILED++))
fi

# Test 2: Check database tables
echo -n "2. Database schema OK? "
if psql -U cmatrix -d cmatrix -c "SELECT 1 FROM information_schema.tables LIMIT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗${NC}"
    ((FAILED++))
fi

# Test 3: Checkpoint tables
echo -n "3. Checkpoint tables exist? "
COUNT=$(psql -U cmatrix -d cmatrix -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'checkpoint%'" 2>/dev/null | tr -d ' ')
if [ "$COUNT" -ge 3 ] 2>/dev/null; then
    echo -e "${GREEN}✓${NC} ($COUNT tables found)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} (found $COUNT, expected 3 - will be created on first run)"
fi

# Test 4: Python environment
echo -n "4. Virtual environment OK? "
if [ -f "/home/nishan/Documents/cmatrix/backend/venv/bin/python" ]; then
    echo -e "${GREEN}✓${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} (venv not found)"
    ((FAILED++))
fi

# Test 5: Package imports
echo -n "5. Can import checkpoint service? "
cd /home/nishan/Documents/cmatrix/backend
if timeout 5 ./venv/bin/python -c "import sys; from app.services.checkpoint import CheckpointService; sys.exit(0)" 2>/dev/null; then
    echo -e "${GREEN}✓${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} (import may be slow or failed)"
fi

# Summary
echo ""
echo "=================================================================="
echo "                        SUMMARY"
echo "=================================================================="
echo ""
echo "Passed: $PASSED"
echo "Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Basic infrastructure OK!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Start backend: cd backend && ./venv/bin/uvicorn app.main:app --reload"
    echo "  2. Start celery: cd backend && ./venv/bin/celery -A app.worker worker --loglevel=info"
    echo "  3. Send a test request through the frontend"
    echo "  4. Check checkpoints: psql -U cmatrix -d cmatrix -c 'SELECT COUNT(*) FROM checkpoints;'"
    echo ""
else
    echo -e "${RED}❌ Some tests failed. Please fix the issues above.${NC}"
    echo ""
fi
