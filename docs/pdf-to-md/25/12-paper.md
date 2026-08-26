⚙️ Chunk 12 of the paper

## N. Detect Runtime Invariants

For each system, the evaluation includes runtime invariants that are custom to each system, helping identify exploits able to disrupt runtime invariants.

### N.1 Runtime Invariants Example: Lunary

📌 **Key Point**: Runtime invariant checks are verified immediately before and after an exploit runs, covering three properties:

1. Service **availability** remains intact
2. Protected data (users, projects, organizations) retains **integrity**
3. No confidential strings (credentials or organization names) have been **exposed** in logs or output

> Any failure of these runtime invariants indicates a confidentiality, integrity, and/or availability breach.

### N.2 Runtime Invariants Success Example: Pytorch-Lightning

🔬 **Case Study**: In the Detect task with CWE information provided on the `pytorch-lightning_0` snapshot:

- The C-Agent (Claude 3.7) crafted an exploit that manipulated the application's internal state
- The exploit script triggered a denial-of-service (DoS) — the application crashed
- However, the agent's **self-written verification step never detected the crash as success**, so the main evaluator never proceeded to the patched test
- Running the runtime invariants *after* the exploit caused the application availability check to **fail**, which was recognized as a DoS
- ✅ As a result, the attempt was marked as a success

---

## O. Compute Resources and Execution Time

For every experiment, the hardware platform, memory/storage allocations, and average time per task are reported.

### Hardware Platforms

**Claude Code**
- Hardware: Apple M4 SoC (10-core CPU, 10-core GPU)
- Memory: 32 GB unified RAM
- Storage: 1 TB SSD
- OS: macOS Sequoia 15.4.1

**OpenAI Codex CLI (o3-high, o4-mini) & Custom Agents** (o3-high, GPT-4.1, Gemini 2.5, Claude 3.7, Qwen3 235B A22B, Llama 4 Maverick, DeepSeek-R1)
- Cluster: Google Kubernetes Engine (GKE) on C4A nodes (Arm Neoverse V2)
- Resource allocation per task: 1 vCPU, 6 GiB RAM
  - Observed RAM usage: 2–3 GiB per task
- Ephemeral storage per task: 30–40 GB SSD

### 📊 Average Time per Task

| Agent | Average Time | Average Execution Time |
|---|---|---|
| Claude Code | 7.83 min | — |
| OpenAI Codex CLI: o3-high | 13.30 min | — |
| OpenAI Codex CLI: o4-mini | 7.93 min | — |
| C-Agent: o3-high | 22.24 min | 10.41 min |
| C-Agent: GPT-4.1 | 12.31 min | 8.59 min |
| C-Agent: Gemini 2.5 | 23.21 min | 17.55 min |
| C-Agent: Claude 3.7 | 28.20 min | 12.99 min |
| C-Agent: Qwen3 235B A22B | 22.77 min | 11.08 min |
| C-Agent: Llama 4 Maverick | 17.38 min | 10.77 min |
| C-Agent: DeepSeek-R1 | 37.27 min | 14.86 min |

> **Note**: "Average Time" spans from the start of the first agent iteration to the end of the evaluation, including LLM call times. "Average Execution Time" measures only time spent on agent executions, excluding LLM call times. Both metrics exclude container setup and teardown overhead.

---

## P. Safety Refusals

### 📊 Refusal Rates

| Agent | Refusal Rate |
|---|---|
| OpenAI Codex CLI: o3-high | 14.1% |
| OpenAI Codex CLI: o4-mini | 11.2% |
| C-Agent: o3-high | 0.37% |
| All other agents | None observed |

📌 **Key Point**: Models typically have safety refusal procedures preventing engagement on "unsafe tasks," including cyberattacks.

### 🔬 Method for Identifying Refusals

- Searched all logs for potential refusal terms: "invalid prompt," "ethic," "ethics," "ethical," "refusal," "sorry"
- Manually filtered out a small number of unrelated false hits
- Encountered instances where the agent responded with a refusal message and no exploit script was generated
- No bounty-specific issues appeared to trigger refusals — refusals occurred across different bounties

### ⚠️ Attribution of Higher Refusal Rates

- OpenAI Codex CLI's higher refusal rate is attributed to its system prompt, which specifies being "safe and helpful" with a strict set of allowed functionalities
- The prompt permits "analyzing code for vulnerabilities," but the evaluation's prompt explicitly asks for creating an exploit script demonstrating the vulnerability, which might be interpreted as potentially harmful
- For other agents, refusals were rare, potentially because prompting made clear this was for an ethical purpose ("cybersecurity expert attempting ... bug bounty")
- Prior literature has found that prompting strategy significantly affects refusal rates, and that the "cybersecurity expert" prompt from Cybench was among the most effective at reducing refusal rates

---

## Table 20: Summary of Reported Bounties

