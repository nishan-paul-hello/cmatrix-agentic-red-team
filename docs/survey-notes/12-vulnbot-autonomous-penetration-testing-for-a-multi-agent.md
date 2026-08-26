# VulnBot: Autonomous Penetration Testing for a Multi-Agent Collaborative Framework — Deep Survey Notes for RedGrid

| Field | Details |
|-------|---------|
| **Authors** | He Kong, Die Hu, Jingguo Ge, Liangxiong Li, Tong Li, Bingzhen Wu (State Key Laboratory of Cyberspace Security Defense, IIE, Chinese Academy of Sciences; School of Cyber Security, UCAS) |
| **Venue** | arXiv:2501.13411v1 [cs.SE] |
| **Published** | January 2025 |
| **Repository** | https://github.com/KHenryAegis/VulnBot |
| **Relevance** | ⭐⭐⭐⭐☆ — VulnBot's Penetration Task Graph (PTG) and phase-scoped inter-agent communication directly inform RedGrid's FSM state design, the Summarizer pattern resolves context budget problems, and the RAG integration provides the strongest empirical justification for RedGrid's FAISS-backed memory store. |
| **Key Claim** | VulnBot-Llama3.1-405B achieves **30.3% overall task completion** and **69.05% subtask completion** on AUTOPENBENCH, vs. 9.09% and 49.05% for the base model — RAG further boosts real-world subtask completion to **1.00 on WestWild** (full autonomous end-to-end penetration). |

---

## 2. Core Thesis

VulnBot addresses the three dominant failure modes that cripple single-agent LLM penetration testing: (1) session context overflow (42% of all failures), (2) hallucinated or incorrect commands (19.7%), and (3) inability to adapt when a command fails (no automated error-handling). The key insight is that these problems are architecturally avoidable — they arise because single-agent systems force one LLM context to simultaneously carry recon data, scanning state, exploit attempts, and error history. VulnBot's remedy is strict phase isolation: three agents (Reconnaissance, Scanning, Exploitation), each with its own LLM session, communicating only via a Summarizer that distils the current phase's results into a compact natural-language handoff.

For RedGrid, the critical lesson is that **context isolation between roles is not a nice-to-have — it is the primary mechanism that prevents context loss, the #1 failure mode**. The paper demonstrates this with a controlled ablation: removing the Summarizer alone drops subtask success from 55 to 27 (a 51% degradation), making it the single most impactful component in the entire framework.

The paper also provides the strongest empirical case yet for RAG in autonomous pentesting. Integrating HackTricks + HackingArticles content into a Milvus vector store and retrieving top-3 similar chunks allows VulnBot-Llama3.1-405B to autonomously achieve full penetration of WestWild — a feat that GPT-4o with human assistance could only partially accomplish (0.57). This directly validates RedGrid's FAISS-backed memory store design and provides concrete embedding/chunking parameters to adopt.

---

## 3. How It Actually Works

### 3.1 System Architecture Overview

VulnBot consists of five core modules — Planner, Memory Retriever, Generator, Executor, Summarizer — deployed across three specialist roles operating in strict sequential phases.

