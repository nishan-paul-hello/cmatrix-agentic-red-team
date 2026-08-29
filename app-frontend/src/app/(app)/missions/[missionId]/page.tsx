import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import MissionWorkspace from "@/features/missions/components/workspace/MissionWorkspace";

export default function MissionWorkspaceRoute({ params }: { params: { missionId: string } }) {
    return (
        <PanelErrorBoundary>
            <MissionWorkspace missionId={params.missionId} />
        </PanelErrorBoundary>
    );
}
