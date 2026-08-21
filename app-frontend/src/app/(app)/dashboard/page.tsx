"use client";

import { useRouter } from "next/navigation";

import Dashboard from "@/components/Dashboard";
import { useMission } from "@/lib/mission-context";

export default function DashboardPage() {
    const router = useRouter();
    const { setActiveMissionId } = useMission();

    return (
        <Dashboard
            onNewMission={() => router.push("/missions/new")}
            onOpenMission={(id) => {
                setActiveMissionId(id);
                router.push(`/missions/${id}`);
            }}
        />
    );
}
