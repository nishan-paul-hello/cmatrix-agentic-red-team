# Architecture-Final Review: Findings and Applied Fixes

**Scope:** Independent review of `architecture-final.md` after the adjudication-based revision was complete. Focused on algorithmic precision, computational feasibility, and ablation rigor.

---

## Findings

### 1. Quadratic Edge-Inference Cost (§7.3) — **HIGH**

§7.3 Step 3 originally used pairwise LLM calls — `2×M` calls per new VDG node against all M existing nodes. For 15 nodes, total edge-inference cost: ~210 frontier-model calls — exceeding the 50-call-per-CVE compute budget before any Specialist runs.

**Fix applied:**
- §7.3: Replaced pairwise loop with **batched prompts** (2 calls per new node regardless of VDG size)
- §12.3: Clarified the 50-call cap as **Specialist-facing only**; orchestration overhead reported separately
- §15.9: Added new threat acknowledging edge-inference scalability and batching tradeoff

### 2. Ablation Condition (c) Underspecified (§13.1) — **HIGH**

The `(d) > (c)` test is the entire falsifiable claim for C1, but "stacked" lacked precise algorithmic definition. The subtle distinction: in (b), N counts only eligible nodes; in (c), N counts all nodes with a post-filter.

**Fix applied:**
- §13.1: Added precise pseudocode for both condition (c) and condition (b), making the scoring-population difference explicit

### 3. Path Enumeration Unbounded (§7.5) — **MEDIUM**

`max_length=5` prevents deep chains but not combinatorial explosion in wide, shallow DAGs. No stated enumeration bound existed.

**Fix applied:**
- §7.5 Step 1: Added `max_paths=100` beam cap — retains top-100 by partial score at each length extension

### 4. §7.4 Header Misnomer — **TRIVIAL**

"UCB Backpropagation Update Rule" implied MCTS-style ancestor updates. The algorithm does local reward accumulation and forward propagation to `enables` children only.

**Fix applied:**
- Renamed to **"UCB Update Rule"**

---

## Summary of Changes Applied

| # | Location | Change | Net Lines |
|---|---|---|---|
| 1 | §7.3 — Prerequisite Edge Construction Algorithm | Pairwise → batched edge inference | +13 |
| 2 | §7.4 — UCB Update Rule | Header rename | 0 |
| 3 | §7.5 — Path Scoring | Added `max_paths=100` beam cap | +4 |
| 4 | §12.3 — Statistical Rigor and Methodology | Clarified 50-call cap scope | +1 |
| 5 | §13.1 — Core Ablations (Must Have) | Ablation (c) pseudocode | +16 |
| 6 | §15.9 — Edge-Inference Scalability | Edge-inference scalability threat | +4 |

**Total:** ~36 lines added across 6 locations. No structural redesign. No new ablations. No new contributions.

**Status after fixes:** Architecture is specified at implementation level. The remaining bottleneck is empirical — the VDG edge-inference pilot study on PentestEval ground-truth dependency annotations (§15.1).
