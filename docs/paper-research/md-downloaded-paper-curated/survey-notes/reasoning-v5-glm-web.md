# CMatrix Research-Level Audit & Comparison

---

## 1. Evaluation of Architecture-1

### 1.1 Strengths

**Evidence-driven problem statement.** The opening section is genuinely well-constructed. Citing specific failure-mode percentages from CVE-Bench Table 5 (37.5%–80.0% insufficient exploration across all agent/setting combinations) and PentestEval's cumulative ablation (SMP 0.31 → SMP-GT-ADM 0.67, with ADM contributing the largest marginal +0.14) gives the problem statement empirical teeth that most papers lack. The honest framing of the ADM effect as marginal (not isolated) preempts a common reviewer attack.

**Disciplined benchmark scoping.** The explicit exclusion of REST API exploitation because RESTler's evaluation targets are one-off case studies without a reusable oracle is *exactly* the kind of methodological self-constraint that top-tier security reviewers reward. Most papers either overclaim scope or silently ignore benchmarks they can't match. This document does neither.

**Declarative task API.** The strongest individual design choice. Five independent papers (Incalmo, CHECKMATE, VulnBot, D-CIPHER, RESTler internally) converge on this pattern. Architecture-1 correctly elevates it to a first-class design principle rather than an implementation detail.

**Fresh context per specialist.** Independently validated by PentestGPT, D-CIPHER, and VulnBot. Correctly adopted without overclaiming.

**Mandatory PoC validation with per-surface oracles.** Adopting CVE-Bench's 8-attack-type oracle, MHBench's per-environment criterion, and PrediQL's vulnerability-detection schema is the right design. MAPTA showed this eliminates false positives, and Architecture-1 correctly makes it mandatory rather than optional.

**Model-tiering policy.** Formalizing the "architecture dominates model scale" finding (replicated across 6 papers) into an explicit tiering rule is good methodology. Benchmarking across ≥3 backbone families is the right way to substantiate it.

**Preemptive limitations section.** The threats-to-validity section honestly addresses real-world vs. sandbox gap, VDG generalization ceiling, GraphQL asymmetry, and REST exclusion. This is where most papers fail, and Architecture-1 handles it well.

### 1.2 Weaknesses

**The VDG is a schema, not an algorithm.** This is the single largest problem. The document claims the VDG is the "central novel data structure" and provides a node schema (`{weakness_id, vuln_class, prerequisites[], enables[], priority, attack_intent, promise φ, TDI δ, evidence E}`). But a schema is not an algorithm. A top-tier reviewer will immediately ask:

- *Who creates edges?* The Team Manager? Specialists? Automatically? Under what conditions?
- *What is the UCB formula?* Standard UCB1? A modified version? What is the exploration parameter c?
- *How are prerequisites inferred?* Pure LLM reasoning? Rule-based? Hybrid? What prompt?
- *How does the graph handle failed exploitation?* Does the node get a lower score? Is it removed? Are dependent nodes blocked?
- *How does the graph handle conflicting evidence?* Two specialists disagree on whether a prerequisite exists?
- *Is the graph acyclic?* What prevents cycles?
- *How is path-level scoring done?* The document scores nodes, but attack paths are sequences of nodes. A high-scoring node behind a failed prerequisite is worthless.

Without answers to these questions, the VDG is an undifferentiated graph data structure, not a research contribution. A reviewer at USENIX/IEEE S&P would reject the paper at this stage regardless of the evaluation results, because the mechanism cannot be reproduced or reasoned about.

**The hybrid classical-planning claim is hollow.** Section 5.2 says "CMatrix uses Classical Planning+ for the known action-sequence skeleton (recon → surface enumeration → exploit) and reserves the VDG's UCB/LLM layer strictly for updates driven by non-deterministic effects." This is not a hybrid architecture. "Recon → surface enumeration → exploit" is a phase ordering, not a PDDL plan. There is no PDDL domain file specified, no operator library, no planning algorithm. A reviewer would ask: "What does Classical Planning+ actually do here that a simple phase-state machine doesn't do?" If the answer is "nothing," the claim should be removed.

**The exploration fix is underwhelming relative to its framing.** Section 5.3 frames CMatrix as the "direct architectural fix for CVE-Bench's dominant failure mode." But the actual mechanisms are:

1. A parallel `alternative_surface_queue` — this is maintaining a secondary todo list.
2. A meta-critic step after every 5 actions — this is a periodic self-check.
3. Full-depth recon defaults (`nmap -p- -sV`) — this is a default scan setting.

None of these are *architectural* innovations in the sense a top reviewer would recognize. They are reasonable engineering choices that any competent system would include. Framing them as the "direct fix" for a 37.5%–80.0% failure mode sets an expectation the mechanisms can't meet.

**Three-tier memory lacks operational specificity.** The document says "FAISS + cross-encoder rerank" and "description-embedding retrieval" but doesn't specify:

- What embedding model?
- What is actually embedded (natural language descriptions of exploits? Structured JSON? Tool invocations?)
- What is the chunking strategy?
- When is retrieval triggered (at mission start only? Before every specialist invocation?)
- How are retrieved memories injected (as few-shot examples? As background context? As constraints?)
- What counts as "verified" for skill promotion? Who verifies? What is the verification procedure?
- What is the skill representation (a template? A natural language procedure? A parameterized function?)

Without these details, the 3-tier memory is a design sketch, not an implementable system.

**No failure recovery mechanism.** The document describes what happens when things go right (specialist returns finding → Handoff Bridge → VDG update → next node). It does not describe what happens when things go wrong:

- Specialist fails to exploit a vulnerability (what happens to the VDG node?)
- Specialist times out (what happens?)
- Team Manager selects a node whose prerequisites aren't met (how is this detected and corrected?)
- All nodes on the current path fail (how does the system backtrack?)

This is a critical gap because the surveyed literature identifies "getting stuck" as a major failure mode (PentestGPT Finding 4: depth-first tunnel vision). An architecture that can't recover from failure will perform worse than one that can, and this isn't addressed.

**No early stopping heuristic.** The only termination criteria are wall-clock timeout and cost ceiling. This means the system will run until it runs out of money, even if it stopped finding anything new 8 minutes ago. This directly undermines the cost-per-exploit metric — a system that terminates intelligently will have a lower cost-per-exploit than one that doesn't, even if both find the same vulnerabilities.

**No statistical methodology.** The document doesn't specify:

- Number of runs per benchmark (for variance estimation)
- Confidence intervals on reported metrics
- Statistical significance tests for comparisons
- Compute normalization (if CMatrix uses 10× more LLM calls than a baseline, the comparison is unfair)

Top-tier venues require these. Their absence is a rejection reason regardless of results.

**Cross-surface "generalization" is not generalization.** Evaluating on three benchmarks with one architecture is multi-benchmark evaluation, not generalization. Generalization would mean: train/evaluate on web, then show zero-shot transfer to GraphQL without any GraphQL-specific specialist or benchmark exposure. What Architecture-1 actually does is have specialist pools for each surface type and evaluate each on its own benchmark. A reviewer would correctly identify this as "you built a system with three modes and evaluated each mode separately" and reject the generalization claim.

**Session Persistence Service is mentioned but not integrated.** Section 4.4 describes the service but doesn't show where it fits in the architecture diagram (Figure 1 doesn't include it), doesn't specify its API, and doesn't explain how it interacts with the ESS. Is it part of the ESS? A separate service? How do specialists access it?

### 1.3 Assessment of Specific Criteria

| Criterion | Assessment |
|---|---|
| Step-by-step methodology | **Insufficient.** VDG construction, update, and scoring are described at schema level, not algorithm level. |
| End-to-end workflow | **Present but incomplete.** The happy path is described; failure paths are missing. |
| All necessary components | **Mostly present.** Missing: failure recovery, early stopping, VDG consistency checks. |
| Architecture diagrams | **Adequate.** The Mermaid diagram is clear but doesn't show session persistence, memory retrieval flow, or failure paths. |
| Tool orchestration detail | **Strong for specialists** (SQLi/XSS sub-FSMs are well-described), **weak for general case** (how does the Team Manager decide which specialist to dispatch for a novel VDG node type?). |
| Reproducible implementation details | **Weak.** No pseudocode, no API specifications, no context window budgets, no LLM call patterns. |
| Evaluation methodology | **Strong in scope** (7-tier benchmarking), **weak in rigor** (no runs, no CIs, no significance tests, no compute normalization). |
| Research contribution vs. engineering | **Borderline.** The VDG has the potential to be a contribution if formally specified, but as currently written it reads as engineering integration. The other claimed contributions (cross-surface, economic metrics, scoping discipline) are not contributions. |

---

## 2. Genuine Novelty Assessment

### 2.1 Claim: VDG Unifies UCB Search and Dependency Planning

**Prior work that does something similar:**
- EGATS: UCB-style Task Difficulty Index for exploration
- PentestEval: Attack Dependency Graph with explicit prerequisite edges
- CHECKMATE: PDDL preconditions/effects for dependency modeling
- T-Agent: Team-based dispatch without formal dependencies

**Precise difference:** No prior system puts UCB scoring and explicit prerequisite edges in the same graph structure that grows dynamically from open-ended specialist discovery.

**Is the difference technically meaningful?** This is the critical question. Merging two mechanisms into one structure is only meaningful if the merged structure produces behavior that *neither* mechanism produces alone. Specifically: does having dependency edges in the UCB graph cause the system to discover attack paths that pure UCB (without dependencies) would miss, AND that pure dependency reasoning (without UCB) would also miss?

*Hypothesis:* Yes — a pure UCB system might explore a high-scoring node that has an unmet prerequisite, wasting resources. A pure dependency system might follow a valid prerequisite chain but miss a high-value node that has no prerequisites. The VDG should avoid both failure modes.

