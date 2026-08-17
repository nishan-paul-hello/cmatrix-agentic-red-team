# CMatrix: LLM Orchestrated Multi-Agent Framework for Autonomous VAPT
## Survey Paper — Master Index

> **Purpose:** Systematic literature review of 29 curated research papers to derive the optimal architecture, benchmarks, and design principles for **CMatrix** — an LLM-orchestrated multi-agent framework for autonomous Vulnerability Assessment and Penetration Testing (VAPT).
>
> **How this works:** Each paper gets its own dedicated key-takeaways file in the `survey-notes/` subfolder (same filename as the original paper). This master index tracks progress and will accumulate the consolidated CMatrix architecture after all papers are reviewed.

---

## 📚 Paper Tracker

| # | Paper | Notes File | Status |
|---|-------|------------|--------|
| 01 | LLM Agents can Autonomously Exploit One-Day Vulnerabilities | [📄 notes](survey-notes/01-llm-agents-can-autonomously-exploit-one-day-vulnerabilities.md) | ✅ Done |
| 02 | Teams of LLM Agents can Exploit Zero-Day Vulnerabilities | [📄 notes](survey-notes/02-teams-of-llm-agents-can-exploit-zero-day-vulnerabilities.md) | ✅ Done |
| 03 | Multi-Agent Penetration Testing AI for the Web | [📄 notes](survey-notes/03-multi-agent-penetration-testing-ai-for-the-web.md) | ✅ Done |
| 04 | AWE: Adaptive Agents for Dynamic Web Penetration Testing | [📄 notes](survey-notes/04-awe-adaptive-agents-for-dynamic-web-penetration-testing.md) | ✅ Done |
| 05 | AutoPT: How Far Are We from End2End Automated Web Pentesting | [📄 notes](survey-notes/05-autopt-how-far-are-we-from-the-end2end-automated-web.md) | ✅ Done |
| 06 | HackWorld: Evaluating Computer Use Agents on Exploiting Web | [📄 notes](survey-notes/06-hackworld-evaluating-computer-use-agents-on-exploiting-web.md) | ✅ Done |
| 07 | PrediQL: Automated Testing of GraphQL APIs with LLMs | [📄 notes](survey-notes/07-prediql-automated-testing-of-graphql-apis-with-llms.md) | ✅ Done |
| 08 | RESTler: Stateful REST API Fuzzing | [📄 notes](survey-notes/08-restler-stateful-rest-api-fuzzing.md) | ✅ Done |
| 09 | Getting Pwnd by AI: Penetration Testing with LLMs | [📄 notes](survey-notes/09-getting-pwnd-by-ai-penetration-testing-with-large-language.md) | ✅ Done |
| 10 | PentestGPT: Evaluating and Harnessing LLMs for Automated Pentest | [📄 notes](survey-notes/10-pentestgpt-evaluating-and-harnessing-large-language-models-for-automated-penetration-testing.md) | ✅ Done |
| 11 | What Makes a Good LLM Agent for Real-World Penetration Testing | [📄 notes](survey-notes/11-what-makes-a-good-llm-agent-for-real-world-penetration.md) | ✅ Done |
| 12 | VulnBot: Autonomous Penetration Testing for a Multi-Agent System | [📄 notes](survey-notes/12-vulnbot-autonomous-penetration-testing-for-a-multi-agent.md) | ✅ Done |
| 13 | PentestAgent: Incorporating LLM Agents to Automated Pentesting | [📄 notes](survey-notes/13-pentestagent-incorporating-llm-agents-to-automated.md) | ✅ Done |
| 14 | Automated Penetration Testing with LLM Agents and Classical Planning | — | ⏳ Pending |
| 15 | D-CIPHER: Dynamic Collaborative Intelligent Multi-Agent | — | ⏳ Pending |
| 16 | InCALMo: Autonomous LLM-Assisted System for Red Teaming | — | ⏳ Pending |
| 17 | Can LLMs Hack Enterprise Networks? Autonomous Assumed Breach | — | ⏳ Pending |
| 18 | Co-RedTeam: Orchestrated Security Discovery and Exploitation | — | ⏳ Pending |
| 19 | AutoGen: Next-Gen LLM Multi-Agent Conversations | — | ⏳ Pending |
| 20 | MetaGPT: Meta-Programming for Multi-Agent Frameworks | — | ⏳ Pending |
| 21 | Voyager: An Open-Ended Embodied Agent | — | ⏳ Pending |
| 22 | Reflexion: Language Agents with Verbal RL | — | ⏳ Pending |
| 23 | CyBench: A Framework for Evaluating Cybersecurity | — | ⏳ Pending |
| 24 | PentestEval: Benchmarking LLM-Based Penetration Testing | — | ⏳ Pending |
| 25 | BountyBench: Dollar Impact of AI Agent Attackers and Defenders | — | ⏳ Pending |
| 26 | Forewarned is Forearmed: A Survey on LLM-Based Agents in Security | — | ⏳ Pending |
| 27 | A Survey on LLM-Based Autonomous Agents | — | ⏳ Pending |
| 28 | CVE-Bench: A Benchmark for AI Agents Exploiting Real-World Web Apps | — | ⏳ Pending |
| 29 | LLM Agents can Autonomously Hack Websites | — | ⏳ Pending |