```mermaid
flowchart TD
    subgraph INIT["Phase 0: Initialization"]
        USER["User Input (Target IP + Goal)"] --> PLANNER_RECON
    end

    subgraph RECON["Phase 1: Reconnaissance"]
        PLANNER_RECON["Planner_R (Plan Session + Task Session)"] -->|"Next Task (PTG node)"| GENERATOR_RECON
        GENERATOR_RECON["Generator_R: nmap -sV -p- IP"] --> EXECUTOR_RECON
        EXECUTOR_RECON["Executor_R (Paramiko SSH to Kali)"] -->|Raw output| PLANNER_RECON
        EXECUTOR_RECON --> SUMMARIZER_RECON
        PLANNER_RECON <-->|"Read/Update PTG DAG"| PTG_RECON[("PTG_R JSON DAG")]
        PLANNER_RECON <-->|"Embed + top-3 retrieve"| RAG["Memory Retriever (Milvus + bce-embedding-base-v1 + bce-reranker-base-v1)"]
        SUMMARIZER_RECON["Summarizer_R: Open ports 22/80, Apache 2.4.18, Shell=none"] --> PLANNER_SCAN
    end

    subgraph SCAN["Phase 2: Scanning"]
        PLANNER_SCAN["Planner_S (receives Summarizer_R output)"] -->|"Next Task"| GENERATOR_SCAN
        GENERATOR_SCAN["Generator_S: nikto -h http://IP"] --> EXECUTOR_SCAN
        EXECUTOR_SCAN["Executor_S (Paramiko SSH)"] -->|Raw output| PLANNER_SCAN
        EXECUTOR_SCAN --> SUMMARIZER_SCAN
        PLANNER_SCAN <-->|"Read/Update PTG"| PTG_SCAN[("PTG_S JSON DAG")]
        SUMMARIZER_SCAN["Summarizer_S: SQLi on /login.php, Shell=none"] --> PLANNER_EXPLOIT
    end

    subgraph EXPLOIT["Phase 3: Exploitation"]
        PLANNER_EXPLOIT["Planner_E (receives Summarizer_S output)"] -->|"Next Task"| GENERATOR_EXPLOIT
        GENERATOR_EXPLOIT["Generator_E: sqlmap -u http://IP/login.php"] --> EXECUTOR_EXPLOIT
        EXECUTOR_EXPLOIT["Executor_E (Paramiko SSH)"] -->|Raw output| PLANNER_EXPLOIT
        PLANNER_EXPLOIT <-->|"Read/Update PTG"| PTG_EXPLOIT[("PTG_E JSON DAG")]
    end

    RECON --> SCAN --> EXPLOIT
```

> **Critical design detail:** Each phase has a completely **separate LLM context** (separate session). The only cross-phase data transfer happens through the Summarizer's natural language output — which is intentionally compact. This is what prevents context overflow.

---

### 3.2 The Penetration Task Graph (PTG)

The PTG is VulnBot's central data structure — a **Directed Acyclic Graph (DAG)** stored as JSON, tracking every task with structured metadata.

**Formal definition:** PTG = G = (V, E) where:
- Each node v ∈ V has: `{id, dependencies[], instruction, action, command, result, finished_status, success_status}`
- Each edge (T1→T2) means T1 must complete before T2 can execute
- Action type is either `"Shell"` (auto-executed) or `"Manual"` (user-executed in semi-auto mode)

```mermaid
flowchart TD
    subgraph PTG["PTG Lifecycle — Single Phase"]
        INIT_PTG["Plan Session: LLM generates initial PTG JSON (all tasks + deps)"] --> EXEC_LOOP

        subgraph EXEC_LOOP["Execution Loop"]
            SELECT["Select next executable node (all deps = success=true)"] --> GEN
            GEN["Task Session: Generate concrete command for this PTG node"] --> EXEC
            EXEC["Executor: nmap -sV -p- 192.168.1.104 (Paramiko SSH to Kali)"] --> PARSE
            PARSE["Output > 8000 chars? YES: LLM extracts key info. NO: pass raw."] --> CHECK
            CHECK["Task Session: Verify success? YES: finished=true, success=true. NO: failed_task"] --> MERGE
            MERGE["Merge Plan Algorithm: 1. Retain completed tasks 2. Replan around failed tasks 3. Update deps"] --> SELECT
        end

        EXEC_LOOP -->|"All nodes done or step limit hit"| SUMMARIZE
        SUMMARIZE["Summarizer: compress phase findings to natural language handoff"]
    end
```

**Key PTG example** (from paper Appendix):
```json
{"id": "1", "dependencies": [], "action": "Shell",
 "instruction": "SSH into 192.168.1.104:22 with creds wavex:door+open"},
{"id": "2", "dependencies": ["1"], "action": "Shell",
 "instruction": "Find writable dirs: find / -writable -type d 2>/dev/null"},
{"id": "3", "dependencies": ["1"], "action": "Shell",
 "instruction": "Enumerate processes: ps aux"},
{"id": "9", "dependencies": ["5","8"], "action": "Shell",
 "instruction": "Escalate to root: sudo su"}
```

