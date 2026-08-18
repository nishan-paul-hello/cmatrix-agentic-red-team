# CMatrix: An LLM-Orchestrated Multi-Agent Framework for Autonomous VAPT

**Working title for publication:** *CMatrix: Dependency-Aware Attack Graph Exploration for Autonomous Vulnerability Assessment and Penetration Testing*

**Status:** Final architecture — synthesized from architecture-1.md (primary backbone), selective improvements from architecture-2.md, and the four-agent adjudication report. All changes from architecture-1.md are annotated with `[CHANGE]` tags for traceability.

**Scoping rule applied throughout:** CMatrix targets **only attack surfaces for which a dedicated, reusable, oracle-backed benchmark already exists in the surveyed literature.** Every claimed capability maps to a benchmark in §2.

**Evidence discipline applied throughout:** Claims are classified as **Established** (29-paper corpus), **Reasonable Hypothesis** (to be empirically tested), or **Speculative** (not presented as expected results).

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Target Attack Surface](#2-target-attack-surface)
3. [Scientific Contributions (Three Only)](#3-scientific-contributions-three-only)
4. [What Is Explicitly NOT a Contribution](#4-what-is-explicitly-not-a-contribution)
5. [System Architecture — Overview](#5-system-architecture--overview)
6. [The Dual-Layer World Model](#6-the-dual-layer-world-model)
7. [The VDG Algorithm (Formalized)](#7-the-vdg-algorithm-formalized)
8. [Layer-by-Layer Architecture Detail](#8-layer-by-layer-architecture-detail)
9. [Attack Surface Traversal — Per-Specialist Methodology](#9-attack-surface-traversal--per-specialist-methodology)
10. [Memory and State Services](#10-memory-and-state-services)
11. [Prior Work Gap Table](#11-prior-work-gap-table)
12. [Benchmarking Strategy and Statistical Methodology](#12-benchmarking-strategy-and-statistical-methodology)
13. [Required Ablation Design](#13-required-ablation-design)
14. [Model Configuration and Cost Policy](#14-model-configuration-and-cost-policy)
15. [Threats to Validity / Known Limitations](#15-threats-to-validity--known-limitations)
16. [Summary of Contribution Claims](#16-summary-of-contribution-claims)

---

<!-- SECTION STATUS
§1  Problem Statement              🔲 TODO
§2  Target Attack Surface          🔲 TODO
§3  Scientific Contributions       🔲 TODO
§4  Not a Contribution             🔲 TODO
§5  System Architecture Overview   🔲 TODO
§6  Dual-Layer World Model         🔲 TODO
§7  VDG Algorithm (Formalized)     🔲 TODO
§8  Layer-by-Layer Detail          🔲 TODO
§9  Per-Specialist Methodology     🔲 TODO
§10 Memory & State Services        🔲 TODO
§11 Gap Table                      🔲 TODO
§12 Benchmarking & Statistics      🔲 TODO
§13 Ablation Design                🔲 TODO
§14 Model Config                   🔲 TODO
§15 Threats to Validity            🔲 TODO
§16 Contribution Summary           🔲 TODO
-->
