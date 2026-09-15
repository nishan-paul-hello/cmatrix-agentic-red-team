# Curated Research Papers — 29 Papers (Final Selection, Reindexed by Architecture Relevance)

> **Scope:** Papers directly relevant to our work — LLM-based agentic pentesting,
> multi-agent red-team orchestration, autonomous vulnerability exploitation, offensive security
> benchmarks, and agentic cybersecurity systems. Ordered from **most → least architecturally
> relevant** to RedGrid (architecture.md).
> Quality filter: CCF-A/B venues, major arXiv preprints with 50+ citations, or direct architectural
> equivalents.

---

## `T1 — Core Architecture Pillars (Papers 1–14)`

### 1. CVE-Bench: A Benchmark for AI Agents' Ability to Exploit Real-World Web Application Vulnerabilities
- **Website:** [🌐 Link](https://arxiv.org/abs/2406.10047)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/01-cve-bench-a-benchmark-for-ai-agents-ability-to-exploit-real-world-web-application-vulnerabilities.pdf)
- **Authors:** **Yuxuan Zhu**, Antony Kellermann, Dylan Bowman, Philip Li, Akul Gupta, Adarsh Danda, Richard Fang, Daniel Kang et al.
- **Institution:** University of Illinois Urbana-Champaign (USNWR #35)
- **Venue:** **ICML 2025**
- **Relevance:** **Primary benchmark** for RedGrid's C1 claim. CVE-Bench's Table 5 exploration-failure data drives the Problem Statement. The 8-attack-type oracle is RedGrid's Validation Agent oracle. Primary metric targets (zero-day ≥25%, one-day ≥50%) are defined against CVE-Bench baselines.

---

### 2. PentestEval: Benchmarking LLM-based Penetration Testing with Modular and Stage-Level Design
- **Website:** [🌐 Link](https://arxiv.org/abs/2512.14233)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/02-pentesteval-benchmarking-llm-based-penetration-testing.pdf)
- **Authors:** **Ruozhao Yang**, Mingfei Cheng, Gelei Deng, Tianwei Zhang, Junjie Wang, Xiaofei Xie
- **Institution:** Singapore Management University (USNWR #616)
- **Venue:** **arXiv (Dec 2025)**
- **Relevance:** **Primary diagnostic benchmark.** ADM failure-mode data (+0.14 marginal gain) is the exact justification for C1. Ground-truth dependency annotations are the pilot-study gate (§15.1). UCB hyperparameter tuning is done on PentestEval. ADM score ≥0.50 is one of three primary metric targets.

---

### 3. Incalmo: An Autonomous LLM-assisted System for Red Teaming Multi-Host Networks
- **Website:** [🌐 Link](https://arxiv.org/abs/2501.16466)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/03-incalmo-an-autonomous-llm-assisted-system-for-red-teaming.pdf)
- **Code:** [GitHub](https://github.com/bsinger98/Incalmo)
- **Authors:** **Brian Singer**, Keane Lucas, Lakshmi Adiga, Meghna Jain, Lujo Bauer, Vyas Sekar
- **Institution:** Carnegie Mellon University (USNWR #22)
- **Venue:** **arXiv (Jan 2025, multiple revisions through Nov 2025)**
- **Relevance:** **Multi-host architecture template and MHBench provider.** RedGrid's Lateral-Movement Specialist five-verb API (`Scan`, `LateralMove`, `EscalatePrivilege`, `FindInfo`, `Exfiltrate`) is adopted directly from Incalmo. MHBench is Tier 4. Declarative task dispatch anti-hallucination pattern attributed to Incalmo. EL multi-host fields adapted from Incalmo's ESS.

---

### 4. What Makes a Good LLM Agent for Real-world Penetration Testing?
- **Website:** [🌐 Link](https://arxiv.org/abs/2602.17622)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/04-what-makes-a-good-llm-agent-for-real-world-penetration.pdf)
- **Authors:** **Gelei Deng**, Yi Liu, Yuekang Li, Ruozhao Yang, Xiaofei Xie, Jie Zhang, Han Qiu, Tianwei Zhang
- **Institution:** Nanyang Technological University (USNWR #28)
- **Venue:** **arXiv (Feb 2026)**
- **Relevance:** **Direct algorithmic prior-art foil for VDG.** EGATS (Evidence-Guided Attack Tree Search) uses UCB without formal prerequisites — the exact gap VDG closes. TDA fields (horizon, evidence confidence, context load) map directly to VDG node schema. "Finding 4: depth-first tunnel vision" drives UCB forced-enumeration in Team Manager. Frontier-model extended-thinking mode (§14) cites TDA-EGATS.

---

### 5. Co-RedTeam: Orchestrated Security Discovery and Exploitation with LLM Agents
- **Website:** [🌐 Link](https://arxiv.org/abs/2602.02164)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/05-co-redteam-orchestrated-security-discovery-and-exploitation.pdf)
- **Authors:** **Pengfei He**, Ash Fox, Lesly Miculicich, Stefan Friedli, Daniel Fabian, Burak Gokturk, Jiliang Tang, Chen-Yu Lee, Tomas Pfister, Long T. Le
- **Institution:** Google Cloud AI Research
- **Venue:** **arXiv (Feb 2026) — Google Cloud AI Research**
- **Relevance:** **Memory architecture source.** RedGrid's 3-tier Long-Term Memory (§10.2) is explicitly "Adapted from CO-REDTEAM (3-tier design)" — Vulnerability-Pattern / Strategy / Technical-Action tiers. Description-embedding skill retrieval (§10.5) is credited to CO-REDTEAM. Four-layer hierarchy pattern also attributed here.

---

### 6. AWE: Adaptive Agents for Dynamic Web Penetration Testing
- **Website:** [🌐 Link](https://www.ndss-symposium.org/ndss-paper/auto-draft-680/)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/06-awe-adaptive-agents-for-dynamic-web-penetration-testing.pdf)
- **Code:** [GitHub](https://github.com/stuxlabs/AWE)
- **Authors:** **Akshat Singh Jaswal**, Ashish Baghel
- **Institution:** Stux Labs
- **Venue:** **NDSS 2026**
- **Relevance:** **XSS Specialist methodology source.** RedGrid's XSS Specialist sub-FSM (§9.3) is explicitly labelled "AWE 5-Phase Pipeline." The 5 phases (canary → context → filter → mutation → DOM verification + webhook) are taken directly from AWE. WAF-adaptive branching in Phase 4 is C2's security-specific conditional branching contribution distinction.

---

### 7. AutoPT: How Far Are We from the End2End Automated Web Penetration Testing?
- **Website:** [🌐 Link](https://arxiv.org/abs/2411.01236)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/07-autopt-how-far-are-we-from-the-end2end-automated-web.pdf)
- **Authors:** **Benlong Wu**, Guoqiang Chen, Kejiang Chen, Xiuwei Shang, Jiapeng Han, Yanru He, Weiming Zhang, Nenghai Yu
- **Institution:** University of Science and Technology of China (USNWR #71)
- **Venue:** **arXiv (Nov 2024)**
- **Relevance:** **FSM-based Specialist and state-machine architecture rationale.** AutoPT's FSM (Penetration Testing State Machine) is the validated fix for multi-step chains — RedGrid's "each Specialist is internally a small deterministic sub-FSM" cites AutoPT. Auto-prompter's "AutoPT-style rule extraction" (§8.1) is explicit. GPT-4o-mini+FSM beating GPT-4o is key evidence for architecture-over-model-scale claim.

---

### 8. D-CIPHER: Dynamic Collaborative Intelligent Multi-Agent System with Planner and Heterogeneous Executors for Offensive Security
- **Website:** [🌐 Link](https://arxiv.org/abs/2502.10931)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/08-d-cipher-dynamic-collaborative-intelligent-multi-agent.pdf)
- **Authors:** **Meet Udeshi**, Minghao Shao, Haoran Xi, Nanda Rani, Kimberly Milner, Venkata Sai Charan Putrevu, Brendan Dolan-Gavitt, Prashanth Krishnamurthy, Farshad Khorrami, Ramesh Karri, Muhammad Shafique
- **Institution:** NYU Tandon (USNWR #53)
- **Venue:** **arXiv (Feb 2025)**
- **Relevance:** **Auto-prompter and context-pollution patterns.** RedGrid's Auto-prompter is explicitly described as "D-CIPHER pattern." D-CIPHER's Structured Handoff Bridge insight ("context flooding = architectural bottleneck") drives §8.2. One of three papers validating fresh-context-per-Specialist as context-pollution fix.

---

### 9. VulnBot: Autonomous Penetration Testing for a Multi-Agent Collaborative Framework
- **Website:** [🌐 Link](https://arxiv.org/abs/2501.13411)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/09-vulnbot-autonomous-penetration-testing-for-a-multi-agent.pdf)
- **Code:** [GitHub](https://github.com/KHenryAegis/VulnBot)
- **Authors:** **He Kong**, Die Hu, Jingguo Ge, Liangxiong Li, Tong Li, Bingzhen Wu
- **Institution:** Institute of Information Engineering, Chinese Academy of Sciences
- **Venue:** **arXiv (Jan 2025)**
- **Relevance:** **PTG (Penetration Task Graph) prior art.** VulnBot's PTG (directed acyclic graph for task dependencies) is the closest existing prior to VDG. EL is framed as unifying "Incalmo's ESS, PentestAgent's Env Info DB, cochise's PTT, VulnBot's PTG" (§10.1). One of three papers validating fresh context per Specialist.

---

### 10. PentestAgent: Incorporating LLM Agents to Automated Penetration Testing
- **Website:** [🌐 Link](https://arxiv.org/abs/2411.05185)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/10-pentestagent-incorporating-llm-agents-to-automated.pdf)
- **Code:** [GitHub](https://github.com/GH05TCREW/PentestAgent)
- **Authors:** **Xiangmin Shen**, Lingzhi Wang, Zhenyuan Li, Yan Chen, Wencheng Zhao, Dawei Sun, Jiashui Wang
- **Institution:** Northwestern University (USNWR #9)
- **Venue:** **AsiaCCS 2025**
- **Relevance:** **Env Info DB precedent and direct baseline.** PentestAgent's Env Info DB is one of four precursors to RedGrid's EL (§10.1). Evaluated in PentestEval (3% autonomous success rate) — a direct baseline. RAG for knowledge injection to Specialists (§8.3) relates to PentestAgent's RAG integration.

---

### 11. PentestGPT: Evaluating and Harnessing Large Language Models for Automated Penetration Testing
- **Website:** [🌐 Link](https://arxiv.org/abs/2308.06782)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/11-pentestgpt-evaluating-and-harnessing-large-language-models-for-automated-penetration-testing.pdf)
- **Authors:** **Gelei Deng**, Yi Liu, Víctor Mayoral-Vilches, Peng Liu, Yuekang Li, Yuan Xu, Tianwei Zhang, Yang Liu, Martin Pinzger, Stefan Rass
- **Institution:** Nanyang Technological University (USNWR #28)
- **Venue:** **USENIX Security 2024**
- **Relevance:** **Context-loss failure mode and canonical architecture predecessor.** PentestGPT Finding 4 ("depth-first tunnel vision"; long-session context inflation) directly motivates FullCompact (§8.1) and UCB forced-enumeration (§8.2). PentestGPT 13-machine HTB+VulnHub set is Tier 6. §13.3 explicitly credits PentestGPT for establishing fresh-context fix.

---

### 12. Teams of LLM Agents Can Exploit Zero-Day Vulnerabilities
- **Website:** [🌐 Link](https://arxiv.org/abs/2406.01637)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/12-teams-of-llm-agents-can-exploit-zero-day-vulnerabilities.pdf)
- **Authors:** **Yuxuan Zhu**, Antony Kellermann, Akul Gupta, Philip Li, Richard Fang, Rohan Bindu, Daniel Kang
- **Institution:** University of Illinois Urbana-Champaign (USNWR #35)
- **Venue:** **arXiv (Jun 2024) — University of Illinois**
- **Relevance:** **Zero-day benchmark and team dispatch architecture foil.** HPTSA's 14-CVE zero-day suite is Tier 0b. Primary metric target "zero-day pass@1 ≥ 25% vs. HPTSA's ~21%" makes HPTSA the direct C1 performance baseline. HPTSA's flat team dispatch without prerequisite modeling is the first half of the gap RedGrid closes.

---

### 13. LLM Agents Can Autonomously Exploit One-Day Vulnerabilities
- **Website:** [🌐 Link](https://arxiv.org/abs/2404.08144)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/13-llm-agents-can-autonomously-exploit-one-day-vulnerabilities.pdf)
- **Authors:** **Richard Fang**, Rohan Bindu, Akul Gupta, Daniel Kang
- **Institution:** University of Illinois Urbana-Champaign (USNWR #35)
- **Venue:** **arXiv (Apr 2024) — University of Illinois**
- **Relevance:** **Tier 0 floor benchmark and four failure-class source.** Fang et al. 15-vulnerability sandbox provides the regression floor (GPT-4's 73.3% pass@5). The four GPT-4 failure classes RedGrid must close (AuthBypass, JS attacks, Hard SQLi, XSS+CSRF chains) come from this paper. One-day mode flag in §8.1 defined as "CVE hint provided per Fang et al."

---

### 14. PrediQL: Automated Testing of GraphQL APIs with LLMs
- **Website:** [🌐 Link](https://arxiv.org/abs/2510.10407)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/14-prediql-automated-testing-of-graphql-apis-with-llms.pdf)
- **Authors:** **Shaolun Liu**, Sina Marefat, Omar Tsai, Yu Chen, Zecheng Deng, Jia Wang, Mohammad A. Tayebi
- **Institution:** Simon Fraser University, Canada
- **Venue:** **WWW 2026**
- **Relevance:** **GraphQL Specialist methodology and Tier 3 benchmark.** RedGrid's GraphQL Specialist (§9.4) uses PrediQL's Thompson-Sampling bandit across 8 strategy arms, FAISS-backed trace retrieval, and self-correction loop verbatim. Output schema `{vulnerability_type, severity, confidence_score, evidence_snippet}` "adopted verbatim from PrediQL." PrediQL's 6-API suite is Tier 3.

---

## `T2 — Direct Evidence / Gap Justification (Papers 15–22)`

### 15. BountyBench: Dollar Impact of AI Agent Attackers and Defenders on Real-World Cybersecurity Systems
- **Website:** [🌐 Link](https://arxiv.org/abs/2505.15216)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/15-bountybench-dollar-impact-of-ai-agent-attackers-and-defenders-on-real-world-cybersecurity-systems.pdf)
- **Code:** [bountybench.github.io](https://bountybench.github.io)
- **Authors:** **Andy K. Zhang**, Joey Ji, Celeste Menders, Riya Dulepet, Thomas Qin, Ron Y. Wang et al.
- **Institution:** Stanford University (USNWR #3)
- **Venue:** **NeurIPS 2025 (Datasets and Benchmarks Track) — Stanford / UC Berkeley**
- **Relevance:** **Production-system evaluation layer and cost-per-exploit metric source.** BountyBench is Tier 5 (hardest tier, 25 real production systems). Introduced the `cost_per_run / pass@1_rate` metric RedGrid elevates to co-primary metric (§10.3, §12.2). "No dollar-cost reporting standard" gap in §11 is attributed to all prior papers except BountyBench.

---

### 16. HackWorld: Evaluating Computer-Use Agents on Exploiting Web Application Vulnerabilities
- **Website:** [🌐 Link](https://arxiv.org/abs/2510.12200)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/16-hackworld-evaluating-computer-use-agents-on-exploiting-web.pdf)
- **Code:** [GitHub](https://github.com/GUI-Agent/HackWorld)
- **Authors:** **Xiaoxue Ren**, Penghao Jiang, Kaixin Li, Zhiyong Huang, Xiaoning Du, Jiaojiao Jiang, Zhenchang Xing, Jiamou Sun, Terry Yue Zhuo
- **Institution:** Zhejiang University (USNWR #45)
- **Venue:** **ICLR 2026**
- **Relevance:** **Exploration failure-mode diagnostics and default-scan-depth finding.** HackWorld's finding that "default scan depth is itself a top-4 failure mode" directly motivates RedGrid's Recon Specialist running `nmap -p- -sV` (full-surface scan, §9.1). HackWorld's 36-challenge benchmark is in Tier 2b. Independently validates multi-step attack planning failures supporting FSM Specialist design.

---

### 17. Multi-Agent Penetration Testing AI for the Web
- **Website:** [🌐 Link](https://arxiv.org/abs/2508.20816)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/17-multi-agent-penetration-testing-ai-for-the-web.pdf)
- **Authors:** **Isaac David**, Arthur Gervais
- **Institution:** University College London (USNWR #7)
- **Venue:** **arXiv (Aug 2025)**
- **Relevance:** **Single-attempt validation foil and XBOW benchmark context.** RedGrid's Validation Agent Diagnosis-Adapt-Cap loop (§8.4) is explicitly contrasted with "MAPTA's design: one oracle check, binary pass/fail." MAPTA's 104-challenge XBOW benchmark is Tier 2b. Early-stopping analysis (~40 tool calls, $0.30/challenge) informs RedGrid's Early Stopping Heuristic (§10.7).

---

### 18. Automated Penetration Testing with LLM Agents and Classical Planning
- **Website:** [🌐 Link](https://arxiv.org/abs/2512.11143)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/18-automated-penetration-testing-with-llm-agents-and-classical.pdf)
- **Authors:** **Lingzhi Wang**, Xinyi Shi, Ziyu Li, Yi Jiang, Shiyu Tan, Yuhao Jiang, Junjie Cheng, Wenyuan Chen, Xiangmin Shen, Zhenyuan Li, Yan Chen
- **Institution:** Northwestern University (USNWR #9)
- **Venue:** **arXiv (Dec 2025)**
- **Relevance:** **Classical planning foil and declarative API validation.** CHECKMATE is cited in §3 C1: "CHECKMATE uses PDDL but cannot handle non-deterministic zero-day discovery." Declarative task API anti-hallucination design (§8.2) is attributed to Incalmo and CHECKMATE. "Hybrid Classical-Planning + VDG" was removed (§4) partly because CHECKMATE revealed PDDL's zero-day limitations.

---

### 19. Voyager: An Open-Ended Embodied Agent with Large Language Models
- **Website:** [🌐 Link](https://arxiv.org/abs/2305.16291)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/19-voyager-an-open-ended-embodied-agent.pdf)
- **Authors:** **Guanzhi Wang**, Yuqi Xie, Yunfan Jiang, Ajay Mandlekar, Chaowei Xiao, Yuke Zhu, Linxi Fan, Anima Anandkumar
- **Institution:** NVIDIA / Caltech / Stanford
- **Venue:** **NeurIPS 2023**
- **Relevance:** **Skill library and description-embedding retrieval source.** RedGrid's Skill Library (§10.5) and cross-session memory (C2) are explicitly framed as adapting "Voyager's description-embedding retrieval for the security domain." The security-specific C2 distinction (conditional branching for WAF responses) is stated as the difference from Voyager's deterministic game-world skills (§10.2).

---

### 20. RESTler: Stateful REST API Fuzzing
- **Website:** [🌐 Link](https://doi.org/10.1145/3213846.3213851)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/20-restler-stateful-rest-api-fuzzing.pdf)
- **Authors:** **Vaggelis Atlidakis**, Patrice Godefroid, Marina Polishchuk
- **Institution:** Columbia University / Microsoft
- **Venue:** **ICSE 2019**
- **Relevance:** **Producer–consumer dependency inference methodology.** RESTler's dependency inference is explicitly adopted by the GraphQL Specialist (§9.4 "GraphQL analog of RESTler's dependency inference") and Team Manager's dependency-inference logic. Sequence bucketization for dedup in Validation Agent (§8.4) attributed to RESTler. Architecture states "RESTler's core techniques are methodologically reusable and are adopted internally."

---

### 21. Can LLMs Hack Enterprise Networks? Autonomous Assumed Breach Penetration-Testing Active Directory Networks
- **Website:** [🌐 Link](https://dl.acm.org/doi/abs/10.1145/3766895)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/21-can-llms-hack-enterprise-networks-autonomous-assumed-breach.pdf)
- **Code:** [GitHub](https://github.com/andreashappe/cochise)
- **Authors:** **Andreas Happe**, Jürgen Cito
- **Institution:** TU Wien (USNWR #334)
- **Venue:** **TOSEM 2025 (ACM Transactions on Software Engineering and Methodology)**
- **Relevance:** **Active Directory precedent and PTT precursor.** Cochise's PTT is one of four precursors to EL (§10.1 "cochise's PTT"). "Going down rabbit holes" and "difficulty transferring info between planning and execution modules" failure patterns from cochise are exactly what RedGrid's FullCompact and Structured Handoff Bridge address.

---

### 22. AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation
- **Website:** [🌐 Link](https://arxiv.org/abs/2308.08155)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/22-autogen-next-gen-llm-multi-agent-conversations.pdf)
- **Authors:** **Qingyun Wu**, Gagan Bansal, Jieyu Zhang, Yiran Wu, Beibin Li, Erkang Zhu, Li Jiang, Xiaoyun Zhang, Shaokun Zhang, Jiale Liu, Ahmed Awadallah, Ryen W. White, Doug Burger, Chi Wang
- **Institution:** Penn State University (USNWR #130)
- **Venue:** **arXiv (Aug 2023 / 2024)**
- **Relevance:** **Execution Agent split source.** RedGrid's Layer 4 Execution Agent — "strict separation of command generation (LLM) from command execution (deterministic wrapper)" — is explicitly described as "the AutoGen AssistantAgent/UserProxyAgent split, generalized" (§8.4). Core safety and anti-hallucination pattern applied at every Specialist invocation.

---

## `T4 — Architectural Inspiration, Non-Security Domain (Paper 23)`

### 23. Reflexion: Language Agents with Verbal RL
- **Website:** [🌐 Link](https://arxiv.org/abs/2303.11366)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/23-reflexion-language-agents-with-verbal-rl.pdf)
- **Authors:** **Noah Shinn**, Federico Cassano, Edward Berman, Ashwin Gopinath, Karthik Narasimhan, Shunyu Yao
- **Institution:** Northeastern University (USNWR #179)
- **Venue:** **NeurIPS 2023**
- **Relevance:** **Episodic memory and verbal reflection inspiration.** Reflexion's verbal reinforcement (textual failure reflections in episodic memory) is the conceptual basis for RedGrid's Episodic Failure Memory (§10.4). The distinction: Reflexion is general-purpose while RedGrid's failure memory has a structured security-domain schema indexed by `{vuln-class, tool, target-pattern, error-class}`.

---

## `T3 — Benchmark Surfaces + Early Empirical Anchors (Papers 24–26)`

### 24. Cybench: A Framework for Evaluating Cybersecurity Capabilities and Risks of Language Models
- **Website:** [🌐 Link](https://arxiv.org/abs/2408.08926)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/24-cybench-a-framework-for-evaluating-cybersecurity.pdf)
- **Code:** [cybench.github.io](https://cybench.github.io/)
- **Authors:** **Andy K. Zhang**, Neil Perry, Riya Dulepet, Joey Ji, Celeste Menders, Justin W. Lin et al.
- **Institution:** Stanford University (USNWR #3)
- **Venue:** **ICLR 2025**
- **Relevance:** **Cybersecurity CTF benchmark (Tier 2b).** Cybench's 40 professional-level CTF tasks form part of Tier 2b for cross-benchmark generalization (§12.1). Cybench is the only open-source benchmark used by UK/US AISI for pre-deployment evaluation, giving it institutional weight. D-CIPHER results are on Cybench, creating comparison points.

---

### 25. LLM Agents can Autonomously Hack Websites
- **Website:** [🌐 Link](https://arxiv.org/abs/2402.06664)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/25-llm-agents-can-autonomously-hack-websites.pdf)
- **Authors:** **Richard Fang**, Rohan Bindu, Akul Gupta, Qiusi Zhan, Daniel Kang
- **Institution:** UIUC
- **Venue:** **arXiv (Feb 2024) — University of Illinois**
- **Relevance:** **Earliest GPT-4 web-hacking proof-of-concept.** The 73.3% pass@5 and four failure classes originate from this paper's lineage. The simple ReAct agent (GPT-4 + tools + documents + history) with 85 lines of code is the simplest baseline RedGrid's four-layer hierarchy must demonstrably surpass. Cited in §12.1 Tier 0.

---

### 26. Getting pwn'd by AI: Penetration Testing with Large Language Models
- **Website:** [🌐 Link](https://dl.acm.org/doi/abs/10.1145/3611643.3613083)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/26-getting-pwnd-by-ai-penetration-testing-with-large-language.pdf)
- **Code:** [GitHub](https://github.com/ipa-lab/hackingBuddyGPT)
- **Authors:** **Andreas Happe**, Jürgen Cito
- **Institution:** TU Wien (USNWR #334)
- **Venue:** **ESEC/FSE 2023**
- **Relevance:** **Earliest demonstration of LLM-assisted pentesting and multi-step failure finding.** "Single-step exploits work even with simple loops; multi-step chains are exactly where unstructured agents fail" is explicitly cited in §8.3 as justification for FSM-based Specialists ("Getting Pwnd by AI: single-step exploits work even with simple loops; multi-step chains are exactly where unstructured agents fail"). FSE is CCF-A.

---

## `T5 — Survey / General Context (Papers 27–29)`

### 27. Forewarned is Forearmed: A Survey on LLM-based Agents in Autonomous Cyberattacks
- **Website:** [🌐 Link](https://arxiv.org/abs/2505.12786)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/27-forewarned-is-forearmed-a-survey-on-llm-based-agents-in.pdf)
- **Authors:** **Minrui Xu**, Jiani Fan, Xinyu Huang, Conghao Zhou, Jiawen Kang, Dusit Niyato, Shiwen Mao, Zhu Han, Xuemin (Sherman) Shen, Kwok-Yan Lam
- **Institution:** Nanyang Technological University (USNWR #28)
- **Venue:** **arXiv (May 2025)**
- **Relevance:** Comprehensive survey on offensive LLM agent capabilities across all attack stages — recon, exploitation, lateral movement, persistence. Provides field-level threat-landscape framing. Most aligned survey with RedGrid's scope. No direct mechanism attribution in architecture.md.

---

### 28. MetaGPT: Meta Programming for Multi-Agent Frameworks
- **Website:** [🌐 Link](https://arxiv.org/abs/2308.00352)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/28-metagpt-meta-programming-for-multi-agent-frameworks.pdf)
- **Authors:** **Sirui Hong**, Mingchen Zhuge, Jiaqi Chen, Xiawu Zheng, Yuheng Cheng, Ceyao Zhang, Jinlin Wang, Zili Wang, Steven Ka Shing Yau, Zijuan Lin, Liyang Zhou, Chenyu Ran, Lingfeng Xiao, Chenglin Wu, Jürgen Schmidhuber
- **Institution:** DeepWisdom
- **Venue:** **ICLR 2024**
- **Relevance:** SOP-based assembly-line multi-agent design — specialized roles with structured intermediate outputs. The declarative task API philosophy in §8.2 echoes MetaGPT's structured output approach. Establishes SOPs for agent collaborations, mapping to VAPT agent roles (Recon, Scan, Exploit) in RedGrid. General multi-agent framework context.

---

### 29. A Survey on Large Language Model based Autonomous Agents
- **Website:** [🌐 Link](https://arxiv.org/abs/2308.11432)
- **Paper:** [📄 Local PDF](../downloaded-paper-curated/29-a-survey-on-large-language-model-based-autonomous-agents.pdf)
- **Authors:** **Lei Wang**, Chen Ma, Xueyang Feng, Zeyu Zhang, Hao Yang, Jingsen Zhang, Zhiyuan Chen, Jiakai Tang, Xu Chen, Yankai Lin, Wayne Xin Zhao, Zhewei Wei, Ji-Rong Wen
- **Institution:** Renmin University of China
- **Venue:** **Frontiers of Computer Science 2024**
- **Relevance:** Broadest-scope paper in the corpus. Establishes the canonical 4-module agent taxonomy (Profile · Memory · Planning · Action) used as background vocabulary in every agent paper. Provides general agent framework context for RedGrid's architecture. Lowest direct architectural relevance, highest general-context value.

---
