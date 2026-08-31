import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import AuditLogPage from "@/features/audit/components/AuditLogPage";

export default function AuditLog() {
    return (
        <PanelErrorBoundary>
            <AuditLogPage />
        </PanelErrorBoundary>
    );
}
