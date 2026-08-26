⚙️ Chunk 3 of the paper

## 📊 Table 3: Per-Target Vulnerability Assessment Results with Token Breakdown by Agent

| Target | GitHub ⋆ | Main Regular | Main Cached | Main Output | Sandbox Regular | Sandbox Cached | Sandbox Output | H | M | L | Cost ($) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| OSN-06 | 21K | 22K | 270K | 12K | 322K | 6.9M | 70K | 4 | 2 | 0 | 4.85 |
| OSN-03 | 9K | 9K | 17K | 11K | 28K | 372K | 23K | 5 | 1 | 0 | 1.57 |
| OSN-04 | 18K | 47K | 834K | 15K | 176K | 1.1M | 117K | 1 | 1 | 1 | 6.05 |
| OSN-05 | 36K | 40K | 615K | 20K | 253K | 1.7M | 116K | 2 | 0 | 0 | 6.55 |
| OSN-01 | 26K | 221K | 3.8M | 18K | 182K | 200K | 180K | 1 | 0 | 0 | 8.02 |
| OSN-02 | 8K | 8K | 18K | 8K | 79K | 657K | 30K | 1 | 0 | 0 | 1.97 |
| appsmith | 38K | 12K | 35K | 9K | 40K | 339K | 34K | 0 | 0 | 0 | 2.11 |
| directus | 32K | 11K | 58K | 11K | 40K | 536K | 34K | 0 | 0 | 0 | 1.97 |
| gitea | 50K | 9K | 18K | 9K | 131K | 1.4M | 27K | 0 | 0 | 0 | 1.93 |
| grafana | 70K | 7K | 25K | 10K | 254K | 432K | 19K | 0 | 0 | 0 | 1.73 |

🖼️ **Figure 10**: Scatter plot of Assessment Time (minutes) vs. Vulnerabilities Found, showing a weak positive correlation (r = 0.299). Points are labeled with target names and vulnerability type counts (e.g., "OSN-03: Other (+5)", "OSN-06: Other (+5)"); several zero-vulnerability targets (directus, appsmith, gitea, grafana) cluster around low assessment times.

## 4.1 Vulnerability Discovery Results

> **⚠️ Responsible Disclosure Note:** Application identities where vulnerabilities were discovered have been anonymized using obfuscated names (OSN-XX). Applications where no vulnerabilities were found (appsmithorg/appsmith, directus/directus, go-gitea/gitea, grafana/grafana) are identified by their real repository names to demonstrate the breadth of evaluation across diverse, production-grade codebases.

📌 **Key results:**
- MAPTA identified **19 vulnerabilities across 6 applications** (60% discovery rate)
- Severity distribution: **73.7% High/Critical, 21.1% Medium, 5.3% Low/Informational**
- Assessment costs averaged **$3.67 per application** over **50.7 minutes**
- Cost does not directly correlate with findings — some of the most expensive assessments yielded no vulnerabilities, while others found critical issues at lower computational cost

### Example Critical Vulnerabilities Discovered

- **Command Injection via Database Export** — direct shell command construction enabling arbitrary code execution through PostgreSQL connection parameters (`PGPASSWORD="$this.config.password" pg_dump -schema-only "$input"`)
- **Client-Side Secret Exposure** — server-side API keys delivered via JavaScript configuration endpoints (`window.env = {OPENAI_API_KEY: "$OPENAI_API_KEY"}`)
- **postMessage RCE** — arbitrary code execution through overly permissive cross-frame origin validation (`case 'builder.evaluate': new Function(text)`)
- **Unauthenticated Email Relay with SSRF** — public API endpoints accepting arbitrary SMTP credentials and remote attachment URLs (`fileUrls: "http://169.254.169.254/latest/meta-data/"`)
- **Arbitrary File Write via Client-Controlled Tools** — remote clients enabling dangerous file operations through tool merging (`input.tools` override enabling `PatchTool`)

### Example High Severity Patterns

- **Unauthenticated API Integration Abuse** — third-party service access using attacker-supplied credential IDs (Google Sheets, Stripe PaymentIntent creation)
- **Insecure Cryptographic Implementation** — non-cryptographic RNG for API key generation (`Math.random()` for 64-character secret keys)
- **Path Traversal via File Access APIs** — unvalidated file path parameters enabling arbitrary file reads (`File.read(path)` without containment checks)
- **Unauthenticated Administrative Endpoints** — critical system operations exposed without authorization (`/share_delete_admin` clearing Durable Objects)

### Example Medium Severity Patterns

