import os
import re
import json
import requests
import difflib
from typing import TypedDict, Sequence, Literal
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langgraph.graph import StateGraph, END

# Define tools for the agent
def port_scan(target, ports="1-1024"):
    """Perform a port scan on a target using nmap."""
    try:
        import subprocess
        import re

        # Use subprocess to run nmap directly
        cmd = ['nmap', '-p', ports, '-T4', '--open', target]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)

        if result.returncode != 0:
            return f"Port scan failed: nmap returned error code {result.returncode}. Make sure nmap is installed."

        output = result.stdout

        # Parse the output to extract open ports
        lines = output.split('\n')
        open_ports = []

        for line in lines:
            # Look for lines like "22/tcp open  ssh"
            if '/tcp' in line and 'open' in line:
                parts = line.split()
                if len(parts) >= 3:
                    port = parts[0].split('/')[0]
                    service = parts[2] if len(parts) > 2 else 'unknown'
                    open_ports.append(f"Port {port}: open ({service})")

        if open_ports:
            return f"Port scan results for {target}:\n" + "\n".join(open_ports)
        else:
            return f"No open ports found on {target} in range {ports}"

    except subprocess.TimeoutExpired:
        return f"Port scan timed out for {target}"
    except FileNotFoundError:
        return "Port scan failed: nmap not found. Please install nmap."
    except Exception as e:
        return f"Port scan failed: {str(e)}"

def vulnerability_assessment(target):
    """Perform basic vulnerability assessment on a target system."""
    try:
        import subprocess

        # First, do a basic port scan to identify services
        port_cmd = ['nmap', '-p-', '--open', '-T4', target]
        port_result = subprocess.run(port_cmd, capture_output=True, text=True, timeout=120)

        results = [f"Basic Vulnerability Assessment for {target}:"]
        open_ports = []

        if port_result.returncode == 0:
            # Parse open ports
            for line in port_result.stdout.split('\n'):
                if '/tcp' in line and 'open' in line:
                    parts = line.split()
                    if len(parts) >= 3:
                        port = parts[0].split('/')[0]
                        service = parts[2] if len(parts) > 2 else 'unknown'
                        open_ports.append((port, service))

                        # Basic vulnerability checks based on service
                        port_num = int(port)
                        if port_num == 21 and 'ftp' in service.lower():
                            results.append("⚠️  WARNING: FTP service detected on port 21 - consider using SFTP (secure)")
                        elif port_num == 23 and 'telnet' in service.lower():
                            results.append("🚨 CRITICAL: Telnet service detected on port 23 - insecure, use SSH")
                        elif port_num == 80 and 'http' in service.lower():
                            results.append("ℹ️  INFO: HTTP detected on port 80 - check for HTTPS support")
                        elif port_num == 445 and 'smb' in service.lower():
                            results.append("⚠️  WARNING: SMB service detected - check for known vulnerabilities")
                        elif port_num == 3389 and 'rdp' in service.lower():
                            results.append("⚠️  WARNING: RDP service detected - ensure NLA is enabled")

        # Check for common misconfigurations
        if open_ports:
            results.append(f"\nOpen ports found: {len(open_ports)}")
            for port, service in open_ports:
                results.append(f"  - Port {port}: {service}")
        else:
            results.append("No open ports detected")

        # Additional checks
        results.append("\nGeneral Recommendations:")
        results.append("• Ensure all services are up-to-date")
        results.append("• Use strong authentication mechanisms")
        results.append("• Implement proper firewall rules")
        results.append("• Regularly scan for vulnerabilities")

        return "\n".join(results)

    except subprocess.TimeoutExpired:
        return f"Vulnerability assessment timed out for {target}"
    except FileNotFoundError:
        return "Vulnerability assessment failed: nmap not found. Please install nmap."
    except Exception as e:
        return f"Vulnerability assessment failed: {str(e)}"

