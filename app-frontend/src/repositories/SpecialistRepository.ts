import { SPECIALISTS } from "@/data/fixtures/specialists";
import { type DataSource } from "@/types/adapters";
import { type Specialist } from "@/types/domain-types";

export class SpecialistRepository implements DataSource<Specialist> {
    private mockData: Specialist[];

    constructor(initialData?: Specialist[]) {
        this.mockData = initialData ? [...initialData] : [...SPECIALISTS];
    }

    static seed(_data: Specialist[]) {
        // Obsolete static seed: repositories should now be instantiated per-session
        console.warn("SpecialistRepository.seed() called but mock data is now instance-bound");
    }

    async fetch(id: string): Promise<Specialist> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const specialist = this.mockData.find((s) => s.id === id);
                if (specialist) {
                    // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                    resolve(specialist);
                } else {
                    reject(new Error("Specialist not found"));
                }
            }, 100);
        });
    }

    async fetchAll(options?: { page?: number; limit?: number }): Promise<Specialist[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50 } = options ?? {};
                const start = (page - 1) * limit;
                const data = this.mockData.slice(start, start + limit);
                // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                resolve(data);
            }, 300);
        });
    }

    async create(data: Omit<Specialist, "id">): Promise<Specialist> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newSpecialist = { ...data, id: `S-${Date.now()}` };
                this.mockData.push(newSpecialist);
                resolve(newSpecialist);
            }, 100);
        });
    }

    async update(id: string, data: Partial<Specialist>): Promise<Specialist> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = this.mockData.findIndex((s) => s.id === id);
                if (idx >= 0) {
                    this.mockData[idx] = {
                        ...this.mockData[idx],
                        ...data,
                    };
                    resolve(this.mockData[idx]);
                } else {
                    reject(new Error("Specialist not found"));
                }
            }, 100);
        });
    }

    async delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const initialLength = this.mockData.length;
                this.mockData = this.mockData.filter((s) => s.id !== id);
                resolve(this.mockData.length < initialLength);
            }, 100);
        });
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
