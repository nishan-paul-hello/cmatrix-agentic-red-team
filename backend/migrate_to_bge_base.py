#!/usr/bin/env python3
"""
Migrate to BGE-base (768 dimensions) for faster loading.
"""

import sys
import time
from loguru import logger

sys.path.insert(0, '/app')

def migrate_to_bge_base():
    """Recreate collection for BGE-base (768 dimensions)."""
    try:
        from qdrant_client import QdrantClient
        from qdrant_client.models import VectorParams, Distance
        from app.core.config import settings
        
        logger.info("🔧 Migrating to BGE-base...")
        logger.info(f"   Model: {settings.EMBEDDING_MODEL}")
        logger.info(f"   Dimensions: 768 (BGE-base)")
        logger.info(f"   Load time: ~30 seconds (vs 4 minutes for BGE-large)")
        
        time.sleep(2)
        
        client = QdrantClient(url=settings.QDRANT_URL)
        collection_name = settings.QDRANT_COLLECTION_NAME
        
        # Delete old collection
        collections = client.get_collections()
        exists = any(c.name == collection_name for c in collections.collections)
        
        if exists:
            logger.warning(f"⚠️  Deleting old collection")
            client.delete_collection(collection_name)
        
        # Create new collection with 768 dimensions
        logger.info(f"✨ Creating collection with 768 dimensions")
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(
                size=768,  # BGE-base dimension
                distance=Distance.COSINE
            )
        )
        
        logger.info("✅ Migration complete!")
        logger.info("")
        logger.info("📊 BGE-base vs BGE-large:")
        logger.info("   - Dimensions: 768 vs 1024")
        logger.info("   - Accuracy: ~63% vs ~64% (~1% difference)")
        logger.info("   - Load time: 30s vs 4min (8x faster!)")
        logger.info("   - File size: 400MB vs 1.3GB")
        logger.info("")
        logger.info("🚀 Much better user experience!")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Migration failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = migrate_to_bge_base()
    sys.exit(0 if success else 1)
