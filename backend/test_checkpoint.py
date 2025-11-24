"""Test script for LangGraph checkpointing functionality."""

import asyncio
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.checkpoint import get_checkpointer, get_checkpoint_service
from app.core.config import settings
from loguru import logger


async def test_checkpointer():
    """Test checkpointer initialization and basic functionality."""
    
    logger.info("=" * 60)
    logger.info("Testing LangGraph Checkpointing")
    logger.info("=" * 60)
    
    try:
        # Test 1: Get checkpoint service
        logger.info("\n[Test 1] Getting checkpoint service...")
        service = get_checkpoint_service()
        logger.info(f"✓ Checkpoint service created: {service}")
        
        # Test 2: Get checkpointer
        logger.info("\n[Test 2] Getting PostgresSaver checkpointer...")
        checkpointer = get_checkpointer()
        logger.info(f"✓ Checkpointer created: {checkpointer}")
        
        # Test 3: Verify checkpointer is the same instance
        logger.info("\n[Test 3] Verifying singleton pattern...")
        checkpointer2 = get_checkpointer()
        assert checkpointer is checkpointer2, "Checkpointer should be a singleton"
        logger.info("✓ Singleton pattern working correctly")
        
        # Test 4: Check database URL configuration
        logger.info("\n[Test 4] Checking configuration...")
        logger.info(f"Database URL: {settings.DATABASE_URL[:30]}...")
        
        logger.info("\n" + "=" * 60)
        logger.info("✓ All checkpoint tests passed!")
        logger.info("=" * 60)
        
        logger.info("\n📋 Checkpoint Tables Info:")
        logger.info("The following tables should be created in your PostgreSQL database:")
        logger.info("  - checkpoints")
        logger.info("  - checkpoint_blobs") 
        logger.info("  - checkpoint_writes")
        logger.info("\nYou can verify by running:")
        logger.info("  psql -U cmatrix -d cmatrix -c \"\\dt\"")
        
        return True
        
    except Exception as e:
        logger.error(f"\n❌ Test failed: {e}")
        logger.exception("Full traceback:")
        return False


if __name__ == "__main__":
    success = asyncio.run(test_checkpointer())
    sys.exit(0 if success else 1)
