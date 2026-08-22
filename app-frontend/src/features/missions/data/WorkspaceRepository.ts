import {
    INITIAL_LOG,
    SPECIALISTS,
    STREAM_EVENTS,
    SUB_NAV,
    VDG_NODES,
    type LogEntry,
    type MissionSubNav,
    type VDGNode,
} from "@/features/missions/data/fixtures/workspaceMockData";
import { type Specialist } from "@/types/domain-types";

export class WorkspaceRepository {
    private static mockNodes: VDGNode[] = [...VDG_NODES];
    private static mockSpecialists: Specialist[] = [...SPECIALISTS];
    private static mockSubNav: { id: MissionSubNav; label: string }[] = [...SUB_NAV];
    private static mockInitialLog: LogEntry[] = [...INITIAL_LOG];
    private static mockStreamEvents: Omit<LogEntry, "id">[] = [...STREAM_EVENTS];

    async fetchAll<U>(options?: {
        page?: number;
        limit?: number;
        collection?: string;
    }): Promise<U[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50, collection } = options ?? {};
                const start = (page - 1) * limit;

                let data: unknown[] = [];
                switch (collection) {
                    case "specialists":
                        data = WorkspaceRepository.mockSpecialists;
                        break;
                    case "subNav":
                        data = WorkspaceRepository.mockSubNav;
                        break;
                    case "initialLog":
                        data = WorkspaceRepository.mockInitialLog;
                        break;
                    case "streamEvents":
                        data = WorkspaceRepository.mockStreamEvents;
                        break;
                    case undefined:
                    case "nodes":
                    default:
                        data = WorkspaceRepository.mockNodes;
                        break;
                }

                resolve(data.slice(start, start + limit) as unknown as U[]);
            }, 100);
        });
    }

    static async getNodes(): Promise<VDGNode[]> {
        const repo = new WorkspaceRepository();
        return repo.fetchAll<VDGNode>({ limit: 1000, collection: "nodes" });
    }

    static async getSpecialists(): Promise<Specialist[]> {
        const repo = new WorkspaceRepository();
        return repo.fetchAll<Specialist>({ limit: 1000, collection: "specialists" });
    }

    static async getSubNav(): Promise<{ id: MissionSubNav; label: string }[]> {
        const repo = new WorkspaceRepository();
        return repo.fetchAll<{ id: MissionSubNav; label: string }>({
            limit: 1000,
            collection: "subNav",
        });
    }

    static async getInitialLog(): Promise<LogEntry[]> {
        const repo = new WorkspaceRepository();
        return repo.fetchAll<LogEntry>({ limit: 1000, collection: "initialLog" });
    }

    static async getStreamEvents(): Promise<Omit<LogEntry, "id">[]> {
        const repo = new WorkspaceRepository();
        return repo.fetchAll<Omit<LogEntry, "id">>({ limit: 1000, collection: "streamEvents" });
    }
}
