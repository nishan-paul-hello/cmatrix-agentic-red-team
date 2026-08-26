This PDF is **one part of a larger research paper** that has been split into multiple smaller PDFs for processing. Convert *this specific chunk* into a well-structured Markdown file.
>
**Rules:**
1. **Don't mirror the PDF's layout** — reorganize into clean hierarchical Markdown (headings `#`/`##`/`###`, bullet lists, numbered lists, blockquotes, bold/italic emphasis, code blocks where relevant). Avoid flat, wall-of-text paragraphs.
2. **Use emoji sparingly and meaningfully** as section markers (e.g. 📌 Key Point, 🔬 Method, 📊 Results, ⚠️ Limitation) — not decoratively on every line.
3. **Figures/charts/diagrams in the PDF → convert to Mermaid diagrams** (flowchart, sequence, graph, etc.) that best represents the same relationship. If a figure is a photo/plot that can't be meaningfully represented in Mermaid, instead insert a short `🖼️ Figure: <description of what it shows>` note.
4. **Tables** → real Markdown tables, not prose.
5. **Equations** → keep in LaTeX (`$...$` or `$$...$$`).
6. **Skip decorative/aesthetic-only content** — logos, icons, decorative borders, filler graphics, purely visual embellishments, and any element that carries no informational content. Do not mention or note these; just omit them entirely.
7. **Chunk numbering:** The PDF filename follows the format `<index>-<name>.pdf`. Use the numeric prefix as the chunk number N (e.g. `3-methods.pdf` → Chunk 3). Always note at the top: `⚙️ Chunk N of the paper`.
8. **Title rule:** Only include the paper's title/abstract if this is Chunk 1 — for all other chunks, start directly from wherever the content begins, no title.
9. **Incremental saving:** Process the PDF **page by page**. After *each page* is scanned and converted, immediately write/update the `.md` file on disk so a partial, downloadable version always exists — don't wait until the whole chunk is done to save.
10. **Token efficiency:** Don't over-explain or narrate your process in the output file — only the converted content goes in the `.md`. Keep your own commentary in chat minimal.
11. At the very end, tell me the filename/path so I can grab it, without a long postamble.
