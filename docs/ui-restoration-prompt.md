# RedGrid Frontend — UI Restoration Prompt (Old Look → New Codebase)

## Context

RedGrid's frontend was rebuilt from a hand-rolled component codebase (`app-frontend-old`) onto shadcn/Base UI, Tailwind v4 tokens, and the practices in `audit-prompt.md` (`app-frontend-new`). The rebuild improved code quality, accessibility, responsiveness, and token discipline, but along the way some of the density and character of the original design was lost. Some of what's in the new UI is also, independently, not great yet (spacing/alignment that was never quite right, even though nothing in the old screenshot calls it out).

You will be given, per page, two screenshots: `<page>-old.png` and `<page>-new.png`, plus (see "Reference set per page" below) screenshots of pages already finalized earlier in this pass.

## Goal — not mimicry, judgment

> The old screenshot is a strong reference for density, character, and layout intent — not a pixel spec to copy blindly. Your job is to make **the best possible UI** on top of the new codebase, using the old UI as inspiration where it's genuinely better, and your own judgment everywhere else.

This cuts both ways:

- **Where the old UI is better, move toward it.** Tighter density, smaller/sharper typography scale for data-heavy surfaces, hairline dividers instead of shadows, more information visible per screen — adopt these where they improve the page.
- **Where the old UI is worse, do not copy it.** The old app is a lower-quality codebase and it shows in the UI in places: font sizes that dip below comfortable legibility, text/background or text/component contrast that's too low to read easily, spacing that's cramped to the point of hurting scannability. If closing the gap to the old screenshot would reintroduce a legibility or contrast problem, don't make that change — keep (or improve on) what the new UI already does there, and note why you diverged.
- **Where the new UI has its own problems, fix them independently.** Misaligned elements, inconsistent gaps, awkward wrapping — if you see it in `<page>-new.png` and it isn't actually how the old screenshot did it either, it's just a bug. Fix it as good UI craft, not as "restoration." Don't let the absence of an old-screenshot reference for something stop you from improving it.
- Use a simple bar for every call: would a careful designer, shown only the new page and asked to make it excellent, make this exact change? If yes, make it, regardless of which screenshot prompted the idea. If a change would only be justified by "the old one did it this way," but doesn't clearly improve legibility, density, hierarchy, or consistency on its own merits, skip it.

