import os
import json
import re
import difflib

# Load demo prompts from JSON file
def load_demo_prompts():
    """Load demo prompts from demos.json file."""
    try:
        # Get the directory of the current script and construct path to demos.json
        script_dir = os.path.dirname(os.path.abspath(__file__))
        demos_path = os.path.join(script_dir, 'demos.json')
        with open(demos_path, 'r') as f:
            data = json.load(f)
            demo_prompts = data.get('demo_prompts', {})
            print(f"✅ Loaded {len(demo_prompts)} demo prompts from {demos_path}")
            return demo_prompts
    except FileNotFoundError:
        print("⚠️  demos.json file not found, using empty demo prompts")
        return {}
    except json.JSONDecodeError as e:
        print(f"❌ Error parsing demos.json: {e}")
        return {}

DEMO_PROMPTS = load_demo_prompts()

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

def find_best_matching_demo(message: str, threshold: float = 0.8) -> tuple:
    """Find the best matching demo prompt using fuzzy string matching.

    Args:
        message: The user input message
        threshold: Minimum similarity ratio (0.0 to 1.0) to consider a match

    Returns:
        Tuple of (best_match_key, similarity_ratio) or (None, 0.0) if no match
    """
    best_match = None
    best_ratio = 0.0

    # Normalize the input message for better matching
    normalized_message = message.lower().strip()

    for demo_prompt in DEMO_PROMPTS.keys():
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