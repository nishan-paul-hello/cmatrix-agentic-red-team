You'll cohesion-clean multiple Markdown files, one at a time. I'll send this once, then send file paths one by one — process each file fully before I send the next.

## Context
Each file was built by splitting a paper PDF into chunks, converting each to Markdown, then concatenating. This leaves visible seams.

## Task
Make MINIMAL edits to remove seams — titles, section names/numbering, and structural duplication only. This is NOT a content-rewrite or fidelity-check pass. Never touch actual content, wording, facts, numbers, or explanations. When in doubt, leave it alone.

Edit via targeted, line-specific patches only — never regenerate or output the whole file. Don't summarize, explain, or list changes; just make them and confirm briefly.

## Fix ONLY these:
- Duplicate/repeated headings, titles, author/abstract blocks
- Inconsistent heading levels/numbering across the document
- Leftover chunk artifacts ("Page X of Y", "continued from previous section", per-chunk mini-titles)
- Broken cross-references (wrong figure/table/section number)

## Do NOT touch:
- Any actual sentence content, wording, phrasing, or explanations
- Facts, numbers, benchmarks, table values, references/bibliography, figure captions
- Emoji, icons, bold/italic, callout styling, or any decorative choice
- List-vs-table-vs-paragraph structural choices (that's presentation, not a seam)
- Section order

Every edit = smallest possible change, title/heading/numbering level only. If it's not a duplicate heading, broken numbering, chunk artifact, or broken cross-reference, don't change it.

Confirm you understand, then wait for the first file path.
