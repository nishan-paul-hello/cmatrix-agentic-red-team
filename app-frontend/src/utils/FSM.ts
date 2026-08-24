import {
    BENCHMARK_STATUS,
    FINDING_STATUS,
    MISSION_STATUS,
    SPEC_STATUS,
    TASK_STATUS,
    VDG_NODE_STATUS,
    type BenchmarkStatus,
    type FindingStatus,
    type MissionStatus,
    type SpecStatus,
    type TaskStatus,
    type VdgNodeStatus,
} from "@/types/domain-types";

const MISSION_TRANSITIONS: Record<MissionStatus, Set<MissionStatus>> = {
    [MISSION_STATUS.QUEUED]: new Set([MISSION_STATUS.RUNNING, MISSION_STATUS.FAILED]),
    [MISSION_STATUS.RUNNING]: new Set([
        MISSION_STATUS.VALIDATING,
        MISSION_STATUS.PAUSED,
        MISSION_STATUS.COMPLETED,
        MISSION_STATUS.FAILED,
    ]),
    [MISSION_STATUS.VALIDATING]: new Set([MISSION_STATUS.COMPLETED, MISSION_STATUS.FAILED]),
    [MISSION_STATUS.PAUSED]: new Set([
        MISSION_STATUS.RUNNING,
        MISSION_STATUS.FAILED,
        MISSION_STATUS.COMPLETED,
    ]),
    [MISSION_STATUS.COMPLETED]: new Set([]),
    [MISSION_STATUS.FAILED]: new Set([]),
};

const TASK_TRANSITIONS: Record<TaskStatus, Set<TaskStatus>> = {
    [TASK_STATUS.PENDING]: new Set([TASK_STATUS.RUNNING, TASK_STATUS.FAILED, TASK_STATUS.TIMEOUT]),
    [TASK_STATUS.RUNNING]: new Set([TASK_STATUS.SUCCESS, TASK_STATUS.FAILED, TASK_STATUS.TIMEOUT]),
    [TASK_STATUS.SUCCESS]: new Set([]),
    [TASK_STATUS.FAILED]: new Set([]),
    [TASK_STATUS.TIMEOUT]: new Set([]),
};

const BENCHMARK_TRANSITIONS: Record<BenchmarkStatus, Set<BenchmarkStatus>> = {
    [BENCHMARK_STATUS.QUEUED]: new Set([BENCHMARK_STATUS.RUNNING]),
    [BENCHMARK_STATUS.RUNNING]: new Set([BENCHMARK_STATUS.COMPLETE]),
    [BENCHMARK_STATUS.COMPLETE]: new Set([]),
};

const SPEC_TRANSITIONS: Record<SpecStatus, Set<SpecStatus>> = {
    [SPEC_STATUS.QUEUED]: new Set([SPEC_STATUS.RUNNING, SPEC_STATUS.FAILED, SPEC_STATUS.BLOCKED]),
    [SPEC_STATUS.RUNNING]: new Set([
        SPEC_STATUS.WAITING,
        SPEC_STATUS.VALIDATING,
        SPEC_STATUS.COMPLETED,
        SPEC_STATUS.FAILED,
        SPEC_STATUS.BLOCKED,
    ]),
    [SPEC_STATUS.WAITING]: new Set([SPEC_STATUS.RUNNING, SPEC_STATUS.FAILED]),
    [SPEC_STATUS.VALIDATING]: new Set([
        SPEC_STATUS.COMPLETED,
        SPEC_STATUS.FAILED,
        SPEC_STATUS.RUNNING,
    ]),
    [SPEC_STATUS.BLOCKED]: new Set([SPEC_STATUS.RUNNING, SPEC_STATUS.FAILED]),
    [SPEC_STATUS.COMPLETED]: new Set([SPEC_STATUS.IDLE]),
    [SPEC_STATUS.IDLE]: new Set([SPEC_STATUS.RUNNING, SPEC_STATUS.QUEUED]),
    [SPEC_STATUS.FAILED]: new Set([SPEC_STATUS.IDLE]),
};

const FINDING_TRANSITIONS: Record<FindingStatus, Set<FindingStatus>> = {
    [FINDING_STATUS.PENDING]: new Set([FINDING_STATUS.VALIDATED, FINDING_STATUS.RULED_OUT]),
    [FINDING_STATUS.VALIDATED]: new Set([
        FINDING_STATUS.ORACLE_CONFIRMED,
        FINDING_STATUS.RULED_OUT,
    ]),
    [FINDING_STATUS.RULED_OUT]: new Set([FINDING_STATUS.VALIDATED]),
    [FINDING_STATUS.ORACLE_CONFIRMED]: new Set([]),
    [FINDING_STATUS.RETRY]: new Set([FINDING_STATUS.VALIDATED, FINDING_STATUS.RULED_OUT, FINDING_STATUS.PENDING]),
};

export function canTransitionMission(from: MissionStatus, to: MissionStatus): boolean {
    return MISSION_TRANSITIONS[from].has(to);
}

export function canTransitionTask(from: TaskStatus, to: TaskStatus): boolean {
    return TASK_TRANSITIONS[from].has(to);
}

export function canTransitionBenchmark(from: BenchmarkStatus, to: BenchmarkStatus): boolean {
    return BENCHMARK_TRANSITIONS[from].has(to);
}

export function canTransitionSpec(from: SpecStatus, to: SpecStatus): boolean {
    return SPEC_TRANSITIONS[from].has(to);
}

export function canTransitionFinding(from: FindingStatus, to: FindingStatus): boolean {
    return FINDING_TRANSITIONS[from].has(to);
}

const VDG_NODE_TRANSITIONS: Record<VdgNodeStatus, Set<VdgNodeStatus>> = {
    [VDG_NODE_STATUS.DEPENDENT]: new Set([VDG_NODE_STATUS.ELIGIBLE, VDG_NODE_STATUS.INFEASIBLE]),
    [VDG_NODE_STATUS.ELIGIBLE]: new Set([VDG_NODE_STATUS.IN_PROGRESS]),
    [VDG_NODE_STATUS.IN_PROGRESS]: new Set([
        VDG_NODE_STATUS.COMPLETED,
        VDG_NODE_STATUS.EXPLOITED,
        VDG_NODE_STATUS.INFEASIBLE,
    ]),
    [VDG_NODE_STATUS.COMPLETED]: new Set([]),
    [VDG_NODE_STATUS.EXPLOITED]: new Set([]),
    [VDG_NODE_STATUS.INFEASIBLE]: new Set([]),
};

export function canTransitionVdgNode(from: VdgNodeStatus, to: VdgNodeStatus): boolean {
    return VDG_NODE_TRANSITIONS[from].has(to);
}
