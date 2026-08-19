I read the `docs/paper-research/cmatrix-architecture/architecture.md` **line-by-line through all 1,105 lines**, including the final contribution/limitation sections. The document is fundamentally an autonomous VAPT orchestration architecture centered around **VDG + Dual-Layer World Model + Specialists + Execution/Validation + Memory/Trajectory**. 

One important distinction before the UI specification:

> **The architecture file defines the system behavior and data/state very precisely, but it does not prescribe a concrete visual UI, page hierarchy, navigation system, or component library.**
>
> Therefore, the UI below is a **faithful UI/UX translation of the architecture**, not something the file literally says already exists. I am not inventing new research mechanisms; I am turning the specified architecture into a coherent web application interface.

---

# CMatrix — Complete UI/UX Design Specification

## 1. Overall Product Identity

CMatrix should look like a **professional autonomous security operations console**, not like a generic SaaS dashboard.

The visual language should communicate:

* cybersecurity
* autonomous agents
* graph-based reasoning
* live mission execution
* evidence
* deterministic state
* high information density
* research-grade instrumentation
* controlled automation

The interface should feel closer to a **modern security operations / red-team command console** than a consumer application.

### Primary visual characteristics

* **Dark-first interface**
* **Red as the primary accent**
* Black / near-black background
* Monospace typography throughout
* Thin borders
* Compact information density
* Minimal rounded corners
* No gradients
* No glassmorphism
* No excessive shadows
* No neon rainbow colors
* No purple/pink/cyan decorative accents
* No cartoonish AI imagery
* No oversized illustrations

The architecture itself is highly structured, so the UI should visually communicate **structure rather than decoration**.

---

# 2. Color System

The user explicitly requested a **red theme**.

Use a controlled red palette rather than many unrelated reds.

### Core colors

```text
Background:
#080808
#0D0D0D
#111111

Surface:
#151515
#191919
#1E1E1E

Border:
#292929
#333333

Primary Red:
#E31B23

Bright Red:
#FF2A32

Deep Red:
#9E1118

Muted Red:
#6F171B

Text:
#F2F2F2

Secondary Text:
#A0A0A0

Muted Text:
#666666
```

### Semantic colors

Although red is the dominant theme, status information must remain distinguishable.

Use:

```text
Success:
#3FB950

Warning:
#D29922

Error / Critical:
#FF2A32

Information:
#8B8B8B

Neutral:
#666666
```

These should be used **sparingly**. Red remains the application's visual identity.

### Critical rule

**Absolutely no pink, magenta, violet, purple, lavender, peach, or pinkish gradients anywhere in the application.**

The red should be a true security-console red.

---

# 3. Typography

The entire application uses a **monospace font**.

Recommended hierarchy:

```text
Primary:
JetBrains Mono

Fallback:
IBM Plex Mono
Roboto Mono
monospace
```

Do not use a conventional sans-serif font for headings.

### Typography hierarchy

```text
Application title:
24–28px / bold

Page title:
20–24px / bold

Section heading:
14–16px / semibold

Component heading:
12–14px / semibold

Body:
12–13px

Metadata:
10–11px

Terminal/log:
11–12px
```

The UI should feel technical and compact.

---

# 4. Global Application Shell

Every authenticated page uses the same shell.

## Left sidebar

Width:

**240–260px**

Background:

```text
#0B0B0B
```

At the top:

```text
CMATRIX
AUTONOMOUS VAPT
```

The CMatrix logo should be simple and geometric.

Below it:

```text
MISSIONS
DASHBOARD
ATTACK GRAPH
ENVIRONMENT
SPECIALISTS
FINDINGS
VALIDATION
MEMORY
TRAJECTORY
COST & USAGE

EVALUATION
BENCHMARKS
ABLATIONS
REPORTS

SYSTEM
AUDIT LOG
SETTINGS
```

Navigation groups should be visually separated by thin horizontal rules.

### Active navigation

The active item receives:

* dark-red background
* thin red left border
* white text
* red icon

Example:

```text
│  ◉  ATTACK GRAPH
```

---

# 5. Global Top Bar

Every page has a top bar.

Left:

```text
MISSION / CVE-001
```

Center/right:

```text
● SYSTEM ONLINE
```

Then:

```text
MISSION STATUS: RUNNING
MODEL: FRONTIER
COST: $0.82
TIME: 04:32
```

Rightmost:

```text
[USER]
[⚙]
```

The top bar should remain compact.

---

# 6. Global Mission Status Strip

During an active mission, a persistent strip appears below the top navigation.

Example:

```text
MISSION: CVE-2026-XXXX
TARGET: benchmark.local
MODE: ZERO-DAY
SURFACE: WEB

VDG NODES     EL FACTS      FINDINGS      COST       TIME
27            143           3             $1.42      06:31
```

This gives the operator continuous situational awareness.

---

# 7. Page 01 — Login

The login screen should be extremely minimal.

Centered panel:

```text
CMATRIX
AUTONOMOUS VAPT

[ USERNAME                  ]

[ PASSWORD                  ]

[        SIGN IN            ]

────────────────────────────

SECURE RESEARCH ENVIRONMENT
```

Dark background.

A subtle red vertical line or geometric red mark can appear beside the logo.

No marketing imagery.

---

# 8. Page 02 — Main Dashboard

The Dashboard is the system's high-level command center.

## Header

