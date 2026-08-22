import {
    PREVIEW_SECTIONS,
    REPORTS,
    type Report,
} from "@/features/reports/data/fixtures/reportsMockData";
import { type DataSource } from "@/types/adapters";

export class ReportsRepository implements DataSource<Report> {
    private static mockData: Report[] = [...REPORTS];

    static seed(data: Report[]) {
        this.mockData = data;
    }

    async fetch(id: string): Promise<Report> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const item = ReportsRepository.mockData.find((m) => m.id === id);
                if (item) {
                    // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                    resolve(item);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async fetchAll(options?: { page?: number; limit?: number }): Promise<Report[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50 } = options ?? {};
                const start = (page - 1) * limit;
                const data = ReportsRepository.mockData.slice(start, start + limit);
                // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                resolve(data);
            }, 300);
        });
    }

    async create(data: Omit<Report, "id">): Promise<Report> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newItem = { ...data, id: `ID-${Date.now()}` };
                ReportsRepository.mockData.push(newItem);
                resolve(newItem);
            }, 100);
        });
    }

    async update(id: string, data: Partial<Report>): Promise<Report> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = ReportsRepository.mockData.findIndex((m) => m.id === id);
                if (idx >= 0) {
                    ReportsRepository.mockData[idx] = {
                        ...ReportsRepository.mockData[idx],
                        ...data,
                    };
                    resolve(ReportsRepository.mockData[idx]);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const initialLength = ReportsRepository.mockData.length;
                ReportsRepository.mockData = ReportsRepository.mockData.filter((m) => m.id !== id);
                resolve(ReportsRepository.mockData.length < initialLength);
            }, 100);
        });
    }

    static async getAll(): Promise<Report[]> {
        const repo = new ReportsRepository();
        return repo.fetchAll({ limit: 1000 });
    }

    static async getPreviewSections() {
        return Promise.resolve([...PREVIEW_SECTIONS]);
    }
}
