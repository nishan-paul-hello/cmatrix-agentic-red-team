## Master Research Paper Generation Prompt

**Role:** You are a world-class researcher and IEEE publication expert with deep mastery in AI red teaming, adversarial machine learning, LLM security, autonomous agents, and cybersecurity. You have published in top venues (IEEE S&P, USENIX, CCS, NeurIPS). You think rigorously, write precisely, and pursue novelty aggressively.

---

**Mission:** Transform the early-stage research in `paper-02-hitl-safety/` into a full-length, IEEE S&P-standard research paper (12–16 pages) that is publication-ready and world-class in quality.

---

## CORE OPERATING RULES

- Work in **strict modular sub-steps**. Complete one sub-step, create its artifact, run its checklist, then pause. Do NOT proceed until explicitly confirmed.
- **After every sub-step**, you must: (1) create a structured artifact capturing all outputs, (2) run the sub-step's full checklist against that artifact, (3) report checklist results, (4) then pause and await confirmation.
- **Every subsequent sub-step must begin by reading the previous sub-step's artifact** as its primary input. Never rely on conversation memory alone.
- **Default to bullet points and structured output** over prose unless writing the actual paper draft.
- Be **aggressive about quality** — rewrite, restructure, or discard anything that weakens the paper. No attachment to existing drafts.
- When uncertain about a claim, **search and verify**. Do not hallucinate citations or data.
- **Token limit rule:** Never generate more than one sub-step per response. If a sub-step is still too long, split it (e.g., 3a-i, 3a-ii), pause between splits, and label clearly where you stopped and what comes next.
- If a checklist item fails, **fix it before reporting completion**. Never mark a step done with failing checklist items.

---

## ARTIFACT PROTOCOL

After every sub-step, create an artifact titled:
**`[STEP Xa] — [Sub-step Name] — OUTPUT ARTIFACT`**

Each artifact must contain:
1. **Summary** — What was done in this sub-step (2–3 sentences)
2. **Full Output** — All structured content produced
3. **Key Decisions Made** — Any judgment calls or choices made and why
4. **Open Questions** — Anything uncertain or unresolved that the next step should address
5. **Checklist Results** — The completed checklist with PASS/FAIL for every item
6. **Input for Next Step** — A clear, concise brief that the next sub-step will use as its starting point

---

## STEP SEQUENCE

---

### STEP 1 — Full Codebase & Paper Audit

---

#### SUB-STEP 1a — Codebase & Documentation Read

**Task:**
- Read the entire codebase end to end. Understand every module, function, and data flow.
- Read all documentation thoroughly.

**Output:**
- System architecture overview
- List of all key modules with their purpose
- Data flow description
- Technology stack summary
- Any notable implementation details relevant to research claims

**Artifact:** `[STEP 1a] — Codebase & Documentation Read — OUTPUT ARTIFACT`

**Checklist:**
- [ ] Every top-level directory and file has been read
- [ ] Every module's purpose is documented
- [ ] Data flow from input to output is fully mapped
- [ ] All documentation files have been read
- [ ] Technology stack is fully identified
- [ ] Any discrepancies or unusual implementation choices are flagged
- [ ] Output is structured and clear enough to serve as input for Step 1b
- [ ] No assumptions made — only what was actually found in the code

---

#### SUB-STEP 1b — Paper Read

**Task:**
- Read `paper-01-red-teaming/` completely — every file, every sentence.
- Use `[STEP 1a]` artifact as context.

**Output:**
- Current paper structure (all sections present)
- Summary of each section's claims
- Methodology described in the paper
- Results and metrics reported
- Citations currently used
- Writing quality assessment

**Artifact:** `[STEP 1b] — Paper Read — OUTPUT ARTIFACT`

**Checklist:**
- [ ] Every file inside `paper-01-red-teaming/` has been read
- [ ] Every section of the paper is summarized
- [ ] All claims made in the paper are listed
- [ ] All citations in the paper are listed
- [ ] Methodology is clearly extracted
- [ ] Results and metrics are clearly extracted
- [ ] Writing quality issues are noted
- [ ] Output is structured enough to serve as input for Step 1c

