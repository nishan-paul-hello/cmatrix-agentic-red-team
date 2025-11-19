"""LLM service with multi-provider support (backward compatible with HuggingFace)."""

from typing import Optional, List
from loguru import logger

from .factory import get_llm_provider, get_provider_factory
from .providers import Message


# Backward compatibility: Keep the old HuggingFaceLLM class as a wrapper
class HuggingFaceLLM:
    """Backward compatibility wrapper for HuggingFace LLM."""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        """
        Initialize HuggingFace LLM client (backward compatibility).

        Args:
            api_key: HuggingFace API key (ignored - uses config)
            model: Model name (ignored - uses config)
        """
        logger.warning("⚠️ HuggingFaceLLM is deprecated. Use get_llm_provider() instead.")

        # Get provider from factory
        self.provider = get_llm_provider("huggingface")

    def invoke(self, prompt: str, max_retries: int = 3) -> str:
        """
        Invoke LLM with prompt (backward compatibility).

        Args:
            prompt: User prompt
            max_retries: Ignored (handled by provider)

        Returns:
            Response text
        """
        messages = [
            Message(role="system", content="You are DeepHat, created by Kindo.ai. You are a helpful assistant that is an expert in Cybersecurity and DevOps."),
            Message(role="user", content=prompt)
        ]
        return self.provider.invoke(messages)


# Global LLM instance for backward compatibility
_llm_instance: Optional[HuggingFaceLLM] = None


def get_llm() -> HuggingFaceLLM:
    """
    Get or create global LLM instance (backward compatibility).

    Returns:
        HuggingFaceLLM instance
    """
    global _llm_instance
    if _llm_instance is None:
        _llm_instance = HuggingFaceLLM()
    return _llm_instance


# New multi-provider functions
def get_available_providers() -> List[str]:
    """Get list of available LLM providers."""
    factory = get_provider_factory()
    return factory.get_available_providers()


def switch_provider(provider_name: str) -> bool:
    """
    Switch the default LLM provider.

    Args:
        provider_name: Name of the provider to switch to

    Returns:
        True if successful, False otherwise
    """
    factory = get_provider_factory()
    return factory.switch_provider(provider_name)


def get_provider_info(provider_name: Optional[str] = None) -> dict:
    """
    Get information about a provider.

    Args:
        provider_name: Provider name (optional, uses default if not specified)

    Returns:
        Provider information dictionary
    """
    factory = get_provider_factory()
    return factory.get_provider_info(provider_name)
