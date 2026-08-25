⚙️ Chunk 3 of the paper

Claude Code also struggled to remain focused on a single attack path. While attempting to determine the ActiveMQ version, it would abruptly switch to trying the default-credential brute force. After selecting and spending a long time configuring a Metasploit module, it might suddenly divert to investigating another script found on Exploit-DB, creating needless context switches and time loss. Finally, because Claude Code lacked explicit, structured reasoning, it failed to map the discovered ActiveMQ version to the most appropriate CVE. As a result, it missed the more effective Metasploit module and wasted excessive time on two suboptimal exploits.

## 🔬 E. Ablation Study

CHECKMATE is compared against two commonly used strategies for enhancing LLM-based systems:

1. **RAG-based approach** — an alternative strategy for expanding an LLM's knowledge base. Metadata for more than 14,000 Metasploit modules, NSE scripts, and Nuclei templates was embedded as a document database, with a RAG pipeline implemented on top. Goal: test whether LLM agents can use external knowledge to improve penetration capability without relying on predefined actions and classical planning+.
2. **Structured planning file** — Claude Code maintains a structured JSON planning file instead of its default to-do list. After each command execution, Claude Code updates this file and infers the next step from the revised state, reflecting prior work that uses structured planning representations to improve planning consistency.

> 📌 **Key Idea:** Each method was evaluated on 20 tasks, run three times each. All four methods (CheckMate, ClaudeCode+RAG, ClaudeCode+Structured Plan, ClaudeCode) successfully obtained a remote shell at least once.

### 📊 Results — Cost and Time Comparison

| Method | Median Cost (USD) [IQR] | Median Time (min) [IQR] |
|---|---|---|
| CheckMate | $0.56 [0.48, 0.79] | 6.9 [5.6, 8.6] |
| ClaudeCode+RAG | $0.86 [0.63, 1.19] | 11.8 [7.7, 15.1] |
| ClaudeCode+Structured Plan | $1.11 [0.53, 1.39] | 10.6 [7.4, 17.2] |
| ClaudeCode | $1.43 [1.02, 1.88] | 12.7 [10.5, 19.3] |

*Fig. 7: Cost and time comparison. Error bars represent the interquartile range (25th–75th percentile).*

CHECKMATE achieves the lowest overall cost and shortest execution time, while delivering the most consistent and efficient performance across test cases. RAG and structured planning files can enhance LLM agent efficiency, but classical planning+ provides the most substantial gains in both efficiency and consistency.

## 💬 VI. Discussion and Future Work

### A. Actions and States in Pentesting

Two fundamental questions remain unanswered:

1. What actions and skills does pentesting require?
2. How should we represent the state of the target system?

> ⚠️ **Limitation:** Pentesting spans the full breadth of a system's architecture, configurations, vulnerabilities, and defenses — it has no well-defined action or state space. Current approaches either:
> - Define fixed, finite sets of skills and states (too restrictive), **or**
> - Depend heavily on black-box LLMs to infer target states and propose actions (hard to systematically improve).

This gap highlights the need for future work on representing, organizing, extracting, and operationalizing the fragmented knowledge on actions and states in pentesting.

### B. Multimodal and UI-Aware Pentesting

Existing pentesting systems struggle with rich human-computer interaction, since traditional LLM agents are not good at interpreting non-textual information or operating web UIs like a human. Tasks involving visual elements or dynamic, interactive web components still depend heavily on humans. Advances in multimodal learning and Customizable UI Automation (CUA) offer promising avenues for addressing these limitations, opening possibilities for pentesting in complex UI environments.

## ✅ VII. Conclusion

- A systematic review of existing automated pentesting work was presented through the **Planner-Executor-Perceptor (PEP)** paradigm.
- Evaluation shows out-of-the-box Claude Code+Sonnet 4.5 substantially outperforms all prior systems in this area.
- Further analysis revealed **three limitations** of Claude Code.
- **CHECKMATE** was proposed — a framework coupling classical planning+ with LLM agents to address these limitations.
- Experimental evaluations show CHECKMATE outperforms existing systems in penetration capability, efficiency, and stability.

## ⚖️ Ethical Considerations

- This paper presents a practical study on using LLM agents for pentesting.
- All techniques and systems involved are publicly accessible; no new zero-day attacks were developed.
- All experiments were conducted within authorized virtual environments.
- Service providers will be contacted to inform them of the potential for their products to be used in offensive scenarios.
- This work is intended solely for research and educational purposes; misuse of the discussed techniques is not encouraged or endorsed.

## 📚 References

