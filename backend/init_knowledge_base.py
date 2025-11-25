#!/usr/bin/env python3
"""
Initialize the Qdrant knowledge base collection on startup.
This ensures the collection exists before any save operations.
"""

import sys
import time
from loguru import logger

# Add app to path
sys.path.insert(0, '/app')

def init_knowledge_base():
    """Initialize the knowledge base collection."""
    try:
        from app.services.vector_store import get_vector_store
        
        logger.info("🔧 Initializing knowledge base...")
        
        # Wait a moment for Qdrant to be fully ready
        time.sleep(2)
        
        store = get_vector_store()
        
        if store.ensure_collection():
            logger.info("✅ Knowledge base collection initialized successfully")
            return True
        else:
            logger.error("❌ Failed to initialize knowledge base collection")
            return False
            
    except Exception as e:
        logger.error(f"❌ Error initializing knowledge base: {e}")
        return False

if __name__ == "__main__":
    success = init_knowledge_base()
    sys.exit(0 if success else 1)
