import {
    AUTH_STATES,
    CREDS,
    CVE_CANDIDATES,
    EL_FINDINGS,
    ENDPOINTS,
    EVIDENCE_ARTIFACTS,
    FAILURE_LOG,
    HOSTS,
    PARAMS,
    SERVICES,
    type Endpoint,
} from "@/features/environment/data/mockData";
import { type DataSource } from "@/types/adapters";

export class EnvironmentRepository implements DataSource<Record<string, unknown>> {
    private static mockData: unknown[] = [...ENDPOINTS];

    static seed(data: Endpoint[]) {
        this.mockData = data;
    }

    async fetch(id: string): Promise<Endpoint> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const item = EnvironmentRepository.mockData.find(
                    (m) => (m as { id?: string }).id === id,
                );
                if (item) {
                    // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                    resolve(item as Endpoint);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async fetchAll<U = Record<string, unknown>>(options?: {
        page?: number;
        limit?: number;
        collection?: string;
    }): Promise<U[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50 } = options ?? {};
                let dataSource = EnvironmentRepository.mockData;
                const collection = options?.collection ?? "ENDPOINTS";
                switch (collection) {
                    case "ENDPOINTS":
                        dataSource = ENDPOINTS;
                        break;
                    case "SERVICES":
                        dataSource = SERVICES;
                        break;
                    case "HOSTS":
                        dataSource = HOSTS;
                        break;
                    case "CREDS":
                        dataSource = CREDS;
                        break;
                    case "AUTH_STATES":
                        dataSource = AUTH_STATES;
                        break;
                    case "PARAMS":
                        dataSource = PARAMS;
                        break;
                    case "CVE_CANDIDATES":
                        dataSource = CVE_CANDIDATES;
                        break;
                    case "EL_FINDINGS":
                        dataSource = EL_FINDINGS;
                        break;
                    case "EVIDENCE_ARTIFACTS":
                        dataSource = EVIDENCE_ARTIFACTS;
                        break;
                    case "FAILURE_LOG":
                        dataSource = FAILURE_LOG;
                        break;
                    default:
                        break;
                }
                const start = (page - 1) * limit;
                const data = dataSource.slice(start, start + limit);
                // VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data
                resolve(data as unknown as U[]);
            }, 300);
        });
    }

    async create(data: Omit<Endpoint, "id">): Promise<Endpoint> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newItem = { ...data, id: `ID-${Date.now()}` } as Endpoint;
                EnvironmentRepository.mockData.push(newItem);
                resolve(newItem);
            }, 100);
        });
    }

    async update(id: string, data: Partial<Endpoint>): Promise<Endpoint> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = EnvironmentRepository.mockData.findIndex(
                    (m) => (m as { id?: string }).id === id,
                );
                if (idx >= 0) {
                    EnvironmentRepository.mockData[idx] = {
                        ...(EnvironmentRepository.mockData[idx] as Endpoint),
                        ...data,
                    };
                    resolve(EnvironmentRepository.mockData[idx] as Endpoint);
                } else {
                    reject(new Error("Not found"));
                }
            }, 100);
        });
    }

    async delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const initialLength = EnvironmentRepository.mockData.length;
                EnvironmentRepository.mockData = EnvironmentRepository.mockData.filter(
                    (m) => (m as { id?: string }).id !== id,
                );
                resolve(EnvironmentRepository.mockData.length < initialLength);
            }, 100);
        });
    }

    static async getSERVICES() {
        return new Promise((resolve) => setTimeout(() => resolve(SERVICES), 300));
    }

    static async getHOSTS() {
        return new Promise((resolve) => setTimeout(() => resolve(HOSTS), 300));
    }

    static async getCREDS() {
        return new Promise((resolve) => setTimeout(() => resolve(CREDS), 300));
    }

    static async getAUTH_STATES() {
        return new Promise((resolve) => setTimeout(() => resolve(AUTH_STATES), 300));
    }

    static async getPARAMS() {
        return new Promise((resolve) => setTimeout(() => resolve(PARAMS), 300));
    }

    static async getCVE_CANDIDATES() {
        return new Promise((resolve) => setTimeout(() => resolve(CVE_CANDIDATES), 300));
    }

    static async getEL_FINDINGS() {
        return new Promise((resolve) => setTimeout(() => resolve(EL_FINDINGS), 300));
    }

    static async getEVIDENCE_ARTIFACTS() {
        return new Promise((resolve) => setTimeout(() => resolve(EVIDENCE_ARTIFACTS), 300));
    }

    static async getFAILURE_LOG() {
        return new Promise((resolve) => setTimeout(() => resolve(FAILURE_LOG), 300));
    }

    static async getAll(): Promise<Endpoint[]> {
        const repo = new EnvironmentRepository();
        return repo.fetchAll<Endpoint>({ limit: 1000 });
    }
}
