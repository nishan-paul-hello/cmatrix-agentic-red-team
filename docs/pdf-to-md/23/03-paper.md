⚙️ Chunk 3 of the paper

## 8. Ethics Statement

There is a long history of dual-use technology in cybersecurity, with extensive discussion of how to weigh its benefits and risks. Prior surveys of practitioners find general agreement that dual-use technology carries both benefits and harms — malicious actors can use it for harm, while good actors can use it for defense. Other work argues that restricting such technology can hinder its benefits more than it reduces harm, since malicious actors can often obtain equivalent tools through alternative channels (e.g., black markets) that are unavailable to law-abiding actors.

The authors acknowledge that both the agent and the benchmark presented in this paper are dual-use. Some related works have chosen to release their code, while others have withheld research details. After weighing the benefits and harms, the authors chose to release their code and data, reasoning as follows:

### ⚠️ Potential Harms

- The agent could be leveraged by malicious actors to identify vulnerabilities and execute exploits on real systems.
- Current agents cannot yet complete difficult cybersecurity tasks, which limits present risk.
- However, as LM agent capabilities grow, they may soon outperform non-LM tools, increasing potential harm.
- Releasing the framework could accelerate development of more capable cybersecurity agents, hastening this risk.

### 📌 Potential Benefits

- **Automated penetration testing analogy:** The agent can be viewed similarly to open-source penetration testing tools (e.g., Metasploit, OWASP Nettacker), which are widely adopted despite dual-use risk because their benefits are judged to outweigh the harms.
- **Marginal risk is low:** Related works already openly release similar code (e.g., LLM-based penetration testing tools, CTF agent/benchmark pairs), so releasing this work adds only minimal incremental risk given existing alternatives.
- **Informs policy and regulation:** With growing government interest in regulating AI, transparent release of evidence helps policymakers and regulatory bodies (e.g., UK AISI) better understand real capabilities and risks in cybersecurity agents.
- **Scientific reproducibility:** Transparency in code, data, and methods supports reproducibility — a persistent challenge across machine learning research — and allows the community to build on this work, accelerating scientific progress.

> **Conclusion:** After weighing these factors, the authors chose to publicly release their code and data.

---

## Acknowledgments

The authors thank Alan De Loera, Avi Gupta, Ricky Thai, Peter De La Cruz, Tenzin Chonzom, Elijah Song, and Uche Ochuba for their help reviewing challenges. They thank Open Philanthropy for funding, and HackTheBox, Project Sekai CTF, LosFuzzys, and HKCERT for publicly releasing their challenges with detailed writeups and rich metadata.

---

## Author Contributions

Cybench was made possible through contributions from a large team. Key roles included:

| Author | Key Contributions |
|---|---|
| **Andy Zhang** | Conceived and designed the project; created initial codebase; co-designed subtasks concept; led execution, experimentation, analysis, and writing |
| **Neil Perry** | Co-designed subtasks concept; led design/execution of subtasks; wrote significant portions of the initial draft |
| **Riya Dulepet** | Led figure design; contributed to tables, plots, experiments, run-log analysis, agent implementation, and 4 tasks |
| **Joey Ji** | Contributed to agent development, CI setup, experiments, run-log analysis, and 4 tasks; led log visualization |
| **Celeste Menders** | Led website development; contributed to data analysis, log visualization, and 5 tasks (including the most challenging) |
| **Justin Lin** | Contributed to CI/environment setup, agent development, experiments, data visualization, and subtasks |
| **Eliot Jones** | Contributed to CI/environment setup, experiments, task/log analysis, and 8 tasks |
| **Gashon Hussein** | Contributed to CI/environment setup and agent development |
| **Samantha Liu** | Led "first blood" data analysis and its appendix; contributed to experiments, agent implementation, and 4 tasks |
| **Donovan Jasper** | Contributed to subtasks writing/approval, task and competition analysis, and 4 tasks |
| **Pura Peetathawatchai** | Contributed to subtasks writing/approval and 2 tasks |
| **Ari Glenn** | Contributed to 4 tasks; hosted help sessions |
| **Vikram Sivashankar** | Contributed to 4 tasks and agent development |
| **Daniel Zamoshchin** | Contributed to 4 especially difficult tasks |
| **Leo Glikbarg** | Contributed to 3 tasks and subtasks writing/approval |
| **Derek Askaryar** | Contributed to 3 tasks |
| **Mike Yang** | Contributed to 3 tasks |
| **Teddy Zhang** | Contributed to 2 tasks |
| **Rishi Alluri** | Contributed to 2 tasks |
| **Nathan Tran** | Contributed to 2 tasks |
| **Rinnara Sangpisit** | Contributed to 2 tasks |
| **Polycarpos Yiorkadjis** | Contributed to 2 tasks |
| **Kenny Osele** | Contributed to 1 task |
| **Gautham Raghupathi** | Contributed to 1 task |
| **Dan Boneh** | Provided overall guidance, especially in cybersecurity; feedback on the paper |
| **Daniel E. Ho** | Led initial project formation discussions; provided policy guidance and paper feedback |
| **Percy Liang** | Led project ideation, scoping, direction, and overall management; guided design and paper feedback |

