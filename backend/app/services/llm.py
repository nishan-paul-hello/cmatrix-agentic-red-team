"""LLM service for HuggingFace API integration."""

import time
from typing import Optional
import requests
from loguru import logger

from app.core.config import settings


class HuggingFaceLLM:
    """Custom LLM wrapper for HuggingFace Router API with chat completions."""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        """
        Initialize HuggingFace LLM client.
        
        Args:
            api_key: HuggingFace API key (defaults to settings)
            model: Model name (defaults to settings)
        """
        self.api_key = api_key or settings.HUGGINGFACE_API_KEY
        model_name = model or settings.HUGGINGFACE_MODEL

        # Add provider suffix for DeepHat model if not present
        if "DeepHat" in model_name and ":featherless-ai" not in model_name:
            self.model = f"{model_name}:featherless-ai"
        else:
            self.model = model_name

        # Use chat completions endpoint for all models
        self.endpoint = "https://router.huggingface.co/v1/chat/completions"

        logger.info(f"🤖 Using model: {self.model}")
        logger.info(f"📡 Endpoint: {self.endpoint}")

    def invoke(self, prompt: str, max_retries: int = 3) -> str:
        """
        Call the HuggingFace API using chat completions format with retry logic.
        
        Args:
            prompt: User prompt to send to the model
            max_retries: Maximum number of retry attempts
            
        Returns:
            Model response text
            
        Raises:
            Exception: If API call fails after retries
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        # Use chat completions format for all models
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are DeepHat, created by Kindo.ai. You are a helpful assistant that is an expert in Cybersecurity and DevOps."
                },
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 512,
            "temperature": 0.7,
            "stream": False
        }

        for attempt in range(max_retries):
            try:
                response = requests.post(
                    self.endpoint,
                    json=payload,
                    headers=headers,
                    timeout=60
                )
                response.raise_for_status()

                result = response.json()

                # OpenAI-compatible format
                return result["choices"][0]["message"]["content"]

            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 503:
                    # Model is loading, wait and retry
                    wait_time = (attempt + 1) * 5  # 5, 10, 15 seconds
                    logger.warning(
                        f"⏳ Model loading... Retrying in {wait_time}s "
                        f"(attempt {attempt + 1}/{max_retries})"
                    )

                    if attempt < max_retries - 1:
                        time.sleep(wait_time)
                        continue
                    else:
                        logger.error(f"❌ Model still unavailable after {max_retries} attempts")
                        raise Exception("Model is loading. Please try again in a moment.")
                else:
                    logger.error(f"❌ HTTP Error {e.response.status_code}: {str(e)}")
                    if hasattr(e, 'response') and e.response is not None:
                        logger.error(f"Response: {e.response.text}")
                    raise

            except requests.exceptions.RequestException as e:
                logger.error(f"❌ Error calling HuggingFace API: {str(e)}")
                if hasattr(e, 'response') and e.response is not None:
                    logger.error(f"Response: {e.response.text}")
                raise


# Global LLM instance
_llm_instance: Optional[HuggingFaceLLM] = None


def get_llm() -> HuggingFaceLLM:
    """
    Get or create global LLM instance.
    
    Returns:
        HuggingFaceLLM instance
    """
    global _llm_instance
    if _llm_instance is None:
        _llm_instance = HuggingFaceLLM()
    return _llm_instance
