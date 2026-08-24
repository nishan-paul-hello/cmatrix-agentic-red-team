"""
Merges sorted chunk files (01-paper.md, 02-paper.md, …) in a given folder
into a single paper.md, stripping chunk-boundary artifacts and normalizing
blank lines.

Usage:
    python3 merge.py <folder>
"""

import re, pathlib, sys

STRIP_PATTERNS = [
    re.compile(r'^⚙️\s*Chunk\s*\d+.*$'),
    re.compile(r'.*\(results continue in the next chunk\).*', re.I),
    re.compile(r'.*\(.*cut off at the end of this chunk.*\).*', re.I),
    re.compile(r'^\*\(.*chunk.*\)\*\s*$', re.I),
    re.compile(r'.*continues? in the next chunk.*', re.I),
    re.compile(r'.*continued from (the )?previous chunk.*', re.I),
]

def merge(folder: pathlib.Path) -> None:
    chunks = sorted(folder.glob('[0-9][0-9]-paper.md'))
    if not chunks:
        sys.exit(f"No chunk files found in {folder}")

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
            if blank <= 2:
                normalized.append(line)
        else:
            blank = 0
            normalized.append(line)

    out = folder / 'paper.md'
    out.write_text('\n'.join(normalized).rstrip() + '\n', encoding='utf-8')
    print(f"Merged {len(chunks)} chunks → {out} ({out.stat().st_size} bytes, {len(normalized)} lines)")

    # Seam check
    hits = [
        line for line in normalized
        if re.search(r'next chunk|previous chunk|cut off|continues in|⚙️', line, re.I)
    ]
    if hits:
        print(f"⚠️  {len(hits)} residual artifact(s) found — inspect manually:")
        for h in hits:
            print(f"  {h}")
    else:
        print("✅ No residual artifacts.")

if __name__ == '__main__':
    folder = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path('.')
    merge(folder)
