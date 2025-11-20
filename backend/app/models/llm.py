"""LLM database models and schemas."""

from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from app.core.database import Base


class MasterLLMModel(Base):
    """Master LLM model definitions."""
    
    __tablename__ = "master_llm_models"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text)
    provider = Column(String(100), nullable=False, index=True)
    default_model_name = Column(String(255))
    status = Column(String(50), nullable=False, default="active")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user_mappings = relationship("UserModelMapping", back_populates="llm_model", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<MasterLLMModel(id={self.id}, name='{self.name}', provider='{self.provider}')>"


class UserModelMapping(Base):
    """User-specific LLM model API key mappings."""
    
    __tablename__ = "user_model_mappings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    llm_model_id = Column(Integer, ForeignKey("master_llm_models.id", ondelete="CASCADE"), nullable=False, index=True)
    api_key = Column(Text)
    is_active = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", backref="llm_mappings")
    llm_model = relationship("MasterLLMModel", back_populates="user_mappings")
    
    def __repr__(self):
        return f"<UserModelMapping(id={self.id}, user_id={self.user_id}, llm_model_id={self.llm_model_id}, is_active={self.is_active})>"


# Pydantic Schemas

class MasterLLMModelSchema(BaseModel):
    """Schema for master LLM model."""
    id: int
    name: str
    description: Optional[str]
    provider: str
    default_model_name: Optional[str]
    status: str
    
    class Config:
        from_attributes = True


class UserModelMappingSchema(BaseModel):
    """Schema for user model mapping."""
    id: int
    user_id: int
    llm_model_id: int
    has_api_key: bool  # Don't expose actual API key
    is_active: bool
    
    class Config:
        from_attributes = True


class LLMModelWithMappingSchema(BaseModel):
    """Combined schema showing model with user's mapping status."""
    id: int
    name: str
    description: Optional[str]
    provider: str
    default_model_name: Optional[str]
    status: str
    has_api_key: bool
    is_active: bool
    api_key_masked: Optional[str]  # Masked version like "AIza...RiY"
    
    class Config:
        from_attributes = True


class UpdateApiKeyRequest(BaseModel):
    """Request to update API key for a model."""
    api_key: str


class ActivateModelRequest(BaseModel):
    """Request to activate a model."""
    pass  # No body needed, model_id comes from path
