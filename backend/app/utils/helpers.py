"""Helper utilities for the application."""

import os
import json
import re
import difflib
from pathlib import Path
from typing import Dict, Tuple, Optional
from loguru import logger


def load_demo_prompts() -> Dict:
    """
    Load demo prompts from demos.json file.
    
    Returns:
        Dictionary of demo prompts
    """
    try:
        # Get the base directory (backend/)
        base_dir = Path(__file__).parent.parent.parent
        demos_path = base_dir / "data" / "demos.json"
        
        with open(demos_path, 'r') as f:
            data = json.load(f)
            demo_prompts = data.get('demo_prompts', {})
            logger.info(f"✅ Loaded {len(demo_prompts)} demo prompts from {demos_path}")
            return demo_prompts
    except FileNotFoundError:
        logger.warning("⚠️  demos.json file not found, using empty demo prompts")
        return {}
    except json.JSONDecodeError as e:
        logger.error(f"❌ Error parsing demos.json: {e}")
        return {}

def clean_response(content: str) -> str:
    """Clean up the response by removing tool call syntax and extra whitespace."""
    if not content:
        return ""

    # Remove TOOL_CALL lines
    lines = content.split('\n')
    cleaned_lines = []
    skip_next = False

    for line in lines:
        # Skip TOOL_CALL lines
        if re.match(r'^\s*TOOL_CALL:', line, re.IGNORECASE):
            continue
        # Skip TOOL_RESULTS section header
        if re.match(r'^\s*TOOL_RESULTS:', line, re.IGNORECASE):
            skip_next = True
            continue
        # Skip the instruction line after TOOL_RESULTS
        if skip_next and "provide your final answer" in line.lower():
            skip_next = False
            continue

        cleaned_lines.append(line)

    # Join and clean up extra whitespace
    result = '\n'.join(cleaned_lines)
    result = re.sub(r'\n{3,}', '\n\n', result)  # Max 2 consecutive newlines
    result = result.strip()

    return result

import string

def normalize_text(text: str) -> str:
    """
    Normalize text by removing whitespace, punctuation and converting to lowercase.
    
    Args:
        text: Input text
        
    Returns:
        Normalized text
    """
    # Convert to lowercase
    text = text.lower()
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    # Remove all whitespace
    text = "".join(text.split())
    return text

def find_demo_match(message: str, demo_prompts: Optional[Dict] = None) -> Optional[str]:
    """
    Find a matching demo prompt using strict normalization.
    
    Args:
        message: The user input message
        demo_prompts: Dictionary of demo prompts (optional, will load if not provided)
        
    Returns:
        The matching demo prompt key or None
    """
    if demo_prompts is None:
        demo_prompts = load_demo_prompts()
    
    normalized_message = normalize_text(message)
    
    for demo_prompt in demo_prompts.keys():
        if normalize_text(demo_prompt) == normalized_message:
            return demo_prompt
            
    return None