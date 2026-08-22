"use client";

import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import MemoryPage from "@/features/memory/components/MemoryPage";

export default function Memory() {
    return (
        <PanelErrorBoundary>
            <MemoryPage />
        </PanelErrorBoundary>
    );
}
