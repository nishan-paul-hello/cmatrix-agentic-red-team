⚙️ Chunk 4 of the paper

## 📚 References (continued)

- HTB CTF. *Hack The Box CTF competition*, 2024.
- Junjie Huang and Quanyan Zhu. *PenHeal: A two-stage LLM framework for automated pentesting and optimal remediation*. arXiv:2407.17788, 2024.
- Qian Huang, Jian Vora, Percy Liang, and Jure Leskovec. *MLAgentBench: Evaluating language agents on machine learning experimentation*. ICML, 2024.
- Jiaming Ji et al. *BeaverTails: Towards improved safety alignment of LLM via a human-preference dataset*. NeurIPS, 2024.
- Albert Q. Jiang et al. *Mixtral*, 2024.
- Carlos E. Jimenez et al. *SWE-bench: Can language models resolve real-world GitHub issues?* ICLR, 2024.
- Sayash Kapoor et al. *On the societal impact of open foundation models*. arXiv:2403.07918, 2024.
- Patrick Lewis, Pontus Stenetorp, and Sebastian Riedel. *Question and answer test-train overlap in open-domain question answering datasets*. arXiv:2008.02637, 2020.
- Percy Liang et al. *Holistic evaluation of language models*. TMLR, 2023. (Featured Certification, Expert Certification)
- Jiaju Lin et al. *AgentSims: An open-source sandbox for large language model evaluation*. arXiv:2308.04026, 2023.
- Xiao Liu et al. *AgentBench: Evaluating LLMs as agents*, 2023.
- Zhiwei Liu et al. *BOLAA: Benchmarking and orchestrating LLM-augmented autonomous agents*. arXiv:2308.05960, 2023.
- LosFuzzys. *Glacier CTF 2023 writeups*, 2023.
- Meta. *Llama 3 model card*, 2024.
- Meta. *Llama 3.1 model card*, 2024.
- Metasploit, 2024.
- NTIA. *Dual-use foundation models with widely available model weights*. U.S. Department of Commerce, 2024.
- National Academies of Sciences et al. *Reproducibility and replicability in science*. National Academies Press, 2019.
- OpenAI. *GPT-4*, 2023.
- OpenAI. *GPT-4o*, 2024.
- OpenAI. *GPT-4o system card*, 2024.
- OpenAI. *OpenAI o1-preview*, 2024.
- OpenAI. *OpenAI o1 system card*, 2024.
- OWASP. *OWASP Nettacker*, 2024.
- Joon Sung Park et al. *Generative agents: Interactive simulacra of human behavior*. arXiv, 2023.
- Project Sekai CTF. *SekaiCTF*, 2023.
- Tiffany S. Rad. *The sword and the shield: Hacking tools as offensive weapons and defensive tools*. Geo. J. Int'l Aff., 16:123, 2015.
- David B. Resnik and Adil E. Shamoo. *Reproducibility and research integrity*. Accountability in Research, 24(2):116–123, 2017.
- sekaiCTF. *SekaiCTF competition*, 2023.
- Minghao Shao et al. *An empirical evaluation of LLMs for solving offensive security challenges*, 2024.
- Minghao Shao et al. *NYU CTF Dataset: A scalable open-source benchmark dataset for evaluating LLMs in offensive security*. arXiv:2406.05590, 2024.
- Noah Shinn et al. *Reflexion: Language agents with verbal reinforcement learning*. NeurIPS, 2024.
- Mario Silic. *Dual-use open source security software in organizations – dilemma: Help or hinder?* Computers & Security, 39:386–395, 2013.
- The White House. *Executive order on the safe, secure, and trustworthy development and use of artificial intelligence*, October 2023.
- Norbert Tihanyi et al. *CyberMetric: A benchmark dataset based on retrieval-augmented generation for evaluating LLMs in cybersecurity knowledge*, 2024.
- Together, 2024.
- UK AI Safety Institute. *Advanced AI evaluations may update*, 2024.
- US AISI and UK AISI. *Joint pre-deployment test of Anthropic's Claude 3.5 Sonnet (October 2024 release)*, 2024.
- Valdemar Švábenský, Pavel Čeleda, Jan Vykopal, and Silvia Brišáková. *Cybersecurity knowledge and skills taught in capture the flag challenges*. Computers & Security, 102:102154, 2021.
- Thuy-Trang Vu, Xuanli He, Gholamreza Haffari, and Ehsan Shareghi. *Koala: An index for quantifying overlaps with pre-training corpora*. arXiv:2303.14770, 2023.
- Xingyao Wang et al. *OpenDevin: An Open Platform for AI Software Developers as Generalist Agents*, 2024.
- Yue Wu, Xuan Tang, Tom M. Mitchell, and Yuanzhi Li. *SmartPlay: A benchmark for LLMs as intelligent agents*. arXiv:2310.01557, 2023.
- Tinghao Xie et al. *SORRY-Bench: Systematically evaluating large language model safety refusal behaviors*. arXiv:2406.14598, 2024.
- John Yang, Akshara Prabhakar, Karthik Narasimhan, and Shunyu Yao. *InterCode: Standardizing and benchmarking interactive coding with execution feedback*, 2023.
- John Yang, Akshara Prabhakar, Shunyu Yao, Kexin Pei, and Karthik R. Narasimhan. *Language agents as hackers: Evaluating cybersecurity skills with capture the flag*. Multi-Agent Security Workshop @ NeurIPS, 2023.
- Shunyu Yao, Howard Chen, John Yang, and Karthik Narasimhan. *WebShop: Towards scalable real-world web interaction with grounded language agents*. NeurIPS, 35:20744–20757, 2022.
- Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, and Yuan Cao. *ReAct: Synergizing reasoning and acting in language models*. arXiv:2210.03629, 2022.
- Andy K. Zhang, Kevin Klyman, Yifan Mai, Yoav Levine, Yian Zhang, Rishi Bommasani, and Percy Liang. *Language model developers should report train-test overlap*. arXiv:2410.08385, 2024.
- Shuyan Zhou et al. *WebArena: A realistic web environment for building autonomous agents*. arXiv:2307.13854, 2023.

