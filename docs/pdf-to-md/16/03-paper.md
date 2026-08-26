⚙️ Chunk 3 of the paper

## 6.2. Factor Analysis

Experiments vary **(1)** the LLM executing the plan, and **(2)** disabling modules in Incalmo. For brevity and cost constraints, these run on the 10 illustrative environments used in Sec. 2.

### 🔬 Impact of LLM Choice

Incalmo is evaluated with 10 different LLMs:
- Haiku 3.5
- Sonnet 3.5, 3.7, and 4
- GPT4o and GPT4o Mini
- Gemini Flash 1.5 and 2
- Gemini Pro 1.5 and 2.5

> **📌 Finding 2.A**: Incalmo successfully executes red teams with a variety of LLMs. Across all 10 LLMs, Incalmo successfully red teams 6–9 out of 10 representative environments w.r.t the Success metric (Fig. 11).

- In terms of the **Success** metric, across various LLMs, Incalmo succeeds in 9 out of 10 environments.
- In terms of the **TotalAcquisition** metric, Incalmo obtains all critical assets in 5 out of 10 environments (Fig. 11).
- In the *Dumbbell A* environment, Incalmo with all 10 LLMs obtains at least one critical asset, while none of the systems in Sec. 2 were able to.

A comparison is also made between Incalmo with smaller LLMs vs. ExpertPromptShell with bigger LLMs (one small + one big LLM per vendor, e.g. GPT4o vs GPT4o Mini).

🖼️ **Figure 11**: Heatmap showing Success/TotalAcquisition metrics of Incalmo across 10 LLMs (rows) × 10 environments (columns). Cell values range 0–1; darker green indicates "Obtained all critical assets," lighter green "Success," white "Did not succeed."

🖼️ **Figure 12**: Two-part heatmap comparing Incalmo (top, 3 LLMs) vs. ExpertPromptShell (bottom, 3 LLMs) across environments on the Success metric.

> **📌 Finding 2.B**: Incalmo using small LLMs obtained all critical assets in 5 out of 10 environments, while ExpertPromptShell with larger LLMs was unable to obtain all critical assets in any environment (Fig. 12).

- Incalmo (smaller LLMs) beats ExpertPromptShell (larger LLMs) on the Success metric in 9 of 10 environments.
- Example — *Equifax* environment: ExpertPromptShell w/ Sonnet 4 exfiltrated a single file; Incalmo w/ Haiku 3.5 exfiltrated **all 25 databases**.
- ⚠️ Contrary to the common assumption that larger models perform better [10], [32] — in the red-teaming domain, **Incalmo's abstractions matter more than model size**.

### 🔬 Impact of High-Level Tasks

A variant, **Incalmo-WHT** (Without High-level Tasks), removes access to the five high-level tasks but keeps the environment and attack graph services. LLMs instead use 19 predefined low-level tasks (e.g., reading a file, exploiting Apache Struts).

> **📌 Finding 3.A**: Incalmo-WHT was unable to succeed across all 10 environments and 10 LLMs, suggesting that the high-level task abstraction is an important factor for red team success (not shown for brevity).

### 🔬 Impact of Incalmo Services

A variant, **Incalmo-WS** (Without Services), removes the environment and attack graph *services* but keeps the five high-level tasks. Incalmo-WS's agents still use these services internally to stay environment-agnostic, but the **planning LLM** cannot access them directly (unlike full Incalmo).

🖼️ **Figure 13**: Heatmap comparing Incalmo-WS (top) vs. Incalmo (bottom) across 6 LLMs and 10 environments on Success/TotalAcquisition metrics.

> **📌 Finding 3.B**: In terms of the Success metric, Incalmo was able to succeed in 1 to 5 more environments than Incalmo-WS, suggesting that Incalmo services can further improve red team success (Fig. 13).

- Incalmo-WS with GPT4o Mini: critical assets obtained in only **3** environments.
- Incalmo with GPT4o: critical assets obtained in **8** environments.

### 🔬 Task-Agent Breakdown (Sonnet 3.5)

🖼️ **Figure 15**: Heatmap of Success/TotalAcquisition metrics for Incalmo using Sonnet 3.5 task agents across 3 environments (Equifax, Colonial Pipeline, 6-Layer Star), broken down by which component is LLM-driven (All Incalmo, All agents, Exfil. agent, Find info agent, Lat. move. agent, Priv. Esc. agent, Scan agent). Gray boxes indicate a task wasn't necessary for that environment.

---

## 6.3. Cost and Speed

### ⏱️ Speed

- *Enterprise C*: root access gained on all 15 critical hosts in **12–18 minutes** (Fig. 14).
- *Equifax*-inspired environment: data exfiltrated from all 48 databases in **54 minutes**.

