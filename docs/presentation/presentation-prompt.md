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


### SLIDE 12 — Expected Contributions

**Layout:** Three equal cards, full-width horizontal. Clean and simple — no technical jargon.

**Content:**
- Slide title: `Expected Contributions`
- Sub-label (amber chip): `Directions under investigation — not yet results`

- Card C1 (red accent border):
  - Label: `C1 — Primary`
  - Icon: graph with prerequisite arrows
  - Title: `Smarter Exploration`
  - 1-line: "Can modeling vulnerabilities as a graph — with explicit prerequisites — help an agent explore more intelligently?"

- Card C2 (cyan accent border):
  - Label: `C2 — Supporting`
  - Icon: memory/brain chip
  - Title: `Learning Across Missions`
  - 1-line: "Can an agent carry forward what it learned in past engagements to perform better on similar targets?"

- Card C3 (green accent border):
  - Label: `C3 — Methodological`
  - Icon: three overlapping target circles (web, API, network)
  - Title: `Consistent Evaluation`
  - 1-line: "Can a single architecture be tested fairly across web, GraphQL, and multi-host surfaces using standardized oracles?"

- Honest note at bottom (italic, secondary text): "These are research questions. Answers come from experiments — not from this report."

**Animation:** Cards slide up with 150ms stagger. Bottom note fades in last.

---

### SLIDE 13 — Our Proposed Approach

**Layout:** One large conceptual 3-part visual. Bold, simple, no technical detail.

**Content:**
- Slide title: `RedGrid — The Core Idea`
- Sub-label (amber chip): `Conceptual sketch — implementation begins next`

- Central visual: 3 connected boxes (horizontal flow):

  Box 1 [red]:
  Icon: magnifying glass over a network
  Label: `Explore Broadly`
  "Search the full attack surface — don't commit to one path early."

  Center arrow labeled: `guided by`

  Box 2 [cyan, larger — center]:
  Icon: a small directed graph (3 nodes, 2 arrows)
  Label: `Dependency Graph`
  "Model which vulnerabilities depend on which — pick the smartest next step."

  Arrow: `feeds into`

  Box 3 [amber]:
  Icon: brain / memory icon
  Label: `Remember and Reuse`
  "Carry forward what worked across past missions."

- Below the visual, one bold sentence (Syne 700, 24px, white):
  "RedGrid asks: does connecting exploration + dependency reasoning + memory make autonomous pen testing meaningfully better?"

- Footnote (secondary, italic): `All three are open research questions`

**Animation:** Three boxes appear simultaneously with fade+scale. Arrow labels draw after. Bold sentence fades in last.

---

### SLIDE 14 — Architecture — A Simple View

**Layout:** Simple 4-layer visual stack. One plain-English label per layer. No component names.

**Content:**
- Slide title: `Architecture — A Rough Sketch`
- Sub-label (amber chip): `High-level only — details being designed`

- 4-layer colored stack (think: a layered cake, top to bottom, each band roughly equal height):

  Layer 1 [dark red band, top]:
  Label: `Mission Planner`
  "Takes in the target. Starts the scan. Stays in control."

  Layer 2 [dark cyan band]:
  Label: `Decision-Maker`
  "Decides what to attack next — using the dependency graph."

  Layer 3 [dark amber band]:
  Label: `Specialist Agents`
  "Web, GraphQL, Network — each focused on one attack type."

  Layer 4 [dark green band, bottom]:
  Label: `Execute and Validate`
  "Runs the attack. Checks if it worked."

- Left side panel (narrow, dark blue border):
  Label: `World Model`
  "What we know (confirmed facts) vs. what we think (attack hypotheses) — kept strictly separate."

- Bottom bar (dashed):
  Label: `Memory`
  "Remembers strategies and failures. Reuses what worked."

- NO component-level names (no FullCompact, no FAISS, no E_ord, no Handoff Bridge)
- Each band: one icon + one plain-English sentence only
- Honest callout (amber border, bottom): "This is a design direction, not a built system. Implementation begins next."

**Animation:** Layers reveal top-to-bottom (250ms stagger). Side panel fades in after. Memory bar slides up last.

---

### SLIDE 15 — Methodology — The Basic Loop

**Layout:** Simple circular 4-step process diagram. Nothing more.

**Content:**
- Slide title: `How RedGrid Will Work`
- Sub-label (amber chip): `Planned — not yet implemented`

- A circular 4-step loop (clockwise, large, centered):

  Step 1 [red, top]: `Recon`
  "Scan the target. Build a picture of what's there."

  Step 2 [cyan, right]: `Plan`
  "Decide what to attack next — using the dependency graph."

  Step 3 [amber, bottom]: `Attack`
  "Send in a specialist agent. Run the attempt."

  Step 4 [green, left]: `Learn`
  "Did it work? Update the graph. Store the lesson. Repeat."

  Center label (small): `VDG drives the loop`

- Below: 2 plain design principles (icon + one sentence each):
  - Each attack attempt runs with a clean slate — no leftover noise from previous steps
  - Facts (what the agent confirmed) are kept separate from guesses (what it thinks might work)

**Animation:** Loop steps draw clockwise (300ms each). Center label fades in after. Design principles stagger in below.

---

### SLIDE 16 — Where We Will Test

**Layout:** Three clean cards — one per attack surface. Simple. No metric targets.

**Content:**
- Slide title: `Evaluation — Three Attack Surfaces`
- Sub-label (amber chip): `Planned — no results yet`

