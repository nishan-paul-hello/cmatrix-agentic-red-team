import { MISSIONS } from "@/data/fixtures/missions";
import { type DataSource } from "@/types/adapters";
import { type Mission } from "@/types/domain-types";

export class MissionRepository implements DataSource<Mission> {
    private static mockData: Mission[] = [...MISSIONS];

    static seed(data: Mission[]) {
        this.mockData = data;
    }

    async fetch(id: string): Promise<Mission> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const mission = MissionRepository.mockData.find((m) => m.id === id);
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
                const data = MissionRepository.mockData.slice(start, start + limit);
                // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                resolve(data);
            }, 300);
        });
    }

    async create(data: Omit<Mission, "id">): Promise<Mission> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newMission = { ...data, id: `M-${Date.now()}` };
                MissionRepository.mockData.push(newMission);
                resolve(newMission);
            }, 100);
        });
    }

    async update(id: string, data: Partial<Mission>): Promise<Mission> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = MissionRepository.mockData.findIndex((m) => m.id === id);
                if (idx >= 0) {
                    MissionRepository.mockData[idx] = {
                        ...MissionRepository.mockData[idx],
                        ...data,
                    };
                    resolve(MissionRepository.mockData[idx]);
                } else {
                    reject(new Error("Mission not found"));
                }
            }, 100);
        });
    }

    async delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const initialLength = MissionRepository.mockData.length;
                MissionRepository.mockData = MissionRepository.mockData.filter((m) => m.id !== id);
                resolve(MissionRepository.mockData.length < initialLength);
            }, 100);
        });
    }

    static async getMissions(): Promise<Mission[]> {
        const repo = new MissionRepository();
        return repo.fetchAll({ limit: 1000 }); // Return all for now to not break existing calls
    }

    static async getMissionById(id: string): Promise<Mission | null> {
        try {
            const repo = new MissionRepository();
            return await repo.fetch(id);
        } catch {
            return null;
        }
    }
}
