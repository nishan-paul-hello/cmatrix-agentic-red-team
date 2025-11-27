from typing import Optional, Dict, Any, List
from app.services.llm.providers import LLMProvider
from app.services.rag.cve_reranker import get_cve_reranker, RankingStrategy, RerankingResult
from app.services.rag.self_correction import get_self_correction_service, CorrectionAction
from app.services.nvd import fetch_cves_from_nvd
import asyncio
from loguru import logger

class SmartCVESearchService:
    def __init__(self, llm_provider: LLMProvider):
        self.llm_provider = llm_provider
        self.reranker = get_cve_reranker()
        self.corrector = get_self_correction_service(llm_provider)

    async def search(
        self,
        query: str,
        limit: int = 10,
        strategy: str = "balanced"
    ) -> Dict[str, Any]:
        """
        Execute smart CVE search with self-correction.
        
        Returns:
            Dict containing results, metadata, and correction history.
        """
        current_query = query
        query_history = []
        max_retries = 2
        
        for attempt in range(max_retries + 1):
            # 1. Fetch candidates
            fetch_limit = max(limit * 2, 20)
            candidates = await asyncio.to_thread(fetch_cves_from_nvd, current_query, fetch_limit)
            
            # 2. Rerank
            try:
                strat_enum = RankingStrategy(strategy.lower())
            except ValueError:
                strat_enum = RankingStrategy.BALANCED
                
            result = await self.reranker.rerank(
                query=current_query,
                candidates=candidates,
                strategy=strat_enum,
                top_k=limit
            )
            
            # 3. Evaluate
            evaluation = await self.corrector.evaluate_results(current_query, result)
            
            if evaluation.is_satisfactory or attempt == max_retries:
                return {
                    "query": current_query,
                    "original_query": query,
                    "results": result,
                    "history": query_history,
                    "feedback": evaluation.feedback,
                    "is_corrected": len(query_history) > 0
                }
            
            # 4. Correct
            query_history.append(current_query)
            current_query = await self.corrector.generate_correction(
                current_query, 
                evaluation, 
                history=query_history
            )
            logger.info(f"Self-correction: '{query_history[-1]}' -> '{current_query}'")
            
        return {
            "query": current_query,
            "original_query": query,
            "results": None,
            "history": query_history,
            "feedback": "Max retries exceeded",
            "is_corrected": True
        }

# Global instance factory
_smart_search_service: Optional[SmartCVESearchService] = None

def get_smart_cve_search_service(llm_provider: LLMProvider) -> SmartCVESearchService:
    global _smart_search_service
    # Note: In a real app, we might want to handle the llm_provider dependency better
    # ensuring we don't overwrite with a different provider if already initialized,
    # or just creating a new one if needed. For now, simple singleton.
    if _smart_search_service is None:
        _smart_search_service = SmartCVESearchService(llm_provider)
    return _smart_search_service
