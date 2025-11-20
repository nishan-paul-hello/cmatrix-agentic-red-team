"""Pydantic schemas for conversation management."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, validator


class ConversationHistoryBase(BaseModel):
    """Base schema for conversation history."""
    role: str = Field(..., description="Message role (user or assistant)")
    content: str = Field(..., description="Message content")


class ConversationHistoryCreate(ConversationHistoryBase):
    """Schema for creating conversation history."""
    pass


class ConversationHistoryResponse(ConversationHistoryBase):
    """Schema for conversation history response."""
    id: int
    conversation_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class ConversationBase(BaseModel):
    """Base schema for conversation."""
    name: str = Field(..., min_length=1, max_length=255, description="Conversation name")


class ConversationCreate(BaseModel):
    """Schema for creating a conversation."""
    name: Optional[str] = Field(default="New Conversation", max_length=255, description="Conversation name")
    
    @validator("name", pre=True, always=True)
    def set_default_name(cls, v):
        """Set default name if not provided."""
        if not v or not v.strip():
            return "New Conversation"
        return v.strip()


class ConversationUpdate(BaseModel):
    """Schema for updating a conversation."""
    name: str = Field(..., min_length=1, max_length=255, description="New conversation name")
    
    @validator("name")
    def name_not_empty(cls, v):
        """Validate name is not empty or whitespace."""
        if not v or not v.strip():
            raise ValueError("Name cannot be empty")
        return v.strip()


class ConversationResponse(BaseModel):
    """Schema for conversation response."""
    id: int
    name: str
    user_id: int
    created_at: datetime
    updated_at: datetime
    message_count: Optional[int] = Field(default=0, description="Number of messages in conversation")
    last_message: Optional[str] = Field(default=None, description="Preview of last message")
    
    class Config:
        from_attributes = True


class ConversationWithHistory(ConversationResponse):
    """Schema for conversation with full history."""
    history: List[ConversationHistoryResponse] = Field(default_factory=list)
    
    class Config:
        from_attributes = True


class ConversationListResponse(BaseModel):
    """Schema for list of conversations."""
    conversations: List[ConversationResponse]
    total: int
    
    class Config:
        json_schema_extra = {
            "example": {
                "conversations": [
                    {
                        "id": 1,
                        "name": "Security Scan Discussion",
                        "user_id": 1,
                        "created_at": "2025-11-20T00:00:00",
                        "updated_at": "2025-11-20T01:00:00",
                        "message_count": 5,
                        "last_message": "The scan completed successfully..."
                    }
                ],
                "total": 1
            }
        }