🖼️ **Figure 14**: Scatter plot of minutes taken (14–70 min range) for Incalmo to obtain all critical assets, across 5 environments (Equifax, Enterprise C, 4-Layer chain, Dumbbell A, Enterprise A) and 6 LLMs (Haiku 3.5, Sonnet 4, Gemini 2 Flash, GPT4o mini, Sonnet 3.5... etc.).

⚠️ **Inefficiencies observed**: In one trial of *Dumbbell A*, Incalmo-Haiku 3.5 took 35 extra minutes because it infected all 15 external web servers **twice** before eventually exfiltrating database data.

### 💰 Cost

- Incalmo-Gemini 2 Flash usage fell within the **free tier**.
- Most expensive experiment: Sonnet 3.5 with 5,750K input tokens / 60K output tokens ≈ **$15**.
- Token breakdown detailed in Appendix C.

📌 **Takeaway**: High red-team success rate + low cost + speed together suggest LLMs can significantly lower the cost of penetration testing for defenders.

---

## 6.4. Extensibility Case Study

Demonstrates extending Incalmo with **new task-specific LLM-based agents** (vs. the deterministic agents used in prior evaluations).

- Example: instead of a predefined lateral-movement agent, an LLM-based agent dynamically executes the task via low-level commands, retaining access to services like the C&C server.
- An LLM-based agent is designed for each of the five high-level tasks.
- Case study setup: Sonnet 3.5 plans the red team **and** powers the task agents, tested on Equifax-inspired, Enterprise C, and 6-Layer Star environments (similar results found with Sonnet 4).
- Each LLM-based task agent capped at 10 interactions per task (cost control).
- Two setups compared:
  1. **All** task agents use Sonnet 3.5 instead of Incalmo's deterministic agents.
  2. Replace Incalmo agents **one at a time** with an LLM-based agent.

> **📌 Finding 4**: Sonnet 3.5-based task agents show promise at executing lateral movement, network scanning, privilege escalation, and data exfiltration. But LLM planners still require assistance from non-LLM agents to succeed (Fig. 15).

- **All-LLM-agents setup**: Sonnet 3.5 planner + Sonnet 3.5 task agents failed to succeed in any of the 3 environments.
- **One-at-a-time setup**: replacing a single Incalmo agent with an LLM-based agent, Sonnet 3.5 succeeded in all three environments (depending on which agent type was replaced). E.g., Sonnet 3.5 + a Sonnet 3.5 lateral-movement agent (other agents non-LLM) obtained critical assets in all 3 environments.

This study serves two purposes:
1. Identifies key steps where prior LLM-based offense systems have struggled.
2. Suggests a roadmap for tackling 0-day vulnerabilities via novel AI-based agents when existing agents lack coverage.

---

## 7. Discussion and Limitations

### 🔧 Improve TotalAcquisition
- Incalmo didn't always obtain all critical assets — in some trials, the LLM planner stopped after a single asset.
- Often, the planner could have queried the attack graph service to find additional paths but didn't.
- 💭 Hypothesis: LLMs may lack sufficient training data for red-teaming multi-host networks via attack graphs.
- **Future work**: fine-tune LLMs to better leverage the attack graph service.

### 🔧 Reducing Failure Scenarios
- Incalmo failed to succeed in 3 environments, which required **both** external scans (e.g., finding vulnerable web servers) and internal scans (e.g., finding a vulnerable DB management server).
- The LLM workflow seems to lack understanding that scanning from different network locations yields different results.
- **Hypothesis**: improving the attack graph service to reason about network segments and access control (e.g., subnet/firewall constraints) could improve both Success and TotalAcquisition.

### 🔧 Extending Incalmo to Handle 0-Days
- This paper scoped experiments to **known** vulnerabilities.
- Since Incalmo is extensible, future versions could add 0-day-specific task agents.

### 🔧 Environment Realism
- Enterprise network details are generally sensitive/non-public.
- MHBench is a best-effort design using public sources and prior incident reports.
- **Future work**: extend MHBench and test Incalmo against a broader range of real (possibly proprietary) enterprise settings.

### 🔧 Adding Defenders in the Loop
- Current evaluation uses environments **without defenders**.
- **Future work**: extend to settings with realistic (possibly autonomous) defenses, and add detection-evasion features to Incalmo.

### ⚠️ Memorization
- Concern: LLMs may memorize training data.
- Prior LLM-offense systems failed on MHBench, suggesting limited prior exposure to multi-host network challenges — unlike CTF challenges, where public solutions may exist in training data.
- Since MHBench will be released publicly, future LLM training data may incorporate it.
- Plan: evolve MHBench over time using "holdout" tests, similar to other benchmark efforts.

---

## 8. Other Related Work

