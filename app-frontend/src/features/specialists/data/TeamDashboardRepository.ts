import {
    getTeamDashboardData,
    type SchedEntry,
    type SpecialistEntry,
    type VDGEntry,
} from "@/features/specialists/data/fixtures/teamDashboardMockData";
import { type DataSource } from "@/types/adapters";

export type DashboardData = {
    id?: string; // Required by Omit<T, "id"> in DataSource
    vdg: VDGEntry[];
    specialists: SpecialistEntry[];
    sched: SchedEntry[];
};

export class TeamDashboardRepository implements DataSource<DashboardData> {
    private static mockData: DashboardData | null = null;

    private async ensureData(): Promise<DashboardData> {
        if (!TeamDashboardRepository.mockData) {
            const raw = await getTeamDashboardData();
            TeamDashboardRepository.mockData = { ...raw, id: "dashboard-singleton" };
        }
        return TeamDashboardRepository.mockData;
    }

    async fetch(id: string): Promise<DashboardData> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.ensureData()
                    .then((data) => {
                        if (data.id === id) {
                            resolve(data);
                        } else {
                            reject(new Error("Not found"));
                        }
                    })
                    .catch(reject);
            }, 100);
        });
    }

    async fetchAll<U = DashboardData>(_options?: {
        page?: number;
        limit?: number;
        collection?: string;
    }): Promise<U[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.ensureData()
                    .then((data) => resolve([data] as unknown as U[]))
                    .catch(reject);
            }, 300);
        });
    }

    async create(data: Omit<DashboardData, "id">): Promise<DashboardData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newItem = { ...data, id: `ID-${Date.now()}` };
                TeamDashboardRepository.mockData = newItem;
                resolve(newItem);
            }, 100);
        });
    }

    async update(id: string, data: Partial<DashboardData>): Promise<DashboardData> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.ensureData()
                    .then((current) => {
                        if (current.id === id) {
                            TeamDashboardRepository.mockData = {
                                ...current,
                                ...data,
                            };
                            resolve(TeamDashboardRepository.mockData);
                        } else {
                            reject(new Error("Not found"));
                        }
                    })
                    .catch(reject);
            }, 100);
        });
    }

    async delete(_id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                TeamDashboardRepository.mockData = null;
                resolve(true);
            }, 100);
        });
    }
}
