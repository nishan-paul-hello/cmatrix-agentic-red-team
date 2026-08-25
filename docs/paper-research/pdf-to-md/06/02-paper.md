⚙️ Chunk 2 of the paper

## 4. Experiments

We evaluate computer-use agents (CUAs) across multiple models and observation spaces on the **HackWorld** benchmark, analyzing task completion rates and tool usage patterns to understand fundamental limitations in cybersecurity reasoning capabilities.

### 4.1 Experimental Settings

📌 **CUAs Evaluated**
- Proprietary models: Claude-3.5-Sonnet (2024), Claude-3.7-Sonnet (2025), Claude-4-Sonnet (2025), Claude-4-Opus (2025)
- Open-source GUI action models: UI-TARS-1.5-7B, Qwen-2.5-VL

All models were deployed on a server with A100 80GB GPUs using vLLM; the Kali virtual machine ran on a bare-metal AWS instance.

📌 **Observation Space Configurations**

| Configuration | Description |
|---|---|
| Screenshot | Full computer screen capture, default 1280×720, 16:9 aspect ratio |
| Screenshot + a11ytree | Screenshot combined with a structured text-based accessibility tree representation |
| Set-of-Marks | Visual prompting that segments the image into discrete, marked regions to aid visual grounding |

### 4.2 Result Analysis

#### 4.2.1 Overall Performance Evaluation

**Table 2 — Success rates of computer-use agents across observation spaces**

| Observation | Screenshot | Screenshot + a11ytree | Set-of-Marks |
|---|---|---|---|
| Claude-3.5-Sonnet | 2.78% | 5.56% | 2.78% |
| Claude-3.7-Sonnet | 11.11% | 8.33% | 11.11% |
| Claude-4-Sonnet | 0.00% | 0.00% | 0.00% |
| Claude-4-Opus | 5.56% | 5.56% | 2.78% |
| UI-TARS-1.5-7B | 0.00% | 0.00% | 0.00% |
| Qwen-2.5-VL-72B-Instruct | 0.00% | 0.00% | 0.00% |

> Results are measured on 36 distinct cybersecurity challenges.

📊 **Key Findings**

- **Recency ≠ better outcomes.** Claude-3.7-Sonnet achieves the highest average success rate (10.18%) — nearly double Claude-4-Opus (4.63%) and over triple Claude-3.5-Sonnet (3.71%).
- UI-TARS-1.5-7B and Qwen-2.5-VL-72B-Instruct show ~0% completion in almost all conditions.
- Claude-3.7-Sonnet's outperformance of the newer Claude-4 models questions the assumption that model size/recency guarantees higher task competence.

⚠️ **Control ability is not the main bottleneck.**
- Screenshot: mean success rate 3.89%
- Screenshot + a11ytree: mean success rate 3.97% (modest gain, e.g. for Claude-3.5-Sonnet)
- Set-of-Marks: mean success rate 3.17% (worst — abstract symbolic encodings may lose contextual cues)
- A one-way ANOVA across observation spaces shows the difference is **not statistically significant** (p > 0.1), reinforcing that perceptual fidelity is not the primary bottleneck.

> Implication: future CUAs should prioritize environment exploration, reasoning over feedback, and cybersecurity domain knowledge integration rather than perceptual input quality. The upper performance limit is primarily constrained by reasoning, planning, and tool orchestration capabilities.

🔬 **Inference-time scaling through exploration.** The best-performing CUA (Claude-3.7-Sonnet) solves more tasks (+5.6%) with additional steps (Table 4). Unlike prior CUA benchmarks that follow a fixed canonical trajectory, HackWorld has **no predefined solution path** — agents must explore, gather information, and iteratively test hypotheses; once enough evidence is collected, the flag can often be retrieved in just a few decisive steps.

#### 4.2.2 Tool Usage Analysis

**Table 3 — Tool usage by observation method and model**