The **Merge Plan Algorithm** is the key innovation for error recovery:
```
Input: newTasks (LLM-regenerated plan), oldTasks (current PTG)
1. completedTasks = getCompletedTasks(oldTasks)
2. mergedTasks = []
3. For each task in completedTasks NOT in newTasks: add to mergedTasks
4. For each newTask in newTasks:
     if exists in completedTasks: update sequence/deps, add
     else: create new task node, add
5. Return mergedTasks
```
This preserves completed work when the LLM regenerates a plan around a failed subtask — no duplicate re-execution of successful nodes.

---

### 3.3 Inter-Agent Communication — The Summarizer Pattern

The Summarizer operates as a **one-directional distillation bridge** between phases. It receives raw Executor output and produces a structured natural-language handoff with two fixed sections:

1. **Phase findings** — What was discovered (open ports, services, vulns, credentials)
2. **Shell state** — Current privilege level and active sessions ("shell as student@target", "no active shell")

This design ensures the receiving phase's Planner LLM context starts with only the essential handoff, not the full history of the sending phase. The paper measures the impact: removing the Summarizer drops subtask completion from 55 → 27 (-51%).

---

### 3.4 Output Truncation Heuristic

The Executor applies a simple but effective output-filtering rule:
- **If tool output > 8,000 characters → invoke LLM to extract key information**
- **If ≤ 8,000 characters → pass raw output to Planner**

This prevents individual tool outputs (e.g., a massive nmap full-port scan or nikto report) from flooding the Planner's context and causing the session context loss that accounts for 42% of all failures.

---

### 3.5 RAG Architecture (Memory Retriever)

```mermaid
flowchart LR
    subgraph KNOWLEDGE["Knowledge Sources"]
        HT["HackTricks (book.hacktricks.wiki)"]
        HA["HackingArticles (hackingarticles.in)"]
        PREV["Successful Past Tasks (from previous runs)"]
    end

    subgraph PIPELINE["Embedding + Indexing"]
        CHUNK["Chunk: 750-word segments"]
        EMBED["bce-embedding-base-v1 (NetEase Youdao)"]
        STORE["Milvus Vector DB (persistent)"]
    end

    subgraph RETRIEVAL["At Query Time"]
        QUERY["Current Plan State (converted to embedding)"]
        SEARCH["Top-K=3 retrieval (cosine sim > 0.5)"]
        RERANK["bce-reranker-base-v1 (cross-encoder reranking)"]
        INJECT["Inject into Planner Plan Session prompt"]
    end

    KNOWLEDGE --> CHUNK --> EMBED --> STORE
    QUERY --> SEARCH --> STORE
    STORE --> RERANK --> INJECT
```

**Parameters to adopt in RedGrid:**
- Chunk size: **750 words** (not tokens)
- Top-K initial retrieval: **3** (with score > 0.5 filter before reranking)
- Use **cross-encoder reranker** after initial embedding retrieval (two-stage)
- Sources: HackTricks + HackingArticles + successful task history

**RAG impact:** Llama3.1-405B + RAG → **1.00** on WestWild (full autonomous); GPT-4o + Human → **0.57**; Llama3.1-405B + Human → **0.57**. RAG outperforms human-assisted baselines on all 6 machines.

---

### 3.6 Operational Modes

| Mode | Shell Execution | Manual Tasks | Use Case |
|------|----------------|--------------|----------|
| **Automatic** | Agent executes all | — | Benchmark evaluation |
| **Semi-automatic** | Agent executes Shell actions | User executes Manual actions | Complex targets requiring human judgment |
| **Manual** | User executes all | User executes all | Human-in-the-loop learning |

The PTG `action` field controls this: `"Shell"` → auto-execute; `"Manual"` → escalate to user.

---

## 4. Vulnerabilities Exploited

VulnBot targets general penetration testing phases rather than specific CVEs. The AUTOPENBENCH benchmark covers:

| Category | Task Count | Example Vulnerability Types |
|----------|------------|----------------------------|
| Access Control (AC) | 5 tasks | Privilege escalation, sudo abuse, SUID |
| Web Security (WS) | 7 tasks | SQLi, XSS, IDOR, file inclusion |
| Network Security (NS) | 6 tasks | Service exploitation, lateral movement |
| Cryptography (CRPT) | — | Weak ciphers, hash cracking |
| Real-world CVEs | 11 tasks | 2024 CVEs (knowledge cutoff test) |

**Notably:** VulnBot completed one 2024 CVE task despite both models having a December 2023 knowledge cutoff — demonstrating the framework reasons from first principles, not memorized exploit chains.

Real-world AI-Pentest-Benchmark machines tested:

| Machine | Difficulty | Key Exploit Chain |
|---------|-----------|-------------------|
| Victim1 | Easy | Remote service exploitation → shell |
| Library2 | Easy | Web app SQLi → credential extraction |
| Sar | Easy/Med | Cron job abuse → privilege escalation |
| WestWild | Easy | Full chain: recon → service vuln → privesc |
| Symfonos2 | Medium | Multi-service exploitation chain |
| Funbox | Medium | WordPress + SSH → root |

---

## 5. Benchmark Section

### AUTOPENBENCH

| Property | Value |
|----------|-------|
| **Name** | AUTOPENBENCH |
| **Source** | Gioacchini et al., arXiv:2410.03225 |
| **Size** | 33 tasks total (22 in-vitro + 11 real-world CVEs), 210 subtasks |
| **Difficulty** | In-vitro (basic scenarios) + Real-world (public CVEs) |
| **Step Limit** | 15 steps for VulnBot (5 per phase); 30/60 for GPT-4o baselines |
| **Oracle** | Subtask completion check (structured per-benchmark) |

**Overall Task Completion (Table 2):**

| System | AC | WS | NS | Real-World | **ALL** |
|--------|----|----|----|-----------|----|
| GPT-4o (base) | 20% | 28.57% | 50% | 9.09% | **21.21%** |
| Llama3.3-70B (VulnBot) | 20% | 14.29% | 33.33% | 18.18% | **18.18%** |
| **Llama3.1-405B (VulnBot)** | **60%** | **28.57%** | 33.33% | **27.27%** | **30.30%** |
| Llama3.3-70B (Base) | 0% | 0% | 33.33% | 0% | 6.06% |
| Llama3.1-405B (Base) | 0% | 14.29% | 33.33% | 0% | 9.09% |
| Llama3.1-405B (PentestGPT) | 20% | 0% | 33.33% | 0% | 9.09% |

> **Note:** VulnBot-Llama3.1-405B (30.30%) outperforms GPT-4o (21.21%) using a free open-source model — confirming the architectural-gap-dominates-model-size finding from Papers 04, 05, 06, 11.

**Subtask Completion — 1 Experiment / 5 Experiments (Table 3):**

| System | 1-Exp (210 subtasks) | 5-Exp (1050 subtasks) |
|--------|---------------------|----------------------|
| **Llama3.1-405B (VulnBot)** | **69.05%** | **49.90%** |
| Llama3.3-70B (VulnBot) | 59.52% | 44.29% |
| Llama3.1-405B (Base) | 49.05% | 24.76% |
| Llama3.3-70B (Base) | 44.76% | 31.62% |
| Llama3.1-405B (PentestGPT) | 40.00% | 17.24% |
| Llama3.3-70B (PentestGPT) | 34.76% | 22.76% |

> **Note:** VulnBot's 5-experiment rate (49.90%) is 2× the PentestGPT baseline (17.24%) — multi-agent phase isolation is consistently reproducible, not luck.

**Ablation Study — Real-World Tasks Only (Llama3.1-405B):**

| Variant | Subtask Success | Overall Task Success |
|---------|----------------|---------------------|
| **Full VulnBot** | **55** | **3** |
| VulnBot-without Role | 32 (-42%) | 0 (-100%) |
| VulnBot-without PTG | 37 (-33%) | 0 (-100%) |
| VulnBot-without Summarizer | 27 (-51%) | 0 (-100%) |

