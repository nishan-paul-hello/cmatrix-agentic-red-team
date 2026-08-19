# CMatrix UI/UX Image-Generation Prompt

**Purpose of this document:** this is a direct prompt for an AI image-generation agent. It is not architecture documentation — it is generation instructions. The agent should read Section A–C once as global context, then generate one image per row of the **Image Manifest** in Section D, applying the global rules to every image.

---

## ROLE

You are generating UI screenshot mockups for **CMatrix**, an autonomous VAPT (Vulnerability Assessment & Penetration Testing) orchestration console. Every image you produce is a screenshot of the *same* web application — a professional, dark, research-grade security operations console. Visual consistency across all generated images is mandatory: same fonts, same colors, same component shapes, same sidebar, same top bar, on every image unless a row says otherwise.

Do not invent new research mechanisms, terminology, or metrics beyond what's specified below — only translate the described states into pixels.

---

## A. Global Design System (apply to every image)

### A1. Color palette (use these exact hex values)

| Role | Hex |
|---|---|
| Background (darkest) | `#080808` |
| Background (base) | `#0D0D0D` |
| Background (raised) | `#111111` |
| Surface | `#151515`, `#191919`, `#1E1E1E` |
| Border | `#292929`, `#333333` |
| Primary red | `#E31B23` |
| Bright red (active/animated) | `#FF2A32` |
| Deep red | `#9E1118` |
| Muted red | `#6F171B` |
| Primary text | `#F2F2F2` |
| Secondary text | `#A0A0A0` |
| Muted text | `#666666` |
| Success | `#3FB950` |
| Warning | `#D29922` |
| Error/Critical | `#FF2A32` |
| Info | `#8B8B8B` |
| Neutral | `#666666` |

Red is an **accent**, used sparingly on status, active states, and critical numbers — never as a background wash. Semantic colors (success/warning/info) appear only where a real status is being shown.

### A2. Typography

Monospace only, everywhere — including headings. Preferred: **JetBrains Mono** (fallback: IBM Plex Mono, Roboto Mono).

| Element | Size / weight |
|---|---|
| Application title | 24–28px, bold |
| Page title | 20–24px, bold |
| Section heading | 14–16px, semibold |
| Component heading | 12–14px, semibold |
| Body text | 12–13px |
| Metadata | 10–11px |
| Terminal/log text | 11–12px |

### A3. Global application shell (present on every authenticated-page image unless the row says "no shell")

- **Left sidebar**, 240–260px wide, background `#0B0B0B`. Top of sidebar reads `CMATRIX` / `AUTONOMOUS VAPT` with a simple geometric logo mark and a thin red accent line beside it. Below that, grouped nav items separated by thin horizontal rules, grouped as: OPERATIONS (Dashboard, Missions, Attack Graph, Environment, Specialists, Execution, Findings, Validation), KNOWLEDGE (Memory, Skill Library, Failure Memory), RESEARCH (Trajectory, Benchmarks, Ablations, Statistics, Failure Analysis, Reports), SYSTEM (Cost & Usage, Audit Log, Settings). The active nav item has a dark-red background fill, a thin red left border, white text, and a red icon.
- **Top bar**: left shows current mission id (e.g. `MISSION / CVE-001`); center-right shows a green/red status dot with `SYSTEM ONLINE`, then `MISSION STATUS`, `MODEL`, `COST`, `TIME`; far right shows a user avatar icon and a gear/settings icon. Keep it compact — a single thin row.
- **Mission status strip** (only on mission-scoped screens, directly below the top bar): mission id, target, mode, surface, then a metrics row — VDG NODES, EL FACTS, FINDINGS, COST, TIME.

### A4. Shape and surface language

Thin 1px borders, minimal corner rounding (2–4px max), no shadows beyond a barely-visible 1px depth cue, no gradients, no glassmorphism, no glow. Cards are flat rectangles with a thin border and a subtle surface-color fill against the darker page background. Tables are dense, monospace, right-aligned numeric columns. Status is always shown as a small text badge or colored dot — never a large colorful chip.

---

