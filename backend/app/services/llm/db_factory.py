"""Database-aware LLM Provider Factory."""

from typing import Dict, Optional
from loguru import logger
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from .providers import (
    LLMProvider, ProviderConfig,
    HuggingFaceProvider, OllamaProvider, OpenRouterProvider,
    KiloCodeProvider, GeminiProvider, CerebrasProvider
)
from app.models.llm import MasterLLMModel, UserModelMapping


class DatabaseLLMProviderFactory:
    """Factory for creating LLM providers from database configuration."""
    
    def __init__(self):
        """Initialize the provider factory."""
        self._provider_map = {
            "huggingface": HuggingFaceProvider,
            "ollama": OllamaProvider,
            "openrouter": OpenRouterProvider,
            "kilocode": KiloCodeProvider,
            "gemini": GeminiProvider,
            "cerebras": CerebrasProvider,
        }
        logger.info("🤖 Database LLM Provider Factory initialized")
    
    async def get_provider_for_user(
        self,
        db: AsyncSession,
        user_id: int,
        provider_name: Optional[str] = None
    ) -> Optional[LLMProvider]:
        """
        Get LLM provider instance for a user.
        
        Args:
            db: Database session
            user_id: User ID
            provider_name: Specific provider to get, or None for active model
            
        Returns:
            Provider instance or None if not configured
        """
        from app.services.llm.llm_service import llm_service
        
        if provider_name:
            # Get specific provider configuration
            result = await llm_service.get_model_config(db, user_id, provider_name)
        else:
            # Get active model
            result = await llm_service.get_active_model(db, user_id)
        
        if not result:
            logger.warning(f"No LLM configuration found for user {user_id}, provider {provider_name}")
            return None
        
        master_model, mapping = result
        
        # Create provider config
        config = ProviderConfig(
            api_key=mapping.api_key,
            model=master_model.default_model_name,
            base_url=None,  # Can be added to model if needed
            temperature=0.4,
            max_tokens=4096
        )
        
        # Get provider class
        provider_class = self._provider_map.get(master_model.provider)
        if not provider_class:
            logger.error(f"Unknown provider: {master_model.provider}")
            return None
        
        # Create and return provider instance
        try:
            provider = provider_class(config)
            logger.info(f"✅ Created {master_model.provider} provider for user {user_id}")
            return provider
        except Exception as e:
            logger.error(f"Failed to create provider {master_model.provider}: {e}")
            return None
    
    async def get_active_provider(
        self,
        db: AsyncSession,
        user_id: int
    ) -> Optional[LLMProvider]:
        """
        Get user's active LLM provider.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            Active provider instance or None
        """
        return await self.get_provider_for_user(db, user_id, None)


# Global factory instance
_db_provider_factory: Optional[DatabaseLLMProviderFactory] = None


def get_db_provider_factory() -> DatabaseLLMProviderFactory:
    """Get or create global database provider factory instance."""
    global _db_provider_factory
    if _db_provider_factory is None:
        _db_provider_factory = DatabaseLLMProviderFactory()
    return _db_provider_factory
