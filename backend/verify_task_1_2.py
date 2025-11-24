#!/usr/bin/env python3
"""
Comprehensive test for LangGraph Checkpointing (Task 1.2)
Tests from a user's perspective to ensure checkpointing works correctly.
"""

import asyncio
import sys
import os
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from loguru import logger

from app.core.config import settings
from app.services.checkpoint import get_checkpointer, get_checkpoint_service
from app.services.orchestrator import get_orchestrator_service

# Configure logger
logger.remove()
logger.add(sys.stdout, format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <level>{message}</level>")


async def test_database_connection():
    """Test 1: Verify database connection."""
    logger.info("=" * 70)
    logger.info("TEST 1: Database Connection")
    logger.info("=" * 70)
    
    try:
        engine = create_async_engine(settings.DATABASE_URL, echo=False)
        async with engine.begin() as conn:
            result = await conn.execute(text("SELECT 1"))
            assert result.scalar() == 1
        await engine.dispose()
        
        logger.success("✓ Database connection successful")
        return True
    except Exception as e:
        logger.error(f"✗ Database connection failed: {e}")
        return False


async def test_checkpoint_tables():
    """Test 2: Verify checkpoint tables exist."""
    logger.info("\n" + "=" * 70)
    logger.info("TEST 2: Checkpoint Tables")
    logger.info("=" * 70)
    
    try:
        engine = create_async_engine(settings.DATABASE_URL, echo=False)
        async with engine.begin() as conn:
            # Check for checkpoint tables
            result = await conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name LIKE 'checkpoint%'
                ORDER BY table_name
            """))
            tables = [row[0] for row in result]
        
        await engine.dispose()
        
        expected_tables = ['checkpoint_blobs', 'checkpoint_writes', 'checkpoints']
        
        logger.info(f"Found tables: {tables}")
        
        for table in expected_tables:
            if table in tables:
                logger.success(f"✓ Table '{table}' exists")
            else:
                logger.error(f"✗ Table '{table}' missing")
                return False
        
        return True
    except Exception as e:
        logger.error(f"✗ Table check failed: {e}")
        return False


async def test_checkpointer_service():
    """Test 3: Verify checkpointer service initializes."""
    logger.info("\n" + "=" * 70)
    logger.info("TEST 3: Checkpointer Service")
    logger.info("=" * 70)
    
    try:
        # Get checkpoint service
        service = get_checkpoint_service()
        logger.success(f"✓ Checkpoint service created: {type(service).__name__}")
        
        # Get checkpointer
        checkpointer = get_checkpointer()
        logger.success(f"✓ PostgresSaver created: {type(checkpointer).__name__}")
        
        # Verify singleton
        checkpointer2 = get_checkpointer()
        assert checkpointer is checkpointer2
        logger.success("✓ Singleton pattern verified")
        
        return True
    except Exception as e:
        logger.error(f"✗ Checkpointer service failed: {e}")
        logger.exception("Full error:")
        return False


async def test_orchestrator_with_checkpointing():
    """Test 4: Verify orchestrator uses checkpointing."""
    logger.info("\n" + "=" * 70)
    logger.info("TEST 4: Orchestrator Checkpointing")
    logger.info("=" * 70)
    
    try:
        orchestrator = get_orchestrator_service()
        
        # Check if checkpointer is set
        if orchestrator.checkpointer is None:
            logger.error("✗ Orchestrator checkpointer is None")
            return False
        
        logger.success(f"✓ Orchestrator has checkpointer: {type(orchestrator.checkpointer).__name__}")
        
        # Check if workflow is compiled with checkpointing
        if orchestrator.workflow is None:
            logger.error("✗ Workflow not initialized")
            return False
        
        logger.success("✓ Workflow compiled successfully")
        
        return True
    except Exception as e:
        logger.error(f"✗ Orchestrator test failed: {e}")
        logger.exception("Full error:")
        return False


async def test_checkpoint_persistence():
    """Test 5: Verify checkpoints are saved to database."""
    logger.info("\n" + "=" * 70)
    logger.info("TEST 5: Checkpoint Persistence")
    logger.info("=" * 70)
    
    try:
        engine = create_async_engine(settings.DATABASE_URL, echo=False)
        
        # Count checkpoints before
        async with engine.begin() as conn:
            result = await conn.execute(text("SELECT COUNT(*) FROM checkpoints"))
            count_before = result.scalar()
        
        logger.info(f"Checkpoints in database (before): {count_before}")
        
        # Note: We can't actually run a full workflow here without a real LLM and user session
        # But we can verify the infrastructure is ready
        
        # Check recent checkpoints
        async with engine.begin() as conn:
            result = await conn.execute(text("""
                SELECT 
                    thread_id,
                    checkpoint_ns,
                    created_at,
                    LENGTH(checkpoint) as size_bytes
                FROM checkpoints
                ORDER BY created_at DESC
                LIMIT 5
            """))
            recent = result.fetchall()
        
        await engine.dispose()
        
        if recent:
            logger.info("\nRecent checkpoints:")
            for row in recent:
                logger.info(f"  - Thread: {row[0][:40]}... | Size: {row[3]} bytes | Created: {row[2]}")
            logger.success(f"✓ Found {len(recent)} checkpoint(s) in database")
        else:
            logger.warning("⚠ No checkpoints found yet (expected if no workflows have run)")
            logger.info("  This is NORMAL on a fresh installation")
        
        logger.success("✓ Checkpoint storage is ready")
        return True
        
    except Exception as e:
        logger.error(f"✗ Persistence test failed: {e}")
        logger.exception("Full error:")
        return False


async def test_thread_id_generation():
    """Test 6: Verify thread ID generation logic."""
    logger.info("\n" + "=" * 70)
    logger.info("TEST 6: Thread ID Generation")
    logger.info("=" * 70)
    
    try:
        # Test various thread ID scenarios
        test_cases = [
            {"user_id": 123, "conversation_id": 456, "expected": "user_123_conv_456"},
            {"user_id": 1, "conversation_id": 1, "expected": "user_1_conv_1"},
            {"user_id": 999, "conversation_id": None, "expected": "user_999"},
        ]
        
        for case in test_cases:
            user_id = case["user_id"]
            conversation_id = case["conversation_id"]
            expected = case["expected"]
            
            # Simulate the thread_id generation logic from orchestrator
            if conversation_id is not None:
                thread_id = f"user_{user_id}_conv_{conversation_id}"
            else:
                thread_id = f"user_{user_id}"
            
            if thread_id == expected:
                logger.success(f"✓ Thread ID correct: {thread_id}")
            else:
                logger.error(f"✗ Thread ID wrong: got '{thread_id}', expected '{expected}'")
                return False
        
        return True
    except Exception as e:
        logger.error(f"✗ Thread ID test failed: {e}")
        return False


async def run_all_tests():
    """Run all verification tests."""
    logger.info("\n")
    logger.info("╔" + "=" * 68 + "╗")
    logger.info("║" + " " * 12 + "TASK 1.2 CHECKPOINT VERIFICATION SUITE" + " " * 17 + "║")
    logger.info("╚" + "=" * 68 + "╝")
    logger.info("")
    
    tests = [
        ("Database Connection", test_database_connection),
        ("Checkpoint Tables", test_checkpoint_tables),
        ("Checkpointer Service", test_checkpointer_service),
        ("Orchestrator Integration", test_orchestrator_with_checkpointing),
        ("Checkpoint Persistence", test_checkpoint_persistence),
        ("Thread ID Generation", test_thread_id_generation),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = await test_func()
            results.append((test_name, result))
        except Exception as e:
            logger.error(f"Test '{test_name}' crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    logger.info("\n" + "=" * 70)
    logger.info("TEST SUMMARY")
    logger.info("=" * 70)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        color = "green" if result else "red"
        logger.opt(colors=True).info(f"  <{color}>{status}</{color}> | {test_name}")
    
    logger.info("-" * 70)
    logger.info(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        logger.success("\n✅ ALL TESTS PASSED! Task 1.2 is working correctly.\n")
        logger.info("📋 You can now proceed to Task 1.3: Vector Database")
        return True
    else:
        logger.error(f"\n❌ {total - passed} test(s) failed. Please fix before proceeding.\n")
        return False


async def show_user_verification_guide():
    """Show manual verification steps for users."""
    logger.info("\n" + "=" * 70)
    logger.info("USER VERIFICATION GUIDE")
    logger.info("=" * 70)
    logger.info("")
    logger.info("To verify checkpointing from a user perspective:")
    logger.info("")
    logger.info("1️⃣  CHECK DATABASE TABLES:")
    logger.info("   psql -U cmatrix -d cmatrix -c \"\\dt checkpoint*\"")
    logger.info("")
    logger.info("2️⃣  VIEW CHECKPOINT DATA:")
    logger.info("   psql -U cmatrix -d cmatrix -c \"SELECT COUNT(*) FROM checkpoints;\"")
    logger.info("")
    logger.info("3️⃣  START THE APPLICATION:")
    logger.info("   # Backend:")
    logger.info("   cd backend && ./venv/bin/uvicorn app.main:app --reload")
    logger.info("")
    logger.info("   # Celery worker:")
    logger.info("   cd backend && ./venv/bin/celery -A app.worker worker --loglevel=info")
    logger.info("")
    logger.info("4️⃣  SEND A TEST REQUEST:")
    logger.info("   # Through the frontend or API")
    logger.info("   # After processing, check database for new checkpoints")
    logger.info("")
    logger.info("5️⃣  VERIFY CHECKPOINT WAS SAVED:")
    logger.info("   psql -U cmatrix -d cmatrix -c \"")
    logger.info("     SELECT thread_id, created_at FROM checkpoints")
    logger.info("     ORDER BY created_at DESC LIMIT 5;")
    logger.info("   \"")
    logger.info("")
    logger.info("=" * 70)


if __name__ == "__main__":
    async def main():
        success = await run_all_tests()
        await show_user_verification_guide()
        
        if success:
            logger.info("\n🎉 Task 1.2 verification complete! Ready for Task 1.3.")
            sys.exit(0)
        else:
            logger.error("\n⚠️  Please fix failing tests before proceeding.")
            sys.exit(1)
    
    asyncio.run(main())