- **XSS via Environment Injection** — unescaped server-side template rendering in configuration endpoints (`"$OPENAI_API_ENDPOINT"` string interpolation)
- **CSRF Across REST APIs** — state-changing operations without Origin validation or CSRF tokens (API token creation, user invitations)
- **SSRF via Integration APIs** — server-side request forgery through legitimate webhook and file import functionality
- **Open Redirect via Payment Flows** — unchecked URL parameters in checkout processes (`success_url`, `cancel_url`)

## 5 Related Work

### 5.1 Classical Automated Web Security Testing

Traditional automated security testing has evolved substantially over the past two decades, yet fundamental limitations persist that motivate AI-driven solutions like MAPTA.

- **Dynamic scanners** (OWASP ZAP, Burp Suite) crawl applications and fuzz HTTP parameters for common vulnerabilities. They struggle with single-page applications with dynamic JavaScript content and cannot detect business-logic vulnerabilities requiring multi-step interactions, due to lack of contextual understanding.
- **Static analysis (SAST) tools** examine source code without execution. A study of seven Java SAST tools found only **12.7%** of real-world vulnerabilities were detected, with the union of all tools still missing **71%**. Poor detection stems from difficulty modeling complex data flows, dynamic language features, and runtime exploitability — plus high false-positive rates. This gap directly motivates MAPTA's verify-by-execution approach.
- **Hybrid approaches** combine static analysis with runtime instrumentation to cut false positives, but instrumentation overhead and complexity across microservices/containers limit adoption.
- **API-driven architectures** introduce vulnerability classes (BOLA, BFLA, IDOR per the OWASP API Security Top 10 2023) that traditional scanners struggle with, since they require understanding application-specific access controls and stateful interaction sequences.

### 5.2 Stateful REST/API Fuzzing

Stateless fuzzing fails to detect business-logic vulnerabilities, motivating stateful approaches that maintain application state across multi-step sequences.

- **RESTler** (Microsoft Research) builds request dependency graphs from OpenAPI specs, finding vulnerabilities in Azure and Office365 — showing the value of dependency-aware testing over naive fuzzing.
- **Pythia** extends RESTler with coverage feedback and learning-based mutations.
- **fuzz-lightyear** (Yelp) targets IDOR/BOLA specifically via stateful Swagger-based fuzzing.

These tools show effective business-logic detection needs understanding of semantic relationships between data objects and authorization controls — the pattern MAPTA generalizes through statefulness, property checks, and oracle-backed validation.

### 5.3 LLMs for Secure Code

- **GitHub Copilot** generates vulnerable code in **40%** of CWE-targeted scenarios, from reproducing insecure patterns in training data.
- Surveys show LLMs excel at security reasoning and hypothesis generation but need **external oracles and environment feedback** to validate outputs and avoid hallucination — a pattern MAPTA addresses through tool integration and concrete execution.
- **Google's Big Sleep** discovered a zero-day in SQLite (November 2024) and helped prevent exploitation, but remains closed-source, preventing independent verification — motivating MAPTA's open-science approach.

### 5.4 LLM-Driven Autonomous Testing and Tool Orchestration

Autonomous pentesting systems represent an evolution from static detection toward dynamic, reasoning-based assessment via sophisticated tool orchestration.

- **ReAct** and **Toolformer** established that LLMs achieve superior performance through structured tool interaction and environmental feedback loops.
- **SWE-agent** showed interface design and tool abstractions determine success on complex technical tasks.
- **PentestGPT** pioneered multi-stage LLM workflows for enumeration, exploitation, and privilege escalation with optional human oversight, but operates through hardcoded interactive loops and lacks true agentic capability (the project itself states an "agentic upgrade" is still pending). It reports aggregate costs of $131.5 for 10 HTB machines and $5.1 average per picoMini attempt.
- **PenHeal** couples discovery with remediation via knapsack optimization but doesn't report LLM token usage — its "cost" metric is a remediation score, not operational expense.
- **RefPentester** adds self-reflection and knowledge-guided planning.
- Browser-capable agents enable direct web interaction for CSRF/SSRF testing.

📌 **MAPTA's contribution vs. prior work:**
- Complete token-level accounting across 104 XBOW challenges: **3.2M regular input, 1.10M output, 50.5M cached, 0.595M reasoning tokens**, totaling **$21.38** overall cost, median **$0.117** per challenge
- Output tokens identified as the primary cost driver
- Quantifies negative correlations between resource use and success: tool calls (r = **-0.661**), dollar cost (r = **-0.606**), tokens (r = **-0.587**), time (r = **-0.557**) — providing early-stopping heuristics and budget guidance
- Multi-agent coordinator/sandbox architecture with dynamic tool use and end-to-end proof-of-concept validation, eliminating false positives inherent in theoretical detection

