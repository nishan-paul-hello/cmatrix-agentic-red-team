#!/usr/bin/env python3
"""
Basic test script for LLM provider multi-compatibility upgrade.
This script tests the core functionality without requiring API keys or dependencies.
"""

import sys
import os
import subprocess

def test_syntax_compilation():
    """Test that all Python files compile without syntax errors."""
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')

    # Files to test
    test_files = [
        'app/services/llm/providers/base.py',
        'app/services/llm/providers/huggingface.py',
        'app/services/llm/providers/ollama.py',
        'app/services/llm/providers/openrouter.py',
        'app/services/llm/providers/kilocode.py',
        'app/services/llm/providers/gemini.py',
        'app/services/llm/providers/cerebras.py',
        'app/services/llm/providers/__init__.py',
        'app/services/llm/factory.py',
        # 'app/services/llm.py',  # This file was removed as part of the new provider system
        'app/core/config.py',
        'app/api/v1/endpoints/chat.py',
    ]

    failed = []
    for file_path in test_files:
        full_path = os.path.join(backend_dir, file_path)
        if os.path.exists(full_path):
            result = subprocess.run(
                [sys.executable, '-m', 'py_compile', full_path],
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                print(f"✅ {file_path} compiles successfully")
            else:
                print(f"❌ {file_path} compilation failed: {result.stderr}")
                failed.append(file_path)
        else:
            print(f"⚠️  {file_path} not found")
            failed.append(file_path)

    if not failed:
        print("✅ All Python files compile successfully")
        return True
    else:
        print(f"❌ {len(failed)} files failed to compile")
        return False

def test_file_structure():
    """Test that all expected files exist."""
    expected_files = [
        'backend/app/services/llm/providers/base.py',
        'backend/app/services/llm/providers/huggingface.py',
        'backend/app/services/llm/providers/ollama.py',
        'backend/app/services/llm/providers/openrouter.py',
        'backend/app/services/llm/providers/kilocode.py',
        'backend/app/services/llm/providers/gemini.py',
        'backend/app/services/llm/providers/cerebras.py',
        'backend/app/services/llm/providers/__init__.py',
        'backend/app/services/llm/factory.py',
        # 'backend/app/services/llm.py',  # This file was removed as part of the new provider system
        'backend/app/core/config.py',
        'backend/.env.example',
        'backend/requirements.txt',
        'README.md',
    ]

    missing = []
    for file_path in expected_files:
        full_path = os.path.join(os.path.dirname(__file__), file_path)
        if not os.path.exists(full_path):
            missing.append(file_path)
            print(f"❌ {file_path} is missing (checked: {full_path})")
        else:
            print(f"✅ {file_path} exists")

    if not missing:
        print("✅ All expected files are present")
        return True
    else:
        print(f"❌ {len(missing)} files are missing")
        return False

def test_config_structure():
    """Test that configuration includes all expected providers."""
    config_file = 'backend/.env.example'

    required_vars = [
        'DEFAULT_LLM_PROVIDER',
        'HUGGINGFACE_API_KEY',
        'OLLAMA_BASE_URL',
        'OPENROUTER_API_KEY',
        'KILOCODE_TOKEN',
        'GEMINI_API_KEY_1',
        'CEREBRAS_API_KEY_1',
        'ENABLE_HUGGINGFACE',
        'ENABLE_OLLAMA',
        'ENABLE_OPENROUTER',
        'ENABLE_KILOCODE',
        'ENABLE_GEMINI',
        'ENABLE_CEREBRAS',
    ]

    try:
        with open(config_file, 'r') as f:
            content = f.read()

        missing = []
        for var in required_vars:
            if var not in content:
                missing.append(var)
                print(f"❌ {var} not found in config")
            else:
                print(f"✅ {var} found in config")

        if not missing:
            print("✅ All required configuration variables are present")
            return True
        else:
            print(f"❌ {len(missing)} configuration variables are missing")
            return False

    except Exception as e:
        print(f"❌ Error reading config file: {e}")
        return False

def main():
    """Run all tests."""
    print("🧪 Testing LLM Provider Multi-Compatibility Upgrade")
    print("=" * 50)

    tests = [
        test_syntax_compilation,
        test_file_structure,
        test_config_structure,
    ]

    passed = 0
    total = len(tests)

    for test in tests:
        if test():
            passed += 1
        print()

    print("=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 All tests passed! LLM upgrade is ready for deployment.")
        print("\n📋 Next Steps:")
        print("1. Install dependencies: pip install -r backend/requirements.txt")
        print("2. Configure your API keys in .env file")
        print("3. Test with actual API calls")
        print("4. Deploy and monitor performance")
        return 0
    else:
        print("⚠️  Some tests failed. Please review the implementation.")
        return 1

if __name__ == "__main__":
    sys.exit(main())