1. Cybersecurity and Infrastructure Security Agency, "Penetration testing services," U.S. Department of Homeland Security, 2023.
2. MarketsandMarkets, "Penetration testing market size, growth & latest trends," 2024.
3. MarketsandMarkets, "Penetration testing as a service market size & share analysis," 2024.
4. Mayoral-Vilches et al., "Cai: An open, bug bounty-ready cybersecurity ai," arXiv:2504.06017, 2025.
5. Wu et al., "Autopt: How far are we from the end2end automated web penetration testing?" arXiv:2411.01236, 2024.
6. Sarraute, Buffet, Hoffmann, "Pomdps make better hackers: Accounting for uncertainty in penetration testing," AAAI, 2012.
7. Hoffmann, "Simulated penetration testing: from 'dijkstra' to 'turing test++'," ICAPS, 2015.
8. Mirzadeh et al., "Gsm-symbolic: Understanding the limitations of mathematical reasoning in large language models," arXiv:2410.05229, 2024.
9. Lin et al., "Zebralogic: On the scaling limits of llms for logical reasoning," arXiv:2502.01100, 2025.
10. Yamin et al., "Failure modes of llms for causal reasoning on narratives," arXiv:2410.23884, 2024.
11. Chi et al., "Unveiling causal reasoning in large language models: Reality or mirage?" NeurIPS, 2024.
12. Liu et al., "Large language model-based agents for software engineering: A survey," arXiv:2409.02977, 2024.
13. Jin et al., "From llms to llm-based agents for software engineering: A survey of current, challenges and future," arXiv:2408.02479, 2024.
14. Wang et al., "Agents in software engineering: Survey, landscape, and vision," Automated Software Engineering, 2025.
15. Ullah et al., "Llms cannot reliably identify and reason about security vulnerabilities (yet?)," IEEE S&P, 2024.
16. Guo et al., "Repoaudit: An autonomous llm-agent for repository-level code auditing," arXiv:2501.18160, 2025.
17. Rahman et al., "Llm-based data science agents: A survey of capabilities, challenges, and future directions," arXiv:2510.04023, 2025.
18. Anthropic, "Claude code," 2025.
19. Ghallab, Nau, Traverso, *Automated Planning: theory and practice*, Elsevier, 2004.
20. "Vulhub: Open-source vulnerable docker environments."
21. Schwartz, Kurniawati, El-Mahassni, "Pomdp+ information-decay: Incorporating defender's behaviour in autonomous penetration testing," ICAPS, 2020.
22. Sarraute, Buffet, Hoffmann, "Penetration testing== pomdp solving?" arXiv:1306.4714, 2013.
23. Schwartz, Kurniawati, "Autonomous penetration testing using reinforcement learning," arXiv:1905.05965, 2019.
24. Ghanem, Chen, Nepomuceno, "Hierarchical reinforcement learning for efficient and effective automated penetration testing of large networks," Journal of Intelligent Information Systems, 2023.
25. Zhou et al., "Autonomous penetration testing based on improved deep q-network," Applied Sciences, 2021.
26. De Pasquale et al., "ChainReactor: Automated privilege escalation chain discovery via AI planning," USENIX Security, 2024.
27. Obes, Sarraute, Richarte, "Attack planning in the real world," arXiv:1306.4044, 2013.
28. Chen et al., "A survey on penetration path planning in automated penetration testing," Applied Sciences, 2024.
29. Wang et al., "An automatic planning-based attack path discovery approach from it to ot networks," Security and Communication Networks, 2021.
30. Deng et al., "PentestGPT: Evaluating and harnessing large language models for automated penetration testing," USENIX Security, 2024.
31. Armur-Ai, "Auto-pentest-gpt-ai: Llm powered pentesting for your software," 2025.
32. Huang, Zhu, "Penheal: A two-stage llm framework for automated pentesting and optimal remediation," Workshop on Autonomous Cybersecurity, 2023.
33. Xu et al., "Autoattacker: A large language model guided system to implement automatic cyber-attacks," arXiv:2403.01038, 2024.
34. Kong et al., "Vulnbot: Autonomous penetration testing for a multi-agent collaborative framework," arXiv:2501.13411, 2025.
35. GH05TCREW, "Pentestagent: All-in-one offensive security toolbox with ai agent and mcp architecture," 2025.
36. Wang et al., "Opencua: Open foundations for computer-use agents," arXiv:2508.09123, 2025.
37. Yang et al., "Gta1: Gui test-time scaling agent," arXiv:2507.05791, 2025.
38. Blum, Furst, "Fast planning through planning graph analysis," Artificial Intelligence, 1997.
39. Kambhampati et al., "Llms can't plan, but can help planning in llm-modulo frameworks," arXiv:2402.01817, 2024.
40. Cao et al., "Large language models for planning: A comprehensive and systematic survey," arXiv:2505.19683, 2025.
41. Zhang et al., "Mitigating spatial hallucination in large language models for path planning via prompt engineering," Scientific Reports, 2025.
42. Ji et al., "Testing and understanding erroneous planning in llm agents through synthesized user inputs," arXiv:2404.17833, 2024.
43. Yao et al., "Are reasoning models more prone to hallucination?" arXiv:2505.23646, 2025.
44. Liu et al., "Lost in the middle: How language models use long contexts," TACL, 2024.
45. Shen et al., "Pentestagent: Incorporating llm agents to automated penetration testing," ACM ASIACCS, 2025.
46. "picoCTF."
47. "Hack The Box."
48. Shao et al., "Nyu ctf bench: A scalable open-source benchmark dataset for evaluating llms in offensive security," NeurIPS, 2024.
49. Ginige et al., "Autopentester: An llm agent-based framework for automated pentesting," arXiv:2510.05605, 2025.
50. "Xbow: Ai-powered penetration testing platform," XBOW USA Inc., 2025.
51. 0x4m4, "Hexstrike ai mcp agents," 2025.
52. OpenAI, "Openai codex," 2025.
53. Google, "Code assist," 2025.
