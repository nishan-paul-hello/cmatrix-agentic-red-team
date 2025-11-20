"""Pydantic models for API requests and responses."""

from app.models.chat import ChatRequest, ChatResponse
from app.models.responses import HealthResponse, ErrorResponse
from app.models.conversation import Conversation, ConversationHistory
from app.models.conversation_schemas import (
    ConversationCreate,
    ConversationUpdate,
    ConversationResponse,
    ConversationWithHistory,
    ConversationListResponse,
    ConversationHistoryResponse,
)

__all__ = [
    "ChatRequest",
    "ChatResponse",
    "HealthResponse",
    "ErrorResponse",
    "Conversation",
    "ConversationHistory",
    "ConversationCreate",
    "ConversationUpdate",
    "ConversationResponse",
    "ConversationWithHistory",
    "ConversationListResponse",
    "ConversationHistoryResponse",
]

