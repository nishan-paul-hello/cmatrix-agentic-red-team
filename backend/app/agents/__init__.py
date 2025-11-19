"""Agents package."""

from app.agents.specialized.network_agent import NETWORK_TOOLS
from app.agents.specialized.web_agent import WEB_TOOLS
from app.agents.specialized.auth_agent import AUTH_TOOLS
from app.agents.specialized.config_agent import CONFIG_TOOLS
from app.agents.specialized.vuln_intel_agent import VULN_INTEL_TOOLS
from app.agents.specialized.api_security_agent import API_SECURITY_TOOLS
from app.agents.specialized.command_agent import COMMAND_TOOLS

__all__ = [
    "NETWORK_TOOLS",
    "WEB_TOOLS",
    "AUTH_TOOLS",
    "CONFIG_TOOLS",
    "VULN_INTEL_TOOLS",
    "API_SECURITY_TOOLS",
    "COMMAND_TOOLS",
]
