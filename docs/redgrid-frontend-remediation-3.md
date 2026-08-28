# RedGrid Frontend — Refactor Review (Round 3)

**Audience:** AI coding agent
**Context:** Follow-up to `REDGRID_FRONTEND_REVIEW_2.md`, which left one regression (R1) and five
open items (2's follow-up, 8, 13, 14, 15/16 partials). This round verified the delivered zip both
by inspection and, this time, by actually running the toolchain (`npm install`, `tsc --noEmit`,
`eslint`, `vitest run`) — all three are clean. Same hard constraint as always: no visual or
behavioral change outside explicit bug fixes.

**Verdict up front:** this round closed out almost everything outstanding, cleanly and without
introducing a new regression this time. `tsc` reports zero errors, `eslint src` reports zero
problems, and all 16 unit tests pass. Two small items remain: one leftover file that should never
have shipped, and item 14 (large-component decomposition), which still hasn't moved.

---

## Verified clean by running the toolchain

- `npx tsc --noEmit` → 0 errors.
- `npx eslint src --ext .ts,.tsx` → 0 problems.
- `npx vitest run` → 2 test files, 16/16 tests passing (`tests/fsm.test.ts`, `tests/utils.test.ts`).

This directly closes Round 2's item 12 ("not verifiable in this pass") — dependency arrays and
lint rules are confirmed compliant, not just visually plausible.

---

## R1 (previous regression) — **Fixed correctly.**
`StateMachineModal` now has its panel wrapper back: `w-panel-2xl` (a new named token, confirmed
`= 620px` in `globals.css`, matching the pre-regression width exactly), with `role="dialog"`,
`aria-modal="true"`, and `aria-labelledby` pointing at the visible title. This also folds in item
16's aria work for this specific modal. Good fix — same visual footprint as before R1 broke it,
plus it's now more accessible than the original ever was.

---

## Item 2 follow-up (shared repository instances) — **Fixed.**
`MissionWorkspaceContainer.tsx` now pulls `missionRepository`/`specialistRepository` from
`useServices()` instead of constructing its own. The only remaining `new MissionRepository()` /
`new SpecialistRepository()` calls in the codebase are the two `useMemo`-wrapped ones inside
`ServicesProvider` itself — there is now exactly one mock-data instance per session, reachable
from everywhere. The static `getMissions`/`getMissionById` helpers that used to create their own
throwaway instances were removed entirely (confirmed no remaining callers). `SpecialistRepository`
still exposes a `static getTimeline()`, but that reads a separate, never-mutated `TIMELINE`
fixture — it was never part of the CRUD mock database, so leaving it static is fine and not a
repeat of the original bug.

## Item 8 (panel-width tokens) — **Meaningfully advanced, intentionally incremental.**
A `--width-panel-{sm,md,lg,xl,2xl}` scale (280/300/540/600/620px) now exists and is applied to
roughly two dozen sidebars, modals, and settings panels, each mapped to the token matching its
prior exact pixel value — spot-checked several (`UCBModal` 540→`w-panel-lg`, `CommandPaletteView`
600→`w-panel-xl`, `OraclePanel`/`AuditLogPage` 300→`w-panel-md`) and all preserve their original
width. A long tail of one-off widths remains un-tokenized (drawer widths like `w-[340px]`,
`w-[320px]`, `w-[264px]`, table-cell `max-w-[180px]`, etc., across `Dashboard.tsx`, `Shell.tsx`,
`ExecDrawer.tsx`, and others) — this is fine as an intentionally incremental pass rather than a
one-shot sweep (which is exactly what avoided a repeat of the R1-style regression this time), but
it's not finished. Continue the same panel-by-panel-with-visual-check approach for the remaining
widths whenever this gets picked up again.

## Item 13 (memoization) — **Fixed for the named targets.**
All four components flagged in the original brief now use `React.memo`:
`TrajectoryStepRow`, `AttackGraphCanvasView` (and its inner component), `AttackGraphCanvasContainer`,
and `AuditLogPage` (which also picked up a `useCallback` for its selection-toggle handler). Overall
`React.memo` count moved from 9 → 12; that's appropriately targeted rather than blanket-applied,
matching the original instruction not to memoize components with trivial render cost.

## Item 14 (large component decomposition) — **Still not addressed; unchanged since Round 2.**
Components over 150 lines: 51, same as Round 2's count. `BenchmarkTierViews.tsx` (518 lines, the
file that absorbed `BenchmarkOverviewTab.tsx`'s logic last round) is still the largest file in the
codebase and hasn't been split further; `ExecDrawer.tsx` grew slightly (287 → 316 lines, from the
aria/dialog work) and `MissionOverview.tsx` (290 lines) is untouched. This item has had one good
slice (Round 2's `BenchmarkOverviewTab` split) but no further progress across two rounds now — if
it's intentionally deprioritized in favor of the correctness/a11y/testing work (a reasonable
call), say so explicitly rather than letting it sit silently open.

## Item 15 (tests) — **Fixed to the scope originally asked for.**
`tests/fsm.test.ts` was added with 12 tests covering valid and invalid transitions for all six FSM
domains (`Mission`, `Task`, `Benchmark`, `Spec`, `Finding`, `VdgNode`) — this was the top-priority
gap called out twice now, and it's properly closed. `tests/utils.test.ts` grew from 2 to 4 tests,
adding coverage for `sanitizeInput` and `navItemForPath` as requested. The `as any` cast flagged
last round in `utils.test.ts` is gone — `getStatusColor("UNKNOWN_STATUS")` is now called with a
plain string, no workaround needed. Good, no further action needed on the specific asks; broader
component-level smoke tests were never more than a "nice to have" in the original brief and can
stay optional.

## Item 16 (aria on modals/drawers) — **Fixed.**
All five components named in Round 2 (`StateMachineModal`, `UCBModal`, `FindingDetailDrawer`,
`VDGNodeDrawerView`, `ExecDrawer`) now have `role="dialog"`, `aria-modal="true"`, and
`aria-labelledby` wired to each modal's visible title element. Confirmed by direct inspection of
all five files.

---

## New, small finding

### N1. Leftover one-off migration script committed at the repo root
`replace_semantic.js` (47 lines, a plain Node script that string-replaces six
`var(--color-hex-*)` values with their semantic equivalents — clearly the mechanism used to do
item 5's semantic-token pass) is still sitting in the project root. It's not part of `src/`, and
it doesn't affect the app, but it did break a repo-wide `eslint .` run (TypeScript-aware ESLint
tried to type-check it against `tsconfig.json` and failed, since it's plain CommonJS and outside
the `include` path) — `eslint src` alone is clean, so this isn't blocking, but it's dead tooling
that shouldn't ship. Delete it (or move one-off migration scripts to a `scripts/` folder that's
excluded from lint, if you want to keep them around as a record of what was done).

---

## Summary for next pass

**Nothing urgent is broken.** In order of remaining value:
1. Delete `replace_semantic.js` (trivial).
2. Decide on item 14 explicitly — either commit to a decomposition pass on
   `BenchmarkTierViews.tsx`/`MissionOverview.tsx`/`ExecDrawer.tsx`, or mark it out of scope for
   this project and stop carrying it forward as an open item.
3. Continue item 8's remaining one-off panel/drawer widths at the same careful, incremental pace
   that worked this round.

Everything else from both prior reviews (R1, items 1–7, 9–13, 15–16) is confirmed fixed, and for
the first time this round's verification included actually running `tsc`, `eslint`, and the test
suite rather than inspection alone — all three are green.