---

## 🏗️ Consolidated CMatrix Architecture
*(This section will be built up as papers are reviewed)*

### Architectural Signals Collected So Far

| Layer | Signal | Source |
|-------|--------|--------|
| Agent Core | ReAct loop (Reason → Act → Observe) | Paper 01 |
| Context / RAG | CVE/NVD description retrieval before task launch | Paper 01 |
| Tool Suite | Browser (Playwright) + Shell + Search + FileIO + CodeExec + sqlmap + nmap -p- -sV + ffuf + Xray + Nikto + WhatWeb + Burp Collaborator | Papers 01–06 |
| Memory | SQLite (structured state: filter/payload history) + FAISS vector store (semantic trace retrieval) | Papers 01, 02, 04, 05, 07 |
| Learning from Failures | Self-correction: inject (failed_call, error_message) pairs into next agent prompt as supervision | Paper 07 |
| Adaptive Strategy | Thompson Sampling bandit over prompt strategies; reward = meaningful new coverage | Paper 07 |
| Orchestration | PSM-inspired FSM: Recon → Vuln Prioritization (Rule) → Specialist → PoC Assembly → Validation (Rule+Agent) | Papers 02, 03, 05 |
| Control Flow | Rule States (zero LLM cost) for filtering + Agent States for reasoning — deterministic state transitions | Paper 05 |
| Loop Prevention | Hard retry threshold: N failures → jump to next vuln candidate; never exhaust budget on one PoC | Paper 05 |
| Closed Observation Loop | After every tool call, a parsing step extracts relevant findings before next LLM action | Paper 06 |
| Session Management | Foundation Layer persists auth state: cookies, CSRF tokens, JWT, session IDs | Paper 06 |
| Recon Baseline | nmap -p- -sV + WhatWeb + GraphQL introspection before any exploit attempt | Papers 05, 06, 07 |
| Tool Output Normalization | AX-compliant JSON wrappers; vulnerability findings output as structured JSON (type, severity, confidence, evidence, fix) | Papers 06, 07 |
| Specialists | Per-vuln-class agents with deterministic structured pipelines; including GraphQL specialist (introspection + dependency graph + depth/batch testing) | Papers 02, 04, 07 |
| XSS Specialist | 5-phase pipeline: canary injection → context analysis → filter probing → LLM mutation → Playwright verification | Paper 04 |
| Blind SQLi Specialist | Timing-oracle binary search loop: baseline → SLEEP probes → bit extraction → memory-guided retry | Paper 04 |
| GraphQL Specialist | Introspection → dependency graph → depth-abuse + batch-bypass + IDOR chain testing | Paper 07 |
| REST Specialist | Producer-consumer dependency inference from OpenAPI/Swagger spec; dynamic 2xx feedback pruning; RandomWalk strategy; 500-error oracle | Paper 08 |
| Garbage Collector | Periodic DELETE of aging test resources to avoid quota exhaustion during long-running missions | Paper 08 |
| Auth Hook | Periodic token-refresh script execution to handle short-lived OAuth/JWT tokens during fuzzing | Paper 08 |
| Bug Deduplication | Bucketize findings by shortest suffix match of triggering sequence — avoid duplicate reports | Paper 08 |
| Domain Knowledge | 5–6 curated documents injected per specialist at task start | Paper 02 |
| Execution Isolation | Per-mission Docker container (ephemeral, shared by all agents in a mission) | Paper 03 |
| Context Isolation | Separate LLM context per agent state; shared Docker state | Papers 03, 05 |
| PoC Validation | Mandatory Validation Agent: concrete PoC execution + expected oracle/verification string match | Papers 03, 05 |
| Browser Verification | Playwright headless Chromium with DOM mutation + console log confirmation | Papers 02, 04 |
| Output Management | HTML pre-processor (strip rendering tags) + inter-state summary (not full history) | Papers 01, 02, 05 |
| Cross-Agent Synthesis | Team Manager synthesizes results across agent runs, refines next dispatch | Paper 02 |
| Recon Layer | Endpoint fuzzing + form parsing + tech fingerprinting + Xray CVE scanner + full nmap + GraphQL introspection | Papers 02–07 |
| Cost Accounting | Per-mission: input/output/cached/reasoning tokens + tool calls + wall-clock time + USD | Paper 03 |
| Early Stopping | Stop at: 40+ tool calls OR $0.30 cost OR 300s without progress; OR retry threshold exceeded | Papers 03, 05 |
| Model Selection | Empirically ablate cheap models first; pipeline architecture dominates model size (confirmed in 3 papers) | Papers 04, 05, 06, 07 |
| Observability | Pass@1, Pass@5, cost-per-exploit, refusal rate, tokens-per-solve, 8-failure-mode QA gate, coverage % | Papers 01–07 |
| Verification Prompt Framing | Replace all offensive language in prompts with audit/verification framing: "verification payload" not "exploit", "confirmation commands" not "attack"; append "do not ask questions or provide judgments" to all command-gen system prompts | Paper 09 |
| Protocol Log Anti-Hallucination | Per-mission execution log of (command, stdout, stderr) tuples; Validation Agent receives raw log, not LLM narrative summaries — distinguishes training-data priors from observed-system reasoning | Paper 09 |
| Rabbit-Hole Counter | Per-specialist command-diversity check: if last K=5 consecutive tool calls target same resource (URL prefix, file path, user), force FSM transition to next candidate — prevents tunnel-vision budget exhaustion | Paper 09 |
| Reflection Filter | After every tool call: raw_output → GPT-4o-mini (ReflectionFilter) → structured finding JSON or null; only non-null findings enter inter-state summary — prevents context flooding with shell noise | Paper 09 |
| MITRE ATT&CK Planner Seed | Inject applicable ATT&CK technique IDs (T1190, T1059, T1078, T1110, T1212 for web targets) into Planner prompt as seed list; Planner reasons over this list to produce Team Manager dispatch priority queue | Paper 09 |
| Pluggable Model Backend | CMatrix model config supports OpenAI API, Anthropic API, local Ollama backends — allows data-sensitive engagements to run fully local without cloud data exfiltration | Paper 09 |
| PTT JSON State Object | Pentesting Task Tree stored as structured JSON (target, phases, findings, candidate_next_tasks, status per node); injected as fixed token chunk into every Team Manager prompt — never the rolling conversation history | Paper 10 |
| Session Isolation: Reason vs Generate | Team Manager (Reasoning) = session A, persistent; Specialist (Generation) = session B, fresh per sub-task; session B receives only PTT context + sub-task; its output feeds back to session A only as structured finding update — never raw conversation | Paper 10 |
| Two-Step CoT in Generation | Specialist prompt always: Step 1 expand sub-task to numbered step list → Step 2 convert each step to concrete terminal command; never jump directly from sub-task to command — reduces false command generation by forcing explicit reasoning | Paper 10 |
| Six-Failure-Mode QA Gate | Track per-mission: context_loss_events, false_command_rate, deadlock_events, false_output_parse_rate, exploit_craft_failures, hallucination_events; report in observability dashboard alongside Pass@1 and cost | Paper 10 |
| Parsing Module: Four Input Categories | Reflection Filter uses category-specific prompts: (1) user intent, (2) security tool output, (3) raw HTTP response, (4) source code; category selected by classifier before compression — generic single-prompt compression is insufficient | Paper 10 |
| Candidate Task Enumeration before Selection | After each specialist completes, Team Manager enumerates all PTT leaf candidates, scores each (severity × confidence × surface coverage), selects top candidate explicitly — never implicit next-task from LLM continuation | Paper 10 |
| Jailbreak Prompt Library | Maintain categorized jailbreak variants: (a) verification/audit framing, (b) certified-pentester role context, (c) semantic substitutions; refusal rate tracked as first-class metric; high refusal triggers automatic prompt variant selection | Papers 09, 10 |
| EGATS Attack Tree | Replace PTT with MCTS-style Evidence-Guided Attack Tree: each node stores (promise_φ, TDI_δ, findings, status); UCB selection: UCB(n)=φ(n)+√2·√(lnN/N_n)-0.5·δ(n); promise backpropagation after every tool call: φ∄0.7φ+0.3·r(outcome); prune TDI>0.8 after 3 attempts | Paper 11 |
| TDA / Task Difficulty Index | TDI=0.3H+0.3(1-E)+0.2C+0.2(1-S): H=normalized horizon estimate, E=mean evidence confidence (verified=1.0/confirmed=0.8/plausible=0.5/speculative=0.3), C=context fraction consumed, S=Laplace-smoothed branch success rate; TDI>0.6→BFS recon, <0.3→DFS exploit, 0.3-0.6→LLM_DECIDE | Paper 11 |
| State Store: Five Entity Types | External persistent DB (not in-context): hosts, services, credentials, sessions, vulnerabilities; each entry timestamped + linked to discovery node; credentials auto-propagate to hypothesis nodes with matching preconditions; enables cross-phase credential chains | Paper 11 |
| Context Load Threshold | Track context tokens per session: 0-40%=full injection, 40-70%=compress sibling summaries, 70%+=aggressive prune older path segments; empirical: 94%→78% accuracy at 60% load, 78%→61% at 80% load; never exceed 70% without summarization | Paper 11 |
| Typed Tool Interfaces | Each tool: input_schema+output_schema+pre/postconditions+validation; input validation catches malformed calls before execution; structured output eliminates regex parsing; 38 tools across 6 categories (recon, web exploit, network exploit, creds, AD, privesc) | Paper 11 |
| Skill Compositions | Multi-tool attack patterns encoding expert knowledge: KerberoastingSkill, SQLiExtractionSkill, PrivEscSkill; fallback logic when preferred tool fails; aggregate results from multiple tools into coherent findings | Paper 11 |
| Human Escalation Protocol | When TDI>0.8 on all remaining branches after k_min=3 attempts → ESCALATE_TO_OPERATOR: report PTT state + pruned branches + TDI history + last 5 tool calls; operator provides hint/cred/manual step; resume EGATS from new operator-added node | Paper 11 |
| Thinking Mode Discipline | Use extended reasoning (thinking mode) only for Team Manager TDA/UCB decisions; use standard mode for Specialist command generation; 6-10pp gain from thinking mode but architectural gap (30pp) does NOT close — thinking mode complements architecture, does not replace it | Paper 11 |
| PTG DAG State Storage | Store mission state as a Penetration Task Graph (PTG): JSON DAG where each node = {id, deps[], instruction, action_type, command, result, finished, success}; FSM "current state" = set of unfinished nodes whose deps are all succeeded; unifies PTG with PSM FSM from Paper 05 | Paper 12 |
| Summarizer Bridge | After every specialist phase completes, invoke SummarizePhase() to distil raw tool outputs into compact JSON handoff {findings, shell_state, key_vulns, next_phase_hints}; this JSON (NOT full conversation history) seeds the next specialist's context; removing Summarizer degrades subtask success by 51% | Papers 05, 12 |
| Merge Plan Algorithm | On PTG node failure + LLM plan regeneration: retain all success_status=true nodes from old PTG, integrate new nodes around them; never re-execute completed nodes; preserves progress across error-recovery replanning cycles | Paper 12 |
| Output Truncation Gate | After every tool execution: if len(output) > 8000 chars → invoke cheap LLM (GPT-4o-mini) to extract key facts before passing to Planner; prevents #1 failure mode (session context loss = 42% of all failures in VulnBot empirical study) | Paper 12 |
| Two-Stage RAG Retrieval | Stage 1: FAISS cosine similarity top-20, filter score > 0.5; Stage 2: cross-encoder reranker (bce-reranker-base-v1 or ms-marco-MiniLM), select top-3; chunk knowledge docs at 750 words; sources: HackTricks + HackingArticles + per-mission successful task history | Papers 01, 02, 04, 07, 12 |
| PTG action_type Field | Every PTG task node carries action_type: "auto" | "escalate"; when Validation Agent determines step requires human judgment (captcha, MFA, ambiguous GUI), set action_type=escalate and emit structured human-in-the-loop request; complements TDA-triggered global escalation from Paper 11 | Papers 11, 12 |
| Two-Tier Knowledge DB | Maintain two separate knowledge stores: Tier 1 Coarse DB {service, version → [{cve_id, vuln_type, version_range, epss_score}]} and Tier 2 Procedure DB {cve_id → [{repo_url, effect, version_req, runtime_deps, confidence}]}; Planner queries Tier 1 first, Execution Agent queries Tier 2 only for confirmed CVEs; never mix attack surface discovery with exploit detail retrieval | Paper 13 |
| Autonomous Live Search Agent | Before exploitation: Search Agent runs two-round hierarchical web search: Round 1 queries Google+NVD+Snyk for {service} {version} CVE → populates Coarse DB; Round 2 queries GitHub+ExploitDB for {cve_id} exploit → populates Procedure DB; solves LLM training-cutoff problem — always working from current CVE data | Paper 13 |
| Four-Technique Prompt Discipline | Every specialist prompt must have all four layers in order: (1) Role-play (bypass safety + scope), (2) CoT (explicit step decomposition + stop condition), (3) RAG (knowledge retrieval tool), (4) Structured Output (JSON schema with field spec + example); missing any layer causes pipeline failure | Papers 10, 12, 13 |
| EPSS-Score CVE Prioritization | When multiple CVEs found for a service, rank by EPSS score (exploitation probability) NOT CVSS severity; formula: priority = epss_score × version_confidence; CVSS impact ignored for planning (relevant only for report severity); PentestAgent benchmark mean EPSS=79.58, median=97.19 confirms EPSS produces realistic targets | Paper 13 |
| Exploit Fallback Chain | Every CVE in Procedure DB must have ≥2 exploit entries ranked by confidence; if Execution Agent hits same-error-twice stop condition on Exploit 1, automatically advance to Exploit 2; if all exploits for a CVE fail, mark attack surface exhausted in PTG and advance to next CVE — graceful degradation path | Papers 11, 13 |
| Environmental Info DB | Shared queryable mission-state store accessible by all specialists: {target_ip, open_ports, services{port: version}, credentials, session_state{user, host}, exploit_history}; every specialist queries this DB rather than relying on conversational memory; complementary to PTG (task flow) — two separate linked stores | Papers 12, 13 |