*Counter-argument:* You could achieve the same effect by running UCB *over* a dependency graph (i.e., only score nodes whose prerequisites are met). This doesn't require a "unified" structure — it requires a filter on top of UCB. The unification claim is therefore weaker than it appears.

**Can it be experimentally validated?** Yes, but only with a decomposed ablation:
- (a) Flat UCB, no dependencies (EGATS-style)
- (b) Dependency graph, no UCB (fixed-priority traversal)
- (c) UCB filtered by dependency satisfaction (stacked, not unified)
- (d) Full VDG (unified, with path-scoring)

If (d) > (c), the unification has value. If (d) ≈ (c), the unification is unnecessary and the contribution weakens to "dependency-aware UCB filtering," which is less novel.

**Would a top-tier reviewer consider it substantial?** Only if (d) > (c) is demonstrated with statistical significance. Without this specific ablation, the reviewer will assume (d) ≈ (c) and judge it as stacking, not unification.

**Verdict:** Potentially genuine novelty, but *conditional on a specific ablation that the current document does not specify*. The claim must be downgraded from "unification" to "dependency-aware exploration" until the ablation justifies the stronger term.

### 2.2 Claim: Hybrid Classical-Planning + Learned Search

**Prior work:** CHECKMATE (classical only), EGATS (search only), HPTSA (hierarchical planning without PDDL)

**Precise difference:** Uses PDDL for known skeletons, VDG for non-deterministic updates.

**Is the difference technically meaningful?** No. "Use a deterministic plan when you can, fall back to adaptive search when you can't" is an obvious engineering heuristic, not a research insight. The document doesn't specify what the PDDL domain looks like, what operators are defined, or how the handoff between PDDL and VDG works. Without this, the claim is unimplementable and untestable.

**Can it be experimentally validated?** Only if the PDDL component is actually implemented and its contribution isolated. Given the document doesn't specify it, it can't be validated.

**Would a top-tier reviewer consider it substantial?** No. A reviewer would ask: "What does PDDL add that your VDG can't do?" If the answer is "nothing concrete," the claim is rejected.

**Verdict:** Not genuine novelty. Remove from contribution list or specify fully.

### 2.3 Claim: Three-Tier Memory with Verified Skill Promotion

**Prior work:** CO-REDTEAM (3-tier memory in security), Voyager (description-embedding skill library with verification gate in gaming)

**Precise difference:** Combines both in a security context.

**Is the difference technically meaningful?** The combination is reasonable, but the document doesn't specify what makes security-specific skill representation different from Voyager's game-world skills. Are exploit chains representable as the same kind of parameterized procedures as Voyager's building/crafting skills? If yes, it's a direct application. If no (because exploit chains have different structure — e.g., conditional branching based on WAF responses), that difference needs to be specified.

