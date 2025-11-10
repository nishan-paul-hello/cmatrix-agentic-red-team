import os
import requests
import time

class HuggingFaceLLM:
    """Custom LLM wrapper for HuggingFace Router API with chat completions."""

    def __init__(self, api_key: str, model: str = None):
        self.api_key = api_key
        model_name = model or os.getenv("HUGGINGFACE_MODEL", "DeepHat/DeepHat-V1-7B")

        # Add provider suffix for DeepHat model if not present
        if "DeepHat" in model_name and ":featherless-ai" not in model_name:
            self.model = f"{model_name}:featherless-ai"
        else:
            self.model = model_name

        # Use chat completions endpoint for all models
        self.endpoint = "https://router.huggingface.co/v1/chat/completions"

        print(f"🤖 Using model: {self.model}")
        print(f"📡 Endpoint: {self.endpoint}")

    def invoke(self, prompt: str, max_retries: int = 3) -> str:
        """Call the HuggingFace API using chat completions format with retry logic."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        # Use chat completions format for all models
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are DeepHat, created by Kindo.ai. You are a helpful assistant that is an expert in Cybersecurity and DevOps."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 512,
            "temperature": 0.7,
            "stream": False
        }

        import time

        for attempt in range(max_retries):
            try:
                response = requests.post(self.endpoint, json=payload, headers=headers, timeout=60)
                response.raise_for_status()

                result = response.json()

                # OpenAI-compatible format
                return result["choices"][0]["message"]["content"]

            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 503:
                    # Model is loading, wait and retry
                    wait_time = (attempt + 1) * 5  # 5, 10, 15 seconds
                    print(f"⏳ Model loading... Retrying in {wait_time}s (attempt {attempt + 1}/{max_retries})")

                    if attempt < max_retries - 1:
                        time.sleep(wait_time)
                        continue
                    else:
                        print(f"❌ Model still unavailable after {max_retries} attempts")
                        raise Exception("Model is loading. Please try again in a moment.")
                else:
                    print(f"❌ HTTP Error {e.response.status_code}: {str(e)}")
                    if hasattr(e, 'response') and e.response is not None:
                        print(f"Response: {e.response.text}")
                    raise

            except requests.exceptions.RequestException as e:
                print(f"❌ Error calling HuggingFace API: {str(e)}")
                if hasattr(e, 'response') and e.response is not None:
                    print(f"Response: {e.response.text}")
                raise