"""LLM service layer for database operations."""

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger

from app.models.llm import (
    MasterLLMModel,
    UserModelMapping,
    LLMModelWithMappingSchema,
    MasterLLMModelSchema,
)


class LLMService:
    """Service for managing LLM models and user mappings."""
    
    @staticmethod
    async def get_all_models_for_user(
        db: AsyncSession,
        user_id: int
    ) -> List[LLMModelWithMappingSchema]:
        """
        Get all available LLM models with user's mapping status.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            List of models with user's API key and active status
        """
        # Get all active master models
        result = await db.execute(
            select(MasterLLMModel).where(MasterLLMModel.status == "active")
        )
        master_models = result.scalars().all()
        
        # Get user's mappings
        mapping_result = await db.execute(
            select(UserModelMapping).where(UserModelMapping.user_id == user_id)
        )
        user_mappings = {m.llm_model_id: m for m in mapping_result.scalars().all()}
        
        # Combine data
        models_with_mapping = []
        for model in master_models:
            mapping = user_mappings.get(model.id)
            
            # Mask API key if exists
            api_key_masked = None
            has_api_key = False
            if mapping and mapping.api_key:
                has_api_key = True
                key = mapping.api_key
                if len(key) > 8:
                    api_key_masked = f"{key[:4]}...{key[-4:]}"
                else:
                    api_key_masked = "***"
            
            models_with_mapping.append(
                LLMModelWithMappingSchema(
                    id=model.id,
                    name=model.name,
                    description=model.description,
                    provider=model.provider,
                    default_model_name=model.default_model_name,
                    status=model.status,
                    has_api_key=has_api_key,
                    is_active=mapping.is_active if mapping else False,
                    api_key_masked=api_key_masked,
                )
            )
        
        return models_with_mapping
    
    @staticmethod
    async def update_user_api_key(
        db: AsyncSession,
        user_id: int,
        model_id: int,
        api_key: str
    ) -> UserModelMapping:
        """
        Update or create user's API key for a model.
        
        Args:
            db: Database session
            user_id: User ID
            model_id: LLM model ID
            api_key: API key to set
            
        Returns:
            Updated or created mapping
        """
        # Check if mapping exists
        result = await db.execute(
            select(UserModelMapping).where(
                UserModelMapping.user_id == user_id,
                UserModelMapping.llm_model_id == model_id
            )
        )
        mapping = result.scalar_one_or_none()
        
        if mapping:
            # Update existing
            mapping.api_key = api_key
            logger.info(f"Updated API key for user {user_id}, model {model_id}")
        else:
            # Create new
            mapping = UserModelMapping(
                user_id=user_id,
                llm_model_id=model_id,
                api_key=api_key,
                is_active=False
            )
            db.add(mapping)
            logger.info(f"Created new API key mapping for user {user_id}, model {model_id}")
        
        await db.commit()
        await db.refresh(mapping)
        return mapping
    
    @staticmethod
    async def activate_model(
        db: AsyncSession,
        user_id: int,
        model_id: int
    ) -> UserModelMapping:
        """
        Activate a model for the user (deactivates others).
        
        Args:
            db: Database session
            user_id: User ID
            model_id: LLM model ID to activate
            
        Returns:
            Activated mapping
            
        Raises:
            ValueError: If mapping doesn't exist or has no API key
        """
        # Get the mapping
        result = await db.execute(
            select(UserModelMapping).where(
                UserModelMapping.user_id == user_id,
                UserModelMapping.llm_model_id == model_id
            )
        )
        mapping = result.scalar_one_or_none()
        
        if not mapping:
            raise ValueError(f"No mapping found for user {user_id} and model {model_id}")
        
        if not mapping.api_key:
            raise ValueError(f"Cannot activate model without API key")
        
        # Deactivate all other models for this user (trigger handles this, but being explicit)
        await db.execute(
            select(UserModelMapping).where(
                UserModelMapping.user_id == user_id
            )
        )
        
        # Activate this model
        mapping.is_active = True
        await db.commit()
        await db.refresh(mapping)
        
        logger.info(f"Activated model {model_id} for user {user_id}")
        return mapping
    
    @staticmethod
    async def get_active_model(
        db: AsyncSession,
        user_id: int
    ) -> Optional[tuple[MasterLLMModel, UserModelMapping]]:
        """
        Get user's currently active model.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            Tuple of (MasterLLMModel, UserModelMapping) or None
        """
        result = await db.execute(
            select(UserModelMapping, MasterLLMModel)
            .join(MasterLLMModel, UserModelMapping.llm_model_id == MasterLLMModel.id)
            .where(
                UserModelMapping.user_id == user_id,
                UserModelMapping.is_active == True
            )
        )
        row = result.first()
        
        if row:
            return row.MasterLLMModel, row.UserModelMapping
        return None
    
    @staticmethod
    async def get_model_config(
        db: AsyncSession,
        user_id: int,
        provider: str
    ) -> Optional[tuple[MasterLLMModel, UserModelMapping]]:
        """
        Get model configuration for a specific provider.
        
        Args:
            db: Database session
            user_id: User ID
            provider: Provider name (e.g., 'gemini', 'openrouter')
            
        Returns:
            Tuple of (MasterLLMModel, UserModelMapping) or None
        """
        result = await db.execute(
            select(UserModelMapping, MasterLLMModel)
            .join(MasterLLMModel, UserModelMapping.llm_model_id == MasterLLMModel.id)
            .where(
                UserModelMapping.user_id == user_id,
                MasterLLMModel.provider == provider,
                UserModelMapping.api_key.isnot(None)
            )
            .limit(1)
        )
        row = result.first()
        
        if row:
            return row.MasterLLMModel, row.UserModelMapping
        return None


# Global service instance
llm_service = LLMService()
