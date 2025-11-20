"""LLM API endpoints for database-based model management."""

from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import json
from loguru import logger

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.llm import (
    LLMModelWithMappingSchema,
    UpdateApiKeyRequest,
    MasterLLMModel,
)
from app.services.llm.llm_service import llm_service

router = APIRouter()


@router.get("/models", response_model=List[LLMModelWithMappingSchema])
async def get_llm_models(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all available LLM models with user's API key status.
    
    Returns list of models showing:
    - Model details (name, provider, description)
    - Whether user has configured an API key
    - Masked API key for display
    - Whether model is active for the user
    """
    try:
        models = await llm_service.get_all_models_for_user(db, current_user.id)
        return models
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch models: {str(e)}")


@router.put("/models/{model_id}/api-key")
async def update_model_api_key(
    model_id: int,
    request: UpdateApiKeyRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update user's API key for a specific model.
    
    Users can only update their own API keys, not add/delete models.
    """
    try:
        await llm_service.update_user_api_key(
            db, current_user.id, model_id, request.api_key
        )
        return {"message": "API key updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update API key: {str(e)}")


@router.post("/models/{model_id}/activate")
async def activate_model(
    model_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Activate a model for the user's conversations.
    
    Only one model can be active at a time.
    Model must have an API key configured before activation.
    """
    try:
        await llm_service.activate_model(db, current_user.id, model_id)
        return {"message": "Model activated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to activate model: {str(e)}")


@router.get("/models/active")
async def get_active_model(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's currently active model."""
    try:
        result = await llm_service.get_active_model(db, current_user.id)
        if not result:
            return {"message": "No active model configured"}

        master_model, mapping = result
        return {
            "id": master_model.id,
            "name": master_model.name,
            "provider": master_model.provider,
            "default_model_name": master_model.default_model_name,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get active model: {str(e)}")


@router.post("/models/import-config")
async def import_llm_config(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Import LLM configuration from JSON file and populate database.

    Expected JSON format:
    {
      "default_provider": "provider_name",
      "providers": {
        "provider_name": {
          "enabled": true/false,
          "model": "model_name",
          "api_key": "key" | "api_keys": ["key1", "key2"] | "token": "token",
          "base_url": "url" (optional)
        }
      }
    }
    """
    try:
        logger.info(f"Starting LLM config import for user {current_user.id}")

        # Read and parse JSON
        content = await file.read()
        logger.info(f"File content length: {len(content)}")

        config_data = json.loads(content.decode('utf-8'))
        logger.info(f"Parsed JSON: {config_data}")

        # Validate basic structure
        if "providers" not in config_data:
            raise HTTPException(status_code=400, detail="Invalid JSON: missing 'providers' key")

        providers = config_data["providers"]
        default_provider = config_data.get("default_provider")
        logger.info(f"Processing {len(providers)} providers, default: {default_provider}")

        imported_configs = []

        # Process each provider
        for provider_name, provider_config in providers.items():
            logger.info(f"Processing provider: {provider_name}")
            enabled = provider_config.get("enabled", False)
            model_name = provider_config.get("model")

            if not model_name:
                logger.warning(f"Skipping {provider_name}: no model specified")
                continue  # Skip if no model specified

            # Find matching master model
            master_model = await db.execute(
                select(MasterLLMModel).where(
                    MasterLLMModel.provider == provider_name,
                    MasterLLMModel.status == "active"
                ).limit(1)
            )
            master_model = master_model.scalar_one_or_none()

            if not master_model:
                # Try to find by model name pattern
                logger.info(f"No exact provider match for {provider_name}, trying model pattern {model_name}")
                master_model = await db.execute(
                    select(MasterLLMModel).where(
                        MasterLLMModel.default_model_name.ilike(f"%{model_name}%"),
                        MasterLLMModel.status == "active"
                    ).limit(1)
                )
                master_model = master_model.scalar_one_or_none()

            if not master_model:
                logger.warning(f"No matching master model found for provider {provider_name}, model {model_name}")
                continue  # Skip if no matching master model

            logger.info(f"Found master model: {master_model.name} (ID: {master_model.id})")

            # Extract API key
            api_key = None
            if "api_keys" in provider_config and provider_config["api_keys"]:
                # Use first API key from array
                api_key = provider_config["api_keys"][0]
                logger.info(f"Using first API key from array for {provider_name}")
            elif "api_key" in provider_config and provider_config["api_key"]:
                api_key = provider_config["api_key"]
                logger.info(f"Using api_key for {provider_name}")
            elif "token" in provider_config and provider_config["token"]:
                api_key = provider_config["token"]
                logger.info(f"Using token for {provider_name}")

            if api_key:
                logger.info(f"Updating API key for user {current_user.id}, model {master_model.id}")
                # Update or create user mapping
                await llm_service.update_user_api_key(db, current_user.id, master_model.id, api_key)

                # Activate if enabled
                if enabled:
                    logger.info(f"Activating model {master_model.id} for user {current_user.id}")
                    await llm_service.activate_model(db, current_user.id, master_model.id)

                imported_configs.append({
                    "provider": provider_name,
                    "model": model_name,
                    "has_api_key": True,
                    "activated": enabled
                })
            else:
                logger.warning(f"No API key found for provider {provider_name}")

        # Set default provider as active if specified
        if default_provider:
            logger.info(f"Setting default provider: {default_provider}")
            default_master_model = await db.execute(
                select(MasterLLMModel).where(
                    MasterLLMModel.provider == default_provider,
                    MasterLLMModel.status == "active"
                ).limit(1)
            )
            default_master_model = default_master_model.scalar_one_or_none()

            if default_master_model:
                logger.info(f"Activating default model: {default_master_model.name}")
                await llm_service.activate_model(db, current_user.id, default_master_model.id)
            else:
                logger.warning(f"Default provider {default_provider} not found")

        logger.info(f"Import completed successfully. Imported {len(imported_configs)} configs")
        return {
            "message": "LLM configuration imported successfully",
            "imported_configs": imported_configs,
            "default_provider_set": default_provider is not None
        }

    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {e}")
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    except Exception as e:
        logger.error(f"Import failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to import configuration: {str(e)}")