## B. Core UX Principles (must be visually legible in the relevant screens)

1. **Reality vs. hypothesis are never visually mixed.** The Environmental Layer (confirmed facts — labels like CONFIRMED, OBSERVED, DISCOVERED, EVIDENCE) and the VDG/Attack Layer (hypotheses — labels like HYPOTHESIS, CANDIDATE, ELIGIBLE, DEPENDENCY, UCB, PATH) must always read as two distinct visual worlds — different panel, different framing, never combined in one card.
2. **Every AI decision is explainable.** Wherever the system recommends or selects a next action, show the reasoning inline (UCB score, path score, evidence, prerequisites, estimated cost) — never a bare unexplained decision.
3. **Oracle confirmation is sacred.** Always distinguish three trust levels visually: `HYPOTHESIS` (E_ord 2–3), `CONFIRMED BEHAVIOR` (E_ord 4), `ORACLE CONFIRMED` (E_ord 5). Oracle-confirmed items get the strongest visual treatment (solid red badge); hypotheses get the weakest (outline only).

### B1. Signature component — E_ord indicator

A horizontal 6-step indicator, ticks at 0–5, labeled UNSEEN / NOTHING / WEAK / CLEAR / CONFIRMED / ORACLE, with a triangular marker (▲) pointing at the current value. Reuse this exact component anywhere an evidence level is shown.

---

## C. Universal Per-Image Generation Instructions

Apply these to **every** row in the manifest:

- **Format:** desktop web application screenshot, 16:9, landscape, minimum 1600×900 conceptual resolution.
- **Density:** favor information density over whitespace — this is a professional instrument panel, not a marketing page.
- **Text rendering:** all on-screen text must be crisp, legible monospace, in English, using the exact labels quoted in the manifest row (do not paraphrase status words like `ELIGIBLE`, `RUNNING`, `ORACLE CONFIRMED`, etc. — they are fixed vocabulary).
- **No people, no stock photography, no illustrated mascots.**
- **No decorative color outside the palette in Section A1.**

### Global negative prompt (apply to every image)

pink, magenta, purple, lavender, blue neon, cyan neon, colorful gradients, glassmorphism, 3D floating cards, drop shadows, excessive rounded corners, cartoon robots, generic stock cybersecurity imagery, glowing padlocks, hacker-in-hoodie silhouettes, skulls, binary rain, decorative fake terminal windows, lens flare, excessive glow, oversaturated red covering the whole frame, watermarks, UI chrome from real operating systems or browsers.

### Overall art direction

> "A research-grade autonomous penetration-testing command center built for security researchers and professional operators" — not "a flashy hacker-themed website."

---

## D. Image Manifest

Generate one image per row. `index` and `name` together form the file identifier (`{index}-{name}`). Names are lowercase, hyphen-separated (kebab-case). Follow Sections A–C for every row; the **Prompt** column adds only what's specific to that screen.