- Three equal surface cards (horizontal):

  Card 1 [web icon, red border]:
  Surface: `Web Applications`
  Benchmark: CVE-Bench — 40 real critical CVEs
  Question: "Can the agent find and exploit web vulnerabilities without a hint?"

  Card 2 [API icon, cyan border]:
  Surface: `GraphQL APIs`
  Benchmark: PrediQL — 6 real GraphQL APIs
  Question: "Can the agent abuse API schemas and find injection points?"

  Card 3 [network icon, amber border]:
  Surface: `Multi-Host Networks`
  Benchmark: MHBench — 40 multi-host environments
  Question: "Can the agent move laterally across hosts and escalate privileges?"

- Bottom guiding principle (amber italic): "We only test on attack surfaces that already have a published, oracle-backed benchmark. No custom benchmarks."

**Animation:** Cards slide up with 150ms stagger. Bottom principle fades in last.

---

### SLIDE 17 — Project Timeline

**Layout:** Simple horizontal timeline. 4 phases, color-coded by status.

**Content:**
- Slide title: `Project Timeline`
- Sub-label: `6-month thesis program · Sep 2026 — Mar 2027`

- Timeline (4 phases, left to right):

  Phase 1 [GREEN solid bar]: Sep 2026
  "Literature Review + Architecture Design"
  Badge: DONE

  Phase 2 [AMBER striped bar]: Oct–Nov 2026
  "Build + Early Testing"
  Badge: UP NEXT

  Phase 3 [DARK outlined bar]: Dec–Jan 2027
  "Run Experiments"
  Badge: PLANNED

  Phase 4 [DARK outlined bar]: Feb–Mar 2027
  "Write + Submit"
  Badge: PLANNED

- 3 status chips below timeline:
  - Green: Complete — Literature review · Inception report
  - Amber: Next — System build · Early tests
  - Grey: Planned — Full experiments · Thesis writing

**Animation:** Timeline fills left-to-right. Phase labels drop in. Status chips fade in at bottom.

---

### SLIDE 18 — Challenges We Already See

**Layout:** 2x2 grid of simple challenge cards. One title + one plain-English sentence each. No mitigation detail.

**Content:**
- Slide title: `Challenges We Are Aware Of`
- Sub-label: `Honest about the hard parts from day one`

- 4 cards (2x2):

  Card 1 (red border):
  Icon: question mark over a graph
  Title: `Inferring Dependencies Is Hard`
  "Building the prerequisite graph using an LLM — not human annotation — will be noisy. We need to measure how noisy before relying on it."

  Card 2 (amber border):
  Icon: lab flask vs. real globe
  Title: `Sandbox vs. Real World`
  "What works on a controlled benchmark may not hold on a real-world target. We'll test both and report the gap honestly."

  Card 3 (amber border):
  Icon: memory chip with warning triangle
  Title: `Memory Could Backfire`
  "A strategy that worked against software version 1 might be harmful against version 2. This needs a safety mechanism."

  Card 4 (cyan border):
  Icon: tuning sliders
  Title: `Tuning Is Tricky`
  "The approach has parameters to adjust. Results must not depend on a single lucky configuration."

**Animation:** Cards appear 2x2 with 150ms stagger. Icons animate first, then text.

---

### SLIDE 19 — Where We Are

**Layout:** Two-column status. Bold closing statement.

**Content:**
- Slide title: `Where We Are`

- Left column — Done (green checkmarks):
  - Read and synthesised 11 papers on autonomous VAPT
  - Identified 2 quantified failure modes
  - Formalized the research gap
  - Proposed 3 research directions (not results)
  - Sketched the architecture approach
  - Submitted inception report

- Right column — What's coming (forward arrows, amber):
  - Build the prototype
  - Early experiments to test the ideas
  - Full benchmark evaluation (web, GraphQL, multi-host)
  - Refine based on what we find
  - Write the thesis

- Bottom centered (Syne 700, 26px, white):
  "The gap is identified. The direction is set. Now — we go build it."

**Animation:** Left items appear with checkmark-draw animation. Right items stagger in. Closing statement fades in last.

---

### SLIDE 20 — Thank You

**Layout:** Full-bleed. Centered. Minimal.

**Content:**
- Background: Dark charcoal + subtle hex/circuit trace (8% opacity)
- Center top: `RedGrid` (large gradient text, red to cyan)
- Center: `Thank You` (large, white, Syne 800)
- Sub-line (cyan): `Questions welcome`
- Thin separator (gradient red to cyan)
- Below separator — two small columns:

  Key Numbers:
    11 papers surveyed
    3 contribution directions
    3 attack surfaces tested
    40 critical CVEs (primary benchmark)

  Key Terms (plain English):
    VDG — the dependency graph we plan to build
    UCB — how the agent decides what to try next
    ADM — the weakest stage in all current systems
    RedGrid — our system (not yet built)

- Bottom-left: `[Author Names] · [University] · Sep 2026`

**Animation:** "Thank You" fades in with soft scale-up. Numbers count up. Terms stagger in.

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

- **Confident but honest:** Implementation has not started. Say so clearly. The direction is evidence-backed but results are not in hand.
- **Surface-level for slides 12–20:** No pseudocode, no formula details, no ablation terminology, no layer-by-layer component names. Plain English only.
- **Deep for slides 1–11:** Chapter 1 and Chapter 2 content (problem, literature, gap analysis) should be precise, data-driven, and well-evidenced with exact numbers.
- **Engaging:** Short sentences. Active voice. Data-driven. No padding.
- **Visual-first:** Every number should be a chart, not a sentence.
- **Time-aware:** 10-minute slot. Audiences follow without reading dense text.

---

*End of master prompt. Provide this entire file to your slide generation AI agent.*
