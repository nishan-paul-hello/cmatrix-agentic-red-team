⚙️ Chunk 2 of the paper

### C. Model Selection

Before large-scale evaluation, several modern LLMs were compared within AWE's orchestration layer using DVWA.

- Across models tested, **Claude Sonnet 4** consistently yielded the highest success rates and displayed the most stable iterative refinement behavior, particularly on vulnerabilities requiring multistep reasoning.
- Detailed numerical results appear in §VI-A.
- Based on these observations, Claude Sonnet 4 is used in all subsequent experiments.

### D. Experimental Configuration

- AWE is evaluated in its **aggressive configuration**, performing deep reconnaissance and executing all agents deemed relevant by the orchestrator.
- Each challenge is allotted a **ten-minute time budget**, matching MAPTA's configuration for comparability.
- All experiments run on identical hardware; each challenge runs in an isolated environment to prevent cross-contamination.
- Memory state is reset between challenges to evaluate single-engagement performance.
- Browser-based verification uses a consistent, headless Chromium configuration.

### E. Evaluation Metrics

AWE is assessed along three principal dimensions:

1. **Effectiveness** — overall and per-category solve rates, plus challenges uniquely solved by AWE or MAPTA.
2. **Efficiency** — time-to-solve and token usage per successful exploit.
3. **Cost** — total API expenditure and amortized cost per solved challenge based on provider pricing.

### F. Success Criteria

> A challenge is considered solved only if AWE retrieves the correct flag through a verified exploit. Partial progress or vulnerability detection without successful exploitation is not counted toward effectiveness metrics — ensuring all reported successes correspond to practically realizable attacks.

---

## VI. Evaluation

AWE is evaluated through a two-stage methodology:

1. Controlled experiments on **DVWA** to isolate the contribution of the underlying language model and justify the choice of Claude Sonnet 4.
2. Benchmarking against **MAPTA**, the most diverse publicly documented autonomous penetration-testing system, on the full 104-challenge **XBOW** benchmark.

This combination of controlled and large-scale testing gives a comprehensive view of AWE's capabilities, limitations, and efficiency.

### A. Evaluation on DVWA

DVWA provides a stable, deterministic environment enabling fine-grained comparison of LLM behavior independent of broader architectural factors.

- AWE was executed with three LLMs — **Claude Sonnet 4, GPT-4o, and Gemini 2.0 Flash** — using identical agent logic and verification procedures across five representative vulnerability classes.
- **Reflected XSS**: baseline capability; all models achieved 100% success.
- **CSP-enforced stored XSS**: Claude and GPT-4o tied at 67% accuracy; Gemini dropped to 50%.
- **Blind SQLi**: Claude reached 70%, GPT-4o 60%, Gemini 55%.
- These gaps reflect model-dependent differences in temporal inference, semantic constraint handling, and multi-step payload refinement.

📌 **Iteration efficiency**: Claude converged in 10–40 payload attempts; GPT-4o required ~20% more attempts; Gemini required ~40% more.

🖼️ Figure 4: Four histograms showing the distribution of payload attempts needed for successful exploitation across DVWA Low (avg. 10), Medium (avg. 20), and Hard (avg. 40) difficulty, plus XSSy difficulty (avg. 12) — illustrating Claude Sonnet 4's faster convergence versus GPT-4o (~20% more attempts) and Gemini 2.0 Flash (~40% more attempts).

**Conclusion:** Claude Sonnet 4 provides the best balance of accuracy and reasoning efficiency, so it is used as AWE's underlying model in all subsequent experiments.

### B. Evaluation on XBOW Benchmark

XBOW is a suite of 104 containerized web challenges spanning 26 vulnerability categories, from single-step injections to multi-stage exploitation workflows.

- MAPTA is used as the baseline because it is the most capable peer system — it employs **GPT-5** in extended-reasoning mode and executes arbitrary code within a sandbox, enabling broader exploration than AWE's specialized agents support.

**Overall Performance**

| System | Solve Rate | Avg. Time (s) | Model |
|---|---|---|---|
| AWE | 51.9% (54/104) | 53.1 | Claude Sonnet 4 |
| MAPTA | 76.9% (80/104) | 190.8 | GPT-5 |

- MAPTA attains a higher solve rate, reflecting the advantage of its general-purpose, unrestricted sandbox execution.
- AWE shows dramatic efficiency advantages:
  - Average solve time: **53.1s vs. 190.8s**
  - Total token usage: **1.12M vs. 54.9M** (98% reduction)
  - Total API cost: **$7.73 vs. $21.38** — despite MAPTA running a substantially more capable model

**Table II — Cost and Token Efficiency Comparison**

| System | Total Cost | Cost/Solve | Tokens | Tokens/Solve |
|---|---|---|---|---|
| AWE | $7.73 | $0.113 | 1.12M | 20.7K |
| MAPTA | $21.38 | $0.267 | 54.87M | 685.9K |

📌 These gains demonstrate that a specialization-oriented architecture can deliver orders-of-magnitude improvements in operational cost and latency.