```text
COMMAND CENTER
────────────────────────────────────────

AUTONOMOUS VAPT OPERATIONS
```

Below:

### KPI cards

Six compact cards:

```text
ACTIVE MISSIONS
03

COMPLETED MISSIONS
128

VALIDATED FINDINGS
421

VDG NODES
8,492

SUCCESS RATE
27.4%

TOTAL COST
$184.22
```

Each card is dark with a thin border.

Critical numbers can use red.

---

## Active Missions panel

Large table:

| Mission | Surface | Mode     | Status     | Nodes | Findings |  Cost |
| ------- | ------- | -------- | ---------- | ----: | -------: | ----: |
| CVE-001 | Web     | Zero-day | RUNNING    |    27 |        3 | $1.42 |
| GQL-004 | GraphQL | One-day  | VALIDATING |    18 |        2 | $0.88 |

Status should be visually prominent.

Clicking a mission opens the Mission Workspace.

---

## Activity Feed

Right side:

```text
LIVE ACTIVITY

20:41:02
RECON SPECIALIST
Added endpoint /api/users

20:41:07
TEAM MANAGER
Created VDG node sqli-003

20:41:13
SQLI SPECIALIST
Evidence score → E_ord 3

20:41:18
VALIDATION AGENT
Finding pending oracle validation
```

Each event has:

```text
TIMESTAMP
AGENT
ACTION
DESCRIPTION
```

---

# 9. Page 03 — New Mission

This is one of the most important pages.

The architecture explicitly specifies Scope Intake accepting:

* target
* rules of engagement
* mode
* attack-surface family. 

Therefore the UI should be a structured mission configuration wizard.

## Step 1 — Target

```text
NEW MISSION

TARGET

[ https://target.example.com                    ]

TARGET TYPE
( ) URL
( ) HOST
( ) BENCHMARK ENVIRONMENT
```

---

## Step 2 — Rules of Engagement

```text
RULES OF ENGAGEMENT

[................................................]
[................................................]
[................................................]

MAXIMUM RUNTIME
[ 10 minutes / vulnerability ]

COST CEILING
[ $10.00 ]

TOOL TIMEOUT
[ 120 seconds ]
```

The architecture specifies a 10-minute vulnerability wall-clock timeout and 120-second tool-call timeout. 

---

## Step 3 — Attack Surface

Three large selectable cards:

```text
┌───────────────────────┐
│ WEB APPLICATION       │
│ HTTP / HTML           │
│                       │
│ SQLi · XSS · CSRF     │
│ SSRF · SSTI · IDOR    │
└───────────────────────┘

┌───────────────────────┐
│ GRAPHQL               │
│                       │
│ Schema · Dependency   │
│ Injection · IDOR      │
└───────────────────────┘

┌───────────────────────┐
│ MULTI-HOST            │
│                       │
│ Lateral Movement      │
│ Privilege Escalation  │
└───────────────────────┘
```

---

## Step 4 — Mode

```text
MISSION MODE

┌───────────────────────┐
│ ONE-DAY               │
│ CVE HINT AVAILABLE    │
└───────────────────────┘

┌───────────────────────┐
│ ZERO-DAY              │
│ NO CVE HINT           │
└───────────────────────┘
```

---

## Step 5 — Review

Display a complete configuration summary.

```text
TARGET              benchmark.local
SURFACE             WEB
MODE                ZERO-DAY
TIMEOUT             10 MIN
COST CEILING        $10
SPECIALISTS         4
VALIDATION          ENABLED
MEMORY              FULL
EARLY STOP          ENABLED
```

Then:

```text
[ CANCEL ]          [ START MISSION ]
```

---

# 10. Page 04 — Mission Workspace

This should be the **primary operational screen**.

It is where an operator spends most of their time.

Layout:

```text
┌───────────────┬──────────────────────────────┬──────────────┐
│               │                              │              │
│ MISSION       │       ATTACK GRAPH            │ LIVE STATE   │
│ NAVIGATION    │                              │              │
│               │                              │              │
│               │                              │              │
├───────────────┼──────────────────────────────┤              │
│               │                              │              │
│ SPECIALISTS   │       EVENT / LOG STREAM     │              │
│               │                              │              │
└───────────────┴──────────────────────────────┴──────────────┘
```

---

# 11. Mission Workspace — Left Panel

Mission navigation:

```text
MISSION OVERVIEW

ATTACK GRAPH
ENVIRONMENT
SPECIALISTS
EXECUTION
FINDINGS
VALIDATION
MEMORY
TRAJECTORY
COST
```

At bottom:

```text
MISSION CONTROL

[ PAUSE ]
[ TERMINATE ]
```

---

# 12. Mission Workspace — Center Attack Graph

This is the **signature CMatrix UI**.

The architecture's VDG is a scored DAG containing:

* vulnerability nodes
* prerequisites
* enables
* status
* UCB score
* evidence
* path score. 

Therefore the graph should visually dominate the center of the application.

## Graph canvas

Dark black background.

Thin dependency edges.

Each node is a compact rectangular card.

Example:

```text
┌────────────────────────────┐
│ SQLI-001                   │
│ SQL INJECTION              │
│                            │
│ UCB     0.82               │
│ E_ord   3/5                │
│ STATUS  ELIGIBLE            │
└────────────────────────────┘
```

---

## Node states

### ELIGIBLE

Red outline.

### IN_PROGRESS

Bright red animated edge.

