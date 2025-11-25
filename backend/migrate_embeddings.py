#!/usr/bin/env python3
"""
Migrate Qdrant collection to new embedding model (BGE-large-en-v1.5).
This script recreates the collection with 1024 dimensions.
"""

import sys
import time
from loguru import logger

# Add app to path
sys.path.insert(0, '/app')

def migrate_collection():
    """Recreate collection with new dimensions for BGE-large."""
    try:
        from qdrant_client import QdrantClient
        from qdrant_client.models import VectorParams, Distance
        from app.core.config import settings
        
        logger.info("🔧 Starting Qdrant collection migration...")
        logger.info(f"   New embedding model: {settings.EMBEDDING_MODEL}")
        logger.info(f"   New dimensions: 1024 (BGE-large)")
        
        # Wait for Qdrant to be ready
        time.sleep(2)
        
        client = QdrantClient(url=settings.QDRANT_URL)
        collection_name = settings.QDRANT_COLLECTION_NAME
        
        # Check if collection exists
        collections = client.get_collections()
        exists = any(c.name == collection_name for c in collections.collections)
        
        if exists:
            logger.warning(f"⚠️  Deleting old collection '{collection_name}'")
            client.delete_collection(collection_name)
            logger.info("   Old collection deleted")
        
        # Create new collection with 1024 dimensions
        logger.info(f"✨ Creating collection '{collection_name}' with 1024 dimensions")
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(
                size=1024,  # BGE-large dimension
                distance=Distance.COSINE
            )
        )
        
        logger.info("✅ Migration complete! Collection ready for BGE-large embeddings")
        logger.info("")
        logger.info("📊 Summary:")
        logger.info("   - Old model: all-MiniLM-L6-v2 (384 dimensions, ~58.8% accuracy)")
        logger.info("   - New model: BAAI/bge-large-en-v1.5 (1024 dimensions, ~64% accuracy)")
        logger.info("   - Expected improvement: +5-10% better retrieval accuracy")
        logger.info("")
        logger.info("🚀 Next steps:")
        logger.info("   1. Restart backend and worker services")
        logger.info("   2. Test with: python test_vector_db_upgrade.py")
        logger.info("")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Migration failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = migrate_collection()
    sys.exit(0 if success else 1)