def web_app_security_test(url):
    """Perform basic web application security testing."""
    try:
        response = requests.get(url, timeout=10, verify=False)

        results = []
        results.append(f"Web Application Security Test for {url}")
        results.append(f"Status Code: {response.status_code}")
        results.append(f"Server: {response.headers.get('Server', 'Unknown')}")
        results.append(f"Content-Type: {response.headers.get('Content-Type', 'Unknown')}")

        # Check for security headers
        security_headers = {
            'X-Frame-Options': 'Missing X-Frame-Options header (Clickjacking vulnerability)',
            'X-Content-Type-Options': 'Missing X-Content-Type-Options header (MIME sniffing vulnerability)',
            'X-XSS-Protection': 'Missing X-XSS-Protection header (XSS vulnerability)',
            'Strict-Transport-Security': 'Missing Strict-Transport-Security header (No HTTPS enforcement)',
            'Content-Security-Policy': 'Missing Content-Security-Policy header (XSS/injection vulnerabilities)'
        }

        results.append("\nSecurity Headers Check:")
        for header, warning in security_headers.items():
            if header not in response.headers:
                results.append(f"❌ {warning}")
            else:
                results.append(f"✅ {header}: {response.headers[header]}")

        # Check for common vulnerabilities
        results.append("\nCommon Vulnerability Checks:")

        # Check for exposed admin panels
        admin_paths = ['/admin', '/admin.php', '/administrator', '/wp-admin', '/login', '/signin']
        for path in admin_paths:
            try:
                admin_response = requests.get(url.rstrip('/') + path, timeout=5, verify=False)
                if admin_response.status_code == 200:
                    results.append(f"⚠️  Potential admin panel found at {path} (status: {admin_response.status_code})")
            except:
                pass

        # Check for directory listing
        try:
            dir_response = requests.get(url.rstrip('/') + '/', timeout=5, verify=False)
            if 'Index of' in dir_response.text or 'Directory listing' in dir_response.text:
                results.append("⚠️  Directory listing enabled (information disclosure)")
        except:
            pass

        # Check for outdated software versions
        server = response.headers.get('Server', '').lower()
        if 'apache' in server and '2.4' not in server:
            results.append("⚠️  Potentially outdated Apache version")
        elif 'nginx' in server and '1.2' not in server:
            results.append("⚠️  Potentially outdated Nginx version")

        return "\n".join(results)

    except Exception as e:
        return f"Web application security test failed: {str(e)}"

def check_https_hsts(url):
    """Check if HTTPS is enforced and HSTS is enabled."""
    try:
        results = []

        # Check HTTPS redirect
        if not url.startswith('http'):
            url = 'http://' + url

        # Try HTTP first
        try:
            http_response = requests.get(url.replace('https://', 'http://'), timeout=10, allow_redirects=False)
            if http_response.status_code in [301, 302, 303, 307, 308]:
                location = http_response.headers.get('Location', '')
                if location.startswith('https://'):
                    results.append("✅ HTTP redirects to HTTPS")
                else:
                    results.append("⚠️  HTTP redirects but not to HTTPS")
            else:
                results.append("❌ No HTTPS redirect from HTTP")
        except:
            results.append("⚠️  HTTP request failed or timed out")

        # Check HTTPS
        https_url = url.replace('http://', 'https://')
        try:
            https_response = requests.get(https_url, timeout=10, verify=False)
            if https_response.status_code == 200:
                results.append("✅ HTTPS is accessible")

                # Check HSTS
                hsts = https_response.headers.get('Strict-Transport-Security')
                if hsts:
                    results.append(f"✅ HSTS enabled: {hsts}")
                else:
                    results.append("❌ HSTS not enabled")
            else:
                results.append(f"⚠️  HTTPS returns status {https_response.status_code}")
        except:
            results.append("❌ HTTPS not accessible")

        return "\n".join(results)

    except Exception as e:
        return f"HTTPS/HSTS check failed: {str(e)}"

