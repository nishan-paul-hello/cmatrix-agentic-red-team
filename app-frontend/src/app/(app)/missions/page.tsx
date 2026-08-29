import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import MissionsPage from "@/features/missions/components/MissionsPage";

export default function Missions() {
    return (
        <PanelErrorBoundary>
            <MissionsPage />
        </PanelErrorBoundary>
    );
}