---

## 📊 Benchmark Candidates
*(This section will grow as benchmark papers are reviewed)*

| Benchmark | Paper | Scope | Mode |
|-----------|-------|-------|------|
| 15 Real-World One-Day CVEs | Paper 01 | Web apps, containers, Python packages | Exploitation with CVE hint |
| 14 Real-World Zero-Day CVEs | Paper 02 | Web apps only (XSS, SQLi, CSRF, privesc) | Autonomous discovery + exploitation |
| XBOW 104 CTF Challenges | Papers 03, 04 | 13 vuln categories, 8/10 OWASP Top 10 | Blackbox CTF, flag-based binary oracle |
| DVWA | Paper 04 | Injection classes (XSS, SQLi) with configurable difficulty | Controlled model ablation, 10 trials per vuln type |
| AutoPT Benchmark (20 Vulhub CVEs) | Paper 05 | OWASP Top 10 2023, simple vs complex stratification | End-to-end blackbox, verification string oracle |
| HackWorld (36 Web CTFs) | Paper 06 | 7 languages, 11 frameworks; NYU CTF Bench + Cybench + InterCode | GUI-based CUA evaluation, flag-based oracle |
| NYU CTF Bench (26 CSAW Challenges) | Paper 06 | CSAW 2013–2023, Quals + Finals | Standalone CTF challenges, web-specific |
| PrediQL GraphQL APIs (6 APIs) | Paper 07 | GraphQL: UserWallet, Countries, Rick&Morty, GraphQLZero, EHRI, TCGDex | Schema coverage + vuln detection, GraphQL-specific |
| RESTler Benchmark (GitLab + Azure) | Paper 08 | REST APIs: 6 GitLab API groups + 4 Azure/Office365 services | Stateful sequence fuzzing, 500-error oracle; 28+ confirmed bugs |
| lin.security VM (VulnHub #244) | Paper 09 | Single Linux VM; priv-esc via sudo GTFObins, shadow passwd, SUID | SSH closed-loop; root shell oracle; manual inspection; single-step success, multi-step failure |
| PentestGPT Benchmark (13 machines, 182 sub-tasks) | Paper 10 | 7 Easy + 4 Medium + 2 Hard; HTB + VulnHub; all OWASP Top 10; 18 CWE items; 26 categories | Sub-task completion oracle; 3 certified pentesters wrote walkthroughs; post-2021 machines (training contamination guard) |
| HackTheBox Active Machines (10 machines) | Paper 10 | 5 Easy + 5 Medium; real-world post-2021 machines; root flag oracle | 5 trials per machine; 17/50 trial successes; $131.5 USD total; $21.9/machine avg |
| picoMini CTF (21 challenges, 248 teams) | Paper 10 | Web + crypto + binary + reverse + forensics; CMU/redpwn; web-specific: login, caas, notepad | Flag oracle; 9/21 solved; 24th/248 teams; $5.1 USD/attempt avg |
| GOAD (Game of Active Directory, 5-host) | Paper 11 | Multi-domain Windows AD: Kerberoasting, NTLM relay, lateral movement, domain escalation | Hosts compromised /5; PENTESTGPT v2: 4/5 vs 2/5 baselines; $28.50/full engagement |
| HTB Season 8 (13 live machines, 2025) | Paper 11 | Post-2025 machines, no public walkthroughs; Easy+Med+Hard+Insane | Live competition oracle; 10/13 (76.9%); top-100/8,036 participants; strongest real-world validation |
| AUTOPENBENCH (33 tasks, 210 subtasks) | Paper 12 | 22 in-vitro (AC, WS, NS, CRPT) + 11 real-world CVEs incl. 2024 CVEs; 5 per-phase step limit | Subtask completion oracle; VulnBot-405B 69.05% subtask / 30.3% overall; beats GPT-4o 21.21% using open-source model |
| AI-Pentest-Benchmark (13 VulnHub machines) | Papers 11, 12 | 6 machines tested in Paper 12 (Victim1, Library2, Sar, WestWild, Symfonos2, Funbox); Easy + Medium difficulty | Subtask completion rate oracle; VulnBot+RAG achieves 1.00 on WestWild (full autonomous) vs GPT-4o+Human 0.57 |
| PentestAgent Benchmark (67 VulHub + 11 HTB) | Paper 13 | 67 VulHub Docker CVE envs: 32 CWE categories, 8 OWASP Top 10, 50 Easy + 11 Med + 6 Hard; selected by EPSS score (mean 79.58); 11 HackTheBox CTF (9 Easy + 1 Med + 1 Hard); Kali Linux attacker VM | Stage completion oracle (I.G./V.A./E.); GPT-4: 74.2% overall; beats PentestGPT+human 3.1× faster on I.G., 4.8× on E.; V.A. 100% regardless of model (Search Agent dominates) |
| CyBench | Paper 23 | CTF-style cybersecurity tasks | — |
| PentestEval | Paper 24 | LLM pentest structured eval | — |
| BountyBench | Paper 25 | Real-world bug bounty dollar impact | — |
| CVE-Bench | Paper 28 | Real-world web app CVEs | — |

---

*Last updated after: Paper 13*
