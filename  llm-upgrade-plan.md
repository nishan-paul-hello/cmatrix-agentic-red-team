<write_file>
<path>llm-upgrade-plan.md</path>
<content># LLM Provider Multi-Compatibility Upgrade Plan

## Current Architecture Analysis

The current system uses:
- **Single Provider**: HuggingFace Router API only
- **Configuration**: Hardcoded HuggingFace settings in `config.py`
- **LLM Service**: `HuggingFaceLLM` class with fixed endpoint and format
- **Integration**: Direct usage in orchestrator service

## Proposed Architecture

### 1. Provider Abstraction Layer
- Create an abstract base class `LLMProvider` that defines the interface
- Implement specific provider classes (HuggingFace, OpenAI, Anthropic, etc.)
- Use factory pattern for provider instantiation

### 2. Configuration Management
- Extend settings to support multiple providers
- Add provider selection and model mapping
- Support provider-specific configurations (API keys, endpoints, etc.)

### 3. Dynamic Provider Switching
- Runtime provider selection based on configuration
- Fallback mechanisms for provider failures
- Provider health checks and load balancing

## Detailed Implementation Steps

### Phase 1: Core Architecture Refactoring

1. **Create Provider Base Classes**
   - `backend/app/services/llm/providers/base.py` - Abstract base provider
   - `backend/app/services/llm/providers/huggingface.py` - Current implementation
   - `backend/app/services/llm/providers/openai.py` - New OpenAI provider
   - `backend/app/services/llm/providers/anthropic.py` - New Anthropic provider

2. **Update Configuration System**
   - Modify `backend/app/core/config.py` to support multiple providers
   - Add provider registry and validation
   - Support environment variable patterns for different providers

3. **Create Provider Factory**
   - `backend/app/services/llm/factory.py` - Provider factory class
   - Dynamic provider instantiation based on configuration
   - Provider caching and singleton management

### Phase 2: Provider Implementations

4. **Migrate HuggingFace Provider**
   - Extract current `HuggingFaceLLM` logic into provider class
   - Maintain backward compatibility
   - Add provider-specific error handling

5. **Implement OpenAI Provider**
   - Support GPT models (gpt-4, gpt-3.5-turbo, etc.)
   - Handle OpenAI-specific API format and parameters
   - Implement streaming support

6. **Implement Anthropic Provider**
   - Support Claude models (claude-3, claude-2, etc.)
   - Handle Anthropic-specific formatting and parameters
   - Implement streaming and tool calling

7. **Add Additional Providers** (as needed)
   - Google Gemini
   - Grok/xAI
   - Local models (Ollama, LM Studio)

### Phase 3: Integration and Testing

8. **Update Orchestrator Service**
   - Modify `backend/app/services/orchestrator.py` to use new provider system
   - Maintain existing functionality while adding provider flexibility

9. **Update API Endpoints**
   - Add provider selection endpoints if needed
   - Update error handling for different providers
   - Maintain streaming compatibility

10. **Update Frontend Configuration**
    - Add provider selection UI components (optional)
    - Update API configuration for provider awareness

### Phase 4: Configuration and Deployment

11. **Environment Configuration**
    - Update `.env.example` with new provider variables
    - Add validation for provider configurations
    - Support provider fallbacks

12. **Documentation and Migration**
    - Update README with new provider setup instructions
    - Create migration guide for existing deployments
    - Add provider-specific troubleshooting guides

## Configuration Schema

```python
# New configuration structure
LLM_PROVIDERS = {
    "huggingface": {
        "api_key": "HUGGINGFACE_API_KEY",
        "model": "HUGGINGFACE_MODEL",
        "endpoint": "HUGGINGFACE_ENDPOINT",
        "enabled": True
    },
    "openai": {
        "api_key": "OPENAI_API_KEY",
        "model": "OPENAI_MODEL",
        "endpoint": "OPENAI_ENDPOINT",
        "enabled": False
    },
    "anthropic": {
        "api_key": "ANTHROPIC_API_KEY",
        "model": "ANTHROPIC_MODEL",
        "endpoint": "ANTHROPIC_ENDPOINT",
        "enabled": False
    }
}

DEFAULT_PROVIDER = "huggingface"
FALLBACK_PROVIDERS = ["openai", "anthropic"]
```

## Benefits of This Approach

1. **Backward Compatibility**: Existing HuggingFace setup continues to work
2. **Extensibility**: Easy to add new providers without major refactoring
3. **Reliability**: Provider fallbacks and health checks
4. **Maintainability**: Clean separation of concerns with provider abstraction
5. **Performance**: Provider caching and optimized API calls

## Migration Strategy

1. Deploy new architecture alongside existing system
2. Gradually migrate configurations
3. Test each provider independently
4. Enable new providers incrementally
5. Monitor performance and costs

This plan provides a robust, scalable solution for multi-provider LLM support while maintaining the existing functionality and user experience.</content>
</write_file>
