import os
from typing import TypedDict, Sequence, Literal
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langgraph.graph import StateGraph, END

from tool_execution import create_tool_prompt, parse_tool_calls, execute_tools
from llm import HuggingFaceLLM
from utils import DEMO_PROMPTS, clean_response, find_best_matching_demo

# Import authorization and audit logging
from authorization import auth_manager
from audit_logger import audit_logger

# Import tools from worker agents
from agents.network_agent import NETWORK_TOOLS
from agents.web_agent import WEB_TOOLS
from agents.auth_agent import AUTH_TOOLS
from agents.config_agent import CONFIG_TOOLS
from agents.vuln_intel_agent import VULN_INTEL_TOOLS
from agents.api_security_agent import API_SECURITY_TOOLS
from agents.command_agent import COMMAND_TOOLS

# Aggregate all tools
ALL_TOOLS = {
    tool.name: {
        "description": tool.description,
        "parameters": list(tool.args.keys()),
        "function": tool.func if hasattr(tool, "func") else tool
    }
    for tool in (NETWORK_TOOLS + WEB_TOOLS + AUTH_TOOLS + 
                 CONFIG_TOOLS + VULN_INTEL_TOOLS + API_SECURITY_TOOLS + COMMAND_TOOLS)
}

# Agent state
class AgentState(TypedDict):
    messages: Sequence[BaseMessage]
    tool_calls: list
    animation_steps: list  # Track animation steps for visualization
    diagram_nodes: list    # Track nodes for diagram
    diagram_edges: list    # Track edges for diagram

def create_orchestrator():
    """Create and configure the orchestrator workflow."""
    api_key = os.getenv("HUGGINGFACE_API_KEY")

    if not api_key:
        raise ValueError("HUGGINGFACE_API_KEY not found in environment variables")

    llm = HuggingFaceLLM(api_key=api_key)

    def should_continue(state: AgentState) -> Literal["tools", "end"]:
        """Decide whether to use tools or end."""
        last_message = state["messages"][-1]
        if isinstance(last_message, AIMessage):
            tool_calls = parse_tool_calls(last_message.content)
            if tool_calls:
                return "tools"
        return "end"

    def call_model(state: AgentState):
        """Call the LLM."""
        messages = state["messages"]

        # Build prompt with tool information
        if len(messages) == 1 or not any("TOOL_RESULT" in str(m.content) for m in messages):
            # Create a custom tool prompt that includes our new tools
            tool_definitions = []
            for name, tool_info in ALL_TOOLS.items():
                params = ", ".join(tool_info["parameters"])
                tool_definitions.append(f"- {name}({params}): {tool_info['description']}")
            
            tool_prompt = "You have access to the following tools:\n" + "\n".join(tool_definitions)
            tool_prompt += "\n\n⚠️ CRITICAL INSTRUCTIONS:"
            tool_prompt += "\n1. You MUST use tools to perform actual security scans - NEVER make up or hallucinate results"
            tool_prompt += "\n2. For port scanning, network analysis, or any technical task, you MUST call the appropriate tool"
            tool_prompt += "\n3. To use a tool, respond ONLY with: TOOL: tool_name(param1=value1, param2=value2)"
            tool_prompt += "\n4. Do NOT provide an answer without calling tools first"
            tool_prompt += "\n5. Example: For 'scan ports on localhost', respond with: TOOL: scan_network(target=localhost, ports=1-65535)"
            tool_prompt += "\n\nIf you provide results without calling tools, you are HALLUCINATING and providing FALSE information."
            
            system_msg = SystemMessage(content=f"You are CMatrix, an advanced AI security orchestrator. You coordinate specialized worker agents to perform security assessments.\n\n{tool_prompt}")
            prompt_messages = [system_msg] + list(messages)
        else:
            prompt_messages = messages

        # Convert to string prompt for HuggingFace
        prompt_text = "\n".join([f"{m.type}: {m.content}" for m in prompt_messages])
        response = llm.invoke(prompt_text)

        # Validate response is not empty
        if not response or not response.strip():
            response = "I apologize, but I couldn't generate a proper response. Please try again."
            print("⚠️ Warning: LLM returned empty response, using fallback message")

        # Preserve animation/diagram state
        return {
            "messages": [AIMessage(content=response)],
            "animation_steps": state.get("animation_steps", []),
            "diagram_nodes": state.get("diagram_nodes", []),
            "diagram_edges": state.get("diagram_edges", [])
        }

    def call_tools(state: AgentState):
        """Execute tools and add results to messages."""
        last_message = state["messages"][-1]
        tool_calls = parse_tool_calls(last_message.content)

        # Get existing animation steps and diagram data
        animation_steps = state.get("animation_steps", [])
        diagram_nodes = state.get("diagram_nodes", [])
        diagram_edges = state.get("diagram_edges", [])

        # Tool icon mapping
        tool_icons = {
            "scan_ports": "📡",
            "check_service_status": "🔍",
            "analyze_logs": "📋",
            "deploy_config": "🚀",
            "security_scan": "🛡️",
            "check_headers": "📋",
            "test_https": "🔒",
            "analyze_login_form": "📝",
            "check_session_security": "🍪",
            "test_rate_limiting": "🚦",
            "check_password_policy": "🔐",
            "execute_command": "⚙️",
            "check_vulnerability": "⚠️",
            "test_api_security": "🔧",
        }

        # Background colors for steps
        bg_colors = ["#e8f5e8", "#f3e5f5", "#e3f2fd", "#fff3e0", "#fce4ec"]

        if tool_calls:
            results = []
            step_number = len(animation_steps) + 1
            
            for idx, (tool_name, tool_args) in enumerate(tool_calls):
                # Generate animation step for this tool
                icon = tool_icons.get(tool_name, "🔧")
                bg_color = bg_colors[idx % len(bg_colors)]
                
                animation_step = {
                    "step": step_number + idx,
                    "title": f"Executing {tool_name.replace('_', ' ').title()}",
                    "description": f"Running {tool_name} with parameters: {', '.join(f'{k}={v}' for k, v in tool_args.items())}",
                    "duration": 1500,
                    "icon": icon,
                    "bgColor": bg_color
                }
                animation_steps.append(animation_step)
                
                # Add node to diagram
                node_id = f"tool_{step_number + idx}"
                diagram_nodes.append({
                    "id": node_id,
                    "label": tool_name.replace('_', ' ').title(),
                    "x": 350 + (idx * 150),
                    "y": 50 + (idx % 2) * 40,
                    "type": "tool"
                })
                
                # Add edge from previous node
                if diagram_nodes:
                    prev_node_id = diagram_nodes[-2]["id"] if len(diagram_nodes) > 1 else "ai"
                    diagram_edges.append({
                        "from": prev_node_id,
                        "to": node_id
                    })
                
                # Execute the tool
                if tool_name in ALL_TOOLS:
                    try:
                        func = ALL_TOOLS[tool_name]["function"]
                        if hasattr(func, "invoke"):
                            result = func.invoke(tool_args)
                        else:
                            result = func(**tool_args)
                        results.append(f"Tool '{tool_name}' output: {result}")
                    except Exception as e:
                        results.append(f"Error executing '{tool_name}': {str(e)}")
                else:
                    results.append(f"Tool '{tool_name}' not found.")
            
            results_str = "\n\n".join(results)
            return {
                "messages": [HumanMessage(content=f"TOOL_RESULTS:\n{results_str}\n\nNow provide your final answer based on these results.")],
                "animation_steps": animation_steps,
                "diagram_nodes": diagram_nodes,
                "diagram_edges": diagram_edges
            }

        return {
            "messages": [],
            "animation_steps": animation_steps,
            "diagram_nodes": diagram_nodes,
            "diagram_edges": diagram_edges
        }

    # Build graph
    workflow = StateGraph(AgentState)
    workflow.add_node("agent", call_model)
    workflow.add_node("tools", call_tools)

    workflow.set_entry_point("agent")
    workflow.add_conditional_edges("agent", should_continue, {"tools": "tools", "end": END})
    workflow.add_edge("tools", "agent")

    return workflow.compile()

