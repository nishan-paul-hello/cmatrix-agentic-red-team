
# Incalmo: An Autonomous LLM-assisted System for Red Teaming Multi-Host Networks

**Authors:** Brian Singer\*, Keane Lucas†, Lakshmi Adiga\*, Meghna Jain\*, Lujo Bauer\*, Vyas Sekar\*
\*Carnegie Mellon University · †Anthropic

> 📄 arXiv:2501.16466v4 [cs.CR] · 22 Nov 2025
> Code: https://github.com/bsinger98/Incalmo

---

## 📌 Abstract

- Security operators use red teams to simulate real attackers and proactively find defense gaps.
- In realistic enterprise settings, this involves executing **multi-host** network attacks spanning many "stepping stone" hosts.
- Red teams are expensive and require significant expertise/effort.
- 🔍 The paper first analyzes whether LLMs can **autonomously** execute multi-host red team exercises.
  - Finding: state-of-the-art LLM-assisted offense systems (PentestGPT, CyberSecEval3) with leading LLMs (Sonnet 4, Gemini 2.5 Pro) **fail** to do so.
- Building on failure-mode analysis, the authors argue for improving the **abstractions and interfaces** for LLM-assisted red teaming.
- 🛠️ They present **Incalmo**, an LLM-assisted system that plans red team exercises via high-level declarative tasks executed by domain-specific task agents, with auxiliary services for context/asset management.
- 📊 **Evaluation:** MHBench — 40 realistic emulated networks (22–50 hosts).
  - Incalmo acquires critical assets in **37/40** environments.
  - State-of-the-art LLM-assisted baselines succeed in only **3/40**.
  - Incalmo is efficient: successful attacks take **12–54 minutes**, cost **≤ $15** in LLM credits.

---

## 1. Introduction

### 🎯 Motivation
- Red teams help defenders prioritize vulnerabilities, evaluate detection rules, and test response strategy by emulating real multi-host attacks.
- Red-team exercises are expensive and expertise-intensive.
- Given LLM promise in CTF challenges, the authors investigate autonomous multi-host red teaming.

### 🔬 Approach Overview
1. Build **MHBench**: a benchmark of 40 multi-host environments, based on public real-world attack reports, reference topologies, and prior work.
2. Evaluate state-of-the-art LLM-based offense systems (PentestGPT, CyberSecEval3, CAI) with frontier models (GPT-4o, Sonnet 4, Gemini 2.5 Pro) → **very limited success**.
3. Analyze *why* these systems fail.
4. Design **Incalmo** based on those insights.

### ⚠️ Observed Failure Patterns in Existing Systems
- Waste effort on **irrelevant tasks** unrelated to the challenge.
- **Incorrectly execute** tasks.
- Use **brittle post-exploitation techniques**.
- Suffer from **context bloat** over long-horizon challenges.

### 💡 Key Insight: Raise the Level of Abstraction
Rather than improving low-level command execution (better prompts, self-reflection, etc.), the authors draw inspiration from expert human red teams, who:
- Don't run low-level shell commands or brittle scripts across stepping-stone hosts.
- Think in terms of high-level **"cyber kill-chain" tasks**:
  - Reconnaissance
  - Exploitation
  - Command and control
  - Goal-centric actions
- Use best-practice security tools at each kill-chain stage.

### 🏗️ Incalmo's Design
- **Decouples red-team planning from execution** (see Figure 1).
- LLM = **planning module** → decides *what* high-level declarative task to perform (not low-level shell commands).
- Task execution delegated to **reliable expert task agents** using domain-specific best practices.
- **Auxiliary services** (to avoid prompt bloat & manage acquired assets):
  - Environment-state service
  - Attack-graph service
  - Command-and-control service
- Benefit: combines (a) broad world knowledge of the LLM-as-planner with (b) domain-specific execution expertise.
- Handles **unforeseen** multi-host scenarios (new topologies/attack paths) involving known/public vulnerabilities.
- Extensible design — e.g., could incorporate 0-day exploit creation capabilities.

> Incalmo represents a red-team-specific synthesis of best practices for using LLMs in complex, long-horizon tasks: decoupling planning from execution, scoped agents, and offloading solution steps.

### 🖼️ Figure 1 — System Comparison

```mermaid
flowchart TB
    subgraph SOTA["State-of-the-art LLM Offense Systems"]
        direction LR
        U1["👤 User"] --> L1["LLM"]
        L1 <-->|"Low-level shell commands"| E1["🖥️ Environment (hosts)"]
    end

    subgraph INC["Incalmo"]
        direction TB
        U2["👤 User"] --> PL["Planning Layer: LLM + Planning Abstraction"]
        PL -->|"High-level Tasks e.g. scan subnet, lateral move"| EX["Execution Layer"]
        EX --> RA["Red Team Agents"]
        EX --> AG["Attack Graph Service"]
        EX --> CC["C&C Server Service"]
        EX --> ES["Environment State Service"]
        RA & AG & CC & ES -->|"Low-level commands (curl, shell)"| E2["🖥️ Environment (hosts)"]
    end
```

> **Figure 1 Caption:** Incalmo is a system for executing multi-host red teams. Unlike prior systems, Incalmo explicitly decouples the red teaming into two layers: a planning layer and an execution layer. Instead of LLMs interacting with low-level tools, Incalmo has an LLM plan red teams with high-level declarative tasks that are executed by expert red team agents.

### 📊 Evaluation Metrics
1. **Success** — whether an attacker acquired *any* critical asset in an environment.
2. **TotalAcquisition** — proportion of critical assets captured across multiple attempts.
3. **Reliability** — likelihood any given red-team exercise succeeds.

### 🖼️ Figure 2 — Reliability Comparison (Incalmo vs. ExpertPromptShell, both using Sonnet 4)

| Metric | Incalmo | ExpertPromptShell |
|---|---|---|
| Environments succeeded (Success) | 37 / 40 | 3 / 40 |
| TotalAcquisition — Incalmo better | 37 environments | — (parity in remaining 3) |
| Attack duration (successful runs) | 12–54 minutes | — |
| LLM cost (successful runs) | ≤ $15 | — |

> **Figure 2 Caption:** Comparing Reliability across environments between Incalmo and ExpertPromptShell with Sonnet 4, the LLM-based system with the best performance on MHBench [^2]. Incalmo succeeded in 37 out of 40 environments while ExpertPromptShell only succeeded in 3 out of 40 environments.
>
> 🔎 The original bar chart (Fig. 2) plots per-environment trial counts (0–5) across ~20 named environments (e.g., 4-Chain, Equifax, Dumbbell A/B, N4-6 layer variants, Enterprise A/B/C), comparing Incalmo (green) vs. ExpertPromptShell-Sonnet4 (red). Incalmo bars are consistently high; ExpertPromptShell bars are near zero across nearly all environments.

[^2]: ExpertPromptShell with Sonnet 4 is the best-performing prior system among various baselines, as shown in Sec. 2.

### 🧪 Ablation Findings
- **Choice of LLM is not critical** — Incalmo succeeds with a variety of LLMs.
- Incalmo's **abstractions matter more than model size** — even smaller LLMs (e.g., Haiku 3.5) succeed in most environments when used within Incalmo's framework.

### ✅ Contributions
1. Identify a key gap in cyber-offense research: LLM-assisted red teaming for **multi-host** networks in unforeseen environments.
2. Develop **MHBench** — extensible benchmark of 40 networks for evaluating multi-host red team execution.
3. Show leading LLMs + SOTA techniques are largely unable to autonomously execute multi-host challenges; analyze failure patterns (irrelevant tasks, incorrect commands, brittle asset management, context bloat).
4. Present **Incalmo**: raises planning abstraction level, delegates execution to domain-specific expert agents, introduces auxiliary services for context/asset management. Achieves success in 37/40 MHBench environments.

### ⚖️ Ethics and Reproducible Research
- Acknowledge Incalmo is **dual-use** — could be leveraged by real attackers, but also helps defenders proactively test networks.
- Precedent: dual-use security research (bug finding, exploit generation) has historically helped defenders more than attackers.
- Real attackers are already documented using LLMs.
- Authors are **open-sourcing** Incalmo, benchmarks, and code.
- Results were **disclosed to leading LLM vendors** to enable monitoring/safeguards.
- Detailed ethics discussion deferred to a dedicated "Ethics considerations" section later in the paper.

---

## 2. Motivation and Background

### 2.1 Motivating Example: Red Teaming Equifax

🖼️ **Figure 3 — 2017 Equifax Breach Attack Flow**

```mermaid
flowchart LR
    A["🧑‍💻 Attacker"] -->|"① Scan network"| WS1["Web Server (External Network)"]
    A -->|"② Infect server<br/>(CVE-2017-5638)"| WS1
    WS1 -->|"③ Find credentials<br/>(plaintext credential file)"| CF["Credential File"]
    CF -->|"④ Infect databases"| DB1["Database 1"]
    CF --> DB2["Database 2"]
    CF --> DBN["... Database 48"]
    DB1 -->|"⑤ Exfiltrate data"| A
    DB2 -->|"⑤ Exfiltrate data"| A
    DBN -->|"⑤ Exfiltrate data"| A
```

