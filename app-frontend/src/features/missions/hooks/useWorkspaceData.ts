import { useEffect, useState } from "react";

import {
    type LogEntry,
    type MissionSubNav,
    type VDGNode,
} from "@/features/missions/data/fixtures/workspaceMockData";
import { WorkspaceRepository } from "@/features/missions/data/WorkspaceRepository";
import { type Specialist } from "@/types/domain-types";

export function useWorkspaceData() {
    const [nodes, setNodes] = useState<VDGNode[]>([]);
    const [specialists, setSpecialists] = useState<Specialist[]>([]);
    const [subNav, setSubNav] = useState<{ id: MissionSubNav; label: string }[]>([]);
    const [initialLog, setInitialLog] = useState<LogEntry[]>([]);
    const [streamEvents, setStreamEvents] = useState<Omit<LogEntry, "id">[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const [n, s, sn, il, se] = await Promise.all([
                    WorkspaceRepository.getNodes(),
                    WorkspaceRepository.getSpecialists(),
                    WorkspaceRepository.getSubNav(),
                    WorkspaceRepository.getInitialLog(),
                    WorkspaceRepository.getStreamEvents(),
                ]);
                setNodes(n);
                setSpecialists(s);
                setSubNav(sn);
                setInitialLog(il);
                setStreamEvents(se);
            } catch (error) {
                console.error("Failed to load workspace data", error);
            } finally {
                setLoading(false);
            }
        }
        void load();
    }, []);

    return { nodes, specialists, subNav, initialLog, streamEvents, loading };
}
