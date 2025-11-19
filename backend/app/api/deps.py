"""API dependencies and dependency injection."""

from typing import Generator
from fastapi import Depends, HTTPException, status
from app.services.orchestrator import get_orchestrator_service
from app.core.config import settings


def get_orchestrator():
    """
    Dependency to get orchestrator service.
    
    Returns:
        Orchestrator service instance
    """
    return get_orchestrator_service()


def verify_api_key(api_key: str = None) -> bool:
    """
    Verify API key if authentication is enabled.
    
    Args:
        api_key: API key to verify
        
    Returns:
        True if valid
        
    Raises:
        HTTPException: If API key is invalid
    """
    # Placeholder for future API key authentication
    # For now, always return True
    return True
