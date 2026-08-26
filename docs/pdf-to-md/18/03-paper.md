⚙️ Chunk 3 of the paper

🖼️ Figure 3: Line chart titled "Memory-driven performance evolution on CyberGym." X-axis is Task index (0–1600), Y-axis is Success rate (0.0–1.0). Four lines (moving average, window size 100) compare memory configurations using Gemini-2.5-Pro: **No memory** (lowest, ~0.1–0.2), **Static memory** (slightly higher, ~0.2), **Cold start (evolving)** (rises over time, converging with warm start by the end, ~0.4–0.45), and **Warm start (evolving)** (highest throughout, rising to ~0.5 by task index 1600).

## Iterative Planning & Execution Feedback (continued)

- 📌 Analysis covers exploitation iterations from **1 to 20**, run on **Cybench** with two Gemini models (see Figure 2).
- Both **Gemini-2.5-Pro** and **Gemini-3-Pro** benefit from iterative planning and execution feedback — performance increases as the iteration budget grows.
- **Gemini-3-Pro**:
  - Improves more rapidly, with substantial gains in early iterations.
  - Reaches peak performance earlier, around **iteration 13**.
  - Attains a higher peak success rate overall.
- **Gemini-2.5-Pro**:
  - Continues improving until approximately **iteration 17**.
- ⚠️ Both models exhibit **saturation** after their respective peaks — diminishing returns from additional iterations.
- 📌 Takeaway: Stronger backbone models achieve higher final performance *and* exploit execution feedback more efficiently.
- Additional analysis of max detection iteration is provided in **Appendix C**.

---

# 5. Analysis

Co-RedTeam is analyzed beyond raw benchmark performance through **three lenses**:

1. Evolution effect through memory
2. Reliability of vulnerability discovery
3. Latency

## 🔬 Memory Analysis

> Human security experts improve over time by accumulating and refining experience. This section evaluates whether the agent exhibits similar learning dynamics via long-term memory initialization and evolution.

**Setup:** Evaluated on **CyberGym** using **Gemini-2.5-Pro** as backbone. Tasks processed sequentially to allow memory accumulation. Performance reported as moving-average success rate (window size 100) to reveal long-horizon trends (Figure 3).

### Four Memory Configurations

| Configuration | Description |
|---|---|
| **No memory** | Agent operates without any long-term memory |
| **Static memory** | Initialized with curated security memory; memory updates disabled |
| **Cold Start (Evolving)** | Begins with empty memory; continuously writes new experiences |
| **Warm Start (Evolving)** | Curated memory provided as a warm start, and continues evolving |

### 📊 Results — Two Complementary Effects

**1. Initialization effect**
- Warm-started configurations outperform cold-start counterparts in early stages — curated prior knowledge provides an immediate advantage by guiding exploration and reducing unproductive actions.
- **Static Memory** improves early success rates over **No Memory**, showing even fixed security knowledge can bootstrap exploitation performance.

**2. Evolution effect**
- Both evolving configurations show an upward trend over time; static/memory-free settings plateau early.
- **Cold Start (Evolving)** gradually closes the gap with warm-start variants — the agent can autonomously acquire effective strategies from experience.
- **Warm Start (Evolving)** achieves the strongest performance overall, combining rapid early gains with continued long-term improvement.

> 📌 **Conclusion:** Long-term memory is not only useful for initialization but essential for enabling cumulative, experience-driven improvement in security exploitation tasks.

---

## 🔬 Vulnerability Discovery Reliability

Prior tables (1 and 5) focus on success rate of detecting vulnerabilities in **BountyBench**. Since Co-RedTeam usually surfaces zero to two vulnerabilities, reliability is further investigated via **precision and recall**.

**Table 3 | Recall and Precision of Detection task on BountyBench (Gemini-2.5-pro)**

| Method | Precision | Recall |
|---|---|---|
| Vanilla | 0 | 0 |
| OpenHands | 0 | 0 |
| C-agent | 0.024 | 0.025 |
| **Co-RedTeam** | **0.143** | **0.125** |

- 📌 Co-RedTeam significantly outperforms all baselines on both metrics.
- Precision of **14.3%** is roughly **5× higher** than C-agent, showing Co-RedTeam discovers vulnerabilities much more reliably.

---

## 🔬 Latency Analysis

Despite its multi-turn conversational architecture, Co-RedTeam is shown to be surprisingly efficient.

**Table 4 | Latency analysis: average running time in seconds**

| Agent | Model | Cybench | BountyBench | CyberGym |
|---|---|---|---|---|
| Vanilla | Gemini-2.5-pro | 50.1 | 36.2 | 42.6 |
| Vanilla | Gemini-3-pro | 43.7 | 34.9 | 37.8 |
| OpenHands | Gemini-2.5-pro | 392.1 | 227.5 | 633.5 |
| OpenHands | Gemini-3-pro | 347.6 | 219.6 | 609.7 |
| C-agent | Gemini-2.5-pro | 387.2 | 215.3 | 636.4 |
| C-agent | Gemini-3-pro | 320.3 | 201.9 | 611.7 |
| **Co-RedTeam** | Gemini-2.5-pro | 361.5 | 205.4 | 619.7 |
| **Co-RedTeam** | Gemini-3-pro | 319.8 | 198.7 | 605.2 |

- 📌 Co-RedTeam consistently registers **lower runtimes** than both OpenHands and C-agent across all three benchmarks (e.g., 198.7s vs 219.6s for OpenHands on BountyBench).
- Switching to **Gemini-3-pro** yields a universal speed improvement over Gemini-2.5-pro, reducing latency by roughly **10–15%** across the board — helping offset the computational cost of the more advanced iterative detection strategies.

---

# 6. Conclusion

Co-RedTeam is introduced as a **security-aware multi-agent framework** for automatic vulnerability discovery and exploitation. By integrating:

- Security-domain knowledge
- Code-aware analysis
- Execution-grounded iterative reasoning
- Long-term memory

...Co-RedTeam aligns agent behavior with real-world cybersecurity workflows.

> 📌 **Headline results:** Over **60%** success rate in exploitation tasks, and over **10%** absolute improvement in detection tasks.

---

## References

*(Bibliography — author list omitted for brevity; full citation list follows standard arXiv/conference format, covering topics spanning LLM agents, cybersecurity surveys, vulnerability detection benchmarks (Cybench, BountyBench, CyberGym), and related agentic-AI frameworks such as OpenHands and ReasoningBank.)*
