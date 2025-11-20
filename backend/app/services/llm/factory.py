"""LLM Provider Factory and Management System."""

from typing import Dict, Any, Optional, List
from loguru import logger

from app.core.config import settings
from .providers import (
    LLMProvider, ProviderConfig, Message,
    HuggingFaceProvider, OllamaProvider, OpenRouterProvider,
    KiloCodeProvider, GeminiProvider, CerebrasProvider
)
from .config_manager import llm_config_manager


class LLMProviderFactory:
    """Factory for creating and managing LLM providers."""

    def __init__(self):
        """Initialize the provider factory."""
        self._providers = {}
        self._provider_configs = self._load_provider_configs()
        self._default_provider = settings.DEFAULT_LLM_PROVIDER
        logger.info(f"🤖 LLM Provider Factory initialized with default provider: {self._default_provider}")

    def _load_provider_configs(self) -> Dict[str, ProviderConfig]:
        """Load provider configurations from settings and JSON config."""
        configs = {}

        # 1. Load from Environment Variables (Legacy/System defaults)
        
        # HuggingFace
        if settings.ENABLE_HUGGINGFACE and settings.HUGGINGFACE_API_KEY:
            configs["huggingface"] = ProviderConfig(
                api_key=settings.HUGGINGFACE_API_KEY,
                model=settings.HUGGINGFACE_MODEL,
                temperature=0.7,
                max_tokens=512
            )

        # Ollama
        if settings.ENABLE_OLLAMA:
            configs["ollama"] = ProviderConfig(
                model=settings.OLLAMA_MODEL,
                base_url=settings.OLLAMA_BASE_URL,
                temperature=0.4,
                max_tokens=512
            )

        # OpenRouter
        if settings.ENABLE_OPENROUTER and settings.OPENROUTER_API_KEY:
            configs["openrouter"] = ProviderConfig(
                api_key=settings.OPENROUTER_API_KEY,
                model=settings.OPENROUTER_MODEL,
                temperature=0.4,
                max_tokens=512
            )

        # Kilo Code
        if settings.ENABLE_KILOCODE and settings.KILOCODE_TOKEN:
            configs["kilocode"] = ProviderConfig(
                api_key=settings.KILOCODE_TOKEN,
                model=settings.KILOCODE_MODEL,
                temperature=0.4,
                max_tokens=512
            )

        # Gemini
        gemini_key = settings.GEMINI_API_KEY_1 or settings.GEMINI_API_KEY_2 or settings.GEMINI_API_KEY_3
        if settings.ENABLE_GEMINI and gemini_key:
            configs["gemini"] = ProviderConfig(
                api_key=gemini_key,
                model=settings.GEMINI_MODEL,
                temperature=0.4,
                max_tokens=64000
            )

        # Cerebras
        cerebras_key = settings.CEREBRAS_API_KEY_1 or settings.CEREBRAS_API_KEY_2 or settings.CEREBRAS_API_KEY_3
        if settings.ENABLE_CEREBRAS and cerebras_key:
            configs["cerebras"] = ProviderConfig(
                api_key=cerebras_key,
                model=settings.CEREBRAS_MODEL,
                temperature=0.4,
                max_tokens=512
            )

        # 2. Load from JSON Config (User defined - Overrides Env if same ID)
        json_models = llm_config_manager.get_models()
        for model in json_models:
            if not model.get("is_active", True):
                continue
                
            provider_type = model.get("provider")
            # We use the model ID as the key in the configs dictionary
            # This allows us to select specific configurations
            config_key = model.get("id") 
            
            # Map JSON config to ProviderConfig
            # Note: We might need to adjust this if we want to support multiple models per provider type
            # For now, we'll treat the 'id' as the provider key if we want to select this specific config
            
            # However, the current factory logic uses 'provider_name' (like 'gemini', 'ollama') to look up config.
            # To support multiple configurations for the same provider type (e.g. 'gemini-pro' and 'gemini-flash'),
            # we need to change how we key these configs.
            
            # BUT, the user wants to select a "Model" from the dropdown.
            # So we should probably key these by their ID (e.g. 'gemini-2.5-pro').
            
            configs[config_key] = ProviderConfig(
                api_key=model.get("api_key"),
                model=model.get("name") if provider_type == "ollama" else model.get("id"), # Ollama needs model name, others might use ID as model name
                base_url=model.get("base_url"),
                temperature=0.4, # Default
                max_tokens=4096  # Default
            )
            
            # Also update the base provider config if it matches the default provider
            # This ensures that if we request 'gemini', we get the latest configured gemini model
            if provider_type in ["gemini", "ollama", "openrouter", "cerebras", "kilocode", "huggingface"]:
                 configs[provider_type] = configs[config_key]

        return configs

    def _create_provider(self, provider_name: str) -> LLMProvider:
        """Create a provider instance."""
        if provider_name not in self._provider_configs:
            raise ValueError(f"Provider '{provider_name}' not configured or disabled")

        config = self._provider_configs[provider_name]

        provider_map = {
            "huggingface": HuggingFaceProvider,
            "ollama": OllamaProvider,
            "openrouter": OpenRouterProvider,
            "kilocode": KiloCodeProvider,
            "gemini": GeminiProvider,
            "cerebras": CerebrasProvider,
        }

        if provider_name not in provider_map:
            raise ValueError(f"Unknown provider: {provider_name}")

        provider_class = provider_map[provider_name]
        return provider_class(config)

    def get_provider(self, provider_name: Optional[str] = None) -> LLMProvider:
        """
        Get a provider instance.

        Args:
            provider_name: Name of the provider to get. If None, uses default provider.

        Returns:
            Provider instance

        Raises:
            ValueError: If provider is not available
        """
        provider_name = provider_name or self._default_provider

        if provider_name not in self._providers:
            self._providers[provider_name] = self._create_provider(provider_name)

        return self._providers[provider_name]

    def get_available_providers(self) -> List[str]:
        """Get list of available (configured and enabled) providers."""
        return list(self._provider_configs.keys())

    def get_provider_info(self, provider_name: Optional[str] = None) -> Dict[str, Any]:
        """
        Get information about a provider.

        Args:
            provider_name: Name of the provider. If None, returns info for default provider.

        Returns:
            Provider information dictionary
        """
        provider_name = provider_name or self._default_provider

        if provider_name not in self._provider_configs:
            return {"error": f"Provider '{provider_name}' not configured"}

        config = self._provider_configs[provider_name]
        provider = self.get_provider(provider_name)

        return {
            "name": provider_name,
            "model": config.model,
            "supports_streaming": hasattr(provider, 'supports_streaming') and provider.supports_streaming(),
            "available_models": provider.get_available_models()[:5],  # Limit for brevity
            "healthy": provider.health_check()
        }

    def switch_provider(self, provider_name: str) -> bool:
        """
        Switch the default provider.

        Args:
            provider_name: Name of the provider to switch to

        Returns:
            True if switch was successful, False otherwise
        """
        if provider_name in self._provider_configs:
            self._default_provider = provider_name
            logger.info(f"🔄 Switched default provider to: {provider_name}")
            return True
        else:
            logger.warning(f"⚠️ Cannot switch to provider '{provider_name}': not configured")
            return False


# Global factory instance
_provider_factory: Optional[LLMProviderFactory] = None


def get_provider_factory() -> LLMProviderFactory:
    """Get or create global provider factory instance."""
    global _provider_factory
    if _provider_factory is None:
        _provider_factory = LLMProviderFactory()
    return _provider_factory


def get_llm_provider(provider_name: Optional[str] = None) -> LLMProvider:
    """
    Get an LLM provider instance.

    Args:
        provider_name: Name of the provider. If None, uses default provider.

    Returns:
        Provider instance
    """
    factory = get_provider_factory()
    return factory.get_provider(provider_name)