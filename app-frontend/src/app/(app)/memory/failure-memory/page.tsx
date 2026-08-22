"use client";

import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import MemoryPage from "@/features/memory/components/MemoryPage";

export default function FailureMemory() {
    return (
        <PanelErrorBoundary>
            <MemoryPage initialTab="FAILURE MEMORY" />
        </PanelErrorBoundary>
    );
}
