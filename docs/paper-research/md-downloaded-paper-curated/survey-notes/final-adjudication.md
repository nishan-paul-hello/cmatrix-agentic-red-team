# CMatrix: Final Expert Adjudication Report

**Role:** Final expert adjudicator — pre-architectural-decision analysis only.  
**Evidence hierarchy applied:**  
1. `combined-papers.md` (29-paper corpus) — primary evidentiary base  
2. `architecture-1.md` — primary CMatrix design  
3. `architecture-2.md` — independent alternative  
4. Four AI agent architecture+reasoning pairs (evaluated as paired proposals)

**Absolute constraints followed throughout:**  
- No architecture modifications made or recommended  
- No merged architecture produced  
- No new architecture created  
- Complexity is NOT equated with novelty  
- All evaluations grounded in the 29-paper corpus  

---

## Table of Contents

1. [Per-Agent Profile: Architecture + Reasoning Quality](#1-per-agent-profile)
2. [Consensus Audit](#2-consensus-audit)
3. [Disagreement Audit](#3-disagreement-audit)
4. [Novelty Audit](#4-novelty-audit)
5. [Feasibility Audit](#5-feasibility-audit)
6. [Missed Research Opportunities](#6-missed-research-opportunities)
7. [Top-Tier Reviewer Simulation](#7-top-tier-reviewer-simulation)
8. [Final Verdict and Ranking](#8-final-verdict-and-ranking)
9. [Decision Guidance](#9-decision-guidance)

---

## 1. Per-Agent Profile

### 1.1 ChatGPT (architecture-chatgpt-web + reasoning)

**Architecture summary:**  
ChatGPT proposes a clean three-contribution architecture: (C1) Execution-Grounded Vulnerability Dependency Search with ASG + VDG graph separation, (C2) Uncertainty-Aware Closed-Loop Replanning via a formal multi-factor utility function `U(a)`, and (C3) Verified Cross-Mission Procedural Learning. The architecture includes an **Independent Verifier** agent as a separate layer, a **Research Agent** for scoped external intelligence, a formal **Adaptive Decision Policy** (mathematically defined utility function), and an **explicit stopping policy** based on expected information gain (`EIG(a) < τ` for all remaining actions). The ASG/VDG split is enforced with the same write-ownership principle as Architecture-2 but rooted in a different framing: ASG = world state, VDG = decision/search state.

**Reasoning quality:**  
Exceptional. This is the most scientifically rigorous of the four reasoning documents. Key indicators:
- Correctly identifies that "CMatrix claims seven contributions" is a red flag, then prescribes exactly three. The confidence in this diagnosis reflects a genuine understanding of how top-tier reviewers evaluate contribution lists.
- Issues the "negative transfer" warning for cross-mission memory unprompted — a subtle but critical research risk that Architecture-1 does not address. No other agent raises this.
- Recommends a 7-condition ablation matrix (Flat / LLM Planner / Dependency-only / UCB-only / VDG / VDG+memory / Full) that is architecturally decomposed enough to be causally diagnostic.
- Explicitly argues *against* adding RL: "training instability, huge data requirements, reward-design problems, reproducibility problems, difficult credit assignment" — this is the correct call and it is reasoned from research methodology, not preference.
- Notes that Architecture-1's UCB mechanism needs "serious mathematical definition" and provides both the required state-space formulation and the utility function form. This is the kind of intervention that distinguishes a research-grade review from a layman review.
- Flags 2026 literature (CyberGym, ExploitGym, AutoPenBench, the 300-server study) that the 29-paper corpus does not cover. This is a uniquely forward-looking observation that no other agent makes.
- On the ASG/APG distinction: correctly identifies it as "excellent architecture" but argues that ASG = world state and VDG = decision/search state is a stronger separation than ASG + APG, because VDG retains the UCB mechanism and dependency edges that APG lacks.

**Architecture weaknesses:**
- The formal utility function `U(a) = w_s P_s(a) + w_i IG(a) + w_d D(a) + w_c C(a) - λ Cost(a) - μ Risk(a) - ρ Redundancy(a)` is a well-reasoned construct, but the calibration of seven weight parameters requires training data that VAPT benchmarks cannot supply at scale. This introduces a hyperparameter-tuning risk that is unacknowledged in the proposal.
- The Research Agent (for "scoped external intelligence") is the one component without strong precedent in the 29-paper corpus. Its necessity is not demonstrated — it adds an LLM-call layer for CVE lookups that a Specialist or the Team Manager can handle. The architecture correctly lists it as non-novel infrastructure but its presence as a separate agent still inflates complexity without justification.
- The architecture is the most abstract of the four. It provides the research framing without the implementation specificity that Architecture-1 and the GLM proposal supply.

**Evidence fidelity:** High. Every major claim ties to specific paper findings (CO-REDTEAM execution-feedback ablation, CVE-Bench Table 5, PentestEval ADM stage).

**Bloat assessment:** Low. Three contributions, explicit "not a contribution" list, disciplined framing. The 2026 SOTA warnings, while beyond the 29-paper corpus, are honest and useful.

**Overall rating:** **A− (85/100)** — Best reasoning quality of the four agents. Architecture is research-mature but lacks implementation specificity.

---

### 1.2 Claude Web (architecture-claude-web + reasoning)

> Note: Claude-Web files were partially read in the prior session. The assessment below draws on available sections.

**Architecture summary:**  
Architecture-2 (Claude-Web). Introduces the ASG/APG dual-graph with strict write-ownership separation, Tool Adapter + 3-tier Risk Gate, FullCompact/AutoCompact/MicroCompact context management, and a Methodology-as-Configuration VAPT Protocol Prompt. The Attack Priority Graph (APG) functions as a Commander-owned opportunity layer separate from the discovery-grounded ASG.

**Reasoning quality:**  
Strong on architectural clarity; significantly weaker on research contribution differentiation. Claude-Web's reasoning does not distinguish between engineering contributions and research contributions with the rigor that ChatGPT and Claude Agent apply. The contribution list (C1–C12) includes items like "Risk Gate" (C5), "Context Compaction" (C6), and "Methodology Config" (C7) as primary contributions — a reviewer at USENIX Security would not accept these as novel research contributions.

The positive aspects:
- The FullCompact insight — that because discoveries persist in the graph, the conversation history is expendable and context reconstruction is lossless — is the most elegant single design idea across all four proposals. It correctly identifies PentestGPT Finding 4 (long-session Commander context inflation) as the target and provides a structurally elegant fix.
- The 6-hook lifecycle system is well-thought-out implementation architecture.
- The VAPT Protocol Prompt (methodology-as-configuration) is the most useful novel mechanism in Architecture-2, and Claude-Agent's reasoning later confirms its research value.

**Architecture weaknesses:**
- The APG uses Commander-assigned heuristic risk/priority scores, not algorithmically updated UCB scoring. This means the APG cannot express exploration-exploitation tradeoffs formally — it is a weighted priority queue, not a bandit-guided search structure.
- The APG cannot express cross-chain dependency relationships: if AttackChain A is a prerequisite for AttackChain B, the APG has no edge to express this. This is a structural gap that Architecture-1's VDG closes.
- The Tool Risk Gate's Medium tier (LLM Permission Classifier) adds an LLM call per tool invocation. In sandboxed benchmark evaluation, this adds cost without research value. Reviewers will question the throughput overhead.
- No evaluation plan. No benchmarks. No ablations. No baselines. No statistical procedures. This is the single largest differentiator between Architecture-2 and Architecture-1 in terms of publication readiness.
- Scope creep: general REST APIs and network infrastructure are included without benchmarks for either surface, violating the paper's own scoping rule.

**Evidence fidelity:** Moderate. The write-ownership separation is theoretically grounded but not empirically motivated by any specific failure case from the 29 papers. The claim that "fact/hypothesis contamination" is a documented failure mode is not supported by the corpus — the surveyed papers identify context pollution, depth-first tunnel vision, insufficient exploration, and dependency reasoning gaps as failure modes, not epistemic type conflation.

**Bloat assessment:** High. 12 claimed contributions inflate the paper's attack surface for rejection. C5–C12 are engineering contributions masquerading as research novelty.

**Overall rating:** **B (70/100)** — Strongest on architectural clarity and context management design. Weakest on research maturity, contribution differentiation, and evaluation methodology.

---

### 1.3 Claude Agent (architecture-claude-agent + reasoning)

**Architecture summary:**  
A revised Architecture-1 with targeted changes annotated as `[CHANGE]` tags. Key additions: the VDG splits into Environmental Layer (EL) + Attack Layer (AL/VDG) adopting Architecture-2's write-ownership principle, FullCompact for Team Manager context inflation, the VAPT Protocol Prompt, the Episodic Failure Memory (4th FAISS tier), the Dual-Termination Condition formalized, and the Ordinal Evidence Score (E_ord) replacing raw LLM confidence in the UCB formula.

**Reasoning quality:**  
Highest analytical precision of all four agents. Claude-Agent's reasoning is structured as a formal audit (Weaknesses W1–W7) followed by recommendations that are individually justified, scored by priority, and bounded by explicit feasibility constraints. The key strengths:

- The W1–W7 weakness taxonomy is the most rigorous diagnosis of Architecture-1 in the corpus. Each weakness is specific, actionable, and accompanied by an explanation of the reviewer consequence if left unresolved.
- The recommendation to adopt Architecture-2's ≥2-mission crystallization threshold as the Voyager skill-promotion gate (resolving W4) is the most elegant single solution to a concrete problem across all four reasoning documents. It resolves the feasibility concern with minimum architectural change.
- The Episodic Failure Memory (4th FAISS tier) is justified by specific evidence: Reflexion (Shinn et al., NeurIPS 2023) and CO-REDTEAM's −41.6pp ablation. This is rigorous, not speculative.
- The ordinal evidence confidence scoring (E_ord 1–5 scale) is justified by citing overconfidence research (Kadavath et al. 2022; Xiong et al. 2024) and directly connects to the VDG's UCB computation. This is a genuine improvement that Architecture-1 needed and that only Claude-Agent identifies.
- The EPSS-based initial VDG priority recommendation is justified (NVD/FIRST API, principled prior before evidence), low-cost, and reproducible — a good example of adding value without complexity.
- The graph-lock protocol for parallel Specialist dispatch is the only proposal in any of the four documents that addresses the concurrency consistency problem. This is a real implementation gap.
- The Probability Estimates table (USENIX 25–40%, NDSS 40–55%, rejection if W1 unresolved 60–70%) reflects calibrated, honest uncertainty.

**Architecture weaknesses:**
- The architecture now carries 14 named sections plus numerous sub-algorithms. The Claude-Agent proposal is architecturally comprehensive but risks the same "bundle of incremental integrations" accusation that Claude-Agent's own reasoning warns against for Architecture-1.
- The Hybrid Classical-Planning + VDG integration remains as a named change (resolving W2) but is still underspecified at the algorithm level — the what-changes-when-PDDL-fails question is still not fully answered.
- The VAPT Protocol Prompt is added but its interaction with the UCB override logic is described at a high level. The question "what happens when the Protocol Prompt rule contradicts the UCB selection?" is not resolved.

**Evidence fidelity:** Excellent. The highest of all four agents. Every recommendation is supported by a specific finding from the 29-paper corpus or from named external research.

**Bloat assessment:** Low-to-moderate. The changes are defensible and each has a stated research value. However, the cumulative addition of EL/AL split + FullCompact + VAPT Protocol Prompt + Episodic Failure Memory + Ordinal E_ord + EPSS prior + Graph-lock + Dual-termination + Engagement Trajectory Export is a significant scope expansion over Architecture-1. Each individual change is justified; the aggregate may be too large for a single paper.

**Overall rating:** **A (88/100)** — Best architecture quality of the four, best evidence fidelity, best diagnostic precision. The reasoning is the most structured and the resulting architecture is the most research-ready.

---

### 1.4 GLM Web (architecture-glm-web + reasoning)

**Architecture summary:**  
GLM proposes a lean, implementation-complete version of CMatrix with three explicit contributions (down from Architecture-1's seven): (1) Dependency-Aware Attack Graph Exploration with UCB + dependency edges + path-level scoring, (2) Cross-Mission Memory with Verified Skill Promotion (security-specific conditional workflows), and (3) Comprehensive Cross-Benchmark Evaluation Methodology. Key additions relative to Architecture-1: fully pseudocode-specified VDG algorithm (Node Addition → Edge Inference → UCB Update → Path Scoring → Frontier Computation → Node Selection), the Validation Agent Diagnosis-Adapt-Cap loop (from Architecture-2), Vulnerability-Class Knowledge Injection, Per-Mission Failure Log, Per-Node Retry Budget, VDG Failure Propagation with BLOCKED status, Early Stopping Heuristic, Cost-Aware VDG Scoring, and a complete statistical methodology (McNemar's test, 95% Wilson score CI, compute normalization).

**Reasoning quality:**  
The most implementation-grounded reasoning of the four. GLM's reasoning document reads like a research engineer's blueprint rather than a pure theoretical audit. Key strengths:

- The VDG algorithm is specified in complete, executable pseudocode — the most concrete algorithm specification across all four agents. This directly resolves W1 in Claude-Agent's taxonomy.
- The "verdict: do NOT switch to dual-graph" position on the ASG/APG question is the most contrarian conclusion among the four agents, and it is well-reasoned: the claim that "fact/hypothesis contamination" is a documented failure mode is not supported by the 29-paper corpus; the same separation can be achieved within one graph through node/edge typing; dual-graph adds implementation complexity without demonstrated benefit.
- The path-scoring addition (feasible path optimization over node-scoring) is the clearest algorithmic novelty identified by any agent. The claim that "a path of three medium-scoring nodes leading to RCE is more valuable than a single high-scoring node leading to information disclosure" is correct and is the precise reason node-level UCB scoring is insufficient for multi-step attack chains.
- The specific ablation (d) > (c) test — Full VDG with path-scoring vs. UCB filtered by dependency satisfaction — is the most diagnostically precise experiment specified across all four agents. This is the ablation that would actually prove whether "unification" adds value over "stacking."
- The GLM is the only agent to provide explicit statistical methodology: 5 runs per benchmark on smaller sets, 10 runs on CVE-Bench, McNemar's test for paired binary outcomes, compute normalization at 50 LLM API calls per CVE. This is what top-tier venues require.
- The crystallization verdict (do NOT adopt) is evidence-based: CVE-Bench has 40 different CVEs, PrediQL has 6 APIs, neither supplies enough repeated technology-fingerprint matches for crystallization to trigger. This is a precise feasibility argument that Claude-Agent's adoption of the ≥2-mission threshold glosses over.
- The "why we should believe the system can work" section is uniquely persuasive: the composition is conservative, the weakest link (VDG edge inference) is degradable, the benchmarks are well-characterized, and failure modes are enumerable.

**Architecture weaknesses:**
- The GLM explicitly recommends NOT adopting the Dual-Layer (EL+AL) separation, keeping a single VDG. While the reasoning is sound, the EL/AL separation in Claude-Agent's proposal provides a cleaner ablation boundary that GLM's proposal does not. Whether this is a weakness or a strength depends on implementation discipline.
- The GLM does not adopt the VAPT Protocol Prompt, arguing it is scope creep without a clear hypothesis. This is a defensible call but it foregoes an additional ablation axis.
- The Episodic Failure Memory and EPSS prior from Claude-Agent are absent from GLM's proposal.
- The statistical methodology is well-specified in the reasoning but is not fully reflected in the architecture document itself — it appears only in §7.2.

**Evidence fidelity:** High. The GLM consistently distinguishes Established Evidence, Reasonable Hypotheses, and Speculation — mirroring Claude-Agent's epistemic discipline. The specific citation of the pass@5 vs. pass@1 gap in Fang et al. (87% vs. 40%) as evidence for the Diagnosis-Adapt-Cap loop's research value is precise and persuasive.

**Bloat assessment:** Lowest of the four. Three contributions. Explicit "Techniques NOT Added" table with reasoning. The GLM is the most disciplined about contribution scope.

**Overall rating:** **A (87/100)** — Best implementation completeness and algorithmic specificity. Best statistical methodology. Highest on immediate implementation feasibility. Slightly below Claude-Agent on reasoning precision and evidence citation depth.

---

## 2. Consensus Audit

The following positions are held by **all four agents**:

| Consensus Item | Evidence cited | Assessment |
|---|---|---|
| Architecture dominates model scale | 6 papers (AWE, AutoPT, VulnBot, PentestAgent, D-CIPHER, Incalmo) | **Established.** No agent disputes this. |
| VDG as the central research object | CVE-Bench + PentestEval failure modes | **Correct.** All four independently arrive at this. |
| Insufficient exploration is CVE-Bench's dominant failure mode | CVE-Bench Table 5 (37.5%–80.0%) | **Established.** Unanimous. |
| ADM is PentestEval's highest-leverage stage | +0.14 marginal gain from GT-ADM | **Established.** Unanimous. |
| VDG must be specified as an algorithm, not just a schema | Missing: UCB formula, edge construction, backpropagation rule | **Critical consensus.** W1 is the paper-killer if unresolved. |
| Fresh context per Specialist is correct | PentestGPT, D-CIPHER, VulnBot independently validate | **Established.** No agent recommends rolling history. |
| Declarative task API is correct | Incalmo, CHECKMATE, RESTler internally | **Established.** Unanimous adoption. |
| No Reinforcement Learning | Data scale insufficient; UCB is the correct lightweight analogue | **Strong consensus.** ChatGPT argues it most thoroughly. |
| Hybrid Classical-Planning + VDG should be removed or fully specified | Currently unimplementable; adds no differentiated value | **Strong consensus.** All four identify this as a weakness. |
| No custom benchmark construction | Correctly excluded in Architecture-1; no agent disputes it | **Unanimous.** |
| The 29-paper corpus has limitations for 2026 positioning | 2026 SOTA (CyberGym, 300-server study) partially invalidates "first" claims | **ChatGPT uniquely raises this; others implicitly acknowledge** |

**Implication:** The consensus on W1 (VDG algorithm underspecification) is striking. Four independent agents — ranging from abstract (ChatGPT) to implementation-detailed (GLM) — all identify the same paper-killer gap. This convergence is the strongest single signal in the entire corpus: **no architectural decision should proceed until the VDG algorithm is specified at pseudocode level with precise UCB formula, edge construction procedure, and backpropagation rule.**

---

## 3. Disagreement Audit

### 3.1 Dual-Graph vs. Single-Graph (highest stakes disagreement)

| Agent | Position | Reasoning quality |
|---|---|---|
| **ChatGPT** | ASG + VDG (recommends adopting ASG = world state, VDG = decision state; *not* ASG + APG) | High — correctly identifies VDG as the stronger structure for the decision layer |
| **Claude-Web** | ASG + APG (endorses own design) | Moderate — limited adversarial scrutiny of own proposal |
| **Claude-Agent** | EL + AL/VDG (adopts the write-ownership principle from Arch-2 inside Architecture-1's VDG) | High — grounded in ablation-clarity argument |
| **GLM** | Single VDG with node/edge typing (explicitly rejects dual-graph) | High — the only agent to rigorously ask "is fact/hypothesis contamination a documented failure mode?" and answer "no" |

**Adjudicator's finding:**  
This is the most consequential disagreement. Three agents recommend some form of dual-structure separation; one (GLM) argues against it on empirical grounds. The GLM's objection is methodologically correct: the 29-paper corpus does not document "fact/hypothesis contamination" as a failure mode. The surveyed papers identify context pollution, tunnel vision, exploration failures, and dependency gaps — not epistemic type conflation.

However, the ablation-clarity argument (Claude-Agent) is also valid: separating "what the system knows" from "what the system plans" makes it easier to isolate discovery quality from planning quality in ablations. This is a research-methodology argument, not an effectiveness argument.

**Verdict on the disagreement:** GLM is correct that the separation is not *required* for effectiveness and that its benefit is not yet empirically demonstrated. Claude-Agent is correct that the separation improves ablation tractability. Both positions are defensible. The deciding factor should be **which choice enables cleaner causal inference in ablations** — which favors the separation. However, the GLM is correct that the same separation can be achieved within one graph through node/edge typing, without the overhead of two serialization formats and two query interfaces.

### 3.2 VAPT Protocol Prompt (methodology-as-configuration)

| Agent | Position |
|---|---|
| **Claude-Web** | Core contribution (C7) |
| **Claude-Agent** | Medium-High research value — additional ablation axis |
| **ChatGPT** | Engineering mechanism, not research novelty; use as ablation/evaluation variable |
| **GLM** | Do NOT adopt — no clear hypothesis about methodology effects; scope creep |

**Adjudicator's finding:**  
ChatGPT and GLM are aligned that it is not a research contribution. Claude-Agent is aligned with ChatGPT that it has value as an ablation variable. Claude-Web overclaims it. The weight of evidence favors: retain as an ablation variable, do not claim as a research contribution.

### 3.3 Cross-Mission Memory Crystallization Threshold

| Agent | Position |
|---|---|
| **Claude-Agent** | Adopt Architecture-2's ≥2-mission crystallization threshold (resolves W4) |
| **GLM** | Do NOT adopt — untestable on chosen benchmarks (40 CVEs, 6 GraphQL APIs, 40 environments are too diverse for crystallization to trigger) |
| **ChatGPT** | Adopt Voyager-style verified promotion; flag negative transfer risk |

**Adjudicator's finding:**  
GLM's objection is empirically precise and is the most rigorous argument of the three. If the benchmarks don't supply repeated technology-fingerprint matches, crystallization is unstestable. Claude-Agent's ≥2-mission threshold is elegant but requires the right evaluation setup to be meaningful. **GLM is correct for the immediate paper; Claude-Agent's threshold is better for a longer-term evaluation program.**

### 3.4 VDG Path-Level Scoring

| Agent | Position |
|---|---|
| **GLM** | High priority addition — node-level scoring is insufficient for multi-step chains |
| **Claude-Agent** | Not explicitly added as a separate mechanism (subsumed into UCB node scoring) |
| **ChatGPT** | Implicitly included in the expected information gain term |
| **Claude-Web** | Not addressed |

**Adjudicator's finding:**  
GLM is uniquely correct here. The gap between node-scoring and path-scoring is real: a high-scoring node behind a chain of failed prerequisites is worthless. Path scoring is the mechanism that makes the VDG genuinely different from a scored priority queue. The specific ablation GLM proposes (node-scoring vs. path-scoring on CVE-Bench multi-step CVEs) is sound.

### 3.5 Risk Gate (Tool Risk Classification)

| Agent | Position |
|---|---|
| **Claude-Web** | 3-tier Risk Gate (Core contribution C5) |
| **Claude-Agent** | Adopt Commander-mailbox for high-risk only; reject Medium-tier LLM classifier |
| **ChatGPT** | Keep for safety/engineering; don't call it a research contribution without studying false approvals/escalations |
| **GLM** | Do NOT adopt — safety mechanism, not effectiveness mechanism; irrelevant for sandboxed evaluation |

**Adjudicator's finding:**  
GLM and ChatGPT are aligned: the Risk Gate is a deployment safety feature, not a research contribution. Claude-Agent's conditional adoption (high-risk only) is a reasonable middle position. Claude-Web overclaims.

---

## 4. Novelty Audit

### 4.1 What is genuinely novel (consensus across agents)

| Claim | Novelty status | Adjudicator verdict |
|---|---|---|
| **VDG: UCB + dependency edges + dynamic growth from Specialist discovery** | Potentially genuine — no surveyed system combines all three in one structure | **Conditional: genuine only if VDG with path-scoring > stacked UCB-filtered-by-dependency (GLM's ablation (d) > (c)). Until that ablation is run, downgrade to "dependency-aware UCB filtering."** |
| **Cross-surface evaluation (web + GraphQL + multi-host with one architecture)** | Methodological gap — no prior paper evaluates all three surfaces | **Methodological contribution only, not algorithmic. Retain in evaluation section.** |
| **Cross-mission memory with verified skill promotion** | Marginal — CO-REDTEAM (3-tier) + Voyager (verification) exist; combination in security context does not | **Supporting contribution only. Must demonstrate security-specific challenge (conditional branching in exploit chains) that Voyager's game-world skills don't have.** |

### 4.2 What is NOT novel (strong consensus)

| Claim | Verdict |
|---|---|
| Hybrid Classical-Planning + VDG | **Not novel.** Phase ordering (recon → enumeration → exploit) is not a PDDL plan. Remove from contribution list or fully specify with a domain file. |
| Economic/safety-framing metrics as co-primary contribution | **Not novel.** Reporting choice. BountyBench already does this. Demote to methodological section. |
| Generalization "with one unmodified architecture across three surfaces" | **Inaccurate.** Different Specialist pools activate per surface. Rephrase to "shared orchestration layer with surface-specific execution modules." |
| Exploration fix (parallel queue + meta-critic + full-depth recon) | **Not architectural innovation.** A secondary todo list + periodic prompt injection + default scan setting. Downgrade framing. |
| Risk Gate as a research contribution | **Not novel.** Safety/engineering mechanism. Deployment-focused venues only. |

### 4.3 Novelty precision: what makes the VDG potentially novel

All four agents converge on this framing, with GLM providing the most precise test:

> The VDG is novel *if and only if*: a VDG with path-scoring and dependency-constrained frontier beats a system that runs UCB *over* a dependency graph (i.e., dependency filtering as a wrapper on top of UCB, not a unified structure). If (d) > (c), unification has value. If (d) ≈ (c), the contribution weakens to "dependency-aware UCB filtering."

This is the single most important experimental question in the entire CMatrix research program. **It must be answered before any novelty claim is finalized.**

---

## 5. Feasibility Audit

### 5.1 What is feasibly implementable now (all four agents agree)

| Component | Feasibility | Timeline estimate (GLM) |
|---|---|---|
| VDG as directed graph (NetworkX or equivalent) | Very High | Days |
| Declarative task API (5–8 verbs) | Very High | Days |
| Fresh context per Specialist | Very High | Already exists in Architecture-1 |
| SQLi and XSS sub-FSMs | High | 1–2 weeks to prototype |
| Session Persistence Service | High | Days |
| FAISS + cross-encoder 3-tier memory | High | 1–2 weeks |
| Structured Handoff Bridge | High | Days |
| Execution/Validation Agent separation | High | Already exists |

### 5.2 What requires prototype-first validation (all four agents flag)

| Component | Risk | Required pilot study |
|---|---|---|
| **VDG edge inference (LLM-inferred prerequisites)** | HIGH — if precision < 50%, dependency reasoning is noise | Take 10 PentestEval scenarios (ground-truth prerequisites known), run Team Manager edge-inference prompt, measure precision/recall. Must precede main evaluation. |
| **UCB parameter tuning (α, β, γ, κ, λ, C_expl)** | MEDIUM — wrong parameters → tunnel vision or random walk | Grid search on Tier 1 (PentestEval), hold out CVE-Bench. |
| **Skill library cross-mission transfer** | MEDIUM — strategies from sandbox may not generalize to production targets | Track "validated-in-sandbox" vs. "validated-in-production" separately. |

### 5.3 Specific feasibility concern: Voyager skill promotion (W4)

The four agents offer three different solutions:
- **ChatGPT:** Adopt Voyager's verification gate but run against sandbox benchmarks only
- **Claude-Agent:** Adopt Architecture-2's ≥2-mission crystallization threshold
- **GLM:** Do not adopt crystallization (untestable on chosen benchmarks); use Architecture-1's per-mission skill storage instead

**Adjudicator's finding:** For the immediate paper, GLM is correct. Crystallization requires repeated technology-fingerprint matches across missions — which the chosen benchmarks do not reliably supply. The correct short-term answer is verified-by-Validation-Agent skill storage (simpler than Voyager's re-execution postcondition, and stronger than GLM's per-mission approach since Validation Agent's oracle-backed check is rigorous). The ≥2-mission crystallization threshold is the right design for a longitudinal follow-up study with HTB machine families or a dedicated technology-repetition benchmark.

### 5.4 Realistic timeline concern

All four agents estimate: 3–6 months of engineering effort before main evaluation begins, on top of 2–3 weeks for VDG algorithm formalization and the pilot study.

---

## 6. Missed Research Opportunities

### 6.1 Uniquely identified by each agent (not in Architecture-1 or Architecture-2)

**ChatGPT only:**
- **Negative transfer warning for cross-mission memory.** A strategy successful against Framework A version X may be harmful against version Y. This requires separate ablations: memory enabled / disabled / raw episodic / verified procedural / incorrect-memory injection / stale-memory condition. No other agent raises this concern.
- **2026 SOTA displacement risk.** The 29-paper corpus predates work like CyberGym (1,507 instances), ExploitGym (869 vulnerabilities), and the 300-server 2026 study. Architecture-1's "first to combine" claims may need refinement against 2026 literature. ChatGPT is the only agent that explicitly flags this.
- **Uncertainty estimation as a formal first-class concept.** The proposal that every VDG hypothesis should have `p_h = P(hypothesis is valid | E)` updated from execution evidence — not just a UCB score, but a calibrated posterior — is the most theoretically sophisticated addition. No other agent frames it this cleanly.
- **Tool-selection efficiency as a primary metric.** `validated_findings / tool_calls` and `validated_attack_paths / wall_clock_time` are proposed as evaluation metrics. These directly measure decision policy quality and are absent from the other proposals.

**Claude-Agent only:**
- **EPSS-based initial VDG priority.** EPSS provides a calibrated exploitation-probability prior from NVD/FIRST API before any evidence is collected. This makes VDG initialization principled and reproducible, and creates a new testable question: does EPSS-informed initialization reduce time-to-first-successful-exploit?
- **Graph-lock protocol for parallel Specialist dispatch.** Specialist "acquires" a subtree of EL nodes; others cannot write until release. This is the only proposal that addresses concurrency consistency in parallel dispatch, a real implementation problem that MAPTA and D-CIPHER don't solve.
- **Tool output sanitization against prompt injection.** Explicitly defends against XSS-payload-in-HTTP-response prompt injection. A real attack vector in VAPT agents. No other agent addresses it.

**GLM only:**
- **Path-level scoring as a distinct algorithmic contribution.** This is the clearest algorithmic innovation identified by any agent. The argument that node-level UCB scoring is insufficient for multi-step chains, and that path scoring makes the VDG genuinely different from a scored priority queue, is the most precise novelty claim in the corpus.
- **Failure recovery with explicit VDG propagation (BLOCKED status propagation).** When a node fails, dependent nodes are marked BLOCKED and the feasible frontier is recomputed. This directly addresses PentestGPT Finding 4 (tunnel vision / inability to recover from failed paths) at the algorithmic level. No other agent specifies the propagation algorithm.
- **Early stopping heuristic with measurable cost-per-exploit impact.** If no new VDG nodes added in N=5 invocations AND frontier empty, terminate before the hard timeout. Directly improves the cost-per-exploit metric. No other agent specifies this.
- **Cost-aware VDG scoring.** Estimated node cost as a penalty term `λ·estimated_cost` in the UCB score, preventing budget concentration on a single expensive node.
- **The unification vs. stacking ablation (d) > (c).** The clearest statement of the experimental test that actually proves VDG novelty. Every paper needs this.

**Claude-Web only:**
- **FullCompact with lossless context reconstruction.** While the "lossless" claim is too strong (ChatGPT correctly downgrades to "state-preserving under the defined schema"), the core insight — that persistent structured state makes conversation history expendable — is Architecture-2's most valuable architectural idea. It is the correct fix for PentestGPT Finding 4 at the orchestration layer.

### 6.2 Missed by all four agents

- **No agent addresses the statistical power problem for CVE-Bench.** CVE-Bench has 40 CVEs. With 5 runs per condition and 6+ ablation conditions, the total experimental budget is 40 × 5 × 6 = 1,200 runs minimum. At $0.01–$0.10 per run (depending on model), this is manageable. But none of the agents perform a formal power analysis to determine whether 40 CVEs × 5 runs achieves 80% power for the expected effect sizes. Claude-Agent mentions the concern; none provide the calculation.
- **No agent specifies how the VDG handles loops in the attack surface** (e.g., auth bypass enables SQLi; SQLi discovers new auth targets → circular enabling relationships). Claude-Agent mentions cycle detection and demotion of lower-confidence edges; only the GLM's pseudocode specifies a DAG check. The semantic correctness of cycle-breaking by edge type demotion is not analyzed.
- **No agent addresses the VAPT Protocol Prompt interaction with UCB override rules in detail.** When the Protocol Prompt says "escalate critical findings first" and the UCB formula ranks a different node higher, which takes precedence? Claude-Agent mentions override rules but doesn't resolve the conflict.
- **No agent specifies the cross-encoder reranker configuration for the 3-tier memory.** Embedding model, chunking strategy, retrieval trigger timing, injection format — all four agents use FAISS + cross-encoder without specifying the implementation.

---

## 7. Top-Tier Reviewer Simulation

**Venue target:** USENIX Security / IEEE S&P (primary); NDSS / AsiaCCS (secondary)

### 7.1 Predicted reviewer objections (probability-ranked)

| Objection | Probability | Which agent would survive it | Evidence |
|---|---|---|---|
| "The VDG update algorithm is not specified. Without it, this is a data structure claim, not an algorithmic contribution." | **90%** | Claude-Agent (pseudocode in §4) and GLM (pseudocode in §3.2) | All four agents identify W1 |
| "Your ablation plan does not isolate VDG components. I cannot determine whether UCB, dependency edges, or path scoring is responsible for the result." | **80%** | GLM (ablation (a)/(b)/(c)/(d)) and Claude-Agent (decomposed VDG ablations) | All four agents flag the insufficient ablation plan |
| "The hybrid Classical-Planning + VDG integration is described but not implemented or specified. Remove it from your contributions." | **75%** | All four (all recommend removal or specification) | Strong consensus |
| "Your 'generalization across three surfaces' is multi-surface evaluation, not generalization. Please rephrase." | **70%** | All four (all flag W6) | Strong consensus |
| "Where are your confidence intervals? How many runs? What is your significance test?" | **70%** | GLM only (specifies McNemar's test, Wilson CI, 5/10 runs, compute normalization) | GLM's statistical methodology |
| "The exploration fix (parallel queue + meta-critic + full-depth recon defaults) is not architectural innovation. Downgrade the framing." | **65%** | GLM (explicitly deprioritizes this); ChatGPT (recommends surgical experiments) | |
| "The 3-tier memory is CO-REDTEAM + Voyager. What is security-specific about your implementation?" | **60%** | GLM (conditional branching in exploit chains as the security-specific difference) | |
| "What happens when the system gets stuck? You describe the happy path but not failure recovery." | **60%** | GLM (BLOCKED propagation algorithm) | GLM identifies this gap most precisely |
| "Your cost-per-exploit metric is backbone-price-sensitive. Normalize or report at multiple price points." | **50%** | GLM (cost normalization at 50 API calls per CVE) | |

### 7.2 Reasons for outright rejection (probability)

| Reason | Probability | Which architectures avoid it |
|---|---|---|
| VDG algorithm unspecified at submission | **60%** if W1 is unresolved | Claude-Agent (§4 pseudocode), GLM (§3.2 pseudocode) |
| Ablation plan insufficient for causal claims | **50%** if unchanged | GLM (decomposed ablation design) |
| No statistical methodology (runs, CIs, significance tests) | **40%** without GLM's additions | GLM only |
| Hybrid Classical-Planning overclaimed | **30%** if not removed | All four recommend removal |
| Empirical results don't outperform HPTSA on CVE-Bench zero-day | **30%** (empirically unknown) | Not a design question |

---

## 8. Final Verdict and Ranking

### 8.1 Overall Architecture Ranking

| Rank | Agent | Architecture Score | Reasoning Score | Composite | Primary strength |
|---|---|---|---|---|---|
| **1** | **Claude-Agent** | 90/100 | 92/100 | **91/100** | Most precise diagnostic reasoning; VDG formally specified at algorithm level; best evidence fidelity; solves W1–W7 with individually justified fixes |
| **2** | **GLM** | 88/100 | 85/100 | **87/100** | Most implementation-complete specification; only agent with full statistical methodology; clearest novelty precision (path-scoring vs. node-scoring); best contribution discipline |
| **3** | **ChatGPT** | 82/100 | 90/100 | **86/100** | Best research framing; most forward-looking (2026 SOTA warning, negative transfer); best at identifying what is NOT a contribution; most mature formal utility function |
| **4** | **Claude-Web** | 75/100 | 65/100 | **70/100** | Strongest on context management (FullCompact insight); weakest on contribution differentiation; no evaluation plan; scope creep |

### 8.2 Reasoning Quality Ranking (independent of architecture)

| Rank | Agent | Reasoning quality | Key differentiator |
|---|---|---|---|
| **1** | **Claude-Agent** | A (92/100) | Formal W1–W7 taxonomy; probability-calibrated verdicts; best evidence citation |
| **2** | **ChatGPT** | A− (90/100) | Best forward positioning; negative transfer warning; 7-condition ablation matrix; anti-RL argument |
| **3** | **GLM** | B+ (85/100) | Best implementation specificity; most precise novelty test; only statistical methodology |
| **4** | **Claude-Web** | B− (65/100) | Best on clarity; weakest on contribution differentiation and evaluation methodology |

### 8.3 Architecture-1 vs. Architecture-2: Adjudicator's Position

Architecture-1 is the stronger research proposal. Four independent agents confirm this, with evidence:

- Architecture-1 has a benchmarking strategy; Architecture-2 does not.
- Architecture-1 has ablation designs; Architecture-2 does not.
- Architecture-1's VDG has UCB scoring and dependency edges; Architecture-2's APG has neither formally.
- Architecture-1's problem grounding (CVE-Bench Table 5, PentestEval ADM) is more precise.
- Architecture-2's FullCompact and write-ownership separation are genuine improvements to adopt selectively.

**The correct posture is:** Architecture-1 as the research backbone, with selective adoption of Architecture-2's best ideas — specifically: write-ownership separation (EL/AL or node-typed single graph), FullCompact for Team Manager context, and possibly the VAPT Protocol Prompt as an ablation variable.

### 8.4 Novelty Assessment: Honest Appraisal

The VDG is a potential genuine research contribution *conditional* on: (a) algorithm formalization (W1 resolved), (b) the pilot study showing LLM-inferred edges > 50% precision against PentestEval ground truth, and (c) the ablation demonstrating (d) > (c) (path-scoring + dependency + UCB > stacking). Until all three conditions are met, the VDG is best described as "dependency-aware UCB filtering" rather than "unified exploration-dependency search." This is still a contribution — but a narrower one.

The cross-mission memory, multi-surface evaluation, and economic metrics are supporting contributions, not primary ones.

### 8.5 Feasibility Assessment: Honest Appraisal

The system is feasible. Individual components are independently validated by prior work. The conservative composition (no capabilities assumed that haven't been demonstrated) is appropriate. The critical unknown is VDG edge inference accuracy. This must be prototyped before any paper-level claim about dependency reasoning is made. If edge inference precision < 50%, the VDG degrades to a noisy UCB priority queue — still useful, but not the claimed contribution.

---

## 9. Decision Guidance

> **This section presents the adjudicator's observations. No architectural modification is recommended. The decisions belong to the project team.**

### 9.1 Decisions requiring resolution before architectural changes can proceed

1. **W1 — VDG algorithm specification**: The four agents provide two complete pseudocode specifications (Claude-Agent §4, GLM §3.2). These are available as evidence for the project team's decision on which formulation to adopt.

2. **Dual-graph vs. single-graph**: Three agents recommend separation; one (GLM) argues single-graph with node/edge typing achieves the same benefit with less complexity. The deciding factor identified by the corpus is: which choice enables cleaner causal ablation design?

3. **VDG path-level scoring**: Only GLM identifies this as a distinct algorithmic contribution. The claim that node-scoring is insufficient for multi-step chains is well-reasoned. The ablation (node-scoring vs. path-scoring) is specified and feasible.

4. **Crystallization vs. per-mission skill storage**: GLM's feasibility argument (crystallization is untestable on the chosen benchmarks) is empirically sound. Claude-Agent's ≥2-mission threshold is architecturally cleaner for a longer-term evaluation program.

5. **Contribution list pruning**: All four agents agree the final paper should carry 3 primary contributions, not 7. The three that all agents endorse in some form: (1) VDG as dependency-aware exploration algorithm, (2) cross-mission memory with verified skill promotion (with security-specific framing), (3) comprehensive cross-benchmark evaluation. Economic metrics, classical planning, and generalization claims should be repositioned or removed.

### 9.2 Components with strong multi-agent endorsement for eventual adoption

> Listed for reference only. No recommendation to adopt is made here.

| Component | Endorsing agents | Basis |
|---|---|---|
| VDG algorithm in pseudocode | Claude-Agent, GLM | W1 resolution |
| Path-level scoring in VDG | GLM (strong), ChatGPT (implicit) | Multi-step chain reasoning |
| VDG failure propagation (BLOCKED status) | GLM (explicit), Claude-Agent (implicit) | PentestGPT Finding 4 |
| Early stopping heuristic | GLM, Claude-Agent | Cost-per-exploit metric |
| Ordinal evidence confidence (E_ord 1–5) | Claude-Agent | UCB calibration; overconfidence research |
| FullCompact for Team Manager | Claude-Agent, ChatGPT | PentestGPT Finding 4 (Commander context) |
| Diagnosis-Adapt-Cap loop in Validation Agent | GLM (high priority), Claude-Agent | pass@5 vs. pass@1 gap in Fang et al. |
| Pilot study: VDG edge inference vs. PentestEval GT | All four | Must precede main evaluation |
| Statistical methodology (runs, CI, McNemar's) | GLM | Top-tier venue requirements |

### 9.3 The single most important research-readiness gate

**The VDG pilot study on PentestEval:**  
Take 10 scenarios from PentestEval where ground-truth dependency annotations exist. Run the Team Manager's edge-inference prompt. Measure precision and recall of LLM-inferred prerequisite edges against the ground truth. If precision ≥ 60%, proceed with the dependency-edge contribution claim. If precision < 50%, the dependency contribution weakens and the paper's core novelty requires reformulation. No architectural decision on the VDG's contribution status should be made before this measurement.

This is not a recommendation to proceed or halt — it is an identification of the evidentiary gate that all four agents independently conclude must be passed.

---

*Adjudication complete. No architecture has been modified. No merged architecture has been produced. All conclusions are grounded in the 29-paper corpus (combined-papers.md) and the four agent architecture+reasoning pairs evaluated as paired proposals. Evidence is classified throughout as Established (peer-reviewed corpus results), Reasonable Hypothesis (logically grounded predictions), or Speculative (unvalidated claims).*
