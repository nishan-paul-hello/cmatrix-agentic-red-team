⚙️ Chunk 4 of the paper

## References (continued)

- [20] Mai et al. — *Shell or nothing: Real-world benchmarks and memory-activated agents for automated penetration testing*, 2025. [arXiv:2509.09207](https://arxiv.org/abs/2509.09207)
- [21] Mirzadeh et al. — *GSM-Symbolic: Understanding the limitations of mathematical reasoning in large language models*, 2025. [arXiv:2410.05229](https://arxiv.org/abs/2410.05229)
- [22] Muzsai, Imolai, Lukács — *HackSynth: LLM agent and evaluation framework for autonomous penetration testing*, arXiv:2412.01778, 2024.
- [23] Nakatani — *RapidPen: Fully automated IP-to-shell penetration testing with LLM-based agents*, arXiv:2502.16730, 2025.
- [24] Nakatani (duplicate listing) — *RapidPen: Fully automated IP-to-shell penetration testing with LLM-based agents*, arXiv:2502.16730, 2025.
- [25] Orange Cyberdefense — *GOAD - Game of Active Directory*, [GitHub](https://github.com/Orange-Cyberdefense/GOAD), 2024. Vulnerable AD lab environments for practicing attack techniques.
- [26] OWASP Foundation — *OWASP Web Security Testing Guide*, v4.2, 2021.
- [27] Packer et al. — *MemGPT: Towards LLMs as operating systems*, 2024. [arXiv:2310.08560](https://arxiv.org/abs/2310.08560)
- [28] PTES Technical Guideline Development Team — *Penetration Testing Execution Standard (PTES)*, 2012. Defines seven phases from pre-engagement to reporting.
- [29] Shao et al. — *An empirical evaluation of LLMs for solving offensive security challenges*, arXiv:2402.11814, 2024.
- [30] Shen et al. — *PentestAgent: Incorporating LLM agents to automated penetration testing*, ASIA CCS '25, pp. 375–391, ACM, 2025.
- [31] Wölflein et al. — *LLM agents making agent tools*, ACL 2025, pp. 26092–26130. [doi:10.18653/v1/2025.acl-long.1266](https://aclanthology.org/2025.acl-long.1266/)
- [32] Wu et al. — *AutoPT: How far are we from the end2end automated web penetration testing?*, arXiv:2411.01236, 2024.
- [33] Zhan et al. — *Adaptive attacks break defenses against indirect prompt injection attacks on LLM agents*, 2025. [arXiv:2503.00061](https://arxiv.org/abs/2503.00061)
- [34] Zhou et al. — *WebArena: A realistic web environment for building autonomous agents*, ICLR 2024.

---

## Appendix A — Surveyed LLM-Based Penetration Testing Systems

> Table 10 lists the 28 candidate systems identified in the survey. Systems meeting inclusion criteria (LLM as core component, targets pen-testing/CTF, published technical details) are marked ✓.

### 📊 Table 10: Complete List of Surveyed Systems

| System | Source | Year | Included |
|---|---|---|---|
| PentestGPT [8] | USENIX Security | 2024 | ✓ |
| AutoPT [32] | arXiv | 2024 | ✓ |
| RapidPen [24] | arXiv | 2025 | ✓ |
| PentestAgent [30] | arXiv | 2024 | ✓ |
| VulnBot [17] | arXiv | 2025 | ✓ |
| xOffense [19] | arXiv | 2025 | ✓ |
| TermiAgent [20] | arXiv | 2025 | ✓ |
| HackSynth [22] | arXiv | 2024 | ✓ |
| MAPTA [7] | arXiv | 2025 | ✓ |
| Cochise [12] | arXiv | 2025 | ✓ |

**Excluded — Vulnerability detection only:**
VulnScanner-AI (GitHub, 2024), LLM-SecAudit (arXiv, 2024), CodeVuln (arXiv, 2024), BugHunter (RAID, 2024), AutoFuzz-LLM (CCS, 2024)

**Excluded — Commercial / no published details:**
Pentera (2024), Cobalt Strike AI (2024), CrowdStrike Charlotte (2024)

**Excluded — Non-exploitation focus:**
CTF-Helper, CryptoSolver, RevEngGPT, MalwareGPT, ThreatGPT, SecurityBot, DFIR-Assistant, IRBot, SOC-Copilot, VulnReport-LLM (arXiv/GitHub, 2023–2025)

---

## Appendix B — Tool and Skill Layer: Supported Tools

> Table 11 lists the 38 security tools integrated into PENTESTGPT V2's Tool and Skill Layer. Each tool exposes a typed interface (input parameters, output schema, pre/postconditions), selected to align with standard pen-testing methodology and professional certifications (e.g., OSCP).

### 🔧 Table 11: Integrated Security Tools

**Reconnaissance**

| Tool | Description |
|---|---|
| nmap | Network discovery, port/service scanning, OS fingerprinting |
| masscan | High-speed port scanner for large networks |
| gobuster | Directory/DNS bruteforcing for web discovery |
| ffuf | Web fuzzer for directories, parameters, vhosts |
| feroxbuster | Recursive web content discovery |
| nikto | Web server vulnerability scanner |
| whatweb | Web technology fingerprinting |
| enum4linux | SMB/Samba enumeration (users, shares, OS) |

**Web Exploitation**

| Tool | Description |
|---|---|
| sqlmap | SQL injection detection and exploitation |
| burpsuite | Web proxy for traffic interception and testing |
| zap | OWASP web vulnerability scanner |
| wfuzz | Web fuzzer for parameters and authentication |
| commix | Command injection exploitation |
| nuclei | Template-based CVE and misconfiguration scanner |

**Network Exploitation**

| Tool | Description |
|---|---|
| metasploit | Exploitation framework with pre/post-exploitation modules |
| netcat | TCP/UDP networking utility |
| crackmapexec | Windows/AD post-exploitation toolkit |
| responder | LLMNR/NBT-NS poisoner for credential capture |
| evil-winrm | WinRM shell with pass-the-hash support |
| chisel | HTTP tunneling for network pivoting |
| proxychains | SOCKS/HTTP proxy routing for pivoting |

**Credential Attacks**

| Tool | Description |
|---|---|
| hashcat | GPU password cracker (300+ hash types) |
| john | Rule-based password cracker |
| hydra | Online bruteforcing (50+ protocols) |
| impacket | Protocol library (secretsdump, psexec, wmiexec) |
| kerbrute | Kerberos user enumeration and password spraying |

**Active Directory**

| Tool | Description |
|---|---|
| bloodhound | AD attack path visualization via graph analysis |
| sharphound | BloodHound data collector |
| rubeus | Kerberos attack toolkit (roasting, tickets) |
| mimikatz | Memory credential extraction |
| powerview | AD enumeration PowerShell tool |
| ldapdomaindump | LDAP data extraction |
| pingcastle | AD security assessment and risk scoring |
| adrecon | AD reconnaissance reporting |

**Privilege Escalation**

| Tool | Description |
|---|---|
| linpeas | Linux privesc enumeration |
| winpeas | Windows privesc enumeration |
| pspy | Linux process monitor (cron, scheduled tasks) |
| seatbelt | Windows security auditing |

---

## Appendix C — Evidence Confidence Scoring

> Table 12 presents the complete evidence confidence scoring rubric used by the TDA mechanism. Scores are assigned deterministically by evidence type, enabling reproducible difficulty assessment.

### 📌 Path Confidence Computation

For a path $P = (n_0, n_1, \ldots, n_k)$ from root to current node, evidence confidence is:

$$E(P) = \frac{1}{k}\sum_{i=1}^{k} e(n_i) \tag{3}$$

where $e(n_i)$ is the confidence score assigned to node $n_i$ per Table 12. The root node $n_0$ is excluded (it represents the initial state before any evidence is gathered).

### 🔬 Tool Output Parsing

Evidence types are determined automatically by parsing tool outputs against expected patterns:

- `nmap` output containing "open" + service version → **version-matched vulnerability lookup** (0.5)
- `sqlmap` output containing "injectable" → **confirmed injection** (0.8)
- Successful SSH connection → **valid credentials** (1.0)

The Tool Layer's typed interfaces (Section 4.2) provide structured outputs that simplify this parsing.

### Example Path

> Port scan → web server (nginx 1.18) → directory bruteforce → login form discovered → SQL injection confirmed

Evidence scores: 0.3 (service identified) + 0.5 (version-matched) + 0.3 (endpoint exists) + 0.8 (injection confirmed)

$$E = \frac{0.3 + 0.5 + 0.3 + 0.8}{4} = 0.475$$

→ indicates moderate confidence, appropriate for transitioning from reconnaissance to exploitation.

### 📊 Table 12: Evidence Confidence Scoring Rubric

*When multiple evidence types are present at a node, the highest applicable score is used.*

**Verified Evidence (Exploitation Confirmed)**

| Evidence Type | Score | Indicators |
|---|---|---|
| Valid credentials | 1.0 | Successful authentication via SSH, WinRM, SMB, or web login |
| Shell access | 1.0 | Interactive command execution confirmed |
| Data exfiltration | 1.0 | Sensitive data retrieved (flags, database contents, config files) |

**Confirmed Vulnerability (Exploit Available)**

| Evidence Type | Score | Indicators |
|---|---|---|
| CVE with public exploit | 0.8 | Vulnerability scanner confirmation + Exploit-DB/Metasploit module exists |
| Auth bypass confirmed | 0.8 | Endpoint accessible without credentials when authentication expected |
| Injection confirmed | 0.8 | SQL/command injection produces observable side effects |

**Plausible Hypothesis (Evidence Supports)**

| Evidence Type | Score | Indicators |
|---|---|---|
| Version-matched vuln | 0.5 | Service version matches known vulnerable version range |
| Configuration weakness | 0.5 | Misconfiguration identified (default credentials, open permissions) |
| Information disclosure | 0.5 | Sensitive information leaked (usernames, paths, internal IPs) |

**Speculative Hypothesis (Minimal Evidence)**

| Evidence Type | Score | Indicators |
|---|---|---|
| Service identified | 0.3 | Port open with service fingerprint, no version/vulnerability match |
| Potential attack surface | 0.3 | Endpoint exists but no vulnerability indicators |
| Unconfirmed assumption | 0.3 | Hypothesis based on common patterns without direct evidence |

---

## Appendix D — Parameter Derivation and Validation

> Documents derivation and sensitivity analysis for PENTESTGPT V2 hyperparameters.

### D.1 Validation Dataset

- Held-out set: **30 execution traces** from retired HTB machines (2022–2023), disjoint from the PentestGPT Benchmark evaluation set.
- Composition: 10 Easy, 12 Medium, 8 Hard machines
- Coverage: web exploitation (12), Linux privilege escalation (10), Windows/AD attacks (8)
- Validation model: **GPT-4o** (to avoid overlap with evaluation models: GPT-5.2, Opus 4.5, Gemini 3)

### D.2 TDI Weight Selection

- Table 13 presents TDI weights derived via grid search over $w \in [0.1, 0.4]$, step size 0.05, subject to $\sum w_i = 1$.
- Performance metric: mean subtask completion rate across the validation set.
- Performance varies **within ±3%** across configurations where all weights remain in $[0.1, 0.4]$ → robust to precise weight selection.
- **Selected configuration:** $w_H = w_E = 0.3$, $w_C = w_S = 0.2$
  - Reflects domain intuition: horizon and evidence confidence are primary difficulty signals; context load and success rate provide secondary modulation.

### D.3 Mode Selection Thresholds

- Table 14 presents sensitivity analysis for mode selection thresholds ($\theta_{explore}$, $\theta_{exploit}$).
- The intermediate zone ($\theta_{exploit} \leq TDI \leq \theta_{explore}$) triggers `LLM_DECIDE`.
- Narrower zones → fewer LLM calls but reduced adaptivity; wider zones → increased overhead without proportional benefit.

### D.4 Pruning Parameters

- Pruning threshold: $\theta_{prune} = 0.8$
- Minimum attempts: $k_{min} = 3$
- These jointly prevent premature and excessively delayed pruning.
- Lower thresholds → increased false pruning (abandoning tractable paths); higher thresholds → wasted attempts on intractable paths. Selected configuration balances the two.

### D.5 UCB Difficulty Penalty

- Difficulty penalty coefficient: $\lambda = 0.5$, modulating how strongly TDI affects node selection in the UCB formula.
- $\lambda = 0$ → recovers standard UCB (underperforms — insufficient difficulty awareness).
- $\lambda = 1.0$ → over-penalizes difficult nodes, preventing exploration of challenging-but-tractable paths.

### D.6 Context Load Degradation Study

**🔬 Method:** Established the 40% context load threshold via a controlled study of LLM instruction-following accuracy under varying context loads.

- **Task set:** 50 penetration-testing instruction-following tasks, built from an independent GOAD deployment (separate from evaluation instances).
- **Task structure:** system state description + accumulated context (tool outputs, discovered information) + a specific instruction (e.g., "Extract the service account password from the Kerberoast output and attempt authentication"). Unambiguous correct responses enable binary accuracy scoring.
- **Context variants:** 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90% of the model's context window, padded with realistic pen-testing artifacts (verbose tool outputs, recon results, session histories from actual GOAD runs). Padding inserted before the instruction to simulate accumulated session context.
- **Models evaluated:** GPT-4o (128K context), Claude-3-Sonnet (200K context), Gemini-1.5-Pro (1M context); temperature 0; 3 runs per task–context combination.

**📊 Result:** Performance stays stable (>90%) up to 40% load, then degrades roughly linearly. The 40% threshold marks the inflection point beyond which additional context yields diminishing returns and begins actively harming performance.

**⚠️ Failure Mode Analysis** (beyond 40% load, failures concentrate in three categories):

1. **Ignoring relevant earlier context** — 42% of failures
2. **Hallucinating tool outputs not present in context** — 31% of failures
3. **Executing incorrect but plausible commands** — 27% of failures

> These patterns align with the "lost in the middle" phenomenon documented in prior work [18].
