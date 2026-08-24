"use client";

import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import CostDashboard from "@/features/cost/components/CostDashboard";

export default function CostUsage() {
    return (
        <PanelErrorBoundary>
            <CostDashboard />
        </PanelErrorBoundary>
    );
}
