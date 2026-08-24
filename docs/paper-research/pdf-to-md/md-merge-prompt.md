You are an autonomous agent tasked with merging Markdown chunk files from the same research paper into one seamless final file.

**Goal: Zero/minimal token consumption via smart tool-first execution.**
Do NOT read entire chunk files into LLM context. Do NOT rewrite or regenerate paper content with AI. Use file system and shell tools directly.

### 🛠️ Systematic Tool-First Merge Protocol

1. **Deterministic Concatenation via Tool (Python/Bash):**
   - Identify all chunk files in sorted order (`01-*.md`, `02-*.md`, etc.).
   - Run the following Python snippet (copy-paste as-is) to concatenate, strip artifacts, and normalize in one pass:

   ```python
   import re, pathlib

   STRIP_PATTERNS = [
       re.compile(r'^⚙️\s*Chunk\s*\d+.*$'),                        # chunk headers
       re.compile(r'.*\(results continue in the next chunk\).*', re.I),
       re.compile(r'.*\(.*cut off at the end of this chunk.*\).*', re.I),
       re.compile(r'^\*\(.*chunk.*\)\*\s*$', re.I),                # italicised chunk notes
       re.compile(r'.*continues? in the next chunk.*', re.I),
       re.compile(r'.*continued from (the )?previous chunk.*', re.I),
   ]

   chunks = sorted(pathlib.Path('.').glob('[0-9][0-9]-paper.md'))
   out_lines = []
   for chunk in chunks:
       for line in chunk.read_text(encoding='utf-8').splitlines():
           if any(p.match(line.strip()) for p in STRIP_PATTERNS):
               continue
           out_lines.append(line)
       out_lines.append('')   # single blank between chunks

   # Normalize 3+ consecutive blank lines → max 2
   normalized, blank = [], 0
   for line in out_lines:
       if line.strip() == '':
           blank += 1
           if blank <= 2: normalized.append(line)
       else:
           blank = 0
           normalized.append(line)

   out = pathlib.Path('paper.md')
   out.write_text('\n'.join(normalized).rstrip() + '\n', encoding='utf-8')
   print(f"Merged {len(chunks)} chunks → {out} ({out.stat().st_size} bytes, {len(normalized)} lines)")
   ```

2. **Surgical Seam Inspection (Tool-Only / Windowed Read):**
   - Do NOT load the full merged document into chat context.
   - Grep for residual artifacts first (zero-cost check):
     ```bash
     grep -in "next chunk\|previous chunk\|cut off\|continues in\|⚙️" paper.md
     ```
   - If grep returns nothing → skip to step 3.
   - Only if artifacts found: inspect ±5 lines around each hit with `view_file` (StartLine/EndLine).
   - Apply surgical edits with `replace_file_content` or `sed` ONLY for:
     - Duplicate identical headings/sentences across the cut.
     - Split sentences or dangling transition markers missed by step 1.
   - After any edit, re-run blank-line normalization (re-run the Python snippet above or the equivalent one-liner).

3. **Output & Verification:**
   - Run: `wc -l paper.md && test -s paper.md && echo "OK"`
   - Tell me the output filename/path with a 1-line confirmation. No long postamble or token-heavy summaries.
