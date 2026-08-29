# RedGrid Frontend Audit Findings

*Audit performed against `app-frontend/src/` based on `docs/audit-prompt.md` criteria.*

## High Severity

### 1. Client-Side Auth Gating (Flash of Blank Page)
**File:** `app-frontend/src/app/(app)/layout.tsx`
**Offending line:** `if (!isReady) { return null; }`
**Why it's wrong:** Auth-gating logic that blocks rendering after mount inside a client component causes a flash-of-blank-page on every navigation.
**Fix:** Move auth-checking logic to Next.js Middleware (`middleware.ts`) or a Server Component check, rather than relying on a client-side hook (`useAuthGuard`) to render `null` temporarily.

### 2. Missing Small-Viewport Fallback for Modal List
**File:** `app-frontend/src/features/core/components/CommandPaletteView.tsx`
**Offending line:** `<div ref={listRef} className="max-h-[420px] overflow-y-auto">`
**Why it's wrong:** The results list container has a hardcoded `max-h-[420px]` inside a modal context. On small devices (e.g., landscape mode or very small screens), 420px can overflow the viewport since there is no viewport-relative cap.
**Fix:** Provide a viewport-relative cap, e.g., `className="max-h-[min(420px,60vh)] overflow-y-auto"`.

---

## Medium Severity

### 3. Layout-Role Width Using Raw Pixel Value
**File:** `app-frontend/src/features/missions/components/workspace/MissionLiveState.tsx`
**Offending line:** `className="... lg:w-[256px] ..."`
**Why it's wrong:** A layout-role container (side panel) is using a raw pixel value `lg:w-[256px]`. It should reuse an existing design token for panel widths to maintain consistency across the app.
**Fix:** Replace `lg:w-[256px]` with `lg:w-panel-sm-alt` (260px) or `lg:w-panel-sm-narrow` (220px) which are defined in `globals.css`.

### 4. Route-Level "use client" Directives
**Files:**
- `app-frontend/src/app/login/page.tsx`
- `app-frontend/src/app/(app)/layout.tsx`
- `app-frontend/src/app/page.tsx`
**Offending line:** `"use client";` at line 1.
**Why it's wrong:** Route entry points (`page.tsx` and `layout.tsx`) default to Server Components. Carrying over a `"use client"` boundary at the route root forces the entire tree to be client-rendered, preventing server-side data fetching.
**Fix:** Remove `"use client"` from the route level. Extract interactive sections (like auth forms or the global command palette state) into dedicated client components and import those into the Server Component route layouts.

---

## Low Severity

### 5. Dead Code: Unused Primitives
**File:** `app-frontend/src/components/ui/card.tsx`
**Offending code:** Entire file.
**Why it's wrong:** The `Card` component is not imported anywhere outside of its own file. It represents unused code.
**Fix:** Remove the file entirely, or integrate it into a real use case (e.g. replacing a raw card layout elsewhere).

### 6. Arbitrary Border Radius Scaling
**Files:** 
- `app-frontend/src/features/missions/components/workspace/MissionOverviewAttackGraph.tsx` (`rounded-[3px]`)
- `app-frontend/src/features/missions/components/workspace/AttackGraphNode.tsx` (`rounded-[3px]`)
- `app-frontend/src/features/core/components/CommandPaletteView.tsx` (`rounded-[3px]`)
- `app-frontend/src/features/cost/components/CostUsage.tsx` (`rounded-[3px]`)
- `app-frontend/src/features/specialists/components/SpecGrid.tsx` (`rounded-[3px]`)
**Offending pattern:** `rounded-[3px]`
**Why it's wrong:** Hardcoded arbitrary radius values are being used repeatedly (5+ files) when a `--radius-*` token scale exists in `globals.css`.
**Fix:** Since this `3px` radius is used consistently for small elements, add a new token to `globals.css`: `--radius-xs: calc(var(--radius) * 0.3)` or `--radius-xs: 3px;` and replace `rounded-[3px]` with `rounded-xs`.

### 7. Static Inline Styles
**Files:**
- `app-frontend/src/features/core/components/Dashboard.tsx`
- `app-frontend/src/features/core/components/Shell.tsx`
**Offending line:** `style={{ animation: "pulse 1.4s ease-in-out infinite" }}`
- `app-frontend/src/features/core/components/CommandPaletteView.tsx`
**Offending line:** `style={{ boxShadow: "0 24px 48px var(--border)" }}`
- `app-frontend/src/components/ui/GeometricMark.tsx`
**Offending line:** `style={{ display: "block" }}`
**Why it's wrong:** Static values are injected via inline styles rather than using standard Tailwind classes or utility blocks.
**Fix:** 
- Replace `display: "block"` with the `block` tailwind class.
- Move the `pulse` animation to a utility class or `animate-pulse` modification in tailwind configuration.
- Convert the box-shadow to a utility class (e.g., `shadow-[0_24px_48px_var(--border)]`).

---

## Clean Sections (No Findings)
- **Section 1 (Responsive layout):** Grid layouts correctly apply `sm:`/`lg:` variants for responsive columns.
- **Section 3 (Hand-rolled primitives):** Radix UI elements are properly abstracted through `components/ui` composed exports. No hand-rolled raw tables or dialogs detected.
- **Section 4 (Accessibility):** Accessible naming is intact; no missing `aria-label`s on icon buttons or bad `role="button"` usages.
- **Section 5 (Color tokens):** No hardcoded hex colors (`#...`) found outside of acceptable metadata constants (e.g., `themeColor`).
- **Section 7 (Fonts and images):** Next.js font and image modules are correctly utilized.
- **Section 9 (TypeScript & Code Hygiene):** Codebase is free of `: any`, floating promises, loose null checks (unless handled by eslint), and `console.log`.
- **Section 10 (Tables):** Shared `Table` primitive correctly implements `overflow-x-auto` internally.

---

## Recommended Execution Order

1. **High - Auth Gating & Viewport Issues:** Move auth checking to middleware to fix the layout rendering flash, and apply a viewport height constraint to the Command Palette results.
2. **Medium - Structural Issues:** Remove the route-level `"use client"` pragmas where applicable and adopt standard Server Components to unblock future server-driven architecture.
3. **Medium/Low - Design Token & Primitive Hygiene:** Update `MissionLiveState.tsx` to use correct layout panel tokens, clean up the dead `card.tsx` component, establish a `--radius-xs` token for the scattered `rounded-[3px]` usage, and migrate static inline styles to Tailwind classes.
