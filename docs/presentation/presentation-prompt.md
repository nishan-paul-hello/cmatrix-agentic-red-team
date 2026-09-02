# RedGrid Presentation — Master Prompt for AI Slide Generator

## Meta Instructions for the Slide Agent

Generate a **10-minute MSc thesis inception-stage presentation** (20 slides total) for the project **RedGrid: Dependency-Constrained UCB Exploration for Autonomous Penetration Testing**. The presentation is the first submission in a 6-month thesis program. The report is complete for Chapters 0, 1, and 2 only (Introduction + Literature Review). Methodology, evaluation, and results are not yet done. The presentation must:

- **Deeply cover Chapters 1 and 2** (slides 1–12: problem, background, literature, gap analysis)
- **Give high-level visual overviews** of remaining chapters (slides 13–18: architecture, methodology sketch, evaluation plan, timeline, conclusion)
- Be honest about early-stage work while sounding polished, confident, and research-grade
- Feel **professional, catchy, and visually alive** — not a wall of text
- Be suitable for a **10-minute slot** (~30–40 sec per slide for early slides, 45–60 sec for architecture slides)

---

## Theme and Visual Design System

### Color Palette
- **Background:** Deep charcoal `#0D1117` (near-black, dark mode)
- **Slide surface:** `#161B22` (very dark navy-grey card)
- **Primary accent:** Vibrant electric red `#FF3B3B` (danger/attack energy — thematically fitting)
- **Secondary accent:** Bright cyan `#00D4FF` (data, exploration, technical components)
- **Tertiary accent:** Soft amber `#FFB347` (highlights, callouts, metrics)
- **Text primary:** `#F0F6FC` (near-white, maximum contrast)
- **Text secondary:** `#8B949E` (muted grey for captions, footnotes)
- **Divider/border:** `#30363D`
- **Node/graph green:** `#3FB950` (for VDG EXPLOITED node status, positive signals)
- **Node blocked red:** `#F85149` (for INFEASIBLE/BLOCKED nodes)

### Typography
- **Title font:** `"Syne"` (Google Fonts) — bold, geometric, modern. Weight 800 for slide titles.
- **Body font:** `"Inter"` (Google Fonts) — clean, readable. Weight 400/500 for body, 600 for sub-headings.
- **Mono/code font:** `"JetBrains Mono"` (Google Fonts) — for formulas, node schemas, pseudocode.
- **Font sizes:**
  - Slide title: 38–44px
  - Section heading: 24–28px
  - Body text / bullets: 18–20px
  - Captions / footnotes: 13–15px in `#8B949E`
  - Code blocks: 14–15px in JetBrains Mono

### Layout and Spacing
- **Aspect ratio:** 16:9 (widescreen)
- **Margin:** Generous padding (60–80px sides) — never feel cramped
- **Two-column layouts** for comparison slides (left = old/prior work, right = RedGrid fix)
- **Full-bleed accent bars** — 4px vertical left border in accent color on key quote blocks
- **Grid-based icon+text combos** for quick-read lists
- **No bullet-soup** — maximum 4 bullets per slide; prefer visual groupings and callout boxes
- Use **ample white space** — each slide should breathe

### Animations
- **Default:** Slides fade in, content stagger-enters from bottom (y: +20px to 0, opacity 0 to 1, 300ms, 80ms stagger)
- **Diagram/graph elements:** Draw-on animation (SVG stroke-dashoffset reveal left-to-right)
- **Data bars / progress bars:** Grow from 0% to value (600ms ease-out)
- **Table rows:** Stagger-reveal top-to-bottom (100ms delay per row)
- **Key numbers/metrics:** Count-up animation
- **Slide transition:** Cross-fade 400ms

---

## Slide-by-Slide Specification

---

### SLIDE 01 — Title Slide

**Layout:** Full-bleed dark background. Subtle hexagonal/circuit-trace pattern in dark red at 5% opacity. Centered layout.

