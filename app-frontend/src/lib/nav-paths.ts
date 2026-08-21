import type { NavItem } from "@/components/Shell";

export const NAV_PATHS: Record<NavItem, string> = {
  dashboard: "/dashboard",
  missions: "/missions",
  memory: "/memory",
  "skill-library": "/memory/skill-library",
  "failure-memory": "/memory/failure-memory",
  trajectory: "/trajectory",
  benchmarks: "/benchmarks",
  ablations: "/research/ablations",
  statistics: "/research/statistics",
  "failure-analysis": "/research/failure-analysis",
  reports: "/reports",
  "cost-usage": "/cost-usage",
  "audit-log": "/audit-log",
  settings: "/settings",
};

// Reverse lookup used to highlight the active sidebar item for a given pathname.
// Sorted longest-path-first so nested routes (e.g. mission workspace under
// /missions/:id) still resolve to the right top-level nav entry.
const PATH_TO_NAV: [string, NavItem][] = Object.entries(NAV_PATHS)
  .map(([nav, path]) => [path, nav as NavItem] as [string, NavItem])
  .sort((a, b) => b[0].length - a[0].length);

export function navItemForPath(pathname: string): NavItem {
  if (pathname.startsWith("/missions")) return "missions";
  for (const [path, nav] of PATH_TO_NAV) {
    if (pathname === path || pathname.startsWith(path + "/")) return nav;
  }
  return "dashboard";
}