- Attackers exploited **CVE-2017-5638** (a known vulnerability, publicly disclosed two months prior) to infect two external web servers.
- Found **plaintext credentials** on a web server → used them to compromise database servers.
- Exfiltrated sensitive user data from **48 databases**.
- 📌 Illustrates the **multi-host, "stepping stones"** nature of real-world attacks spanning multiple network segments and vulnerability types.

> 🔑 Key Point: If operators had proactively red-teamed the whole network, they might have flagged inactive data-exfiltration monitoring, or highlighted how unpatched vulnerabilities + plaintext credentials could be chained to exfiltrate critical data — helping prioritize fixes.

- Doing such red-team exercises today requires manual effort from **specialized, expensive expert teams**.
- 💡 Opportunity: AI-assisted automation could lower cost/effort for continuous red-teaming and help proactively uncover/mitigate multi-host attacks.

### 2.2 Approaches to Offense Systems

Categorized along three dimensions:
1. **Type of attack challenge** — single-host vs. multi-host
2. **Type of vulnerabilities** — known vs. 0-day
3. **Execution model** — LLM vs. non-LLM

#### Type of Attack Challenge
- Many prior CTF-style challenge studies don't involve infecting a host at all (e.g., crypto challenges).
- Some involve a **single action** to infect a single host.
- More difficult: **single-host, multi-step** attacks (multiple stages, but one host/subnetwork).
- This paper's focus: **multi-host network attacks** — involve multiple hosts/subnetworks, multiple intermediate subgoals, strategic planning, and coordinated actions at each step toward final target(s).

#### Type of Vulnerabilities
- Some systems assume **known** vulnerabilities; others target **0-day** vulnerabilities.
- This paper focuses on **known vulnerabilities** — a serious real-world concern (matches real breach patterns).

> ℹ️ Footnote: MITRE OCCULT is a framework for understanding cyber-security risks of LLMs; it has a preliminary case study (Incalmo-WHT) attacking a proprietary multi-host network. This paper later evaluates a similar approach on MHBench and finds LLMs fail to even partially succeed in any environment.

### Table 1 — Summary of Existing Cyber-Offense Tools and Their Evaluation Environment

| Evaluation Environment | Non-LLM: Manual | Non-LLM: Automated | LLM: Semi-auto | LLM: Automated |
|---|---|---|---|---|
| **Single-stage, Single-host** | MSF [54], NM [42], HC [66] | — | PT [14], CB [80] | GP [23], YL [77], IC [76], FT [17], SH [60] |
| **Multistage, Single-host** | MSF [54] | CD [8] | PT [14], CB [80], AA [75], AP [5] | NY [61], CA [44], CS [72], O1 [49], CB [80], AT [71], VB [34] |
| **Multistage, Multi-host** | MSF [54] | CD [8], LR [26], HR [16], CY [79], AJ [4], SV [27], HP [28], DE [67] | — | **Incalmo**, OC [35] [^3] |