### 5.5 Benchmarks and Testbeds

- Traditional vulnerable apps (**Juice Shop**, **WebGoat**, **DVWA**) cover limited vulnerability types, unsuitable for evaluating advanced systems.
- **XBOW benchmark** provides modern web application challenges with REST APIs, complex business logic, and realistic authentication — emphasizing exploit-execution validation over theoretical detection, eliminating false positives.
- MAPTA's multi-agent architecture with sandboxed exploit validation directly addresses limitations in single-agent systems (PentestGPT) and traditional scanners' false-positive issues.

## 6 Conclusion

📌 **Summary of results:**
- MAPTA achieves **76.9% success** across 104 XBOW challenges, with perfect performance on SSRF and misconfiguration vulnerabilities
- Systematic weaknesses: blind SQL injection (**0%**), cross-site scripting (**57%**)
- Total cost accounting of **$21.38** — first rigorous resource model for autonomous pentesting; median cost **$0.073** for successful attempts vs. **$0.357** for failures
- CTF evaluation (N=104) revealed strong correlations between resource usage and success, enabling early-stopping thresholds around **~40 tool calls, $0.30, or 300 seconds** — though these patterns could not be validated in the whitebox assessment due to smaller sample size (N=10)
- Real-world validation: **19 vulnerabilities** discovered across ten popular open-source applications, **14** classified high/critical (RCE, command injection, secret exposure, arbitrary file write), at an average cost of **$3.67** per assessment
- All findings responsibly disclosed; **10 findings** are under CVE review at time of writing
- Recommendation: deploy MAPTA continuously for ongoing defensive protection of web applications

## Ethical Considerations

⚠️ MAPTA raises ethical considerations around responsible disclosure of AI-powered security testing capabilities, addressed through the following principles:

1. **Defensive Publication and Community Awareness** — publishing is justified because adversarial actors likely already possess or are developing similar capabilities; transparency lets the community prepare defenses.
2. **Controlled Evaluation Environments** — evaluation avoided live production systems. Two assessment types were used: (1) black-box evaluation on purpose-built XBOW CTF challenges, and (2) white-box assessments of open-source applications, conducted entirely within isolated local sandboxed VMs by cloning public repositories.
3. **Sandboxed Testing Infrastructure** — all evaluations ran in dedicated VMs with restricted network access, preventing outbound connections or data exfiltration, with monitoring/logging to keep testing contained.
4. **Responsible Vulnerability Disclosure** — discovered vulnerabilities were reported to maintainers with remediation detail; 10 vulnerabilities were submitted for CVE assignment, with public disclosure of exploitation techniques withheld until patches are available.
5. **Dual-Use Technology Considerations** — MAPTA is acknowledged as dual-use. Built-in constraints prevent destructive operations, data exfiltration, or persistent system modification; the system produces proof-of-concept demonstrations rather than weaponized exploits.
6. **Access Control and Distribution** — source code will be released publicly upon publication for reproducibility, with documentation on ethical use guidelines and defensive-only configuration options.

> The guiding principle: the cybersecurity community benefits more from understanding these capabilities than from attempting to suppress them.

## Open Science & Availability

In accordance with the Open Science Policy, all research artifacts needed to evaluate and reproduce the paper's contributions are provided:

- MAPTA code: `https://github.com/arthurgervais/mapta`
- Updated XBOW 104 Challenge Evaluation Framework: `https://github.com/arthurgervais/validation-benchmarks`

## References