**Content:**
- Small label top-left: `MSc Thesis · Inception Stage · Sep 2026` (secondary text, monospace)
- Main title (Syne 800, large): `RedGrid`
- Subtitle (Inter 500, 22px, cyan): `Dependency-Constrained UCB Exploration for Autonomous Penetration Testing`
- Thin horizontal line separator (2px, gradient red to cyan)
- Author names placeholder: `[Author Names]`
- `[University Name] · Department of Computer Science`
- Bottom-right badge (dark-red chip): `Early Stage — Inception Report`

**Animation:** Title "RedGrid" appears with glitch-text effect (character scramble then settle, 800ms). Subtitle fades in. Rest staggers.

**Speaker note:** "Good morning — today we present the inception stage of RedGrid, our 6-month thesis on autonomous penetration testing agents."

---

### SLIDE 02 — Motivation Hook

**Layout:** Full-bleed. Left 60%: bold text statement. Right 40%: dramatic visual.

**Content:**
- Left:
  - Small label: `WHY THIS MATTERS`
  - Headline (Syne, 36px): "Attackers move fast. Defenders move slow. Automated testers don't move at all."
  - Body: "Security vulnerabilities are found daily in web apps, APIs, and networks. Human pen testers are scarce and expensive. Automated scanners use fixed rule-sets — they can't reason, adapt, or chain exploits."
  - Callout box (amber border): "The question: Can an LLM agent carry out penetration testing autonomously — without step-by-step human direction?"
- Right: Stylized illustration — target with concentric circles, red cursor arrow, shield icons scattered. Clean, dark background.

**Animation:** Text lines stagger in. Callout box pulses gently after appearance.

---

### SLIDE 03 — Literature Scope

**Layout:** Clean grid of 11 paper cards, 4-column layout.

**Content:**
- Slide title: `The Literature We Surveyed`
- Sub-label: `11 papers · Focused reading · Sep 2026`
- 11 paper cards with: short-name in cyan, one-line descriptor in white, type icon, benchmark badge.

Paper list:
1. Fang et al. 2024a — Foundational: GPT-4 hacks websites
2. Fang et al. 2024b — GPT-4 exploits one-day CVEs (87%)
3. HPTSA (Zhu 2024) — Hierarchical multi-agent, zero-day CVEs
4. PentestGPT (Deng 2024) — Context-loss failure mode identified
5. VulnBot (Kong 2025) — Role-specialised multi-agent dispatch
6. CHECKMATE (Wang 2025) — Classical planning + LLM agents
7. Incalmo (Singer 2025) — Multi-host / Active Directory red team
8. PrediQL (Liu 2025) — GraphQL schema-aware LLM fuzzer
9. CVE-Bench (Zhu 2025) — 40 critical web CVEs, oracle-backed
10. PentestEval (Yang 2025) — Stage-level pipeline breakdown
11. Wang et al. 2025 — General LLM agent survey

**Animation:** Cards appear as wave (60ms stagger). On hover: card lifts with cyan border glow.

---

### SLIDE 04 — Dominant Survey Finding

**Layout:** Bold statement slide. Large headline, comparison table below.

**Content:**
- Small label: `WHAT THE LITERATURE AGREES ON`
- Main statement (Syne 800, 42px, centered): "Architecture, not model scale, is the dominant variable."
- Supporting sentence: "Six independent papers confirm: a well-structured pipeline with a cheap model beats an unstructured ReAct loop with a frontier model. — AWE, AutoPT, VulnBot, PentestGPT, D-CIPHER, Incalmo"
- 2-column comparison table:
  - Unstructured ReAct + GPT-4 (red-tinted) vs. Structured Pipeline + GPT-4o-mini (cyan-tinted)
  - Row 1: Depth-first tunnel vision | Broad, structured exploration
  - Row 2: Context loss in long sessions | Scoped per-invocation context
  - Row 3: No failure recovery | Retry / adapt / escalate loops
  - Row 4: Implicit planning | Explicit dependency modeling

**Animation:** Quote types in word-by-word. Table rows stagger in from left.

---

### SLIDE 05 — Failure Mode 1: Insufficient Exploration

**Layout:** Two-column. Left: text explanation. Right: animated bar chart.

