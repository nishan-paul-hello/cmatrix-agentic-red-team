⚙️ Chunk 2 of the paper

## 4.1 Decision-making: ALFWorld (continued)

🖼️ Figure 3: Two line charts. (a) ALFWorld Success Rate — cumulative proportion of solved environments (134 tasks) across 10 trials, comparing "ReAct only," "ReAct + Reflexion (Heuristic)," and "ReAct + Reflexion (GPT)." Both Reflexion variants climb from ~0.62 to ~0.95–0.97, while ReAct-only plateaus around 0.75. (b) Classification of ALFWorld trajectories by failure reason — proportion of environments failing due to "hallucination" vs "inefficient planning," for ReAct-only vs ReAct + Reflexion, across trials. ReAct-only hallucination stays high (converging near 0.22); Reflexion sharply reduces both failure types toward near-zero.

> 📌 **Key finding:** Self-reflection distills long, failed trajectories into reusable "self-hints." Long-term memory helps in two main ways:
> 1. An early mistake in a long trajectory can be identified, letting the agent suggest a new action or long-term plan.
> 2. When there are many surfaces/containers to check for an item, the agent can use experience memory across trials to search more thoroughly.

The learning curve suggests learning happens over multiple experiences — an initial spike in improvement between the first two trials, then a steady climb over the next several trials to near-perfect performance. A ReAct-only agent, by contrast, converges at a **22% hallucination rate** with no long-term recovery.

---

## 4.2 Reasoning: HotpotQA

**Dataset:** HotpotQA — a Wikipedia-based dataset with 113k question-answer pairs requiring reasoning over multiple supporting documents.

### 🔬 Method

