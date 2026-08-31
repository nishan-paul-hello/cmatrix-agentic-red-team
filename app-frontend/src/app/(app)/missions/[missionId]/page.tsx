import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import MissionWorkspace from "@/features/missions/components/workspace/MissionWorkspace";

export default async function MissionWorkspaceRoute({
    params,
}: {
    params: Promise<{ missionId: string }>;
}) {
    const { missionId } = await params;

    return (
        <PanelErrorBoundary>
            <MissionWorkspace missionId={missionId} />
        </PanelErrorBoundary>
    );
}