**Content:**
- Slide title: `Failure Mode 1 — Insufficient Exploration`
- Left (50%):
  - Context label (amber): `CVE-Bench · 40 Critical Web CVEs (CVSS 9.0+)`
  - Headline: "Even the best agent exploits only 13% (one-day) / 10% (zero-day)."
  - Key insight box (left-bordered red): "The dominant failure is not reasoning quality — it's breadth of search. Agents commit early to a narrow attack path and never come back."
  - 3 icon bullets: 37.5%–80% failure rates · Not a smarter model problem · CVE-Bench Table 5 documents this

- Right (50%): Horizontal bar chart — exploration failure rates:
  - T-Agent (0-day): 80.0%
  - AutoGPT (0-day): 72.5%
  - Cy-Agent (0-day): 67.5%
  - T-Agent (1-day): 55.0%
  - AutoGPT (1-day): 45.0%
  - Cy-Agent (1-day): 37.5%
  - Red bars. Background line at 50% as "danger threshold".
  - Caption: `Source: CVE-Bench (Zhu et al. 2025), Table 5`

**Animation:** Bars grow left-to-right (600ms ease-out), numbers count up.

---

### SLIDE 06 — Failure Mode 2: Dependency-Reasoning Gap

**Layout:** Two-column. Left: waterfall chart. Right: explanation.

**Content:**
- Slide title: `Failure Mode 2 — The Dependency-Reasoning Gap`
- Left (50%): Waterfall step-up bar chart — PentestEval GT injection ablation:
  - SMP Baseline: 0.31
  - + GT Weakness Gathering (WG): 0.50 (+0.19)
  - + GT Weakness Filtering (WF): 0.53 (+0.03)
  - + GT Attack Decision-Making (ADM): 0.67 (+0.14 — amber, starred "Largest single-stage gain")
  - Caption: `Source: PentestEval (Yang et al. 2025)`

- Right (50%):
  - Context label (amber): `PentestEval · 12 Real-World Scenarios · 346 Tasks`
  - Headline: "Attack Decision-Making (ADM) is the single weakest stage — Spearman rho = 0.25."
  - Explanation of ADM.
  - Callout box (cyan border): "Ground-truth ADM injection adds +0.14 on top of already-perfect weakness discovery — the largest marginal gain available. No existing system closes it."
  - Note: "Any system-grown dependency structure has a realistic ceiling below 0.67"

**Animation:** Waterfall bars cascade (300ms each). The +0.14 bar glows amber on entry.

---

### SLIDE 07 — The Two-Sided Gap

**Layout:** Full-width split diagram.

**Content:**
- Slide title: `The Gap No System Has Closed`
- Horizontal split diagram (70% of slide height):
  - Left — Wide Exploration: HPTSA, VulnBot, T-Agent, AutoGPT
    - Check: Finds many candidate weaknesses
    - Cross: No prerequisite/dependency model
    - Cross: Flat task dispatch
  - Center — "UNEXPLORED TERRITORY — The compound gap" (dim amber highlight)
  - Right — Dependency Reasoning: CHECKMATE, PentestEval SMP
    - Check: Explicit prerequisite modeling
    - Cross: Requires pre-enumerated weakness sets
    - Cross: Does not scale to open-ended discovery

- Bottom (amber): "No system combines open-ended exploration WITH dynamic dependency-aware planning. RedGrid investigates this combination."

**Animation:** Left slides from left, right from right, center fades in last with pulse. Bottom sentence types character-by-character.

---

### SLIDE 08 — Comparative Analysis Table

**Layout:** Full-width clean data table.

**Content:**
- Slide title: `Prior System Comparison`
- Sub-label: `Four dimensions that matter most`
- Table (5 columns): System | Architecture | Dependency Modeling | Cross-Session Memory | Benchmark

Rows:
- Fang et al. 2024 | Single agent (ReAct) | None | None | 15 CVEs
- HPTSA | Hierarchical planner+tasks | Flat dispatch | None | 14 zero-day CVEs
- PentestGPT | Split reasoning/parsing | Implicit (LLM only) | None | HTB/VulnHub
- VulnBot | Multi-agent, role-specialised | Flat dispatch | None | HTB-style
- CHECKMATE | Agent + classical planner | Explicit, pre-enumerated | None | Curated only
- Incalmo | Multi-host orchestration | Partial (host/cred) | None | MHBench (40)
- PrediQL | LLM-guided fuzzer | Schema-derived | None | 6 GraphQL APIs
- RedGrid (proposed) | 4-layer multi-agent | Dynamic VDG | 3-tier memory | Web+GraphQL+Multi-host

