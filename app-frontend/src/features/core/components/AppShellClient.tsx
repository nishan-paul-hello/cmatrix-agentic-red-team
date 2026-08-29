"use client";

import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import CommandPalette from "@/features/core/components/CommandPalette";
import Shell, { type NavItem } from "@/features/core/components/Shell";
import { useMission } from "@/lib/mission-context";
import { NAV_PATHS, navItemForPath } from "@/lib/nav-paths";

export function AppShellClient({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { activeMissionId, setActiveMissionId } = useMission();
    const [paletteOpen, setPaletteOpen] = useState(false);

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

    return (
        <>
            <Shell
                activeNav={navItemForPath(pathname)}
                onNavChange={handleNavChange}
                missionId={activeMissionId}
            >
                {children}
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