| Observation | Model | % Used | Avg | Avg+ | Top 3 Tools |
|---|---|---|---|---|---|
| Screenshot | Claude-4-Sonnet | 44.44 | 0.97 | 2.19 | dirb, DirBuster, Burp Suite |
| Screenshot | Claude-3.7-Sonnet | 58.33 | 2.33 | 4.00 | dirb, Nikto, WhatWeb |
| Screenshot | Claude-4-Opus | 44.44 | 0.86 | 1.94 | dirb, DirBuster |
| Screenshot | Claude-3.5-Sonnet | 88.89 | 5.33 | 6.00 | dirb, Nikto, DirBuster |
| Screenshot + a11ytree | Claude-4-Sonnet | 38.89 | 0.86 | 2.21 | dirb, DirBuster, WhatWeb |
| Screenshot + a11ytree | Claude-3.7-Sonnet | 72.22 | 2.14 | 2.96 | dirb, DirBuster, Nikto |
| Screenshot + a11ytree | Claude-4-Opus | 38.89 | 0.72 | 1.86 | dirb, DirBuster, Netcat |
| Screenshot + a11ytree | Claude-3.5-Sonnet | 94.44 | 4.28 | 4.53 | dirb, DirBuster, Nikto |
| Set-of-Marks | Claude-4-Sonnet | 16.67 | 0.33 | 2.00 | dirb, DirBuster |
| Set-of-Marks | Claude-3.7-Sonnet | 69.44 | 2.08 | 3.00 | dirb, DirBuster, Nikto |
| Set-of-Marks | Claude-4-Opus | 19.44 | 0.36 | 1.86 | dirb, DirBuster, Nikto |
| Set-of-Marks | Claude-3.5-Sonnet | 91.67 | 4.28 | 4.67 | dirb, DirBuster, Nikto |

*% Used = share of trajectories using ≥1 tool; Avg = mean tools/trajectory; Avg+ = mean tools/trajectory excluding zero-tool cases.*

**Table 4 — Success rate (%) across step limits**

| Model | 15 steps | 50 steps | 100 steps |
|---|---|---|---|
| Claude 3.7 Sonnet | 11.1 | 11.1 | 16.7 |
| UI-TARS-7B | 0.0 | 0.0 | 0.0 |

📌 **Key Insights**

1. **Tool usage efficiency.** Frequent tool invocation ≠ high efficiency. Claude-3.5-Sonnet invoked tools in nearly all trajectories (88.89–94.44%) with 4–6 calls/trajectory on average, yet other models achieved comparable or better outcomes with fewer calls — selectivity matters more than raw frequency.
2. **Observation space has limited impact** on tool usage patterns; e.g., Claude-3.7-Sonnet and Claude-4-Opus show comparable invocation behavior across all three configurations.
3. **Inter-model contrasts dominate.** Differences in tool usage stem from model-specific strategies, not model scale or observation space — smaller/earlier models tend to be more selective than larger, recent ones.

> Overall: (1) selective tool usage is more informative than call frequency; (2) richer observation structuring (a11yTree, Set-of-Marks) yields limited benefit once basic perceptual fidelity exists; (3) model-specific reasoning strategy dominates over observation-space differences.

## 5. Related Work

### Computer-Use Agents (CUAs)

CUAs are AI systems that interact with digital interfaces via human-like actions (clicking, typing, navigating). Prior work has advanced visual grounding and GUI control:

- **OS-ATLAS** — cross-platform (desktop/web/mobile) foundation action model with large-scale GUI grounding data.
- **SeeClick** — shows pretraining on GUI grounding from screenshots improves downstream automation.
- **Aguvis** — pure-vision GUI agent with a unified, platform-generalizing action space.
- **OS-Genesis** — reverse task synthesis for constructing GUI trajectories without predefined tasks.
- **AgentTrek** — scales web-agent trajectories via guided replay of public tutorials.
- **OS-Copilot** — self-improving, cross-application agent spanning web, terminal, files, and office tools.
- **OpenCUA** — a systematic framework for scaling CUA annotations.
- **Learn-by-Interact** — data-centric adaptation pipeline synthesizing interaction trajectories.
- **UI-TARS-2** — scales multi-turn reinforcement learning for GUI-centered agents.

These works complement existing benchmarks (WebShop, MiniWoB++, Mind2Web, OSWorld) by strengthening perception–action coupling and improving training/systems.

⚠️ **Gap:** Current evaluations largely ignore security considerations — CUA behavior in risky scenarios (phishing content, sensitive data handling) remains underexplored. **HackWorld** addresses this by embedding security challenges within authentic computer-use contexts.

### Benchmarking Cybersecurity Capabilities

Prior approaches fall into three groups:

1. **Static question-answering** (multiple-choice datasets) — probe basic knowledge but offer limited insight into operational behavior and are sensitive to prompt formulation.
2. **Automated single-step exploitation** (e.g., AutoAdvExBench, CyberSecEval) — assess exploitation of adversarial defenses/code snippets, but miss extended adaptive attack sequences.
3. **Interactive, agent-based evaluation** (Capture-the-Flag style environments) — require multi-step reconnaissance, exploitation, and access maintenance, closely mirroring real attacker workflows. Recent frameworks combine simulations with structured attack-chain analysis.

HackWorld builds on the interactive CTF paradigm, uniquely targeting **general-purpose agent capabilities in realistic web security scenarios**, rather than specialized penetration-testing setups.

### Operational Security Evaluation

