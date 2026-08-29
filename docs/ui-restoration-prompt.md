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

## Explicitly keep the new codebase's current behavior on these three points

The old UI used text-only navigation with no icons, sharp square corners everywhere, and plain-text status values instead of badges. The new codebase's choices on all three — icons in the sidebar/nav, rounded corners, and rounded status badges — are the preferred direction and are **not** drift to fix. Do not revert these, do not flag them as findings, and do not let a "match the old screenshot" instinct override this on any page:
- Keep icons wherever the new UI already has them (sidebar, nav, elsewhere).
- Keep the current corner radius (rounded, not sharp/square) on cards, buttons, badges, inputs, and panels.
- Keep status badges as rounded/pill badges, not plain text.

## What to compare, per page

For each old/new screenshot pair, work through this checklist. Not everything will apply to every page — only report and fix what's actually different. Skip anything covered by the "keep as-is" list above even if the old screenshot looks different in that respect.

1. **Typographic density** — font size of body text, labels, table cells, and headline/metric numbers. The old UI runs a much smaller, tighter type scale than shadcn defaults; check whether the new page fell back to default `text-sm`/`text-base` sizing instead of the project's own density tokens.
2. **Borders, dividers, and hairlines** — old UI relies on thin 1px hairline borders/dividers between sections (sidebar, header, table rows, KPI tiles) rather than shadow/elevation. Check for missing dividers, or dividers that got heavier/softer than the original.
3. **Spacing and padding** — row height, cell padding, section gaps. The old UI is noticeably denser (more rows/info visible without scrolling). Check for padding scale increases (e.g. `py-3` where the original used `py-1.5`).
4. **Color usage on secondary text** — label/muted text in the old UI uses several distinct dark-gray steps (near-invisible until scanned) rather than a single `muted-foreground`. Check whether that gradation collapsed into one flat gray.
5. **Sidebar / header chrome** — width of the sidebar, height of the top bar, and whether panels that were single-line/compact in the old UI grew taller. (Icons and corner radius on this chrome stay as they are in the new UI — see above.)
6. **Component sizing/weight** — badges, buttons, chips, tags: compare size and font weight between old and new (not shape/roundedness, which stays as the new UI has it).
7. **Data-dense surfaces** — tables, KPI strips, log/activity feeds: row height, font size, column padding, and whether the new version's variant choice (e.g. a "card" KPI variant vs. the old page's "dashboard" variant) matches the original layout, not just a visually-similar alternative.

## Known systemic drift (applies across most/all pages)

These come from shared files, so they affect every page that touches them. Check these first — fixing them once at the source will resolve a large share of the per-page diffs before you even look at individual screenshots:

- **Type scale**: `globals.css` defines a custom, much smaller density scale (tight tracking, sub-10px body sizes, large-but-still-compact bold numerics for headline metrics). Confirm every page is actually using these tokens rather than shadcn's untouched default Tailwind sizes.
- **KPI/metric tiles**: the shared KPI component has multiple variants (e.g. a tight bordered-divider strip with large bold numerals vs. a padded rounded-card grid). Confirm each page is using the variant that matches its old-screenshot layout, not just whichever variant was easiest to wire up during the rebuild. (Keep the current corner radius on these tiles — only fix numeral size/weight and padding.)
- **Sidebar and top bar**: check the shared shell/sidebar component's fixed width and top-bar height against the old shell — a change here shows up on literally every page. Icon usage in the sidebar stays as the new UI has it; don't remove icons to match the old text-only nav.
- **Table/list row density**: if a shared table wrapper or row component changed padding/font-size defaults, every table in the app inherited that change.

When you find a systemic issue, fix it at its shared source file/token first, then re-check whether the per-page diff you were looking at is already resolved before making a page-local change. Remember the three exceptions above apply everywhere this catalogue is used — never reintroduce square corners, remove icons, or flatten badges back to plain text while doing systemic fixes.

## Process per page

1. Look at `<page>-old.png` and `<page>-new.png` side by side.
2. List concrete diffs using the checklist above — cite what you see, not what you assume ("KPI numerals are ~2x larger and bold in old", not "old looks denser"). Do not list icons, corner radius, or badge shape as diffs — those are intentionally staying as the new UI has them.
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
