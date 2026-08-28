"use client";

import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import MemoryBrowser from "@/features/memory/components/MemoryBrowser";

export default function Memory() {
    return (
        <PanelErrorBoundary>
            <MemoryBrowser />
        </PanelErrorBoundary>
    );
}
