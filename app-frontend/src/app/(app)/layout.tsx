"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Shell, { type NavItem } from "@/components/Shell";
import CommandPalette from "@/components/CommandPalette";
import { useAuth } from "@/lib/auth-context";
import { MissionProvider, useMission } from "@/lib/mission-context";
import { NAV_PATHS, navItemForPath } from "@/lib/nav-paths";

function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated } = useAuth();
  const { activeMissionId, setActiveMissionId } = useMission();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    if (!authenticated) router.replace("/login");
  }, [authenticated, router]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((p) => !p);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleNavChange(id: NavItem) {
    router.push(NAV_PATHS[id]);
  }

  function handlePaletteNav(id: string) {
    const navMap: Record<string, () => void> = {
      "go-dashboard": () => router.push(NAV_PATHS.dashboard),
      "go-missions": () => router.push(NAV_PATHS.missions),
      "go-benchmarks": () => router.push(NAV_PATHS.benchmarks),
      "go-reports": () => router.push(NAV_PATHS.reports),
      "go-audit": () => router.push(NAV_PATHS["audit-log"]),
      "go-settings": () => router.push(NAV_PATHS.settings),
      "act-new": () => router.push("/missions/new"),
      "m-cve001": () => {
        setActiveMissionId("CVE-001");
        router.push("/missions/CVE-001");
      },
    };
    navMap[id]?.();
  }

  if (!authenticated) return null;

  return (
    <>
      <Shell activeNav={navItemForPath(pathname)} onNavChange={handleNavChange} missionId={activeMissionId}>
        {children}
      </Shell>
      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} onNavigate={handlePaletteNav} />}
    </>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <MissionProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </MissionProvider>
  );
}
