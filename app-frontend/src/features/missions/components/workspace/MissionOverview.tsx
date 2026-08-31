import React from "react";

import { MissionOverviewAttackGraph } from "@/features/missions/components/workspace/MissionOverviewAttackGraph";
import { MissionOverviewLogStream } from "@/features/missions/components/workspace/MissionOverviewLogStream";
import { type WorkspaceAction } from "@/features/missions/components/workspace/MissionWorkspaceContainer";
import { type LogEntry } from "@/features/missions/data/fixtures/workspaceMockData";

export default function MissionOverview({
    log,
    dispatch,
}: {
    log: LogEntry[];
    dispatch: React.Dispatch<WorkspaceAction>;
}) {
    return (
        <>
            <MissionOverviewAttackGraph dispatch={dispatch} />
            <MissionOverviewLogStream log={log} />
        </>
    );
}
