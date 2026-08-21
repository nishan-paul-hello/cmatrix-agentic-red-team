import { type Specialist } from "@/types/domain-types";

import { SPECIALISTS } from "../data/fixtures/specialists";

export class SpecialistRepository {
    private static mockData: Specialist[] = [...SPECIALISTS];

    static seed(data: Specialist[]) {
        this.mockData = data;
    }

    static async getSpecialists(): Promise<Specialist[]> {
        // Simulate network latency
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...this.mockData]);
            }, 300);
        });
    }

    static async getTimeline(): Promise<{ ts: string; event: string; detail: string }[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                void import("../data/fixtures/specialists").then((m) => resolve(m.TIMELINE));
            }, 100);
        });
    }
}
