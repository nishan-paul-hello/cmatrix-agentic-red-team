import json
import os
from typing import List, Dict, Any, Optional
from loguru import logger
from pydantic import BaseModel

class LLMModelConfig(BaseModel):
    id: str
    name: str
    provider: str
    api_key: str
    is_active: bool = True
    base_url: Optional[str] = None

class LLMConfigManager:
    """Manages LLM configuration stored in a JSON file."""
    
    def __init__(self, config_path: str = "llm_config.json"):
        self.config_path = config_path
        self._ensure_config_exists()

    def _ensure_config_exists(self):
        """Create the config file if it doesn't exist."""
        if not os.path.exists(self.config_path):
            logger.info(f"Creating default LLM config at {self.config_path}")
            self.save_config([])

    def load_config(self) -> List[Dict[str, Any]]:
        """Load the configuration from the JSON file."""
        try:
            if not os.path.exists(self.config_path):
                return []
                
            with open(self.config_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading LLM config: {e}")
            return []

    def save_config(self, config: List[Dict[str, Any]]):
        """Save the configuration to the JSON file."""
        try:
            with open(self.config_path, 'w') as f:
                json.dump(config, f, indent=2)
            logger.info("LLM config saved successfully")
        except Exception as e:
            logger.error(f"Error saving LLM config: {e}")
            raise

    def get_models(self) -> List[Dict[str, Any]]:
        """Get all configured models."""
        return self.load_config()

    def add_or_update_model(self, model: Dict[str, Any]):
        """Add or update a model configuration."""
        config = self.load_config()
        
        # Check if model exists
        existing_index = next((index for (index, d) in enumerate(config) if d["id"] == model["id"]), None)
        
        if existing_index is not None:
            # Update existing
            config[existing_index] = model
            logger.info(f"Updated model: {model['id']}")
        else:
            # Add new
            config.append(model)
            logger.info(f"Added new model: {model['id']}")
            
        self.save_config(config)

    def delete_model(self, model_id: str):
        """Delete a model configuration."""
        config = self.load_config()
        config = [m for m in config if m["id"] != model_id]
        self.save_config(config)
        logger.info(f"Deleted model: {model_id}")

# Global instance
llm_config_manager = LLMConfigManager()