---

#### SUB-STEP 1c — Gap Analysis

**Task:**
- Cross-reference `[STEP 1a]` and `[STEP 1b]` artifacts.
- Identify everything that needs to be addressed before writing begins.

**Output:**
- Gaps between implementation and paper claims
- Claims in the paper not supported by the codebase
- Features in the codebase not mentioned in the paper
- Clearly novel aspects of the work
- Weak, missing, or unsupported sections
- Overall readiness assessment for research paper development

**Artifact:** `[STEP 1c] — Gap Analysis — OUTPUT ARTIFACT`

**Checklist:**
- [ ] Every paper claim has been checked against the codebase
- [ ] Every major codebase feature has been checked against the paper
- [ ] All gaps are listed with severity (Critical / Major / Minor)
- [ ] Novel aspects are explicitly called out
- [ ] Weak sections are explicitly called out with specific reasons
- [ ] Overall readiness verdict is given
- [ ] Open questions are listed for Step 2 to address
- [ ] Output is clear enough to guide literature research in Step 2

---

### STEP 2 — Literature Mastery

---

#### SUB-STEP 2a — Cited Papers Research

**Task:**
- Read `[STEP 1b]` artifact to extract all cited papers.
- Search online for every cited paper. Read abstract, methodology, and findings.

**Output:**
For each cited paper:
- Title, authors, venue, year
- 2-sentence summary of what it does
- 1-sentence note on relevance to our work
- 1-sentence note on what it does NOT address (gap)

**Artifact:** `[STEP 2a] — Cited Papers Research — OUTPUT ARTIFACT`

**Checklist:**
- [ ] Every paper cited in the original draft has been searched
- [ ] No paper is summarized from memory alone — all are verified online
- [ ] Each entry has: title, authors, venue, year, summary, relevance, gap
- [ ] Any cited paper that could not be found online is flagged
- [ ] Output is structured as a clean reference table
- [ ] Output is clear enough to combine with Step 2b results

---

#### SUB-STEP 2b — State-of-the-Art Search

**Task:**
- Search extensively online for current SOTA work on:
  - LLM red teaming
  - AI agent security
  - Adversarial prompting & jailbreaking
  - Automated red teaming
  - Multi-agent attack surfaces
  - AI safety evaluation frameworks
  - Prompt injection attacks
  - LLM vulnerability benchmarking
- Focus on IEEE S&P, USENIX Security, ACM CCS, NeurIPS, ICML, arXiv (2022–2025).

**Output:**
- Top 20–30 most relevant papers not already in 2a
- For each: title, authors, venue, year, 2-sentence summary, gap addressed by our work

**Artifact:** `[STEP 2b] — SOTA Search — OUTPUT ARTIFACT`

**Checklist:**
- [ ] At least 8 distinct search queries were run covering all listed topics
- [ ] At least 20 relevant papers identified beyond those in 2a
- [ ] Papers span multiple top venues (not just one source)
- [ ] Papers include recent work from 2023–2025
- [ ] No paper is included without being verified online
- [ ] Each entry has: title, authors, venue, year, summary, gap
- [ ] Output is structured as a clean reference table

---

#### SUB-STEP 2c — Related Work Map

**Task:**
- Synthesize `[STEP 2a]` and `[STEP 2b]` artifacts into a structured landscape.

**Output:**
- Categorized taxonomy of all related work (group by theme/approach)
- For each category: what prior work does, where it falls short
- Clear positioning statement: where our work fits and why it advances the field
- A comparison table: our work vs. top 5 most related papers across key dimensions

**Artifact:** `[STEP 2c] — Related Work Map — OUTPUT ARTIFACT`

**Checklist:**
- [ ] All papers from 2a and 2b are categorized
- [ ] At least 4 distinct thematic categories identified
- [ ] Each category has a clear "gap" statement
- [ ] Our work is explicitly positioned against each category
- [ ] Comparison table is complete with meaningful dimensions
- [ ] The map could be directly used to write the Related Work section
- [ ] No uncategorized papers left over
- [ ] Output is clear enough to guide Step 3

---

### STEP 3 — Novelty & Contribution Crystallization

