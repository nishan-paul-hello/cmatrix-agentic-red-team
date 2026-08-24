import {
    CTX_ENTRIES,
    getCostData,
    MODEL_ROWS,
    TIMELINE,
    type ContextEntry,
    type CostTimeline,
    type ModelRow,
} from "@/features/cost/data/fixtures/costMockData";
import { type DataSource } from "@/types/adapters";

export class CostRepository implements DataSource<CostTimeline> {
    private static mockData: CostTimeline[] = [...TIMELINE];

    static seed(data: CostTimeline[]) {
        this.mockData = data;
    }

    async fetch(id: string): Promise<CostTimeline> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const item = CostRepository.mockData.find((m) => (m as { id?: string }).id === id);
                if (item) {
                    resolve(item);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async fetchAll<U = CostTimeline>(_options?: {
        page?: number;
        limit?: number;
        collection?: string;
    }): Promise<U[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(CostRepository.mockData as unknown as U[]);
            }, 300);
        });
    }

    create(data: Omit<CostTimeline, "id">): Promise<CostTimeline> {
        return Promise.resolve({ ...data, id: "tmp" } as CostTimeline);
    }
    update(_id: string, data: Partial<CostTimeline>): Promise<CostTimeline> {
        return Promise.resolve({ ...data, id: "tmp" } as CostTimeline);
    }
    delete(_id: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    static async getAll(): Promise<CostTimeline[]> {
        const repo = new CostRepository();
        return repo.fetchAll({ limit: 1000 });
    }

    static async getCostData() {
        return getCostData();
    }

    static async getModels(): Promise<ModelRow[]> {
        return new Promise((resolve) => setTimeout(() => resolve([...MODEL_ROWS]), 100));
    }

    static async getContextEntries(): Promise<ContextEntry[]> {
        return new Promise((resolve) => setTimeout(() => resolve([...CTX_ENTRIES]), 100));
    }
}
