"use client";

import { useRouter } from "next/navigation";
import MissionsPage from "@/components/MissionsPage";
import { useMission } from "@/lib/mission-context";

export default function Missions() {
    const router = useRouter();
    const { setActiveMissionId } = useMission();

    return (
        <MissionsPage
            onNewMission={() => router.push("/missions/new")}
            onOpenMission={(id) => {
                setActiveMissionId(id);
                router.push(`/missions/${id}`);
            }}
        />
    );
}