---

#### SUB-STEP 3a — Novelty Identification

**Task:**
- Read `[STEP 1c]` and `[STEP 2c]` artifacts.
- Identify what is genuinely novel about this work, grounded in the literature.

**Output:**
- Bullet list of each novelty point
- For each: 2–3 sentence justification grounded in specific papers from Step 2 that confirm this hasn't been done before
- Novelty strength rating for each point (Strong / Moderate / Weak) with reasoning

**Artifact:** `[STEP 3a] — Novelty Identification — OUTPUT ARTIFACT`

**Checklist:**
- [ ] Every novelty claim is grounded in at least one specific paper from Step 2
- [ ] No novelty claim is made without evidence it hasn't been done before
- [ ] Each novelty point has a strength rating with justification
- [ ] Weak novelty points are flagged — not hidden
- [ ] At least 3 strong novelty points identified
- [ ] Output is specific enough to be turned into contribution statements in 3b

---

#### SUB-STEP 3b — Core Contributions

**Task:**
- Read `[STEP 3a]` artifact.
- Define the 3–5 core contributions in crisp, peer-review-defensible language.

**Output:**
- Numbered contribution list
- Each contribution: 1–2 precise sentences
- Each contribution: one-line "why it matters" note
- Each contribution: mapped back to the novelty point(s) from 3a that support it

**Artifact:** `[STEP 3b] — Core Contributions — OUTPUT ARTIFACT`

**Checklist:**
- [ ] 3–5 contributions defined (no more, no less)
- [ ] Each contribution is stated precisely — no vague language
- [ ] Each contribution is defensible against a hostile reviewer
- [ ] Each contribution maps to at least one novelty point from 3a
- [ ] Contributions are distinct — no overlap between them
- [ ] "Why it matters" note is specific, not generic
- [ ] Contributions are strong enough to anchor the Introduction section

---

#### SUB-STEP 3c — Threat Model & Research Questions

**Task:**
- Read `[STEP 1c]`, `[STEP 2c]`, and `[STEP 3b]` artifacts.
- Define the formal threat model and research questions.

**Output:**
- Formal threat model covering: adversary profile, capabilities, goals, assumptions, out-of-scope
- 3–5 research questions that are specific, answerable, and directly tied to contributions
- For each RQ: which contribution it validates and what a satisfying answer looks like

**Artifact:** `[STEP 3c] — Threat Model & Research Questions — OUTPUT ARTIFACT`

**Checklist:**
- [ ] Threat model covers all 5 dimensions: adversary, capabilities, goals, assumptions, out-of-scope
- [ ] Threat model is consistent with the codebase findings from Step 1
- [ ] 3–5 RQs defined
- [ ] Each RQ is specific and answerable — not open-ended or philosophical
- [ ] Each RQ maps to at least one contribution from 3b
- [ ] Each RQ has a defined "satisfying answer" description
- [ ] Threat model and RQs are consistent with each other
- [ ] Output is ready to be used directly in paper drafting (Step 6)

---

### STEP 4 — Paper Architecture

---

#### SUB-STEP 4a — Section Structure

**Task:**
- Read all Step 3 artifacts.
- Design the complete IEEE S&P paper structure.

**Output:**
- All sections and subsections
- 1–2 sentence description of what each contains
- What argument or contribution each section serves
- Estimated page allocation per section

**Artifact:** `[STEP 4a] — Section Structure — OUTPUT ARTIFACT`

**Checklist:**
- [ ] Structure follows IEEE S&P conventions
- [ ] All standard sections present: Abstract, Introduction, Background, Related Work, Threat Model, Methodology, Evaluation, Discussion, Limitations, Conclusion, References
- [ ] Every contribution from 3b is addressed in at least one section
- [ ] Every RQ from 3c is addressed in at least one section
- [ ] Page allocation totals 12–16 pages
- [ ] Each section has a clear, single purpose
- [ ] Structure tells a coherent single story from abstract to conclusion
- [ ] Output is detailed enough to guide figure and equation planning in 4b and 4c

---

#### SUB-STEP 4b — Figure Plan

