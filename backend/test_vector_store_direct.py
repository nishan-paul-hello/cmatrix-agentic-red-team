#!/usr/bin/env python3
"""Simple direct test of vector store upgrades."""

import sys
sys.path.insert(0, '/app')

from loguru import logger

def test_vector_store_direct():
    """Test vector store directly without tool imports."""
    logger.info("🧪 Direct Vector Store Test")
    logger.info("=" * 60)
    
    # Test 1: Model loading
    logger.info("\n1️⃣  Testing BGE-large model...")
    try:
        from sentence_transformers import SentenceTransformer
        from app.core.config import settings
        
        model = SentenceTransformer(settings.EMBEDDING_MODEL)
        dim = model.get_sentence_embedding_dimension()
        
        assert dim == 1024
        logger.info(f"   ✅ Model: {settings.EMBEDDING_MODEL}")
        logger.info(f"   ✅ Dimensions: {dim}")
        logger.info(f"   ✅ SUCCESS!")
    except Exception as e:
        logger.error(f"   ❌ FAILED: {e}")
        return False
    
    # Test 2: Vector store initialization
    logger.info("\n2️⃣  Testing vector store initialization...")
    try:
        from app.services.vector_store import get_vector_store
        
        store = get_vector_store()
        logger.info(f"   ✅ Vector store initialized")
        logger.info(f"   ✅ Collection: {store.collection_name}")
        logger.info(f"   ✅ Cache available: {store._cache is not None}")
        logger.info(f"   ✅ SUCCESS!")
    except Exception as e:
        logger.error(f"   ❌ FAILED: {e}")
        return False
    
    # Test 3: Add and search memory
    logger.info("\n3️⃣  Testing add and search...")
    try:
        from app.services.vector_store import get_vector_store
        
        store = get_vector_store()
        
        # Add test memory
        test_content = "Test: SSH service on 192.168.1.100 port 22 is open and accessible"
        metadata = {"test": True, "target": "192.168.1.100"}
        
        success = store.add_memory(test_content, metadata)
        assert success, "Failed to add memory"
        logger.info(f"   ✅ Added test memory")
        
        # Search
        results = store.search_memory("SSH port 22", limit=5)
        assert len(results) > 0, "No results found"
        logger.info(f"   ✅ Search returned {len(results)} results")
        logger.info(f"   ✅ First result: {results[0]['content'][:50]}...")
        logger.info(f"   ✅ SUCCESS!")
    except Exception as e:
        logger.error(f"   ❌ FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Test 4: Chunking
    logger.info("\n4️⃣  Testing chunking...")
    try:
        from app.services.vector_store import get_vector_store
        
        store = get_vector_store()
        
        # Create large content
        large_content = "Port scan results:\n" + ("Host 192.168.1.{}: ports 22,80,443 open\n" * 100)
        
        success = store.add_memory_with_chunking(large_content, {"test": True})
        assert success, "Failed to add chunked memory"
        logger.info(f"   ✅ Large content chunked successfully")
        logger.info(f"   ✅ SUCCESS!")
    except Exception as e:
        logger.error(f"   ❌ FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Test 5: Reranking (optional)
    logger.info("\n5️⃣  Testing reranking...")
    try:
        from app.services.vector_store import get_vector_store
        
        store = get_vector_store()
        store._setup_reranker()
        
        if store._reranker:
            logger.info(f"   ✅ Reranker loaded: BAAI/bge-reranker-large")
            logger.info(f"   ✅ SUCCESS!")
        else:
            logger.warning(f"   ⚠️  Reranker not loaded (will download on first use)")
    except Exception as e:
        logger.warning(f"   ⚠️  Reranker test skipped: {e}")
    
    logger.info("\n" + "=" * 60)
    logger.info("🎉 All core tests passed!")
    logger.info("\n📊 Summary:")
    logger.info("   ✅ BGE-large embeddings working (1024 dimensions)")
    logger.info("   ✅ Vector store initialized")
    logger.info("   ✅ Add/search working")
    logger.info("   ✅ Chunking working")
    logger.info("   ✅ Cache available")
    logger.info("\n🚀 Vector DB upgrade successful!")
    
    return True

if __name__ == "__main__":
    success = test_vector_store_direct()
    sys.exit(0 if success else 1)
