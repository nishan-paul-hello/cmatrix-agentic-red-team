#!/bin/bash

# Health Check Script for CMatrix Services
# This script verifies all required services are running and healthy

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   CMatrix System Health Check         ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo ""

# Function to check service health
check_service() {
    local service_name=$1
    local check_command=$2
    local description=$3
    
    echo -n "Checking $description... "
    
    if eval "$check_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Healthy${NC}"
        return 0
    else
        echo -e "${RED}✗ Unhealthy${NC}"
        return 1
    fi
}

# Function to check Docker container
check_container() {
    local container_name=$1
    local description=$2
    
    echo -n "Checking $description... "
    
    if docker ps --format '{{.Names}}' | grep -q "^${container_name}$"; then
        local status=$(docker inspect --format='{{.State.Health.Status}}' "$container_name" 2>/dev/null || echo "running")
        if [ "$status" = "healthy" ] || [ "$status" = "running" ]; then
            echo -e "${GREEN}✓ Running${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠ Running but not healthy (status: $status)${NC}"
            return 1
        fi
    else
        echo -e "${RED}✗ Not running${NC}"
        return 1
    fi
}

# Track overall health
all_healthy=true

echo -e "${BLUE}=== Core Services ===${NC}"

# Check Redis
if ! check_container "cmatrix-redis" "Redis (Message Broker)"; then
    all_healthy=false
fi

# Check PostgreSQL
if ! check_container "cmatrix-postgres" "PostgreSQL (Database)"; then
    all_healthy=false
fi

# Check Qdrant
if ! check_container "cmatrix-qdrant" "Qdrant (Vector Database)"; then
    all_healthy=false
else
    # Additional Qdrant API check
    if ! check_service "qdrant-api" "curl -sf http://localhost:6333/healthz" "  ├─ Qdrant API"; then
        all_healthy=false
    fi
    if ! check_service "qdrant-collections" "curl -sf http://localhost:6333/collections" "  └─ Qdrant Collections"; then
        all_healthy=false
    fi
fi

echo ""
echo -e "${BLUE}=== Application Services ===${NC}"

# Check Backend
if ! check_container "cmatrix-backend" "Backend API" && ! check_container "cmatrix-backend-dev" "Backend API"; then
    all_healthy=false
else
    # Additional backend health check
    if ! check_service "backend-api" "curl -sf http://localhost:8000/api/v1/health" "  └─ Backend Health Endpoint"; then
        all_healthy=false
    fi
fi

# Check Worker
if ! check_container "cmatrix-worker" "Celery Worker"; then
    all_healthy=false
fi

# Check Frontend
if ! check_container "cmatrix-frontend" "Frontend" && ! check_container "cmatrix-frontend-dev" "Frontend"; then
    all_healthy=false
else
    # Additional frontend check
    if ! check_service "frontend-web" "curl -sf http://localhost:3000" "  └─ Frontend Web Server"; then
        all_healthy=false
    fi
fi

echo ""
echo -e "${BLUE}=== Service Endpoints ===${NC}"
echo -e "  Frontend:  ${GREEN}http://localhost:3000${NC}"
echo -e "  Backend:   ${GREEN}http://localhost:8000${NC}"
echo -e "  API Docs:  ${GREEN}http://localhost:8000/docs${NC}"
echo -e "  Qdrant:    ${GREEN}http://localhost:6333/dashboard${NC}"
echo -e "  PostgreSQL: ${GREEN}localhost:5432${NC}"
echo -e "  Redis:     ${GREEN}localhost:6379${NC}"

echo ""
echo -e "${BLUE}=== Knowledge Base Status ===${NC}"

# Check if Qdrant collection exists
if curl -sf http://localhost:6333/collections 2>/dev/null | grep -q "cmatrix_memory"; then
    echo -e "  Knowledge Base Collection: ${GREEN}✓ Exists (cmatrix_memory)${NC}"
    
    # Get collection info
    collection_info=$(curl -sf http://localhost:6333/collections/cmatrix_memory 2>/dev/null || echo "{}")
    if [ "$collection_info" != "{}" ]; then
        points_count=$(echo "$collection_info" | grep -o '"points_count":[0-9]*' | grep -o '[0-9]*' || echo "0")
        echo -e "  Stored Memories: ${GREEN}$points_count${NC}"
    fi
else
    echo -e "  Knowledge Base Collection: ${YELLOW}⚠ Not created yet${NC}"
    echo -e "  ${YELLOW}Note: Collection will be created on first use${NC}"
fi

echo ""
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"

# Final summary
if [ "$all_healthy" = true ]; then
    echo -e "${GREEN}✓ All services are healthy!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some services are unhealthy. Please check the logs.${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting tips:${NC}"
    echo "  • Run: docker-compose ps"
    echo "  • Run: docker-compose logs <service-name>"
    echo "  • Run: docker-compose restart <service-name>"
    exit 1
fi
