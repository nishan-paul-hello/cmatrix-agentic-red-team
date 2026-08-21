import { useState } from "react";
type SpecStatus =
    "RUNNING" | "IDLE" | "QUEUED" | "WAITING" | "VALIDATING" | "COMPLETED" | "FAILED" | "BLOCKED";
interface Spec {
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
const ALL: Spec[] = [
    {
        id: "S-01",
        role: "RECON SPECIALIST",
        status: "COMPLETED",
        task: "recon_target()",
        context: "COMPACTED",
        evidence: 34,
        node: "RECON-001",
        failures: 2,
        skills: 3,
    },
    {
        id: "S-02",
        role: "AUTH SPECIALIST",
        status: "COMPLETED",
        task: "exploit_auth()",
        context: "COMPACTED",
        evidence: 12,
        node: "AUTH-001",
        failures: 1,
        skills: 2,
    },
    {
        id: "S-03",
        role: "INJECTION SPECIALIST",
        status: "RUNNING",
        task: "sqli_blind_time()",
        context: "FRESH",
        evidence: 7,
        node: "SQLI-001",
        failures: 1,
        skills: 4,
    },
    {
        id: "S-04",
        role: "VALIDATION AGENT",
        status: "VALIDATING",
        task: "oracle_test(AUTH-001)",
        context: "FRESH",
        evidence: 4,
        node: "AUTH-001",
        failures: 0,
        skills: 1,
    },
    {
        id: "S-05",
        role: "LOGIC SPECIALIST",
        status: "IDLE",
        task: "—",
        context: "—",
        evidence: 0,
        node: "—",
        failures: 0,
        skills: 2,
    },
    {
        id: "S-06",
        role: "XSS SPECIALIST",
        status: "QUEUED",
        task: "xss_reflect_scan()",
        context: "PENDING",
        evidence: 0,
        node: "XSS-002",
        failures: 0,
        skills: 3,
    },
    {
        id: "S-07",
        role: "NETWORK SPECIALIST",
        status: "BLOCKED",
        task: "lateral_pivot()",
        context: "STALE",
        evidence: 2,
        node: "DB-ACCESS-002",
        failures: 3,
        skills: 2,
    },
    {
        id: "S-08",
        role: "EVAL AGENT",
        status: "COMPLETED",
        task: "eval_evidence(SQLI-001)",
        context: "COMPACTED",
        evidence: 9,
        node: "SQLI-001",
        failures: 0,
        skills: 1,
    },
];
const DOT: Record<SpecStatus, string> = {
    RUNNING: "var(--color-hex-e31b23)",
    IDLE: "var(--color-hex-333333)",
    QUEUED: "var(--color-hex-555555)",
    WAITING: "var(--color-hex-d29922)",
    VALIDATING: "var(--color-hex-ff2a32)",
    COMPLETED: "var(--color-hex-3fb950)",
    FAILED: "var(--color-hex-ff2a32)",
    BLOCKED: "var(--color-hex-6f171b)",
};
const BADGE_BG: Record<SpecStatus, string> = {
    RUNNING: "var(--color-hex-1a0608)",
    IDLE: "transparent",
    QUEUED: "transparent",
    WAITING: "var(--color-hex-1a1200)",
    VALIDATING: "var(--color-hex-1a0608)",
    COMPLETED: "var(--color-hex-0a1a10)",
    FAILED: "var(--color-hex-1a0608)",
    BLOCKED: "var(--color-hex-0d0808)",
};
const TIMELINE = [
    {
        ts: "06:12:01",
        event: "SPAWN",
        detail: "FRESH context initialized",
    },
    {
        ts: "06:12:04",
        event: "CONTEXT INJECTION",
        detail: "Mission metadata + EL snapshot (87 facts) injected",
    },
    {
        ts: "06:12:09",
        event: "TASK EXECUTION",
        detail: "sqli_blind_time() dispatched to execution agent",
    },
    {
        ts: "06:29:03",
        event: "OUTPUT",
        detail: "Response delta 4.18s — timing confirmed",
    },
    {
        ts: "06:29:08",
        event: "EVALUATION",
        detail: "E_ord raised 3→4 by eval agent",
    },
    {
        ts: "06:31:04",
        event: "HANDOFF",
        detail: "Evidence returned to team manager — UCB updated",
    },
];
export default function Specialists() {
    const [detail, setDetail] = useState<Spec | null>(null);
    return detail ? (
        <SpecDetail spec={detail} onBack={() => setDetail(null)} />
    ) : (
        <SpecGrid onSelect={setDetail} />
    );
}
function SpecGrid({ onSelect }: { onSelect: (s: Spec) => void }) {
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    MISSION
                </div>
                <div className="flex items-baseline gap-3">
                    <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        SPECIALISTS
                    </h1>
                    <span className="text-[10px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                        AGENT ROSTER · CVE-001
                    </span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="grid grid-cols-4 gap-3">
                    {ALL.map((s) => {
                        const dot = DOT[s.status],
                            bg = BADGE_BG[s.status];
                        const running = s.status === "RUNNING" || s.status === "VALIDATING";
                        return (
                            <button
                                key={s.id}
                                onClick={() => onSelect(s)}
                                className={`font-inherit relative flex cursor-pointer flex-col rounded-[2px] border border-solid bg-[var(--color-hex-0d0d0d)] text-left transition-colors duration-100 ${running ? "border-[var(--color-hex-e31b23)] hover:border-[var(--color-hex-ff2a32)]" : "border-[var(--color-hex-1e1e1e)] hover:border-[var(--color-hex-333333)]"}`}
                                style={{
                                    padding: "14px 14px 12px",
                                }}
                            >
                                {running && (
                                    <div
                                        className="absolute rounded-[3px] border-[1px] border-solid border-[var(--color-hex-e31b2330)]"
                                        style={{
                                            inset: -3,
                                            pointerEvents: "none",
                                            animation: "ring 2s ease infinite",
                                        }}
                                    />
                                )}
                                <div className="mb-2 flex items-center justify-between">
                                    <div
                                        className="h-[8px] w-[8px] shrink-0"
                                        style={{
                                            borderRadius: "50%",
                                            background:
                                                s.status !== "IDLE" && s.status !== "QUEUED"
                                                    ? dot
                                                    : "transparent",
                                            border: `1px solid ${dot}`,
                                            animation: running
                                                ? "pulse 1.4s ease infinite"
                                                : "none",
                                        }}
                                    />
                                    <span
                                        className="rounded-[2px] px-[5px] py-[1px] text-[8px] font-semibold tracking-[0.12em]"
                                        style={{
                                            color: dot,
                                            background: bg,
                                            border: `1px solid ${dot}44`,
                                        }}
                                    >
                                        {s.status}
                                    </span>
                                </div>
                                <div className="mb-[4px] text-[10px] leading-[1.3] font-bold tracking-[0.1em] text-[var(--color-hex-a0a0a0)]">
                                    {s.role}
                                </div>
                                <div className="mb-[10px] min-h-[28px] text-[8.5px] tracking-[0.06em] text-[var(--color-hex-444444)]">
                                    {s.task}
                                </div>
                                <div className="mb-[8px] h-[1px] bg-[var(--color-hex-1a1a1a)]" />
                                <div className="grid grid-cols-2 gap-1">
                                    <Kv k="NODE" v={s.node} />
                                    <Kv k="CTX" v={s.context} />
                                    <Kv k="EL" v={String(s.evidence)} />
                                    <Kv k="FAILURES" v={String(s.failures)} red={s.failures > 0} />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
            <style>{`@keyframes ring{0%,100%{opacity:.5}50%{opacity:.1}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
        </div>
    );
}
function SpecDetail({ spec, onBack }: { spec: Spec; onBack: () => void }) {
    const dot = DOT[spec.status];
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <button
                    onClick={onBack}
                    className="font-inherit mb-[10px] cursor-pointer border-none bg-[transparent] p-[0px] text-[9px] tracking-[0.14em] text-[var(--color-hex-666666)] hover:text-[var(--color-hex-a0a0a0)]"
                >
                    ← SPECIALISTS
                </button>
                <div className="flex items-center gap-3">
                    <h1 className="text-[18px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        {spec.role}
                    </h1>
                    <span
                        className="rounded-[2px] px-[7px] py-[2px] text-[8.5px] font-semibold tracking-[0.14em]"
                        style={{
                            color: dot,
                            background: BADGE_BG[spec.status],
                            border: `1px solid ${dot}44`,
                        }}
                    >
                        {spec.status}
                    </span>
                </div>
            </div>

            <div className="flex min-h-[0px] flex-1 overflow-hidden">
                {/* Main */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {/* Key-value block */}
                    <div className="mb-[20px] overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                        {[
                            {
                                k: "CURRENT TASK",
                                v: spec.task,
                            },
                            {
                                k: "ASSIGNED NODE",
                                v: spec.node,
                            },
                            {
                                k: "CONTEXT",
                                v: spec.context,
                            },
                            {
                                k: "EL SNAPSHOT",
                                v: `${spec.evidence} facts`,
                            },
                            {
                                k: "FAILURE MEMORY",
                                v: `${spec.failures} relevant reflections`,
                            },
                            {
                                k: "SKILL LIBRARY",
                                v: `${spec.skills} matching skills`,
                            },
                        ].map((r, i, a) => (
                            <div
                                key={r.k}
                                className="flex"
                                style={{
                                    borderBottom:
                                        i < a.length - 1
                                            ? "1px solid var(--color-hex-141414)"
                                            : "none",
                                    background:
                                        i % 2
                                            ? "var(--color-hex-0b0b0b)"
                                            : "var(--color-hex-0d0d0d)",
                                }}
                            >
                                <div
                                    className="w-[140px] shrink-0 px-[14px] py-[9px] text-[8.5px] font-semibold tracking-[0.18em] text-[var(--color-hex-444444)]"
                                    style={{
                                        borderRight: "1px solid var(--color-hex-141414)",
                                    }}
                                >
                                    {r.k}
                                </div>
                                <div className="flex-1 px-[14px] py-[9px] text-[10px] tracking-[0.04em] text-[var(--color-hex-888888)]">
                                    {r.v}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Invocation timeline */}
                    <div className="mb-[14px] text-[9px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                        INVOCATION TIMELINE
                    </div>
                    <div
                        className="flex flex-col"
                        style={{
                            gap: 0,
                        }}
                    >
                        {TIMELINE.map((t, i) => (
                            <div key={t.event} className="flex items-start gap-4">
                                <div className="flex flex-shrink-0 flex-col items-center">
                                    <div
                                        className="mt-[2px] h-[8px] w-[8px] rounded-[1px]"
                                        style={{
                                            border: `1px solid ${i === TIMELINE.length - 1 ? "var(--color-hex-e31b23)" : "var(--color-hex-333333)"}`,
                                            background:
                                                i === TIMELINE.length - 1
                                                    ? "var(--color-hex-e31b23)"
                                                    : i < TIMELINE.length - 1
                                                      ? "var(--color-hex-1a1a1a)"
                                                      : "transparent",
                                        }}
                                    />
                                    {i < TIMELINE.length - 1 && (
                                        <div className="h-[28px] w-[1px] bg-[var(--color-hex-1e1e1e)]" />
                                    )}
                                </div>
                                <div
                                    className="mb-[4px]"
                                    style={{
                                        paddingBottom: i < TIMELINE.length - 1 ? 0 : 0,
                                    }}
                                >
                                    <div className="mb-0.5 flex items-center gap-3">
                                        <span className="text-[8.5px] tracking-[0.06em] text-[var(--color-hex-333333)]">
                                            {t.ts}
                                        </span>
                                        <span
                                            className="text-[9.5px] font-semibold tracking-[0.12em]"
                                            style={{
                                                color:
                                                    i === TIMELINE.length - 1
                                                        ? "var(--color-hex-e31b23)"
                                                        : "var(--color-hex-666666)",
                                            }}
                                        >
                                            {t.event}
                                        </span>
                                    </div>
                                    <div className="text-[9px] tracking-[0.04em] text-[var(--color-hex-444444)]">
                                        {t.detail}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right sidebar */}
                <div
                    className="w-[240px] flex-shrink-0 overflow-y-auto bg-[var(--color-hex-0b0b0b)]"
                    style={{
                        borderLeft: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <Sidebar label="AGENT ID">
                        <span className="text-[10px] text-[var(--color-hex-666666)]">
                            {spec.id}
                        </span>
                    </Sidebar>
                    <Sidebar label="SKILL LIBRARY">
                        {["sqli_blind_time", "sqli_error_based", "sqli_union"]
                            .slice(0, spec.skills)
                            .map((sk) => (
                                <div key={sk} className="mb-1 flex items-center gap-2">
                                    <span className="text-[8px] text-[var(--color-hex-e31b23)]">
                                        ◈
                                    </span>
                                    <span className="text-[9px] tracking-[0.06em] text-[var(--color-hex-555555)]">
                                        {sk}()
                                    </span>
                                </div>
                            ))}
                    </Sidebar>
                    <Sidebar label="FAILURE MEMORY">
                        {spec.failures === 0 ? (
                            <span className="text-[9px] text-[var(--color-hex-333333)]">
                                No failures recorded
                            </span>
                        ) : (
                            Array.from({
                                length: spec.failures,
                            }).map((_, i) => (
                                <div
                                    key={i}
                                    className="mb-[4px] text-[9px] leading-[1.5] text-[var(--color-hex-555555)]"
                                >
                                    Reflection #{i + 1}: payload timeout on FILTERED port
                                </div>
                            ))
                        )}
                    </Sidebar>
                    <Sidebar label="CONTEXT UTILIZATION" last>
                        <div className="h-[6px] overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)]">
                            <div
                                className="h-full bg-[var(--color-hex-e31b23)]"
                                style={{
                                    width: `${spec.context === "FRESH" ? 12 : spec.context === "COMPACTED" ? 31 : 0}%`,
                                }}
                            />
                        </div>
                        <div className="mt-[4px] text-[8px] tracking-[0.1em] text-[var(--color-hex-444444)]">
                            {spec.context === "FRESH"
                                ? "12%"
                                : spec.context === "COMPACTED"
                                  ? "31% (post-compaction)"
                                  : "—"}
                        </div>
                    </Sidebar>
                </div>
            </div>
        </div>
    );
}
function Kv({ k, v, red }: { k: string; v: string; red?: boolean }) {
    return (
        <div>
            <div className="text-[7px] tracking-[0.14em] text-[var(--color-hex-333333)]">{k}</div>
            <div
                className="overflow-hidden text-[9px] tracking-[0.06em] whitespace-nowrap"
                style={{
                    color: red ? "var(--color-hex-e31b23)" : "var(--color-hex-555555)",
                    textOverflow: "ellipsis",
                }}
            >
                {v}
            </div>
        </div>
    );
}
function Sidebar({
    label,
    children,
    last,
}: {
    label: string;
    children: React.ReactNode;
    last?: boolean;
}) {
    return (
        <div
            className="px-4 py-4"
            style={{
                borderBottom: last ? "none" : "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            <div className="mb-[8px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                {label}
            </div>
            {children}
        </div>
    );
}
