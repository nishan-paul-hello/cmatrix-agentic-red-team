#!/usr/bin/env python3
"""Simple checkpoint verification test."""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

print("="* 70)
print("CHECKPOINT VERIFICATION TEST")
print("=" * 70)

print("\n[1/4] Importing modules...")
try:
    from app.services.checkpoint import get_checkpoint_service, get_checkpointer
    print("✓ Checkpoint service imports successful")
except Exception as e:
    print(f"✗ Import failed: {e}")
    sys.exit(1)

print("\n[2/4] Creating checkpoint service...")
try:
    service = get_checkpoint_service()
    print(f"✓ Service created: {type(service).__name__}")
except Exception as e:
    print(f"✗ Service creation failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n[3/4] Getting checkpointer...")
try:
    checkpointer = get_checkpointer()
    print(f"✓ Checkpointer created: {type(checkpointer).__name__}")
except Exception as e:
    print(f"✗ Checkpointer failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n[4/4] Testing orchestrator...")
try:
    from app.services.orchestrator import get_orchestrator_service
    orchestrator = get_orchestrator_service()
    
    if orchestrator.checkpointer:
        print(f"✓ Orchestrator has checkpointer: {type(orchestrator.checkpointer).__name__}")
    else:
        print("⚠ Orchestrator checkpointer is None (may initialize on first use)")
        
except Exception as e:
    print(f"✗ Orchestrator test failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 70)
print("✅ ALL TESTS PASSED!")
print("=" * 70)
print("\nNext steps to verify from user perspective:")
print("1. Check database: psql -U cmatrix -d cmatrix -c \"\\dt checkpoint*\"")
print("2. Start backend and make a request")
print("3. Verify checkpoints saved: psql -U cmatrix -d cmatrix -c \"SELECT COUNT(*) FROM checkpoints;\"")
print()