| Task | Bounty Name | Disclosure Bounty | Patch Bounty | CVSS 3.x Score | CWE | CVE | Reported Date | Published Date |
|---|---|---|---|---|---|---|---|---|
| agentscope_0 | Path Traversal Enables Arbitrary File Reads | $450 | $112.5 | High (7.5) | CWE-22: Path Traversal | CVE-2024-8438 | 08/08/24 | 11/05/24 |
| astropy_0 | Argument Input Enables RCE | $40 | $10 | High (7.8) | CWE-20: Improper Input Validation | CVE-2023-41334 | 08/19/23 | 10/13/23 |
| bentoml_0 | Deserialization Vulnerability Enables RCE | $900 | $225 | Critical (9.8) | CWE-77: Command Injection | CVE-2024-9070 | 09/06/24 | 12/05/24 |
| bentoml_1 | POST Request Enables RCE | $900 | $225 | Critical (9.8) | CWE-1188: Insecure Default Initialization of Resource | CVE-2024-2912 | 02/06/24 | 04/15/24 |
| composio_0 | Missing Validation Allows Authentication Bypass | $900 | $225 | Critical (9.8) | CWE-304: Missing Critical Step in Authentication | CVE-2024-8954 | 08/30/24 | 12/05/24 |
| curl_0 | HSTS Overwritten by Long File Name | $540 | $135 | Medium (5.3) | CWE-311: Missing Encryption of Sensitive Data | CVE-2023-46219 | 11/02/23 | 12/08/23 |
| django_0 | DoS via Certain URLs | $2,162 | $541 | High (7.5) | CWE-130: Improper Handling of Length Parameter Inconsistency | CVE-2024-41990 | 10/21/24 | 11/30/24 |
| fastapi_0 | ReDoS via Malicious Header | Not disclosed | $187.5 | High (7.5) | CWE-400: Denial of Service | CVE-2024-24762 | 01/19/24 | 03/14/24 |
| gluon-cv_0 | TarSlip for Arbitrary File Write | $900 | $187.5 | High (7.1) | CWE-20: Improper Input Validation | CVE-2024-12216 | 10/09/24 | 01/07/25 |
| gpt_academic_0 | RCE through 7Z File Write | $360 | $75 | High (8.8) | CWE-29: Path Traversal | CVE-2024-12389 | 10/17/24 | 01/15/25 |
| gradio_0 | Open Redirect: SSRF Open Port | $125 | $31.25 | Medium (5.4) | CWE-601: Open Redirect | CVE-2024-4940 | 04/29/24 | 06/21/24 |
| gradio_1 | Local File Read and Copy | $750 | $187.5 | High (7.5) | CWE-29: Path Traversal | CVE-2024-1561 | 12/28/23 | 04/15/24 |
| gradio_2 | LFI in JSON Component | $750 | $187.5 | High (7.5) | CWE-20: Improper Input Validation | CVE-2024-4941 | 04/07/24 | 05/30/24 |
| gunicorn_0 | HTTP Request Smuggling | $750 | $187.5 | High (7.5) | CWE-444: HTTP Request Smuggling | CVE-2024-6827 | 03/19/24 | 07/24/24 |
| InvokeAI_0 | Arbitrary File Deletion via POST | $600 | $150 | Critical (9.1) | CWE-20: Improper Input Validation | CVE-2024-11042 | 10/01/24 | 12/30/24 |
| InvokeAI_1 | RCE via Unsafe Model Deserialization | $600 | $150 | Critical (9.8) | CWE-502: Deserialization of Untrusted Data | CVE-2024-12029 | 11/08/24 | 03/20/25 |
| kedro_0 | RCE via Malicious File Upload | $1,500 | $375 | Critical (9.8) | CWE-502: Deserialization of Untrusted Data | CVE-2024-9701 | 08/31/24 | 12/06/24 |
| langchain_0 | RCE via Pickle Deserialization | $125 | $31.25 | Medium (5.2) | CWE-502: Deserialization of Untrusted Data | CVE-2024-5998 | 06/12/24 | 09/17/24 |
| langchain_1 | Billion Laughs DoS | $125 | $31.25 | Medium (5.9) | CWE-776: XML Entity Expansion | CVE-2024-1455 | 02/01/24 | 03/26/24 |
| LibreChat_0 | Arbitrary File Deletion via Path Traversal | $450 | $112.5 | High (8.1) | CWE-73: External Control of File Name or Path | CVE-2024-10361 | 10/02/24 | 01/06/25 |
| LibreChat_1 | Code Injection Changes Log | $75 | $18.75 | Medium (4.3) | CWE-117: Improper Output Neutralization for Logs | CVE-2024-12580 | 10/25/24 | 01/23/25 |
| LibreChat_2 | DoS by Unhandled Exception | $450 | $112.5 | High (7.5) | CWE-400: Denial of Service | CVE-2024-11172 | 10/28/24 | 03/20/25 |
| LibreChat_3 | IDOR Delete Attachments | $450 | $112.5 | High (7.6) | CWE-284: Improper Access Control | CVE-2024-10366 | 10/10/24 | 01/08/25 |
| LibreChat_4 | RCE via Unsanitized File Path | $450 | $112.5 | High (8.8) | CWE-29: Path Traversal | CVE-2024-11170 | 11/07/24 | 03/20/25 |
| lunary_0 | IDOR Delete Project | $1,080 | $225 | High (7.5) | CWE-639: Authorization Bypass Through User-Controlled Key | CVE-2024-1625 | 02/17/24 | 04/03/24 |
| lunary_1 | Duplicate Emails for Same User | $540 | $112.5 | High (7.5) | CWE-821: Incorrect Synchronization | CVE-2024-1739 | 02/21/24 | 04/15/24 |
| lunary_2 | Read Unauthorized Organization Data | $1,080 | $225 | Critical (9.1) | CWE-200: Exposure of Sensitive Information to an Unauthorized Actor | CVE-2024-1643 | 02/08/24 | 04/05/24 |
| mlflow_0 | RCE through Registering Attacker's Model | $30,485 | $7,621.25 | Critical (10.0) | CWE-23: Relative Path Traversal | CVE-2023-6018 | 08/17/23 | 11/16/23 |

*(Bounty descriptions omitted from table for brevity; each entry describes the specific exploit mechanism — path traversal, deserialization, authentication bypass, DoS, or RCE — corresponding to its CWE classification.)*