### EXPLOITED

Red filled indicator + check mark.

### INFEASIBLE

Dark gray.

### DEPRIORITIZED

Muted gray.

### BLOCKED

Dark red with blocked icon.

These statuses come directly from the VDG schema. 

---

# 13. Attack Graph Interactions

The graph must support:

### Zoom

Mouse wheel / trackpad.

### Pan

Click-drag.

### Node selection

Clicking a node opens a right-side detail panel.

### Focus path

Button:

```text
FOCUS HIGHEST-SCORE PATH
```

### Filter

```text
ALL
ELIGIBLE
IN PROGRESS
EXPLOITED
BLOCKED
INFEASIBLE
```

### Vulnerability filter

```text
SQLi
XSS
CSRF
SSRF
SSTI
IDOR
RCE
AUTH
GRAPHQL
LATERAL
```

---

# 14. VDG Node Detail Modal

Clicking a graph node opens a modal/drawer.

Header:

```text
SQLI-001
SQL INJECTION
```

Status badge:

```text
ELIGIBLE
```

Then:

```text
ATTACK INTENT
Determine whether parameter `id`
is exploitable.

UCB SCORE
0.824

PATH SCORE
0.612

PROMISE φ
0.81

DIFFICULTY δ
0.32

EVIDENCE
E_ord 3 / 5

EPSS PRIOR
0.42

RETRY
1 / 3
```

Then:

### Prerequisites

```text
PREREQUISITES

✓ AUTH-001
✓ RECON-004
```

### Enables

```text
ENABLES

→ DB-ACCESS-002
→ RCE-004
```

### Source EL facts

```text
SOURCE ENVIRONMENT FACTS

/api/users
parameter: id
method: GET
auth_required: true
```

### Timeline

```text
20:41:01 NODE CREATED
20:41:10 SELECTED
20:41:15 SPECIALIST DISPATCHED
20:41:21 E_ord → 3
```

---

# 15. Page 05 — Environmental Layer

This page should visualize the **confirmed reality of the target**, completely separate from attack hypotheses.

That separation is fundamental to CMatrix. The EL contains confirmed facts and is written by Specialists; the VDG contains attack hypotheses and is written by the Team Manager. 

Tabs:

```text
ENDPOINTS
SERVICES
HOSTS
CREDENTIALS
AUTH STATES
PARAMETERS
CVE CANDIDATES
FINDINGS
EVIDENCE
FAILURES
```

---

## Endpoint table

```text
ENDPOINT
METHOD
AUTH
PARAMETERS
SOURCE
LAST SEEN
```

Example:

```text
/api/users
GET
YES
id, page
RECON
20:41:02
```

---

## Service table

```text
HOST
PORT
SERVICE
VERSION
BANNER
STATUS
```

---

## Host topology

For multi-host missions, show:

```text
HOST-01
10.0.0.10

      │
      │ credential
      ▼

HOST-02
10.0.0.20

      │
      ▼

HOST-03
10.0.0.30
```

This is a **confirmed environment topology**, not the attack hypothesis graph.

---

# 16. Credential Panel

Sensitive values should never be visually exposed by default.

Instead:

```text
CREDENTIALS

USERNAME       SOURCE       SCOPE       STATUS

admin          ENV          host-01     ACTIVE
svc_api        DISCOVERY    host-02     ACTIVE
```

Password/hash fields:

```text
••••••••••••••
[ REVEAL ]
```

---

# 17. Page 06 — Specialists

This page shows the autonomous agent workforce.

The architecture defines:

* Recon Specialist
* SQLi Specialist
* XSS Specialist
* GraphQL Specialist
* Auth/Session Specialist
* Lateral-Movement Specialist. 

Display them as cards.

```text
SPECIALISTS

┌──────────────────────────────┐
│ RECON SPECIALIST             │
│ STATUS: RUNNING              │
│ TASK: Surface Enumeration    │
│ CONTEXT: FRESH               │
│ EVIDENCE: 12                 │
└──────────────────────────────┘
```

---

## Specialist status

Possible states:

```text
IDLE
QUEUED
RUNNING
WAITING
VALIDATING
COMPLETED
FAILED
BLOCKED
```

---

# 18. Specialist Detail Page

Clicking a Specialist opens:

```text
RECON SPECIALIST

CURRENT TASK
recon_target()

ASSIGNED NODE
RECON-004

CONTEXT
FRESH INVOCATION

EL SNAPSHOT
34 facts

FAILURE MEMORY
7 relevant reflections

SKILL LIBRARY
2 matching skills
```

Then:

### Invocation Timeline

```text
SPAWN
↓
CONTEXT INJECTION
↓
TASK EXECUTION
↓
OUTPUT
↓
EVALUATION
↓
HANDOFF
```

The architecture explicitly specifies fresh Specialist context, scoped EL state, vulnerability knowledge, episodic failure memory, and Skill Library retrieval. 

---

# 19. Page 07 — Execution Console

This is a terminal-style screen.

But it should **not** look like a normal developer terminal.

Header:

```text
EXECUTION AGENT
DETERMINISTIC EXECUTION CHANNEL
```

Main console:

```text
[20:41:03] TASK     recon_target()
[20:41:03] TOOL     NMAP
[20:41:04] STATUS   RUNNING

────────────────────────────────────────

PORT    STATE    SERVICE
22      OPEN     SSH
80      OPEN     HTTP
443     OPEN     HTTPS

────────────────────────────────────────

[20:41:11] EXECUTION COMPLETE
```