- **AI kill-chain** and **Agent Security Bench** formalize multi-stage attack simulation and exploit detection.
- **PentestGPT** and **EnIGMA** operationalize this by immersing agents in penetration testing, showing better tool use mitigates multi-step reasoning deficits.
- **WASP** focuses on explicit exploit detection.
- **PenHeal** extends evaluation to defensive remediation.

These collectively inform HackWorld's design principles of end-to-end attack simulation with integrated detection.

## 6. Discussion and Future Work

### ⚠️ Common Failure Patterns

Eight predominant failure modes identified in agent behavior:

1. **Ineffective tool selection and output parsing** — repeated/duplicate tool launches without analyzing prior outputs; clues (e.g., `robots.txt`, repository artifacts) detected but unused; errors led to arbitrary tool switching rather than diagnosis.
2. **Poor failure recovery and plan repair** — agents stalled or proceeded without fixing root issues on routine errors (HTTP 404/403/302); little variation in headers, methods, or encodings.
3. **Gaps in directory/source enumeration** — omitted systematic enumeration (dirb, DirBuster, gobuster) or failed to persist results for deeper investigation.
4. **Incomplete port/service mapping** — `nmap` runs often lacked `-p`/service versioning, producing partial service pictures.
5. **Lack of authentication bypass/session management** — failed to maintain sessions (cookies, CSRF) or attempt standard bypasses (weak creds, SQLi login, password reset, JWT tamper, IDOR, Host/Origin spoof).
6. **Misclassification of service types** — e.g., port 6080 often misread as native VNC rather than noVNC.
7. **Superficial SQL injection testing** — UNION-based attempts or `sqlmap` use without differential response analysis or clear success criteria.
8. **Knowledge-driven dead loops** — agents get stuck repeating ineffective actions without progress.

### From Perception to Strategy

- Neither Set-of-Marks nor a11y-tree consistently improved success — perception is not the bottleneck.
- Agents could "read" pages/tool outputs but failed to **aggregate clues** (e.g., `robots.txt`, exposed `.git`, differential HTTP codes) into a coherent exploit plan.
- Claude-3.7 succeeded more by selectively analyzing and reusing key clues while keeping tool usage focused rather than exhaustive.
- 📌 Future work should prioritize **strategic reasoning and decision-making** over improved perception.

### Challenging the Scaling Hypothesis

- Claude-4-Opus (larger/newer) underperformed relative to Claude-3.7-Sonnet, which achieved the best overall success.
- This challenges a naive scaling hypothesis for web-security tasks — **planning discipline and strategy control** matter more than raw model capacity, aligning with broader evidence questioning monotonic scaling in complex reasoning.

### Lack of Strategic Tool Use

- More tool calls ≠ better outcomes.
- Agents often cycled through scanners (dirb, Nikto, Wfuzz) with near-duplicate parameters or switched tools after minor errors instead of diagnosing them.
- Claude-3.5-Sonnet made the most tool calls under Set-of-Marks but had low success — indicating awareness of evidence needs without an effective action loop.

### Implications for Tool/Interface Design

Current CLI security tools are verbose, loosely structured, and error-opaque — mismatched for agent-oriented use. Recommended **Agent eXperience (AX)** principles:

- Machine-readable outputs (JSON/JSONL)
- Explicit state and error codes
- Persistent session/context hooks
- Asynchronous progress reporting for long tasks
- Standardized wrappers (e.g., MCP/Arazzo-style contracts) exposing tool inputs/outputs and next steps
- Canonical fields for scanning/fingerprinting (protocol, open ports, service/version, confidence, evidence snippets) to let agents carry results forward across tasks

## 7. Conclusion

HackWorld is a benchmark for systematically evaluating Cybersecurity Agents (CUAs) in exploiting web vulnerabilities.

- Even state-of-the-art models showed severe limitations: the top performer solved only **11.1%** of tasks.
- The core bottleneck is **not perceptual understanding** but a critical deficit in **strategic reasoning and tool orchestration** for vulnerability discovery and exploitation.
- HackWorld establishes a foundation for developing autonomous agents with more advanced penetration-testing capabilities.

## Ethics and Reproducibility Statement

- Cybersecurity evaluation frameworks are inherently **dual-use** — they can advance both defensive research and potentially enable malicious applications.
- HackWorld and the evaluated CUAs share these dual-use characteristics, warranting careful ethical consideration.
- Current agents show relatively low success (11.1% best case), but rapid model advancement may significantly raise future capabilities.
- 📌 The authors argue the benefits of public release outweigh the risks:
  1. Understanding current CUA capabilities is essential for defensive security research and informed AI policy decisions.
  2. Similar cybersecurity evaluation frameworks have already been publicly released.
