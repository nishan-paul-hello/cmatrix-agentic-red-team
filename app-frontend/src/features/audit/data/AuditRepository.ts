import { ENTRIES } from "@/features/audit/data/fixtures/auditMockData";
import { type DataSource } from "@/types/adapters";
import { type AuditEntry } from "@/types/domain-types";

export class AuditRepository implements DataSource<AuditEntry> {
    private static mockData: AuditEntry[] = [...ENTRIES];

    static seed(data: AuditEntry[]) {
        this.mockData = data;
    }

    async fetch(id: string): Promise<AuditEntry> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const item = AuditRepository.mockData.find((m) => m.id === id);
                if (item) {
                    // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                    resolve(item);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async fetchAll(options?: { page?: number; limit?: number }): Promise<AuditEntry[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50 } = options ?? {};
                const start = (page - 1) * limit;
                const data = AuditRepository.mockData.slice(start, start + limit);
                // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                resolve(data);
            }, 300);
        });
    }

    async create(data: Omit<AuditEntry, "id">): Promise<AuditEntry> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newItem = { ...data, id: `ID-${Date.now()}` };
                AuditRepository.mockData.push(newItem);
                resolve(newItem);
            }, 100);
        });
    }

    async update(id: string, data: Partial<AuditEntry>): Promise<AuditEntry> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = AuditRepository.mockData.findIndex((m) => m.id === id);
                if (idx >= 0) {
                    AuditRepository.mockData[idx] = { ...AuditRepository.mockData[idx], ...data };
                    resolve(AuditRepository.mockData[idx]);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const initialLength = AuditRepository.mockData.length;
                AuditRepository.mockData = AuditRepository.mockData.filter((m) => m.id !== id);
                resolve(AuditRepository.mockData.length < initialLength);
            }, 100);
        });
    }

    static async getAll(): Promise<AuditEntry[]> {
        const repo = new AuditRepository();
        return repo.fetchAll({ limit: 1000 });
    }
}
