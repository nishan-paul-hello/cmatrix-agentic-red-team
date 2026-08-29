import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import NewMissionWizard from "@/features/missions/components/wizard/NewMissionWizard";

export default function NewMission() {
    return (
        <PanelErrorBoundary>
            <NewMissionWizard />
        </PanelErrorBoundary>
    );
}