def analyze_login_form(url):
    """Analyze login form for security best practices."""
    try:
        from bs4 import BeautifulSoup
        response = requests.get(url, timeout=10, verify=False)
        soup = BeautifulSoup(response.text, 'html.parser')

        results = []
        results.append(f"Login Form Analysis for {url}")

        # Find login forms
        forms = soup.find_all('form')
        login_forms = []

        for form in forms:
            inputs = form.find_all('input')
            has_username = any(inp.get('name', '').lower() in ['username', 'user', 'email', 'login'] for inp in inputs)
            has_password = any(inp.get('type', '').lower() == 'password' for inp in inputs)

            if has_username and has_password:
                login_forms.append(form)

        if not login_forms:
            return f"No login forms found on {url}"

        results.append(f"Found {len(login_forms)} potential login form(s)")

        for i, form in enumerate(login_forms):
            results.append(f"\nForm {i+1} Analysis:")

            # Check method
            method = form.get('method', 'get').upper()
            if method == 'POST':
                results.append("✅ Form uses POST method")
            else:
                results.append("❌ Form uses GET method (credentials may be in URL)")

            # Check action
            action = form.get('action', '')
            if action.startswith('https://'):
                results.append("✅ Form action uses HTTPS")
            elif action.startswith('http://'):
                results.append("❌ Form action uses HTTP")
            else:
                results.append("⚠️  Form action is relative (depends on page protocol)")

            # Analyze inputs
            inputs = form.find_all('input')
            username_fields = [inp for inp in inputs if inp.get('name', '').lower() in ['username', 'user', 'email', 'login']]
            password_fields = [inp for inp in inputs if inp.get('type', '').lower() == 'password']

            results.append(f"Username fields: {len(username_fields)}")
            results.append(f"Password fields: {len(password_fields)}")

            # Check for autocomplete
            for inp in inputs:
                if inp.get('autocomplete') == 'off':
                    results.append("⚠️  Autocomplete disabled (may reduce UX)")

            # Check for CSRF tokens
            hidden_inputs = [inp for inp in inputs if inp.get('type') == 'hidden']
            potential_csrf = [inp for inp in hidden_inputs if len(inp.get('value', '')) > 10]
            if potential_csrf:
                results.append("✅ Potential CSRF protection detected")
            else:
                results.append("⚠️  No CSRF protection detected")

        return "\n".join(results)

    except Exception as e:
        return f"Login form analysis failed: {str(e)}"

def check_session_security(url):
    """Check session management security."""
    try:
        results = []
        results.append(f"Session Security Check for {url}")

        # Make initial request to get cookies
        response1 = requests.get(url, timeout=10, verify=False)
        cookies1 = response1.cookies

        # Make second request
        response2 = requests.get(url, timeout=10, verify=False, cookies=cookies1)
        cookies2 = response2.cookies

        results.append(f"Initial request cookies: {len(cookies1)}")
        results.append(f"Second request cookies: {len(cookies2)}")

        # Check cookie security flags
        all_cookies = list(cookies1) + list(cookies2)
        session_cookies = [c for c in all_cookies if 'session' in c.name.lower() or 'auth' in c.name.lower() or 'token' in c.name.lower()]

        if session_cookies:
            results.append(f"\nSession-related cookies found: {len(session_cookies)}")
            for cookie in session_cookies:
                flags = []
                if cookie.secure:
                    flags.append("Secure")
                if cookie.has_nonstandard_attr('HttpOnly'):
                    flags.append("HttpOnly")
                if cookie.has_nonstandard_attr('SameSite'):
                    flags.append(f"SameSite={cookie.get_nonstandard_attr('SameSite')}")

                status = "✅" if 'Secure' in flags and 'HttpOnly' in flags else "⚠️"
                results.append(f"{status} {cookie.name}: {', '.join(flags) if flags else 'No security flags'}")
        else:
            results.append("No obvious session cookies detected")

        # Check for session fixation (basic)
        if len(cookies1) > 0 and len(cookies2) > 0:
            cookie_names1 = set(c.name for c in cookies1)
            cookie_names2 = set(c.name for c in cookies2)
            if cookie_names1 == cookie_names2:
                results.append("⚠️  Same cookies returned in both requests")
            else:
                results.append("ℹ️  Cookie set may vary between requests")

        return "\n".join(results)

    except Exception as e:
        return f"Session security check failed: {str(e)}"