- **Reasoning-only test:** Reflexion + Chain-of-Thought (CoT), implemented two ways:
  - $Q \rightarrow A$
  - $Q, C_{gt} \rightarrow A$ (ground-truth context $C_{gt}$ given, since CoT alone isn't a multi-step decision-making technique — this isolates reasoning ability over long context)
- **Holistic reasoning + acting test:** Reflexion + ReAct agent, retrieving context via a Wikipedia API and reasoning step-by-step.
- **Prompting:** 6-shot for CoT, 2-shot for ReAct, 2-shot for self-reflection (examples in appendix).
- **Evaluation signal:** exact-match answer grading (binary success/fail) between trials.
- **Memory:** sliding window of 3 experiences (same setup as §4.1 ALFWorld).

### 📊 Results

- Reflexion outperforms all baselines by significant margins over multiple learning steps.
- ReAct-only, CoT-only, and CoT (GT)-only **fail to probabilistically improve** on any task — none of the tasks failed on trial 1 were solved in later trials (temperature 0.7).
- Reflexion runs allowed the agent to retry failed tasks until **3 consecutive failures**.
- CoT (GT) scores higher due to ground-truth context access, but still gets **39%** of questions wrong.
- Reflexion improves accuracy by **14%** over CoT (GT) *without* access to the ground-truth answer.

🖼️ Figure 4: Three line charts over trials (0–100 HotpotQA questions). (a) HotPotQA Success Rate — CoT only, ReAct only, CoT + Reflexion, ReAct + Reflexion; both Reflexion variants rise from ~0.35–0.4 toward ~0.65–0.75 while the non-Reflexion baselines stay flat (~0.3–0.45). (b) HotPotQA CoT (GT) — CoT (GT) only vs CoT (GT) + Reflexion; Reflexion rises from ~0.65 to ~0.75 while the baseline stays flat near 0.6. (c) HotPotQA Episodic Memory — CoT (GT) only, CoT (GT) + EPM, CoT (GT) + EPM + Reflexion; the full Reflexion+EPM line reaches the highest performance (~0.75–0.8).

### Analysis: episodic memory ablation

To isolate the benefit of the self-reflective step, the authors compare against a **CoT (GT)** baseline (reasoning over long ground-truth context):

1. Add **episodic memory (EPM)** — include only the most recent trajectory.
2. Add the full **self-reflection** step as a final pass (verbal explanation, written in first person).

> 📌 Self-reflection improves learning by an **8% absolute boost** over the episodic-memory-only advantage — supporting the claim that refinement-only approaches are less effective than self-reflection-guided refinement.

---

## 4.3 Programming

Reflexion and baseline approaches are evaluated on Python and Rust code generation using:

- **MBPP** and **HumanEval** — function-body generation from natural language descriptions.
- **LeetcodeHardGym** — a new interactive programming gym introduced in this paper, containing 40 Leetcode hard-rated questions released *after* October 8, 2022 (GPT-4's pretraining cutoff).
- **MultiPL-E** — a benchmark compiler used to translate HumanEval/MBPP subsets into Rust, demonstrating that Reflexion generalizes across interpreted and compiled languages.

### 🔬 Method: self-generated unit tests

Programming allows a more grounded self-evaluation signal via self-generated tests, making Reflexion eligible for pass@1 reporting:

1. Generate diverse tests with natural-language descriptions via Chain-of-Thought prompting.
2. Filter to syntactically valid tests by checking each can form a valid abstract syntax tree (AST).
3. Sample $n$ tests (max **6**) to form test suite $T = \{t_0, t_1, \ldots, t_n\}$.

Otherwise the learning loop matches the reasoning/decision-making setup, but with a **max memory of 1 experience**.

### 📊 Results — Table 1: Pass@1 Accuracy

| Benchmark + Language | Prev SOTA Pass@1 | SOTA Pass@1 | Reflexion Pass@1 |
|---|---|---|---|
| HumanEval (PY) | 65.8 (CodeT + GPT-3.5) | 80.1 (GPT-4) | **91.0** |
| HumanEval (RS) | – | 60.0 (GPT-4) | **68.0** |
| MBPP (PY) | 67.7 (CodeT + Codex) | **80.1 (GPT-4)** | 77.1 |
| MBPP (RS) | – | 70.9 (GPT-4) | **75.4** |
| Leetcode Hard (PY) | – | 7.5 (GPT-4) | **15.0** |

Reflexion sets new SOTA on all benchmarks except **MBPP Python**.

### Analysis: why Reflexion underperforms on MBPP Python

Self-reflecting code agents are limited by the quality/diversity of their generated tests:

- **False positive** (tests pass, solution is actually wrong) → agent prematurely accepts an incorrect solution.
- **False negative** (tests fail, solution is actually correct) → agent can potentially use self-reflection to recognize the test itself was wrong and preserve the correct code.

> ⚠️ False positives are worse than false negatives for Reflexion, since false negatives are at least recoverable via self-reflection.

**Table 2: Test-generation performance (HumanEval / MBPP)**

| Benchmark + Language | Base | Reflexion | TP | FN | FP | TN |
|---|---|---|---|---|---|---|
| HumanEval (PY) | 0.80 | 0.91 | 0.99 | 0.40 | 0.01 | 0.60 |
| MBPP (PY) | 0.80 | 0.77 | 0.84 | 0.59 | 0.16 | 0.41 |
| HumanEval (RS) | 0.60 | 0.68 | 0.87 | 0.37 | 0.13 | 0.63 |
| MBPP (RS) | 0.71 | 0.75 | 0.84 | 0.51 | 0.16 | 0.49 |

*(TP: tests pass & solution correct · FN: tests fail & solution correct · FP: tests pass & solution incorrect · TN: tests fail & solution incorrect)*

For MBPP Python, the **false positive rate is 16.3%** vs. only **1.4%** for HumanEval Python — despite similar baseline pass@1 accuracies (~80–82%) — explaining much of the gap.

### 🔬 Ablation study — Table 3

Tested on the 50 hardest HumanEval Rust problems (chosen because the Rust compiler gives verbose, useful error logs).

| Approach | Test Generation | Self-reflection | Pass@1 (Acc) |
|---|---|---|---|
| Base model | ❌ | ❌ | 0.60 |
| Test generation omission | ❌ | ✅ | 0.52 |
| Self-reflection omission | ✅ | ❌ | 0.60 |
| **Reflexion** | ✅ | ✅ | **0.68** |

- **Omitting test generation:** accuracy drops to 52% — without unit test guidance, the agent can't tell if its implementation is correct and may make harmful edits with no way to stop early.
- **Omitting self-reflection:** no improvement over baseline (0.60) — test/compilation steps catch syntax/logic errors, but without the natural-language reflection step the agent fails to translate those signals into actual fixes.

> 📌 These results suggest that "blind" trial-and-error debugging (without self-reflection) is ineffective on harder tasks like complex Rust programs.

---

## 5. Limitations

- Reflexion is a natural-language policy optimization technique — powerful, but still susceptible to **non-optimal local minima**.
- Long-term memory here is a **capacity-limited sliding window**; future work could use more advanced structures (e.g., vector embedding databases, SQL databases).
- Code-generation-specific limits on test-driven development accuracy:
  - Non-deterministic generator functions
  - Impure functions interacting with external APIs
  - Hardware-dependent output
  - Parallel/concurrent behavior that's hard to predict

---

## 6. Broader Impact

- LLM agents interacting with external environments (internet, software, robotics) and humans could be empowered toward greater automation — but risks are amplified if misused. More effort is needed on safety and ethical considerations.
- Traditional RL suffers from black-box policies that are hard to interpret/align. Reflexion's "verbal" reinforcement learning could make agents **more interpretable and diagnosable** — e.g., self-reflections could be monitored to verify proper intent before a tool is used.

---

## 7. Conclusion

Reflexion teaches agents to learn from past mistakes via verbal reinforcement, and Reflexion agents significantly outperform common decision-making baselines. Future work could adapt more advanced traditional-RL techniques — e.g., natural-language value learning or off-policy exploration — into the Reflexion framework.

---

## 8. Reproducibility

⚠️ The authors advise using **isolated execution environments** when running autonomous code-writing experiments, since generated code is not validated before execution.

---

## References (partial — chunk continues to next document)

1. Ahn et al. (2022). *Do as I can, not as I say: Grounding language in robotic affordances.* arXiv:2204.01691.
2. Austin et al. (2021). *Program synthesis with large language models.* arXiv:2108.07732.
3. Brooks et al. (2022). *In-context policy iteration.* arXiv:2210.03821.
4. Cassano et al. (2022). *MultiPL-E: A scalable and extensible approach to benchmarking neural code generation.*
5. Chen et al. (2022). *CodeT: Code generation with generated tests.* arXiv:2207.10397.
6. Chen et al. (2021). *Evaluating large language models trained on code.* arXiv:2107.03374.
7. Chen et al. (2023). *Teaching large language models to self-debug.* arXiv:2304.05128.
8. Côté et al. (2019). *TextWorld: A learning environment for text-based games.* Computer Games (CGW 2018), Springer.
9. Goodman, N. (2023). *Meta-Prompt: A simple self-improving language agent.* noahgoodman.substack.com.
10. Kim, Baldi, McAleer (2023). *Language models can solve computer tasks.* arXiv:2303.17491.
11. Lam et al. (2020). *A large-scale longitudinal study of flaky tests.* Proc. ACM Program. Lang., 4(OOPSLA).
12. Le et al. (2022). *CodeRL: Mastering code generation through pretrained models and deep reinforcement learning.* NeurIPS 35:21314–21328.
13. Li et al. (2023). *StarCoder: may the source be with you!* arXiv:2305.06161.
14. Li et al. (2022). *Competition-level code generation with AlphaCode.* Science, 378(6624):1092–1097.
15. Madaan et al. (2023). *Self-Refine: Iterative refinement with self-feedback.* arXiv:2303.17651.
16. Nair et al. (2023). *DERA: Enhancing large language model completions with dialog-enabled resolving agents.* arXiv:2303.17071.
17. Nakano et al. (2021). *WebGPT: Browser-assisted question-answering with human feedback.* arXiv:2112.09332.
18. OpenAI (2023). *GPT-4 Technical Report.* ArXiv.
