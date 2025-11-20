"""Conversation management API endpoints."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.conversation import Conversation, ConversationHistory
from app.models.conversation_schemas import (
    ConversationCreate,
    ConversationUpdate,
    ConversationResponse,
    ConversationWithHistory,
    ConversationListResponse,
)

router = APIRouter()


@router.post("", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    conversation_data: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new conversation.
    
    Args:
        conversation_data: Conversation creation data
        current_user: Authenticated user
        db: Database session
        
    Returns:
        Created conversation
    """
    # Create new conversation
    conversation = Conversation(
        name=conversation_data.name,
        user_id=current_user.id,
    )
    
    db.add(conversation)
    await db.commit()
    await db.refresh(conversation)
    
    # Return response with message count
    return ConversationResponse(
        id=conversation.id,
        name=conversation.name,
        user_id=conversation.user_id,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
        message_count=0,
        last_message=None,
    )


@router.get("", response_model=ConversationListResponse)
async def list_conversations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    List all conversations for the current user.
    
    Args:
        current_user: Authenticated user
        db: Database session
        
    Returns:
        List of conversations with metadata
    """
    # Query conversations with message count
    query = (
        select(
            Conversation,
            func.count(ConversationHistory.id).label("message_count"),
            func.max(ConversationHistory.content).label("last_message"),
        )
        .outerjoin(ConversationHistory)
        .where(Conversation.user_id == current_user.id)
        .group_by(Conversation.id)
        .order_by(desc(Conversation.updated_at))
    )
    
    result = await db.execute(query)
    rows = result.all()
    
    # Build response
    conversations = []
    for row in rows:
        conv = row[0]
        message_count = row[1]
        last_message = row[2]
        
        # Truncate last message for preview
        if last_message and len(last_message) > 100:
            last_message = last_message[:100] + "..."
        
        conversations.append(
            ConversationResponse(
                id=conv.id,
                name=conv.name,
                user_id=conv.user_id,
                created_at=conv.created_at,
                updated_at=conv.updated_at,
                message_count=message_count,
                last_message=last_message,
            )
        )
    
    return ConversationListResponse(
        conversations=conversations,
        total=len(conversations),
    )


@router.get("/{conversation_id}", response_model=ConversationWithHistory)
async def get_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get a specific conversation with its full history.
    
    Args:
        conversation_id: Conversation ID
        current_user: Authenticated user
        db: Database session
        
    Returns:
        Conversation with full message history
        
    Raises:
        HTTPException: If conversation not found or unauthorized
    """
    # Query conversation with history
    query = (
        select(Conversation)
        .options(selectinload(Conversation.history))
        .where(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
    )
    
    result = await db.execute(query)
    conversation = result.scalar_one_or_none()
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )
    
    return conversation


@router.patch("/{conversation_id}", response_model=ConversationResponse)
async def update_conversation(
    conversation_id: int,
    conversation_data: ConversationUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Update a conversation (rename).
    
    Args:
        conversation_id: Conversation ID
        conversation_data: Update data
        current_user: Authenticated user
        db: Database session
        
    Returns:
        Updated conversation
        
    Raises:
        HTTPException: If conversation not found or unauthorized
    """
    # Query conversation
    query = select(Conversation).where(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id,
    )
    
    result = await db.execute(query)
    conversation = result.scalar_one_or_none()
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )
    
    # Update conversation
    conversation.name = conversation_data.name
    await db.commit()
    await db.refresh(conversation)
    
    # Get message count
    count_query = select(func.count(ConversationHistory.id)).where(
        ConversationHistory.conversation_id == conversation.id
    )
    count_result = await db.execute(count_query)
    message_count = count_result.scalar()
    
    return ConversationResponse(
        id=conversation.id,
        name=conversation.name,
        user_id=conversation.user_id,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
        message_count=message_count,
        last_message=None,
    )


@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Delete a conversation and all its history.
    
    Args:
        conversation_id: Conversation ID
        current_user: Authenticated user
        db: Database session
        
    Raises:
        HTTPException: If conversation not found or unauthorized
    """
    # Query conversation
    query = select(Conversation).where(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id,
    )
    
    result = await db.execute(query)
    conversation = result.scalar_one_or_none()
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )
    
    # Delete conversation (cascade will delete history)
    await db.delete(conversation)
    await db.commit()
    
    return None
