import { FINDINGS, type VFinding } from "@/features/validation/data/fixtures/validationMockData";
import { type DataSource } from "@/types/adapters";

export class ValidationRepository implements DataSource<VFinding> {
    private static mockData: VFinding[] = [...FINDINGS];

    static seed(data: VFinding[]) {
        this.mockData = data;
    }

    async fetch(id: string): Promise<VFinding> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const item = ValidationRepository.mockData.find((m) => m.id === id);
                if (item) {
                    // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                    resolve(item);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async fetchAll<U = VFinding>(options?: {
        page?: number;
        limit?: number;
        collection?: string;
    }): Promise<U[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50 } = options ?? {};
                const start = (page - 1) * limit;
                const data = ValidationRepository.mockData.slice(start, start + limit);
                // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                resolve(data as unknown as U[]);
            }, 300);
        });
    }

    async create(data: Omit<VFinding, "id">): Promise<VFinding> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newItem = { ...data, id: `ID-${Date.now()}` };
                ValidationRepository.mockData.push(newItem);
                resolve(newItem);
            }, 100);
        });
    }

    async update(id: string, data: Partial<VFinding>): Promise<VFinding> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = ValidationRepository.mockData.findIndex((m) => m.id === id);
                if (idx >= 0) {
                    ValidationRepository.mockData[idx] = {
                        ...ValidationRepository.mockData[idx],
                        ...data,
                    };
                    resolve(ValidationRepository.mockData[idx]);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const initialLength = ValidationRepository.mockData.length;
                ValidationRepository.mockData = ValidationRepository.mockData.filter(
                    (m) => m.id !== id,
                );
                resolve(ValidationRepository.mockData.length < initialLength);
            }, 100);
        });
    }

    static async getAll(): Promise<VFinding[]> {
        const repo = new ValidationRepository();
        return repo.fetchAll({ limit: 1000 });
    }
}
