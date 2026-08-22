import { BENCHMARKS, TASK_DATA, type Bench } from "@/features/benchmarks/data/benchmarksMockData";
import { type DataSource } from "@/types/adapters";

export class BenchmarksRepository implements DataSource<Bench> {
    private static mockData: Bench[] = [...BENCHMARKS];

    static seed(data: Bench[]) {
        this.mockData = data;
    }

    async fetch(id: string): Promise<Bench> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const item = BenchmarksRepository.mockData.find((m) => m.id === id);
                if (item) {
                    // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                    resolve(item);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async fetchAll(options?: { page?: number; limit?: number }): Promise<Bench[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50 } = options ?? {};
                const start = (page - 1) * limit;
                const data = BenchmarksRepository.mockData.slice(start, start + limit);
                // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                resolve(data);
            }, 300);
        });
    }

    async create(data: Omit<Bench, "id">): Promise<Bench> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newItem = { ...data, id: `ID-${Date.now()}` };
                BenchmarksRepository.mockData.push(newItem);
                resolve(newItem);
            }, 100);
        });
    }

    async update(id: string, data: Partial<Bench>): Promise<Bench> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = BenchmarksRepository.mockData.findIndex((m) => m.id === id);
                if (idx >= 0) {
                    BenchmarksRepository.mockData[idx] = {
                        ...BenchmarksRepository.mockData[idx],
                        ...data,
                    };
                    resolve(BenchmarksRepository.mockData[idx]);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const initialLength = BenchmarksRepository.mockData.length;
                BenchmarksRepository.mockData = BenchmarksRepository.mockData.filter(
                    (m) => m.id !== id,
                );
                resolve(BenchmarksRepository.mockData.length < initialLength);
            }, 100);
        });
    }

    static async getAll(): Promise<Bench[]> {
        const repo = new BenchmarksRepository();
        return repo.fetchAll({ limit: 1000 });
    }

    static async getTasks() {
        return Promise.resolve([...TASK_DATA]);
    }
}
