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

def find_best_matching_demo(message: str, demo_prompts: Optional[Dict] = None, threshold: float = 0.8) -> Tuple[Optional[str], float]:
    """
    Find the best matching demo prompt using fuzzy string matching.

    Args:
        message: The user input message
        demo_prompts: Dictionary of demo prompts (optional, will load if not provided)
        threshold: Minimum similarity ratio (0.0 to 1.0) to consider a match

    Returns:
        Tuple of (best_match_key, similarity_ratio) or (None, 0.0) if no match
    """
    if demo_prompts is None:
        demo_prompts = load_demo_prompts()
    
    best_match = None
    best_ratio = 0.0

    # Normalize the input message for better matching
    normalized_message = message.lower().strip()

    for demo_prompt in demo_prompts.keys():
        # Calculate similarity ratio using normalized strings
        ratio = difflib.SequenceMatcher(None, normalized_message, demo_prompt.lower()).ratio()
        if ratio > best_ratio:
            best_ratio = ratio
            best_match = demo_prompt

    # Only return match if it exceeds threshold
    if best_ratio >= threshold:
        return best_match, best_ratio
    else:
        return None, 0.0