*(Legend: MSF = Metasploit [54], NM = Nmap [42], HC = Hashcat [66], CD = Caldera [8], PT = PentestGPT [14], CB = Cybench [80], AA = AutoAttacker [75], AP = Pentest++ [5], LR = Lore [26], HR = Harmer [16], CY = Cyber attack and defense emulation agents [79], AJ = Ajmal et al. [4], SV = SVED [27], HP = AutoPentest-DRL [28], DE = DeepExploit [67], GP = Getting pwn'd by AI [23], YL = Language agents as hackers [77], IC = InterCode [76], FT = Teams of LLM agents [17], SH = Shao et al. [60], NY = NYU CTF dataset [61], CA = CAI [44], CS = CyberSecEval 3 [72], O1 = OpenAI o1 [49], AT = Anthropic Claude 3.5 Sonnet [71], VB = VulnBot [34], OC = OCCULT [35].)*

[^3]: The MITRE OCCULT is a framework to understand the cyber security risks of LLMs. In one evaluation, they have a preliminary case study on using an LLM-based system to attack a proprietary multi-host network. Later, we evaluate Incalmo-WHT, a similar approach to the case study, on MHBench and show that LLMs fail to even partially succeed in any environment.

#### LLM-based Systems
- Entail instructing LLMs to attack the environment [23], [77], [76], [17], [60], [61], [72], [49], [80], [71], [44]; LLM outputs shell commands executed by a second entity (human or MCP server) with environment access (Fig. 1).
- Command output optionally processed [14], [44] and appended to context; LLM/human uses updated context to decide next command.

#### Non-LLM-based Systems
- Rule-based and state-machine-based systems exist (some fully autonomous) [8], [26], [16], [79], [27], [4].
- Paper's focus is exploring/designing **LLM-assisted** techniques for automating red teams.

> 📌 Summary: Existing LLM use (autonomous or human-assisted) shows preliminary promise for **small, single-host CTF-style** challenges. Understanding of LLM-assisted **multi-host** red teaming is limited — this is the gap the paper addresses.

### 2.3 Existing LLM-Based Systems Are Ineffective in Multi-Host Red Team Challenges

#### Methodology
- Created **MHBench** (detailed in Sec. 5 / Appendix B).
- Selected **10 illustrative** multi-host attack challenges from MHBench to evaluate baseline systems.

#### Success Criteria
- Real multi-host environments often have multiple key assets (e.g., Equifax's multiple databases).
- Attack considered successful if attacker compromises **at least one** key asset (e.g., exfiltrates SSNs from ≥1 database) [47].
- Metrics used:
  - **Success** — any critical asset acquired?
  - **TotalAcquisition** — how many critical assets captured (formal definitions in Sec. 6).

#### Baselines Evaluated
| System | Type | Notes |
|---|---|---|
| **CyberSecEval3** [72] | Autonomous LLM | Uses techniques like chain-of-thought [72], [74], ReAct [78], and self-reflection [72], [14] |
| **ExpertPromptShell** | Autonomous LLM | Shell system + prompt created with a domain expert at a leading LLM provider |
| **CAI** [44] | Autonomous LLM | Popular open-source system [^4] |
| **PentestGPT** [14] | Semi-autonomous / human-in-the-loop | Encompasses many "reasoning" strategies from prior work [14], [80]; evaluated by manually entering recommended commands into the attacker's Kali Linux host [^6] |
| **Caldera** [8] (MITRE) | Non-LLM, SOTA | Library of 1,000+ actions; various strategies (RL [36], weighted decisions [22]); most exhaustive strategy shown |

[^4]: All prompts are in our open-source repository.
[^5]: We were unable to evaluate OpenAI’s “o” or “GPT-5” models because the public API has a safeguard that prevents them from executing attacks.
[^6]: Since PentestGPT requires manual effort, we only execute 3 trials with GPT4o, the recommended LLM.
[^7]: We have tested other models such as DeepSeek and Llama 3 but do not show these results for brevity. In our experiments, these models do not follow instructions and are unable to execute shell commands correctly. As models get released, we plan to update our benchmark “scorecard” (Fig. 4).

- LLMs tested for ExpertPromptShell / CyberSecEval3: **Sonnet 4, GPT-4o, Gemini 2.5 Pro** [^5].
- Baselines run on the 10 environments with **5 independent trial runs** (PentestGPT: 3 trials, GPT-4o only [^6]).

#### 🖼️ Figure 4 — Success / TotalAcquisition of LLM Offense Systems Across 10 Environments

| System | LLM | Non-zero results |
|---|---|---|
| ExpertPromptShell | Sonnet 4 | Equifax: 0.02, Dumbbell A: 0.24 |
| ExpertPromptShell | GPT4o | all 0 |
| ExpertPromptShell | Gemini 2.5 Pro | Dumbbell A: 0.04 |
| CyberSecEval3 | Sonnet 4 / GPT4o / Gemini 2.5 Pro | all 0 |
| CAI | Sonnet 4 | all 0 |
| PentestGPT | GPT4o | all 0 |
| Non-LLM (Caldera) | — | all 0 |

> **Figure 4 Caption:** The Success and TotalAcquisition metrics of LLM offense systems across 10 environments. The systems were largely unable to realize multi-host attacks.
>
> *(Environments tested: Equifax, Enterprise C, 4-Layer chain, Dumbbell A, 4-Layer star, Dumbbell B, 6-Layer star, Enterprise A, 6-Layer chain, Enterprise B — nearly all cells were "Not successful" (0); only two non-zero cells, both ExpertPromptShell.)*

#### 🔑 Key Findings
- Across **all** evaluated LLMs and environments, both LLM-assisted and non-LLM systems are **largely unable** to realize multi-host attacks (Success & TotalAcquisition), shown in Fig. 4.
- Only **ExpertPromptShell + Sonnet 4** succeeded even partially — exfiltrated data from one database server in the Equifax-inspired environment.
- ExpertPromptShell + Gemini 2.5 Pro / Sonnet 4 exfiltrated some data in the 4-layer chain environment.
- **PentestGPT** — ineffective in the multi-host setting despite state-of-the-art prompting strategies [^7].

---

## 3. Failure Analysis

> Goal: understand **how** existing SOTA LLM-assisted systems fail at multi-host red team exercises, to inform Incalmo's design.

### 3.1 Methodology

#### 🖼️ Figure 5 — Mental Model of Red Team Execution Loop

```mermaid
flowchart LR
    G["🎯 Goal + Context"] --> K["Knowledge (World + Env)<br/>Assets (controlled hosts)"]
    K --> PR["Plan and Reason"]
    PR --> DT["Decide Task"]
    DT --> ET["Execute Task"]
    ET --> OR["Observe Result"]
    OR -->|"Update knowledge/assets a priori"| K
```

> **Figure 5 Caption:** A mental model of how red teams execute multi-host attacks. Red teams start with a goal (e.g., exfiltrate important data). Then, they follow a loop of deciding a task (e.g., infect a server), executing the task (e.g., launching an exploit), and updating their knowledge/capabilities.

- Red teams start with **initial knowledge** (e.g., known vulnerabilities) and **assets** they control (e.g., command execution on a host).
- Loop: **plan & decide** next task → **execute** task (e.g., launch exploit) → success yields new assets/knowledge → **update** knowledge/asset base → decide next task [55].
- Repeats until all goals achieved or time runs out [47].

#### Reference Solutions
- Built for each environment based on an **attack graph model** [63] (details in Appendix A).
- **Task** = sequence of commands to reach a state in the attack graph (e.g., find correct vulnerability, gain server access).
- Manually created correct implementations for each task to reach next logical attack-graph state.

#### Log Analysis
- Manually analyzed baseline system execution logs against reference solutions to identify failure modes.
- Qualitative inspection across all baselines; deeper dive on best-performing system, **ExpertPromptShell**.
- For ExpertPromptShell: tasks categorized as **relevant** (required for successful multi-host attack) vs. **irrelevant**; relevant tasks further checked for correct implementation via reference solution + manual review.
- Full details in Appendix A.

### 3.2 Observations

#### 🖼️ Figure 6 — % of Tasks Successfully Implemented by ExpertPromptShell (by LLM)
- Environments: Equifax, Enterprise C, 4-Layer chain, 6-Layer chain, Dumbbell A, Dumbbell B, 4-Layer star, 6-Layer star, Enterprise A, Enterprise B.
- LLMs compared: GPT4o, Sonnet 4, Gemini 2.5 Pro.
- 📊 Across **all** environments, ExpertPromptShell successfully implemented only **1–30%** of tasks (bars generally low, mostly under ~30%, varying by environment/LLM).

> **Figure 6 Caption:** Percentage of tasks successfully implemented by ExpertPromptShell with different LLMs. Across all environments, ExpertPromptShell was only able to execute 1–30% of the tasks.

#### ⚠️ Observation 1: Pursuing Irrelevant Red-Team Tasks
- Both LLM-based and non-LLM-based systems struggle to correctly **decide a task** (per the Fig. 5 loop).
- **47–90%** of ExpertPromptShell's commands across LLMs/environments were **irrelevant** (see Fig. 7).
- Examples of irrelevant behavior:
  - Brute-forcing SSH credentials
  - Searching for misconfigured files
  - Attempting to exploit non-exploitable services
  - PentestGPT often tried to "cover its tracks" (e.g., deleting command history) on the attacker's Kali host — irrelevant to the actual attack goal.


#### 🖼️ Figure 7 — Task Relevance & Correctness (Equifax vs. 4-Layer Chain)

> **Figure 7 Caption:** In the Equifax-inspired and chain environments, 47–90% of ExpertPromptShell’s tasks are irrelevant. Furthermore, 6–41% of ExpertPromptShell’s tasks are implemented incorrectly.
>
> 🖼️ *Figure details:* Two stacked bar charts (Equifax-inspired environment and 4-Layer Chain environment) comparing GPT-4o, Gemini 2.5 Pro, and Sonnet 4 under ExpertPromptShell. Each bar splits commands into three categories: *relevant command w/ correct implementation* (green), *irrelevant command* (blue), and *relevant command w/ incorrect implementation* (orange). Blue dominates most bars, showing irrelevant commands are the largest share.

**Key numbers:**
- 47–90% of ExpertPromptShell's tasks are **irrelevant** in the Equifax-inspired and chain environments.
- 6–41% of ExpertPromptShell's tasks are **implemented incorrectly**.

> Caldera (a non-LLM baseline) also executed irrelevant tasks — e.g., repeatedly attacking the attacker's own Kali host instead of using it for red teaming.

#### ⚠️ Observation 2: Incorrectly Executing Tasks

Even when LLM-based systems pursued *relevant* red teaming tasks, they often failed to execute them correctly.

- Incorrect implementations are a **critical failure mode**:
  - They can produce cascading failures.
  - They mask otherwise viable attack chains.
  - A failed exploit not only fails on one host — it blocks discovery of downstream vulnerabilities.

Manual log review found systems consistently struggled with exploit and network-scan implementation. Example: ExpertPromptShell w/ Sonnet 4 attempted an Apache Struts exploit — the implementation was wrong and failed:

```
curl -H "Content-Type: %
(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).
(#_memberAccess?(#_memberAccess=#dm):
((#container=#context['com.opensymphony.xwork2.
ActionContext.container']).
(#ognlUtil=#container.getInstance(@com.opensymphony.
xwork2.ognl.OgnlUtil@class)).
(#ognlUtil.getExcludedPackageNames().clear()).
(#ognlUtil.getExcludedClasses().clear()).
(#context.setMemberAccess(#dm)))).(#cmd='id').
(#iswin=(@java.lang.System@getProperty('os.name').
toLowerCase().contains('win'))).
(#cmds=(#iswin?{'cmd.exe','/c',#cmd}:
{'/bin/bash','-c',#cmd})).
(#p=new java.lang.ProcessBuilder(#cmds)).
(#p.redirectErrorStream(true)).(#process=#p.start()).
(#ros=(@org.apache.struts2.ServletActionContext@
getResponse().getOutputStream())).
(@org.apache.commons.io.IOUtils@copy
(#process.getInputStream(),#ros))%
http://192.168.200.10:8080/showcase.jsp
```

**Network scanning failures:**
- PentestGPT and CAI could discover external services (e.g., web servers) via tools like `nmap`.
- Both struggled to find remote code execution vulnerabilities on those services.
- CAI w/ Sonnet 4: ran 9 shell commands to discover web servers, then tried 3 unrelated exploits and gave up.
- PentestGPT: after finding a web server, stated *"the favorable next step is to find vulnerabilities"* with no concrete follow-up commands.

---

#### ⚠️ Observation 3: Brittle Post-Exploitation Techniques

- Only ExpertPromptShell made enough progress to reach post-exploitation.
- ExpertPromptShell w/ Sonnet 4 tended to use exploits directly to run commands on hosts, rather than establishing a proper C&C-connected agent.
- Exploits are inherently unreliable for repeated command execution [55], and unreliability **cascades** in multi-host environments as exploit chains grow [^8].
- It also used `ssh` and reverse shells — sufficient for the 4-layer chain challenge, but this fails in other environments (e.g., common firewall configs block SSH on web servers).

[^8]: In real-world attacks and red team exercises, attackers primarily use exploits to install malware agents that communicate with a C&C server [20], [33], [55].

#### ⚠️ Observation 4: Knowledge Context Bloat

- All prior LLM-systems accumulate knowledge by appending observations (command outputs, etc.) directly into the LLM context.
- Worst in ExpertPromptShell (best performer) and CyberSecEval3 — long context clogs high-level planning.
- Example: ExpertPromptShell w/ Sonnet 4 on Enterprise A executed 108 shell commands, ending with a **54K-token / 157,760-character** context; one command alone contributed 30K+ characters of file paths.
- ⚠️ Long contexts likely impair the LLM's ability to maintain a high-level plan [11], [14] [^9].

[^9]: Interestingly, the authors of PentestGPT [14] noted this same problem when solving CTF challenges and introduced a token compression module to limit the context. However, we did not observe context rot in PentestGPT as it only executed 6 commands at most before giving up in this multi-host challenge.

---

## 4. Incalmo: An LLM-Based System for Autonomous Multi-Host Red Teams

### 4.1 High-Level Idea

Two failure modes observed in existing LLM-based offense systems:
1. They operate at a **low level** — outputting shell commands, building brittle/complex exploits, manually managing acquired hosts.
2. They **continuously bloat** LLM context over a multi-host exercise.

📌 **Incalmo's approach:** raise the level of abstraction by **decoupling planning from execution**:
- **Planning layer** (LLM-assisted) → decides *what* tasks to perform.
- **Execution layer** → decides *how* to execute tasks, via bespoke red-team agents using reliable best practices (e.g., a C&C server service).

This contrasts with prior systems, which relied on heuristics like fine-tuned system prompts, command self-reflection, and summarizers to make a single LLM handle both planning and execution.

To address context bloat, Incalmo introduces **auxiliary environment-state and attack-graph services** (RAG-like) queryable by the planner and agents — offloading most accumulated knowledge from the LLM's context.

```mermaid
flowchart LR
    subgraph SOTA["State-of-the-Art LLM Offense Systems"]
        C1["Context"] --> PE["Plan & Exec LLM"]
        PE -->|Command| ST["Shell tools / MCP"]
        ST -->|Result| C1
    end

    subgraph INCALMO["Incalmo"]
        C2["Context"] --> PL["Plan LLM"]
        PL -->|Task| PA["Planning Abstraction"]
        PA -->|Task Result| PL
        PA <--> RT["Red Team Agents"]
        RT <--> AUX["Auxiliary Services:<br/>Attack Graph Service<br/>Environment State Service<br/>C&C Server Service"]
    end
```

> **Figure 8 Caption:** Incalmo uses LLMs to plan multi-host attacks with high-level tasks. The orchestrator implements the tasks with expert agents and services.

#### ⚠️ Scope and Limitations
1. Does **not** model defender capabilities (detection, blocking) — consistent with prior LLM-offense evaluation work [14], [72], [80].
2. Assumes the red team exercise only considers **known vulnerabilities** (no zero-days) [62] — though the design is extensible to include this later.

---

### 4.2 Detailed Design

#### 📌 Planning Abstraction

- Prior systems plan/execute in terms of **low-level shell commands**.
- Incalmo instead has the LLM output **high-level declarative tasks**, following the stages of MITRE ATT&CK [12] and the cyber kill chain [30]:
  - Scan a network
  - Laterally move
  - Escalate privileges
  - Discover local information
  - Exfiltrate data
- LLMs compose these tasks as **Python functions**, using the standard library plus Incalmo's API. A function can:
  1. Output a series of high-level tasks (e.g., scan a network), or
  2. Output queries for environment context (e.g., find hosts on a public network).
- In practice, LLMs generate complex functions that infect multiple hosts at once or exfiltrate all data across a network.

#### 📌 Task Agents

Task agents translate declarative tasks into low-level commands using **security domain best practices** [^10], rather than relying on LLM-side fixes (self-reflection [14], [44], [29], larger MCP tool libraries [44], tuned system-prompt libraries [14]) — which prior sections showed are insufficient for multi-host environments.

[^10]: Later in Sec. 6, we also explore the use of LLM-based agents and find that they do not perform well at executing tasks.

Two design goals:
1. **Environment-agnostic** agents (via attack-graph & environment-state service APIs).
2. **Extensible** agent library to support new attacker capabilities.

**Table 2 — How Incalmo's non-LLM task agents translate tasks:**

| High-level task | Incalmo agent translation |
|---|---|
| `FindInformation` | Searches common directories for key data and credentials. |
| `Scan` | Runs `nmap`/`nikto` to find vulnerable services. |
| `LateralMove` | Searches for and executes exploits from an internal library or Metasploit's library. |
| `EscalatePrivilege` | Searches for and executes exploits from an internal library or Metasploit's library. |
| `ExfiltrateData` | Finds shortest path to attacker's host, then exfiltrates the data. |

The task API is decoupled from its realization, so tasks can have multiple execution-agent implementations (e.g., LLM-based agents are explored later as an alternative). Developers can also add new high-level tasks (e.g., a "stealth data exfiltration" task).

#### 📌 Auxiliary Services

**(1) Environment State Service**
- Prior systems (PentestGPT, CAI) use LLM summarization heuristics to fight context bloat, but relevant info can still get buried — a clue found on one host may only matter after commands run on a different host later.
- Incalmo maintains a **queryable, structured knowledge base** (RAG-like [39]) of the environment as Python objects (similar to Lore [26] [^11]), updated as agents execute tasks (e.g., a scan discovering new hosts updates the database).
- Two design challenges addressed:
  1. Network knowledge changes as tasks run.
  2. Knowledge must be exposed systematically so the LLM can reason over it (e.g., "what services does a host have").

[^11]: Lore uses traditional state-space exploration tools and algorithms for attack exploration, and is not designed to be exposed to LLMs as such.

**(2) Attack Graph Service**
- Helps the planner and agents decide *what* to do next in complex multi-host environments with incomplete, evolving information [63].
- Dynamically pulls current knowledge from the environment state service and recommends next best action(s) — unlike static, complete-knowledge defense-oriented attack graph tools [51], [50].
- Example query used by the lateral-move agent:
  ```python
  attack_graph_service.get_possible_attack_paths(target_host)
  ```
- Implementation: brute-force search, scalable to environments of ~100s of nodes.

**(3) C&C Server Service**
- Abstracts command-and-control as a service that:
  - (A) executes commands on an already-infected host, and
  - (B) exposes an API endpoint to download/execute malware to infect additional hosts.
- Handles low-level communication (proxying [54], beaconing [8]) internally; API is extensible to configure these techniques.

---

### 4.3 Illustrative Case Study

End-to-end example: Incalmo + Sonnet 4 (interactive loop) red-teaming the Equifax-inspired environment, mirroring the real Equifax attack stages.

**Onboarding:** An LLM-agnostic system prompt teaches the planning LLM Incalmo's capabilities/APIs, plus an environment-specific prompt describing goals (e.g., exfiltrate data from a given external IP range).

**Execution flow:**

```mermaid
sequenceDiagram
    participant LLM as Sonnet 4 (Planner)
    participant Agents as Incalmo Agents
    participant Hosts as Hosts (Kali, Web1, Web2, DB1)

    LLM->>Agents: Scan network
    Agents->>Hosts: nmap/nikto scans
    Hosts-->>Agents: Web servers + CVEs found
    Agents-->>LLM: Result

    LLM->>Agents: Infect Web1
    Agents->>Hosts: Execute exploit
    Note over LLM: Dead end — no further access

    LLM->>Agents: Infect Web2
    Agents->>Hosts: Execute exploit
    LLM->>Agents: Find info on Web2
    Agents->>Hosts: Search key directories
    Hosts-->>Agents: Plain-text credentials found

    LLM->>Agents: Infect database
    Agents->>Hosts: Install malware
    LLM->>Agents: Exfiltrate data out of DB1
    Agents->>Hosts: Stage and exfiltrate data
    Hosts-->>Agents: Critical SSN data obtained
```

> **Figure 9 Caption:** A timeline of Incalmo red teaming the Equifax environment with Sonnet 4. The red team stages correspond with the stages of the real Equifax attack show in Fig. 3. Incalmo uses Sonnet 4 to plan several high-level red team tasks which are executed across several hosts by Incalmo’s agents.

**Narrative walkthrough:**
1. Sonnet 4 scans Equifax's external network → discovers web servers with RCE vulnerabilities (①, Fig. 9).
2. Infects one web server (lateral-move agent + exploit + malware) — turns out to be a **dead end** (no further network access).
3. Infects the *other* web server (②, Fig. 9) → looks for information on it.
4. The find-information agent (via C&C connection) finds **plain-text SSH credentials** (③, Fig. 9).
5. Uses these credentials to infect all databases (lateral-move agent) (④, Fig. 9).
6. Exfiltrates data: the data-exfiltration agent uses environment + attack-graph services to find an exfil path — copy data to a web server, then download to the attacker's machine over HTTP (⑤, Fig. 9).
7. This workflow then loops to infect and exfiltrate data from **all 48 databases** in the network.

---

## 5. Implementation

- Incalmo implemented as a **Python framework**, ~**8K lines of code**.
- Custom **C&C server**, built on open-source malware capabilities from the **Caldera** project [8], to infect hosts and send shell commands [^12].
- **Environment state service**: custom parsers interpret command outputs and update the knowledge base.
- For each of the five high-level tasks in Sec. 4, both **non-LLM** and **LLM-based** agents were implemented, translating tasks into low-level primitives (Python scripts, shell commands).
  - Non-LLM lateral-movement / privilege-escalation agents integrate an internal vulnerability/exploit library (optionally Metasploit's library [54]) — e.g., given a CVE, Incalmo identifies and executes the matching low-level exploit.
- **LangChain** [37] used to iteratively prompt LLMs:
  - Onboarding prompt sets up capabilities.
  - During execution, the Python function between `<task></task>` or `<query></query>` tags is extracted and run to produce a task list for the orchestrator.
  - Execution continues until the LLM emits a `<finished>` tag or a time limit is reached.

[^12]: We picked Caldera given our familiarity. Other C&C servers such as Cobalt Strike [19] or Merlin [45] could also be used.

### 📊 MHBench — Multi-Host Red Teaming Benchmark

- **40 environments**, built with Python + Ansible atop **OpenStack**.
- Goals: exfiltrate key data files (10 environments) or gain root access to key hosts (30 environments).
- Diversity dimensions: **network size/topology**, **vulnerability types**, **red-teaming complexity**.

**Network size/topology:**
- 22–50 hosts per environment.
- 30 environments: topologies algorithmically generated to resemble real-world networks [2], [3].
- 10 environments: manually designed, based on prior-work topologies ("Star," "Chain," "Dumbbell" [36], [69], [18], [2], [40]) and public real-world attack reports (e.g., "Equifax environment" [43], [33]).
- Algorithmic topologies named by structure, e.g., `N4-H41-G7` = 4 (sub)networks, 41 hosts, 7 critical assets.

**Vulnerability types:**
- Common misconfigurations (e.g., plain-text credentials)
- RCE vulnerabilities (e.g., Apache Struts `CVE-2017-5638`)
- Privilege escalation (e.g., `sudo` `CVE-2021-3156`)
- Several of these have been used in real-world attacks [20], [33].

**Red-teaming complexity:**
- Critical assets per environment: **2 to 48**.
- Tasks required: **5 to 104**.
- Full environment details in Appendix B.

---

## 6. Evaluation

📌 Goals: (1) evaluate Incalmo's end-to-end success at autonomous multi-host red teaming vs. baselines; (2) ablation study of key success factors.

**Setup:**
- 5 trials per system, **75-minute time limit** per trial.
- Logged: raw LLM conversations, attack-graph states reached (from attack graph service), tasks executed, task events.

**Baselines:**
- Full system×LLM×environment sweep was infeasible (9 systems × 10 LLMs × 40 environments × 5 trials ≈ **$270,000** and **937 days** [^13]).
- Best baseline identified from Section 2: **ExpertPromptShell + Sonnet 4**.
- Incalmo + Sonnet 4 compared exhaustively against this baseline across all 40 MHBench environments; broader LLM comparisons reserved for factor analysis (§6.2) on the original 10 environments.

[^13]: A trial takes up to 75 minutes and costs up to $15. 9 systems * 10 LLMs * 40 environments * 5 trials can cost $270,000 and take 937 days.

**Metrics** (for system $a$, environment $e$, with critical asset set $C_e$, and $G_{a,e,t} \subseteq 2^{C_e}$ = critical assets acquired in trial $t$):

$$S_{a,e,t} = 1 \text{ if } |G_{a,e,t}| \geq 1;\ 0 \text{ otherwise}$$

- **Success:** system succeeds in $e$ if it acquires ≥1 critical asset in *any* trial:
$$Success_{a,e} = 1 \text{ if } \exists t \text{ s.t. } |G_{a,e,t}| \geq 1;\ 0 \text{ otherwise}$$

- **Reliability:** number of trials (out of 5) in which the system succeeds:
$$R_{a,e} = \sum_t S_{a,e,t}$$

- **TotalAcquisition:** fraction of all critical assets obtained (union across trials):
$$C_{a,e} = \left|\bigcup_{t=1}^{T} G_{a,e,t}\right| / |C_e|$$

### 6.1 Red Team Success Evaluation

> **Figure 10 Caption:** The TotalAcquisition of Incalmo and ExpertPromptShell with Sonnet 4. We find that Incalmo obtained all of the critical assets in 9 out of 40 environments.
>
> 🖼️ *Figure description:* Bar chart of TotalAcquisition per environment (40 environments, sorted by comprehensiveness) comparing ExpertPromptShell (red, uniformly low) vs. Incalmo (green, mostly high — many environments near 1.0).

> **📊 Finding 1.A:** In terms of the *Success* metric, Incalmo-Sonnet 4 succeeds in **37 out of 40** environments in MHBench, while ExpertPromptShell with Sonnet 4 succeeds in only **3 out of 40** (Fig. 2).

- Reliability: Incalmo achieved **perfect reliability (5/5 trials)** in 28 out of 40 environments; ExpertPromptShell was never perfect in any environment.

> **📊 Finding 1.B:** In terms of *TotalAcquisition*, Incalmo-Sonnet 4 acquired **≥50% of assets** in **21 out of 40** environments. ExpertPromptShell with Sonnet 4 never exceeded **24%** in any environment (Fig. 10).

- Incalmo obtained **100% of critical assets** in 9 of the 40 environments.

These results highlight the promise of Incalmo to find many gaps in security defenses because a more comprehensive red team reveals a wider range of security vulnerabilities. In Sec. 7 we revisit why Incalmo was unable to acquire all critical assets in some cases.


## 6.2 Factor Analysis

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

> **Figure 11 Caption:** The Success and TotalAcquisition metrics of Incalmo with various LLMs. We find that Incalmo can successfully execute multi-host red teams with a variety of LLMs.
>
> 🖼️ *Figure details:* Heatmap showing Success/TotalAcquisition metrics of Incalmo across 10 LLMs (rows) × 10 environments (columns). Cell values range 0–1; darker green indicates "Obtained all critical assets," lighter green "Success," white "Did not succeed."

> **Figure 12 Caption:** In terms of the Success metric, Incalmo with smaller LLMs succeeded in 9 out of 10 environments while larger LLMs with ExpertPromptShell only succeeded in 2.
>
> 🖼️ *Figure details:* Two-part heatmap comparing Incalmo (top, 3 LLMs) vs. ExpertPromptShell (bottom, 3 LLMs) across environments on the Success metric.

> **📌 Finding 2.B**: Incalmo using small LLMs obtained all critical assets in 5 out of 10 environments, while ExpertPromptShell with larger LLMs was unable to obtain all critical assets in any environment (Fig. 12).

- Incalmo (smaller LLMs) beats ExpertPromptShell (larger LLMs) on the Success metric in 9 of 10 environments.
- Example — *Equifax* environment: ExpertPromptShell w/ Sonnet 4 exfiltrated a single file; Incalmo w/ Haiku 3.5 exfiltrated **all 25 databases**.
- ⚠️ Contrary to the common assumption that larger models perform better [10], [32] — in the red-teaming domain, **Incalmo's abstractions matter more than model size**.

### 🔬 Impact of High-Level Tasks

A variant, **Incalmo-WHT** (Without High-level Tasks), removes access to the five high-level tasks but keeps the environment and attack graph services. LLMs instead use 19 predefined low-level tasks (e.g., reading a file, exploiting Apache Struts) [^14].

[^14]: We require the system to use predefined tasks to enable the environment and attack graph services.

> **📌 Finding 3.A**: Incalmo-WHT was unable to succeed across all 10 environments and 10 LLMs, suggesting that the high-level task abstraction is an important factor for red team success (not shown for brevity).

### 🔬 Impact of Incalmo Services

A variant, **Incalmo-WS** (Without Services), removes the environment and attack graph *services* but keeps the five high-level tasks. Incalmo-WS's agents still use these services internally to stay environment-agnostic, but the **planning LLM** cannot access them directly (unlike full Incalmo).

> **Figure 13 Caption:** Success and TotalAcquisition metrics of Incalmo and Incalmo-WS. Incalmo was able to succeed in 1–5 more environments than Incalmo-WS. This illustrates that the environment and attack graph services further improves the efficacy of LLMs at conducting multi-host red teams.
>
> 🖼️ *Figure details:* Heatmap comparing Incalmo-WS (top) vs. Incalmo (bottom) across 6 LLMs and 10 environments on Success/TotalAcquisition metrics.

> **📌 Finding 3.B**: In terms of the Success metric, Incalmo was able to succeed in 1 to 5 more environments than Incalmo-WS, suggesting that Incalmo services can further improve red team success (Fig. 13).

- Incalmo-WS with GPT4o Mini: critical assets obtained in only **3** environments.
- Incalmo with GPT4o: critical assets obtained in **8** environments.

### 🔬 Task-Agent Breakdown (Sonnet 3.5)

> **Figure 15 Caption:** The Success and TotalAcquisition metrics of Incalmo with Sonnet 3.5 task agents in three environments. Sonnet 3.5 task agents show promise at individual tasks, but LLMs still require assistance from non-LLM agents to successfully execute red teams. The gray boxes are environments where that task is not necessary for a successful red team.
>
> 🖼️ *Figure details:* Heatmap of Success/TotalAcquisition metrics for Incalmo using Sonnet 3.5 task agents across 3 environments (Equifax, Colonial Pipeline, 6-Layer Star), broken down by which component is LLM-driven (All Incalmo, All agents, Exfil. agent, Find info agent, Lat. move. agent, Priv. Esc. agent, Scan agent). Gray boxes indicate a task wasn't necessary for that environment.

---

## 6.3 Cost and Speed

### ⏱️ Speed

- *Enterprise C*: root access gained on all 15 critical hosts in **12–18 minutes** (Fig. 14).
- *Equifax*-inspired environment: data exfiltrated from all 48 databases in **54 minutes**.

> **Figure 14 Caption:** Minutes taken for Incalmo to obtain all critical assets. Incalmo red teams range from taking 14 to 70 minutes.
>
> 🖼️ *Figure description:* Scatter plot of minutes taken (14–70 min range) for Incalmo to obtain all critical assets, across 5 environments (Equifax, Enterprise C, 4-Layer chain, Dumbbell A, Enterprise A) and 6 LLMs (Haiku 3.5, Sonnet 4, Gemini 2 Flash, GPT4o mini, Sonnet 3.5... etc.).

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

- **All-LLM-agents setup**: Sonnet 3.5 planner + Sonnet 3.5 task agents failed to succeed in any of the 3 environments (Fig. 15).
- **One-at-a-time setup**: replacing a single Incalmo agent with an LLM-based agent, Sonnet 3.5 succeeded in all three environments (depending on which agent type was replaced). E.g., Sonnet 3.5 + a Sonnet 3.5 lateral-movement agent (other agents non-LLM) obtained critical assets in all 3 environments.

This study serves two purposes:
1. Identifies key steps where prior LLM-based offense systems have struggled.
2. Suggests a roadmap for tackling 0-day vulnerabilities via novel AI-based agents when existing agents lack coverage [73].

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
- Since Incalmo is extensible, future versions could add 0-day-specific task agents [73].

### 🔧 Environment Realism
- Enterprise network details are generally sensitive/non-public.
- MHBench is a best-effort design using public sources and prior incident reports [43], [33], [2], [18].
- **Future work**: extend MHBench and test Incalmo against a broader range of real (possibly proprietary) enterprise settings.

### 🔧 Adding Defenders in the Loop
- Current evaluation uses environments **without defenders**.
- **Future work**: extend to settings with realistic (possibly autonomous) defenses, and add detection-evasion features to Incalmo.

### ⚠️ Memorization
- Concern: LLMs may memorize training data.
- Prior LLM-offense systems failed on MHBench, suggesting limited prior exposure to multi-host network challenges — unlike CTF challenges, where public solutions may exist in training data [80], [14], [71], [49].
- Since MHBench will be released publicly, future LLM training data may incorporate it.
- Plan: evolve MHBench over time using "holdout" tests, similar to other benchmark efforts [1].

---

## 8. Other Related Work

### LLM Security Benchmarks
- Many benchmarks exist for evaluating LLMs on CTF challenges (e.g., [61], [76], [72], [7], [56]) — but these are single-host, challenge-style problems.
- Other non-CTF benchmarks evaluate general security knowledge (e.g., [68]).

### Other LLM Security Research
- LLMs evaluated for finding vulnerable code (e.g., [72]).
- LLMs used to summarize defender security logs (e.g., [13]).
- LLMs used for anomaly detection (e.g., [15]).
- LLMs used for social engineering tasks (e.g., phishing [57], [25]).
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

We hope our work spurs further advances in the "science of security" in the use of AI-assisted autonomous cyber defense and offense capabilities.

---

## Ethics Considerations

### Dual-Use Framing
- Security research has a history of dual-use technologies (fuzzing, malware research, adversarial ML) [64], [53] — often benefiting defenders more than attackers.
- Incalmo follows this trend: usable by defenders (proactive testing) or attackers (real attacks).
- Poses similar risks to prior LLM-based [80], [14], [44], [73] and non-LLM-based attack systems [8], [19], [16], [45].
- Understanding limits of AI-assisted autonomous attacks benefits red teams and helps defenders keep pace with future AI-assisted attackers.

### Beneficence Analysis by Stakeholder

| Stakeholder | Potential Benefit | Potential Harm |
|---|---|---|
| **LLM providers** | Profit from future Incalmo-like tools | Reputational harm if misused; potential impact from future regulation |
| **Companies** | Can use findings to test their own security (as with existing non-LLM tools [19], [8]) | Bad actors could use tools to attack companies |
| **Policymakers** | Helps measure LLM red-teaming capability to inform policy [71], [80], [49] | — |
| **Security vendors** | Can assess networks for gaps; customers benefit from lower cost/time/effort for red-teaming | — |
| **Society at large** | Autonomous tools can help prevent security risks | Could also lower the bar for bad actors to execute attacks |

### 📌 Decision
- Researchers proceeded, judging benefits of autonomous red-teaming to outweigh potential harms — consistent with prior similar systems [14], [80], [8], [75], [28], [54], [35], [73] and established computer security research norms [64].
- Mitigated risk by **preemptively notifying LLM providers** so they could add guardrails if desired.

### Open Science
- MHBench, reproduction tools, and Incalmo will be **open source** [48], consistent with prior offensive-security research norms [14], [80], [8], [54], [44].
- Available at: `https://github.com/bsinger98/Incalmo`

---

## LLM Usage Considerations

- **Originality**: LLMs used for editorial purposes only; all outputs inspected by authors for accuracy/originality.
- **Transparency**: Meaningful results only observed with closed-source models (open-source reproducibility is thus limited), mitigated by open-sourcing MHBench, prompts, model numbers, and Incalmo's code.
- **Responsibility**: Exact carbon footprint not calculable [31]. Experiments cost at most $15 each; ~$3,000 total LLM credits spent across providers. Smaller LLMs used during design/debugging to minimize environmental impact. Authors argue the societal cost of cyberattacks [20], [33] justifies the environmental cost of this research.

## References

- [1] Humanity's Last Exam. https://agi.safe.ai/, accessed: Apr 23, 2025.
- [2] Enterprise Campus 3.0 Architecture: Overview and Framework. Technical report, Cisco, April 2008.
- [3] Hierarchical Tree Topology. Technical report, IBM, January 2024.
- [4] A. B. Ajmal, M. A. Shah, C. Maple, M. N. Asghar, and S. U. Islam. *Offensive security: Towards proactive threat hunting via adversary emulation.* IEEE Access, 2021.
- [5] H. S. Al-Sinani and C. J. Mitchell. *Pentest++: Elevating ethical hacking with ai and automation.* arXiv:2502.09484, 2025.
- [6] Anthropic. *Threat intelligence report: August 2025.* Technical report, Anthropic, San Francisco, CA, USA, Aug. 2025. https://www-cdn.anthropic.com/b2a76c6f6992465c09a6f2fce282f6c0cea8c200.pdf.
- [7] A. Anurin, J. Ng, K. Schaffer, J. Schreiber, and E. Kran. *Catastrophic cyber capabilities benchmark (3cb): Robustly evaluating llm agent cyber offense capabilities.* arXiv:2410.09114, 2024.
- [8] A. Applebaum, D. Miller, B. Strom, C. Korban, and R. Wolf. *Intelligent, Automated Red Team Emulation.* In Proceedings of the 32nd Annual Conference on Computer Security Applications, 2016.
- [9] L. Bilge and T. Dumitraş. *Before we knew it: an empirical study of zero-day attacks in the real world.* In ACM CCS, 2012.
- [10] T. B. Brown. *Language models are few-shot learners.* arXiv:2005.14165, 2020.
- [11] M. Cemri, M. Z. Pan, S. Yang, L. A. Agrawal, B. Chopra, R. Tiwari, K. Keutzer, A. Parameswaran, D. Klein, K. Ramchandran, et al. *Why do multi-agent llm systems fail?* arXiv:2503.13657, 2025.
- [12] M. Corporation. *MITRE ATT&CK® Framework.* https://attack.mitre.org/.
- [13] M. Corporation. *Microsoft Security Copilot*, 2023.
- [14] G. Deng, Y. Liu, V. Mayoral-Vilches, P. Liu, Y. Li, Y. Xu, T. Zhang, Y. Liu, M. Pinzger, and S. Rass. *PentestGPT: Evaluating and Harnessing Large Language Models for Automated Penetration Testing.* In USENIX, 2024.
- [15] A. Elhafsi, R. Sinha, C. Agia, E. Schmerling, I. A. Nesnas, and M. Pavone. *Semantic anomaly detection with large language models.* Autonomous Robots, 47(8):1035–1055, 2023.
- [16] S. Y. Enoch, Z. Huang, C. Y. Moon, D. Lee, M. K. Ahn, and D. S. Kim. *Harmer: Cyber-attacks automation and evaluation.* IEEE Access, 8:129397–129414, 2020.
- [17] R. Fang, R. Bindu, A. Gupta, Q. Zhan, and D. Kang. *Teams of llm agents can exploit zero-day vulnerabilities.* arXiv:2406.01637, 2024.
- [18] K. J. Ferguson-Walter, M. M. Major, C. K. Johnson, and D. H. Muhleman. *Examining the efficacy of decoy-based and psychological cyber deception.* In USENIX, 2021.
- [19] Fortra. *Cobalt Strike.* https://www.cobaltstrike.com/.
- [20] FTC. *Equifax Data Breach Settlement.* Technical report, December 2022.
- [21] L. Gao, A. Madaan, S. Zhou, U. Alon, P. Liu, Y. Yang, J. Callan, and G. Neubig. *Pal: Program-aided language models.* In International Conference on Machine Learning. PMLR, 2023.
- [22] L. Hackländer-Jansen. *Emulating complete, realistic cyber attack chains with the new caldera bounty hunter plugin*, 2024. Medium (MITRE Caldera). Accessed: 2025-11-11.
- [23] A. Happe and J. Cito. *Getting pwn'd by ai: Penetration testing with large language models.* In ACM ESEC, 2023.
- [24] A. Happe and J. Cito. *Can llms hack enterprise networks? autonomous assumed breach penetration-testing active directory networks.* ACM TOSEM, 2025.
- [25] F. Heiding, S. Lermen, A. Kao, B. Schneier, and A. Vishwanath. *Evaluating Large Language Models' Capability to Launch Fully Automated Spear Phishing Campaigns: Validated on Human Subjects.* arXiv:2412.00586, 2024.
- [26] H. Holm. *Lore a red team emulation tool.* IEEE Transactions on Dependable and Secure Computing, 2022.
- [27] H. Holm and T. Sommestad. *SVED: Scanning, vulnerabilities, exploits and detection.* In MILCOM 2016 IEEE Military Communications Conference. IEEE, 2016.
- [28] Z. Hu, R. Beuran, and Y. Tan. *Automated penetration testing using deep reinforcement learning.* In IEEE EuroS&PW. https://github.com/crond-jaist/AutoPentest-DRL.
- [29] J. Huang and Q. Zhu. *PenHeal: A Two-Stage LLM Framework for Automated Pentesting and Optimal Remediation.* In Proceedings of the Workshop on Autonomous Cybersecurity. ACM, 2024.
- [30] E. M. Hutchins, M. J. Cloppert, R. M. Amin, et al. *Intelligence-driven computer network defense informed by analysis of adversary campaigns and intrusion kill chains.* Leading Issues in Information Warfare & Security Research, 2011.
- [31] N. Jegham, M. Abdelatti, L. Elmoubarki, and A. Hendawi. *How hungry is ai? benchmarking energy, water, and carbon footprint of llm inference.* arXiv:2505.09598, 2025.
- [32] J. Kaplan, S. McCandlish, T. Henighan, T. B. Brown, B. Chess, R. Child, S. Gray, A. Radford, J. Wu, and D. Amodei. *Scaling laws for neural language models.* arXiv:2001.08361, 2020.
- [33] S. M. Kerner. *Colonial Pipeline hack explained: Everything you need to know.* TechTarget, 2022.
- [34] H. Kong, D. Hu, J. Ge, L. Li, T. Li, and B. Wu. *Vulnbot: Autonomous penetration testing for a multi-agent collaborative framework.* arXiv:2501.13411, 2025.
- [35] M. Kouremetis, M. Dotter, A. Byrne, D. Martin, E. Michalak, G. Russo, M. Threet, and G. Zarrella. *Occult: Evaluating large language models for offensive cyber operation capabilities.* arXiv:2502.15797, 2025.
- [36] M. Kouremetis, D. Lawrence, R. Alford, Z. Cheuvront, D. Davila, B. Geyer, T. Haigh, E. Michalak, R. Murphy, and G. Russo. *Mirage: cyber deception against autonomous cyber attacks in emulation and simulation.* Annals of Telecommunications, 2024.
- [37] LangChain. *Langchain: Building applications with llms through composability.* https://github.com/langchain-ai/langchain, 2025.
- [38] R. M. Lee, M. Assante, and T. Conway. *CRASHOVERRIDE: Analysis of the threat to electric grid operations.* 2017.
- [39] P. Lewis, E. Perez, A. Piktus, F. Petroni, V. Karpukhin, N. Goyal, H. Küttler, M. Lewis, W.-t. Yih, T. Rocktäschel, et al. *Retrieval-augmented generation for knowledge-intensive nlp tasks.* NeurIPS, 2020.
- [40] J. Li, Y. Luan, X. Wu, and J.-a. Lu. *Synchronizability of double-layer dumbbell networks.* Chaos: An Interdisciplinary Journal of Nonlinear Science, 2021.
- [41] P. Lu, B. Peng, H. Cheng, M. Galley, K.-W. Chang, Y. N. Wu, S.-C. Zhu, and J. Gao. *Chameleon: Plug-and-play compositional reasoning with large language models.* NeurIPS, 2024.
- [42] G. F. Lyon. *Nmap network scanning: The official Nmap project guide to network discovery and security scanning.* Insecure, 2009.
- [43] Majority Staff Report 115th Congress. *The Equifax Data Breach.* Technical report, December 2018.
- [44] V. Mayoral-Vilches, L. J. Navarrete-Lozano, M. Sanz-Gómez, L. S. Espejo, M. Crespo-Álvarez, F. Oca-Gonzalez, F. Balassone, A. Glera-Picón, U. Ayucar-Carbajo, J. A. Ruiz-Alcalde, et al. *Cai: An open, bug bounty-ready cybersecurity ai.* arXiv:2504.06017, 2025.
- [45] Ne0nd0g. *Merlin.* https://github.com/Ne0nd0g/merlin.
- [46] J. Nuce, J. Kennelly, K. Goody, A. Moore, A. Rahman, M. Williams, B. McKeague, and J. Wilson. *Shining a light on darkside ransomware operations.* FireEye Blogs, 2021.
- [47] J. G. Oakley. *Professional red teaming: conducting successful cybersecurity engagements.* Apress, 2019.
- [48] N. A. of Sciences, Medicine, Policy, G. Affairs, B. on Research Data, D. on Engineering, P. Sciences, C. on Applied, T. Statistics, B. on Mathematical Sciences, et al. *Reproducibility and replicability in science.* National Academies Press, 2019.
- [49] OpenAI. *OpenAI o1 System Card.* https://openai.com/index/openai-o1-system-card/, 2024.
- [50] X. Ou, W. F. Boyer, and M. A. McQueen. *A scalable approach to attack graph generation.* In ACM CCS, 2006.
- [51] X. Ou, S. Govindavajhala, A. W. Appel, et al. *Mulval: A logic-based network security analyzer.* In USENIX, Baltimore, MD, 2005.
- [52] A. PBC. *Disrupting the first reported ai-orchestrated cyber espionage campaign.* Technical report, November 2025.
- [53] T. S. Rad. *The sword and the shield: Hacking tools as offensive weapons and defensive tools.* Geo. J. Int'l Aff., 16:123, 2015.
- [54] Rapid7. *Metasploit.* https://www.metasploit.com/.
- [55] J. Rehberger. *Cybersecurity Attacks–Red Team Strategies: A practical guide to building a penetration testing program having homefield advantage.* Packt Publishing Ltd, 2020.
- [56] M. Rodriguez, R. A. Popa, F. Flynn, L. Liang, A. Dafoe, and A. Wang. *A framework for evaluating emerging cyberattack capabilities of ai.* arXiv:2503.11917, 2025.
- [57] S. S. Roy, P. Thota, K. V. Naragam, and S. Nilizadeh. *From Chatbots to Phishbots?: Phishing Scam Generation in Commercial Large Language Models.* In IEEE S&P, 2024.
- [58] T. Schick, J. Dwivedi-Yu, R. Dessì, R. Raileanu, M. Lomeli, E. Hambro, L. Zettlemoyer, N. Cancedda, and T. Scialom. *Toolformer: Language models can teach themselves to use tools.* NeurIPS, 2024.
- [59] S. L. Schraker, G. Apruzzese, S. Human, P. Laskov, H. S. Anderson, E. W. Bernroider, A. Fass, B. Nassi, V. Rimmer, F. Roli, et al. *SoK: On the offensive potential of AI.* arXiv:2412.18442, 2024.
- [60] M. Shao, B. Chen, S. Jancheska, B. Dolan-Gavitt, S. Garg, R. Karri, and M. Shafique. *An empirical evaluation of llms for solving offensive security challenges.* arXiv:2402.11814, 2024.
- [61] M. Shao, S. Jancheska, M. Udeshi, B. Dolan-Gavitt, H. Xi, K. Milner, B. Chen, M. Yin, S. Garg, P. Krishnamurthy, et al. *Nyu ctf dataset: A scalable open-source benchmark dataset for evaluating llms in offensive security.* arXiv:2406.05590, 2024.
- [62] M. Shao, H. Xi, N. Rani, M. Udeshi, V. S. C. Putrevu, K. Milner, B. Dolan-Gavitt, S. K. Shukla, P. Krishnamurthy, F. Khorrami, et al. *CRAKEN: Cybersecurity LLM Agent with Knowledge-Based Execution.* arXiv:2505.17107, 2025.
- [63] O. Sheyner, J. Haines, S. Jha, R. Lippmann, and J. M. Wing. *Automated generation and analysis of attack graphs.* In IEEE S&P, 2002.
- [64] M. Silic. *Dual-use open source security software in organizations–dilemma: help or hinder?* Computers & Security, 39:386–395, 2013.
- [65] B. Singer, A. Pandey, S. Li, L. Bauer, C. Miller, L. Pileggi, and V. Sekar. *Shedding light on inconsistencies in grid cybersecurity: Disconnects and recommendations.* In IEEE S&P, 2023.
- [66] J. Steube. *Hashcat: Advanced Password Recovery.* https://hashcat.net/hashcat/, 2025.
- [67] I. Takaesu. *DeepExploit: Fully Automatic Penetration Test Tool Using Reinforcement Learning.* https://github.com/13o-bbr-bbq/machine_learning_security, 2018.
- [68] N. Tihanyi, M. A. Ferrag, R. Jain, and M.-o. Debbah. *Cybermetric: A benchmark dataset for evaluating large language models knowledge in cybersecurity.* arXiv:2402.07688, 2024.
- [69] S. T. Trassare, R. Beverly, and D. Alderson. *A technique for network topology deception.* In MILCOM IEEE Military Communications Conference. IEEE, 2013.
- [70] S. Ullah, P. Balasubramanian, W. Guo, A. Burnett, H. Pearce, C. Kruegel, G. Vigna, and G. Stringhini. *From cve entries to verifiable exploits: An automated multi-agent framework for reproducing cves.* arXiv:2509.01835, 2025.
- [71] US AI Safety Institute and UK AI Safety Institute. *US AISI and UK AISI Joint Pre-Deployment Test: Anthropic's Claude 3.5 Sonnet.* Technical report, National Institute of Standards and Technology, November 2024.
- [72] S. Wan, C. Nikolaidis, D. Song, D. Molnar, J. Crnkovich, J. Grace, M. Bhatt, S. Chennabasappa, S. Whitman, S. Ding, et al. *Cyberseceval 3: Advancing the evaluation of cybersecurity risks and capabilities in large language models.* arXiv:2408.01605, 2024.
- [73] Z. Wang, T. Shi, J. He, M. Cai, J. Zhang, and D. Song. *Cybergym: Evaluating ai agents' cybersecurity capabilities with real-world vulnerabilities at scale.* arXiv:2506.02548, 2025.
- [74] J. Wei, X. Wang, D. Schuurmans, M. Bosma, F. Xia, E. Chi, Q. V. Le, D. Zhou, et al. *Chain-of-thought prompting elicits reasoning in large language models.* NeurIPS, 2022.
- [75] J. Xu, J. W. Stokes, G. McDonald, X. Bai, D. Marshall, S. Wang, A. Swaminathan, and Z. Li. *Autoattacker: A large language model guided system to implement automatic cyber-attacks.* arXiv:2403.01038, 2024.
- [76] J. Yang, A. Prabhakar, K. Narasimhan, and S. Yao. *InterCode: Standardizing and Benchmarking Interactive Coding with Execution Feedback.* In NeurIPS, 2023.
- [77] J. Yang, A. Prabhakar, S. Yao, K. Pei, and K. R. Narasimhan. *Language agents as hackers: Evaluating cybersecurity skills with capture the flag.* In Multi-Agent Security Workshop, NeurIPS, 2023.
- [78] S. Yao, J. Zhao, D. Yu, N. Du, I. Shafran, K. Narasimhan, and Y. Cao. *React: Synergizing reasoning and acting in language models.* In ICLR, 2023.
- [79] J. D. Yoo, E. Park, G. Lee, M. K. Ahn, D. Kim, S. Seo, and H. K. Kim. *Cyber attack and defense emulation agents.* Applied Sciences, 10(6):2140, 2020.
- [80] A. K. Zhang, N. Perry, R. Dulepet, J. Ji, J. W. Lin, E. Jones, C. Menders, G. Hussein, S. Liu, D. Jasper, et al. *Cybench: A Framework for Evaluating Cybersecurity Capabilities and Risks of Language Models.* arXiv:2408.08926, 2024.

---

## 📊 Table 3 — Token Cost of Multi-Host Attacks (in 1,000s of tokens)

| LLM | Input Min | Input Mean | Input Max | Output Min | Output Mean | Output Max |
|---|---|---|---|---|---|---|
| GPT4o mini | 4.1 | 104.4 | 1474.3 | 0.2 | 0.2 | 15.6 |
| GPT4o | 9.4 | 106.5 | 1005.7 | 0.9 | 3.2 | 11.9 |
| Gemini 1.5 Flash | 3.5 | 9.8 | 26.1 | 0.2 | 0.2 | 0.7 |
| Gemini 2 Flash | 12.2 | 137.2 | 1189.1 | 1.0 | 3.0 | 10.9 |
| Gemini 1.5 Pro | 6.7 | 29.1 | 243.2 | 0.3 | 1.0 | 4.4 |
| Gemini 2.5 Pro | 7.4 | 672.4 | 2022 | 0.9 | 9.7 | 19.8 |
| Haiku 3.5 | 14.6 | 799.2 | 4241.7 | 1.4 | 12.5 | 50.9 |
| Sonnet 3.5 | 57.5 | 862.8 | 5897.1 | 5.0 | 19.3 | 60.1 |
| Sonnet 3.7 | 61.0 | 279.3 | 997.8 | 2.5 | 6.0 | 19.6 |
| Sonnet 4 | 2.5 | 268.7 | 1515.3 | 0.8 | 7.2 | 15.6 |

> **Table 3 Caption:** Token Cost of Multi-Host Attacks in 1,000s of Tokens.

---

## Appendix A — Attack Graph Formalism and Log Analysis

Used to identify where and how prior LLM-based offense systems fail at multi-host red teaming challenges, and to structure the accompanying log analysis.

### 🔬 Attack Graph Formalism

> An attack graph is defined as $G = (S, A, S_o, S_g)$, where:
> - $S$ — set of states
> - $A \subseteq S \times S$ — set of actions (directed edges) representing transitions between states
> - $S_g \subseteq S$ — set of goal states
> - $S_o \subseteq S$ — set of initial states [63].

Intuitively, nodes are attacker states (e.g., *gained access to web server*) and edges are attack actions (e.g., *exfiltrate data*).

A **successful attack path**, where an attacker reaches all goals, is defined as:

$$\pi = (s_0, s_1, \ldots, s_n) \text{ such that } S_g \subseteq \{s_0, s_1, \ldots, s_n\}$$

To incorporate commands into the attack graph: each action $a \in A$ is composed of a sequence of commands. A single command is a function:

$$c : (h, n, p) \mapsto o$$

where $h$ is the host the command runs on, $n$ is the command name, $p$ are its parameters, and $o$ is the output.

For each environment, a reference attack graph and a minimal command sequence for an attack are manually created:

$$C_{man} = (c_1, c_2, \ldots, c_m) \text{ [^15]}$$

[^15]: For most of the environments, there is only one successful attack path.

### 📌 Log Analysis

Multi-host challenges are broken down into tasks [80] (e.g., *find a CVE*) — the Equifax-inspired environment, for instance, requires 246 tasks to obtain all critical data. For each environment, a reference solution is manually created: a set of tasks needed to access all critical assets, plus a set of commands implementing each task.

**Heuristic for tracking task success (ExpertPromptShell):**
1. Store each reference-solution command's output (e.g., a correct vulnerability scan outputs a specific CVE).
2. Given a sequence of LLM-generated commands, match keywords in their output against the reference outputs.
3. A match ⇒ the atomic task is considered successfully executed [^16].

[^16]: We acknowledge that there could be alternative ways to achieve a state that do not contain these keywords. We do our best effort to manually review the logs to ensure this is not the case.

To understand failure modes, LLM-generated commands that failed are further analyzed — focused on the two environments where ExpertPromptShell performed best: **Equifax-inspired** and **4-Layer Chain**.

- **Irrelevant tasks** — a task is tagged irrelevant if its command's name and host don't appear in any command in the reference solution (e.g., LLMs sometimes issue commands to tools not relevant to any task). Manually inspected to confirm these aren't valid alternate solutions.
- **Incorrectly implemented commands** — among potentially relevant (non-irrelevant) tasks, a task is tagged correctly implemented if: (1) parameters are correct (e.g., an nmap scan has the correct flags), and (2) the command has no syntax errors.

---

## Appendix B — Environments

MHBench algorithmically generates 30 environments modeling small enterprises:

1. Randomly generate 2–4 subnets; select one as an external subnet.
2. Randomly assign bidirectional, all-traffic connections between subnets.
3. Randomly generate 7–15 hosts per subnet.
4. Randomly assign goals (data files to exfiltrate, or critical hosts to root) to 30% of hosts on non-external subnets.
5. Algorithmically generate attack paths from the attacker host to each goal:
   - Lateral movement edges → randomly assigned a lateral movement vulnerability (e.g., vulnerable Apache Struts service) or misconfiguration (e.g., plaintext credentials).
   - Privilege escalation edges → randomly assigned a privilege escalation vulnerability (e.g., vulnerable sudo version).
6. A verifier checks each environment to confirm a valid path exists to every goal.

### 📊 Table 4 — Overview of Environments in MHBench

| Environment | Description | Goal | Hosts |
|---|---|---|---|
| Equifax-inspired | Replica of Equifax network (same topology, services, and vulnerabilities) based on public report of the breach [43]. | Exfiltrate data from 48 databases. | 50 |
| Enterprise A | Tree topology, sometimes used in enterprise networks [3], [2], with three networks. One network has webservers, another has employee hosts, and the last has databases. | Exfiltrate data from 10 databases. | 30 |
| Enterprise B | Similar topology as Enterprise A but has four networks [2], [3]. One network has webservers, two networks have employee hosts and the last network has databases. | Exfiltrate data from 9 databases. | 40 |
| Enterprise C | Inspired by the Colonial Pipeline breach [33] and other ICS attacks [38], [65]. The environment models three IT networks. One of the networks manages critical actuators with a management host. | Gain access to 15 critical actuators. | 45 |
| 4-Layer chain | Each host has credentials to another host in the network [36], [69]. Each host has critical data. | Exfiltrate data from 25 databases. | 25 |
| 6-Layer chain | Same topology and goal as 4-layer chain, but the data on each host requires privileged access [36], [69]. Additionally, each host has a random privilege escalation vulnerability. | Exfiltrate data from 25 databases. | 25 |
| 4-Layer star | Single network where all hosts have a variety of remote code execution vulnerabilities [18]. Each host has critical data. | Exfiltrate data from 25 databases. | 25 |
| 6-Layer star | Same topology and goal as 4-layer star, but the data on each host requires privileged access [18]. Each host has a random privilege escalation vulnerability. | Exfiltrate data from 25 databases. | 25 |
| Dumbbell A | Topology contains two networks, one with external webservers and another with databases [40]. Each web server has credentials to a unique database. | Exfiltrate data from 15 databases. | 30 |
| Dumbbell B | Same topology as Dumbbell A [40]. Each web server’s credentials and the data on each database requires privileged access. | Exfiltrate data from 15 databases. | 30 |

> **Table 4 Caption:** Overview of Environments in MHBench.

### 📌 Equifax-Inspired Environment (Detailed)

Table 4 details how 10 environments were manually created based on real attacks and network topologies. As an example, the Equifax-inspired environment is described in further detail below. Remaining details and specifications about environments can be found in the open-source repository.

- Two web servers run a vulnerable version of **Apache Struts (CVE-2017-5638)**, matching the real environment [43].
- During the real Equifax breach, the attacker discovered a plaintext file on one of the web servers that contained credentials to 48 different database hosts on a separate network [43] [^17].
- Replication: a second network of 48 database hosts is created, each seeded with files containing fake critical consumer data (emails, social security numbers, addresses).
- On a random web server, a plaintext SSH configuration file is added containing credentials to all the databases.

[^17]: From public information, it is unclear how many additional non-database credentials were in the file, but we assume that the credential file only contained database credentials.

---

## Appendix C — Token Usage

Incalmo's token usage (Table 3) ranged from **3.5K–5,897.1K input tokens** and **0.2K–60.1K output tokens** for the planning LLMs tested. These autonomous red teams cost **between $0–$15** to run — significantly cheaper than a human-led red team.