### LLM Security Benchmarks
- Many benchmarks exist for evaluating LLMs on CTF challenges — but these are single-host, challenge-style problems.
- Other non-CTF benchmarks evaluate general security knowledge.

### Other LLM Security Research
- LLMs evaluated for finding vulnerable code.
- LLMs used to summarize defender security logs.
- LLMs used for anomaly detection.
- LLMs used for social engineering tasks (e.g., phishing).
- These areas are **orthogonal** to this paper's focus on multi-host red teams.

---

## 9. Conclusions

- Identifies a key gap in existing LLM-based offense capabilities: autonomously executing red-teaming exercises in **multi-host** environments.
- State-of-the-art LLM-assisted cyber-offense systems struggle in this setting; the paper sheds light on key failure modes.
- **Incalmo** raises the level of abstraction via:
  - Decoupling planning from execution
  - Introducing domain-specific task agents
- Across most environments in **MHBench**, Incalmo can autonomously:
  - Find vulnerable services
  - Execute exploits
  - Gain network access
  - Discover configurations/vulnerabilities for lateral movement
  - Escalate privileges
  - Exfiltrate data
- 📌 Believed to represent a significant advance in understanding LLM-assisted red-teaming capabilities, and to help defenders proactively protect networks (against both human and AI-based attacks) by lowering the barrier to running red-team exercises quickly, cheaply, and often.

---

## Ethics Considerations

### Dual-Use Framing
- Security research has a history of dual-use technologies (fuzzing, malware research, adversarial ML) — often benefiting defenders more than attackers.
- Incalmo follows this trend: usable by defenders (proactive testing) or attackers (real attacks).
- Poses similar risks to prior LLM-based and non-LLM-based attack systems.
- Understanding limits of AI-assisted autonomous attacks benefits red teams and helps defenders keep pace with future AI-assisted attackers.

### Beneficence Analysis by Stakeholder

| Stakeholder | Potential Benefit | Potential Harm |
|---|---|---|
| **LLM providers** | Profit from future Incalmo-like tools | Reputational harm if misused; potential impact from future regulation |
| **Companies** | Can use findings to test their own security (as with existing non-LLM tools) | Bad actors could use tools to attack companies |
| **Policymakers** | Helps measure LLM red-teaming capability to inform policy | — |
| **Security vendors** | Can assess networks for gaps; customers benefit from lower cost/time/effort for red-teaming | — |
| **Society at large** | Autonomous tools can help prevent security risks | Could also lower the bar for bad actors to execute attacks |

### 📌 Decision
- Researchers proceeded, judging benefits of autonomous red-teaming to outweigh potential harms — consistent with prior similar systems and established computer security research norms.
- Mitigated risk by **preemptively notifying LLM providers** so they could add guardrails if desired.

### Open Science
- MHBench, reproduction tools, and Incalmo will be **open source**, consistent with prior offensive-security research norms.
- Available at: `https://github.com/bsinger98/Incalmo`

---

## LLM Usage Considerations

- **Originality**: LLMs used for editorial purposes only; all outputs inspected by authors for accuracy/originality.
- **Transparency**: Meaningful results only observed with closed-source models (open-source reproducibility is thus limited), mitigated by open-sourcing MHBench, prompts, model numbers, and Incalmo's code.
- **Responsibility**: Exact carbon footprint not calculable. Experiments cost at most $15 each; ~$3,000 total LLM credits spent across providers. Smaller LLMs used during design/debugging to minimize environmental impact. Authors argue the societal cost of cyberattacks justifies the environmental cost of this research.

---

## References (partial — Chunk 3)

Selected citations appearing in this chunk:

- [10] Brown, T. B. *Language models are few-shot learners.* arXiv:2005.14165, 2020.
- [14] Deng et al. *PentestGPT: Evaluating and Harnessing LLMs for Automated Penetration Testing.* USENIX, 2024.
- [17] Fang et al. *Teams of LLM agents can exploit zero-day vulnerabilities.* arXiv:2406.01637, 2024.
- [20] FTC. *Equifax Data Breach Settlement.* Dec 2022.
- [31] Jegham et al. *How hungry is AI? Benchmarking energy, water, and carbon footprint of LLM inference.* arXiv:2505.09598, 2025.
- [32] Kaplan et al. *Scaling laws for neural language models.* arXiv:2001.08361, 2020.
- [33] Kerner, S. M. *Colonial Pipeline hack explained.* TechTarget, 2022.
- [73] (0-day/novel AI-agent roadmap reference)
- [80] (LLM-based offense systems reference)
- Full reference list ([1]–[36]+ shown) covers red-teaming automation, LLM security benchmarks, penetration-testing frameworks, and related multi-agent LLM literature.

*(Full numbered reference list preserved in original PDF; abbreviated here per chunking guidance — see complete bibliography in final chunk if provided separately.)*
