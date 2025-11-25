#!/bin/bash

# Demo Script: Test Long-Term Memory Feature
# This script helps you verify the feature works from user perspective

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  CMatrix Long-Term Memory Feature - User Testing Demo         ║"
echo "╔════════════════════════════════════════════════════════════════╗"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 PREREQUISITES CHECK${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Qdrant
if docker ps | grep -q qdrant; then
    echo -e "${GREEN}✅ Qdrant is running${NC}"
else
    echo -e "${YELLOW}⚠️  Qdrant is NOT running. Start it with: docker start qdrant${NC}"
fi

# Check Backend
if ps aux | grep -q "[u]vicorn app.main:app"; then
    echo -e "${GREEN}✅ Backend is running${NC}"
    BACKEND_PORT=$(ps aux | grep "[u]vicorn" | grep -oP "port \K[0-9]+")
    echo "   Backend URL: http://localhost:${BACKEND_PORT:-8000}"
else
    echo -e "${YELLOW}⚠️  Backend is NOT running${NC}"
fi

# Check Frontend
if ps aux | grep -q "[n]ode.*next.*dev"; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
    echo "   Frontend URL: http://localhost:3000"
else
    echo -e "${YELLOW}⚠️  Frontend is NOT running${NC}"
fi

echo ""
echo -e "${BLUE}🧪 TESTING INSTRUCTIONS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo -e "${GREEN}TEST 1: Save Information to Memory${NC}"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Login to your account"
echo "3. In the chat, type:"
echo ""
echo "   💬 \"Save to knowledge base: Found open ports 22, 80, 443 on server 192.168.1.100\""
echo ""
echo "4. Expected: Agent responds with 'Successfully saved to knowledge base'"
echo ""
read -p "Press Enter when you've completed TEST 1..."

echo ""
echo -e "${GREEN}TEST 2: Recall Information in NEW Conversation${NC}"
echo "1. Click 'New Conversation' button (or refresh the page)"
echo "2. In the NEW chat, type:"
echo ""
echo "   💬 \"Check the knowledge base for information about 192.168.1.100\""
echo ""
echo "3. Expected: Agent recalls the ports you saved earlier!"
echo ""
read -p "Press Enter when you've completed TEST 2..."

echo ""
echo -e "${GREEN}TEST 3: Semantic Search (Different Words)${NC}"
echo "1. In the same or new conversation, type:"
echo ""
echo "   💬 \"What do we know about server 192.168.1.100?\""
echo ""
echo "2. Expected: Agent finds the information even though you used different words"
echo ""
read -p "Press Enter when you've completed TEST 3..."

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ VERIFICATION COMPLETE${NC}"
echo ""
echo "If all tests passed, the long-term memory feature is working!"
echo ""
echo "Additional tests you can try:"
echo "  • Restart the backend and check if data persists"
echo "  • Login as different user and verify data isolation"
echo "  • Save vulnerability information and recall it later"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
