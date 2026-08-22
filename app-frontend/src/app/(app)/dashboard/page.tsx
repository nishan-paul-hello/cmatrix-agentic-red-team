"use client";

import { useRouter } from "next/navigation";

import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import Dashboard from "@/features/core/components/Dashboard";
import { useMission } from "@/lib/mission-context";

export default function DashboardPage() {
    const router = useRouter();
    const { setActiveMissionId } = useMission();

    return (
        <PanelErrorBoundary>
            <Dashboard
                onNewMission={() => router.push("/missions/new")}
                onOpenMission={(id) => {
                    setActiveMissionId(id);
                    router.push(`/missions/${id}`);
                }}
            />
        </PanelErrorBoundary>
    );
}