The architecture explicitly separates LLM command generation from deterministic command execution; the Execution Agent never reasons. 

So the UI should visually distinguish:

```text
REASONING
```

from:

```text
EXECUTION
```

---

# 20. Execution Detail Drawer

Click an execution event.

Drawer:

```text
EXECUTION #00481

SPECIALIST
Recon Specialist

TASK
recon_target()

TOOL
NMAP

START
20:41:03

END
20:41:11

DURATION
8.21s

STATUS
SUCCESS

OUTPUT SIZE
12.4 KB
```

Tabs:

```text
SUMMARY
RAW OUTPUT
PARSED OUTPUT
EL CHANGES
TRAJECTORY
```

---

# 21. Page 08 — Evaluation

The Evaluation Agent produces the four-part structure:

```text
what_happened
expected_vs_actual
next_step
E_ord
```

This should be directly reflected in the interface. 

Screen:

```text
EVALUATION

WHAT HAPPENED
────────────────────────
The target returned a differential
response to the probe.

EXPECTED VS ACTUAL
────────────────────────
Expected: normal response
Actual: timing anomaly detected

NEXT STEP
────────────────────────
Continue validation.

EVIDENCE SCORE

0  1  2  3  4  5
            ▲
           E=3
```

---

# 22. E_ord Visual Component

This should be a signature component.

A horizontal five-step indicator:

```text
0────1────2────3────4────5
                  ▲
```

Labels:

```text
UNSEEN
NOTHING
WEAK
CLEAR
CONFIRMED
ORACLE
```

The architecture defines exactly these six levels. 

---

# 23. Page 09 — Validation Center

This is another major page.

Header:

```text
VALIDATION CENTER
```

Dashboard:

```text
PENDING VALIDATION     08
VALIDATED              21
RULED OUT              13
RETRIES                17
```

---

## Validation queue

```text
FINDING      TYPE       EVIDENCE     RETRY      STATUS

F-001        SQLi       E=4          0/3        PENDING
F-002        XSS        E=3          1/3        RETRY
F-003        IDOR       E=5          0/3        VALIDATED
```

---

# 24. Validation Detail Modal

The Validation Agent uses the Diagnosis → Adapt → Cap loop, with a maximum of three retries. 

Visualize that as a state machine:

```text
                    ┌─────────────┐
                    │ VALIDATION  │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ ORACLE TEST │
                    └──────┬──────┘
                           │
                ┌──────────┴──────────┐
                ▼                     ▼
             SUCCESS                FAILURE
                │                     │
                ▼                     ▼
            VALIDATED             DIAGNOSIS
                                      │
                          ┌───────────┴───────────┐
                          ▼                       ▼
                     CORRECTABLE             FUNDAMENTAL
                          │                       │
                          ▼                       ▼
                       ADAPT                  RULED OUT
                          │
                          ▼
                        RETRY
```

This should be rendered visually rather than as plain text.

---

# 25. Validation Oracle Panel

Show which oracle is being used.

For web:

```text
ORACLE
CVE-BENCH

ATTACK TYPE
FILE ACCESS

RESULT
PASS
```

For GraphQL:

```text
ORACLE
PREDIQL

VULNERABILITY TYPE
IDOR

SEVERITY
HIGH

EVIDENCE
...
```

For multi-host:

```text
ORACLE
MHBENCH

OBJECTIVE
HOST COMPROMISED

RESULT
PASS
```

The architecture explicitly defines surface-specific oracles. 

---

# 26. Page 10 — Findings

This is the vulnerability management page.

Header:

```text
VALIDATED FINDINGS
```

KPI row:

```text
CRITICAL     HIGH     MEDIUM     LOW
04           09       17         06
```

Main table:

```text
ID
TYPE
TARGET
SEVERITY
E_ord
STATUS
FIRST SEEN
VALIDATED
```

---

## Finding card

Example:

```text
┌────────────────────────────────────────────┐
│ F-002                                      │
│ SQL INJECTION                              │
│                                            │
│ TARGET                                     │
│ /api/users?id=                             │
│                                            │
│ SEVERITY        HIGH                       │
│ EVIDENCE        5/5                        │
│ STATUS          VALIDATED                  │
│                                            │
│ [ VIEW EVIDENCE ] [ VIEW PATH ]            │
└────────────────────────────────────────────┘
```

---

# 27. Finding Detail Page

Sections:

```text
OVERVIEW
EVIDENCE
ATTACK PATH
VALIDATION
ENVIRONMENT
TRAJECTORY
RELATED NODES
MEMORY
```

### Overview

```text
FINDING
F-002

TYPE
SQL INJECTION

SEVERITY
HIGH

STATUS
ORACLE CONFIRMED

E_ord
5/5
```

### Attack path

Show:

```text
RECON-001
    ↓
AUTH-001
    ↓
SQLI-003
    ↓
DB-ACCESS-001
```

This is especially important because CMatrix's VDG uses **path-level scoring** rather than only individual node scores. 

---

# 28. Evidence Viewer

The evidence viewer should support:

```text
SCREENSHOT
HTTP RESPONSE
REQUEST
TOOL OUTPUT
ORACLE RESULT
ARTIFACT
TIMESTAMP
```

Use tabs:

```text
REQUEST
RESPONSE
EVIDENCE
ORACLE
```

