"use client";

import { useRouter } from "next/navigation";

import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import MissionsPage from "@/features/missions/components/MissionsPage";
import { useMission } from "@/lib/mission-context";

export default function Missions() {
    const router = useRouter();
    const { setActiveMissionId } = useMission();

    return (
        <PanelErrorBoundary>
            <MissionsPage
                onNewMission={() => router.push("/missions/new")}
                onOpenMission={(id) => {
                    setActiveMissionId(id);
                    router.push(`/missions/${id}`);
                }}
            />
        </PanelErrorBoundary>
    );
}
