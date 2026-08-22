"use client";

import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import CommandPalette from "@/features/core/components/CommandPalette";
import Shell, { type NavItem } from "@/features/core/components/Shell";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { MissionProvider, useMission } from "@/lib/mission-context";
import { NAV_PATHS, navItemForPath } from "@/lib/nav-paths";

// ─── Inner layout (needs MissionProvider context) ─────────────────────────────

function AppLayoutInner({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { activeMissionId, setActiveMissionId } = useMission();
    const [paletteOpen, setPaletteOpen] = useState(false);

    // Redirect to /login when unauthenticated. Returns false while pending.
    const isReady = useAuthGuard();

    // Global keyboard shortcut: Ctrl/⌘ + K → open command palette.
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setPaletteOpen((prev) => !prev);
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const handleNavChange = useCallback(
        (id: NavItem) => {
            router.push(NAV_PATHS[id]);
        },
        [router],
    );

    const handlePaletteNav = useCallback(
        (id: string) => {
            // For simple nav items, derive path from NAV_PATHS via a prefix mapping.
            const PALETTE_NAV_MAP: Record<string, NavItem> = {
                "go-dashboard": "dashboard",
                "go-missions": "missions",
                "go-benchmarks": "benchmarks",
                "go-reports": "reports",
                "go-audit": "audit-log",
                "go-settings": "settings",
            };

            if (id in PALETTE_NAV_MAP) {
                router.push(NAV_PATHS[PALETTE_NAV_MAP[id]]);
                return;
            }

            // Special actions that don't map directly to a NavItem path.
            if (id === "act-new") {
                router.push("/missions/new");
                return;
            }

            if (id === "m-cve001") {
                setActiveMissionId("CVE-001");
                router.push("/missions/CVE-001");
            }
        },
        [router, setActiveMissionId],
    );

    // Don't render children until auth state is confirmed.
    if (!isReady) {
        return null;
    }

    return (
        <>
            <Shell
                activeNav={navItemForPath(pathname)}
                onNavChange={handleNavChange}
                missionId={activeMissionId}
            >
                <PanelErrorBoundary>{children}</PanelErrorBoundary>
            </Shell>

            {paletteOpen && (
                <CommandPalette
                    onClose={() => setPaletteOpen(false)}
                    onNavigate={handlePaletteNav}
                />
            )}
        </>
    );
}

// ─── Exported layout ──────────────────────────────────────────────────────────

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <MissionProvider>
            <AppLayoutInner>{children}</AppLayoutInner>
        </MissionProvider>
    );
}
