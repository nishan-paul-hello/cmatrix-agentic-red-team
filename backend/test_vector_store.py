"""Test script for Vector Store Service (Task 1.3)."""

import sys
import os
import asyncio
from loguru import logger

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.vector_store import get_vector_store
from app.core.config import settings

# Configure logger
logger.remove()
logger.add(sys.stdout, format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <level>{message}</level>")

def test_vector_store():
    """Test vector store functionality."""
    logger.info("=" * 50)
    logger.info("TESTING VECTOR STORE (QDRANT)")
    logger.info("=" * 50)
    
    logger.info(f"Qdrant URL: {settings.QDRANT_URL}")
    logger.info(f"Collection: {settings.QDRANT_COLLECTION_NAME}")
    logger.info(f"Embedding Model: {settings.EMBEDDING_MODEL}")
    
    # 1. Initialize Service
    logger.info("\n[1] Initializing Vector Store Service...")
    try:
        store = get_vector_store()
        logger.success("Service initialized")
    except Exception as e:
        logger.error(f"Failed to initialize service: {e}")
        return

    # 2. Check Connection
    logger.info("\n[2] Checking Qdrant Connection...")
    if not store._client:
        logger.warning("⚠️ Qdrant client not connected (is Qdrant running?)")
        logger.info("Skipping integration tests...")
        return
        
    # 3. Ensure Collection
    logger.info("\n[3] Ensuring Collection Exists...")
    if store.ensure_collection():
        logger.success("Collection ready")
    else:
        logger.error("Failed to ensure collection")
        return

    # 4. Add Memory
    logger.info("\n[4] Adding Test Memory...")
    test_text = "The target 192.168.1.1 has port 80 open running Apache 2.4.49."
    metadata = {"type": "test", "target": "192.168.1.1"}
    
    if store.add_memory(test_text, metadata):
        logger.success(f"Added memory: '{test_text}'")
    else:
        logger.error("Failed to add memory")
        return

    # 5. Search Memory
    logger.info("\n[5] Searching Memory...")
    query = "What ports are open on 192.168.1.1?"
    results = store.search_memory(query)
    
    if results:
        logger.success(f"Found {len(results)} results for query: '{query}'")
        for i, res in enumerate(results):
            logger.info(f"  Result {i+1}: {res['content']} (Score: {res['score']:.4f})")
    else:
        logger.warning("No results found")

    logger.info("\n" + "=" * 50)
    logger.success("✅ VECTOR STORE TEST COMPLETE")
    logger.info("=" * 50)

if __name__ == "__main__":
    test_vector_store()
