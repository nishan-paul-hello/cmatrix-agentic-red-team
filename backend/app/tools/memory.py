"""Memory tools for the agent."""

from typing import Optional, List, Dict, Any
from langchain.tools import tool
from app.services.vector_store import get_vector_store

@tool
def search_knowledge_base(query: str, user_id: Optional[int] = None) -> str:
    """
    Search the long-term knowledge base for past scans, findings, or information.
    Use this to check if we have already scanned a target or found specific vulnerabilities.
    
    Args:
        query: The search query (e.g., "open ports on 192.168.1.1", "previous SSL issues")
        user_id: Optional user ID to filter results (injected automatically if not provided)
        
    Returns:
        A summary of relevant past findings.
    """
    vector_store = get_vector_store()
    
    # Filter by user_id if provided (security best practice)
    filters = {}
    if user_id:
        filters["user_id"] = user_id
        
    results = vector_store.search_memory(query, limit=3, filter_metadata=filters)
    
    if not results:
        return "No relevant information found in knowledge base."
        
    summary = "Found the following relevant information:\n"
    for i, res in enumerate(results, 1):
        content = res["content"]
        date = res["metadata"].get("created_at", "unknown date")
        summary += f"{i}. [{date}] {content}\n"
        
    return summary

@tool
def save_to_knowledge_base(content: str, user_id: int, conversation_id: int) -> str:
    """
    Save important information to the long-term knowledge base.
    Use this to store scan results, discovered vulnerabilities, or key decisions.
    
    Args:
        content: The information to save
        user_id: User ID owner
        conversation_id: Source conversation
        
    Returns:
        Confirmation message.
    """
    vector_store = get_vector_store()
    
    metadata = {
        "user_id": user_id,
        "conversation_id": conversation_id,
        "type": "manual_entry"
    }
    
    success = vector_store.add_memory(content, metadata)
    
    if success:
        return "Successfully saved to knowledge base."
    return "Failed to save to knowledge base."