# Create orchestrator instance
orchestrator_executor = create_orchestrator()

def run_orchestrator(message: str, history: list = None):
    """Run the orchestrator with a message and optional history."""
    # Check if the message matches any demo prompt using fuzzy matching
    best_match, similarity = find_best_matching_demo(message)
    if best_match:
        demo_data = DEMO_PROMPTS[best_match]
        print(f'✅ DEMO MATCH FOUND (similarity: {similarity:.2f}) - Using default answer, NOT calling LLM')
        return {
            "animation_steps": demo_data["animation_steps"],
            "diagram": demo_data.get("diagram"),
            "final_answer": demo_data["final_answer"]
        }

    # No demo match found - proceed with LLM processing
    print('🤖 No demo match found - calling LLM for response')
    messages = []

    # Add history
    if history:
        for msg in history:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                messages.append(AIMessage(content=msg["content"]))

    # Add current message
    messages.append(HumanMessage(content=message))

    try:
        # Run agent with animation/diagram tracking
        result = orchestrator_executor.invoke({
            "messages": messages, 
            "tool_calls": [],
            "animation_steps": [],
            "diagram_nodes": [],
            "diagram_edges": []
        })

        # Extract final response
        final_message = result["messages"][-1]
        content = final_message.content if hasattr(final_message, 'content') else str(final_message)

        # Clean up the response
        cleaned_content = clean_response(content)

        print('✅ Orchestrator response:', cleaned_content[:200] + '...' if len(cleaned_content) > 200 else cleaned_content)

        # Check if we have animation steps (tool execution occurred)
        animation_steps = result.get("animation_steps", [])
        diagram_nodes = result.get("diagram_nodes", [])
        diagram_edges = result.get("diagram_edges", [])

        if animation_steps:
            # Add initial nodes for user and AI
            initial_nodes = [
                {"id": "user", "label": "User Query", "x": 50, "y": 50, "type": "user"},
                {"id": "ai", "label": "AI Agent", "x": 200, "y": 50, "type": "ai"}
            ]
            
            # Add result node
            result_node = {
                "id": "result",
                "label": "Final Answer",
                "x": 350 + (len(diagram_nodes) * 150),
                "y": 50,
                "type": "result"
            }
            
            # Create edges
            initial_edges = [{"from": "user", "to": "ai"}]
            
            # Connect AI to first tool
            if diagram_nodes:
                initial_edges.append({"from": "ai", "to": diagram_nodes[0]["id"]})
                # Connect last tool to result
                diagram_edges.append({"from": diagram_nodes[-1]["id"], "to": "result"})
            
            # Combine all nodes and edges
            all_nodes = initial_nodes + diagram_nodes + [result_node]
            all_edges = initial_edges + diagram_edges
            
            print(f'📊 Generated {len(animation_steps)} animation steps and diagram with {len(all_nodes)} nodes')
            
            return {
                "animation_steps": animation_steps,
                "diagram": {"nodes": all_nodes, "edges": all_edges},
                "final_answer": cleaned_content
            }
        
        # No tools were executed, return regular response
        return cleaned_content

    except Exception as e:
        print(f"❌ Error in run_orchestrator: {str(e)}")
        raise