**Task:**
- Read `[STEP 4a]` artifact.
- Plan every figure needed in the paper.

**Output:**
For each figure:
- Figure number and title
- Type (system diagram / attack flow / result graph / comparison table / algorithm pseudocode / etc.)
- What it must show and what insight it conveys
- Which section it belongs to
- What data or content it requires to be generated

**Artifact:** `[STEP 4b] — Figure Plan — OUTPUT ARTIFACT`

**Checklist:**
- [ ] At least 6 figures planned
- [ ] Every major system component has a diagram
- [ ] Every key result has a visual representation
- [ ] No section longer than 2 pages is without a figure
- [ ] Each figure has a clear, non-redundant purpose
- [ ] No two figures show the same thing
- [ ] Every figure has all required information to generate it in Step 5
- [ ] Figures are numbered in order of appearance

---

#### SUB-STEP 4c — Equation Plan

**Task:**
- Read `[STEP 4a]` and `[STEP 4b]` artifacts.
- Identify all formal definitions, algorithms, and mathematical models needed.

**Output:**
For each equation or formal definition:
- Equation number and label
- Description of what it captures
- Notation to be used
- Section it belongs to
- Why it is necessary (what it formalizes that prose cannot)

**Artifact:** `[STEP 4c] — Equation Plan — OUTPUT ARTIFACT`

**Checklist:**
- [ ] All key concepts that need formalization are covered
- [ ] No equation is included that is decorative or unnecessary
- [ ] Notation is consistent across all planned equations
- [ ] Every algorithm or attack procedure has a formal or pseudocode representation planned
- [ ] Each equation maps to a specific section
- [ ] Output is sufficient to generate LaTeX-ready equations in Step 5

---

### STEP 5 — Figure & Equation Generation

---

#### SUB-STEP 5a — Figure Generation (batches of 2–3)

**Task:**
- Read `[STEP 4b]` artifact.
- Generate figures in batches of 2–3 at a time.
- Format: SVG, TikZ description, or precise visual specification ready for LaTeX.
- After each batch, pause and await confirmation before the next.

**Output per batch:**
- Rendered or fully specified figures
- Caption for each figure
- LaTeX insertion code for each figure

**Artifact per batch:** `[STEP 5a-i] — Figure Batch 1 — OUTPUT ARTIFACT`, etc.

**Checklist per batch:**
- [ ] All figures in this batch match their plan from 4b exactly
- [ ] Every figure has a complete caption
- [ ] Every figure has LaTeX insertion code
- [ ] Figures are visually clear and publication-quality
- [ ] All figures are numbered correctly in sequence
- [ ] All batches complete: every figure from 4b has been generated

---

#### SUB-STEP 5b — Equation Generation

**Task:**
- Read `[STEP 4c]` artifact.
- Write all equations with full notation, variable definitions, and plain-English explanation.

**Output:**
- LaTeX-ready equation blocks
- Variable definition table for each equation
- Plain-English explanation of what each equation captures
- Inline text suggesting how each equation is introduced in the paper

**Artifact:** `[STEP 5b] — Equation Generation — OUTPUT ARTIFACT`

**Checklist:**
- [ ] Every equation from the 4c plan is generated
- [ ] All equations are LaTeX-ready
- [ ] Every variable is defined
- [ ] Notation is consistent across all equations
- [ ] Each equation has a plain-English explanation
- [ ] Each equation has suggested inline introduction text
- [ ] No equation is mathematically incorrect or ambiguous

---

### STEP 6 — Full Paper Drafting

**Draft one section at a time. After each section, pause and await confirmation.**
**Every section must reference the relevant artifacts from Steps 1–5 as source material.**

---

#### SUB-STEP 6a — Abstract + Introduction

**Input artifacts:** 3b (contributions), 3c (RQs), 4a (structure)

**Output:**
- Abstract (250 words max, IEEE format)
- Introduction (problem motivation, gap, contributions, paper roadmap)

**Artifact:** `[STEP 6a] — Abstract + Introduction — OUTPUT ARTIFACT`

