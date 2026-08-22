import { ENDPOINTS, type Endpoint } from "@/features/environment/data/mockData";
import { type DataSource } from "@/types/adapters";

export class EnvironmentRepository implements DataSource<Endpoint> {
    private static mockData: Endpoint[] = [...ENDPOINTS];

    static seed(data: Endpoint[]) {
        this.mockData = data;
    }

    async fetch(id: string): Promise<Endpoint> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const item = EnvironmentRepository.mockData.find(
                    (m) => (m as { id?: string }).id === id,
                );
                if (item) {
                    // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                    resolve(item);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async fetchAll(options?: { page?: number; limit?: number }): Promise<Endpoint[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50 } = options ?? {};
                const start = (page - 1) * limit;
                const data = EnvironmentRepository.mockData.slice(start, start + limit);
                // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                resolve(data);
            }, 300);
        });
    }

    async create(data: Omit<Endpoint, "id">): Promise<Endpoint> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newItem = { ...data, id: `ID-${Date.now()}` } as Endpoint;
                EnvironmentRepository.mockData.push(newItem);
                resolve(newItem);
            }, 100);
        });
    }

    async update(id: string, data: Partial<Endpoint>): Promise<Endpoint> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = EnvironmentRepository.mockData.findIndex(
                    (m) => (m as { id?: string }).id === id,
                );
                if (idx >= 0) {
                    EnvironmentRepository.mockData[idx] = {
                        ...EnvironmentRepository.mockData[idx],
                        ...data,
                    };
                    resolve(EnvironmentRepository.mockData[idx]);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const initialLength = EnvironmentRepository.mockData.length;
                EnvironmentRepository.mockData = EnvironmentRepository.mockData.filter(
                    (m) => (m as { id?: string }).id !== id,
                );
                resolve(EnvironmentRepository.mockData.length < initialLength);
            }, 100);
        });
    }

    static async getAll(): Promise<Endpoint[]> {
        const repo = new EnvironmentRepository();
        return repo.fetchAll({ limit: 1000 });
    }
}