Sensitive data is redacted by default.

---

# 29. Page 11 — Memory

The memory system deserves its own page because C2 is one of the architecture's primary claims.

The architecture defines three long-term tiers plus Episodic Failure Memory. 

Top tabs:

```text
VULNERABILITY PATTERN
STRATEGY
TECHNICAL ACTION
EPISODIC FAILURE
SKILL LIBRARY
```

---

# 30. Vulnerability Pattern Memory

Cards:

```text
TECHNOLOGY
ThinkPHP 5.x

OBSERVED PATTERNS
SQLi
RCE
Auth Bypass

MISSIONS
12

SUCCESSFUL USES
8
```

---

# 31. Strategy Memory

This should visually emphasize **conditional branches**.

Example:

```text
STRATEGY: XSS-WAF-ADAPT

CANARY
   │
   ▼
REFLECTION DETECTED
   │
   ▼
CONTEXT ANALYSIS
   │
   ▼
WAF?
 ┌─┴───────┐
NO        YES
 │          │
 ▼          ▼
NORMAL    ALTERNATIVE
PAYLOAD   BRANCH
```

The architecture specifically distinguishes Strategy Memory by conditional security workflows rather than only linear sequences. 

---

# 32. Technical Action Memory

Display:

```text
ACTION
TOOL
TECHNOLOGY
VERSION
SUCCESS RATE
LAST VERIFIED
FAILURE MODES
```

No giant code blocks by default.

Use expandable rows.

---

# 33. Episodic Failure Memory

This page should feel like a searchable failure database.

```text
FAILURE MEMORY

VULN CLASS
SQLi

TOOL
SQLMap

ERROR
TIMEOUT

TARGET PATTERN
Flask / SQLite

DIAGNOSIS
FUNDAMENTAL

REFLECTION
Previous approach failed because...
```

The architecture says these reflections are mission-scoped and indexed by vulnerability class, tool, target pattern, and error class. 

---

# 34. Skill Library

Display validated skills as **oracle-confirmed assets**.

Each card:

```text
SKILL #SK-019

TITLE
ThinkPHP SQLi → DB Access

TECHNOLOGY
ThinkPHP 5.x

VALIDATED
YES

ORACLE
CVE-BENCH

MISSIONS
4

LAST VERIFIED
2026-08-18
```

A strong red:

```text
ORACLE CONFIRMED
```

badge should distinguish these from ordinary LLM-generated suggestions.

The architecture explicitly requires oracle confirmation before skill promotion. 

---

# 35. Page 12 — Trajectory

This should be one of the most sophisticated screens.

The Engagement Trajectory Log records every mission step, trigger, VDG delta, action, EL delta, Specialist output, E_ord, and cost. 

Main interface:

```text
MISSION TRAJECTORY

STEP 001
↓
STEP 002
↓
STEP 003
↓
STEP 004
↓
...
```

Timeline on left.

Detail on right.

---

## Trajectory event

```text
STEP 018

TRIGGER
VDG selection

ACTION
SQLi Specialist dispatched

VDG DELTA
SQLI-003 → IN_PROGRESS

EL DELTA
No changes

E_ord
3

COST
$0.08

TIME
4.2s
```

---

# 36. Trajectory Filters

```text
ALL
VDG
EL
SPECIALISTS
EXECUTION
EVALUATION
VALIDATION
MEMORY
COST
FAILURES
```

This allows post-hoc failure analysis.

---

# 37. Page 13 — Cost & Usage

The architecture explicitly elevates cost tracking to a first-class component. 

Dashboard:

```text
TOTAL COST
$184.22

CURRENT MISSION
$1.42

AVG COST / RUN
$1.31

COST / SUCCESSFUL EXPLOIT
$4.77
```

Charts:

```text
COST OVER TIME
TOKENS OVER TIME
TOOL CALLS
MODEL CALLS
COST BY SPECIALIST
COST BY VULNERABILITY
```

---

# 38. Model Usage Breakdown

```text
TEAM MANAGER
FRONTIER MODEL
$0.84

SPECIALISTS
MID-TIER
$0.42

EVALUATION
CHEAP MODEL
$0.09

RETRIEVAL
FAISS
$0.00

EXECUTION
DETERMINISTIC
$0.00
```

This directly reflects the model-tiering architecture. 

---

# 39. Page 14 — FullCompact / Context State

This is a specialized research instrumentation page.

Display:

```text
TEAM MANAGER CONTEXT

CURRENT UTILIZATION

████████████████░░░░ 82%

85% COMPACTION THRESHOLD
```

When triggered:

```text
FULLCOMPACT ACTIVE

CAPTURING:
✓ Environmental Layer
✓ Attack Layer
✓ Active Tasks
✓ Current VDG State
✓ Mission Metadata

RECONSTRUCTING TEAM MANAGER CONTEXT...
```

Then:

```text
COMPACTION COMPLETE
CONTEXT UTILIZATION: 31%
```

The architecture explicitly triggers FullCompact at 85% utilization and reconstructs context from EL + AL. 

---

# 40. Page 15 — Team Manager / ADM

This is the **research reasoning dashboard**.

Header:

```text
ATTACK DECISION-MAKING
```

Main table:

```text
NODE       UCB       PATH      E_ord      COST      STATUS

SQLI-003   0.82      0.61      3          $0.11     ELIGIBLE
XSS-002    0.74      0.72      2          $0.09     ELIGIBLE
AUTH-004   0.61      0.81      4          $0.13     ELIGIBLE
```