**Can it be experimentally validated?** Yes, via ablation (with/without memory). But the more interesting question is: does memory help on *diverse* targets (where technology fingerprints don't overlap with training missions) or only on *similar* targets? If it only helps on similar targets, the contribution is narrow.

**Would a top-tier reviewer consider it substantial?** Marginal. Combining two existing techniques is a contribution, but a modest one. The reviewer would want to see that the security domain introduces unique challenges that Voyager's design doesn't address (and that CMatrix solves).

**Verdict:** Marginal novelty. Retain as a supporting contribution, not a core one. Must specify security-specific challenges in skill representation.

### 2.4 Claim: Generalization Across Attack-Surface Families

**Not genuine novelty.** This is evaluation methodology, not a technical contribution. Every system in the literature could theoretically evaluate on multiple benchmarks — most chose not to. Doing so is good practice, not innovation.

**Verdict:** Remove from contribution list. Retain in evaluation section.

### 2.5 Claim: Exploration-First Design as Fix for CVE-Bench's Failure Mode

**Prior work:** CVE-Bench identifies the failure mode (diagnostic only). T-Agent and AutoGPT partially address it (team dispatch, self-criticism).

**Precise difference:** Parallel surface queue, periodic meta-critic, full-depth recon defaults.

**Is the difference technically meaningful?** The mechanisms are so lightweight that they barely qualify as architectural. A "parallel queue" is a secondary data structure. A "meta-critic every 5 actions" is a periodic prompt injection. "Full-depth recon" is a default parameter. None of these would survive a "what's architecturally new?" question.

**Can it be experimentally validated?** Yes, but the expected improvement is small (a few percentage points at most), and it would be confounded with every other architectural difference between CMatrix and the baselines.

**Would a top-tier reviewer consider it substantial?** No.

**Verdict:** Not genuine novelty. Retain the mechanisms as design choices. Do not frame as a contribution.

### 2.6 Claim: Economic and Safety-Aware Reporting

**Not genuine novelty.** Reporting cost-per-exploit and using expert-role framing are reporting choices, not technical contributions.

**Verdict:** Remove from contribution list. Retain in evaluation methodology.

### 2.7 Strongest Possible Research Contributions

After rigorous assessment, the realistically defensible contributions are:

1. **Dependency-aware attack graph exploration** (downgraded from "VDG unification"): A scored attack graph where node selection is conditioned on prerequisite satisfaction, with UCB-style exploration over the feasible frontier. Genuine if ablation (d) > (c) above is demonstrated.

2. **Cross-mission memory with security-specific skill representation**: If CMatrix can show that exploit-chain skills have structure (e.g., conditional branching on WAF/filter responses) that Voyager's game-world skills don't have, and that the 3-tier memory exploits this structure, this is a genuine contribution.

3. **Comprehensive cross-benchmark evaluation with standardized oracles**: Not a contribution per se, but the *execution* of this evaluation (if done rigorously with statistical methodology) would be a significant value-add to the field, as no prior system has been evaluated on CVE-Bench + PrediQL + MHBench with the same system.

---

## 3. Architecture-1 vs. Architecture-2 Comparison

### 3.1 Dual-Graph (ASG/APG) vs. VDG

**Architecture-2 proposes:** Separate ASG (discovered facts only) and APG (inferred attack reasoning only), with strict write separation (discovery agents write to ASG, Commander writes to APG).

**Architecture-1 has:** Single VDG that contains both discovered weaknesses and inferred dependencies/scores.

**Research value of switching to dual-graph:** The separation principle is theoretically clean — it prevents fact/hypothesis contamination. However:

- There is *no evidence in the surveyed literature or current research* that fact/hypothesis contamination is a meaningful failure mode in autonomous VAPT. The surveyed papers identify context pollution (PentestGPT), depth-first tunnel vision (PentestGPT Finding 4), insufficient exploration (CVE-Bench), and dependency reasoning gaps (PentestEval) as failure modes — none of these are "the system confused a discovered fact with an inferred hypothesis."
- Maintaining two separate graphs adds implementation complexity (two serialization formats, two query interfaces, two consistency-checking mechanisms) without a demonstrated benefit.
- The VDG can achieve the same separation *within a single graph* by typing nodes (DISCOVERED vs. INFERRED) and edges (FACT vs. HYPOTHESIS). This gets the benefit without the complexity of two separate graph structures.

**Verdict: Do NOT switch.** The VDG is closer to something that can be formally specified and ablated. The dual-graph adds unvalidated complexity. If fact/hypothesis contamination becomes a problem during prototyping, add node/edge typing to the VDG rather than splitting into two graphs.

### 3.2 Tool Adapter Layer + Risk Gate

**Architecture-2 proposes:** Tool Adapter Layer (normalized output, swappable tools) + 3-tier Risk Gate (Low→execute, Medium→LLM classifier, High→Commander approval).

**Architecture-1 has:** Execution Agent as deterministic wrapper (no normalization specified), no risk gate.

**Research value of adding:**

- *Tool Adapter (output normalization):* This is good engineering and should be adopted as an implementation detail. It makes tool outputs consistent, which improves specialist reliability. However, it is not a research contribution — it's standard software engineering.
- *Risk Gate:* This is a safety mechanism for deployment, not a VAPT effectiveness mechanism. A top security venue (USENIX, S&P, CCS) evaluates the *offensive capability* of the system. Adding a safety gate doesn't improve offensive capability. It adds implementation complexity and LLM call cost (the Medium-tier classifier) without improving any metric the paper claims to improve.

**Verdict: Adopt Tool Adapter pattern as implementation detail. Do NOT adopt Risk Gate.** The Risk Gate is relevant for a deployment-focused paper or a safety-focused venue, not for a top-tier security systems paper focused on offensive effectiveness.

### 3.3 Validation Agent Self-Debugging Loop

**Architecture-2 proposes:** When validation fails: Diagnose (analyze why) → Contextualize (query ASG for additional context) → Adapt (modify approach) → Cap (max 3 retries, then RULED_OUT).

**Architecture-1 has:** Evaluation Agent produces 3-part critique → Validation Agent does mandatory PoC re-run. No explicit retry-with-diagnosis loop.

**Research value:** This is the single most valuable idea in Architecture-2. The surveyed literature shows that multi-step exploit chains fail at specific steps (Getting Pwn by AI: single-step succeeds, multi-step fails). A bounded retry loop with *structured diagnosis* (not just "try again") directly targets this. The key question is: what fraction of failed validations are due to *correctable* errors (wrong parameter, missing auth token, encoding issue) vs. *fundamental* errors (vulnerability doesn't exist, WAF blocks all attempts)?

*Evidence from the survey:* Fang et al. show that GPT-4 with CVE hints achieves 87% pass@5 but only 40% overall success rate. The gap between pass@5 and overall (87% vs. 40%) suggests that many failures are *transient* — the system can succeed on some attempts but not consistently. A diagnosis-and-retry loop could close part of this gap.

*Evidence from Architecture-2's own scenario:* The Validation Agent in the walkthrough successfully validates all 4 chains on first attempt. This is unrealistic and doesn't actually demonstrate the diagnosis loop. But the *mechanism* is sound.

**Verdict: ADOPT.** This is a concrete, testable mechanism with clear research value. It should be integrated into Architecture-1's Layer 4 as an extension of the Validation Agent. The ablation (with/without diagnosis loop) directly measures its contribution. However, the implementation must specify what counts as a "diagnosable" failure — otherwise the system wastes retries on fundamentally impossible exploits.

### 3.4 Vulnerability-Class Knowledge Injection

**Architecture-2 proposes:** Static curated documents (OWASP Testing Guide, SQL injection technique taxonomy, XSS payload patterns, etc.) injected into specialist context at spawn time.

**Architecture-1 has:** Not explicitly mentioned. Specialists receive "task description + relevant tool docs + environment snapshot."

**Research value:** This is a low-cost, high-likelihood-of-benefit intervention. The OWASP Testing Guide contains structured methodology that LLMs don't always follow without prompting. Injecting it as context is essentially providing a checklist. The cost is context window space (manageable for injection at spawn, not accumulated in history). The benefit is more structured specialist behavior.

This can be ablated (with/without knowledge injection) to measure its effect. If it improves specialist success rates, it's a finding. If it doesn't, it's a negative result that's still worth reporting.

**Verdict: ADOPT as implementation detail with ablation.** Not a contribution, but a design choice that should be tested.

### 3.5 Methodology-as-Configuration

**Architecture-2 proposes:** VAPT Protocol Prompt as a swappable, versioned document that defines phase sequencing, re-planning triggers, termination conditions, and tool selection heuristics.

**Research value:** The idea of measuring the effect of methodology choice on VAPT outcomes is interesting in principle. But:

- There is no hypothesis about *what* effect different methodologies would have. Would OWASP Testing Guide methodology produce different results than PTES? Why? What's the mechanism?
- Adding this as a research variable requires evaluating each methodology variant on the full benchmark suite, multiplying the experimental cost.
- The paper already has a full plate of ablations. Adding another dimension without a clear hypothesis is scope creep.

**Verdict: Do NOT adopt.** If there's a specific, testable hypothesis about methodology effects (e.g., "methodology X causes the system to miss vulnerability class Y"), it could be a follow-up paper. For this paper, it's distraction.

### 3.6 Cross-Mission Experience Store + Crystallization

**Architecture-2 proposes:** Raw experience store + Attack Strategy Library (generalized procedures crystallized from ≥2 matching missions).

**Architecture-1 has:** 3-tier memory with skill promotion.

**Research value of crystallization:** The crystallization concept (generalizing from multiple missions into parameterized procedures) is intellectually appealing. However, it requires *multiple missions against the same technology fingerprint* to trigger. In CMatrix's benchmark evaluation:

- CVE-Bench: 40 different CVEs, mostly different applications. Crystallization would rarely trigger.
- PrediQL: 6 different APIs. Too few for crystallization.
- MHBench: 40 environments. Some may share technology fingerprints, but Incalmo doesn't report per-technology breakdowns.

Crystallization is untestable on the chosen benchmarks. It would only be evaluable on a benchmark specifically designed for it (e.g., 20 environments with the same LAMP stack, varying only in application logic).

**Verdict: Do NOT adopt crystallization.** Architecture-1's 3-tier memory with per-mission skill storage is sufficient for the benchmarks. Crystallization should be mentioned as future work.

### 3.7 Engagement Trajectory Export

**Architecture-2 proposes:** Structured per-mission log of all decisions, ASG/APG deltas, and commander reasoning.

**Research value:** This is valuable for *reproducibility*, which top venues increasingly require. It also enables post-hoc failure analysis (examining exactly what the system did on failed cases). However, it is an *output format*, not an *architectural mechanism*. It doesn't change how the system behaves.

**Verdict: ADOPT as implementation detail for reproducibility.** Do not claim as a contribution. The trajectory data could be released as a supplementary dataset, which reviewers would appreciate but wouldn't count as a core contribution.

### 3.8 Context Compaction (3-Layer)

**Architecture-2 proposes:** MicroCompact (per-tool-call), AutoCompact (at 60% context), FullCompact (at 85% context, reconstruct from ASG/APG).

**Architecture-1 has:** Fresh context per specialist (no accumulation) + Handoff Bridge compression.

**Research value:** Architecture-1's design *avoids* the compaction problem entirely by never accumulating context within a specialist invocation. If the specialist needs more than one context window to complete a task, that's a design failure in the sub-FSM, not a compaction problem. The compaction system is a solution to a problem that Architecture-1's design doesn't have.

**Verdict: Do NOT adopt.** Architecture-1's approach is simpler and better-supported by the literature. If prototyping reveals that specialist tasks exceed a single context window, the sub-FSM should be decomposed into smaller steps, not patched with compaction.

### 3.9 Comparison Summary

| Component | Arch-1 | Arch-2 | Recommendation | Research Value |
|---|---|---|---|---|
| State representation | VDG (single graph) | Dual-graph (ASG+APG) | **Keep Arch-1** | None for switching |
| Agent hierarchy | 4-layer | Flat (Commander + specialists) | **Keep Arch-1** | Arch-1 better supported by literature |
| Tool output handling | Implicit | Tool Adapter normalization | **Adopt from Arch-2** | Engineering quality, not contribution |
| Risk classification | None | 3-tier Risk Gate | **Do NOT adopt** | Safety mechanism, not effectiveness |
| Validation retry | Single attempt | Diagnosis→Adapt→Cap loop | **Adopt from Arch-2** | **High** — directly improves exploit success |
| Knowledge injection | Not explicit | Curated docs at spawn | **Adopt from Arch-2** | Moderate — ablatable design choice |
| Methodology config | None | Swappable protocol prompt | **Do NOT adopt** | No hypothesis, scope creep |
| Memory | 3-tier + skill promotion | Experience store + crystallization | **Keep Arch-1** | Crystallization untestable on benchmarks |
| Trajectory logging | None | Structured decision log | **Adopt from Arch-2** | Reproducibility, not contribution |
| Context management | Fresh context + Handoff | 3-layer compaction | **Keep Arch-1** | Arch-1 avoids the problem |
| Termination | Time + cost limits | ASG-exhaustion + time + cost | **Keep Arch-1** | ASG-exhaustion practically unreachable |

---

## 4. Missing State-of-the-Art Techniques

Each technique below is assessed against the criterion: *does it create a meaningful, measurable improvement in autonomous VAPT, supported by evidence or strong reasoning?*

### 4.1 Path-Scoring in the VDG (HIGH PRIORITY — ADD)

**What it is:** Instead of scoring only individual VDG nodes, compute scores for complete attack paths (sequences of nodes from an entry point to an impact). Path score = f(node scores along path, dependency tightness, cumulative impact, estimated cost).

**Why it's needed:** The current VDG scores nodes independently. But a path of three medium-scoring nodes that leads to RCE is more valuable than a single high-scoring node that leads to information disclosure. Node-level scoring can't capture this. Path-scoring makes the VDG genuinely different from a scored priority queue — it becomes an *attack path optimization* system.

**Evidence:** PentestEval's ADM stage explicitly reasons about chains of weaknesses leading to impacts. CHECKMATE's PDDL planner optimizes over action sequences, not individual actions. Attack path analysis is a well-established concept in classical security (attack trees, attack graphs) but hasn't been combined with LLM-driven dynamic graph construction.

**How to implement:** After each VDG update, enumerate feasible paths (sequences where all prerequisites are met), score each path, and use the path score to influence node selection (select the next unvalidated node on the highest-scoring feasible path).

**Expected improvement:** Better exploit prioritization — the system pursues paths that lead to high-impact outcomes rather than individually high-scoring but dead-end nodes.

**Measurability:** Compare node-only scoring vs. path-scoring on CVE-Bench (where some CVEs require multi-step chains) and PentestEval (where ADM explicitly measures chain reasoning).

**Do NOT add if:** The VDG is typically small (<50 nodes) and path enumeration becomes trivial — in that case, path-scoring adds complexity without benefit. But for CVE-Bench's 40-CVE scenarios where multiple vulnerabilities may chain, it matters.

### 4.2 Explicit Failure Recovery with VDG Propagation (HIGH PRIORITY — ADD)

**What it is:** When a VDG node fails (exhausted retry budget), explicitly propagate the failure to all nodes that have the failed node as a prerequisite (mark them as BLOCKED), re-score the VDG, and force the Team Manager to select a new node from the unblocked frontier.

**Why it's needed:** Without this, the system has no mechanism for backtracking. If the Team Manager selects a node whose exploitation fails, and that node was a prerequisite for the current plan, the system has no way to abandon the plan and pursue alternatives. This is exactly the "depth-first tunnel vision" failure mode identified by PentestGPT.

**Evidence:** PentestGPT Finding 4: "LLMs default to depth-first tunnel vision unless forced to enumerate all candidates." CO-REDTEAM's ablation shows execution feedback is critical (removal costs −41.6pp). But neither paper specifies *how* the system recovers from a failed path.

**How to implement:**
```
On node_status = FAILED:
  for each node n where failed_node in n.prerequisites:
    n.status = BLOCKED
    n.blocked_reason = f"Prerequisite {failed_node} failed"
  recompute_feasible_frontier()
  trigger_team_manager_reselection()
```

**Expected improvement:** Faster recovery from failed exploit attempts. Without propagation, the Team Manager might continue attempting nodes on the failed path. With propagation, it immediately sees the path is blocked and selects an alternative.

**Measurability:** Measure time-to-recovery (how many actions between a node failure and the first action on a new path) with and without propagation. Measure whether propagation increases the total number of distinct paths attempted (better exploration).

### 4.3 Per-Node Retry Budget (HIGH PRIORITY — ADD)

**What it is:** Each VDG node has a maximum number of specialist invocations (default: 3). After the budget is exhausted, the node is marked FAILED regardless of outcome.

**Why it's needed:** Without a retry budget, a stubborn specialist could loop indefinitely on a single vulnerability, consuming time and budget that could be spent on other nodes. Architecture-2's Validation Agent has this (cap at 3), but Architecture-1 doesn't specify it for the general case.

**Evidence:** Architecture-2's walkthrough shows the Validation Agent succeeding on first attempt every time, which is unrealistic. In practice, LLM-driven exploitation often requires multiple attempts (Fang et al.'s pass@5 >> pass@1 gap). A budget prevents this from becoming infinite.

**How to implement:** Add `retry_count` and `max_retries` fields to VDG node schema. Increment on each specialist invocation. On exhaustion, trigger failure propagation (§4.2).

**Measurability:** Compare total actions and cost with and without retry budget. A budget should reduce wasted actions on impossible exploits without reducing success rate (if the budget is set correctly).

### 4.4 Per-Mission Failure Log in ESS (MODERATE PRIORITY — ADD)

**What it is:** A simple structured log within the ESS that records (action_type, target, parameters, outcome) for every specialist invocation. Specialists query this log before attempting an action to avoid repeating known-failed approaches.

**Why it's needed:** Even with fresh context per specialist, the *system* as a whole can repeat failed approaches across specialist invocations. If the SQLi specialist tries payload X on endpoint Y and it fails, and later the Team Manager dispatches the SQLi specialist to the same endpoint, the specialist has no memory of the prior failure.

**Evidence:** This is a basic requirement for any intelligent system — don't repeat what you know doesn't work. It's so obvious it's rarely mentioned in papers, but its absence causes real problems in practice.

**How to implement:** Add a `failure_log` array to the ESS. Each specialist invocation checks the log for matching (action_type, target) pairs and includes prior failure summaries in its context.

**Measurability:** Count repeated-failure incidents (same action, same target, same outcome) with and without the failure log. Should be zero with the log, non-zero without.

### 4.5 VDG Consistency Checks (MODERATE PRIORITY — ADD)

**What it is:** Lightweight rule-based checks run after each VDG update:
1. No edges to non-existent nodes
2. No self-loops
3. No cycles (the VDG should be a DAG)
4. If a node is VALIDATED but its prerequisites include non-VALIDATED nodes, flag the dependency edge as potentially incorrect
5. If a node's UCB score is >3σ from the mean, flag for re-scoring

**Why it's needed:** The VDG is constructed by LLM reasoning (Team Manager infers edges, specialists report findings). LLMs hallucinate. Without consistency checks, the VDG can accumulate structural errors that mislead planning.

**Evidence:** No specific paper demonstrates this problem in VAPT, but the general problem of LLM-generated graph errors is well-documented in knowledge graph construction literature. The cost of the checks is negligible (linear in graph size, which is small).

**How to implement:** A simple validation function called after every VDG mutation. Flagged issues are logged but don't block execution (the Team Manager can choose to ignore flags).

**Measurability:** Count VDG consistency violations per mission. If violations are common, the checks are valuable. If rare, they're unnecessary overhead.

### 4.6 Early Stopping Based on Diminishing Returns (MODERATE PRIORITY — ADD)

**What it is:** If no new findings (nodes added to VDG) in the last N specialist invocations (N=5 as starting point), trigger an early termination check. If the feasible frontier is empty or all frontier nodes have been attempted, terminate before the time/cost ceiling.

**Why it's needed:** Directly improves the cost-per-exploit metric. A system that terminates intelligently at minute 6 (after exhausting the feasible frontier) has a lower cost-per-exploit than one that runs to minute 10 (the hard timeout) finding nothing new in the last 4 minutes.

**Evidence:** MAPTA tracks cost as a first-class metric. BountyBench introduces cost-per-exploit. But no system in the survey implements intelligent early stopping — they all use fixed timeouts.

**How to implement:** Track `findings_since_last_check` counter. On each specialist return, increment if new nodes added, reset to 0 if not. When counter reaches N, check if feasible frontier is non-empty. If empty, terminate.

**Measurability:** Compare cost-per-exploit with and without early stopping. Should be lower with early stopping, with no reduction in pass rate (by definition — the system stopped because there was nothing left to find).

### 4.7 Cost-Aware VDG Scoring (MODERATE PRIORITY — ADD)

**What it is:** Include estimated exploitation cost as a factor in VDG node scoring. Estimate cost based on specialist type and historical cost-per-invocation. A high-UCB node that's expensive to exploit might not be worth pursuing if budget is limited.

**Why it's needed:** The cost-per-exploit metric is a co-primary metric, but the system doesn't factor cost into its decisions. This means the system might spend 80% of its budget on one high-UCB node that fails, leaving nothing for other nodes. Cost-aware scoring would spread the budget more evenly.

**Evidence:** EGATS's Task Difficulty Index includes a "context-load" factor that partially captures cost (more context = more tokens = more cost). But it's not an explicit cost estimate.

**How to implement:** Maintain a running average of token cost per specialist invocation. Multiply by estimated invocations (based on retry budget) to get estimated node cost. Include as a penalty in the UCB score: `adjusted_score = UCB_score - λ * estimated_cost`.

**Measurability:** Compare cost-per-exploit with and without cost-aware scoring. Should be lower with cost-aware scoring. Risk: might reduce pass rate if cost penalty is too high (ablate λ).

### 4.8 Techniques Explicitly NOT Added (with reasoning)

| Technique | Why NOT added |
|---|---|
| Graph Neural Networks for VDG reasoning | VDG is small (dozens of nodes). GNNs add training infrastructure and overfitting risk with no evidence of benefit at this scale. |
| Multi-agent debate/consensus | Survey evidence shows structured hierarchy outperforms flat debate (HPTSA > single agent, but no evidence debate > hierarchy). Adds latency and cost. |
| Reinforcement learning for action selection | UCB is already a bandit algorithm. RL would require a training environment and reward signal design that's not justified when UCB is a strong, well-understood baseline. |
| Separate Research Agent | CVE lookup is a simple API call. It doesn't need a dedicated agent — a specialist or the Team Manager can do it. Adding an agent adds a dispatch layer without clear benefit. |
| Hierarchical task decomposition (HTN) | The 4-layer hierarchy already provides hierarchical decomposition. HTN would add formal task decomposition that's overkill for 5-8 verb types. |
| Monte Carlo Tree Search over VDG | MCTS is powerful but computationally expensive. The VDG is small enough that full frontier enumeration is feasible, making MCTS unnecessary. |
| Adversarial robustness testing | Out of scope. CMatrix is evaluated on fixed benchmarks, not against adversarial targets. |

---

## 5. Feasibility Assessment

### 5.1 VDG Construction

**Implementability:** HIGH. Graph data structures are standard (NetworkX in Python). Node and edge schemas are straightforward.

**Concrete implementation plan:**
1. Define VDG as a directed graph with typed nodes and edges
2. Specialists return findings as structured JSON → Handoff Bridge adds nodes
3. Team Manager LLM call with prompt: "Given these VDG nodes, identify prerequisite relationships. Output JSON array of {from, to, type} edges."
4. UCB score computed per-node using standard UCB1 formula with exploration parameter c=1.0 (tuned on Tier 0)
5. Path scoring: enumerate all feasible paths (BFS from frontier nodes to impact nodes), score each path as product of node scores × impact weight

**Required inputs:** Specialist finding JSONs, Team Manager LLM access.

**Required outputs:** Updated VDG with new nodes, edges, scores.

**Likely failure modes:**
1. *Team Manager hallucinates incorrect dependency edges.* Mitigation: consistency checks (§4.5) flag suspicious edges. If a node is validated without its prerequisites, the edge is likely wrong.
2. *UCB scores become miscalibrated.* Mitigation: tune exploration parameter on Tier 0 regression benchmark. Use adaptive c (decrease over time as more evidence accumulates).
3. *Path enumeration explodes.* Mitigation: limit path length (max 5 nodes), prune dominated paths (lower score than a sub-path).

**Assumptions required:**
1. The Team Manager LLM can accurately infer at least 60% of prerequisite relationships correctly. (This is the highest-risk assumption and must be prototyped.)
2. The VDG remains acyclic. (Enforced by consistency checks.)
3. Specialist findings are structured enough to populate the VDG. (Enforced by the Handoff Bridge.)

**What must be prototyped before claiming feasibility:**
- **VDG edge inference accuracy test:** Take 10 known vulnerability scenarios from PentestEval (where ground-truth dependency graphs exist). Run the Team Manager's edge-inference prompt. Measure precision/recall of inferred edges vs. ground truth. If precision < 50%, the VDG's dependency reasoning is unreliable and the core contribution is at risk.

### 5.2 Specialist Sub-FSMs

**Implementability:** HIGH for SQLi and XSS (well-defined state machines). MODERATE for generic exploitation (harder to formalize).

**Concrete implementation for SQLi:**
```
State 0 (BASELINE): Send benign probe → if anomalous response, go to State 1
State 1 (SLEEP_PROBE): Send `' OR SLEEP(5)--` → if response delayed by ≥4s, go to State 2
State 2 (BIT_EXTRACTION): For each bit position 0..N:
  Send `' OR SUBSTRING(@@version,{pos},1)='{bit}' AND SLEEP(5)--` → record bit
State 3 (COMPLETE): Return extracted value as finding
```
Temperature = 0 for States 1-2 (deterministic payloads). Temperature = 0.3 for State 0 (probe selection).

**Concrete implementation for XSS:**
```
State 0 (CANARY): Inject `{{CANARY}}` → if reflected, go to State 1
State 1 (CONTEXT): Analyze reflection context (HTML tag, attribute, script) → select payload template
State 2 (FILTER_PROBE): Test basic payload `<script>alert(1)</script>` → if blocked, go to State 3
State 3 (MUTATION): Apply filter bypass techniques (encoding, event handlers, template literals)
State 4 (VERIFY): Use Playwright to check if `alert()` fires → if yes, go to State 5
State 5 (WEBHOOK): Replace `alert(1)` with `fetch(WEBHOOK_URL)` → confirm exfiltration
```

**Likely failure modes:**
1. *WAF blocks all payloads in the FSM.* The FSM has no escape hatch. Mitigation: if all FSM states fail, report to Team Manager as "FSM exhausted, may need manual analysis" rather than looping.
2. *LLM generates payloads that don't match the expected state transition.* Mitigation: strict output parsing — if the LLM's response doesn't contain the expected state transition signal, stay in the current state and retry with a more constrained prompt.

**What must be prototyped:** Run SQLi FSM on 5 diverse SQLi vulnerabilities (blind, error-based, UNION-based, with and without WAF). Run XSS FSM on 5 diverse XSS vulnerabilities (reflected, stored, DOM-based, with CSP). Measure FSM completion rate and false-positive rate.

### 5.3 Declarative Task API

**Implementability:** VERY HIGH. It's a set of function signatures.

**Concrete implementation:**
```python
# Web surface verbs
def recon_target(target: str, depth: str = "full") -> Finding
def exploit_sqli(target: str, param: str, technique: str = "auto") -> Finding
def exploit_xss(target: str, param: str, context: str = "auto") -> Finding
def verify_finding(finding_id: str) -> ValidationResult
def test_auth_bypass(target: str, method: str = "auto") -> Finding

# GraphQL surface verbs (added for GraphQL missions)
def test_graphql(target: str, strategy: str = "auto") -> Finding

# Multi-host surface verbs (Incalmo-style)
def scan_host(host: str) -> Finding
def lateral_move(source_host: str, target_host: str, method: str = "auto") -> Finding
def escalate_privilege(host: str, method: str = "auto") -> Finding
```

**Failure modes:** None significant. The API is a contract between Team Manager and Specialists. As long as both sides agree on the signatures, it works.

### 5.4 Session Persistence Service

**Implementability:** HIGH. It's a key-value store (session_id → {cookies, csrf_token, jwt, headers}).

**Concrete implementation:**
```python
class SessionService:
    def __init__(self):
        self.sessions = {}  # session_id -> SessionState
    
    def create_session(self, target: str) -> str:
        session_id = generate_id()
        self.sessions[session_id] = SessionState(target=target)
        return session_id
    
    def exec(self, endpoint, method, payload, session_id):
        session = self.sessions[session_id]
        headers = session.headers.copy()
        if session.csrf_token:
            headers["X-CSRF-Token"] = session.csrf_token
        response = requests.request(method, endpoint, headers=headers, 
                                     cookies=session.cookies, data=payload)
        # Update session state from response
        session.cookies.update(response.cookies)
        session.csrf_token = extract_csrf(response.text)
        return response
```

**Likely failure modes:**
1. *Session expires between specialist invocations.* Mitigation: detect 401/403 responses and trigger re-authentication via the Auth/Session Specialist.
2. *CSRF token rotates.* Mitigation: extract new token from each response and update session state.

**What must be prototyped:** Verify that benchmark environments maintain sessions long enough for multi-step attacks. Run a test: authenticate to a PentestEval target, wait 5 minutes, attempt an authenticated action. If the session is still valid, the service works. If not, add re-authentication logic.

### 5.5 3-Tier Memory

**Implementability:** HIGH. FAISS + cross-encoder is standard. The question is embedding quality for security domain.

**Concrete implementation plan:**
1. **Vulnerability-Pattern Memory:** Embed (vuln_class, technology, version_range, description) → retrieve by (current_vuln_class, current_technology)
2. **Strategy Memory:** Embed (natural language description of exploit workflow) → retrieve by (description of current target characteristics)
3. **Technical-Action Memory:** Embed (tool_name, parameters, context, outcome) → retrieve by (current tool_name, current context)

Embedding model: `text-embedding-3-small` (OpenAI) or `BGE-large-en-v1.5` (open-source). Cross-encoder: `cross-encoder/ms-marco-MiniLM-L-6-v2` (standard for reranking).

Retrieval trigger: At Team Manager's VDG scoring step, query all three stores with the current highest-priority node's description. Inject top-3 results from each store into the Team Manager's context as "relevant prior experience."

Skill promotion: After Validation Agent confirms a finding, the Evaluation Agent generates a natural language description of the successful exploit chain. This description is embedded and stored in the appropriate memory tier. No separate "verification" step beyond the Validation Agent's confirmation (simpler than Voyager's approach, but sufficient — the Validation Agent's oracle-backed check is a stronger verification than Voyager's self-check).

**Likely failure modes:**
1. *Irrelevant memories retrieved.* Mitigation: cross-encoder reranking significantly improves precision over raw FAISS retrieval.
2. *Memory becomes stale.* Mitigation: timestamp memories, down-weight memories older than 6 months.
3. *Security domain embeddings are poor.* Mitigation: use domain-adapted embeddings if available; otherwise, use general-purpose embeddings with careful prompt engineering of the descriptions to be embedded.

**What must be prototyped:** Populate memory with 10 missions' worth of data (manually constructed if needed). For each mission in a held-out set of 5, measure whether retrieved memories are relevant (manual relevance judgment) and whether they change the Team Manager's node selection (A/B test with/without memory).

### 5.6 Validation Agent with Diagnosis Loop

**Implementability:** HIGH. It's a loop with structured LLM calls.

**Concrete implementation:**
```python
def validate_with_diagnosis(chain_step, max_retries=3):
    for attempt in range(max_retries):
        result = execute_validation(chain_step)
        if result.success:
            return ValidationResult(status="VALIDATED", evidence=result.evidence)
        
        # Diagnosis step
        diagnosis = llm_call(
            prompt=f"""The following validation attempt failed:
            Tool: {chain_step.tool}
            Target: {chain_step.target}
            Parameters: {chain_step.parameters}
            Error/Response: {result.output}
            
            Diagnose why it failed. Classify as one of:
            - CORRECTABLE: Wrong parameter, encoding issue, missing auth, version mismatch
            - FUNDAMENTAL: Vulnerability doesn't exist, WAF blocks all attempts, target patched
            
            If CORRECTABLE, suggest specific parameter changes.
            If FUNDAMENTAL, explain why."""
        )
        
        if diagnosis.classification == "FUNDAMENTAL":
            return ValidationResult(status="RULED_OUT", reason=diagnosis.explanation)
        
        # Adapt step
        chain_step.parameters = apply_suggested_changes(chain_step.parameters, diagnosis.suggestions)
    
    return ValidationResult(status="RULED_OUT", reason="Max retries exhausted")
```

**Likely failure modes:**
1. *Diagnosis is wrong* (classifies FUNDAMENTAL as CORRECTABLE or vice versa). Mitigation: if the adapted attempt fails with the *same* error, escalate to FUNDAMENTAL.
2. *Adapted parameters are invalid.* Mitigation: validate parameter types/ranges before executing.

**What must be prototyped:** Run on 10 failed validation cases from CVE-Bench (where GPT-4 ReAct failed). Measure how many are correctly classified as CORRECTABLE vs. FUNDAMENTAL, and how many CORRECTABLE cases are successfully resolved by the adaptation step.

### 5.7 Why We Should Believe the System Can Work

1. **Individual components are independently validated.** Sub-FSM specialists (AutoPT), declarative API (Incalmo), fresh context (PentestGPT/D-CIPHER/VulnBot), structured output (MAPTA), session persistence (implicit in every real pentest tool) — each has empirical support. The question is whether they compose, not whether they work individually.

2. **The composition is conservative.** CMatrix doesn't rely on any capability that hasn't been demonstrated. It doesn't assume zero-shot exploitation works (it uses CVE hints in one-day mode). It doesn't assume the LLM can do long-range planning unaided (it uses the VDG to structure planning). It doesn't assume specialists can handle arbitrary tasks (it constrains them to sub-FSMs).

3. **The weakest link is VDG edge inference, and it's degradable.** If the Team Manager infers dependency edges poorly, the VDG degrades to a UCB-scored list with some noise. But even a noisy VDG should perform at least as well as a pure UCB list (incorrect edges can be detected by consistency checks and ignored). The VDG's dependency reasoning is an *enhancement*, not a *requirement* — the system works without it, just not as well.

4. **The benchmarks are well-characterized.** CVE-Bench has known baselines (13% zero-day, 10% one-day best). PentestEval has per-stage scores. PrediQL has published numbers. CMatrix doesn't need to "work in general" — it needs to beat these specific numbers on these specific targets.

5. **The one-day mode is the easy case.** With CVE hints, GPT-4 ReAct achieves 87% pass@5. CMatrix should at least match this (if it can't, something is fundamentally wrong). The real test is zero-day mode, where HPTSA achieves ~42% pass@5 and CMatrix's exploration mechanisms need to improve on this.

6. **Failure modes are enumerable and mitigable.** The main risks are: (a) VDG edge inference is inaccurate → mitigated by consistency checks and graceful degradation, (b) specialists get stuck → mitigated by retry budgets and failure propagation, (c) context overflow → mitigated by fresh context design. None of these are existential risks.

7. **The system can be incrementally validated.** Start with Tier 0 (15-vuln regression). If CMatrix can't match GPT-4's 73.3% on this simple benchmark, stop and debug before proceeding to harder tiers. This de-risks the implementation.

**What would need to go wrong for the system to fail completely:**
- The LLM can't follow the declarative task API at all (contradicted by Incalmo's results)
- The sub-FSMs can't handle any real-world vulnerability (contradicted by AutoPT's results)
- The VDG edge inference is so bad that it actively misleads the planner worse than no dependencies (possible but unlikely — the consistency checks should catch the worst cases)
- The benchmarks have changed or are no longer reproducible (operational risk, not architectural)

**Overall feasibility assessment:** HIGH. The system should produce practical VAPT results. The question is not "will it work?" but "will it work *better* than the baselines by enough to justify the contribution claims?"

---

## 6. Accuracy / Effectiveness Analysis

### 6.1 Mechanism → Expected Improvement → Competing Approach → Test

| Mechanism | Expected improvement | Competing approach it improves upon | How to test | Metric |
|---|---|---|---|---|
| VDG dependency edges | Fewer attempts on exploits with unmet prerequisites | EGATS (UCB without dependencies), HPTSA (flat dispatch) | Ablation: VDG with UCB only vs. VDG with UCB + dependencies | PentestEval ADM score; CVE-Bench pass@1 (zero-day) |
| VDG path-scoring | Better prioritization of multi-step chains leading to high-impact outcomes | Node-only scoring (all prior systems) | Ablation: node-scoring only vs. path-scoring | CVE-Bench pass@1 on multi-step CVEs |
| Declarative task API | Fewer hallucinated/invalid commands | Free-form LLM command generation (PentestGPT baseline, Fang et al.) | Ablation: declarative API vs. raw command generation | Tool-call success rate; CVE-Bench pass@1 |
| Fresh context per specialist | Less context pollution, more reliable specialist behavior | Rolling conversation history (single-agent systems) | Ablation: fresh context vs. rolling context (on a subset) | Specialist task success rate |
| Sub-FSM specialists | Higher multi-step exploit success | Free-form agent loops (Getting Pwn by AI) | Ablation: sub-FSM vs. free-form for SQLi/XSS | SQLi/XSS specialist success rate on targeted subset |
| Session persistence | Success on multi-turn vulnerability classes (auth bypass, CSRF chains) | Stateless tool calls (Fang et al.'s 4 failure classes) | Ablation: with/without session persistence | Pass rate on auth-bypass and CSRF-chain vulnerabilities specifically |
| 3-tier memory | Improved performance on targets similar to prior engagements | No memory (all prior systems except CO-REDTEAM) | Ablation: with/without memory; split benchmarks into "seen technology" vs. "unseen technology" subsets | Pass@1 on seen vs. unseen technology subsets |
| Diagnosis loop (from Arch-2) | Higher validation success rate (converting failures into successes) | Single-attempt validation (MAPTA-style) | Ablation: with/without diagnosis loop | Validation success rate; CVE-Bench pass@1 (gap between pass@5 and pass@1 should narrow) |
| Failure recovery + propagation | Faster recovery from failed paths, more distinct paths attempted | No recovery mechanism (all prior systems) | Ablation: with/without failure propagation | Time-to-recovery; number of distinct paths attempted |
| Early stopping | Lower cost-per-exploit without reducing pass rate | Fixed timeout (all prior systems) | Compare cost-per-exploit with/without early stopping | Cost-per-exploit; pass@1 (should be unchanged) |

### 6.2 Defining "Better" for CMatrix

"Better" is defined precisely as:

1. **CVE-Bench zero-day pass@1 ≥ 25%** (vs. HPTSA's ~21%, T-Agent's ~10-13%). This is the primary metric. It directly measures whether CMatrix's exploration and dependency reasoning improve on the state of the art for the hardest benchmark.

2. **CVE-Bench one-day pass@1 ≥ 50%** (vs. GPT-4 ReAct's ~40%). This measures whether CMatrix maintains performance on the easier mode while adding architectural structure.

3. **PentestEval ADM score ≥ 0.50** (vs. SMP baseline's ~0.31, with SMP-GT-ADM at 0.67 as upper bound). This directly validates the dependency reasoning contribution.

4. **Cost-per-successful-exploit ≤ baselines' cost-per-exploit** (computed as `cost_per_run / pass@1_rate`). This validates the economic efficiency claim.

5. **No regression on simpler benchmarks** (Tier 0: ≥73.3% pass@5, Tier 3: match PrediQL's numbers, Tier 4: ≥37/40). This ensures architectural additions don't break what works.

"Better" does NOT mean:
- Higher pass@5 (this measures persistence, not intelligence)
- More total findings (could be more false positives — the mandatory validation prevents this)
- Faster wall-clock time (could mean less thorough exploration)
- Higher detection rate without exploitation (detection ≠ exploitation per Fang et al.)

### 6.3 Necessary Ablation Studies

**Core ablations (must have):**
1. VDG (UCB + dependencies) vs. VDG (UCB only, no dependency edges) vs. Flat UCB list (no graph structure)
2. With/without 3-tier memory
3. With/without diagnosis loop in Validation Agent
4. With/without failure recovery propagation

**Secondary ablations (should have):**
5. With/without path-scoring (if implemented)
6. With/without session persistence
7. With/without knowledge injection
8. With/without early stopping

**Not necessary (would be nice but not required):**
9. Sub-FSM vs. free-form specialists (already well-established by AutoPT)
10. Fresh vs. rolling context (already well-established by PentestGPT/D-CIPHER)
11. Declarative API vs. raw commands (already well-established by Incalmo)

### 6.4 Causality Requirements

To prove that a mechanism *causes* improvement (not just correlates):

1. **Isolate the variable:** Each ablation changes exactly one thing. The VDG ablation is the hardest because it changes multiple things (graph structure + edge inference + scoring). The decomposed ablation (UCB only vs. dependencies only vs. both) addresses this.

2. **Control for compute:** All conditions must use the same total LLM call budget. If the VDG condition uses more calls (due to edge inference), either (a) reduce the retry budget to compensate, or (b) report both raw and compute-normalized results.

3. **Control for model:** All conditions must use the same model at the same tier. The model-tiering policy means different components use different models, but this must be held constant across ablation conditions.

4. **Sufficient sample size:** Minimum 5 runs per condition on CVE-Bench (40 CVEs × 5 = 200 total runs per condition). For smaller benchmarks (PrediQL: 6 APIs), all 6 should be run in each condition.

5. **Report effect sizes with confidence intervals:** McNemar's test for paired binary outcomes (same CVE, different conditions). Report p-values but emphasize effect sizes (percentage point differences).

---

## 7. Top-Tier Conference Verdict

### Major Strengths
1. Empirically grounded problem statement with specific failure-mode percentages
2. Disciplined benchmark scoping with explicit exclusions
3. Honest framing of novelty (combinations, not breakthroughs)
4. Comprehensive benchmarking strategy across 7 tiers
5. Strong validation mechanism (mandatory PoC + per-surface oracles)
6. Preemptive limitations section

### Major Weaknesses
1. **VDG is a schema, not an algorithm** — this is the paper-killer if not fixed
2. Hybrid classical planning is hollow and should be removed
3. Exploration fix is underwhelming relative to its framing
4. No failure recovery mechanism
5. No path-scoring (nodes scored, paths not)
6. No early stopping heuristic
7. No statistical methodology
8. Contribution list includes non-contributions (cross-surface, economic metrics, scoping)
9. Session persistence not architecturally integrated

### Missing Methodology
1. VDG formal algorithm (construction, update, scoring, propagation)
2. Number of runs, confidence intervals, significance tests
3. Compute normalization for fair comparison
4. Failure analysis protocol for failed cases
5. Per-node retry budget specification

### Unsupported Claims
1. "Unifies" exploration and dependency planning — unification not demonstrated to be better than stacking
2. "Hybrid Classical-Planning+" — no specification
3. "Cross-mission skill library" — no specification of representation or verification
4. "Generalization across three families" — not generalization

### Novelty Risks (ranked by severity)
1. **HIGH:** VDG ablation shows no difference between UCB+dependencies and UCB-only → core contribution collapses
2. **MEDIUM:** 3-tier memory shows no improvement on diverse benchmarks → supporting contribution weakened
3. **LOW:** Cross-surface evaluation is good practice regardless → not a risk to the paper

### Implementation Risks (ranked by severity)
1. **HIGH:** VDG edge inference accuracy <50% → dependency reasoning is noise
2. **MEDIUM:** Specialist sub-FSMs don't cover edge cases (WAF-filtered SQLi, CSP-protected XSS)
3. **MEDIUM:** Session persistence fails in benchmark environments (short session lifetimes)
4. **LOW:** Tool output parsing failures (well-understood engineering problem)

### Evaluation Weaknesses
1. No statistical significance testing
2. No compute-normalized comparison
3. Ablation list doesn't decompose VDG components
4. No failure analysis protocol
5. No specification of how baselines will be re-run (same code? Same compute budget? Same model?)

### Likely Reviewer Objections (predicted verbatim)

1. *"The VDG is a graph data structure with some scoring. Where is the algorithm? I can't reproduce this from your description."*
2. *"You claim to 'unify' UCB and dependency reasoning, but your ablation doesn't test unification vs. stacking. For all I know, running EGATS on top of PentestEval's ADG would achieve the same result."*
3. *"Remove the hybrid classical planning. You don't specify it and it adds nothing."*
4. *"Evaluating on three benchmarks is good practice. It's not a contribution. Remove it from your contribution list."*
5. *"Where are your confidence intervals? Five runs on CVE-Bench is a minimum. You don't even specify that."*
6. *"Your 'exploration fix' is a todo list, a periodic check, and a default scan setting. That's not an architectural innovation. Downgrade the framing."*
7. *"The 3-tier memory is CO-REDTEAM + Voyager. What's security-specific about your implementation? You don't say."*
8. *"Cost-per-exploit is model-price-sensitive. Normalize by model cost or report at multiple price points."*
9. *"How do you handle the case where the Team Manager hallucinates a dependency edge that doesn't exist? You don't address this."*
10. *"What happens when the system gets stuck? You describe the happy path but not failure recovery."*

### Possible Reasons for Rejection
1. **Insufficient novelty** (most likely): "Well-engineered integration of existing techniques with no genuine algorithmic contribution."
2. **Underspecified core mechanism**: "The VDG is the claimed contribution but isn't specified enough to evaluate or reproduce."
3. **Weak experimental results**: "Doesn't significantly outperform HPTSA on CVE-Bench zero-day."
4. **Unfair comparison**: "Uses more compute than baselines without normalization."

### Verdict: **B. Strong foundation but substantial research work is required**

The architecture has the right bones: evidence-driven motivation, disciplined scoping, component choices validated by prior work. But the core contribution (VDG) is at schema level when it needs to be at algorithm level, several claimed contributions are not contributions, and the evaluation methodology lacks statistical rigor.

The gap between current state and top-tier readiness is:
- **2-3 weeks** of focused work to formally specify the VDG algorithm
- **1 week** to trim the contribution list and reframe claims
- **1 week** to add failure recovery, early stopping, and path-scoring
- **2-3 weeks** to prototype the VDG edge inference and validate its accuracy
- **Ongoing:** full implementation and evaluation (months)

This is achievable. The foundation is solid. But the current document is not submission-ready.

---

## 8. Final Research-Grade Blueprint

### 8.1 What Must Remain (Unchanged)

1. **Four-layer hierarchy** (Orchestrator → Team Manager → Specialists → Execution/Validation)
2. **Declarative task API** (5-8 high-level verbs, Incalmo-style)
3. **Fresh context per specialist** (no rolling conversation history)
4. **Sub-FSM specialists for SQLi and XSS** (with the specific state machines described)
5. **Mandatory PoC validation with per-surface oracles** (CVE-Bench 8-type, MHBench per-environment, PrediQL schema)
6. **Session Persistence Service** (but properly integrated — see §8.2)
7. **Tiered benchmarking strategy** (Tiers 0-6, all from existing benchmarks)
8. **Model-tiering policy** (frontier for planning, mid-tier for specialists, cheapest for parsing, none for execution)
9. **Disciplined benchmark scoping** (no custom benchmarks, explicit REST exclusion)
10. **ESS as structured state store outside LLM context**
11. **Usage Tracker as first-class component**
12. **Problem statement** (with one adjustment: soften the "exploration fix" framing — see §8.2)

### 8.2 What Should Be Modified

**1. VDG must be formally specified as an algorithm, not just a schema.**

Add the following to Architecture-1:

```
VDG Construction Algorithm:
  Input: specialist finding JSON from Handoff Bridge
  Output: updated VDG
  
  1. NODE ADDITION:
     For each finding f in specialist output:
       Create node n = {id, vuln_class=f.type, status=UNATTEMPTED,
                       prerequisites=[], enables=[], 
                       ucb_score=initial_promise(f),
                       evidence=[f.evidence],
                       retry_count=0, max_retries=3,
                       attack_intent=f.impact_description}
       Add n to VDG.nodes
  
  2. EDGE INFERENCE (Team Manager LLM call):
     Prompt: "Given these VDG nodes: [serialize recent nodes].
             For each pair (A, B), determine if A is a prerequisite 
             for exploiting B. A prerequisite means B cannot be 
             successfully exploited unless A is first validated.
             Output JSON array of {from: A_id, to: B_id, 
             type: 'prerequisite', confidence: 0.0-1.0}.
             Also identify if validating A enables new attack 
             surfaces for B: {from: A_id, to: B_id, 
             type: 'enables', confidence: 0.0-1.0}."
     
     For each inferred edge e:
       if e.confidence >= 0.7:
         Add e to VDG.edges
       else:
         Log as low-confidence edge (not added, but recorded)
  
  3. UCB SCORE UPDATE:
     For each node n:
       n.ucb_score = n.mean_reward + c * sqrt(ln(total_attempts) / n.attempt_count)
     where:
       n.mean_reward = (sum of validation outcomes) / n.attempt_count
         (1.0 for VALIDATED, 0.0 for FAILED, 0.5 for INCONCLUSIVE)
       c = 1.0 (exploration parameter, tunable)
       total_attempts = sum of all nodes' attempt_counts
  
  4. PATH SCORING:
     feasible_paths = enumerate_paths(
       start_nodes=[n for n in VDG.nodes if all prereqs met],
       end_nodes=[n for n in VDG.nodes where n.impact == "high"],
       max_length=5
     )
     For each path p:
       p.score = product(n.ucb_score for n in p.nodes) * 
                 impact_weight(p.end_node.impact) / 
                 (1 + sum(n.estimated_cost for n in p.nodes))
     Store p.score on path object
  
  5. FRONTIER COMPUTATION:
     VDG.frontier = [n for n in VDG.nodes 
                     where n.status == UNATTEMPTED
                     and all prerequisite nodes have status == VALIDATED
                     and n not BLOCKED]
  
  6. NODE SELECTION:
     If VDG.frontier is empty:
       Select node with highest ucb_score among UNATTEMPTED nodes
       (relaxed mode: attempt even without validated prerequisites)
     Else:
       Select node on highest-scored feasible path that is in frontier
       (path-guided selection)
```

```
VDG Failure Propagation Algorithm:
  Input: node_id that has reached max_retries or diagnosed as FUNDAMENTAL
  Output: updated VDG
  
  1. Mark node as FAILED
  2. For each node n where failed_node in n.prerequisites:
       Mark n as BLOCKED
       Log: "Node {n.id} blocked: prerequisite {failed_node} failed"
  3. Recompute feasible_paths (blocked nodes excluded)
  4. Recompute frontier
  5. If frontier is empty:
       Log: "All paths blocked. Triggering early termination check."
```

**2. Exploration fix framing must be softened.**

Change §5.5 from "Direct Architectural Response to CVE-Bench's Dominant Failure Mode" to a design-choices subsection that describes the three mechanisms (frontier-guided selection from VDG, periodic re-evaluation trigger, full-depth recon defaults) without framing them as a "fix." The VDG's frontier-guided selection is the meaningful exploration mechanism; the other two are supporting design choices.

**3. Contribution list must be trimmed to three.**

Remove from §10:
- #4 (Generalization across surfaces → move to evaluation methodology)
- #5 (Exploration fix → reframe as design choice within VDG description)
- #6 (Economic metrics → move to evaluation methodology)
- #7 (Benchmark scoping → move to methodology)

Retain as core contributions (rewritten):
1. **Dependency-aware attack graph exploration:** A Vulnerability Dependency Graph that conditions UCB exploration on prerequisite satisfaction, with path-level scoring for multi-step attack chain optimization. [Cite: improves upon EGATS's prerequisite-agnostic UCB and PentestEval's curated-set dependency reasoning.]
2. **Cross-mission memory with verified skill promotion:** Three-tier memory (vulnerability-pattern, strategy, technical-action) with description-embedding retrieval and validation-gated skill storage, adapted from CO-REDTEAM and Voyager for the security domain where exploit chains have conditional structure absent in game-world skills. [Cite: CO-REDTEAM for 3-tier design, Voyager for skill promotion.]
3. **Comprehensive cross-benchmark evaluation:** The first evaluation of a single autonomous VAPT architecture on CVE-Bench (web), PrediQL (GraphQL), and MHBench (multi-host) with standardized oracles and per-surface breakdowns. [Not a technical contribution — a methodology contribution.]

**4. Session Persistence Service must be architecturally integrated.**

Add to the architecture diagram as a service connected to the ESS (it's a subset of ESS state). Specify the API:

```python
# Part of ESS
class SessionPersistenceService:
    sessions: Dict[str, SessionState]  # session_id → state
    
    def create(target: str) -> str  # returns session_id
    def execute(endpoint, method, payload, session_id) -> Response
    def get_state(session_id) -> SessionState
    def is_expired(session_id) -> bool
    def refresh(session_id) -> bool  # re-authenticate if needed
```

All specialist tool calls that require authentication go through this service, not directly to `requests`. This must be shown in the architecture diagram.

**5. Statistical methodology must be added to §7.**

Add:
- "Each benchmark is run 5 times with different random seeds (10 times for CVE-Bench, given its size and importance)."
- "All metrics reported as mean ± 95% confidence interval (Wilson score interval for binary outcomes)."
- "Comparisons use McNemar's test for paired binary outcomes (same CVE, different conditions)."
- "Compute normalization: all conditions capped at 50 LLM API calls per CVE for CVE-Bench, matching the median call count of the HPTSA baseline as reported in their paper."
- "Failure analysis: for every failed CVE, a human annotator classifies the failure mode as one of: {exploration_failure (never found the vulnerability), reasoning_failure (found but couldn't exploit), tool_failure (tool error or timeout), validation_failure (exploited but oracle rejected)}."

**6. Hybrid classical planning must be removed or reduced to an implementation detail.**

If PDDL is actually used for skeleton initialization (e.g., a fixed recon→enumerate→exploit phase sequence), mention it in passing as "the VDG is initialized with a fixed phase-ordering skeleton" — do not frame it as a contribution or even a named mechanism. It's a phase-state machine, not classical planning.

### 8.3 What Should Be Added

**1. VDG path-scoring algorithm** (specified above in §8.2.1, step 4)

**2. VDG failure propagation algorithm** (specified above in §8.2.1)

**3. Per-node retry budget** (max_retries=3 field in VDG node schema, with propagation on exhaustion)

**4. Per-mission failure log in ESS**

```python
# Part of ESS
failure_log: List[FailureEntry]
# FailureEntry = {action_type, target, parameters, error, timestamp}
# Queried by specialists before attempting actions
```

**5. VDG consistency checks** (run after each VDG mutation):
- No edges to non-existent nodes
- No self-loops
- No cycles (DAG check)
- Flag nodes validated without validated prerequisites

**6. Early stopping heuristic**

```
early_stop_counter = 0
EARLY_STOP_THRESHOLD = 5

On specialist return:
  if new_nodes_added > 0:
    early_stop_counter = 0
  else:
    early_stop_counter += 1
  
  if early_stop_counter >= EARLY_STOP_THRESHOLD:
    if VDG.frontier is empty or all frontier nodes status == ATTEMPTED:
      log("Early termination: no new findings in {threshold} actions, frontier exhausted")
      trigger_termination()
```

**7. Diagnosis loop in Validation Agent** (from Architecture-2, specified in §5.6)

**8. Vulnerability-class knowledge injection** (from Architecture-2)

Static documents injected at specialist spawn:
- SQLi specialist: SQL injection technique taxonomy, SQLMap flag reference
- XSS specialist: XSS payload patterns, CSP bypass techniques
- Auth specialist: OWASP authentication testing guide
- GraphQL specialist: GraphQL security testing checklist

These are not claimed as contributions. They are ablated (with/without injection) to measure their effect.

**9. Engagement trajectory logging** (from Architecture-2, as implementation detail)

```python
trajectory_log: List[TrajectoryEntry]
# TrajectoryEntry = {step, timestamp, trigger, vdg_delta, 
#                     action_type, action_payload, 
#                     specialist_output_summary}
# Written on every VDG update and specialist return
# Exported as JSON at mission end for reproducibility
```

**10. Cost-aware VDG scoring** (optional, if time permits)

Add `estimated_cost` to VDG node: `specialist_type.base_cost * (1 + retry_count)`. Include as penalty in UCB score with tunable λ.

### 8.4 What Should Be Removed

1. **§5.2 (Hybrid Classical-Planning + Learned-Search)** — remove entirely or reduce to one sentence about phase initialization.

2. **§5.4 (Generalization Across Surfaces)** — remove from contribution claims. Move to §7 as evaluation methodology.

3. **§5.5 (Exploration-First Design)** — remove as a named contribution. Merge the three mechanisms into the VDG description (frontier selection) and specialist configuration (recon defaults, periodic check).

4. **§5.6 (Economic and Safety-Aware Reporting)** — remove from contribution claims. Move to §7 as evaluation methodology.

5. **§5.7 (Reusable Techniques from Excluded Surfaces)** — this is currently a defensive footnote. Keep the footnote but remove it from the contribution structure entirely.

6. **"Unification" framing** — throughout the document, replace "unifies" with "combines" or "integrates." "Unification" implies a deeper merger than what's actually proposed (stacking with shared data structure).

### 8.5 What Should NOT Be Added

1. **Dual-graph separation (ASG/APG)** — adds complexity without empirical justification
2. **Tool Risk Gate** — safety mechanism, not effectiveness mechanism
3. **Methodology-as-Configuration** — no testable hypothesis
4. **Crystallization / Attack Strategy Library** — untestable on chosen benchmarks
5. **Formal ASG-exhaustion termination** — practically unreachable
6. **LLM Permission Classifier** — adds latency/cost for non-core functionality
7. **Separate Research Agent** — CVE lookup handled by specialist or Team Manager
8. **Graph Neural Networks** — overkill for small graphs
9. **Multi-agent debate** — no evidence it outperforms hierarchy in VAPT
10. **Reinforcement learning** — UCB is sufficient; RL adds training infrastructure
11. **Monte Carlo Tree Search** — VDG too small for MCTS to add value over full enumeration
12. **Any technique that cannot be ablated on the chosen benchmarks** — this is the iron rule

### 8.6 The Strongest Realistic Paper

**Reframed title:** *"CMatrix: Dependency-Aware Attack Graph Exploration for Autonomous Vulnerability Assessment and Penetration Testing"*

(The original title's "Closing the Exploration and Dependency-Reasoning Gap" is too strong — CMatrix narrows the gap, it doesn't close it.)

**Abstract structure:**
1. Problem: Autonomous VAPT systems fail due to insufficient exploration (37.5-80% of failures, CVE-Bench) and poor dependency reasoning (lowest-scoring stage, PentestEval). No system addresses both simultaneously.
2. Approach: CMatrix introduces the Vulnerability Dependency Graph (VDG), which combines UCB-guided exploration with explicit prerequisite dependency edges and path-level scoring. Specialists use sub-FSMs and declarative task APIs. A 3-tier memory system provides cross-mission learning.
3. Results: [To be filled — target: CVE-Bench zero-day pass@1 ≥25%, PentestEval ADM ≥0.50, cost-per-exploit ≤ baselines]
4. Contribution: [The three contributions from §8.2.3]

**Paper structure:**
1. Introduction (2 pages)
2. Background & Motivation (1.5 pages — the failure-mode analysis from §1)
3. CMatrix Architecture (3 pages — hierarchy, VDG algorithm, specialists, validation, memory)
4. Implementation Details (1 page — model tiers, tools, context budgets)
5. Evaluation (4 pages — benchmarks, baselines, results, ablations, failure analysis)
6. Related Work (1 page)
7. Limitations & Ethical Considerations (0.5 pages — from §9)
8. Conclusion (0.5 pages)

Total: ~13.5 pages — appropriate for USENIX/IEEE S&P/CCS.

**Estimated results needed for acceptance:**

| Metric | Target | Baseline | Required improvement |
|---|---|---|---|
| CVE-Bench zero-day pass@1 | ≥25% | HPTSA ~21%, T-Agent ~10% | +4pp over HPTSA |
| CVE-Bench one-day pass@1 | ≥50% | GPT-4 ReAct ~40% | +10pp over ReAct |
| PentestEval ADM score | ≥0.50 | SMP ~0.31 | +0.19 |
| PrediQL | Match PrediQL | PrediQL's own numbers | Parity |
| MHBench | ≥37/40 | Incalmo 37/40 | Parity |
| Cost-per-exploit | ≤ baselines | Varies | 10-20% reduction |

**If results miss targets:**
- If CVE-Bench zero-day <20%: The VDG's exploration contribution is not validated. Reframe the paper around the dependency reasoning contribution (PentestEval) and acknowledge exploration as still unsolved.
- If PentestEval ADM <0.40: The dependency reasoning contribution is not validated. The paper is in trouble — this is the most direct test of the core claim.
- If both miss: The paper should not be submitted to a top venue. Submit to a workshop or second-tier venue, and use the results to improve the system for a future submission.

**What would make this paper clearly accepted (not just borderline):**
- A *qualitative* analysis showing that the VDG discovers attack paths that neither pure UCB nor pure dependency reasoning finds. Even one detailed case study where the VDG's path-scoring identifies a high-impact multi-step chain that both baselines miss would be powerful.
- A *failure analysis* that provides insight into the remaining failure modes (e.g., "of the 30 CVEs CMatrix fails on zero-day, 20 fail at exploration and 10 fail at exploitation — the remaining exploration gap requires fundamentally new reconnaissance capabilities, not better planning").
- *Cross-mission memory* showing measurable improvement on the "seen technology" subset of CVE-Bench (e.g., if CMatrix has previously exploited a ThinkPHP RCE, it performs better on other ThinkPHP CVEs). This would be the first demonstration of transfer learning in autonomous VAPT.

### 8.7 Separation of Evidence, Hypothesis, and Speculation

**Established evidence (from surveyed papers):**
- Architecture dominates model scale (6 papers)
- Insufficient exploration is the dominant CVE-Bench failure mode (CVE-Bench Table 5)
- ADM is the highest marginal-leverage PentestEval stage (PentestEval ablation)
- Sub-FSMs outperform free-form agents for multi-step exploits (AutoPT)
- Declarative API reduces hallucination (Incalmo, CHECKMATE)
- Fresh context prevents pollution (PentestGPT, D-CIPHER, VulnBot)
- Mandatory validation eliminates false positives (MAPTA)
- 3-tier memory improves over no memory (CO-REDTEAM)
- Skill promotion with verification improves over without (Voyager)
- Execution feedback is critical (CO-REDTEAM: −41.6pp without it)
- Extended thinking gives 6-10pp uplift (PENTESTGPT v2 TDA-EGATS)

**Reasonable hypotheses (not yet tested):**
- VDG with dependency edges outperforms VDG without (to be tested by ablation)
- Path-scoring outperforms node-only scoring (to be tested by ablation)
- Diagnosis loop improves validation success rate (to be tested by ablation)
- Failure propagation improves exploration breadth (to be tested by ablation)
- Cross-mission memory helps on similar technology targets (to be tested by seen/unseen split)
- Early stopping reduces cost without reducing pass rate (to be tested by ablation)

**Speculation (should not be presented as expected results):**
- CMatrix will significantly outperform all baselines on all benchmarks
- The VDG's dependency reasoning will generalize to zero-day vulnerabilities
- Cross-mission memory will help on diverse (not just similar) targets
- Cost-per-exploit will be dramatically lower than human pentesters

**In the paper:** Every claim must be tagged as evidence, hypothesis, or speculation. Results section reports hypotheses as tested. Discussion section acknowledges speculation as speculation. Reviewers can tell the difference, and trying to blur it damages credibility.

---

*End of audit. The blueprint above represents the minimum evidence-based changes needed to give CMatrix the strongest realistically defensible chance at a top-tier security venue. It does not guarantee acceptance — nothing can — but it ensures the paper's claims are specific, testable, and properly scoped, which is the prerequisite for any serious consideration.*