---

## References (Partial)

- Abu-Dabaseh, F. & Alshammari, E. *Automated penetration testing: An overview.* 4th International Conference on Natural Language Computing, 2018.
- Anthropic. *Claude 3.5 Sonnet*, 2024.
- Anthropic. *Claude 3*, 2024.
- Anthropic. *Models — Anthropic docs*, 2024.
- Anthropic. *Claude 3 Models*, 2024.
- Anurin, A., Ng, J., Schaffer, K., Schreiber, J., & Kran, E. *Catastrophic Cyber Capabilities Benchmark (3CB): Robustly evaluating LLM agent cyber offense capabilities.* arXiv:2410.09114, 2024.
- Bhatt, M. et al. *CyberSecEval 2: A wide-ranging cybersecurity evaluation suite for large language models.* arXiv:2404.13161, 2024.
- ctfTime. *CTF competition participants*, 2023.
- ctfTime Glacier. *Glacier CTF 2023 competition*, 2023.
- Deng, G. et al. *PentestGPT: An LLM-empowered automatic penetration testing tool.* 2023.
- Dubey, A. et al. *The Llama 3 herd of models.* arXiv:2407.21783, 2024.
- Elangovan, A., He, J., & Verspoor, K. *Memorization vs. generalization: quantifying data leakage in NLP performance evaluation.* arXiv:2102.01818, 2021.
- Fang, R., Bindu, R., Gupta, A., & Kang, D. *LLM agents can autonomously exploit one-day vulnerabilities.* arXiv:2404.08144, 2024.
- Fang, R., Bindu, R., Gupta, A., Zhan, Q., & Kang, D. *LLM agents can autonomously hack websites.* arXiv:2402.06664, 2024.
- Fang, R., Bindu, R., Gupta, A., Zhan, Q., & Kang, D. *Teams of LLM agents can exploit zero-day vulnerabilities.* arXiv:2406.01637, 2024.
- Google. *Gemini 1.5 Pro*, 2024.
- Google. *Gemini 1.5.* arXiv:2403.05530, 2024.
- Guha, N. et al. *AI regulation has its own alignment problem: The technical and institutional feasibility of disclosure, registration, licensing, and auditing.* George Washington Law Review, Forthcoming, 2023.
- Hack The Box. *Cyber Apocalypse 2024*, 2024.
- Happe, A. & Cito, J. *Getting pwn'd by AI: Penetration testing with large language models.* ESEC/FSE '23, 2023.
- HKCERT. *HKCERT 2023 CTF Competition participants*, 2023.
- HKCert CTF. *CTF Challenges*, 2023.
- hkcertCTF. *HKCERT CTF Competition*, 2023.

*(Reference list continues beyond this chunk.)*
