import { MISSIONS } from "@/data/fixtures/missions";
import { type DataSource } from "@/types/adapters";
import { type Mission } from "@/types/domain-types";

export class MissionRepository implements DataSource<Mission> {
    private mockData: Mission[];

    constructor(initialData?: Mission[]) {
        this.mockData = initialData ? [...initialData] : [...MISSIONS];
    }

    static seed(_data: Mission[]) {
        // Obsolete static seed: repositories should now be instantiated per-session
        console.warn("MissionRepository.seed() called but mock data is now instance-bound");
    }

    async fetch(id: string): Promise<Mission> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const mission = this.mockData.find((m) => m.id === id);
                if (mission) {
                    // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                    resolve(mission);
                } else {
                    reject(new Error("Mission not found"));
                }
            }, 100);
        });
    }

    async fetchAll(options?: { page?: number; limit?: number }): Promise<Mission[]> {
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

    async create(data: Omit<Mission, "id">): Promise<Mission> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newMission = { ...data, id: `M-${Date.now()}` };
                this.mockData.push(newMission);
                resolve(newMission);
            }, 100);
        });
    }

    async update(id: string, data: Partial<Mission>): Promise<Mission> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = this.mockData.findIndex((m) => m.id === id);
                if (idx >= 0) {
                    this.mockData[idx] = {
                        ...this.mockData[idx],
                        ...data,
                    };
                    resolve(this.mockData[idx]);
                } else {
                    reject(new Error("Mission not found"));
                }
            }, 100);
        });
    }

    async delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const initialLength = this.mockData.length;
                this.mockData = this.mockData.filter((m) => m.id !== id);
                resolve(this.mockData.length < initialLength);
            }, 100);
        });
    }
}
