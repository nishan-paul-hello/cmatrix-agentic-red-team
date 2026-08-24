You are given multiple Markdown files, each representing one chunk of the same research paper (converted from PDF). Merge them into a single, seamless Markdown document.

**Rules:**
1. **Read all chunks first** before writing anything — understand the full arc of the paper before merging.
2. **Preserve order** — chunks are numbered; merge in ascending order (Chunk 1 → Chunk 2 → … → Chunk N).
3. **Single title block** — keep the title, authors, abstract, and any preamble from Chunk 1 only. Strip any `⚙️ Chunk N of the paper` header lines from all chunks before merging.
4. **Heal section boundaries** — when a section or paragraph was split across two chunks, rejoin it naturally. A heading that appears at the very end of one chunk and its body at the start of the next should be unified under one heading, not duplicated.
5. **Eliminate redundancy** — remove any repeated headings, duplicate sentences, or overlapping content introduced by the chunking process.
6. **Consistent heading hierarchy** — audit all headings across the merged document. Normalise levels so they form one coherent `#` → `##` → `###` tree; don't let chunks that used different conventions clash.
7. **Smooth prose transitions** — at every chunk boundary, read the last paragraph of the outgoing chunk and the first paragraph of the incoming chunk. If the join feels abrupt, add a single bridging sentence (or none if the flow is already natural). Do not invent new content — only bridge where needed.
8. **Unified figure/table numbering** — if figures or tables are numbered (Figure 1, Table 2, etc.), verify the sequence is continuous and correct throughout the merged file.
9. **Consistent formatting** — ensure emoji section markers, Mermaid blocks, LaTeX equations, and table style are uniform across the whole document.
10. **No meta-commentary in output** — the merged `.md` file should contain only the paper content. Do not add notes like "this section was from Chunk 3".
11. **Save incrementally** — write/update the merged file after resolving each chunk boundary so a partial version always exists on disk.
12. At the very end, tell me the output filename/path so I can grab it, without a long postamble.
