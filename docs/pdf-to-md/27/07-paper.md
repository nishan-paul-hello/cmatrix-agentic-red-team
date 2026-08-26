⚙️ Chunk 7 of the paper

## 5. Related Surveys

> With the growth of LLM research, several surveys have emerged covering adjacent but distinct territory.

- 📌 **Background & mainstream tech** — one survey extensively covers LLM background, findings, and mainstream techniques
- 📌 **Downstream applications** — another focuses on LLM applications in downstream tasks and deployment challenges
- 📌 **Human alignment** — a survey compiles alignment techniques, including data collection and training methodologies
- 📌 **Reasoning** — a survey covers the state of LLM reasoning research, including how to improve and evaluate it
- 📌 **Tool-augmented LMs (ALMs)** — a review of language models augmented with reasoning and tool-use ("Augmented Language Models")
- 📌 **Evaluation** — a survey addresses *what*, *where*, and *how* to evaluate LLMs across downstream tasks and societal impact
- 📌 **Capabilities & limitations** — another discusses LLM capabilities/limitations across downstream tasks

⚠️ **Gap identified**: None of the prior surveys specifically focus on **LLM-based Agents**. This paper compiles 100 relevant works on LLM-based Agents, covering construction, applications, and evaluation.

---

## 6. Challenges

While the field has seen remarkable successes, it remains nascent. Key open challenges:

### 6.1 Role-playing Capability

- Autonomous agents must convincingly play specific roles (coder, researcher, chemist, etc.), unlike general-purpose LLMs.
- **Problems:**
  - LLMs are trained on web corpora, so rarely-discussed or newly emerging roles are poorly simulated.
  - Existing LLMs may not model human cognitive psychology well, leading to a lack of self-awareness in conversation.
- **Potential solutions:**
  - Fine-tune LLMs on real-human data collected for uncommon roles/psychology profiles.
  - Design tailored agent prompts/architectures — though the design space is very large, making optimization hard.
- ⚠️ **Trade-off**: fine-tuning for uncommon roles risks degrading performance on common roles.

### 6.2 Generalized Human Alignment

- Traditional LLM alignment optimizes for a single set of "correct" human values (e.g., refusing to help plan harm).
- For **simulation** use cases, this is limiting: an ideal simulator should honestly depict *diverse* human traits — including negative ones.

> Simulating negative human aspects can be important: simulation's purpose is often to discover and solve problems, and without negative behavior there's nothing to solve.

- Example given: to simulate real-world society realistically, an agent might need to be allowed to plan something harmful (e.g., planning to make a bomb) purely to observe and study the behavior — informing real-world countermeasures.
- 📌 **Open problem**: how to achieve *generalized* human alignment — letting agents align with diverse (not just unified) values depending on application — since models like ChatGPT/GPT-4 are aligned to one unified value set.
- **Direction**: "realigning" models via careful prompting strategies for different purposes.

### 6.3 Prompt Robustness

- Agents typically combine multiple modules (memory, planning, etc.), each needing its own prompt — together forming a **prompt framework**, not a single prompt.
- Complications:
  - Prior work shows LLM prompts lack robustness — minor changes can cause large output changes.
  - This is worse for agents since one module's prompt can influence others.
  - Prompt frameworks vary significantly across different LLMs.
- ⚠️ **Unresolved**: building a unified, resilient prompt framework across diverse LLMs.
- **Potential solutions:**
  1. Manually craft prompt elements via trial and error.
  2. Automatically generate prompts using GPT.

### 6.4 Hallucination

- LLMs (and thus agents) can produce false information with high confidence.
- Example: in code generation tasks, simplistic instructions can trigger hallucinatory behavior in agents.
- **Consequences**: incorrect/misleading code, security risks, ethical issues.
- **Mitigation**: incorporate human correction feedback directly into the human-agent interaction loop.

### 6.5 Knowledge Boundary

- A key application of agents is simulating human behavior — but LLMs' vast web-scale knowledge can exceed what a real individual would know.
- **Example**: simulating movie-selection behavior requires the LLM to act as if it has no prior knowledge of the movies — but it may already "know" them, biasing the simulation.
- 📌 **Open problem**: how to constrain an LLM's use of "user-unknown" knowledge to preserve simulation believability.

### 6.6 Efficiency

- LLMs have inherently slow (autoregressive) inference.
- Agents often need multiple LLM queries per action (memory extraction, planning, etc.), compounding latency.
- Agent efficiency is therefore tightly bound to LLM inference speed.

---

## 7. Conclusion

- This survey systematically reviews LLM-based autonomous agent research across three axes: **construction**, **application**, and **evaluation**.
- Provides a detailed taxonomy connecting existing research and summarizing major techniques and their development histories.
- Proposes several open challenges intended to guide future research directions.

---

## Acknowledgement

Supported in part by the National Natural Science Foundation of China (No. 62102420), the Beijing Outstanding Young Scientist Program, and multiple Renmin University of China initiatives (Intelligent Social Governance Platform, "Double-First Class" Initiative fund, Public Computing Cloud).

---

## References (partial — items 1–49)

