"""Base LLM provider interface and common functionality."""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
import time
from loguru import logger


@dataclass
class ProviderConfig:
    """Configuration for an LLM provider."""
    api_key: Optional[str] = None
    model: Optional[str] = None
    endpoint: Optional[str] = None
    base_url: Optional[str] = None
    temperature: float = 0.7
    max_tokens: Optional[int] = None
    timeout: int = 60
    retry_attempts: int = 3
    retry_delay: float = 1.0


@dataclass
class Message:
    """Represents a chat message."""
    role: str  # "system", "user", "assistant"
    content: str


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""

    def __init__(self, config: ProviderConfig):
        """
        Initialize the provider.

        Args:
            config: Provider configuration
        """
        self.config = config
        self.provider_name = self.__class__.__name__.replace('Provider', '').lower()
        logger.info(f"🤖 Initialized {self.provider_name} provider with model: {config.model}")

    @abstractmethod
    def invoke(self, messages: List[Message], **kwargs) -> str:
        """
        Invoke the LLM with messages.

        Args:
            messages: List of chat messages
            **kwargs: Additional provider-specific parameters

        Returns:
            Response text from the LLM

        Raises:
            Exception: If the API call fails
        """
        pass

    @abstractmethod
    def invoke_stream(self, messages: List[Message], **kwargs):
        """
        Invoke the LLM with streaming response.

        Args:
            messages: List of chat messages
            **kwargs: Additional provider-specific parameters

        Yields:
            Chunks of the response as they arrive

        Raises:
            Exception: If the API call fails
        """
        pass

    @abstractmethod
    def get_available_models(self) -> List[str]:
        """
        Get list of available models for this provider.

        Returns:
            List of model names/IDs
        """
        pass

    def _retry_request(self, request_func, *args, **kwargs):
        """
        Retry a request with exponential backoff.

        Args:
            request_func: Function to retry
            *args: Positional arguments for the function
            **kwargs: Keyword arguments for the function

        Returns:
            Result of the successful request

        Raises:
            Exception: If all retries fail
        """
        last_exception = None

        for attempt in range(self.config.retry_attempts):
            try:
                return request_func(*args, **kwargs)
            except Exception as e:
                last_exception = e
                if attempt < self.config.retry_attempts - 1:
                    delay = self.config.retry_delay * (2 ** attempt)  # Exponential backoff
                    logger.warning(
                        f"⚠️ {self.provider_name} request failed (attempt {attempt + 1}/{self.config.retry_attempts}): {str(e)}"
                    )
                    logger.info(f"⏳ Retrying in {delay:.1f}s...")
                    time.sleep(delay)
                else:
                    logger.error(
                        f"❌ {self.provider_name} request failed after {self.config.retry_attempts} attempts: {str(e)}"
                    )
                    raise last_exception

    def _prepare_messages(self, messages: List[Message]) -> Any:
        """
        Prepare messages for the specific provider format.

        Args:
            messages: List of Message objects

        Returns:
            Provider-specific message format
        """
        # Default implementation - override in subclasses if needed
        return [{"role": msg.role, "content": msg.content} for msg in messages]

    def _validate_config(self):
        """Validate provider configuration."""
        if not self.config.model:
            raise ValueError(f"Model must be specified for {self.provider_name} provider")

    def health_check(self) -> bool:
        """
        Perform a health check on the provider.

        Returns:
            True if provider is healthy, False otherwise
        """
        try:
            # Simple health check - try to get available models
            models = self.get_available_models()
            return len(models) > 0
        except Exception as e:
            logger.error(f"Health check failed for {self.provider_name}: {str(e)}")
            return False


class StreamingProviderMixin:
    """Mixin for providers that support streaming."""

    def supports_streaming(self) -> bool:
        """Check if this provider supports streaming."""
        return True


class ToolCallingProviderMixin:
    """Mixin for providers that support tool calling."""

    def supports_tool_calling(self) -> bool:
        """Check if this provider supports tool calling."""
        return True

    def invoke_with_tools(self, messages: List[Message], tools: List[Dict[str, Any]], **kwargs) -> Dict[str, Any]:
        """
        Invoke the LLM with tool calling support.

        Args:
            messages: List of chat messages
            tools: List of tool definitions
            **kwargs: Additional parameters

        Returns:
            Response with tool calls if any
        """
        raise NotImplementedError("Tool calling not implemented for this provider")