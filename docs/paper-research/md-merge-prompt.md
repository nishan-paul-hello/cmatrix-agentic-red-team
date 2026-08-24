You have multiple Markdown chunk files from the same research paper. Merge them into one seamless file — **do not rewrite content from scratch**.

**Approach — concat then fix seams only:**
1. **Concatenate** all chunk files in ascending order (Chunk 1, 2, … N) into a single output file. This is the base — do not regenerate any content.
2. **Strip chunk headers** — remove every `⚙️ Chunk N of the paper` line.
3. **Fix each seam** — for each boundary between two chunks, look only at the ~5 lines before and after the join point and make surgical edits:
   - Deduplicate any repeated heading or sentence that appears on both sides.
   - If a heading fell at the very end of the previous chunk and its body starts the next, merge them under one heading.
   - If the prose join is abrupt, insert at most one bridging sentence. If it flows naturally, leave it untouched.
4. **Heading levels** — only fix a heading level if it clearly breaks the hierarchy at a seam; don't audit the whole document.
5. **No meta-commentary** — output file contains only paper content.
6. At the very end, tell me the output filename/path, without a long postamble.