**Checklist:**
- [ ] Abstract is within 250 words
- [ ] Abstract covers: problem, gap, approach, contributions, key result
- [ ] Introduction opens with a compelling problem statement
- [ ] All contributions from 3b are stated clearly in the Introduction
- [ ] All RQs from 3c are referenced or implied
- [ ] Paper roadmap paragraph is present at end of Introduction
- [ ] No vague language — every sentence is precise
- [ ] No claim made that isn't supported by later sections

---

#### SUB-STEP 6b — Background & Related Work

**Input artifacts:** 2c (related work map), 4a (structure)

**Output:**
- Background section covering necessary technical foundations
- Related Work section using the taxonomy from 2c
- Clear positioning of our work at the end of Related Work

**Artifact:** `[STEP 6b] — Background & Related Work — OUTPUT ARTIFACT`

**Checklist:**
- [ ] All thematic categories from 2c are represented
- [ ] Every cited paper is referenced correctly
- [ ] No paper is cited that wasn't in 2a or 2b
- [ ] Related Work ends with a clear "our work differs because..." statement
- [ ] Background covers all concepts a reader needs to understand the paper
- [ ] No unnecessary depth in Background — only what's needed
- [ ] Writing is precise and authoritative

---

#### SUB-STEP 6c — Threat Model

**Input artifacts:** 3c (threat model), 4a (structure)

**Output:**
- Formal threat model section
- Adversary profile, capabilities, goals, assumptions, out-of-scope

**Artifact:** `[STEP 6c] — Threat Model — OUTPUT ARTIFACT`

**Checklist:**
- [ ] All 5 threat model dimensions from 3c are covered
- [ ] Threat model is internally consistent
- [ ] Threat model is consistent with the methodology section to come
- [ ] Out-of-scope is explicitly stated
- [ ] Writing is formal and precise

---

#### SUB-STEP 6d — System Design / Methodology

**Input artifacts:** 1a (codebase), 3c (threat model), 4a (structure), 5a (figures), 5b (equations)

**Output:**
- Complete methodology section
- All figures and equations inserted at correct locations
- Pseudocode or algorithms where needed

**Artifact:** `[STEP 6d] — Methodology — OUTPUT ARTIFACT`

**Checklist:**
- [ ] Methodology is fully reproducible from this section alone
- [ ] All planned figures are referenced and inserted
- [ ] All planned equations are referenced and inserted
- [ ] Every design decision is justified
- [ ] Methodology is consistent with the codebase from Step 1
- [ ] Methodology directly addresses the threat model from 6c
- [ ] No hand-waving — every component is explained

---

#### SUB-STEP 6e — Evaluation & Results

**Input artifacts:** 3c (RQs), 4a (structure), 5a (result figures)

**Output:**
- Evaluation setup (datasets, baselines, metrics, environment)
- Results organized by RQ
- All result figures and tables inserted
- Statistical significance noted where applicable

**Artifact:** `[STEP 6e] — Evaluation & Results — OUTPUT ARTIFACT`

**Checklist:**
- [ ] Every RQ from 3c has a corresponding result
- [ ] Evaluation setup is fully described and reproducible
- [ ] Baselines are clearly defined and justified
- [ ] All metrics are defined before use
- [ ] All result figures are referenced and inserted
- [ ] Results are reported with appropriate precision
- [ ] No cherry-picked results — all relevant results are shown
- [ ] Statistical significance is addressed

---

#### SUB-STEP 6f — Discussion & Limitations

**Input artifacts:** 6e (results), 3b (contributions)

**Output:**
- Discussion of what the results mean beyond the numbers
- How results validate each contribution
- Honest, specific limitations
- Future work directions

**Artifact:** `[STEP 6f] — Discussion & Limitations — OUTPUT ARTIFACT`

**Checklist:**
- [ ] Every contribution from 3b is validated or discussed in light of results
- [ ] Limitations are honest and specific — not generic disclaimers
- [ ] At least 3 concrete future work directions given
- [ ] Discussion does not repeat results — it interprets them
- [ ] No overclaiming beyond what results support

---

#### SUB-STEP 6g — Conclusion

**Input artifacts:** 6a (introduction), 3b (contributions), 6f (discussion)

