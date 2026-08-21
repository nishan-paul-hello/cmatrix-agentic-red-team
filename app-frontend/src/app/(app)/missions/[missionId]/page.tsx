"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import MissionWorkspace from "@/components/MissionWorkspace";
import { useMission } from "@/lib/mission-context";

export default function MissionWorkspaceRoute() {
    const params = useParams<{ missionId: string }>();
    const { setActiveMissionId } = useMission();

    // Keep the shared context (and topbar indicator) in sync when this route is
    // opened directly via URL, not just via in-app navigation.
    useEffect(() => {
        setActiveMissionId(params.missionId);
    }, [params.missionId, setActiveMissionId]);

    return <MissionWorkspace missionId={params.missionId} />;
}