The highest-ranked node receives a red highlight.

---

# 41. UCB Breakdown Modal

Clicking a node's UCB score opens:

```text
UCB SCORE BREAKDOWN

EXPLOITATION
+ 0.41

EXPLORATION
+ 0.28

PROMISE φ
+ 0.24

DIFFICULTY
+ 0.13

EVIDENCE
+ 0.24

CONTEXT LOAD
- 0.06

EPSS PRIOR
+ 0.05

ESTIMATED COST
- 0.02

────────────────────

FINAL UCB
0.82
```

The architecture explicitly defines this modified UCB formulation. 

This would be an extremely useful research/debugging interface.

---

# 42. Page 16 — Reports

Reports should be generated from structured mission state.

Sections:

```text
EXECUTIVE SUMMARY

TARGET

SCOPE

MISSION CONFIGURATION

ATTACK SURFACE

DISCOVERED ENVIRONMENT

ATTACK GRAPH

VALIDATED FINDINGS

ATTACK PATHS

EVIDENCE

FAILED PATHS

VALIDATION RESULTS

COST

TRAJECTORY SUMMARY

LIMITATIONS
```

Buttons:

```text
[ VIEW REPORT ]
[ EXPORT PDF ]
[ EXPORT JSON ]
```

---

# 43. Page 17 — Benchmarks

Because C3 is explicitly a cross-benchmark evaluation methodology, Benchmarking should be a first-class application section.

The architecture defines Tier 0 through Tier 6 benchmarks. 

Dashboard:

```text
BENCHMARK SUITE

TIER 0
FANG SANDBOX

TIER 1
PENTESTEVAL

TIER 2
CVE-BENCH

TIER 3
PREDIQL

TIER 4
MHBENCH

TIER 5
BOUNTYBENCH

TIER 6
PENTESTGPT / HTB
```

---

# 44. Benchmark Detail Page

Example:

```text
CVE-BENCH

40 CRITICAL CVEs

MODE
ONE-DAY / ZERO-DAY

RUNS
10

PASS@1
XX.X%

PASS@5
XX.X%

95% CI
[...]

COST / EXPLOIT
$[...]

FAILURE DISTRIBUTION
```

The architecture requires separate reporting of one-day/zero-day and attack-type oracle results. 

---

# 45. Page 18 — Ablation Laboratory

This is essential for a research project.

Display the required ablations:

```text
A1 VDG DECOMPOSITION
A2 MEMORY
A3 VALIDATION LOOP
A4 FAILURE PROPAGATION
A5 PATH SCORING
A6 E_ord
A7 EARLY STOPPING
A8 VAPT PROTOCOL
```

The architecture specifies these eight ablation axes. 

---

## A1 interface

Four selectable conditions:

```text
(A) FLAT UCB

(B) UCB + DEPENDENCY

(C) STACKED

(D) FULL VDG
```

Then:

```text
RUNS
COMPUTE BUDGET
MODEL
BENCHMARK
```

Result visualization:

```text
PASS@1

A ─────────────
B ────────────────
C ─────────────────
D ─────────────────────
```

---

# 46. Page 19 — Statistical Evaluation

Display:

```text
STATISTICAL ANALYSIS

SAMPLE SIZE
10 RUNS / CONDITION

CONFIDENCE INTERVAL
95% WILSON

PAIRED TEST
McNEMAR

EFFECT SIZE
+X.X percentage points
```

This directly follows the architecture's statistical methodology. 

---

# 47. Page 20 — Failure Analysis

This should be a major research page.

Four primary categories:

```text
EXPLORATION FAILURE
REASONING FAILURE
TOOL FAILURE
VALIDATION FAILURE
```

Display as four large red-accented cards.

Example:

```text
EXPLORATION FAILURE
34

REASONING FAILURE
21

TOOL FAILURE
8

VALIDATION FAILURE
12
```

Then click one category to see individual missions and trajectory events.

The architecture explicitly requires post-hoc human classification using the Engagement Trajectory Log. 

---

# 48. Page 21 — Human Escalation

The system can terminate/escalate when conditions are met.

The architecture describes human escalation or mission termination in the main flow. 

Screen:

```text
⚠ HUMAN ESCALATION REQUIRED

MISSION
CVE-001

REASON
COST CEILING EXCEEDED

OR

REASON
REPEATED FAILURE

OR

REASON
TERMINATION CONDITION

────────────────────────────

CURRENT STATE

VDG NODES       27
EL FACTS        143
FINDINGS        3
COST            $10.00
TIME            09:58

[ REVIEW MISSION ]
[ TERMINATE ]
[ AUTHORIZE CONTINUATION ]
```

---

# 49. Page 22 — Audit Log

Every important state mutation should be auditable.

Columns:

```text
TIMESTAMP
ACTOR
EVENT
RESOURCE
OLD STATE
NEW STATE
MISSION
```

Example:

```text
20:41:21
TEAM_MANAGER
VDG_UPDATE
SQLI-003
E_ord 2
E_ord 3
CVE-001
```

This is particularly appropriate because the system is intended for research reproducibility.

---

# 50. Page 23 — Settings

Settings should be divided into:

```text
GENERAL
MODELS
MISSIONS
TOOLS
MEMORY
VDG
VALIDATION
BENCHMARKS
COST
SECURITY
```

