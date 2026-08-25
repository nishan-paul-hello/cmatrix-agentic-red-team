⚙️ Chunk 3 of the paper

### 🖼️ Figure: LLM hallucinates server information

Example trace showing an agent hallucinating connection details during a CTF attempt:

- **Planner → Delegate:** Instructs the Executor to adjust an exploit for vulnerabilities during active multiplayer sessions, targeting a real multiplayer server at a specific (hallucinated) IP and port.
- **Executor → CreateFile:** Writes a Python `pwn` script that opens a remote connection to the given (nonexistent) server/port.
- **Observation:** The connection attempt fails with a `Could not connect` error.

> The network access fails and the appropriate error is returned, but it may stray the LLM's focus.

**Calling non-existent functions:** Gemini 1.5 Flash sometimes calls functions that don't exist (e.g., `decode`, `strip`), causing the run to fail. This may stem from the model confusing output structure and generating command-line-style calls instead of a proper `RunCommand` call with arguments. These failure modes highlight the importance of well-defined function-calling structures — motivating D-CIPHER's use of a simple, consistent action-generation format.

---

## C. Ethics

- LLM advances bring cybersecurity benefits but also risks, including misuse in adversarial scenarios where safeguards are bypassed.
- CTFs act as **controlled environments** to safely study LLM agent strengths and vulnerabilities in offensive security.
- As LLMs evolve, stakeholders must balance technical capability with ethical responsibility around data security, privacy, and malicious exploitation.
- ⚠️ Malicious actors could exploit LLMs for social engineering or harmful code generation, reinforcing the need for governance and ethical protocols.
- Regulatory frameworks often lag behind rapid AI progress, raising ongoing questions about accountability.
- Conversely, AI-assisted cybersecurity automation is increasingly necessary to keep pace with evolving software threats — ethically-aware development can strengthen defense while limiting misuse.

---

## VII. Conclusion

📌 **D-CIPHER** is an LLM multi-agent framework that autonomously solves CTF challenges, built on two key innovations:

1. **Planner–Executor system** — a Planner agent generates and manages the overall plan; multiple Executor agents handle assigned subtasks.
2. **Auto-prompter agent** — dynamically generates a prompt from initial exploration to guide challenge-solving.

- Novel function-calling mechanisms enable dynamic inter-agent interaction and feedback, mirroring real-world CTF team dynamics.

### 📊 Results Summary

| Benchmark | D-CIPHER Improvement over SOTA |
|---|---|
| NYU CTF Bench | 22% (2.5–8.5% better than SOTA overall) |
| Cybench | 22.5% |
| HackTheBox | 44% |

- The NYU CTF Bench was augmented by mapping CTFs to **MITRE ATT&CK** techniques for more comprehensive evaluation of offensive security capability.
- D-CIPHER solves **65% more ATT&CK techniques** than existing LLM agents, demonstrating superior offensive capability.

### ⚠️ Limitations

- **No direct Executor-to-Executor interaction** — information exchange is bottlenecked through the Planner. A future extension could allow simultaneous Executor interaction to relieve this bottleneck.
- **Auto-prompter fragility** — early errors during exploration strongly bias the generated prompt, skewing the Planner's direction and hurting accuracy/ATT&CK coverage (see Section VI-A). Combining generated prompts with hard-coded directions could reduce this fragility.
- Despite running multiple agents, D-CIPHER remains **cost-efficient** compared to single-agent systems, enabling low-cost deployment.

---

## References