- Cell styling: None = red-tinted. Explicit/Dynamic/3-tier = green-tinted. Partial/Implicit = amber-tinted.
- RedGrid row: subtle cyan background.
- Caption: `Preliminary reading — 11-paper focused review`

**Animation:** Header fades, rows stagger top-to-bottom. RedGrid row enters with glow.

---

### SLIDE 09 — Research Gap Statement

**Layout:** Statement slide. Bold typography. Left-accent bar.

**Content:**
- Slide title: `Research Gap`
- Left-bordered callout (4px red border, Syne 700, 26px):
  "The reviewed literature does not contain a system that combines:
  (1) broad, open-ended exploration of an unfamiliar attack surface
  (2) with an explicit, dynamically constructed dependency model
  (3) evaluated across more than one benchmarked attack-surface family."

- Three equal columns below:
  - Exploration gap: "CVE-Bench: insufficient exploration = dominant failure (37–80%)"
  - Planning gap: "PentestEval: ADM is weakest stage, Spearman rho = 0.25"
  - Coverage gap: "Every prior system evaluated on ONE surface only"

- Bottom italic (amber): "This is the gap RedGrid is designed to investigate."
- Footnote: "Working hypothesis at early thesis stage — not a finalized claim"

**Animation:** Quote box draws in with left-to-right clip-path reveal. Columns stagger. Amber line types last.

---

### SLIDE 10 — Introducing RedGrid

**Layout:** Split — left: name + tagline + thesis direction. Right: conceptual VDG diagram.

**Content:**
- Slide title: `Introducing RedGrid`
- Left (50%):
  - Project name: `RedGrid` (Syne 800, 52px, gradient red to cyan)
  - Tagline: `Dependency-Constrained UCB Exploration for Autonomous Penetration Testing`
  - Three thesis directions:
    - VDG: Model vulnerabilities as a graph with prerequisite edges, not a flat list
    - UCB: Guide exploration with Upper Confidence Bound over dependency-constrained frontier
    - Memory: Retain and reuse strategies across missions
  - Honest note chip (amber): "Early stage — direction under active investigation"

- Right (50%): Conceptual VDG mini-diagram:
  - DAG nodes: SQLi → Auth Bypass → RCE; XSS → Auth Bypass
  - Colors: SQLi=green (ELIGIBLE), Auth Bypass=amber (IN_PROGRESS), RCE=dim (BLOCKED)
  - UCB score labels on each node
  - Label: `Vulnerability Dependency Graph (VDG) — conceptual`
  - Cursor arrow pointing to highest UCB node

**Animation:** Graph draws node by node, edges animate as growing lines. Score labels count up.

---

### SLIDE 11 — Research Objectives

**Layout:** Clean numbered list. Two-column grid.

**Content:**
- Slide title: `Research Objectives`
- Sub-label: `5 working goals — under active investigation`

1. VDG Formalization — Investigate whether a prerequisite-edge graph improves agent exploration over a flat priority list
2. Dual-Layer World Model — Separate confirmed facts from inferred hypotheses for independent ablation
3. Multi-Layer Orchestration — Design a four-layer agent hierarchy matching strongest surveyed systems
4. Cross-Mission Memory — Determine whether strategy reuse offers measurable benefit vs. negative-transfer risk
5. Benchmark-Grounded Evaluation — Evaluate on oracle-backed benchmarks across 3+ attack surfaces

- Bottom note: "These reflect the research direction at inception stage. Scope will evolve with implementation."

**Animation:** Cards stagger in (120ms delay). Icon first, then label, then description.

---

### SLIDE 12 — Expected Contributions (3 Claims)

**Layout:** Three equal cards, full-width horizontal.