### C. Per-Category Comparison

- AWE dominates on the injection classes it explicitly targets; MAPTA performs better on tasks requiring multi-step reasoning or semantic exploration.
- Both systems perform comparably on classical injection families — SQLi, blind SQLi, XXE — where straightforward exploitation patterns are reliably detected.
- **XSS**: AWE's strongest result — solves 20/23 vs. MAPTA's 13. AWE's exclusive wins typically require precise alignment between payload structure and reflection context, adaptive filter bypassing, and reasoning about multi-encoding transformations, which MAPTA's general-purpose pipeline often failed to infer.
- **Blind SQL injection**: AWE performs well due to its structured inference workflow and backend-specific timing probes.
- MAPTA substantially outperforms AWE in categories involving long-horizon procedural reasoning — privilege escalation, insecure deserialization, and business logic flaws — which exceed AWE's specialized-agent design.

**Table III — Category-Wise Performance Comparison on XBOW for Injection Vulnerabilities**

| Vulnerability | Total | MAPTA Count | MAPTA % | AWE Count | AWE % |
|---|---|---|---|---|---|
| XSS | 23 | 13 | 57% | 20 | 87% |
| Blind SQLi | 3 | 1 | 33% | 2 | 67% |
| SQLi | 6 | 6 | 100% | 6 | 100% |
| XXE | 3 | 3 | 100% | 3 | 100% |
| SSRF | 3 | 3 | 100% | 3 | 100% |
| SSTI | 13 | 11 | 85% | 7 | 54% |
| Command Injection | 11 | 9 | 82% | 5 | 45% |

### D. Failure Modes

- AWE failed on **50** challenges; MAPTA failed on **24**; both systems failed on **15**.
- ⚠️ Categorizing AWE's failures:
  - ~1/3 correspond to vulnerability classes intentionally outside its scope (business logic, deserialization, cryptographic misuse)
  - ~1/4 required multi-step reasoning and stateful exploitation chains AWE's agents cannot currently express
  - The remainder involve authentication irregularities, heavy filtering resisting AWE's mutation engine, or extremely narrow exploitation windows (e.g., race conditions)
- Challenges solved only by AWE cluster mainly in **XSS and blind SQLi**, reaffirming that its specialized pipelines offer meaningful advantages even against a more capable underlying model.
- Challenges solved only by MAPTA cluster overwhelmingly in categories requiring exploration, multi-agent state management, and semantic reasoning.

### E. Efficiency Analysis

- AWE consumed **1.12M tokens** vs. MAPTA's **54.9M** — an ~98% reduction, stemming from two architectural choices:
  1. Specialized agents avoid the expansive search spaces of general-purpose reasoning.
  2. Memory-guided heuristics significantly reduce redundant attempts.
- Time-to-solve shows a consistent **4–5× speedup** across percentiles.
- Median solve time: **35.7s (AWE) vs. 156.2s (MAPTA)**.

### F. Summary

📊 The evaluation highlights a clear architectural trade-off:

- **MAPTA** achieves broader coverage via its highly expressive sandbox and frontier-grade model, enabling multi-step exploitation across numerous vulnerability categories.
- **AWE** shows that architectural specialization can outperform general-purpose reasoning by large margins on targeted vulnerability classes, even with a smaller model.
- Efficiency benefits: **63% cost reduction, 4.4× faster solves, 98% fewer tokens** — suggesting specialized systems may be preferable for high-frequency testing and continuous assessment pipelines.
- AWE and MAPTA show complementary strengths, pointing toward **hybrid designs** combining structured domain knowledge with general-purpose semantic exploration.

---

## VII. Discussion

- AWE demonstrates that architectural specialization can materially improve the reliability and efficiency of autonomous vulnerability discovery.
- General-purpose reasoning alone is insufficient for precise, context-dependent exploitation; carefully engineered task structure can compensate for smaller model capacity and dramatically reduce computational overhead.
- Across XSS and blind SQLi, AWE's performance stems from explicit modeling of execution context (reflection positions, sanitization behavior, SQL operator boundaries) and conditioning payload generation on these abstractions — reducing the search space and yielding more stable exploit synthesis than unconstrained reasoning.
- That AWE outperforms MAPTA on these tasks despite using a substantially weaker model suggests exploit success depends at least as much on **architectural priors** as on raw model capability.
- Specialization does not replace broad autonomous reasoning: MAPTA's advantages are pronounced on multi-step exploitation involving authentication workflows, privilege escalation, and semantic business logic — tasks requiring long-horizon planning and cross-endpoint state tracking deliberately outside AWE's design.
- This points toward **hybrid architectures** combining structured vulnerability analysis with general-purpose exploratory reasoning.
- AWE's efficiency (98% fewer tokens, 63% lower cost, 4.4× faster solves) suggests immediate applicability in continuous/high-frequency testing settings where general-purpose agents remain prohibitively expensive.
- Embedding domain knowledge into agent design also opens the door for adaptive long-term learning — storing filter signatures, past bypasses, and effective payload patterns for stable performance across evolving application landscapes.