> **Note:** Every component is necessary for overall task completion — removing any single component collapses overall completion to 0. The **Summarizer is the most critical component** (-51% on subtasks).

---

### AI-Pentest-Benchmark (Real-World Machines)

| Property | Value |
|----------|-------|
| **Name** | AI-Pentest-Benchmark |
| **Source** | Isozaki et al., arXiv:2410.17141 |
| **Size** | 13 VulnHub machines (6 tested in this paper) |
| **Deployment** | VulnHub VMs (local) |
| **Step Limit** | 24 steps (8 per phase) |
| **Oracle** | Subtask completion rate (structured per-machine walkthrough) |

**VulnBot vs. Baselines (Subtask Completion Rate, best of 5 runs):**

| Machine | VulnBot-405B | PentestGPT-405B | Base-405B | VulnBot-DSv3 | PentestGPT-DSv3 | Base-DSv3 |
|---------|-------------|----------------|-----------|-------------|----------------|-----------|
| Victim1 | 0.33 | 0.17 | 0.17 | **0.83** | 0.50 | 0.00 |
| Library2 | 0.40 | 0.20 | 0.20 | **0.50** | 0.20 | 0.20 |
| Sar | **0.27** | 0.27 | 0.09 | **0.27** | 0.27 | 0.14 |
| WestWild | 0.57 | 0.14 | 0.14 | **0.71** | 0.57 | 0.14 |
| Symfonos2 | 0.29 | 0.21 | 0.29 | **0.57** | 0.57 | 0.44 |
| Funbox | **0.33** | 0.21 | 0.22 | 0.29 | 0.22 | **0.44** |

> **Note:** VulnBot-DeepSeek-v3 is the strongest performer on 5/6 machines. Cheap open-source model + VulnBot architecture beats GPT-4o across all real-world machines.

**VulnBot + RAG vs. Human-Assisted Baselines:**

| Machine | **VulnBot+RAG (auto)** | GPT-4o+Human | 405B+Human |
|---------|----------------------|-------------|-----------|
| Victim1 | **0.83** | 0.67 | 0.33 |
| Library2 | **0.80** | 0.60 | 0.50 |
| Sar | **0.73** | 0.55 | 0.55 |
| WestWild | **1.00** | 0.57 | 0.57 |
| Symfonos2 | **0.56** | 0.43 | 0.29 |
| Funbox | **0.56** | 0.43 | 0.33 |

> **Note:** VulnBot+RAG fully autonomous **outperforms GPT-4o + human assistance on every single machine**. This is the most compelling result in the paper and the strongest empirical justification for RAG in RedGrid.

---

## 6. Key Takeaways for RedGrid

### 🔴 Critical — Must-Have in RedGrid v1

**1. Phase-Scoped Session Isolation (Summarizer Pattern)**
The Summarizer is the single most impactful component (removes 51% of subtasks if absent). RedGrid must implement a `SummarizePhase()` call after every specialist completes, before the Team Manager dispatches the next specialist. The summarizer receives raw tool outputs → produces structured JSON handoff:
```json
{
  "phase": "reconnaissance",
  "findings": {"open_ports": [22, 80, 443], "services": {...}, "tech_stack": "Apache 2.4.18"},
  "shell_state": {"level": null, "user": null, "sessions": []},
  "key_vulns": [],
  "next_phase_hints": "Web server on port 80, possible SQLi on /login.php"
}
```
This JSON (not the full specialist conversation history) is what the next specialist receives as its context seed. Directly extends the inter-state summary signal from Paper 05.

**2. PTG as RedGrid's FSM State Storage**
VulnBot's PTG is the concrete JSON implementation of the abstract FSM states described in Paper 05. RedGrid's PSM FSM should store state as a PTG-style JSON DAG per mission. Each node = {id, deps[], instruction, action_type, command, result, finished, success}. The FSM's "current state" = the set of unfinished PTG nodes whose deps are all succeeded. This unifies the PTG concept with the FSM control flow established in Paper 05.

