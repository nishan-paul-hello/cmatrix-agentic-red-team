from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.rag.cve_search import get_smart_cve_search_service
from app.services.llm.db_factory import get_db_provider_factory
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from pydantic import BaseModel

from loguru import logger

router = APIRouter()

class CVESearchResponse(BaseModel):
    query: str
    original_query: str
    results: Optional[Dict[str, Any]]
    history: List[str]
    feedback: Optional[str]
    is_corrected: bool

@router.get("/search", response_model=CVESearchResponse)
async def search_cve(
    query: str,
    limit: int = 10,
    strategy: str = "balanced",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Search for CVEs using the Smart CVE Search tool.
    Returns structured data including reranking details and correction history.
    """
    try:
        # Get LLM provider for the current user
        logger.debug("Getting DB provider factory")
        factory = get_db_provider_factory()
        logger.debug(f"Getting active provider for user {current_user.id}")
        llm_provider = await factory.get_active_provider(db, current_user.id)
        
        if not llm_provider:
            logger.warning("No LLM provider found")
            raise HTTPException(status_code=400, detail="No LLM provider configured")
        
        logger.debug(f"Got provider: {llm_provider}")
        service = get_smart_cve_search_service(llm_provider)
        logger.debug(f"Calling search service with query='{query}'")
        result = await service.search(
            query=query,
            limit=limit,
            strategy=strategy
        )
        logger.debug("Search completed successfully")
        
        # Convert RerankingResult to dict if present
        if result.get("results"):
            result["results"] = result["results"].to_dict()
            
        return CVESearchResponse(**result)
    except Exception as e:
        logger.exception(f"Error in CVE search: {e}")
        raise HTTPException(status_code=500, detail=str(e))
