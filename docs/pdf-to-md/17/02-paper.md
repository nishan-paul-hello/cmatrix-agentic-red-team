⚙️ Chunk 2 of the paper

## 2.1 Enterprise Network Attacks

### 🎯 Initial Access
- Attacker starts inside the enterprise network but lacks Active Directory (AD) credentials; goal is to compromise an existing AD account.
- **Password Spraying**: uses a handful of common passwords (typically <3 per account) to avoid lockout, since brute-force is too risky (detection/lockout).
- **Kerberos AS-REP Roasting**: exploits weak crypto + common misconfiguration to obtain a password hash.
- **Passive network sniffing**: captures NTLM hashes.
- Captured hashes are cracked offline with tools like `hashcat` or `john-the-ripper`.

### 🔼 Lateral Movement & Privilege Escalation
- Compromised accounts are used to further enumerate AD, escalate privileges, and pursue **domain dominance** (domain admin access).
- Iterative methodologies (e.g., Mandiant Attacker Lifecycle) are favored over classic waterfall models like the Lockheed-Martin Cyber Kill Chain.
- Typical techniques:
  - **Kerberoasting** (targeting SPN-linked service credentials)
  - Searching network shares for exposed credentials
  - Abusing overly permissive AD schema permissions
  - Attacking network services such as MSSQL or Exchange

### 🛡️ Common Defenses
- **NIDS** (Network Intrusion Detection Systems) alert defensive personnel.
- **EDR** (Endpoint Detection and Response) — successor to traditional AV — automatically detects and quarantines attackers/tools using heuristics, fingerprinting, and behavioral analysis. Responses range from killing processes to isolating whole systems.
- Since attacks increasingly occur outside working hours, the paper focuses on automated EDR.
- **Microsoft Defender lineage**: introduced 2002 as a free AntiSpyware add-on → renamed Defender, shipped with Vista → superseded by Microsoft Security Essentials in Windows 7 → evolved into a full EDR, enabled by default from Windows 8 / Server 2016 onward, making it the dominant EDR today.

### 🗂️ Attack Taxonomy — MITRE ATT&CK
> A *classification* of attacks, not a testbed or methodology.

Three abstraction levels:
1. **Tactics** — high-level goals (e.g., Initial Access, Credential Access, Exfiltration) — 14 total.
2. **Techniques** — specific methods under each tactic (e.g., T1557: Adversary-in-the-Middle under Credential Access).
3. **Procedures** — concrete examples of how a technique is carried out.

---

## 2.2 Penetration Testing

Ethical hackers assess target security posture and report findings for remediation. Based on Happe & Cito's interview study, three main assignment types exist:

| Type | Goal | Visibility | Scope |
|---|---|---|---|
| **Vulnerability Scans** | Breadth, not depth (detect, don't exploit) | Loud (easily detected) | Very limited, often single system |
| **Internal Network Test** (Assumed Breach) | Breadth *and* depth via attack chains | Ranges loud → quiet | Whole internal network; attacker assumed already inside |
| **Red-Teaming** | Depth — a single customer-defined goal | Quiet/undercover | Whole company, often starts externally (e.g., social engineering) |

**Assumed Breach Simulations** rest on the premise that a breach is inevitable, so testing efficiency comes from focusing on what happens *after* initial compromise — the attacker tries to reach domain/forest admin.

### 🏋️ Testbeds for Assumed Breach Simulations
- **CTF (Capture-the-Flag)** exercises are seen by practitioners as good preparation that transfers to real pentesting work. Delivered as VMs or cloud instances; success is proven via a unique "flag" file.
  - Platforms: [TryHackMe](https://tryhackme.com/), [HackTheBox](https://www.hackthebox.com/)
- CTF-style testbeds are also used in professional certification exams (timeframes from 8h to a week), with goals like "compromise 4 of 5 domain controllers" or "become domain admin."
  - Certifications: OSCP, OSCE3, CRTO, CRTP, among others.

### 💰 Costs of Penetration Testing
- Average penetration tester salary (per Indeed.com): **$53.09/h**
- Penetration test firms typically charge clients **$100–$300/h**

---

## 2.3 LLM-aided Task Planning

### 🔬 Intra-Task Improvements (solving a single task)
- **Chain-of-Thought (CoT) prompting** (Wei et al.) — lets the model articulate intermediate reasoning steps before a final answer; strong when combined with few-shot examples.
- **Zero-shot CoT** (Kojima et al.) — simply appending "Let's think step by step," removing the need for hand-crafted examples.
- **Self-generated reasoning chains** (Zhang et al.) — the LLM itself iteratively produces reasoning chains, removing manual example curation entirely.
- **ReAct** (Yao et al.) — interleaves reasoning traces with task-specific actions, letting the model both plan and interact with external tools/information sources.
- **Reflexion** — converts environmental feedback into linguistic self-reflection used as context in the next episode, enabling learning from past mistakes.

### 🧠 Reasoning LLMs (LRMs)
- Models explicitly trained for native chain-of-thought reasoning (e.g., OpenAI o1-preview — announced Sept 2024, API access Dec 2024; also Alibaba Qwen3, DeepSeek R1).
- OpenAI describes training these models to "think longer and harder," improving strategizing and planning at the cost of longer inference time.
- ⚠️ Manually adding CoT prompting to reasoning models can *reduce* instruction-following performance (Li et al.); few-shot prompting is often discouraged for these models (dubbed "Boomer-Prompts" by OpenAI).
- **Task-difficulty findings** (Shojaee et al., puzzle environments):
  - Easy tasks → non-reasoning models outperform (reasoning models "over-think")
  - Moderate tasks → reasoning models outperform via methodical CoT
  - Hard tasks → both types fail
- Math olympiad findings (Petrov et al.) show reasoning models rely on pattern recognition rather than true mathematical reasoning, performing well mainly when similar data was in training.
- **Implication for this paper**: AD penetration-testing is assumed to be a *moderate-difficulty*, pattern-matchable task (well-represented in LLM training data), making reasoning LLMs a good fit.

### 🧩 Inter-Task Planning (splitting into subtasks)
- **Plan-and-Solve** (Wang et al.) — devise a plan to split a task into subtasks, then execute them; popularized by the open-source **BabyAGI** project. Applied to Linux privilege escalation by Happe & Cito.
- **Pentest Task Trees (PTT)** (Deng et al.) — a hierarchical, Markdown-like todo-list structure that both plans a pentest and records findings; validated on CTF-style challenges.

---

## 2.4 Automated Penetration Testing

### 🖥️ Traditional Automated Scanners
- Tools: `nmap`, OpenVAS, Nessus — noisy, checklist/rule-based, run large numbers of tests.
- Mainly enumerate but don't chain/exploit findings (e.g., a discovered credential file isn't automatically reused), limiting depth and breadth.
- **MITRE Caldera** — used in Purple-Teaming (attacker and defender collaborate) to emulate known APT tactics/techniques/procedures. Scope/technique selection is manually configured, not autonomously strategized, by design (to emulate documented APTs).

### 🤖 ML for Offensive Security (Non-LLM)
- **POMDPs** (Partially Observable Markov Decision Processes) showed early promise for automated pentesting but scaled poorly.
- **ChainReactor** (Pasquale et al.) — uses PDDL planning to find multi-step exploit chains in containers; fully enumerates a target, translates data to PDDL, applies manually written rules with an existing solver. Found two vulnerability classes (cron-job and systemd unit file permission issues) but required manual exploitation — **not** autonomous.

### 🧑‍💻 LLMs for Offensive Security (chronological overview)
- **Initial forays**: Happe & Cito — first autonomous LLM-driven control loop for Linux privilege escalation on a vulnerable VM. Concurrently, Deng et al. used LLMs to generate Pentest Task Trees and suggest commands for CTF machines, executed by a human operator with error-fixing agency.
- **Automated single-target exploitation**:
  - Happe et al. — extended privilege-escalation work with a benchmark and multiple LLM configurations (incl. Plan-and-Solve).
  - Fang et al. — LLMs hacking websites, later extended to one-day/zero-day vulnerability development.
  - Shao et al. — used the NYU CTF benchmark across tasks from cryptography to web pentesting.
  - Xu et al. — LLM-guided autonomous hacking tool built on MetaSploit.
  - Huang et al. — **PenHeal**, integrating offensive *and* defensive capabilities.
  - Additional CTF-style single-host benchmarks: Zhang et al., Gioacchini et al., Isozaki et al.
  - Further related work in progress: Wu et al., Muzsai et al. (section continues in next chunk).
