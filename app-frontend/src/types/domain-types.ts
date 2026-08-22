import { type TaskCommand } from "@/features/execution/domain/TaskCommand";

export const MISSION_STATUS = {
    QUEUED: "QUEUED",
    RUNNING: "RUNNING",
    VALIDATING: "VALIDATING",
    PAUSED: "PAUSED",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
} as const;

export type MissionStatus = (typeof MISSION_STATUS)[keyof typeof MISSION_STATUS];

export const TASK_STATUS = {
    PENDING: "PENDING",
    RUNNING: "RUNNING",
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
    TIMEOUT: "TIMEOUT",
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export const FINDING_STATUS = {
    PENDING: "PENDING",
    VALIDATED: "VALIDATED",
    ORACLE_CONFIRMED: "ORACLE_CONFIRMED",
    RULED_OUT: "RULED_OUT",
} as const;

export type FindingStatus = (typeof FINDING_STATUS)[keyof typeof FINDING_STATUS];

export const BENCHMARK_STATUS = {
    COMPLETE: "COMPLETE",
    RUNNING: "RUNNING",
    QUEUED: "QUEUED",
} as const;

export type BenchmarkStatus = (typeof BENCHMARK_STATUS)[keyof typeof BENCHMARK_STATUS];

export const SPEC_STATUS = {
    RUNNING: "RUNNING",
    IDLE: "IDLE",
    QUEUED: "QUEUED",
    WAITING: "WAITING",
    VALIDATING: "VALIDATING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
    BLOCKED: "BLOCKED",
} as const;

export type SpecStatus = (typeof SPEC_STATUS)[keyof typeof SPEC_STATUS];

export interface Mission {
    id: string;
    target: string;
    surface: string;
    mode: string;
    status: MissionStatus;
    nodes: number;
    findings: number;
    cost: string;
    started: string;
}

export interface ExecEntry {
    id: string;
    ts: string;
    specialist: string;
    command: TaskCommand;
    duration: string;
    status: TaskStatus;
    output: string;
    size: string;
}

export interface Specialist {
    id: string;
    role: string;
    status: SpecStatus;
    task: string;
    context: string;
    evidence: number;
    node: string;
    failures: number;
    skills: number;
}

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface Finding {
    id: string;
    type: string;
    target: string;
    severity: Severity;
    eord: number;
    status: FindingStatus;
    first: string;
    validated: string;
    path: string[];
}

export type AuditEventType = "AUTH" | "MISSION" | "EXECUTION" | "ESCALATION" | "SYSTEM" | "CONFIG";

export const AUDIT_RESULT = {
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE",
    WARNING: "WARNING",
} as const;

export type AuditResultValue = (typeof AUDIT_RESULT)[keyof typeof AUDIT_RESULT];

export interface AuditEntry {
    id: string;
    ts: string;
    type: AuditEventType;
    actor: string;
    action: string;
    resource: string;
    result: AuditResultValue;
    ip: string;
    detail: string;
}

export const VDG_NODE_STATUS = {
    COMPLETED: "COMPLETED",
    EXPLOITED: "EXPLOITED",
    ELIGIBLE: "ELIGIBLE",
    IN_PROGRESS: "IN_PROGRESS",
    DEPENDENT: "DEPENDENT",
    INFEASIBLE: "INFEASIBLE",
} as const;

export type VdgNodeStatus = (typeof VDG_NODE_STATUS)[keyof typeof VDG_NODE_STATUS];

// §18 Human-in-the-loop / Escalation pattern
export interface RiskAssessment {
    score: number;
    threshold: number;
}

// §19 Supervisor / Guardrail pattern
export interface GuardrailResult {
    findingId: string;
    verifiedBy: "SUPERVISOR";
    verdict: "PASS" | "FAIL" | "NEEDS_REVIEW";
    notes?: string;
}

// §22 Context-Window / Memory-Tiering pattern
export type MemoryTier = "SHORT_TERM" | "LONG_TERM";