**Content:**
- Slide title: `Expected Contributions`
- Sub-label (amber): `Working hypotheses — not yet results`

- Card C1 (red accent border):
  - C1 — Primary: Dependency-Aware Attack Graph Exploration
  - "Combining UCB exploration with a dynamically grown prerequisite graph improves attack-path success over flat dispatch and pre-enumerated dependency planning."
  - Gate (amber chip): "Ablation (d) > (c) on CVE-Bench + PentestEval"
  - Target metrics: "CVE-Bench zero-day pass@1 >= 25% · PentestEval ADM >= 0.50"

- Card C2 (cyan accent border):
  - C2 — Supporting: Cross-Mission Memory + Skill Promotion
  - "3-tier memory with security-specific conditional branching strategies and oracle-gated skill promotion improves performance on seen-technology targets."
  - Gate: "Ablation A2 shows measurable improvement on seen-technology subset"

- Card C3 (green accent border):
  - C3 — Methodological: Cross-Benchmark Evaluation
  - "First rigorous evaluation of a single VAPT architecture across CVE-Bench (web), PrediQL (GraphQL), and MHBench (multi-host) with standardized oracles."
  - Gate: "Holds by construction — requires completing all benchmark tiers"

- Note (secondary): "At this stage: direction, not result. Implementation begins next."

**Animation:** Cards slide up (150ms stagger). Validation chips pop in last.

---

### SLIDE 13 — System Architecture Overview

**Layout:** Full-slide architecture diagram. Minimal text. Diagram-first.

**Content:**
- Slide title: `RedGrid Architecture — Overview`
- Sub-label: `4-layer hierarchy · Under development`

- 4-layer horizontal stack diagram (80% of slide height):

  LAYER 1 — Orchestrator (Mission Planner) [dark red band]
    Components: Scope Intake · Auto-prompter · FullCompact Trigger (at 85% context)

  LAYER 2 — Team Manager [dark cyan band]
    Components: VDG/Attack Decision-Making · Declarative Dispatch · Handoff Bridge

  [Left vertical panel: Dual-Layer World Model]
    EL (Environmental Layer — confirmed facts only) <-> VDG/AL (Attack Layer — scored hypotheses only)

  LAYER 3 — Specialist Agents [dark amber band]
    Specialists: Recon · SQLi · XSS · GraphQL · Auth/Session · Lateral-Movement

  LAYER 4 — Execution and Validation [dark green band]
    Components: Execution Agent · Evaluation Agent · Validation Agent (Diagnosis-Adapt-Cap loop)

  [Bottom dashed bar: Cross-cutting Memory Services]
    Skill Library · 3-Tier FAISS Memory (Vuln-Pattern / Strategy / Technical-Action) · Episodic Failure Memory

- Bidirectional arrows between layers. Small icons for each specialist.
- Bottom note: "Full formalized pseudocode specified in architecture document"

**Animation:** Layers reveal top-to-bottom (250ms each, 200ms stagger). Arrows appear after. Memory bar fades in last.

---

### SLIDE 14 — The VDG Algorithm (Core Idea)

**Layout:** Left: pseudocode formula. Right: animated graph example.

**Content:**
- Slide title: `The VDG Algorithm — Core Idea`
- Sub-label: `Dependency-Constrained UCB Selection`

- Left column (50%) — Code block (JetBrains Mono):
```
UCB_score(v) =
    (w_v / n_v)           <- exploitation
  + C * sqrt(ln N / n_v)  <- exploration bonus
  + alpha * phi_v         <- LLM promise score
  + gamma * (E_ord / 5)   <- ordinal evidence
  - kappa * context_load  <- cost penalty
  + lambda * epss_prior   <- CVE prior

Selection rule:
eligible = {v | status==ELIGIBLE
             AND all prerequisites EXPLOITED}
selected = argmax UCB_score(eligible)
```
  Legend: "phi = LLM-assessed exploitability · E_ord = calibrated evidence scale 0–5"

