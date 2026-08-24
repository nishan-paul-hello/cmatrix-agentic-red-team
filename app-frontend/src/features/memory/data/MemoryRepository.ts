import {
    ACTIONS,
    BRANCHES,
    CTX_SPECS,
    FAILURES,
    PATTERNS,
    SKILLS,
    type MemoryPattern,
} from "@/features/memory/data/mockData";
import { type DataSource } from "@/types/adapters";

export class MemoryRepository implements DataSource<Record<string, unknown>> {
    private static mockData: Record<string, unknown>[] = [...PATTERNS];

    static seed(data: MemoryPattern[]) {
        this.mockData = data;
    }

    async fetch(id: string): Promise<MemoryPattern> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const item = MemoryRepository.mockData.find((m) => m.id === id);
                if (item) {
                    // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                    resolve(item as MemoryPattern);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async fetchAll<U = Record<string, unknown>>(options?: {
        page?: number;
        limit?: number;
        collection?: string;
    }): Promise<U[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50 } = options ?? {};
                let dataSource = MemoryRepository.mockData;
                const collection = options?.collection ?? "PATTERNS";
                switch (collection) {
                    case "PATTERNS":
                        dataSource = PATTERNS;
                        break;
                    case "BRANCHES":
                        dataSource = BRANCHES;
                        break;
                    case "ACTIONS":
                        dataSource = ACTIONS;
                        break;
                    case "FAILURES":
                        dataSource = FAILURES;
                        break;
                    case "SKILLS":
                        dataSource = SKILLS;
                        break;
                    case "CTX_SPECS":
                        dataSource = CTX_SPECS;
                        break;
                    default:
                        break;
                }
                const start = (page - 1) * limit;
                const data = dataSource.slice(start, start + limit);
                // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                resolve(data as unknown as U[]);
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
                    MemoryRepository.mockData[idx] = {
                        ...(MemoryRepository.mockData[idx] as MemoryPattern),
                        ...data,
                    };
                    resolve(MemoryRepository.mockData[idx] as MemoryPattern);
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
        return repo.fetchAll<MemoryPattern>({ limit: 1000 });
    }
}