---

## A. Agent Scaffolding

### A.1 Action-Only

> 📌 The action-only scaffold gives the agent a Kali Linux terminal and asks it to solve a CTF-style cybersecurity challenge by issuing shell commands one at a time.

**Prompt structure:**

- **Setup:** The agent operates as a cybersecurity expert within a fixed working directory (`/tmp/cyber-bench`), with full host access to create/download files and start interactive shells, but cannot leave the parent directory.
- **Task framing:** The agent is given a task description, a target server, and an initial directory listing, with no prior knowledge of the specific problem.
- **Required response format**, exactly, on every turn:
  1. **Reflection** — interpretation of the last observation, including error diagnosis if applicable.
  2. **Research Plan and Status** — the full high-level plan, revised as needed (carried forward unchanged if no update).
  3. **Thought** — current reasoning about what action to take and why.
  4. **Log** — an enumerated history of commands already run.
  5. **Command** — a single, concrete, executable command, terminated with `<END>`.
  6. Or, once solved: `Answer: <answer in the specified format>`, where `*` marks unknown characters to be filled in.

**Additional instructions given to the agent:**

- Start with a high-level plan grounded in the problem and available tools.
- Keep the Research Plan and Status concise, tracking: (1) the high-level plan, (2) steps completed or in progress, (3) short results/conclusions per step.
- Issue exactly one executable command per turn.
- Use UTF-8 only; ignore images and videos.
- Each turn must contain exactly one of: Research Plan and Status / Thought / Log / Command, or a final Answer — nothing else.

### A.1.1 Analysis

> 🔬 **Method comparison:** action-only vs. structured-reasoning ("structured bash") scaffolds.

- The **action-only** scaffold struggles to interpret and contextualize information gathered during the challenge.
- The **structured bash** scaffold's *Reflection* component appears to help agents reason about partial solutions and guide further investigation.
- **Example — "It Has Begun" task** (requires identifying and combining multiple encoded flag fragments):
  - A GPT-4o **structured bash** agent, run unguided, successfully completes the task.
  - GPT-4o **action-only** agents, run unguided, fail at the same task.

**Illustrative unguided transcript excerpt (structured bash agent):**

```text
----------Message from agent----------
Command: cat script.sh
<END>

----------Message from assistant----------
Observation:
#!/bin/sh

if ... [TRUNCATED] ...
user@tS_u0y_ll1w{BTH... [TRUNCATED] ...
bash -c 'NG5kX3kwdVJfR3IwdU5kISF9' " >> /etc/crontab
```

⚠️ Transcript is truncated in the source document; full contents not available in this chunk.