- Right column (50%) — 5-node VDG example:
  - Node A: SQLi — UCB=2.31 — ELIGIBLE — Selected (pulsing glow ring)
  - Node B: XSS — UCB=1.87 — ELIGIBLE
  - Node C: AuthBypass — UCB=2.10 — BLOCKED (prereq: A)
  - Node D: SSRF — UCB=0.94 — ELIGIBLE
  - Node E: RCE — UCB=3.40 — BLOCKED (prereq: C)
  Nodes as colored circles. ELIGIBLE = green outline. BLOCKED = dim red dashed outline.

- Bottom callout (amber border): "Unlike flat UCB, only ELIGIBLE nodes are considered — nodes blocked by unmet prerequisites are invisible to selection until their dependencies are satisfied."

**Animation:** Formula line by line. Nodes draw one by one. Selected node gets glow pulse.

---

### SLIDE 15 — Methodology Overview (Sketch)

**Layout:** Visual pipeline/flowchart. Honest about incompleteness.

**Content:**
- Slide title: `Methodology — High-Level Overview`
- Sub-label chip (amber): "Planned — implementation not yet started"

- Horizontal flowchart (8 rounded boxes, left to right):
  1. Scope Intake — Target, rules of engagement, mode, surface family
  2. Recon — nmap -p-, WhatWeb, ZAP passive, ffuf; seeds Environmental Layer (EL)
  3. VDG Seed — Team Manager infers initial nodes from EL; assigns UCB scores
  4. UCB Selection — Picks highest-scoring eligible node (prerequisites satisfied)
  5. Specialist Dispatch — Fresh-context specialist runs deterministic FSM; writes to EL
  6. Evaluate and Validate — E_ord scoring; oracle check; Diagnosis-Adapt-Cap loop
  7. VDG Update — Update UCB reward, propagate status, check termination
  8. Repeat or Terminate — Dual-termination condition check

  Box styling: solid outline = design complete, dashed = design in progress.

- Two key design decisions (cards below):
  - Fresh context per Specialist: Prevents context pollution (validated by PentestGPT, D-CIPHER, VulnBot)
  - Dual-Layer World Model: EL (confirmed facts) strictly separated from VDG (attack hypotheses)

**Animation:** Boxes appear left-to-right (200ms stagger). Arrows draw sequentially.

---

### SLIDE 16 — Evaluation Plan

**Layout:** Three attack surface cards + methodological principles.

**Content:**
- Slide title: `Evaluation Plan — Benchmark Suite`
- Sub-label chip (amber): "Planned — no results yet"

- Three equal cards:

  Web Application:
    Primary: CVE-Bench (40 critical CVEs, CVSS 9.0+)
    Also: HPTSA 14-CVE zero-day suite · PentestEval 346 tasks · BountyBench (25 real production systems)
    Oracle: 8-attack-type (DoS, File Access, DB Modification, SSRF, etc.)
    Target: zero-day pass@1 >= 25% · one-day pass@1 >= 50%
    Vuln types: SQLi · XSS · CSRF · SSRF · SSTI · LFI · RCE · IDOR

  GraphQL APIs:
    Primary: PrediQL (6 APIs)
    Baselines: ZAP · Burp Suite · EvoMaster · GraphQLer
    Target: Schema coverage % · Vulnerability count vs. baselines
    Vuln types: Schema abuse · Dependency-chain injection · IDOR · Auth bypass

  Multi-Host / Active Directory:
    Primary: Incalmo MHBench (40 environments)
    Baseline: Incalmo (37/40 floor)
    Target: Host-compromise success rate
    Vuln types: Lateral movement · Credential reuse · Privilege escalation

- Methodological principles:
  - All baselines re-run under same model + compute budget (not copied from papers)
  - McNemar's test · 95% Wilson CI · 10 runs on primary metric (CVE-Bench)
  - Cost-per-exploit reported alongside every pass rate

**Animation:** Surface cards slide up. Target metrics count up. Bullets stagger.

---

### SLIDE 17 — Project Timeline and Status

**Layout:** Gantt-style horizontal timeline.

**Content:**
- Slide title: `Project Timeline`
- Sub-label: `6-month thesis program · Started Sep 2026`