1. Waleed Alasmary, Feras Khan, Ghada Almashaqbeh, et al. A survey of business logic vulnerabilities in web applications. *Information*, 16(7):585, 2025.
2. Vaggelis Atlidakis, Roxana Geambasu, Patrice Godefroid, Marina Polishchuk, and Baishakhi Ray. Pythia: Grammar-based fuzzing of rest apis with coverage-guided feedback and learning-based mutations. In *ACM Joint European Software Engineering Conference and Symposium on the Foundations of Software Engineering (ESEC/FSE)*, 2020.
3. Vaggelis Atlidakis, Patrice Godefroid, and Marina Polishchuk. Restler: Stateful rest api fuzzing. In *International Conference on Software Engineering (ICSE)*, 2019.
4. Tom Brown, Benjamin Mann, Nick Ryder, Melanie Subbiah, Jared D Kaplan, Prafulla Dhariwal, Arvind Neelakantan, Pranav Shyam, Girish Sastry, Amanda Askell, et al. Language models are few-shot learners. In *Advances in Neural Information Processing Systems*, volume 33, pages 1877–1901, 2020.
5. Mark Chen, Jerry Tworek, Heewoo Jun, Qiming Yuan, Henrique Ponde de Oliveira Pinto, Jared Kaplan, Harri Edwards, Yuri Burda, Nicholas Joseph, Greg Brockman, et al. Evaluating large language models trained on code. *arXiv preprint arXiv:2107.03374*, 2021.
6. Xiaozhu Chen, Yuhang Zhou, Zihan Wang, et al. Large language models for cyber security: A systematic literature review. *arXiv preprint arXiv:2405.04760*, 2024.
7. Hanzheng Dai, Yuanliang Li, Zhibo Zhang, and Jun Yan. Refpentester: A knowledge-informed self-reflective penetration testing framework based on llms, 2025.
8. Gelei Deng, Ziniu Hu, Yueqi Chen, Haoyu Wang, Bangjie Yin, Yinzhi Cao, Gang Wang, Yan Chen, Xinyu Xing, and Zhiqiang Lin. Pentestgpt: Evaluating and harnessing large language models for automated penetration testing. In *USENIX Security*, 2024.
9. Ryan Dewhurst. Damn vulnerable web application (dvwa), 2025.
10. Brendan Dolan-Gavitt. Ai agents for offsec with zero false positives, 2025.
11. Google Cloud CISO Office. Our big sleep agent makes a big leap. *Google Cloud Blog*, 2025.
12. Google Project Zero. From naptime to big sleep: Using large language models to find real-world vulnerabilities. *Project Zero Blog*, 2024.
13. Junjie Huang and Quanyan Zhu. Penheal: A two-stage llm framework for automated pentesting and optimal remediation. In *Proceedings of the ACM Conference Companion on Computer and Communications Security (ACM CCS Companion), AutonomousCyber '24: Proceedings of the Workshop on Autonomous Cybersecurity*, 2024.
14. Imperva. Business logic attacks: Why traditional tools fall short. `https://www.imperva.com/blog/business-logic-attacks-traditional-tools-shortcomings/`, 2023. Accessed: 2025-08-21.
15. N. Kalopisis. Browser-empowered llm agents for web penetration testing. Master's thesis, University of Twente, 2025.
16. Kaixuan Li, Sen Chen, Lingling Fan, Ruitao Feng, Han Liu, Chengwei Liu, Yang Liu, and Yixiang Chen. Comparison and evaluation on static application security testing (sast) tools for java. In *ESEC/FSE*, 2023.
17. OWASP Foundation. Owasp api security top 10: 2023, 2023.
18. OWASP Foundation. Owasp juice shop, 2025.
19. OWASP Foundation. Owasp webgoat, 2025.
20. OWASP ZAP Project. Zed attack proxy (zap) documentation, 2025.
21. Hammond Pearce, Baleegh Ahmad, Benjamin Tan, Brendan Dolan-Gavitt, and Ramesh Karri. Asleep at the keyboard? assessing the security of github copilot's code contributions. In *2022 IEEE Symposium on Security and Privacy (SP)*, pages 754–768. IEEE, 2022.
22. PortSwigger Ltd. Burp suite documentation, 2025.
23. Positive Technologies. Web application vulnerabilities in 2020–2021. `https://global.ptsecurity.com/en/research/analytics/web-vulnerabilities-2020-2021/`, 2021. Accessed: 2025-08-21.
24. Timo Schick, Jane Dwivedi-Yu, Roberto Dessi, Roberta Raileanu, Maria Lomeli, Luke Zettlemoyer, Nicola Cancedda, and Thomas Scialom. Toolformer: Language models can teach themselves to use tools, 2023.
25. XBOW Engineering. Xbow validation benchmarks. `https://github.com/xbow-engineering/validation-benchmarks`, 2024. Accessed: 2024-12-01.
26. XBOW Engineering. Gpt-5 performance analysis for autonomous penetration testing. *XBOW Blog*, 2025. Accessed: 2025-01-26.
27. John Yang, Carlos E. Jiménez, Ofir Press, and Karthik Narasimhan. Swe-agent: Agent-computer interfaces enable automated software engineering. In *Advances in Neural Information Processing Systems (NeurIPS)*, 2024.
28. Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, and Yuan Cao. React: Synergizing reasoning and acting in language models, 2022.