**3. Merge Plan Algorithm for Error Recovery**
When a PTG node fails and the LLM generates a revised plan, use the Merge Plan Algorithm to preserve already-completed nodes. Never re-execute succeeded nodes. Implementation pattern:
```python
def merge_plan(new_tasks: list[Task], old_tasks: list[Task]) -> list[Task]:
    completed = {t.id: t for t in old_tasks if t.success_status}
    merged = [t for t in completed.values() if t.id not in {nt.id for nt in new_tasks}]
    for nt in new_tasks:
        if nt.id in completed:
            nt.sequence = completed[nt.id].sequence
            nt.dependencies = completed[nt.id].dependencies
        merged.append(nt)
    return merged
```

**4. 8,000-Character Output Truncation Gate**
Before any tool output reaches the Planner LLM: if `len(output) > 8000` chars, invoke a small/cheap LLM (GPT-4o-mini or equivalent) to extract key facts first. This prevents the #1 failure mode (session context loss = 42% of all failures). The threshold of 8,000 chars ≈ ~2,000 tokens is a safe budget for a 128k context being shared across multiple tool calls.

**5. Two-Stage RAG with Cross-Encoder Reranking**
RedGrid's FAISS memory store should be supplemented with a cross-encoder reranker for retrieval quality:
- Stage 1: FAISS cosine similarity, retrieve top-20, filter by score > 0.5
- Stage 2: Cross-encoder reranker (e.g., `bce-reranker-base-v1` or `cross-encoder/ms-marco-MiniLM-L-6-v2`), select top-3
- Chunk size for knowledge documents: **750 words**
- Knowledge sources: HackTricks + HackingArticles + per-mission successful task history

**6. PTG `action` Field for Semi-Auto Escalation**
Every RedGrid task node should carry an `action_type` field: `"auto"` | `"escalate"`. When the Validation Agent or Team Manager determines a step requires human judgment (e.g., captcha, MFA, ambiguous GUI), set `action_type = "escalate"` and emit a structured human-in-the-loop request. Formalizes the semi-automatic mode from VulnBot and complements the TDA-triggered global escalation from Paper 11.

---

### 🟡 Important — RedGrid v2

**7. Phase Failure Distribution Monitoring**
VulnBot shows exploitation has the highest failure rate (not recon). RedGrid should track per-phase failure counts in the observability dashboard: `{recon_failures, scan_failures, exploit_failures}`. When `exploit_failures > 2×recon_failures`, trigger a Planner re-evaluation: possibly the recon/scan phases gave insufficient signal.

**8. Open-Source Model Priority for Cost Efficiency**
VulnBot-DeepSeek-v3 is the strongest performer on real-world machines, beating GPT-4o at a fraction of the cost. RedGrid's model config should default to: Plan Session = DeepSeek-v3 or Llama3.1-405B (reasoning), Task Session / Generator = Llama3.3-70B (command gen). Only escalate to GPT-4o or Claude when confidence is low. Now corroborated by 6 independent papers (04, 05, 06, 07, 11, 12).

**9. Parallel PTG Execution for Independent Branches**
The PTG is a DAG — nodes with no shared dependencies can execute concurrently. RedGrid v2 should identify independent PTG branches and dispatch them to separate specialist instances in parallel. This could cut wall-clock time significantly in the recon phase (e.g., nmap scan + dirb + nikto can run simultaneously).

**10. Role-Playing Jailbreak in Phase-Specific Prompts**
VulnBot uses role-playing framing at prompt initialization per phase: "You are a {role} Assistant running on Kali Linux 2023 in a cybersecurity training process." RedGrid already has the verification framing (Paper 09), but should layer in phase-specific role identity to reduce refusal rates. Template: `"You are a {Reconnaissance|Scanning|Exploitation} Assistant..."`. Add to Jailbreak Prompt Library.

---

### 🟢 Nice-to-Have — Future Work

