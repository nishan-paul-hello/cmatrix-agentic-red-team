import { PATTERNS, type MemoryPattern } from "@/features/memory/data/mockData";
import { type DataSource } from "@/types/adapters";

export class MemoryRepository implements DataSource<MemoryPattern> {
    private static mockData: MemoryPattern[] = [...PATTERNS];

    static seed(data: MemoryPattern[]) {
        this.mockData = data;
    }

    async fetch(id: string): Promise<MemoryPattern> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const item = MemoryRepository.mockData.find((m) => m.id === id);
                if (item) {
                    // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                    resolve(item);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async fetchAll(options?: { page?: number; limit?: number }): Promise<MemoryPattern[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50 } = options ?? {};
                const start = (page - 1) * limit;
                const data = MemoryRepository.mockData.slice(start, start + limit);
                // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                resolve(data);
            }, 300);
        });
    }

    async create(data: Omit<MemoryPattern, "id">): Promise<MemoryPattern> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newItem = { ...data, id: `ID-${Date.now()}` };
                MemoryRepository.mockData.push(newItem);
                resolve(newItem);
            }, 100);
        });
    }

    async update(id: string, data: Partial<MemoryPattern>): Promise<MemoryPattern> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = MemoryRepository.mockData.findIndex((m) => m.id === id);
                if (idx >= 0) {
                    MemoryRepository.mockData[idx] = { ...MemoryRepository.mockData[idx], ...data };
                    resolve(MemoryRepository.mockData[idx]);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const initialLength = MemoryRepository.mockData.length;
                MemoryRepository.mockData = MemoryRepository.mockData.filter((m) => m.id !== id);
                resolve(MemoryRepository.mockData.length < initialLength);
            }, 100);
        });
    }

    static async getAll(): Promise<MemoryPattern[]> {
        const repo = new MemoryRepository();
        return repo.fetchAll({ limit: 1000 });
    }
}