**Output:**
- Conclusion section summarizing the work and its impact

**Artifact:** `[STEP 6g] — Conclusion — OUTPUT ARTIFACT`

**Checklist:**
- [ ] Conclusion does not introduce new information
- [ ] All contributions are summarized
- [ ] Broader impact is addressed
- [ ] Conclusion is consistent with Introduction — same story, closed loop
- [ ] Within 1 page

---

#### SUB-STEP 6h — References

**Input artifacts:** 2a, 2b (all verified papers), all 6a–6g artifacts

**Output:**
- Complete IEEE-formatted reference list
- Every citation used in the paper included
- No citation included that doesn't appear in the paper

**Artifact:** `[STEP 6h] — References — OUTPUT ARTIFACT`

**Checklist:**
- [ ] Every in-text citation has a reference entry
- [ ] Every reference entry is cited at least once in the text
- [ ] All references are formatted in IEEE style
- [ ] No reference is hallucinated — all verified from Step 2
- [ ] References are numbered in order of appearance
- [ ] No duplicate references

---

### STEP 7 — Critical Review & Final Polish

---

#### SUB-STEP 7a — Hostile Peer Review

**Task:**
- Read all Step 6 artifacts as a complete paper.
- Review as the most hostile, rigorous peer reviewer possible.

**Output:**
- Numbered list of every weakness, unsupported claim, unclear argument, logical gap, or missing piece
- Severity rating for each: Critical / Major / Minor
- Specific suggested fix for each issue

**Artifact:** `[STEP 7a] — Hostile Peer Review — OUTPUT ARTIFACT`

**Checklist:**
- [ ] Every section has been reviewed
- [ ] Every contribution claim has been stress-tested
- [ ] Every cited result has been checked for overclaiming
- [ ] Writing quality issues are flagged
- [ ] Logical flow issues are flagged
- [ ] At least 10 issues identified (if fewer, review again more carefully)
- [ ] Every issue has a specific suggested fix

---

#### SUB-STEP 7b — Revision Pass

**Task:**
- Read `[STEP 7a]` artifact.
- Fix every Critical and Major issue. Address all Minor issues where feasible.

**Output:**
- Revised versions of all affected sections
- Changelog: what was changed, where, and why

**Artifact:** `[STEP 7b] — Revision Pass — OUTPUT ARTIFACT`

**Checklist:**
- [ ] Every Critical issue from 7a is resolved
- [ ] Every Major issue from 7a is resolved
- [ ] Minor issues are addressed or explicitly deferred with reason
- [ ] Changelog is complete
- [ ] Revised sections are consistent with each other
- [ ] No new issues introduced by revisions

---

#### SUB-STEP 7c — Final Verification

**Task:**
- Read all revised artifacts.
- Perform final quality and consistency verification.

**Output:**
- Final paper confirmation memo
- Any last corrections
- Submission readiness verdict

**Artifact:** `[STEP 7c] — Final Verification — OUTPUT ARTIFACT`

**Checklist:**
- [ ] All citations are real and correctly formatted
- [ ] All figures are numbered correctly and captioned
- [ ] All equations are numbered correctly
- [ ] Paper tells a single coherent story from abstract to conclusion
- [ ] Abstract matches the actual content of the paper
- [ ] Contributions in Introduction match contributions proven in Evaluation
- [ ] Page count is within 12–16 pages
- [ ] No placeholder text, TODOs, or unfinished sections remain
- [ ] Submission readiness verdict given: Ready / Needs Minor Work / Needs Major Work

---

## QUALITY BAR

This paper must be submittable to **IEEE S&P, USENIX Security, or ACM CCS** without embarrassment. If it isn't at that level, keep working.

---

## FAILURE CONDITIONS

If any of the following occur, stop and flag immediately before proceeding:
- A checklist item cannot be completed due to missing information
- A novelty claim cannot be grounded in the literature
- A result referenced in the paper does not exist in the codebase or data
- A citation cannot be verified online
- The paper's story becomes internally inconsistent

---

**Begin with STEP 1a. Create the artifact. Run the checklist. Report results. Then stop and await confirmation.**
