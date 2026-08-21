import { MISSIONS } from "@/data/fixtures/missions";
import { type Mission } from "@/types/domain-types";

export class MissionRepository {
    private static mockData: Mission[] = [...MISSIONS];

    static seed(data: Mission[]) {
        this.mockData = data;
    }

    static async getMissions(): Promise<Mission[]> {
        // Simulate network latency
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...this.mockData]);
            }, 300);
        });
    }

    static async getMissionById(id: string): Promise<Mission | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mission = this.mockData.find((m) => m.id === id);
                resolve(mission ?? null);
            }, 100);
        });
    }
}
