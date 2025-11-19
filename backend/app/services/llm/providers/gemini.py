"""Google Gemini LLM provider."""

import requests
import google.generativeai as genai
from typing import List, Any, Dict
from loguru import logger

from .base import LLMProvider, ProviderConfig, Message, StreamingProviderMixin


class GeminiProvider(LLMProvider, StreamingProviderMixin):
    """Google Gemini provider for Gemini models."""

    def __init__(self, config: ProviderConfig):
        """
        Initialize Gemini provider.

        Args:
            config: Provider configuration with API key and model
        """
        super().__init__(config)

        # Validate configuration
        if not self.config.api_key:
            raise ValueError("API key must be specified for Gemini provider")

        if not self.config.model:
            raise ValueError("Model must be specified for Gemini provider")

        # Initialize Gemini client
        genai.configure(api_key=self.config.api_key)
        self.client = genai.GenerativeModel(self.config.model)

        logger.info(f"🤖 Gemini provider initialized with model: {self.config.model}")

    def invoke(self, messages: List[Message], **kwargs) -> str:
        """
        Invoke Gemini model.

        Args:
            messages: List of chat messages
            **kwargs: Additional parameters

        Returns:
            Response text
        """
        try:
            # Convert messages to Gemini format
            gemini_messages = self._prepare_messages(messages)

            # Configure generation parameters
            generation_config = genai.types.GenerationConfig(
                temperature=kwargs.get('temperature', self.config.temperature),
                max_output_tokens=kwargs.get('max_tokens', self.config.max_tokens or 512),
            )

            # Generate response
            response = self.client.generate_content(
                gemini_messages,
                generation_config=generation_config
            )

            return response.text

        except Exception as e:
            logger.error(f"Gemini API call failed: {str(e)}")
            raise

    def invoke_stream(self, messages: List[Message], **kwargs):
        """
        Invoke Gemini model with streaming.

        Args:
            messages: List of chat messages
            **kwargs: Additional parameters

        Yields:
            Response chunks
        """
        try:
            # Convert messages to Gemini format
            gemini_messages = self._prepare_messages(messages)

            # Configure generation parameters
            generation_config = genai.types.GenerationConfig(
                temperature=kwargs.get('temperature', self.config.temperature),
                max_output_tokens=kwargs.get('max_tokens', self.config.max_tokens or 512),
            )

            # Generate streaming response
            response = self.client.generate_content(
                gemini_messages,
                generation_config=generation_config,
                stream=True
            )

            for chunk in response:
                if chunk.text:
                    yield chunk.text

        except Exception as e:
            logger.error(f"Error in Gemini streaming: {str(e)}")
            raise

    def get_available_models(self) -> List[str]:
        """
        Get list of available models from Gemini.

        Returns:
            List of model names
        """
        try:
            models = genai.list_models()
            model_names = []

            for model in models:
                # Filter for generative models
                if 'generateContent' in model.supported_generation_methods:
                    model_names.append(model.name)

            return model_names
        except Exception as e:
            logger.error(f"Failed to get Gemini models: {str(e)}")
            # Return known models as fallback
            return ["gemini-2.5-pro", "gemini-pro", "gemini-pro-vision"]

    def _prepare_messages(self, messages: List[Message]) -> str:
        """
        Prepare messages for Gemini format.

        Gemini uses a simple text/string format for prompts, not structured messages like OpenAI.

        Args:
            messages: List of Message objects

        Returns:
            Formatted prompt string
        """
        prompt_parts = []

        for msg in messages:
            if msg.role == "system":
                # Gemini doesn't have explicit system messages, so we'll include them as context
                prompt_parts.append(f"System: {msg.content}")
            elif msg.role == "user":
                prompt_parts.append(f"User: {msg.content}")
            elif msg.role == "assistant":
                prompt_parts.append(f"Assistant: {msg.content}")

        # Join all parts with newlines
        return "\n\n".join(prompt_parts)