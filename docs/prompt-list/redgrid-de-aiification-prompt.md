# RedGrid Thesis — De-AI-ification Pass: Standing Instructions

## 0. What This Prompt Is

This is a **standalone, standing instruction set** for a specific, later-stage pass on our MSc thesis report (Chapter 1 and Chapter 2 of `@docs/paper-structure/inception-report-template`, and any subsequent chapters).

This pass runs **only after** a subchapter's content has already been technically refined, verified, and finalized (facts, claims, citations, architecture descriptions, comparisons — all settled). Its sole job is to strip away anything that reads as machine-generated prose, so the final text feels naturally, organically human-written — **without changing what the text says, only how it says it.**

Any change made under this pass must **never** reduce thesis quality. Done correctly, it should only *increase* the organic, professional, human-authored feel of the report. If a stylistic fix would require altering a claim, a citation, a number, or a technical detail, **stop and flag it instead of silently changing meaning.**

---

## 1. Ground Rule

This is a **surface- and style-level rewrite, not a content edit.**

- No claim, number, citation, or architectural description may change meaning.
- No content may be invented, exaggerated, or removed to "sound more human."
- Technical accuracy and rigor already established in the finalized draft must remain fully intact.
- LaTeX structure, referencing, and formatting conventions from `inception-report-template` must remain valid, and the file must still pass `lint-paper-inception`, `format-paper-inception`, and `audit-paper-inception` after this pass.

If in doubt about whether a change crosses from "style" into "content," treat it as content and don't make it without flagging it first.

---

## 2. What Counts as an "AI Signature" — Actively Hunt For and Eliminate

### A. Overused / generic vocabulary
Common LLM tells to replace with precise, domain-appropriate, or plainer language:

`delve`, `boast/boasts`, `intricate`, `myriad`, `plethora`, `embark`, `harness`, `foster`, `bolster`, `paradigm`, `cutting-edge`, `holistic`, `multifaceted`, `unprecedented`, `robust` (as filler), `seamless`, `leverage` (as an overused verb), `landscape` (metaphorical, e.g. "security landscape"), `tapestry`, `testament to`, `underscores`, `showcases`, `navigate the complexities of`, `in today's world/era`, `at its core`, `it is worth noting`, `it is important to note`, `plays a crucial/pivotal role`.

### B. Formulaic transitions and stock phrasing
- Repeated use of `Furthermore,` / `Moreover,` / `Additionally,` / `In conclusion,` / `Overall,` as paragraph openers.
- Generic wrap-up sentences at the end of nearly every paragraph that just restate what was already said — a strong AI tell.
- Mechanical "on the one hand... on the other hand" framing used reflexively rather than where genuinely warranted.

### C. Structural tells
- Rigid **rule-of-three** patterns everywhere (always exactly three examples, three reasons, three challenges) — vary the count based on what's actually true, not on a template.
- Overly symmetric paragraph architecture: every paragraph the same length and shape (claim → three points → summary sentence).
- Excessive, uniform use of em dashes for asides.
- Bullet points used where flowing academic prose is the expected register (e.g., narrative background/motivation sections), or bullets that are themselves suspiciously parallel and evenly weighted.
- Perfectly uniform sentence rhythm — little to no natural variation in sentence length ("burstiness"). Real academic writing mixes short, direct sentences with longer, more complex ones irregularly.

### D. Tone tells
- Excessive hedging padding ("it could be argued that," "in many respects," "to some extent") used as filler rather than genuine epistemic caution.
- Over-enthusiastic framing of ordinary technical facts — treating a standard design choice as if it were remarkable.
- Generic, interchangeable connective sentences before citations — a near-identical sentence pattern used to introduce every cited work.

### E. Formatting / citation tells
- Suspiciously uniform citation density or placement (e.g., a citation dropped at the exact end of every paragraph regardless of where the borrowed idea actually appears).
- Mechanical repetition of section-summary sentences that mirror the section heading almost verbatim.

---

## 3. How to Fix It — Constructive Direction, Not Just Deletion

For every instance identified above:

1. **Rewrite, don't just synonym-swap.** Replacing "delve into" with "explore" is still a shallow disguise if the sentence's rhythm and structure are unchanged. Rebuild the sentence itself — reorder clauses, change sentence length, change how the idea is framed — the way a specific human author with a specific voice would write it.
2. **Introduce natural variance deliberately.** Vary sentence length and paragraph shape across the subchapter. Don't make every paragraph follow the same claim → evidence → summary template.
3. **Prefer precise, field-specific language over generic intensifiers.** State exactly what the technical claim is instead of reaching for a grand-sounding but vague word.
4. **Let some paragraphs end on a substantive point rather than a restatement.** Not every paragraph needs a summarizing final sentence — real academic writing often just moves on to the next idea.
5. **Vary how sources are introduced.** Don't reuse the same sentence pattern ("X et al. propose a method that...") for every citation — vary structure, the position of the citation within the sentence, and how the source's contribution is framed.
6. **Keep formality and rigor intact.** This is still a formal MSc thesis. The goal is organic, precise, human academic voice — not casual language, not informality, not personality quirks for their own sake.

---

## 4. Non-Negotiables

- No claim, number, citation, or architectural description may change meaning.
- No content may be invented, exaggerated, or removed purely to "sound more human."
- The finalized technical content this pass is applied to must remain fully intact in substance.
- The file must remain valid LaTeX and continue to comply with the project's conventions — verified via `lint-paper-inception`, `format-paper-inception`, and `audit-paper-inception`.

---

## 5. Where This Pass Fits in the Workflow

1. The subchapter's content has already been technically refined, verified, and finalized (facts, claims, citations, architecture descriptions, comparisons — all settled).
2. **This pass runs on top of that finalized content** — same file(s), style-only revision, hunting for and eliminating every pattern in Section 2 and applying the fixes in Section 3.
3. **Re-check cross-subchapter consistency** afterward: since this pass changes phrasing, verify the subchapter still reads consistently in tone and terminology with its neighboring subchapters (don't introduce a new voice that clashes with the rest of the chapter).
4. Only after this pass and the consistency check are complete should the final build sequence run:

```makefile
make paper-inception          # generate the PDF
make lint-paper-inception     # lint the PDF/LaTeX source
make format-paper-inception   # format the PDF/LaTeX source
make audit-paper-inception    # audit the PDF for convention compliance
```

Run this sequence only once, at the very end of the task — not iteratively during the style pass.

---

## Immediate Next Step

Confirm you understand this pass is style-only, that it applies strictly after content is finalized, and that you will flag rather than silently resolve any case where a stylistic fix risks touching technical meaning. Then wait for the specific subchapter file path to apply this pass to.