---

## VIII. Limitations

- **Scope restrictions**: targets injection-centric vulnerabilities; does not attempt reasoning-heavy categories such as business logic, complex authentication workflows, or protocol-level issues (e.g., request smuggling, desynchronization).
- **Limited multi-step planning**: agents operate in largely independent pipelines and don't coordinate multi-stage exploitation sequences. Chained discovery tasks (e.g., default credentials → IDOR → privilege escalation) fall outside its reach.
- **Reliance on heuristic abstractions**: context and filter models encode assumptions about server behavior and sanitization patterns; highly idiosyncratic frameworks or obfuscated sinks may invalidate these abstractions.
- **LLM sensitivity**: although Claude Sonnet 4 performed best, model-dependent reasoning variability remains a systemic constraint; shifts in model behavior or pricing may affect long-term stability.

---

## IX. Conclusion

- Introduces **AWE**, a specialized multi-agent system rethinking how LLMs can support autonomous web exploitation.
- By embedding domain knowledge into the architecture rather than relying solely on free-form reasoning, AWE achieves high accuracy on targeted vulnerability classes and large efficiency gains over a state-of-the-art general-purpose system.
- Central insight: **precision exploitation benefits from structure, while broad coverage benefits from flexibility.**
- Future direction: integrating specialized agents capturing injection-vulnerability semantics with higher-level agents capable of planning multi-step attacks — enabling autonomous penetration testing systems that are both scalable and semantically capable.

---

## References

[1] OWASP Foundation, "OWASP Top 10." Available: https://owasp.org/Top10/. Accessed: Aug. 21, 2025.

[2] PortSwigger, "Burp Suite Web Vulnerability Scanner." Available: https://portswigger.net/burp. Accessed: Aug. 21, 2025.

[3] OWASP Foundation, "OWASP Zed Attack Proxy (ZAP)." Available: https://www.zaproxy.org/. Accessed: Aug. 21, 2025.

[4] ProjectDiscovery, "Nuclei: Fast and Customizable Vulnerability Scanner." Available: https://github.com/projectdiscovery/nuclei. Accessed: Aug. 21, 2025.

[5] D. Stamatis et al., "sqlmap: Automatic SQL Injection and Database Takeover Tool." Available: https://sqlmap.org/. Accessed: Aug. 21, 2025.

[6] Positive Technologies, "Web application vulnerabilities in 2020–2021." Available: https://global.ptsecurity.com/en/research/analytics/web-vulnerabilities-2020-2021/. Accessed: Aug. 21, 2025.

[7] G. Deng, Y. Liu, V. Mayoral-Vilches, P. Liu, Y. Li, Y. Xu, T. Zhang, Y. Liu, M. Pinzger, and S. Rass, "PentestGPT: An LLM-empowered automatic penetration testing tool," arXiv:2308.06782, 2023. Available: https://arxiv.org/abs/2308.06782.

[8] B. Wu, G. Chen, K. Chen, X. Shang, J. Han, Y. He, W. Zhang, and N. Yu, "AutoPT: How far are we from end-to-end automated web penetration testing?," arXiv:2411.01236, 2024. Available: https://arxiv.org/abs/2411.01236.

[9] J. W. Stokes, A. Swaminathan, J. Xu, G. McDonald, X. Bai, D. Marshall, S. Wang, and Z. Li, "AutoAttacker: A large language model guided system to implement automatic cyber-attacks," arXiv:2403.01038, 2024. Available: https://arxiv.org/abs/2403.01038.

[10] Q. Wang, G. Yang, J. Wang, M. Li, Z. Chang, Y. Huang, and Z. Jiang, "Mimicking the familiar: Dynamic command generation for information theft attacks in LLM tool-learning systems," arXiv:2502.11358, 2025. Available: https://arxiv.org/abs/2502.11358.

[11] V. Mayoral-Vilches, L. J. Navarrete-Lozano, M. Sanz-Gomez, L. Salas Espejo, M. Crespo-Alvarez, F. Oca-Gonzalez, F. Balassone, A. Glera-Picon, U. Ayucar-Carbajo, J. A. Ruiz-Alcalde, S. Rass, M. Pinzger, and E. Gil-Uriarte, "CAI: An open, bug bounty-ready cybersecurity AI," arXiv:2504.06017, 2025. Available: https://arxiv.org/abs/2504.06017.

[12] I. David and A. Gervais, "Multi-agent penetration testing AI for the web," arXiv:2508.20816, 2025. Available: https://arxiv.org/abs/2508.20816.

[13] R. Dewhurst, "Damn Vulnerable Web Application (DVWA)," 2025. Available: https://github.com/digininja/DVWA. Accessed: Aug. 21, 2025.

[14] XBOW Engineering, "XBOW Validation Benchmarks." Available: https://github.com/xbow-engineering/validation-benchmarks. Accessed: Dec. 1, 2024.
