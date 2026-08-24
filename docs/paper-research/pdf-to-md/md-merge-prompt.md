You are an autonomous agent tasked with merging Markdown chunk files from the same research paper into one seamless final file.

**Goal: Zero/minimal token consumption via smart tool-first execution.**
Do NOT read chunk files or merge.py into LLM context. Use shell tools directly.

### 🛠️ Systematic Tool-First Merge Protocol

1. **Deterministic Concatenation via Script:**
   - Run the pre-built script (do NOT read its contents):
     ```bash
     python3 docs/paper-research/pdf-to-md/merge.py <target-folder>
     ```
   - The script handles: sorted concatenation, artifact stripping, blank-line normalization, and seam checking in one pass.
   - It will print a summary and flag any residual artifacts.

2. **Surgical Seam Fix (only if script reports artifacts):**
   - Inspect ±5 lines around each flagged hit with `view_file` (StartLine/EndLine).
   - Apply surgical edits with `replace_file_content` or `sed` ONLY for:
     - Duplicate identical headings/sentences across the cut.
     - Split sentences or dangling transition markers.

3. **Output & Verification:**
   - Run: `wc -l <target-folder>/paper.md && test -s <target-folder>/paper.md && echo "OK"`
   - Report the output path with a 1-line confirmation. No long summaries.