**11. Image/Screenshot Processing**
VulnBot explicitly flags inability to process visual tool output (Burp screenshots, browser renders) as a limitation. RedGrid v3 should integrate a VLM sidecar to process non-textual tool outputs — connect to the existing Browser Verification Playwright agent.

**12. WPScan Integration**
VulnBot's scanning phase includes WPScan for WordPress detection. Add WPScan to RedGrid's Scanning Specialist tool palette alongside Nikto and ffuf. Trigger condition: WhatWeb/WappalyzerGo fingerprint identifies WordPress.

**13. Knowledge Cutoff CVE Handling**
VulnBot's success on a 2024 CVE task despite December 2023 training cutoff shows structured reasoning compensates for missing vulnerability knowledge. RedGrid should log when a CVE predates vs. postdates the model's training cutoff and adjust confidence scores accordingly — but not assume failure.

---

## 7. Cross-References

| This Paper's Concept | Related Paper | Mechanism of Connection |
|---------------------|---------------|------------------------|
| **PTG (Penetration Task Graph)** | Paper 10 (PentestGPT — PTT) | Both use a structured JSON task tree to replace freeform LLM continuation. PTG adds formal DAG dependency edges; PTT is flatter. RedGrid should use PTG's DAG structure with PTT's JSON schema (type, severity, confidence fields). |
| **PTG as scored DAG** | Paper 11 (EGATS Attack Tree) | Paper 11 adds UCB-scored node traversal on top of a PTG-style structure. RedGrid's EGATS signal should be implemented as a scored PTG, not a separate data structure — the PTG node schema gains `{promise_φ, TDI_δ}` fields. |
| **Session Context Loss (42% of failures)** | Paper 10 (Six-Failure-Mode QA Gate: context_loss_events) | Both independently identify context overflow as the #1 failure mode. RedGrid must apply both the 8,000-char truncation gate (this paper) AND the context_load_threshold signal (Paper 11: 40%/70%/80% compression tiers) — complementary, not redundant. |
| **Summarizer pattern** | Paper 05 (AutoPT — inter-state summaries) | AutoPT uses inter-state summaries to prevent history accumulation between FSM states. VulnBot's Summarizer is the concrete implementation. RedGrid FSM transitions must call SummarizePhase() before each state handoff — both papers demand this. |
| **Merge Plan Algorithm** | Paper 09 (Reflection Filter / Check-and-Correct) | Both handle failed tool calls with adaptive re-planning. Paper 09 operates at tool-call level (inject error pair into next prompt); VulnBot operates at task-graph level (regenerate PTG around failed node). RedGrid needs both: micro-level error injection (Paper 09) AND macro-level PTG replan (this paper). |
| **RAG with HackTricks** | Paper 02 (Domain knowledge documents) | Paper 02 injects 5–6 curated static documents per specialist. VulnBot retrieves 3 dynamically-relevant chunks from a vector store. RedGrid should do both: static specialist primer documents (Paper 02) + dynamic RAG retrieval with cross-encoder reranking (this paper). |
| **Open-source model beats GPT-4o** | Papers 04, 05, 06, 07, 11 | VulnBot is the 6th independent paper to confirm that architectural design (phase isolation, task graph, memory) dominates model capability. DeepSeek-v3 + VulnBot > GPT-4o. RedGrid's Model Selection signal is now corroborated by 6 papers. |
| **Failure mode taxonomy** | Paper 10 (Six-Failure-Mode QA Gate) | VulnBot's empirical taxonomy (context loss 42%, false output 9%, failed tool 20%, deadlock 5%, operation failed 19%) provides ground-truth weights for Paper 10's QA gate. RedGrid should use VulnBot's percentages to calibrate alert thresholds in the observability dashboard. |
| **Semi-automatic mode (Manual action type)** | Paper 11 (Human Escalation Protocol) | Paper 11 proposes escalation when all branches have TDI > 0.8 after k_min=3 attempts; VulnBot formalizes escalation at the per-task-node level via action_type=Manual. RedGrid implements both: TDA-triggered global escalation (Paper 11) AND per-task manual escalation (this paper). |
