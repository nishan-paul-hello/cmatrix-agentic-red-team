import { type Mission, type MissionStatus } from "@/types/domain-types";

export type MissionFilter = "ALL" | MissionStatus;

export function filterMissions(missions: Mission[], filter: MissionFilter): Mission[] {
    return filter === "ALL" ? missions : missions.filter((m) => m.status === filter);
}
