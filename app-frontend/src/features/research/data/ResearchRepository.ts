import { ABLATION_RUNS, type AblationRun } from "@/features/research/data/researchMockData";
import { type DataSource } from "@/types/adapters";

export class ResearchRepository implements DataSource<AblationRun> {
    private static mockData: AblationRun[] = [...ABLATION_RUNS];

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

    async fetchAll(options?: { page?: number; limit?: number }): Promise<AblationRun[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50 } = options ?? {};
                const start = (page - 1) * limit;
                const data = ResearchRepository.mockData.slice(start, start + limit);
                // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                resolve(data);
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
        return repo.fetchAll({ limit: 1000 });
    }
}
