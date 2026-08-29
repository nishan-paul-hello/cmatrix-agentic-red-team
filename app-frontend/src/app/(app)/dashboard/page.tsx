import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import Dashboard from "@/features/core/components/Dashboard";

export default function DashboardPage() {
    return (
        <PanelErrorBoundary>
            <Dashboard />
        </PanelErrorBoundary>
    );
}
