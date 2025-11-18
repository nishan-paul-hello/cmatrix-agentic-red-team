"""Network security scanning tools wrapped as LangChain tools."""
from langchain_core.tools import tool
from network_tools import port_scan, vulnerability_assessment

@tool
def scan_network(target: str, ports: str = "1-65535") -> str:
    """
    Scan a network target for open ports using nmap.
    
    Args:
        target: Target IP address or hostname (e.g., "localhost", "192.168.1.1")
        ports: Port range to scan (e.g., "1-65535", "80,443", "all" for all ports, "1-1024" for common ports)
    """
    return port_scan(target, ports)

@tool
def assess_vulnerabilities(target: str) -> str:
    """
    Perform a comprehensive vulnerability assessment on a target.
    
    Args:
        target: Target IP address or hostname
    """
    return vulnerability_assessment(target)

NETWORK_TOOLS = [scan_network, assess_vulnerabilities]
