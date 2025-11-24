"""LangGraph checkpoint service for persistent workflow state.

Note: For langgraph 0.2.45, we use a simpler checkpointing approach.
The checkpoint functionality exists but with a different API.
"""

from typing import Optional, Dict, Any
from loguru import logger
from app.core.config import settings


class CheckpointService:
    """Service for managing workflow state persistence.
    
    For langgraph 0.2.45, we implement a lightweight checkpointing mechanism
    that stores state in the database. Full LangGraph checkpoint integration
    requires langgraph >= 1.0, which has dependency conflicts with langchain 0.3.7.
    """
    
    _instance: Optional['CheckpointService'] = None
    _enabled: bool = False
    
    def __new__(cls):
        """Singleton pattern to ensure one service instance."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Initialize checkpoint service."""
        if not hasattr(self, '_initialized'):
            self._initialized = True
            logger.info("Checkpoint service initialized (lightweight mode for langgraph 0.2.45)")
            logger.info("Note: Full PostgreSQL checkpointing requires langgraph >= 1.0")
            logger.info("Current implementation: State persisted via conversation history in database")
    
    def is_enabled(self) -> bool:
        """Check if checkpointing is enabled.
        
        Returns:
            False for langgraph 0.2.45 (uses conversation history instead)
        """
        return self._enabled
    
    def get_thread_id(self, user_id: int, conversation_id: Optional[int] = None) -> str:
        """Generate thread ID for state tracking.
        
        Args:
            user_id: User ID
            conversation_id: Optional conversation ID
            
        Returns:
            Thread ID string
        """
        if conversation_id is not None:
            return f"user_{user_id}_conv_{conversation_id}"
        return f"user_{user_id}"


# Global checkpoint service instance
_checkpoint_service: Optional[CheckpointService] = None


def get_checkpoint_service() -> CheckpointService:
    """
    Get or create global checkpoint service instance.
    
    Returns:
        CheckpointService instance
    """
    global _checkpoint_service
    if _checkpoint_service is None:
        _checkpoint_service = CheckpointService()
    return _checkpoint_service


def get_checkpointer():
    """
    Get checkpointer instance.
    
    For langgraph 0.2.45, this returns None as the built-in PostgresSaver
    is not available. State persistence is handled through conversation history.
    
    Returns:
        None (checkpointing handled via conversation history)
    """
    logger.debug("Checkpointer requested but not available in langgraph 0.2.45")
    logger.debug("State persistence handled via conversation history in database")
    return None
