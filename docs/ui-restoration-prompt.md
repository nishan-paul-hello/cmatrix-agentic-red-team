# RedGrid Frontend — UI Restoration Prompt (Old Look → New Codebase)

## Context

RedGrid's frontend was rebuilt from a hand-rolled component codebase (`app-frontend-old`) onto shadcn/Base UI, Tailwind v4 tokens, and the practices in `audit-prompt.md` (`app-frontend-new`). The rebuild improved code quality, accessibility, responsiveness, and token discipline — but along the way the **visual density and styling drifted** from the original design. The old UI is the correct visual target. The new codebase is the correct engineering foundation. Your job is to close the visual gap **without giving up any of the engineering gains**.

You will be given, per page, two screenshots: `<page>-old.png` (target look) and `<page>-new.png` (current, incorrect look). Sometimes more than one screenshot pair covers different states of the same page (e.g. list view + detail view) — treat each pair as its own comparison.

## Prime directive

> Make the new page **look** like the old screenshot. Do not make it **behave, structure, or code** like the old app.

Concretely:
- The old codebase is reference-only for pixels. Never port its files, inline hex colors, one-off arbitrary Tailwind values, or hand-rolled components into the new codebase.
- Every visual fix must be expressed through the new codebase's existing mechanisms: shadcn primitives (`components/ui/*`), the `@theme` tokens in `globals.css`, and Tailwind utility classes. If a needed value doesn't exist as a token yet, add it to `@theme` following the existing naming convention — don't hardcode it inline.
- Every constraint in `audit-prompt.md` still applies while you do this: mobile-first responsiveness, `h-dvh` not `h-screen`, no hardcoded hex/z-index/radius outside tokens, no `role="button"` divs, no raw `<table>`, primitives used via their composed exports, Server/Client Component discipline, no `: any`, no `key={index}`, etc. A visual fix that reintroduces any of those is a regression, not a fix — reject that approach and find another way to hit the same pixels.
- **Minimum diff.** Prefer adjusting a shared token, a shared component's variant, or a single class list over restructuring a component. If the same drift shows up on many pages (see "Systemic" below), fix it once at the shared source, not page-by-page.
- Do not change: copy/text content, mock data, information architecture (what's shown where), or add/remove functionality. This is a pure visual-fidelity pass.

## What to compare, per page

For each old/new screenshot pair, work through this checklist. Not everything will apply to every page — only report and fix what's actually different.

1. **Typographic density** — font size of body text, labels, table cells, and headline/metric numbers. The old UI runs a much smaller, tighter type scale than shadcn defaults; check whether the new page fell back to default `text-sm`/`text-base` sizing instead of the project's own density tokens.
2. **Corner radius** — old UI is sharp-edged (near-zero radius) on cards, buttons, badges, inputs, and panels. Check whether shadcn's default rounded corners (from `--radius`) leaked through unchanged on a given surface.
3. **Borders, dividers, and hairlines** — old UI relies on thin 1px hairline borders/dividers between sections (sidebar, header, table rows, KPI tiles) rather than shadow/elevation. Check for missing dividers, or dividers that got heavier/softer than the original.
4. **Spacing and padding** — row height, cell padding, section gaps. The old UI is noticeably denser (more rows/info visible without scrolling). Check for padding scale increases (e.g. `py-3` where the original used `py-1.5`).
5. **Color usage on secondary text** — label/muted text in the old UI uses several distinct dark-gray steps (near-invisible until scanned) rather than a single `muted-foreground`. Check whether that gradation collapsed into one flat gray.
6. **Iconography** — check whether icons were added where the old UI was icon-free (or vice versa). Don't assume icons are always the "upgrade" — if the old page had a clean text-only nav/list and the new one added icons, that's drift to fix, not a feature to keep.
7. **Sidebar / header chrome** — width of the sidebar, height of the top bar, and whether panels that were single-line/compact in the old UI grew taller.
8. **Component "skin"** — badges, buttons, chips, tags: compare fill vs. outline style, weight, and size between old and new.
9. **Data-dense surfaces** — tables, KPI strips, log/activity feeds: row height, font size, column padding, and whether the new version's variant choice (e.g. a "card" KPI variant vs. the old page's "dashboard" variant) matches the original layout, not just a visually-similar alternative.

## Known systemic drift (applies across most/all pages)

These come from shared files, so they affect every page that touches them. Check these first — fixing them once at the source will resolve a large share of the per-page diffs before you even look at individual screenshots:

- **Type scale**: `globals.css` defines a custom, much smaller density scale (tight tracking, sub-10px body sizes, large-but-still-compact bold numerics for headline metrics). Confirm every page is actually using these tokens rather than shadcn's untouched default Tailwind sizes.
- **Radius**: the old UI uses effectively square corners everywhere; the new `--radius` base (and its derived `--radius-sm/md/lg/xl` scale) is shadcn's default rounded value. Decide whether to zero out the base token (fixes it everywhere at once) or confirm it was already meant to be near-zero and individual components are overriding it — don't patch radius per component if the token itself is wrong.
- **KPI/metric tiles**: the shared KPI component has multiple variants (e.g. a tight bordered-divider strip with large bold numerals vs. a padded rounded-card grid). Confirm each page is using the variant that matches its old-screenshot layout, not just whichever variant was easiest to wire up during the rebuild.
- **Sidebar and top bar**: check the shared shell/sidebar component for icon usage, fixed width, and top-bar height against the old shell — a change here shows up on literally every page.
- **Table/list row density**: if a shared table wrapper or row component changed padding/font-size defaults, every table in the app inherited that change.

When you find a systemic issue, fix it at its shared source file/token first, then re-check whether the per-page diff you were looking at is already resolved before making a page-local change.

## Process per page

1. Look at `<page>-old.png` and `<page>-new.png` side by side.
2. List concrete diffs using the checklist above — cite what you see, not what you assume ("KPI numerals are ~2x larger and bold in old", not "old looks denser").
3. For each diff, find the responsible shared token/component/class in the new codebase (check `globals.css` `@theme` blocks and `components/ui/` before touching a page-level file — the fix usually lives upstream of the page).
4. Apply the smallest change that closes the gap, using existing tokens/primitives, or extending the token scale if genuinely nothing fits.
5. State, for each change: which file changed, old value → new value, and which screenshot detail it addresses.
6. Confirm the change doesn't violate any `audit-prompt.md` rule (responsiveness, tokens, primitives, a11y, hygiene). If a pixel-perfect match would require violating one of those rules, keep the audit-compliant version and note the remaining gap instead of reverting the rule.

## Output

For each page you process, report:
- **Diffs found** (bulleted, per the checklist)
- **Changes made** (file, before → after, one line each)
- **Skipped/flagged items** — anything where matching the old UI exactly would conflict with `audit-prompt.md` (responsiveness, accessibility, tokens, primitive usage), with a one-line reason.

Do this page by page, but apply systemic fixes (type scale, radius, shell/sidebar, shared KPI/table components) only once, the first time they're needed, and simply reference that fix on later pages instead of repeating it.
