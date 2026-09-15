# Getting Pwn'd by AI: Penetration Testing with Large Language Models

**Authors:** Andreas Happe (andreas.happe@tuwien.ac.at), Jürgen Cito (juergen.cito@tuwien.ac.at) — TU Wien, Austria  
**Venue:** ESEC/FSE '23, Dec 3–9 2023, San Francisco, CA, USA  
**DOI:** [10.1145/3611643.3613083](https://doi.org/10.1145/3611643.3613083)  
**Keywords & CCS:** Security and privacy → Systems security | `security testing`, `penetration testing`, `large language models`

> 📌 **Abstract (paraphrased):** The paper investigates whether large language models (e.g. GPT-3.5) can serve as "AI sparring partners" for penetration testers. Two scenarios are examined: high-level planning of a security-testing engagement, and low-level vulnerability discovery inside a deliberately vulnerable VM via a closed feedback loop over SSH. The authors report encouraging early results, note directions for future work, and close with a discussion of the ethics of AI sparring partners.

---

## 1. Introduction

- 🔬 **Motivation:** Cybersecurity — and penetration testing specifically — faces a severe and *growing* talent shortage: workforce grew ~11% year-over-year but the skills gap grew faster (~26% YoY), citing the ISC2 2022 workforce study.
- A prior interview study of pen-testers found that human "sparring partners" (colleagues who can suggest alternative approaches) are valuable, and that intuition — often built through CTF[^1] experience — is central to finding vulnerabilities. The authors ask whether this intuition can be partly outsourced to an AI.
- The framing throughout is **augmentation, not replacement**: pairing a human operator with an AI creates new capability rather than simply cloning existing human skill, and keeping a human in the loop reduces ethical risk. The authors also note that AI-driven efficiency gains tend to be largest for less-experienced workers, suggesting AI pairing could particularly help novice testers.

[^1]: CTFs are gamified penetration-testing exercises.

> 🎯 **Research Question:** *To what extent can penetration testing be automated using LLMs?*

- **Approach:** The MITRE ATT&CK framework (a structured knowledge base of adversary Tactics, Techniques, and Procedures — "TTPs") is used as a scaffold for evaluating LLM capability. A good AI sparring partner should, in principle, be able to help across the whole TTP spectrum.
- Two experiment types were run:
  1. **High-level guidance** — asking an LLM/agent to plan a penetration test, both generically and against a real target organization.
  2. **Low-level guidance** — hooking GPT-3.5 up to a vulnerable VM to analyze system state and propose concrete attack steps.

### ⚠️ Scope / Ethical Boundaries Set by the Authors
- They deliberately did **not** explore LLM-generated phishing/vishing content, citing ethical concerns.
- They flag automated penetration-test **report generation** as another promising (and comparatively low-risk) application area, noting anecdotal evidence that testers are already using generative AI for this.

---

## 2. Background

### MITRE ATT&CK
- A curated, hierarchical knowledge base of adversary behavior, commonly abbreviated **TTP**:
  - **Tactics** — high-level adversary goals (e.g., reconnaissance, privilege escalation, collection).
  - **Techniques** — general ways of achieving a tactic (e.g., abusing `sudo` caching, Kerberoasting).
  - **Procedures** — the concrete, technique-specific implementation details.
- The authors' working assumption: an effective AI sparring partner needs to help at both the tactic/technique level (high-level) and the technique/procedure level (low-level).

### Large Language Models
- Neural networks trained via self-supervised learning on very large corpora; capability scales roughly with parameter count (ranging from single-digit billions like LLaMA at 7B up to trillions in models like Wu Dao or GPT-4).
- Whether ever-larger scale keeps paying off is an open debate: larger models can exhibit emergent behaviors [38], but there is also speculation that the era of ever-larger models faces reduced scaling efficiency [24].
- Training a frontier model from scratch is prohibitively costly for most researchers, which has driven the rise of reusable **"foundation models"** (highlighted by *The Economist* [11]) that can be adapted/fine-tuned relatively cheaply.

### GPT-3.5 / ChatGPT
- Interaction happens via natural-language "prompts," giving rise to the practice of **prompt engineering** [10, 22, 36, 40].
- Smaller, locally-runnable model tooling (e.g., `llama.cpp` [14], supporting models up to ~13B parameters on consumer-grade hardware) has enabled research and use without cloud/API costs or provider-side moderation and censorship.

### Pre-trained Autonomous AI Agents
Three examples of early autonomous-agent frameworks are discussed:

| Framework | Core Idea |
|---|---|
| **AutoGPT** [15] | Auto-generates its own instruction sequences by leveraging LLMs to create prompts from a concise initial user goal, reducing manual prompt engineering. Because LLMs hallucinate (invent statistically plausible facts), AutoGPT integrates external knowledge (web queries) and optional human feedback to mitigate hallucinations [29], converting tasks into subtask lists delegated to additional agents. |
| **BabyAGI** [26, 27] | Splits a user-given task into subtasks held in a task queue; a *Task Execution Agent* runs tasks and updates a memory store, a *Task Creation Agent* adds new subsequent tasks, a *Context Agent* supplies memory-based context before execution, and a *Prioritization Agent* orders the queue. All roles are instances of GPT-4. A minimal ~100-line Python version also exists [25]. |
| **Jarvis** (HuggingGPT) [33] | Coordinates multiple agents built on different underlying models to form a multi-modal, multi-agent system. |

---

## 3. LLM-Based Penetration Testing

The authors split their evaluation into two complementary levels:

- **High level:** questions like *"what is a good attack methodology against Active Directory?"* — the LLM should surface relevant tactics and techniques.
- **Low level:** questions like *"given a privilege-escalation tactic, what concrete attack vectors apply to this specific Linux system?"* — the LLM should surface actionable techniques/procedures.

```mermaid
flowchart LR
    A["Low-Privilege User"] -->|"Initial Prompt"| L["LLM"]
    L -->|"Command via SSH"| VM["Virtual Machine"]
    VM -->|"Response / machine state"| L
    L -->|"Refinement loop"| L
    VM -.->|"e.g. sudo -l reveals misconfigured binary"| Root["Root Access"]
```
*🖼️ Figure 1 (redrawn as a diagram): a low-level closed feedback loop — the LLM issues shell commands over SSH to a target VM, reads the response, and iteratively refines its next command (illustrated in the original with a `sudo -l` misconfiguration leading to a root shell via a Perl exec trick).*

### 3.1 High-Level: Task-Planning Systems

- **AgentGPT experiment:** prompted to *"become domain admin in an Active Directory."* It produced a plan citing realistic, industry-standard techniques — password spraying, Kerberoasting, AS-REP roasting, abusing AD Certificate Services, unconstrained delegation abuse, and group-policy abuse. The authors judged all of these realistic and commonly used in real engagements.
- **AutoGPT experiment:** after obtaining the target company's approval, the authors asked AutoGPT to build an external penetration-test plan. It proposed standard methodology — network vulnerability scanning, OSINT/user enumeration, and phishing against identified users.
  - When pushed further, AutoGPT **was willing** to crawl the target's website to enumerate real employee names/emails (OSINT), but it **declined**, citing its own ethical safeguards, to actually run a live network scan or execute phishing.
  - The authors' takeaway: both the plan and the refusals were realistic and would give a human tester genuinely useful directional feedback.

---

### 3.2 Low-Level: Attack-Execution System

The low-level evaluation targets a common pen-testing scenario: an attacker with low-privilege access to a Linux box searches for a way to escalate to root.

> 🔬 **Method**: A Python script uses SSH to connect to a deliberately vulnerable `lin.security` Linux VM [21]. Prototype code & documentation: [hackingBuddyGPT on GitHub](https://github.com/ipa-lab/hackingBuddyGPT).

The script runs an infinite feedback loop:

```mermaid
flowchart LR
    A[GPT-3.5 told: act as low-priv user] --> B[LLM proposes a shell command]
    B --> C[Command executed over SSH on VM]
    C --> D[Output fed back to GPT-3.5]
    D --> B
    D --> E[At end of iteration: identify vulnerabilities]
    E --> F[Generate 'verification commands' per vulnerability]
```

📌 **Key Point:** With this simple loop, the prototype was able to gain root privileges on the vulnerable VM.

#### Common attack paths observed
- Listing the sudoers file (`sudo -l`) → abusing a listed shell or employing a [GTFObin](https://gtfobins.github.io/) (benign system commands that, when called through `sudo`, can be abused to spawn a root shell)
- Retrieving `/etc/passwd` → identifying user accounts not using shadow passwords[^2]
- SUID binary searches were requested by the model, but returned binaries were not actively exploited — indicating a lack of multi-step planning capabilities in either the script or the underlying model
- A slightly altered prompt instructing the LLM to open a reverse shell to a given IP address **worked** and dropped root shells

[^2]: As the authors footnote: "If your Linux system is not using shadow passwords by now, chatGPT is the least of your worries."

---

## 4. Discussion

Interpreted through the first author's 10+ years of pen-testing experience.

### 4.1 Grounding of Results and Hallucinations

⚠️ Because every command and its output is logged, the authors could tell whether suggestions came from **actual system evidence** or from **priors baked into training** (like a tester drawing on past CTF experience).

- After seeing the sudoers list → GPT-3.5 reliably proposed relevant sudo-based privilege escalation vectors
- After seeing `/etc/passwd` → it suggested attacking weakly configured accounts
- Some suggestions (e.g., `dirty_cow`) were plausible given "this is Linux" but weren't grounded in prior enumeration
- Hallucinations were rare — the most common was suggesting a nonexistent `exploit.sh`, likely echoing common phrasing from security write-ups in training data

> The authors compare the loop to a *pen-tester phoning a colleague for advice* — the colleague has a limited view of the system but strong priors. Eerie, given how simple the setup was, that it still reached root.

Adding "explain the found vulnerabilities" to the prompt turned it into a decent **on-the-job training aid**.

### 4.2 Stability and Reproducibility

| Aspect | Observation |
|---|---|
| Single runs | Unstable — command sequence and selection varied |
| Many runs (tens, aggregated) | Results converged (script was repeatedly run dozens of times) |
| Cause of variance | GPT-3.5 fixating on single aspects ("rabbit-holing" — also common in human testers, where managing it improves with experience [16]) |
| vs. `linpeas.sh` [30] | LLM is less deterministic than hardcoded enumeration scripts; future research should test if this non-determinism reduces detectable signatures/patterns for Intrusion Detection Systems (IDS) while still converging over time |

🖼️ Note: GPT-3.5 once suggested running `linpeas.sh` itself but failed — it tried to fetch it from an invalid URL.

### 4.3 Ethical Moderation in LLMs

- GPT-3.5-turbo's safety filters were only occasionally triggered (the model's lack of hesitation when issuing real attack commands was concerning)
- Appending **"do not ask questions or provide judgments"** to prompts sharply cut refusals
- The optional "detail additional vulnerabilities" step was refused more often, but this didn't block overall progress
- Rewording "exploits for vulnerabilities" → **"verification commands for vulnerabilities"** reduced ethical pushback
- Running a **local model** would remove server-side ethics checks entirely

> ⚠️ This mirrors long-standing debates in security tooling: open-source and dual-use tools can serve both red teams and APTs alike. While commercial vendors attempt to vet customers, open-source tooling is accessible to anyone, and threat actors routinely abuse both commercial (e.g., Cobalt Strike [20]) and open-source (e.g., Sliver C2 [34]) frameworks. Regulation for dual-use *goods* (e.g., the Wassenaar Arrangement [2]) applies clumsily to software due to its fluid nature.

Two ethical issues explicitly **out of scope** for this paper:
1. Toxic content in commonly used training datasets [32]
2. Inclusion of copyrighted material in training data

---

## 5. A Vision of AI-Augmented Pen-Testing

### 5.1 Integrating High- and Low-Level Tasks
Currently split across two separate LLMs. A unified system would yield a uniform user experience, allowing an operator to move fluidly in a multi-step interactive loop between:
- High-level: *"what additional Active Directory attacks can I try?"*
- Low-level: *"given this system, how can I escalate?"*

Keeping everything in one system → synergy as the LLM accumulates system-specific knowledge.

### 5.2 Investigating Model Options
- Currently: OpenAI GPT-3 via cloud API
- Proposed comparisons: **LLaMA** [39], **StableLM** [35], **Dolly2** [9], and **Koala** [13] (local models)

**Why local models matter:**
- No cloud/API costs
- No sensitive data leaves the premises
- Enables fine-tuning on engagement-specific or customer-specific data over time — echoing how human testers "learn how a customer or industry thinks" over repeated engagements [16]
- Open question: what's the minimum "good enough" parameter size to reduce deployment resource cost?

### 5.3 Memory, Verification, and Reflection

Current prototype: simplistic memory = raw command output stuffed into prompt context until the context limit (e.g., 4k tokens in GPT-3) is reached.

**Proposed improvements:**
- Use **reflection** (à la generative game agent research [28] and BabyAGI) — summarize and extract only relevant findings before adding to context, rather than dumping raw command output
- Maintain **multiple memory streams**:
  1. Recently executed commands
  2. Extracted security findings
  3. An evolving model of "what kind of computer system would fit the findings" (i.e., emulate model-building as an internal reality check)

📌 Goal: reduce hallucinations, ground suggestions, and better answer questions like *"what vulnerabilities might I have overlooked?"*

### 5.4 Prompts for Asking Better Questions
- Current prompts: static, hand-written
- Proposed: LLM-generated/optimized prompts (à la AutoGPT) — but given the sensitive use case, **human oversight of auto-generated prompts is essential**
- Also worth studying: what questions real pen-testers ask *themselves* during engagements (drawing on empirical studies [16]), to better inform prompt design

---

## 6. Final Ethical Considerations

- This work targets **benign** use, but the same tooling is trivially subvertable for malicious purposes
- AI development is being aggressively pushed by both private companies (economic incentive) and state-funded research agencies (geopolitical incentive) [23] — this pace is not expected to slow down
- Malicious use of AI by APTs and cybercriminals is reportedly increasing (tracked in databases like AIAAIC [1])
- 🔒 **Locking models behind APIs doesn't solve this:**
  - Models can be run locally without cloud oversight
  - Even gate-kept models (e.g., Meta's LLaMA) have leaked [31] and can be reused by malicious actors
  - Fine-tuning a leaked model for malicious use is estimated at **under $1,000** of on-demand cloud compute (based on StackLLaMA processing power estimates [5])
  - Prompt engineering lowers the skill floor — no computer science degree required, democratizing access but facilitating misuse

> **Closing takeaway:** Whether or not LLMs end up used in hacking is no longer hypothetical — attackers will explore possibilities, including fully automated approaches, and given the low entry barrier, this cannot be contained. **Attacks will use LLMs; the genie is out of the bottle, and the Red Queen's Race is on [8, 17].** Defenders must prepare — and LLMs can play a significant defensive role.

---

## 📚 References

| # | Source |
|---|---|
| [1] | AIAAIC, *AIAAIC Repository of incidents and controversies related to AI, algorithms and automation*, retrieved April 26, 2023. [aiaaic.org](https://www.aiaaic.org/) |
| [2] | The Wassenaar Arrangement, *The Wassenaar Arrangement on Export Controls for Conventional Arms and Dual-Use Goods and Technologies*, 1982 / retrieved Aug 2023. [wassenaar.org](https://www.wassenaar.org/) |
| [3] | MITRE ATT&CK, *Abuse Elevation Control Mechanism: Sudo and Sudo Caching*, 2020. [T1548/003](https://attack.mitre.org/techniques/T1548/003/) |
| [4] | MITRE ATT&CK, *Steal or Forge Kerberos Tickets: Kerberoasting*, 2020. [T1558/003](https://attack.mitre.org/techniques/T1558/003/) |
| [5] | Edward Beeching et al., *StackLLaMA: An RL Fine-tuned LLaMA Model for Stack Exchange Question and Answering*, 2023. [doi:10.57967/hf/0513](https://doi.org/10.57967/hf/0513) |
| [6] | Erik Brynjolfsson, *The Turing Trap: The Promise & Peril of Human-like Artificial Intelligence*, in *Augmented Education in the Global Age*, Routledge, pp. 103–116, 2023 |
| [7] | Erik Brynjolfsson, Danielle Li, and Lindsey Raymond, *Generative AI at Work*, NBER Working Paper No. 31161, National Bureau of Economic Research, April 2023 |
| [8] | Vit Bukac, Vaclav Lorenc, and Vashek Matyáš, *Red Queen's Race: APT Win-Win Game*, Cambridge International Workshop on Security Protocols, Springer, pp. 55–61, 2014 |
| [9] | Mike Conover et al., *Free Dolly: Introducing the World's First Truly Open Instruction-Tuned LLM*, Databricks blog, 2023. [databricks.com](https://www.databricks.com/blog/2023/04/12/dolly-first-open-commercially-viable-instruction-tuned-llm) |
| [10] | Paul Denny, Viraj Kumar, and Nasser Giacaman, *Conversing with Copilot: Exploring Prompt Engineering for Solving CS1 Problems Using Natural Language*, ACM SIGCSE 2023, pp. 1136–1142 |
| [11] | The Economist, *Huge Foundation Models Are Turbo-charging AI Progress*, 2022. [economist.com](https://www.economist.com/interactive/briefing/2022/06/11/huge-foundation-models-are-turbo-charging-ai-progress) |
| [12] | The Economist, *Large, Creative AI Models Will Transform Lives and Labour Markets*, 2023. [economist.com](https://www.economist.com/interactive/science-and-technology/2023/04/22/large-creative-ai-models-will-transform-how-we-live-and-work) |
| [13] | Xinyang Geng et al., *Koala: A Dialogue Model for Academic Research*, BAIR blog post, 2023. [bair.berkeley.edu](https://bair.berkeley.edu/blog/2023/04/03/koala/) |
| [14] | Georgi Gerganov, *llama.cpp: Inference of LLaMA Model in Pure C/C++*, 2023. [GitHub](https://github.com/ggerganov/llama.cpp) |
| [15] | Significant Gravitas, *Auto-GPT: An Autonomous GPT-4 Experiment*, 2023. [GitHub](https://github.com/Significant-Gravitas/Auto-GPT) |
| [16] | Andreas Happe and Jürgen Cito, *Understanding Hackers' Work: An Empirical Study of Offensive Security Practitioners*, ACM ESEC/FSE 2023, 11 pages |
| [17] | Richard Harang and Felipe N Ducau, *Measuring the Speed of the Red Queen's Race*, BlackHat USA, Las Vegas, NV, 2018 |
| [18] | (ISC)², *(ISC)² Cybersecurity Workforce Study 2022*, retrieved April 2023. [isc2.org](https://www.isc2.org//-/media/ISC2/Research/2022-WorkForce-Study/ISC2-Cybersecurity-Workforce-Study.ashx) |
| [19] | Sydney Lake, *The Cybersecurity Industry Is Short 3.4 Million Workers—That's Good News for Cyber Wages*, Fortune, 2022. [fortune.com](https://fortune.com/education/articles/the-cybersecurity-industry-is-short-3-4-million-workers-thats-good-news-for-cyber-wages/) |
| [20] | Selena Larson and Daniel Blackford, *Cobalt Strike: Favorite Tool from APT to Crimeware*, Proofpoint, 2021. [proofpoint.com](https://www.proofpoint.com/us/blog/threat-insight/cobalt-strike-favorite-tool-apt-crimeware) |
| [21] | lin.security, *Lin.Security: 1*, VulnHub, 2018. [vulnhub.com](https://www.vulnhub.com/entry/linsecurity-1,244/) |
| [22] | Vivian Liu and Lydia B Chilton, *Design Guidelines for Prompt Engineering Text-to-Image Generative Models*, ACM CHI 2022, pp. 1–23 |
| [23] | Nestor Maslej et al., *The AI Index 2023 Annual Report*, Stanford HAI, 2023. [HAI report](https://aiindex.stanford.edu/wp-content/uploads/2023/04/HAI_AI-Index-Report_2023.pdf) |
| [24] | Ron Miller, *Sam Altman: Size of LLMs Won't Matter as Much Moving Forward*, TechCrunch, April 14, 2023. [techcrunch.com](https://techcrunch.com/2023/04/14/sam-altman-size-of-llms-wont-matter-as-much-moving-forward/) |
| [25] | Yohei Nakajima, *BabyAGI*, GitHub, retrieved April 25, 2023. [GitHub](https://github.com/yoheinakajima/babyagi) |
| [26] | Yohei Nakajima, *Introducing Task-driven Autonomous Agent*, Twitter / X, retrieved April 25, 2023. [Twitter](https://twitter.com/yoheinakajima/status/1640934493489070080) |
| [27] | Yohei Nakajima, *Task-driven Autonomous Agent Utilizing GPT-4, Pinecone, and LangChain for Diverse Applications*, blog post, retrieved April 25, 2023. [yoheinakajima.com](https://yoheinakajima.com/task-driven-autonomous-agent-utilizing-gpt-4-pinecone-and-langchain-for-diverse-applications/) |
| [28] | Joon Sung Park, Joseph C. O'Brien, Carrie J. Cai, Meredith Ringel Morris, Percy Liang, and Michael S. Bernstein, *Generative Agents: Interactive Simulacra of Human Behavior*, arXiv:2304.03442 [cs.HC], 2023 |
| [29] | Baolin Peng et al., *Check Your Facts and Try Again: Improving Large Language Models with External Knowledge and Automated Feedback*, arXiv:2302.12813 [cs.CL], 2023 |
| [30] | Carlos Polop, *LinPEAS – Linux Privilege Escalation Awesome Script*, 2023. [GitHub](https://github.com/carlospolop/PEASS-ng/tree/master/linPEAS) |
| [31] | Katyanna Quach, *LLaMA Drama as Meta's Mega Language Model Leaks*, The Register, March 8, 2023. [theregister.com](https://www.theregister.com/2023/03/08/meta_llama_ai_leak/) |
| [32] | Kevin Schaul, Szu Yu Chean, and Nitasha Tiku, *Inside the Secret List of Websites That Make AI Like ChatGPT Sound Smart*, Washington Post, April 26, 2023. [washingtonpost.com](https://www.washingtonpost.com/technology/interactive/2023/ai-chatbot-learning/) |
| [33] | Yongliang Shen, Kaitao Song, Xu Tan, Dongsheng Li, Weiming Lu, and Yueting Zhuang, *HuggingGPT: Solving AI Tasks with ChatGPT and Its Friends in HuggingFace*, arXiv:2303.17580 [cs.CL], 2023 |
| [34] | Cybereason Global SOC and Incident Response Team, *Sliver C2 Leveraged by Many Threat Actors*, April 28, 2023. [cybereason.com](https://www.cybereason.com/blog/sliver-c2-leveraged-by-many-threat-actors) |
| [35] | Stability AI, *Stability AI Launches the First of Its StableLM Suite of Language Models*, blog post, 2023. [stability.ai](https://stability.ai/blog/stability-ai-launches-the-first-of-its-stablelm-suite-of-language-models) |
| [36] | Hendrik Strobelt et al., *Interactive and Visual Prompt Engineering for Ad-hoc Task Adaptation with Large Language Models*, IEEE TVCG 29(1), pp. 1146–1156, 2022 |
| [37] | Blake E. Strom et al., *MITRE ATT&CK: Design and Philosophy*, MITRE Corporation Technical Report, 2018 |
| [38] | Jason Wei et al., *Emergent Abilities of Large Language Models*, arXiv:2206.07682 [cs.CL], 2022 |
| [39] | Renrui Zhang et al., *LLaMA-Adapter: Efficient Fine-tuning of Language Models with Zero-init Attention*, arXiv:2303.16199 [cs.CV], 2023 |
| [40] | Kaiyang Zhou, Jingkang Yang, Chen Change Loy, and Ziwei Liu, *Learning to Prompt for Vision-Language Models*, International Journal of Computer Vision (IJCV) 130(9), pp. 2337–2348, 2022 |