| Index | Name | Prompt |
|---|---|---|
| 01 | `login-screen` | No sidebar/shell. Centered dark panel on black background: `CMATRIX` / `AUTONOMOUS VAPT` wordmark with a subtle red geometric mark beside it, a username field, a password field, a `SIGN IN` button, a thin divider, and the caption `SECURE RESEARCH ENVIRONMENT`. Extremely minimal, no marketing imagery. |
| 02 | `command-center-dashboard` | Full shell. Header `COMMAND CENTER` / `AUTONOMOUS VAPT OPERATIONS`. Six compact KPI cards: ACTIVE MISSIONS (03), COMPLETED MISSIONS (128), VALIDATED FINDINGS (421), VDG NODES (8,492), SUCCESS RATE (27.4%), TOTAL COST ($184.22) — critical numbers in red. Below: an "Active Missions" table with columns Mission / Surface / Mode / Status / Nodes / Findings / Cost, status column visually prominent. Right side: a "LIVE ACTIVITY" feed of timestamped agent events (timestamp, agent name, action, description). |
| 03 | `new-mission-target-step` | Mission-creation wizard, step 1 of 5. Header `NEW MISSION`. A `TARGET` text input pre-filled with a URL, and a `TARGET TYPE` radio group: URL / HOST / BENCHMARK ENVIRONMENT. Step indicator at top shows 5 steps with step 1 active. |
| 04 | `new-mission-rules-of-engagement-step` | Wizard step 2 of 5. Header `RULES OF ENGAGEMENT` with a multi-line free-text box, then three numeric fields: MAXIMUM RUNTIME (10 minutes / vulnerability), COST CEILING ($10.00), TOOL TIMEOUT (120 seconds). |
| 05 | `new-mission-attack-surface-step` | Wizard step 3 of 5. Header `MISSION MODE` context but showing surface choice: three large selectable cards side by side — WEB APPLICATION (HTTP/HTML — SQLi, XSS, CSRF, SSRF, SSTI, IDOR), GRAPHQL (Schema, Dependency, Injection, IDOR), MULTI-HOST (Lateral Movement, Privilege Escalation). One card shown selected with a red border. |
| 06 | `new-mission-mode-step` | Wizard step 4 of 5. Header `MISSION MODE`. Two selectable cards: ONE-DAY (CVE HINT AVAILABLE) and ZERO-DAY (NO CVE HINT), one selected with red border. |
| 07 | `new-mission-review-step` | Wizard step 5 of 5, a review/summary screen: key-value list — TARGET, SURFACE, MODE, TIMEOUT, COST CEILING, SPECIALISTS, VALIDATION, MEMORY, EARLY STOP — followed by `CANCEL` and `START MISSION` buttons, the latter in red. |
| 08 | `mission-workspace-overview` | **The single most important screenshot.** Full shell with mission status strip. Three-column, two-row workspace layout: left column = mission sub-navigation (Overview, Attack Graph, Environment, Specialists, Execution, Findings, Validation, Memory, Trajectory, Cost) with PAUSE/TERMINATE controls at bottom; center-top = attack graph canvas showing a small vertical chain of connected node cards (RECON → AUTH → SQLI with UCB .82 / E 3/5 → DB-ACCESS), dark background with thin red-outlined edges; center-bottom = a live event/log stream with timestamped agent actions; right column = live mission state numbers (VDG, EL, FINDINGS, COST, TIME) and a specialists status list with filled/hollow red dot indicators. Top bar shows `MISSION: CVE-001`, `RUNNING`, `$1.42`, `06:31`. |
| 09 | `attack-graph-canvas` | Full-bleed view of the VDG attack graph as the dominant center panel (mission workspace with the graph maximized). Multiple node cards connected by thin dependency edges on a black canvas. Each node card shows an id (e.g. `SQLI-001`), a type label (`SQL INJECTION`), and three stat rows: UCB, E_ord, STATUS. Show a mix of node states: ELIGIBLE (red outline), IN_PROGRESS (bright red animated-looking edge), EXPLOITED (filled red + checkmark), INFEASIBLE (dark gray), DEPRIORITIZED (muted gray), BLOCKED (dark red with a small blocked icon). A toolbar overlay includes a `FOCUS HIGHEST-SCORE PATH` button and status/vulnerability-type filter chips (ALL, ELIGIBLE, IN PROGRESS, EXPLOITED, BLOCKED, INFEASIBLE / SQLi, XSS, CSRF, SSRF, SSTI, IDOR, RCE, AUTH, GRAPHQL, LATERAL). |
| 10 | `vdg-node-detail-drawer` | A right-side drawer/panel opened over the attack graph. Header `SQLI-001` / `SQL INJECTION` with an `ELIGIBLE` status badge. Body sections: ATTACK INTENT (short sentence), a stat grid (UCB SCORE 0.824, PATH SCORE 0.612, PROMISE φ 0.81, DIFFICULTY δ 0.32, EVIDENCE E_ord 3/5, EPSS PRIOR 0.42, RETRY 1/3), a PREREQUISITES checklist (✓ AUTH-001, ✓ RECON-004), an ENABLES list (→ DB-ACCESS-002, → RCE-004), a SOURCE ENVIRONMENT FACTS block, and a small vertical TIMELINE of node lifecycle events. |
| 11 | `environmental-layer-endpoints` | Environmental Layer page, ENDPOINTS tab active among a tab row (ENDPOINTS, SERVICES, HOSTS, CREDENTIALS, AUTH STATES, PARAMETERS, CVE CANDIDATES, FINDINGS, EVIDENCE, FAILURES). A dense table: ENDPOINT, METHOD, AUTH, PARAMETERS, SOURCE, LAST SEEN. Framed with "CONFIRMED" / "OBSERVED" language to visually separate it from attack-hypothesis screens. |
| 12 | `environmental-layer-services` | Same page, SERVICES tab active. Table columns: HOST, PORT, SERVICE, VERSION, BANNER, STATUS. |
| 13 | `environmental-layer-host-topology` | Same page, HOSTS tab active, showing a simple vertical host topology diagram: HOST-01 (10.0.0.10) → labeled edge "credential" → HOST-02 (10.0.0.20) → HOST-03 (10.0.0.30), clearly captioned as a confirmed topology, not an attack graph. |
| 14 | `credentials-panel` | Same page, CREDENTIALS tab active. Table: USERNAME, SOURCE, SCOPE, STATUS, with real usernames but masked password/hash fields shown as dots with a `REVEAL` button. |
| 15 | `specialists-grid` | Specialists page. A grid of specialist cards, each showing name (e.g. `RECON SPECIALIST`), `STATUS: RUNNING`, `TASK: Surface Enumeration`, `CONTEXT: FRESH`, `EVIDENCE: 12`. Include multiple cards with varied statuses (IDLE, QUEUED, RUNNING, WAITING, VALIDATING, COMPLETED, FAILED, BLOCKED) shown via small colored status dots/badges. |
| 16 | `specialist-detail-page` | Detail view for one specialist. Header `RECON SPECIALIST`. Key-value block: CURRENT TASK (`recon_target()`), ASSIGNED NODE, CONTEXT (`FRESH INVOCATION`), EL SNAPSHOT (34 facts), FAILURE MEMORY (7 relevant reflections), SKILL LIBRARY (2 matching skills). Below, a vertical invocation timeline: SPAWN → CONTEXT INJECTION → TASK EXECUTION → OUTPUT → EVALUATION → HANDOFF. |
| 17 | `execution-console` | Terminal-styled but not a generic dev terminal. Header `EXECUTION AGENT` / `DETERMINISTIC EXECUTION CHANNEL`. Console body: bracketed timestamps with TASK / TOOL / STATUS lines, a divider, a small results table (PORT, STATE, SERVICE with rows like 22 OPEN SSH), another divider, and an `EXECUTION COMPLETE` line. Visually separate a small "REASONING" region from the "EXECUTION" region to show the architecture never lets execution reason. |
| 18 | `execution-detail-drawer` | Right-side drawer for one execution event. Header `EXECUTION #00481`. Key-value list: SPECIALIST, TASK, TOOL, START, END, DURATION, STATUS (SUCCESS in green), OUTPUT SIZE. Tab row: SUMMARY, RAW OUTPUT, PARSED OUTPUT, EL CHANGES, TRAJECTORY. |
| 19 | `evaluation-screen` | Header `EVALUATION`. Three labeled text blocks with thin dividers: WHAT HAPPENED, EXPECTED VS ACTUAL, NEXT STEP. Below, the E_ord signature component (see Section B1) showing a value of 3. |
| 20 | `e-ord-indicator-component` | An isolated close-up render of the signature E_ord component alone on a dark card: a horizontal 0–5 step track with tick marks, a ▲ marker at position 3, and the six labels UNSEEN / NOTHING / WEAK / CLEAR / CONFIRMED / ORACLE beneath the ticks. Component-library reference style, not a full page. |
| 21 | `validation-center` | Header `VALIDATION CENTER`. A metrics row: PENDING VALIDATION (08), VALIDATED (21), RULED OUT (13), RETRIES (17). Below, a validation queue table: FINDING, TYPE, EVIDENCE, RETRY, STATUS, with status values PENDING / RETRY / VALIDATED shown in distinct badge colors. |
| 22 | `validation-state-machine-modal` | A modal showing the Diagnosis → Adapt → Cap retry loop as an actual flowchart diagram (not plain text): VALIDATION → ORACLE TEST → branches to SUCCESS → VALIDATED, and FAILURE → DIAGNOSIS → branches to CORRECTABLE → ADAPT → RETRY (looping back), and FUNDAMENTAL → RULED OUT. Boxes and arrows, thin red/gray lines, dark background. |
| 23 | `validation-oracle-panel` | A small detail panel showing which oracle validated a finding, with three example states stacked or shown as tabs: ORACLE `CVE-BENCH` / ATTACK TYPE `FILE ACCESS` / RESULT `PASS`; ORACLE `PREDIQL` / VULNERABILITY TYPE `IDOR` / SEVERITY `HIGH`; ORACLE `MHBENCH` / OBJECTIVE `HOST COMPROMISED` / RESULT `PASS`. |
| 24 | `findings-dashboard` | Header `VALIDATED FINDINGS`. A severity KPI row: CRITICAL (04), HIGH (09), MEDIUM (17), LOW (06), each in its severity color. Below, a table: ID, TYPE, TARGET, SEVERITY, E_ord, STATUS, FIRST SEEN, VALIDATED. Include one expanded finding card example with target path, severity, evidence ratio, status, and `VIEW EVIDENCE` / `VIEW PATH` buttons. |
| 25 | `finding-detail-page` | Detail page for one finding, with a left section tab list (OVERVIEW, EVIDENCE, ATTACK PATH, VALIDATION, ENVIRONMENT, TRAJECTORY, RELATED NODES, MEMORY). Main panel shows an OVERVIEW block (FINDING id, TYPE, SEVERITY, STATUS `ORACLE CONFIRMED`, E_ord 5/5) and, below it, a vertical attack-path chain: RECON-001 → AUTH-001 → SQLI-003 → DB-ACCESS-001. |
| 26 | `evidence-viewer` | Tabbed evidence viewer: REQUEST, RESPONSE, EVIDENCE, ORACLE tabs. Show the RESPONSE tab active with a redacted/blurred sensitive-data region and a visible HTTP response body, plus a timestamp and artifact reference in the corner. |
| 27 | `memory-vulnerability-pattern` | Memory page, VULNERABILITY PATTERN tab active. A card grid, each card showing TECHNOLOGY (e.g. `ThinkPHP 5.x`), OBSERVED PATTERNS (SQLi, RCE, Auth Bypass as tags), MISSIONS (12), SUCCESSFUL USES (8). |
| 28 | `memory-strategy-branching` | Memory page, STRATEGY tab active. One strategy (`XSS-WAF-ADAPT`) rendered as an actual branching flowchart: CANARY → REFLECTION DETECTED → CONTEXT ANALYSIS → a `WAF?` decision diamond splitting into NO → NORMAL PAYLOAD and YES → ALTERNATIVE BRANCH. |
| 29 | `memory-technical-action` | Memory page, TECHNICAL ACTION tab active. An expandable-row table: ACTION, TOOL, TECHNOLOGY, VERSION, SUCCESS RATE, LAST VERIFIED, FAILURE MODES — one row shown expanded, most collapsed, no large code blocks visible by default. |
| 30 | `memory-episodic-failure` | Memory page, EPISODIC FAILURE tab active, styled as a searchable failure database. A record card: VULN CLASS (SQLi), TOOL (SQLMap), ERROR (TIMEOUT), TARGET PATTERN (Flask / SQLite), DIAGNOSIS (FUNDAMENTAL), and a REFLECTION text block. |
| 31 | `memory-skill-library` | Memory page, SKILL LIBRARY tab active. A grid of skill cards, each with SKILL id (`#SK-019`), TITLE, TECHNOLOGY, VALIDATED (YES), ORACLE, MISSIONS, LAST VERIFIED, and a strong solid-red `ORACLE CONFIRMED` badge distinguishing it from unvalidated suggestions. |
| 32 | `trajectory-timeline` | Header `MISSION TRAJECTORY`. Left: a vertical numbered step timeline (STEP 001 → STEP 002 → STEP 003...) with a connecting line. Right: detail panel for the selected step showing TRIGGER, ACTION, VDG DELTA, EL DELTA, E_ord, COST, TIME. A filter bar above with chips: ALL, VDG, EL, SPECIALISTS, EXECUTION, EVALUATION, VALIDATION, MEMORY, COST, FAILURES. |
| 33 | `cost-and-usage-dashboard` | Header for Cost & Usage. Four KPI cards: TOTAL COST ($184.22), CURRENT MISSION ($1.42), AVG COST/RUN ($1.31), COST/SUCCESSFUL EXPLOIT ($4.77). Below, a grid of small line/bar charts titled COST OVER TIME, TOKENS OVER TIME, TOOL CALLS, MODEL CALLS, COST BY SPECIALIST, COST BY VULNERABILITY — simple monochrome red/gray charts, no colorful chart libraries. |
| 34 | `model-usage-breakdown` | A breakdown panel/table listing pipeline roles against models and cost: TEAM MANAGER / FRONTIER MODEL / $0.84, SPECIALISTS / MID-TIER / $0.42, EVALUATION / CHEAP MODEL / $0.09, RETRIEVAL / FAISS / $0.00, EXECUTION / DETERMINISTIC / $0.00. |
| 35 | `fullcompact-context-state` | Research instrumentation screen. Header `TEAM MANAGER CONTEXT`. A horizontal utilization bar at 82% with an annotated 85% compaction threshold line. Below, an active-compaction state block: `FULLCOMPACT ACTIVE`, a checklist (Environmental Layer, Attack Layer, Active Tasks, Current VDG State, Mission Metadata all checked), and a status line `RECONSTRUCTING TEAM MANAGER CONTEXT...`, followed by a completed state showing `COMPACTION COMPLETE` / `CONTEXT UTILIZATION: 31%`. |
| 36 | `team-manager-adm-dashboard` | Header `ATTACK DECISION-MAKING`. A ranked table: NODE, UCB, PATH, E_ord, COST, STATUS, with several ELIGIBLE rows and the top-ranked row highlighted in red. |
| 37 | `ucb-breakdown-modal` | A modal opened from a UCB score. Header `UCB SCORE BREAKDOWN`. A signed value list: EXPLOITATION +0.41, EXPLORATION +0.28, PROMISE φ +0.24, DIFFICULTY +0.13, EVIDENCE +0.24, CONTEXT LOAD −0.06, EPSS PRIOR +0.05, ESTIMATED COST −0.02, a divider, then FINAL UCB 0.82 in bold red. |
| 38 | `reports-page` | A report page listing sections as a table of contents (EXECUTIVE SUMMARY, TARGET, SCOPE, MISSION CONFIGURATION, ATTACK SURFACE, DISCOVERED ENVIRONMENT, ATTACK GRAPH, VALIDATED FINDINGS, ATTACK PATHS, EVIDENCE, FAILED PATHS, VALIDATION RESULTS, COST, TRAJECTORY SUMMARY, LIMITATIONS) alongside `VIEW REPORT`, `EXPORT PDF`, `EXPORT JSON` buttons. |
| 39 | `benchmarks-dashboard` | Header `BENCHMARK SUITE`. Seven tiles, Tier 0 through Tier 6, each labeled with its tier number and benchmark name (FANG SANDBOX, PENTESTEVAL, CVE-BENCH, PREDIQL, MHBENCH, BOUNTYBENCH, PENTESTGPT / HTB). |
| 40 | `benchmark-detail-page` | Detail page for one benchmark (`CVE-BENCH`). Key stats: 40 CRITICAL CVEs, MODE (ONE-DAY/ZERO-DAY), RUNS (10), PASS@1, PASS@5, 95% CI, COST/EXPLOIT, and a small FAILURE DISTRIBUTION chart. |
| 41 | `ablation-laboratory` | Header listing eight ablation axes as a vertical menu (A1 VDG DECOMPOSITION, A2 MEMORY, A3 VALIDATION LOOP, A4 FAILURE PROPAGATION, A5 PATH SCORING, A6 E_ord, A7 EARLY STOPPING, A8 VAPT PROTOCOL). Main panel shows the A1 experiment UI: four selectable condition cards (A) FLAT UCB, (B) UCB + DEPENDENCY, (C) STACKED, (D) FULL VDG, plus RUNS/COMPUTE BUDGET/MODEL/BENCHMARK fields, and a simple horizontal bar-length comparison chart labeled PASS@1 with four bars of increasing length for A–D. |
| 42 | `statistical-evaluation-page` | Header `STATISTICAL ANALYSIS`. A key-value block: SAMPLE SIZE (10 RUNS/CONDITION), CONFIDENCE INTERVAL (95% WILSON), PAIRED TEST (McNEMAR), EFFECT SIZE (+X.X percentage points). |
| 43 | `failure-analysis-dashboard` | Four large red-accented cards in a row: EXPLORATION FAILURE (34), REASONING FAILURE (21), TOOL FAILURE (8), VALIDATION FAILURE (12), each clickable-looking with a large number and label. |
| 44 | `human-escalation-screen` | An alert-styled full-panel screen. Header `⚠ HUMAN ESCALATION REQUIRED`. MISSION id, a REASON line (e.g. `COST CEILING EXCEEDED`), a divider, a CURRENT STATE block (VDG NODES, EL FACTS, FINDINGS, COST, TIME), and three buttons: `REVIEW MISSION`, `TERMINATE`, `AUTHORIZE CONTINUATION`. |
| 45 | `audit-log-page` | A dense audit table: TIMESTAMP, ACTOR, EVENT, RESOURCE, OLD STATE, NEW STATE, MISSION — multiple rows showing state-mutation history. |
| 46 | `settings-page` | A settings page with a left category list (GENERAL, MODELS, MISSIONS, TOOLS, MEMORY, VDG, VALIDATION, BENCHMARKS, COST, SECURITY) and the MODELS category open on the right, showing three dropdown selectors: TEAM MANAGER (Frontier Model), SPECIALISTS (Open-Weight Model), EVALUATION (Cheap Model). |
| 47 | `modal-system-reference-sheet` | A single reference composition showing four modal types side by side or stacked: a confirmation modal (`TERMINATE MISSION?` with CANCEL/TERMINATE), a warning modal (`COST CEILING NEAR`, $9.42 of $10.00, CONTINUE/STOP), an information modal (`E_ord = 4` / `CONFIRMED BEHAVIOR` explanatory text), and an error modal (`SYSTEM ERROR`, event id, CLOSE button). |
| 48 | `global-search-command-palette` | A centered command-palette overlay on a dimmed background, header `SEARCH CMATRIX`, a search input, example query suggestions (SQLI-003, /api/users, CVE-2026-XXXX, mission-014, specialist, finding, trajectory), and results grouped under headings MISSIONS, NODES, FINDINGS, ENDPOINTS, HOSTS, MEMORY, TRAJECTORY. |
| 49 | `loading-and-empty-states-reference` | A reference composition of technical loading/empty states (not generic spinners): a graph-building progress state (`BUILDING ATTACK GRAPH`, a text progress bar at 78%, NODES 21 / EDGES 34) and three empty-state blocks — `NO VALIDATED FINDINGS`, `NO MATCHING STRATEGIES`, `VDG FRONTIER EMPTY` — each with one line of explanatory text. |

---

## E. Notes for the agent

- Rows 08 and 09 both render the attack graph; 08 shows it in context inside the full workspace layout, 09 is a close-up/maximized version — keep node styling identical between them.
- Wherever a status word appears (`ELIGIBLE`, `RUNNING`, `VALIDATED`, `ORACLE CONFIRMED`, etc.), render it exactly as written — these are fixed application vocabulary, not free text.
- If asked to generate additional screens not listed here, follow Sections A–C and choose a name in the same `index-kebab-case` convention, continuing the index sequence from `50`.
