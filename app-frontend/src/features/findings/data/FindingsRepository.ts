import { DATA } from "@/features/findings/data/findingsMockData";
import { type DataSource } from "@/types/adapters";
import { type Finding } from "@/types/domain-types";

export class FindingsRepository implements DataSource<Finding> {
    private static mockData: Finding[] = [...DATA];

    static seed(data: Finding[]) {
        this.mockData = data;
    }

    async fetch(id: string): Promise<Finding> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const item = FindingsRepository.mockData.find((m) => m.id === id);
                if (item) {
                    // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                    resolve(item);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async fetchAll(options?: { page?: number; limit?: number }): Promise<Finding[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50 } = options ?? {};
                const start = (page - 1) * limit;
                const data = FindingsRepository.mockData.slice(start, start + limit);
                // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                resolve(data);
            }, 300);
        });
    }

    async create(data: Omit<Finding, "id">): Promise<Finding> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newItem = { ...data, id: `ID-${Date.now()}` };
                FindingsRepository.mockData.push(newItem);
                resolve(newItem);
            }, 100);
        });
    }

    async update(id: string, data: Partial<Finding>): Promise<Finding> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = FindingsRepository.mockData.findIndex((m) => m.id === id);
                if (idx >= 0) {
                    FindingsRepository.mockData[idx] = {
                        ...FindingsRepository.mockData[idx],
                        ...data,
                    };
                    resolve(FindingsRepository.mockData[idx]);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const initialLength = FindingsRepository.mockData.length;
                FindingsRepository.mockData = FindingsRepository.mockData.filter(
                    (m) => m.id !== id,
                );
                resolve(FindingsRepository.mockData.length < initialLength);
            }, 100);
        });
    }

    static async getAll(): Promise<Finding[]> {
        const repo = new FindingsRepository();
        return repo.fetchAll({ limit: 1000 });
    }
}
