import React from "react";

import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import { AppShellClient } from "@/features/core/components/AppShellClient";
import { MissionProvider } from "@/lib/mission-context";

// ─── Exported layout ──────────────────────────────────────────────────────────

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <MissionProvider>
            <AppShellClient>
                <PanelErrorBoundary>{children}</PanelErrorBoundary>
            </AppShellClient>
        </MissionProvider>
    );
}
