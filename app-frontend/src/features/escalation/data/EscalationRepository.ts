import {
    CONTEXT_BLOCKS,
    type EscalationContextBlock,
} from "@/features/escalation/data/fixtures/escalationMockData";
import { type DataSource } from "@/types/adapters";

export class EscalationRepository implements DataSource<EscalationContextBlock> {
    private static mockData: EscalationContextBlock[] = [...CONTEXT_BLOCKS];

    static seed(data: EscalationContextBlock[]) {
        this.mockData = data;
    }

    async fetch(id: string): Promise<EscalationContextBlock> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const item = EscalationRepository.mockData.find(
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

    async fetchAll<U = EscalationContextBlock>(options?: {
        page?: number;
        limit?: number;
        collection?: string;
    }): Promise<U[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50 } = options ?? {};
                const start = (page - 1) * limit;
                const data = EscalationRepository.mockData.slice(start, start + limit);
                // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                resolve(data as unknown as U[]);
            }, 300);
        });
    }

    async create(data: Omit<EscalationContextBlock, "id">): Promise<EscalationContextBlock> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newItem = { ...data, id: `ID-${Date.now()}` } as EscalationContextBlock;
                EscalationRepository.mockData.push(newItem);
                resolve(newItem);
            }, 100);
        });
    }

    async update(
        id: string,
        data: Partial<EscalationContextBlock>,
    ): Promise<EscalationContextBlock> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = EscalationRepository.mockData.findIndex(
                    (m) => (m as { id?: string }).id === id,
                );
                if (idx >= 0) {
                    EscalationRepository.mockData[idx] = {
                        ...EscalationRepository.mockData[idx],
                        ...data,
                    };
                    resolve(EscalationRepository.mockData[idx]);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const initialLength = EscalationRepository.mockData.length;
                EscalationRepository.mockData = EscalationRepository.mockData.filter(
                    (m) => (m as { id?: string }).id !== id,
                );
                resolve(EscalationRepository.mockData.length < initialLength);
            }, 100);
        });
    }

    static async getAll(): Promise<EscalationContextBlock[]> {
        const repo = new EscalationRepository();
        return repo.fetchAll({ limit: 1000 });
    }
}
