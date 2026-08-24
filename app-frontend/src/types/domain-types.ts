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
    RETRY: "RETRY",
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

export interface Service {
    host: string;
    port: string;
    service: string;
    version: string;
    banner: string;
    status: string;
}

export interface CredentialEntry {
    username: string;
    hash: string;
    source: string;
    scope: string;
    status: string;
    plain: string;
}

export interface AuthState {
    id: string;
    session: string;
    user: string;
    role: string;
    method: string;
    issued: string;
    expiry: string;
    status: string;
    csrf: string;
}

export interface Parameter {
    id: string;
    endpoint: string;
    param: string;
    type: string;
    source: string;
    injectable: boolean;
    lastVal: string;
}

export interface CveCandidate {
    id: string;
    tech: string;
    class: string;
    epss: number;
    poc: boolean;
    node: string;
    eord: number;
}

export interface EvidenceArtifact {
    id: string;
    type: string;
    finding: string;
    ts: string;
    size: string;
    note: string;
}

export interface FailureLogEntry {
    id: string;
    ts: string;
    spec: string;
    action: string;
    type: string;
    severity: string;
    diagnosis: string;
    correctable: boolean;
    resolution: string;
    lessons: string[];
}

export interface EnvFailureLogEntry {
    id: string;
    ts: string;
    spec: string;
    action: string;
    target: string;
    error: string;
    eord: number;
    resolved: boolean;
}

export interface MemoryNode {
    id: string;
    vuln: string;
    target: string;
    subtype: string;
    score: number;
    uses: number;
    lastSeen: string;
    techniques: string[];
    indicators: string[];
    evolution: { ts: string; note: string }[];
}

export interface HostNode {
    id: string;
    ip: string;
    hostname: string;
    role: string;
    os: string;
    services: string[];
    status: string;
    eord: number;
    edges: {
        to: string;
        label: string;
        detail: string;
        eord: number;
    }[];
}

export interface ElFinding {
    id: string;
    type: string;
    target: string;
    eord: number;
    vdgNode: string;
    evidence: string[];
}

export interface SkillEntry {
    id: string;
    name: string;
    cat: string;
    spec: string;
    calls: number;
    success: number;
    lastCall: string;
    desc: string;
    params: { k: string; t: string; desc: string }[];
}

export interface CtxSpecEntry {
    id: string;
    role: string;
    state: string;
    used: number;
    max: number;
    compacted: number;
    tokens: number;
}

export interface ActionEntry {
    id: string;
    action: string;
    ts: string;
    spec: string;
    tool: string;
    args: string;
    result: string;
    eord: string;
    status: string;
}

export interface BranchEntry {
    id: string;
    ts: string;
    decision: string;
    chosen: string;
    alternatives: string[];
    reason: string;
    outcome: string;
    impact: string;
    children: BranchEntry[];
}
