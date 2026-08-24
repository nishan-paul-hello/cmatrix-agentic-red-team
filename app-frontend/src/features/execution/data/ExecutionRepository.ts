import { ENTRIES, getParsedRows } from "@/features/execution/data/fixtures/executionMockData";
import { type DataSource } from "@/types/adapters";
import { type ExecEntry } from "@/types/domain-types";

export class ExecutionRepository implements DataSource<ExecEntry> {
    private static mockData: ExecEntry[] = [...ENTRIES];

    static seed(data: ExecEntry[]) {
        this.mockData = data;
    }

    async fetch(id: string): Promise<ExecEntry> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const item = ExecutionRepository.mockData.find((m) => m.id === id);
                if (item) {
                    // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                    resolve(item);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async fetchAll<U = ExecEntry>(options?: {
        page?: number;
        limit?: number;
        collection?: string;
    }): Promise<U[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50 } = options ?? {};
                const start = (page - 1) * limit;
                const data = ExecutionRepository.mockData.slice(start, start + limit);
                // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                resolve(data as unknown as U[]);
            }, 300);
        });
    }

    async create(data: Omit<ExecEntry, "id">): Promise<ExecEntry> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newItem = { ...data, id: `ID-${Date.now()}` };
                ExecutionRepository.mockData.push(newItem);
                resolve(newItem);
            }, 100);
        });
    }

    async update(id: string, data: Partial<ExecEntry>): Promise<ExecEntry> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = ExecutionRepository.mockData.findIndex((m) => m.id === id);
                if (idx >= 0) {
                    ExecutionRepository.mockData[idx] = {
                        ...ExecutionRepository.mockData[idx],
                        ...data,
                    };
                    resolve(ExecutionRepository.mockData[idx]);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const initialLength = ExecutionRepository.mockData.length;
                ExecutionRepository.mockData = ExecutionRepository.mockData.filter(
                    (m) => m.id !== id,
                );
                resolve(ExecutionRepository.mockData.length < initialLength);
            }, 100);
        });
    }

    static async getParsedRows() {
        return getParsedRows();
    }

    static async getAll(): Promise<ExecEntry[]> {
        const repo = new ExecutionRepository();
        return repo.fetchAll({ limit: 1000 });
    }
}