def test_rate_limiting(url, endpoint="/login"):
    """Test for rate limiting on authentication endpoints."""
    try:
        results = []
        results.append(f"Rate Limiting Test for {url}{endpoint}")

        # Send multiple rapid requests
        import time
        responses = []

        for i in range(10):
            try:
                start_time = time.time()
                response = requests.post(url.rstrip('/') + endpoint,
                                       data={'username': f'test{i}', 'password': 'wrong'},
                                       timeout=5, verify=False)
                end_time = time.time()

                responses.append({
                    'attempt': i+1,
                    'status': response.status_code,
                    'time': end_time - start_time
                })

                # Small delay to avoid overwhelming
                time.sleep(0.1)

            except Exception as e:
                responses.append({
                    'attempt': i+1,
                    'error': str(e),
                    'time': 0
                })

        # Analyze responses
        status_codes = [r.get('status', 0) for r in responses if 'status' in r]
        times = [r['time'] for r in responses]

        results.append(f"Total requests: {len(responses)}")
        results.append(f"Status codes: {status_codes}")

        # Check for rate limiting indicators
        if 429 in status_codes:
            results.append("✅ Rate limiting detected (HTTP 429)")
        elif len(set(status_codes)) > 1:
            results.append("⚠️  Mixed status codes - possible rate limiting")
        else:
            results.append("❌ No rate limiting detected")

        # Check for timing patterns
        avg_time = sum(times) / len(times) if times else 0
        max_time = max(times) if times else 0
        results.append(".2f")
        results.append(".2f")

        if max_time > avg_time * 2:
            results.append("⚠️  Significant timing variations detected")

        return "\n".join(results)

    except Exception as e:
        return f"Rate limiting test failed: {str(e)}"

def check_password_policy(url):
    """Check password policy requirements."""
    try:
        from bs4 import BeautifulSoup
        results = []
        results.append(f"Password Policy Check for {url}")

        # This is a basic check - in practice, you'd need to test the actual registration/reset endpoints
        response = requests.get(url, timeout=10, verify=False)

        # Look for client-side password requirements in JavaScript or HTML
        soup = BeautifulSoup(response.text, 'html.parser')

        # Check for password strength indicators
        password_scripts = soup.find_all(['script', 'input'], {'type': 'password'})

        if password_scripts:
            results.append("✅ Password input fields found")
        else:
            results.append("❌ No password input fields found")

        # Look for password policy text
        policy_indicators = ['password', 'must contain', 'at least', 'characters', 'uppercase', 'lowercase', 'number', 'special']
        text_content = soup.get_text().lower()

        policy_mentions = [word for word in policy_indicators if word in text_content]
        if policy_mentions:
            results.append(f"ℹ️  Password policy indicators found: {', '.join(policy_mentions)}")
        else:
            results.append("⚠️  No visible password policy requirements")

        # Check for common security features
        security_features = {
            'Password strength meter': 'password-strength' in text_content or 'strength' in text_content,
            'Password visibility toggle': 'show password' in text_content or 'toggle' in text_content,
            'Password generator': 'generate' in text_content and 'password' in text_content
        }

        results.append("\nSecurity Features:")
        for feature, detected in security_features.items():
            status = "✅" if detected else "❌"
            results.append(f"{status} {feature}")

        return "\n".join(results)

    except Exception as e:
        return f"Password policy check failed: {str(e)}"

