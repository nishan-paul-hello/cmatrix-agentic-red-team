import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import ReportsPage from "@/features/reports/components/ReportsPage";

export default function Reports() {
    return (
        <PanelErrorBoundary>
            <ReportsPage />
        </PanelErrorBoundary>
    );
}
