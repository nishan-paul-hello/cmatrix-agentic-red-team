import { STEPS, type TrajStep } from "@/features/trajectory/data/fixtures/trajectoryMockData";
import { type DataSource } from "@/types/adapters";

export class TrajectoryRepository implements DataSource<TrajStep> {
    private static mockData: TrajStep[] = [...STEPS];

    static seed(data: TrajStep[]) {
        this.mockData = data;
    }

    async fetch(id: string): Promise<TrajStep> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const item = TrajectoryRepository.mockData.find(
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

    async fetchAll(options?: { page?: number; limit?: number }): Promise<TrajStep[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50 } = options ?? {};
                const start = (page - 1) * limit;
                const data = TrajectoryRepository.mockData.slice(start, start + limit);
                // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                resolve(data);
            }, 300);
        });
    }

    async create(data: Omit<TrajStep, "id">): Promise<TrajStep> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newItem = { ...data, id: `ID-${Date.now()}` } as TrajStep;
                TrajectoryRepository.mockData.push(newItem);
                resolve(newItem);
            }, 100);
        });
    }

    async update(id: string, data: Partial<TrajStep>): Promise<TrajStep> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = TrajectoryRepository.mockData.findIndex(
                    (m) => (m as { id?: string }).id === id,
                );
                if (idx >= 0) {
                    TrajectoryRepository.mockData[idx] = {
                        ...TrajectoryRepository.mockData[idx],
                        ...data,
                    };
                    resolve(TrajectoryRepository.mockData[idx]);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const initialLength = TrajectoryRepository.mockData.length;
                TrajectoryRepository.mockData = TrajectoryRepository.mockData.filter(
                    (m) => (m as { id?: string }).id !== id,
                );
                resolve(TrajectoryRepository.mockData.length < initialLength);
            }, 100);
        });
    }

    static async getAll(): Promise<TrajStep[]> {
        const repo = new TrajectoryRepository();
        return repo.fetchAll({ limit: 1000 });
    }
}
