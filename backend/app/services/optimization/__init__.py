"""
Optimization services for CMatrix.

This package contains enterprise-grade optimization features:
- Semantic caching for LLM responses
- Backpressure handling for SSE streams
- Token usage optimization
- Performance monitoring
"""

from app.services.optimization.semantic_cache import (
    SemanticCache,
    get_semantic_cache,
    CacheConfig,
)
from app.services.optimization.backpressure import (
    BackpressureManager,
    EventBatcher,
    RateLimiter,
)
from app.services.optimization.token_optimizer import (
    TokenOptimizer,
    ConversationSummarizer,
    ToolFilterer,
)

__all__ = [
    "SemanticCache",
    "get_semantic_cache",
    "CacheConfig",
    "BackpressureManager",
    "EventBatcher",
    "RateLimiter",
    "TokenOptimizer",
    "ConversationSummarizer",
    "ToolFilterer",
]
