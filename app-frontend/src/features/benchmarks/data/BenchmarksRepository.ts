import {
    ALL_BENCH_RUNS,
    TASK_DATA,
    type BenchRecord,
} from "@/features/benchmarks/data/fixtures/benchmarksMockData";
import { type DataSource } from "@/types/adapters";

// BenchRecord is the new discriminated-union type; Bench is aliased to it in the fixture file
type Bench = BenchRecord;

export class BenchmarksRepository implements DataSource<Bench> {
    private static mockData: Bench[] = [...ALL_BENCH_RUNS];

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

    async fetchAll<U = Bench>(options?: {
        page?: number;
        limit?: number;
        collection?: string;
    }): Promise<U[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50 } = options ?? {};
                const start = (page - 1) * limit;
                const data = BenchmarksRepository.mockData.slice(start, start + limit);
                // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                resolve(data as unknown as U[]);
            }, 300);
        });
    }

    async create(data: Omit<Bench, "id">): Promise<Bench> {
        return new Promise((resolve) => {
            setTimeout(() => {
                // VALIDATION SEAM: discriminated union — cast is safe in mock context
                const newItem = { ...data, id: `ID-${Date.now()}` } as Bench;
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
                    // VALIDATION SEAM: spread merge on discriminated union — safe in mock context
                    BenchmarksRepository.mockData[idx] = {
                        ...BenchmarksRepository.mockData[idx],
                        ...data,
                    } as Bench;
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
