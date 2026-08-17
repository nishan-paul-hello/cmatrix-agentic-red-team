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
| 02 | Teams of LLM Agents can Exploit Zero-Day Vulnerabilities | — | ⏳ Pending |
| 03 | Multi-Agent Penetration Testing: AI for the Web | — | ⏳ Pending |
| 04 | AWE: Adaptive Agents for Dynamic Web Penetration Testing | — | ⏳ Pending |
| 05 | AutoPT: How Far Are We from End2End Automated Web Pentesting | — | ⏳ Pending |
| 06 | HackWorld: Evaluating Computer Use Agents on Exploiting Web | — | ⏳ Pending |
| 07 | PrediQL: Automated Testing of GraphQL APIs with LLMs | — | ⏳ Pending |
| 08 | RESTler: Stateful REST API Fuzzing | — | ⏳ Pending |
| 09 | Getting Pwnd by AI: Penetration Testing with LLMs | — | ⏳ Pending |
| 10 | PentestGPT: Evaluating and Harnessing LLMs for Automated Pentest | — | ⏳ Pending |
| 11 | What Makes a Good LLM Agent for Real-World Penetration Testing | — | ⏳ Pending |
| 12 | VulnBot: Autonomous Penetration Testing for a Multi-Agent System | — | ⏳ Pending |
| 13 | PentestAgent: Incorporating LLM Agents to Automated Pentesting | — | ⏳ Pending |
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
| Tool Suite | Browser + Shell + Search + FileIO + CodeExec | Paper 01 |
| Memory | Stateful action history (100+ steps needed) | Paper 01 |
| Planning | Explicit planning module — identified as a gap | Paper 01 |
| Subagents | Per-vulnerability-class specialist agents | Paper 01 |
| Output Management | Chunked context + summarization for long HTML/logs | Paper 01 |
| Observability | Pass@1, Pass@5, cost-per-exploit metrics | Paper 01 |

---

## 📊 Benchmark Candidates
*(This section will grow as benchmark papers are reviewed)*

| Benchmark | Paper | Scope |
|-----------|-------|-------|
| 15 Real-World One-Day CVEs | Paper 01 | Web apps, containers, Python packages |
| CyBench | Paper 23 | CTF-style cybersecurity tasks |
| PentestEval | Paper 24 | LLM pentest structured eval |
| BountyBench | Paper 25 | Real-world bug bounty dollar impact |
| CVE-Bench | Paper 28 | Real-world web app CVEs |

---

*Last updated after: Paper 01*
