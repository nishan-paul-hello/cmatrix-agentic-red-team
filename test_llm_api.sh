#!/bin/bash
# Test script to verify LLM API endpoints work with authentication

echo "Testing LLM API endpoints..."
echo ""

# Login and get token (replace with your actual password)
echo "1. Logging in as 'kai'..."
read -sp "Enter password for user 'kai': " PASSWORD
echo ""

TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"kai\",\"password\":\"$PASSWORD\"}" | jq -r '.access_token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Login failed! Please check your password."
  exit 1
fi

echo "✅ Login successful! Token: ${TOKEN:0:20}..."
echo ""

# Test get models
echo "2. Fetching LLM models..."
MODELS=$(curl -s http://localhost:8000/api/v1/llm/models \
  -H "Authorization: Bearer $TOKEN")

echo "$MODELS" | jq '.'
echo ""

# Count models
MODEL_COUNT=$(echo "$MODELS" | jq 'length')
echo "✅ Found $MODEL_COUNT models"
echo ""

# Test update API key (example)
echo "3. To update an API key, use:"
echo "curl -X PUT http://localhost:8000/api/v1/llm/models/3/api-key \\"
echo "  -H 'Authorization: Bearer $TOKEN' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"api_key\":\"your-api-key-here\"}'"
echo ""

# Test activate model
echo "4. To activate a model, use:"
echo "curl -X POST http://localhost:8000/api/v1/llm/models/3/activate \\"
echo "  -H 'Authorization: Bearer $TOKEN'"
