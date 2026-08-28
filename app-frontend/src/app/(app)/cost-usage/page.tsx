"use client";

import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import CostBrowser from "@/features/cost/components/CostBrowser";

export default function CostUsage() {
    return (
        <PanelErrorBoundary>
            <CostBrowser />
        </PanelErrorBoundary>
    );
}
