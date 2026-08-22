import { type DataSource } from "@/types/adapters";

import { EDGES, NODES, type Edge, type VDGNode } from "@/features/missions/data/fixtures/attackGraphMockData";

export class AttackGraphRepository implements DataSource<VDGNode> {
    private static mockNodes: VDGNode[] = [...NODES];
    private static mockEdges: Edge[] = [...EDGES];

    async fetch(id: string): Promise<VDGNode> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const node = AttackGraphRepository.mockNodes.find((n) => n.id === id);
                if (node) {
                    resolve(node);
                } else {
                    reject(new Error("Node not found"));
                }
            }, 100);
        });
    }

    async fetchAll<U = VDGNode>(options?: {
        page?: number;
        limit?: number;
        collection?: string;
    }): Promise<U[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50, collection } = options ?? {};

                if (collection === "edges") {
                    const start = (page - 1) * limit;
                    const data = AttackGraphRepository.mockEdges.slice(start, start + limit);
                    resolve(data as unknown as U[]);
                    return;
                }

                const start = (page - 1) * limit;
                const data = AttackGraphRepository.mockNodes.slice(start, start + limit);
                resolve(data as unknown as U[]);
            }, 300);
        });
    }

    async create(data: Omit<VDGNode, "id">): Promise<VDGNode> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newNode = { ...data, id: `NODE-${Date.now()}` };
                AttackGraphRepository.mockNodes.push(newNode);
                resolve(newNode);
            }, 100);
        });
    }

    async update(id: string, data: Partial<VDGNode>): Promise<VDGNode> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = AttackGraphRepository.mockNodes.findIndex((n) => n.id === id);
                if (idx >= 0) {
                    AttackGraphRepository.mockNodes[idx] = {
                        ...AttackGraphRepository.mockNodes[idx],
                        ...data,
                    };
                    resolve(AttackGraphRepository.mockNodes[idx]);
                } else {
                    reject(new Error("Node not found"));
                }
            }, 100);
        });
    }

    async delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const initialLength = AttackGraphRepository.mockNodes.length;
                AttackGraphRepository.mockNodes = AttackGraphRepository.mockNodes.filter(
                    (n) => n.id !== id,
                );
                resolve(AttackGraphRepository.mockNodes.length < initialLength);
            }, 100);
        });
    }

    static async getNodes(): Promise<VDGNode[]> {
        const repo = new AttackGraphRepository();
        return repo.fetchAll({ limit: 1000 });
    }

    static async getEdges(): Promise<Edge[]> {
        const repo = new AttackGraphRepository();
        return repo.fetchAll<Edge>({ limit: 1000, collection: "edges" });
    }
}