1. Mnih et al. — Human-level control through deep reinforcement learning. *Nature*, 2015.
2. Lillicrap et al. — Continuous control with deep reinforcement learning. arXiv:1509.02971, 2015.
3. Schulman et al. — Proximal policy optimization algorithms. arXiv:1707.06347, 2017.
4. Haarnoja et al. — Soft actor-critic. ICML, 2018.
5. Brown et al. — Language models are few-shot learners. NeurIPS, 2020.
6. Radford et al. — Language models are unsupervised multitask learners. OpenAI blog, 2019.
7. Achiam et al. — GPT-4 technical report. arXiv:2303.08774, 2023.
8. Anthropic — Model card and evaluations for Claude models, 2023.
9. Touvron et al. — LLaMA: Open and efficient foundation language models. arXiv:2302.13971, 2023.
10. Touvron et al. — Llama 2: Open foundation and fine-tuned chat models. arXiv:2307.09288, 2023.
11. Chen et al. — Generative adversarial user model for RL-based recommendation. ICML, 2019.
12. Shinn et al. — Reflexion: Language agents with verbal reinforcement learning. NeurIPS, 2024.
13. Shen et al. — HuggingGPT: Solving AI tasks with ChatGPT and its friends. NeurIPS, 2024.
14. Qin et al. — ToolLLM: Facilitating LLMs to master 16000+ real-world APIs. arXiv:2307.16789, 2023.
15. Schick et al. — Toolformer. NeurIPS, 2024.
16. Zhu et al. — Ghost in the Minecraft. arXiv:2305.17144, 2023.
17. Sclar et al. — Minding language models' (lack of) theory of mind. arXiv:2306.00924, 2023.
18. Qian et al. — Communicative agents for software development. arXiv:2307.07924, 2023.
19. AgentVerse (GitHub, OpenBMB), 2023.
20. Park et al. — Generative agents: Interactive simulacra of human behavior. UIST, 2023.
21. Wang et al. — RecAgent: A novel simulation paradigm for recommender systems. arXiv:2306.02552, 2023.
22. Zhang et al. — Building cooperative embodied agents modularly with LLMs. arXiv:2307.02485, 2023.
23. Hong et al. — MetaGPT: Meta programming for multi-agent collaborative framework. arXiv:2308.00352, 2023.
24. Dong et al. — Self-collaboration code generation via ChatGPT. arXiv:2304.07590, 2023.
25. Safdari et al. — Personality traits in large language models. arXiv:2307.00184, 2023.
26. Johnson — Measuring thirty facets of the five factor model (IPIP-NEO-120). *J. Research in Personality*, 2014.
27. John, Donahue, Kentle — Big Five Inventory. *J. Personality and Social Psychology*, 1991.
28. Deshpande et al. — Toxicity in ChatGPT: Analyzing persona-assigned language models. arXiv:2304.05335, 2023.
29. Argyle et al. — Out of one, many: Using language models to simulate human samples. *Political Analysis*, 2023.
30. Fischer — Reflective Linguistic Programming (RLP). arXiv:2305.12647, 2023.
31. Rana et al. — SayPlan: Grounding LLMs using 3D scene graphs for robot task planning. CoRL, 2023.
32. Zhu et al. — Calypso: LLMs as Dungeon Master's assistants. AAAI AIIDE, 2023.
33. Wang et al. — Describe, explain, plan and select (DEPS). arXiv:2302.01560, 2023.
34. Lin et al. — AgentSims: An open-source sandbox for LLM evaluation. arXiv:2308.04026, 2023.
35. Liang et al. — Unleashing infinite-length input capacity with self-controlled memory. arXiv:2304.13343, 2023.
36. Ng et al. — SimplyRetrieve. arXiv:2308.03983, 2023.
37. Huang et al. — Memory Sandbox. UIST Adjunct, 2023.
38. Wang et al. — Voyager: An open-ended embodied agent with LLMs. arXiv:2305.16291, 2023.
39. Zhong et al. — MemoryBank: Enhancing LLMs with long-term memory. arXiv:2305.10250, 2023.
40. Hu et al. — ChatDB: Augmenting LLMs with databases as symbolic memory. arXiv:2306.03901, 2023.
41. Modarressi et al. — RET-LLM: A general read-write memory for LLMs. arXiv:2305.14322, 2023.
42. Schuurmans — Memory augmented LLMs are computationally universal. arXiv:2301.04589, 2023.
43. Zhao et al. — ExpeL: LLM agents are experiential learners. arXiv:2308.10144, 2023.
44. Huang et al. — Language models as zero-shot planners. ICML, 2022.
45. Wei et al. — Chain-of-thought prompting elicits reasoning in LLMs. NeurIPS, 2022.
46. Kojima et al. — Large language models are zero-shot reasoners. NeurIPS, 2022.
47. Raman et al. — Planning with LLMs via corrective re-prompting. NeurIPS Workshop, 2022.
48. Xu et al. — ReWOO: Decoupling reasoning from observations. arXiv:2305.18323, 2023.
49. Lin et al. — SwiftSage *(continues in next chunk)*.
