from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from app.services.llm.config_manager import llm_config_manager, LLMModelConfig
from app.services.llm.factory import get_provider_factory

router = APIRouter()

class ModelConfigResponse(BaseModel):
    id: str
    name: str
    provider: str
    is_active: bool
    # We don't return the API key for security, or we mask it

class CreateUpdateModelRequest(BaseModel):
    id: str
    name: str
    provider: str
    api_key: str
    is_active: bool = True
    base_url: str = None

@router.get("/config", response_model=List[Dict[str, Any]])
async def get_llm_config():
    """Get all configured LLM models."""
    models = llm_config_manager.get_models()
    # Mask API keys for security
    masked_models = []
    for model in models:
        masked_model = model.copy()
        if masked_model.get("api_key"):
            key = masked_model["api_key"]
            if len(key) > 8:
                masked_model["api_key"] = f"{key[:4]}...{key[-4:]}"
            else:
                masked_model["api_key"] = "***"
        masked_models.append(masked_model)
    return masked_models

@router.post("/config")
async def add_or_update_model(model: CreateUpdateModelRequest):
    """Add or update an LLM model configuration."""
    try:
        llm_config_manager.add_or_update_model(model.dict())
        # Refresh the factory to pick up changes
        get_provider_factory()._provider_configs = get_provider_factory()._load_provider_configs()
        return {"message": "Model configuration saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/config/{model_id}")
async def delete_model(model_id: str):
    """Delete an LLM model configuration."""
    try:
        llm_config_manager.delete_model(model_id)
        # Refresh the factory
        get_provider_factory()._provider_configs = get_provider_factory()._load_provider_configs()
        return {"message": "Model configuration deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/select/{model_id}")
async def select_model(model_id: str):
    """Select the active model for the session."""
    factory = get_provider_factory()
    if factory.switch_provider(model_id):
        return {"message": f"Switched to model {model_id}"}
    else:
        raise HTTPException(status_code=400, detail=f"Model {model_id} not found or not configured")