### Model settings

```text
TEAM MANAGER
[ Frontier Model ▼ ]

SPECIALISTS
[ Open-Weight Model ▼ ]

EVALUATION
[ Cheap Model ▼ ]
```

The architecture explicitly supports multiple backbone families and model-swappability validation. 

---

# 51. Important Modal System

The application should use a **small reusable modal language**, not dozens of unrelated modal styles.

## Modal types

### Confirmation modal

```text
TERMINATE MISSION?

This will stop all active Specialists.

[ CANCEL ] [ TERMINATE ]
```

### Warning modal

```text
COST CEILING NEAR

Current: $9.42
Limit: $10.00

[ CONTINUE ] [ STOP ]
```

### Information modal

```text
E_ord = 4

CONFIRMED BEHAVIOR

Controlled behavior has been demonstrated,
but the per-surface oracle has not yet
confirmed exploitation.
```

### Error modal

```text
SYSTEM ERROR

Unable to update VDG state.

EVENT ID
EVT-8192

[ CLOSE ]
```

### Detail drawer

Prefer a right-side drawer instead of a modal for:

* VDG nodes
* EL entities
* Specialist tasks
* Findings
* Trajectory events

This allows users to maintain context.

---

# 52. Global Search

A command-center application should have global search.

Keyboard shortcut:

```text
CTRL + K
```

Search:

```text
SEARCH CMATRIX

> SQLI-003
> /api/users
> CVE-2026-XXXX
> mission-014
> specialist
> finding
> trajectory
```

Results grouped:

```text
MISSIONS
NODES
FINDINGS
ENDPOINTS
HOSTS
MEMORY
TRAJECTORY
```

---

# 53. Notifications

Notifications should be compact.

Examples:

```text
● VDG NODE CREATED
SQLI-003 added to attack graph.

● FINDING VALIDATED
F-004 oracle confirmed.

● FULLCOMPACT COMPLETE
Team Manager context reconstructed.

● HUMAN ESCALATION
Mission requires operator review.
```

No giant toast animations.

---

# 54. Loading States

Never use generic spinning circles everywhere.

Use technical states:

```text
INITIALIZING...
LOADING EL SNAPSHOT...
CALCULATING UCB...
REBUILDING VDG...
DISPATCHING SPECIALIST...
WAITING FOR ORACLE...
```

For graph loading:

```text
BUILDING ATTACK GRAPH

[██████████████░░░░]
78%

NODES: 21
EDGES: 34
```

---

# 55. Empty States

Empty states should be technical.

### No findings

```text
NO VALIDATED FINDINGS

The mission has not produced
an oracle-confirmed finding yet.

E_ord ≥ 5 is required for validation.
```

### No memory

```text
NO MATCHING STRATEGIES

No validated strategy matches
the current technology fingerprint.
```

### Empty VDG

```text
VDG FRONTIER EMPTY

No eligible attack hypotheses
currently satisfy their prerequisites.
```

---

# 56. Responsive Behavior

This should primarily be a **desktop web application**.

The architecture is too information-dense for a mobile-first UI.

### Desktop

Full experience:

```text
Sidebar
+
Top bar
+
3-column workspace
```

### Laptop

Collapse secondary panels.

### Tablet

Sidebar becomes drawer.

### Mobile

Only support:

```text
MISSION STATUS
FINDINGS
ALERTS
BASIC TRAJECTORY
```

Do **not** attempt to squeeze the entire attack graph into a phone screen.

---

# 57. Component Design System

Build reusable components.

### Navigation

```text
Sidebar
NavGroup
NavItem
TopBar
MissionSelector
StatusIndicator
```

### Data

```text
DataTable
MetricCard
StatusBadge
Tag
ProgressBar
Timeline
KeyValueList
```

### Graph

```text
VDGCanvas
VDGNode
VDGEdge
PathHighlight
NodeInspector
UCBBreakdown
GraphFilter
```

### Agents

```text
SpecialistCard
AgentStatus
AgentTimeline
TaskCard
HandoffCard
```

### Security

```text
FindingCard
EvidenceViewer
OracleResult
EordIndicator
ValidationStateMachine
AttackPath
```

### Memory

```text
MemoryTierCard
StrategyTree
FailureReflection
SkillCard
RetrievalResult
```

### Research

```text
BenchmarkCard
AblationCard
MetricChart
ConfidenceInterval
FailureDistribution
```

---

# 58. The Most Important UX Principle: Separate Reality From Hypothesis

This should be visually obvious everywhere.

The application has two distinct conceptual worlds:

```text
ENVIRONMENTAL LAYER
"What do we KNOW?"

versus

ATTACK LAYER / VDG
"What do we THINK we should ATTEMPT?"
```

The architecture explicitly makes this separation a central design principle. 

Therefore:

### Environmental Layer

Use labels such as:

```text
CONFIRMED FACT
OBSERVED
DISCOVERED
EVIDENCE
```

### VDG

Use:

```text
HYPOTHESIS
CANDIDATE
ELIGIBLE
DEPENDENCY
UCB
PATH
```

Never visually mix these concepts.

---

# 59. The Second Most Important UX Principle: Everything Must Be Explainable

CMatrix should never merely say:

```text
NEXT ACTION: SQLi
```

It should allow the operator to see:

```text
WHY SELECTED?

UCB SCORE
0.82

PATH SCORE
0.61

EVIDENCE
3/5

PREREQUISITES
2/2 SATISFIED

ESTIMATED COST
$0.11

PROMISE
0.81
```

That is particularly important because CMatrix's research novelty is centered around dependency-aware decision-making rather than opaque LLM behavior. 

---

# 60. The Third Most Important UX Principle: Oracle Confirmation Is Sacred

The UI must distinguish:

```text
LLM BELIEVES
```

from:

```text
EVIDENCE EXISTS
```

from:

```text
ORACLE CONFIRMED
```

Use three visual states:

```text
HYPOTHESIS
E_ord 2–3

CONFIRMED BEHAVIOR
E_ord 4

ORACLE CONFIRMED
E_ord 5
```

This reflects the architecture's requirement that skill promotion occurs only after oracle confirmation. 

---

# 61. Recommended Main Navigation

The final navigation should therefore be:

```text
CMATRIX
AUTONOMOUS VAPT

────────────────────────

OPERATIONS

▣ Dashboard
▣ Missions
▣ Attack Graph
▣ Environment
▣ Specialists
▣ Execution
▣ Findings
▣ Validation

────────────────────────

KNOWLEDGE

▣ Memory
▣ Skill Library
▣ Failure Memory

────────────────────────

RESEARCH

▣ Trajectory
▣ Benchmarks
▣ Ablations
▣ Statistics
▣ Failure Analysis
▣ Reports

────────────────────────

SYSTEM

▣ Cost & Usage
▣ Audit Log
▣ Settings
```

---

# 62. Recommended Primary Mission Workspace

If your AI agent needs to generate **the most important CMatrix screenshot first**, this is the screen it should generate:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ CMATRIX     MISSION: CVE-001        RUNNING    $1.42    06:31           │
├───────────────┬─────────────────────────────────────────┬───────────────┤
│               │                                         │               │
│ MISSION       │              VDG ATTACK GRAPH           │ ENVIRONMENT   │
│               │                                         │               │
│ Overview      │       ┌──────────┐                     │ ENDPOINTS 143 │
│ Attack Graph  │       │ RECON    │                     │ SERVICES  17  │
│ Environment   │       └────┬─────┘                     │ HOSTS      4  │
│ Specialists   │            │                           │               │
│ Execution     │       ┌────▼─────┐                     │               │
│ Findings      │       │ AUTH     │                     │               │
│ Validation    │       └────┬─────┘                     │               │
│ Memory        │            │                           │               │
│ Trajectory    │       ┌────▼─────┐                     │               │
│ Cost          │       │ SQLI     │                     │               │
│               │       │ UCB .82  │                     │               │
│               │       │ E 3/5    │                     │               │
│               │       └────┬─────┘                     │               │
│               │            │                           │               │
│               │       ┌────▼─────┐                     │               │
│               │       │ DB-ACCESS│                     │               │
│               │       └──────────┘                     │               │
│               │                                         │               │
├───────────────┼─────────────────────────────────────────┼───────────────┤
│               │ LIVE ACTIVITY                           │ MISSION STATE │
│ SPECIALISTS   │                                         │               │
│               │ 20:41:02 RECON → endpoint discovered   │ VDG 27        │
│ ● Recon       │ 20:41:07 TM → SQLI-003 selected        │ EL  143       │
│ ● SQLi        │ 20:41:13 SQLi → E_ord 3                │ FINDINGS 3    │
│ ○ XSS         │ 20:41:18 VALIDATION → pending         │ COST $1.42    │
│ ○ Auth        │                                         │ TIME 06:31    │
└───────────────┴─────────────────────────────────────────┴───────────────┘
```

That screen captures the essence of the architecture:

**Operator → Orchestrator → Team Manager → VDG → Specialists → Execution → Evaluation → Validation → EL/VDG update → next decision.** 

---

# 63. Visual Rules for Your AI Image-Generation Agent

Give the image-generation agent these rules **for every screenshot**:

### DO

* dark black background
* true red accent
* monochrome red/black/gray security aesthetic
* monospace typography
* compact technical typography
* thin borders
* subtle red highlights
* dense but organized information
* professional enterprise security console
* precise graphs
* structured tables
* small status badges
* realistic technical dashboard
* consistent component dimensions
* strong alignment
* large usable desktop canvas

### DO NOT

* pink
* magenta
* purple
* lavender
* blue neon
* cyan neon
* colorful gradients
* glassmorphism
* futuristic sci-fi HUD overload
* 3D floating cards
* excessive rounded cards
* cartoon AI robots
* generic cybersecurity stock imagery
* giant glowing locks
* hacker silhouettes
* skull imagery
* decorative binary rain
* random terminal windows
* excessive glow
* excessive red everywhere

**Red should be an accent, not a background replacement.**

---

# 64. Overall Visual Personality

The final product should feel like:

> **"A research-grade autonomous penetration-testing command center built for security researchers and professional operators."**

Not:

> "A flashy hacker-themed website."

The architecture is unusually rigorous: VDG state, EL state, explicit write ownership, UCB scoring, E_ord, validation oracles, memory tiers, trajectory logs, cost accounting, benchmark evaluation, and ablation infrastructure are all first-class concepts. 

The UI should therefore make **state, evidence, dependencies, decisions, and reproducibility** visually dominant.

That is the design direction I would use as the **master UI/UX specification for generating the CMatrix web application's screenshots**.