Concretely, regardless of which screenshot motivates a change:
- Never drop below comfortable minimums: don't ship text sizes or text/background contrast that would be harder to read than what the new UI already has today. Old-UI density is a target for tightening spacing/size, not an excuse to make something illegible.
- The old codebase is reference-only for pixels, never for code. Never port its files, inline hex colors, one-off arbitrary Tailwind values, or hand-rolled components into the new codebase.
- Every visual fix must be expressed through the new codebase's existing mechanisms: shadcn primitives (`components/ui/*`), the `@theme` tokens in `globals.css`, and Tailwind utility classes. If a needed value doesn't exist as a token yet, add it to `@theme` following the existing naming convention — don't hardcode it inline.
- Every constraint in `audit-prompt.md` still applies: mobile-first responsiveness, `h-dvh` not `h-screen`, no hardcoded hex/z-index/radius outside tokens, no `role="button"` divs, no raw `<table>`, primitives used via their composed exports, Server/Client Component discipline, no `: any`, no `key={index}`, etc. A visual fix that reintroduces any of those is a regression, not a fix.
- **Minimum diff for a given change**, but don't let "minimum diff" stop you from fixing a real problem — it governs *how* you fix something (prefer a shared token/variant/class over restructuring), not *whether* you fix it.
- Do not change: copy/text content, mock data, information architecture (what's shown where), or add/remove functionality. This is a visual-quality pass, not a feature or content pass.

## Explicitly keep the new codebase's current behavior on these three points

The old UI used text-only navigation with no icons, sharp square corners everywhere, and plain-text status values instead of badges. The new codebase's choices on all three — icons in the sidebar/nav, rounded corners, and rounded status badges — are the preferred direction. Do not revert these, do not flag them as findings, and do not let a "match the old screenshot" instinct override this on any page:
- Keep icons wherever the new UI already has them (sidebar, nav, elsewhere).
- Keep the current corner radius (rounded, not sharp/square) on cards, buttons, badges, inputs, and panels.
- Keep status badges as rounded/pill badges, not plain text.

## What to compare, per page

Work through this checklist against `<page>-old.png` and `<page>-new.png`. For each item, apply the judgment rule above — close the gap only if doing so is a genuine improvement, not just a match.

1. **Typographic density** — font size of body text, labels, table cells, and headline/metric numbers. The old UI generally runs tighter than shadcn defaults; tighten toward it where the new page fell back to loose default sizing *and* the tighter size stays comfortably legible. Do not tighten past the point of easy readability.
2. **Contrast** — for any text, icon, or component you touch, check it reads clearly against its background. If the old UI's version of this element was low-contrast, use the new UI's contrast level (or better), not the old one's.
3. **Borders, dividers, and hairlines** — old UI relies on thin 1px hairline borders/dividers between sections rather than shadow/elevation. Adopt this where it improves visual organization.
4. **Spacing and padding** — row height, cell padding, section gaps. Tighten toward the old UI's density where it improves scannability without crowding content.
5. **Alignment and layout correctness** — check both screenshots independently for misalignment, inconsistent gaps, or awkward wrapping, and fix what you find even if the old screenshot has the same issue or no equivalent element at all.
6. **Color usage on secondary text** — old UI often uses several distinct muted-gray steps rather than one flat `muted-foreground`; consider reintroducing that gradation for hierarchy where it aids scanning and doesn't hurt legibility.
7. **Sidebar / header chrome** — width of the sidebar, height of the top bar, and whether panels that were compact in the old UI grew taller than needed. (Icons and corner radius on this chrome stay as-is — see above.)
8. **Component sizing/weight** — badges, buttons, chips, tags: compare size and font weight (not shape/roundedness, which stays as the new UI has it).
9. **Data-dense surfaces** — tables, KPI strips, log/activity feeds: row height, font size, column padding, and whether the current KPI/table variant choice fits the page as well as an alternative variant already in the codebase would.

## Consistency across pages

The same kind of surface (a KPI strip, a table, a detail panel, a status badge) should end up looking and behaving the same way everywhere it appears, not re-derived from scratch per page. Two mechanisms enforce this:

### 1. Reference set per page

When processing page N, attach:
- `<page-N>-old.png` and `<page-N>-new.png` (required, as always), and
- **one or two screenshots of the already-finalized result** of the most visually-similar page(s) processed earlier in this pass (e.g. when doing a second table-heavy page, attach the finalized screenshot of the first table-heavy page you fixed).

Use the finalized reference screenshot as the primary guide for any shared surface type it demonstrates (table density, KPI tile style, badge sizing, panel chrome) — match that, rather than re-deriving the same decision from `<page-N>-old.png` independently. Only deviate from a prior finalized page's pattern if this page's content genuinely requires it, and say so explicitly when you do.

### 2. Style decision log (append to this file)

After finishing each page, append a short entry below under "Decisions made so far" recording any *reusable* decision — a token value, a component variant choice, a spacing pattern — not page-specific content. Before starting a new page, read this log first. If a decision already exists for the surface type you're looking at, apply it directly instead of re-judging it from screenshots; only add a new entry when you hit a surface type not yet covered.

## Process per page

1. Read "Decisions made so far" below for any patterns that already apply to this page's surface types.
2. Look at `<page>-old.png`, `<page>-new.png`, and the attached finalized reference page(s) side by side.
3. List concrete diffs using the checklist above, and independent new-UI issues per item 5 — cite what you see, not what you assume. Do not list icons, corner radius, or badge shape as diffs.
4. For each diff, decide (per "Goal — not mimicry, judgment") whether closing it is actually an improvement. Discard any that aren't.
5. Find the responsible shared token/component/class in the new codebase (check `globals.css` `@theme` blocks and `components/ui/` before touching a page-level file).
6. Apply the smallest change that achieves the improvement, using existing tokens/primitives, or extending the token scale if nothing fits.
7. Confirm the change doesn't violate any `audit-prompt.md` rule, and doesn't drop contrast or legibility below what the new UI already had.
8. Append any reusable decision to the style decision log.

## Output

For each page you process, report:
- **Diffs found and judgment applied** — for each, whether you made the change and why (improvement) or skipped it (would hurt legibility/contrast, or wasn't actually better)
- **New-UI-only issues fixed** — alignment/spacing bugs unrelated to the old screenshot
- **Changes made** (file, before → after, one line each)
- **New log entries added** (if any)

---

## Decisions made so far

*(Agent: append one bullet per reusable decision here as pages are completed. Format: `**<surface type>**: <decision> — first applied on <page>`.)*

- **Wizard/Forms**: Use `text-xs font-semibold uppercase tracking-widest` for block labels and step headings, and `text-xs` for descriptions/hints instead of `text-base` for tighter typographic density. — first applied on missions/new
- **Wizard/Forms**: Text inputs should use `text-sm` without tight tracking for readability while maintaining a compact height. — first applied on missions/new
- **Radio Groups**: Use `text-xs leading-relaxed` for option descriptions instead of `text-base leading-snug tracking-tight` for a tighter density matching the old UI. — first applied on missions/new
- **Wizard/Forms**: MetaRow key-value pairs should use `text-xs` for both the uppercase label and the value, instead of `text-sm`, to match the old UI sidebar density. — first applied on missions/new (Step 2)
- **Wizard/Forms**: Input unit suffixes and prefixes (like `$`, `sec`, `attempts`) should use `text-xs` instead of `text-base` to match the tighter density of their corresponding inputs. — first applied on missions/new (Step 2)
- **Surface Cards**: Remove internal hairlines/dividers and use transparent backgrounds on tags/chips for a cleaner, denser look. — first applied on missions/new (Step 3)
- **Surface Cards**: Sub-headers (like protocol or specialists) should use `text-[10px] font-semibold uppercase tracking-widest` rather than `text-sm` or `text-base` for tighter typographic density. — first applied on missions/new (Step 3)
- **Surface Cards**: The primary title of a selected card should use `text-primary` rather than `text-foreground` to match the old UI's vibrant selected state. — first applied on missions/new (Step 3)
- **Tags/Chips**: Within dense cards, use `text-[10px] uppercase tracking-widest` rather than `text-sm` for secondary tags, with a tighter `px-1.5 py-0.5` padding. — first applied on missions/new (Step 3)
