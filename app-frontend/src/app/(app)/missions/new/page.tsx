"use client";

import { useRouter } from "next/navigation";

import NewMissionWizard from "@/features/missions/components/wizard/NewMissionWizard";
import { useMission } from "@/lib/mission-context";

export default function NewMission() {
    const router = useRouter();
    const { setActiveMissionId } = useMission();

    return (
        <NewMissionWizard
            onCancel={() => router.push("/missions")}
            onStart={() => {
                setActiveMissionId("NEW-001");
                router.push("/missions/NEW-001");
            }}
        />
    );
}
