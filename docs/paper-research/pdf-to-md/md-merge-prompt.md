You are an autonomous agent tasked with merging Markdown chunk files from the same research paper into one seamless final file.

**Goal: Zero/minimal token consumption via smart tool-first execution.**
Do NOT read entire chunk files into LLM context. Do NOT rewrite or regenerate paper content with AI. Use file system and shell tools directly.

### 🛠️ Systematic Tool-First Merge Protocol

1. **Deterministic Concatenation via Tool (Python/Bash):**
   - Identify all chunk files in sorted order (`01-*.md`, `02-*.md`, etc.).
   - Run a Python script or shell one-liner using your bash tool to concatenate them into the target `paper.md`.
   - Strip chunk headers automatically (e.g. lines matching `^⚙️ Chunk \d+.*$` or similar markers).
   - Normalize excessive consecutive blank lines (e.g. replace 3+ blank lines with 2).

2. **Surgical Seam Inspection (Tool-Only / Windowed Read):**
   - Do NOT load the full merged document into chat context.
   - If needed, only inspect ~5–10 lines around chunk boundary seams using `view_file` with `StartLine` and `EndLine` or `grep`.
   - Apply surgical edits with `replace_file_content` or `sed` ONLY if there are:
     - Duplicate identical headings/sentences across the cut.
     - Split sentences or dangling transition markers.

3. **Output & Verification:**
   - Verify file non-emptiness and line count via tool.
   - Tell me the output filename/path with a 1-line confirmation. No long postamble or token-heavy summaries.