- Horizontal timeline (Sep 2026 to Mar 2027):
  Sep 2026 [GREEN SOLID]: Literature Review (DONE) + Architecture Design (DONE)
  Oct–Nov 2026 [AMBER STRIPED]: VDG Implementation + Pilot Study (PentestEval GT edge inference)
  Dec–Jan 2027 [DARK OUTLINED]: Evaluation Runs (CVE-Bench + PentestEval + PrediQL + MHBench)
  Feb–Mar 2027 [DARK OUTLINED]: Thesis Writing + Final Submission

- Milestone flags:
  M1 (Oct 2026): Pilot study result — edge inference precision gate (>= 50% required)
  M2 (Dec 2026): CVE-Bench preliminary run
  M3 (Mar 2027): Final evaluation complete

- Status chips:
  Complete (green): Literature review · Architecture specification · Inception report
  Next (amber): VDG prototype · Pilot study
  Planned (grey): Benchmark runs · Ablations · Thesis writing

**Animation:** Timeline fills left-to-right. Milestone flags pop in. Status chips fade in at bottom.

---

### SLIDE 18 — Known Challenges and Risks

**Layout:** 2x2 grid of risk cards.

**Content:**
- Slide title: `Known Challenges`
- Sub-label: `Surfaced during literature review — addressed proactively`

- Risk 1 (red border, HIGH RISK): Edge Inference Without Ground Truth
  "VDG prerequisite edges are LLM-inferred. Noise weakens the dependency contribution."
  Mitigation: "Mandatory pilot study on PentestEval GT dependencies. Precision >= 50% gate before C1 claim."

- Risk 2 (amber border, MEDIUM RISK): Sandbox vs. Real World Gap
  "Fang et al.: 1 exploitable XSS in 50 real sites (2%) vs. 73.3% in sandbox. WAFs inflate numbers."
  Mitigation: "Report sandbox and real-world (BountyBench, HTB Season 8) separately."

- Risk 3 (amber border, MEDIUM RISK): Negative Transfer in Memory
  "A strategy for Framework A v1 could be harmful against v2. No surveyed paper addresses this."
  Mitigation: "Negative transfer guard in skill promotion. Ablation A2 split: seen vs. unseen technology."

- Risk 4 (cyan border, MANAGEABLE): UCB Hyperparameter Sensitivity
  "7 tunable parameters. Narrow optimal range may not generalize."
  Mitigation: "Grid search on Tier 1 (PentestEval). Report +/-10% perturbation sensitivity."

**Animation:** Cards appear 2x2 with 150ms stagger. Risk level badge pops in with color flash.

---

### SLIDE 19 — Summary

**Layout:** Two-column recap. Bold closing statement.

**Content:**
- Slide title: `What We Have Accomplished (Inception Stage)`

