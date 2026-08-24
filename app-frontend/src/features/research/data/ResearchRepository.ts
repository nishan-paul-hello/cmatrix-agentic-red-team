import {
    ABLATION_RUNS,
    FAILURE_CLUSTERS,
    FAILURE_TIMELINE,
    STAT_DATA,
    type AblationRun,
} from "@/features/research/data/fixtures/researchMockData";
import { type DataSource } from "@/types/adapters";

export class ResearchRepository implements DataSource<AblationRun> {
    private static mockData: AblationRun[] = [...ABLATION_RUNS];
    private static mockStatData = { ...STAT_DATA };
    private static mockFailureClusters = [...FAILURE_CLUSTERS];
    private static mockFailureTimeline = [...FAILURE_TIMELINE];

    static seed(data: AblationRun[]) {
        this.mockData = data;
    }

    async fetch(id: string): Promise<AblationRun> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const item = ResearchRepository.mockData.find((m) => m.id === id);
                if (item) {
                    // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                    resolve(item);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async fetchAll<U = AblationRun>(options?: {
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
                    case "statData":
                        data = [ResearchRepository.mockStatData];
                        break;
                    case "failureClusters":
                        data = ResearchRepository.mockFailureClusters;
                        break;
                    case "failureTimeline":
                        data = ResearchRepository.mockFailureTimeline;
                        break;
                    case undefined:
                    case "ablationRuns":
                    default:
                        data = ResearchRepository.mockData;
                        break;
                }

                resolve(data.slice(start, start + limit) as unknown as U[]);
            }, 300);
        });
    }

    async create(data: Omit<AblationRun, "id">): Promise<AblationRun> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newItem = { ...data, id: `ID-${Date.now()}` };
                ResearchRepository.mockData.push(newItem);
                resolve(newItem);
            }, 100);
        });
    }

    async update(id: string, data: Partial<AblationRun>): Promise<AblationRun> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = ResearchRepository.mockData.findIndex((m) => m.id === id);
                if (idx >= 0) {
                    ResearchRepository.mockData[idx] = {
                        ...ResearchRepository.mockData[idx],
                        ...data,
                    };
                    resolve(ResearchRepository.mockData[idx]);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const initialLength = ResearchRepository.mockData.length;
                ResearchRepository.mockData = ResearchRepository.mockData.filter(
                    (m) => m.id !== id,
                );
                resolve(ResearchRepository.mockData.length < initialLength);
            }, 100);
        });
    }

    static async getAll(): Promise<AblationRun[]> {
        const repo = new ResearchRepository();
        return repo.fetchAll({ limit: 1000, collection: "ablationRuns" });
    }

    static async getStatData() {
        return new Promise<typeof STAT_DATA>((resolve) => {
            setTimeout(() => {
                resolve(ResearchRepository.mockStatData);
            }, 100);
        });
    }

    static async getFailureClusters() {
        const repo = new ResearchRepository();
        return repo.fetchAll<(typeof FAILURE_CLUSTERS)[0]>({
            limit: 1000,
            collection: "failureClusters",
        });
    }

    static async getFailureTimeline() {
        const repo = new ResearchRepository();
        return repo.fetchAll<(typeof FAILURE_TIMELINE)[0]>({
            limit: 1000,
            collection: "failureTimeline",
        });
    }
}