1. Abramovich et al. Interactive tools substantially assist LM agents in finding security vulnerabilities, 2025.
2. Akuthota et al. Vulnerability detection and monitoring using LLM. *Women in Engineering Conference on Electrical and Computer Engineering*, 2023.
3. Bhatt et al. CyberSecEval 2: A wide-ranging cybersecurity evaluation suite for LLMs, 2024.
4. Bianou & Batogna. Pentest-ai: an LLM-powered multi-agents framework for penetration testing automation leveraging MITRE ATT&CK. *IEEE CSR*, 2024.
5. Bouzenia, Devanbu & Pradel. RepairAgent: An autonomous, LLM-based agent for program repair, 2024.
6. Chahal. AI-enhanced cyber incident response and recovery. *Intl. Journal of Science and Research*, 2023.
7. Chang, Yoon, Wuthier & Zhang. Capture the flag for team construction in cybersecurity, 2022.
8. Charan, Chunduri, Anand & Shukla. From text to MITRE techniques: exploring malicious use of LLMs for generating cyber attack payloads, 2023.
9. Chicone & Ferebee. Using Facebook's open source Capture the Flag platform as a hands-on learning and assessment tool for cybersecurity education, 2018.
10. Cuevas, Hogan, Hibshi & Christin. Observations from an online security competition and its implications on crowdsourced security, 2022.
11. Dabbagh et al. AI ethics should be mandatory for schoolchildren. *AI and Ethics*, 2024.
12. DARPA. DARPA Cyber Grand Challenge, 2016.
13. DARPA. DARPA AIxCC, 2024.
14. Dorri, Kanhere & Jurdak. Multi-agent systems: A survey. *IEEE Access*, 2018.
15. Guo et al. Large language model based multi-agents: A survey of progress and challenges, 2024.
16. Guo, Patsakis, Hu, Tang & Casino. Outside the comfort zone: Analysing LLM capabilities in software vulnerability detection. *ESORICS*, 2024.
17. HackTheBox. Cybersecurity training and penetration testing labs, 2024.
18. Jackson, Matei & Bertino. Artificial intelligence ethics education in cybersecurity: Challenges and opportunities, 2023.
19. Le Goues, Dewey-Vogt, Forrest & Weimer. A systematic study of automated program repair: Fixing 55 out of 105 bugs for $8 each. *ICSE*, 2012.
20. Li, Zhang, Yu, Fu & Ye. More agents is all you need, 2024.
21. Li et al. Attention is all you need for LLM-based code vulnerability localization, 2024.
22. Liu. Multi-agent collaboration in incident response with large language models, 2024.
23. Lu, Ju, Chen, Pei & Cai. GRACE: Empowering LLM-based software vulnerability detection with graph structure and in-context learning. *Journal of Systems and Software*, 2024.
24. MITRE. MITRE ATT&CK framework (accessed 2025-04-28).
25. Muzsai, Imolai & Lukács. HackSynth: LLM agent and evaluation framework for autonomous penetration testing, 2024.
26. Nunez, Islam, Jha & Najafirad. AutoSafeCoder: A multi-agent framework for securing LLM code generation through static analysis and fuzz testing, 2024.
27. Pieterse. Friend or foe – the impact of ChatGPT on Capture the Flag competitions. *ICCWS*, 2024.
28. Porsdam Mann et al. Generative AI entails a credit–blame asymmetry, 2023.
29. Savin et al. Battle ground: Data collection and labeling of CTF games to understand human cyber operators. *CSET Workshop*, 2023.
30. Shao et al. An empirical evaluation of LLMs for solving offensive security challenges, 2024.
31. Shao et al. NYU CTF Bench: A scalable open-source benchmark dataset for evaluating LLMs in offensive security. *NeurIPS Datasets and Benchmarks*, 2024.
32. Shen et al. PentestAgent: Incorporating LLM agents to automated penetration testing, 2024.
33. Shin, Razeghi, Logan IV, Wallace & Singh. AutoPrompt: Eliciting knowledge from language models with automatically generated prompts. *EMNLP*, 2020.
34. Song, Ma, Zheng, Liao, Kuang & Yang. Audit-LLM: Multi-agent collaboration for log-based insider threat detection, 2024.
35. Tann, Liu, Sim, Seah & Chang. Using large language models for cybersecurity capture-the-flag challenges and certification questions, 2023.
36. Turtayev, Petrov, Volkov & Volk. Hacking CTFs with plain agents, 2024.
37. Vykopal, Švábenský & Chang. Benefits and pitfalls of using capture the flag games in university courses. *SIGCSE*, 2020.
38. Wan et al. CYBERSECEVAL 3: Advancing the evaluation of cybersecurity risks and capabilities in large language models, 2024.
39. Wang et al. Plan-and-solve prompting: Improving zero-shot chain-of-thought reasoning by large language models. *ACL*, 2023.
40. Wang et al. A survey on large language model based autonomous agents. *Frontiers of Computer Science*, 2024.
41. Wu, Duan & Ni. Unveiling security, privacy, and ethical concerns of ChatGPT. *Journal of Information and Intelligence*, 2024.
42. Xia & Zhang. Automated program repair via conversation: Fixing 162 out of 337 bugs for $0.42 each using ChatGPT. *ISSTA*, 2024.
43. Xu et al. ReWOO: Decoupling reasoning from observations for efficient augmented language models, 2023.
44. Xu, Chen, Lin, Lin & Wang. Autopwn: Artifact-assisted heap exploit generation for CTF pwn competitions. *IEEE TIFS*, 2024.
45. Yang, Prabhakar, Narasimhan & Yao. Intercode: Standardizing and benchmarking interactive coding with execution feedback. *NeurIPS Datasets and Benchmarks*, 2023.
46. Yang, Prabhakar, Yao, Pei & Narasimhan. Language agents as hackers: Evaluating cybersecurity skills with capture the flag, 2023.
47. Yang et al. SWE-agent: Agent-computer interfaces enable automated software engineering. *NeurIPS*, 2024.
48. Yao et al. ReAct: Synergizing reasoning and acting in language models, 2022.
49. Zhang et al. Cybench: A framework for evaluating cybersecurity capabilities and risks of language models. *ICLR*, 2025.
50. Zhang, Wang, Li, Sun, Zhang, Ma & Liu. An empirical study of automated vulnerability localization with large language models, 2024.
51. Zhang, Zhang, Li & Smola. Automatic chain of thought prompting in large language models. *ICLR*, 2023.
52. Zhou, Zhao, Shumailov, Mullins & Gal. Revisiting automated prompting: Are we actually doing better? *ACL*, 2023.