TOOLS = {
    "security_scan": {
        "description": "Perform a security scan on a target system or application",
        "parameters": ["target"],
        "function": lambda target: f"Security scan completed for {target}. Found 3 medium-risk vulnerabilities: outdated dependencies, missing CORS headers, weak password policy."
    },
    "check_system_status": {
        "description": "Check the status of a system service or application",
        "parameters": ["service_name"],
        "function": lambda service_name: f"Service '{service_name}' is running. CPU: 45%, Memory: 2.3GB, Uptime: 7 days."
    },
    "analyze_logs": {
        "description": "Analyze logs from a specified source for errors or anomalies",
        "parameters": ["log_source"],
        "function": lambda log_source: f"Analyzed logs from {log_source}. Found 12 errors in the last hour, mostly connection timeouts to external API."
    },
    "deploy_config": {
        "description": "Deploy a configuration to a specified environment",
        "parameters": ["environment", "config_name"],
        "function": lambda environment, config_name: f"Configuration '{config_name}' successfully deployed to {environment} environment. Rollback available if needed."
    },
    "port_scan": {
        "description": "Perform a port scan on a target IP or hostname to discover open ports and services",
        "parameters": ["target", "ports"],
        "function": lambda target, ports="1-1024": port_scan(target, ports)
    },
    "vulnerability_assessment": {
        "description": "Perform vulnerability assessment on a target system using nmap scripts",
        "parameters": ["target"],
        "function": vulnerability_assessment
    },
    "web_app_security_test": {
        "description": "Perform basic web application security testing including header checks and common vulnerabilities",
        "parameters": ["url"],
        "function": web_app_security_test
    },
    "check_https_hsts": {
        "description": "Check if HTTPS is enforced and HSTS (HTTP Strict Transport Security) is enabled",
        "parameters": ["url"],
        "function": check_https_hsts
    },
    "analyze_login_form": {
        "description": "Analyze login forms for security best practices including method, HTTPS usage, and CSRF protection",
        "parameters": ["url"],
        "function": analyze_login_form
    },
    "check_session_security": {
        "description": "Check session management security including cookie flags and session handling",
        "parameters": ["url"],
        "function": check_session_security
    },
    "test_rate_limiting": {
        "description": "Test for rate limiting on authentication endpoints to prevent brute force attacks",
        "parameters": ["url", "endpoint"],
        "function": lambda url, endpoint="/login": test_rate_limiting(url, endpoint)
    },
    "check_password_policy": {
        "description": "Check password policy requirements and security features",
        "parameters": ["url"],
        "function": check_password_policy
    }
}

def create_tool_prompt():
    """Create a prompt describing available tools."""
    tool_descriptions = []
    for name, info in TOOLS.items():
        params = ", ".join(info["parameters"])
        tool_descriptions.append(f"- {name}({params}): {info['description']}")

    return f"""You have access to the following tools:

{chr(10).join(tool_descriptions)}

To use a tool, respond with: TOOL_CALL: tool_name(param1, param2, ...)
You can call multiple tools by using multiple TOOL_CALL lines.
After tool results, provide your final answer to the user."""

def parse_tool_calls(text: str) -> list:
    """Parse tool calls from LLM response."""
    tool_calls = []
    pattern = r'TOOL_CALL:\s*(\w+)\((.*?)\)'
    matches = re.findall(pattern, text, re.IGNORECASE)

    for tool_name, params_str in matches:
        if tool_name in TOOLS:
            # Parse parameters
            params = [p.strip().strip('"\'') for p in params_str.split(',') if p.strip()]
            tool_calls.append({"name": tool_name, "params": params})

    return tool_calls

def execute_tools(tool_calls: list) -> str:
    """Execute tool calls and return results."""
    results = []
    for call in tool_calls:
        tool_name = call["name"]
        params = call["params"]

        if tool_name in TOOLS:
            try:
                result = TOOLS[tool_name]["function"](*params)
                results.append(f"[{tool_name}] {result}")
            except Exception as e:
                results.append(f"[{tool_name}] Error: {str(e)}")

    return "\n".join(results) if results else "No tools executed."