- Left (What's Done):
  - Systematic review of 11 papers
  - Two failure modes identified with quantitative evidence
  - Research gap formalized
  - Three contribution hypotheses (C1, C2, C3) with validation gates
  - Architecture specified at implementation level
  - Full evaluation plan: 7-tier benchmark suite, ablation design
  - Inception report submitted

- Right (What's Next):
  - VDG prototype implementation
  - Pilot study — edge inference precision on PentestEval GT
  - Full CVE-Bench + PentestEval evaluation runs
  - GraphQL and multi-host evaluation
  - Ablation studies (A1–A8)
  - Thesis writing and final submission

- Bottom centered (Syne 700, 26px, white):
  "The gap is identified. The direction is set. RedGrid investigates whether dependency-aware exploration can make autonomous penetration testing meaningfully better."

**Animation:** Checklist items appear with checkmark-draw SVG animation. Closing statement fades in last.

---

### SLIDE 20 — Thank You / Q and A

**Layout:** Full-bleed. Centered. Minimal.

**Content:**
- Background: Dark charcoal + subtle hex/circuit trace pattern (8% opacity)
- Center top: `RedGrid` (large gradient text, red to cyan)
- Center: `Thank You` (large, white)
- Sub-line (cyan): `Questions welcome`
- Thin separator (gradient red to cyan)
- Two columns for Q&A reference:

  Key Numbers:
    11 papers surveyed
    3 contribution hypotheses
    4 architecture layers
    3 benchmarked attack surfaces
    40 critical CVEs (primary benchmark)
    7 UCB hyperparameters

  Key Terms:
    VDG — Vulnerability Dependency Graph
    UCB — Upper Confidence Bound (exploration strategy)
    EL — Environmental Layer (confirmed facts only)
    ADM — Attack Decision-Making (PentestEval stage)
    E_ord — Ordinal evidence confidence score (0–5)
    FullCompact — Context reconstruction from EL+AL at 85% utilization

- Bottom-left: `[Author Names] · [University] · Sep 2026`
- Bottom-right: `Target venue: USENIX Security / IEEE S&P`

**Animation:** "Thank You" scale-up (0.95 to 1.0). Numbers count up. Terms stagger in.

---

## Global Slide Requirements

1. **Slide numbers:** Bottom-right corner, format `XX / 20`, secondary text color.
2. **Progress bar:** 2px top-of-slide bar (red to cyan gradient), filled proportionally. Animates on transition.
3. **Navigation:** Left/right arrow keys; swipe on touch devices.
4. **Speaker mode:** Speaker notes visible only in presenter view.
5. **Watermark:** Small `RedGrid` wordmark bottom-left on all slides except title and Q&A.
6. **Crowding rule:** Split into two slides rather than shrinking font if content feels tight.
7. **Accessibility:** All text must maintain WCAG AA contrast against dark background.
8. **Export format:** HTML (reveal.js or equivalent) with PDF export option.

---

## Reference Data for Accuracy

Use these exact numbers. Do not fabricate or round differently.

| Metric | Value | Source |
|---|---|---|
| CVE-Bench best one-day pass rate | 13% | CVE-Bench (Zhu 2025) |
| CVE-Bench best zero-day pass rate | 10% | CVE-Bench (Zhu 2025) |
| T-Agent zero-day exploration failure | 80.0% | CVE-Bench Table 5 |
| AutoGPT zero-day exploration failure | 72.5% | CVE-Bench Table 5 |
| Cy-Agent zero-day exploration failure | 67.5% | CVE-Bench Table 5 |
| T-Agent one-day exploration failure | 55.0% | CVE-Bench Table 5 |
| AutoGPT one-day exploration failure | 45.0% | CVE-Bench Table 5 |
| Cy-Agent one-day exploration failure | 37.5% | CVE-Bench Table 5 |
| SMP baseline (PentestEval) | 0.31 | PentestEval (Yang 2025) |
| + GT Weakness Gathering | 0.50 (+0.19) | PentestEval (Yang 2025) |
| + GT Weakness Filtering | 0.53 (+0.03) | PentestEval (Yang 2025) |
| + GT Attack Decision-Making | 0.67 (+0.14) | PentestEval (Yang 2025) |
| ADM Spearman rho | 0.25 | PentestEval (Yang 2025) |
| HPTSA zero-day pass rate | ~42% pass@5 | Zhu 2024 |
| GPT-4 one-day with CVE hint | 87% | Fang 2024b |
| GPT-4 one-day without CVE hint | 7% | Fang 2024b |
| Real-world XSS exploit rate | 2% (1 out of 50) | Fang 2024a |
| Sandbox XSS exploit rate | 73.3% | Fang 2024a |
| MHBench environments | 40 | Incalmo (Singer 2025) |
| Incalmo success floor | 37 out of 40 | Incalmo (Singer 2025) |
| PrediQL GraphQL APIs | 6 | PrediQL (Liu 2025) |

---

## Tone and Voice Guidelines

- **Confident but honest:** Implementation has not started. Say so clearly. But the direction is well-reasoned and evidence-backed.
- **Research-grade:** Use precise vocabulary from the papers. Never over-claim.
- **Engaging:** Short sentences. Active voice. Data-driven. No filler.
- **Visual-first:** Every number should ideally be a chart, not a sentence.
- **Time-aware:** 10-minute slot. Audiences should follow without reading dense text.

---

*End of master prompt. Provide this entire file to your slide generation AI agent. The agent should generate all 20 slides as specified, including all animations, color codes, typography, layout details, and reference data.*
