import { type MissionStatus, type SpecStatus } from "@/types/domain-types";

/**
 * Orchestrator-Worker pattern for modeling the parent-child relationship
 * between a Mission (orchestrator) and its Specialists (workers).
 */

export interface WorkerSpecialist {
    id: string;
    role: string;
    status: SpecStatus;
    // Link back to the parent mission
    missionId: string;
}

export interface MissionOrchestrator {
    id: string;
    status: MissionStatus;
    workers: WorkerSpecialist[];

    // Aggregation logic could go here in a richer domain model,
    // e.g. areAllWorkersIdle(), getActiveWorkers(), etc.
}

export class MissionOrchestratorModel implements MissionOrchestrator {
    constructor(
        public id: string,
        public status: MissionStatus,
        public workers: WorkerSpecialist[],
    ) {}

    public hasActiveWorkers(): boolean {
        return this.workers.some((w) => w.status === "RUNNING" || w.status === "VALIDATING");
    }
}
