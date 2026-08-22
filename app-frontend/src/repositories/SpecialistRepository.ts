import { SPECIALISTS } from "@/data/fixtures/specialists";
import { type DataSource } from "@/types/adapters";
import { type Specialist } from "@/types/domain-types";

export class SpecialistRepository implements DataSource<Specialist> {
    private static mockData: Specialist[] = [...SPECIALISTS];

    static seed(data: Specialist[]) {
        this.mockData = data;
    }

    async fetch(id: string): Promise<Specialist> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const specialist = SpecialistRepository.mockData.find((s) => s.id === id);
                if (specialist) {
                    // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                    resolve(specialist);
                } else {
                    reject(new Error("Specialist not found"));
                }
            }, 100);
        });
    }

    async fetchAll<U = Specialist>(options?: {
        page?: number;
        limit?: number;
        collection?: string;
    }): Promise<U[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50 } = options ?? {};
                const start = (page - 1) * limit;
                const data = SpecialistRepository.mockData.slice(start, start + limit);
                // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                resolve(data as unknown as U[]);
            }, 300);
        });
    }

    async create(data: Omit<Specialist, "id">): Promise<Specialist> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newSpecialist = { ...data, id: `S-${Date.now()}` };
                SpecialistRepository.mockData.push(newSpecialist);
                resolve(newSpecialist);
            }, 100);
        });
    }

    async update(id: string, data: Partial<Specialist>): Promise<Specialist> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = SpecialistRepository.mockData.findIndex((s) => s.id === id);
                if (idx >= 0) {
                    SpecialistRepository.mockData[idx] = {
                        ...SpecialistRepository.mockData[idx],
                        ...data,
                    };
                    resolve(SpecialistRepository.mockData[idx]);
                } else {
                    reject(new Error("Specialist not found"));
                }
            }, 100);
        });
    }

    async delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const initialLength = SpecialistRepository.mockData.length;
                SpecialistRepository.mockData = SpecialistRepository.mockData.filter(
                    (s) => s.id !== id,
                );
                resolve(SpecialistRepository.mockData.length < initialLength);
            }, 100);
        });
    }

    static async getSpecialists(): Promise<Specialist[]> {
        const repo = new SpecialistRepository();
        return repo.fetchAll({ limit: 1000 }); // Return all for now
    }

    static async getTimeline(): Promise<{ ts: string; event: string; detail: string }[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                void import("@/data/fixtures/specialists").then((m) => {
                    // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                    resolve(m.TIMELINE);
                });
            }, 100);
        });
    }
}
