import { useEffect, useRef, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { MetricTile } from "@/components/ui/MetricTile";
import StatusBadge from "@/components/ui/StatusBadge";
import { MissionOrchestratorModel } from "@/features/missions/domain/Orchestrator";
import { MissionRepository } from "@/repositories/MissionRepository";
import { SpecialistRepository } from "@/repositories/SpecialistRepository";
import { type Mission } from "@/types/domain-types";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivityEntry = {
    id: number;
    ts: string;
    agent: string;
    action: string;
    desc: string;
    color: string;
};

// ─── Static data ──────────────────────────────────────────────────────────────

const INITIAL_ACTIVITY: ActivityEntry[] = [
    {
        id: 1,
        ts: "14:22:07",
        agent: "RECON-SPEC",
        action: "TOOL_CALL",
        desc: "nmap -sV -p 1-1024 app.targetcorp.com",
        color: "var(--color-hex-a0a0a0)",
    },
    {
        id: 2,
        ts: "14:22:05",
        agent: "TEAM-MGR",
        action: "UCB_SELECT",
        desc: "SQLI-007 selected, UCB=0.824, path=0.612",
        color: "var(--color-hex-e31b23)",
    },
    {
        id: 3,
        ts: "14:21:59",
        agent: "EVAL-AGENT",
        action: "E_ORD_UPDATE",
        desc: "AUTH-003 evidence raised to E_ord 4 (CONFIRMED)",
        color: "var(--color-hex-3fb950)",
    },
    {
        id: 4,
        ts: "14:21:54",
        agent: "SQLI-SPEC",
        action: "EXPLOIT_ATTEMPT",
        desc: "Injecting into /api/users?id= parameter",
        color: "var(--color-hex-a0a0a0)",
    },
    {
        id: 5,
        ts: "14:21:48",
        agent: "VALID-AGENT",
        action: "ORACLE_TEST",
        desc: "CVE-BENCH oracle invoked for SQLI-004",
        color: "var(--color-hex-d29922)",
    },
    {
        id: 6,
        ts: "14:21:41",
        agent: "TEAM-MGR",
        action: "EL_SNAPSHOT",
        desc: "Environmental Layer snapshot: 87 facts",
        color: "var(--color-hex-a0a0a0)",
    },
    {
        id: 7,
        ts: "14:21:38",
        agent: "RECON-SPEC",
        action: "CREDENTIAL_FOUND",
        desc: "Credential extracted: admin@targetcorp.com",
        color: "var(--color-hex-3fb950)",
    },
    {
        id: 8,
        ts: "14:21:30",
        agent: "VALID-AGENT",
        action: "VALIDATED",
        desc: "SQLI-004 ORACLE CONFIRMED — severity CRITICAL",
        color: "var(--color-hex-ff2a32)",
    },
    {
        id: 9,
        ts: "14:21:22",
        agent: "EXEC-AGENT",
        action: "TOOL_RESULT",
        desc: "sqlmap completed: 3 injectable endpoints found",
        color: "var(--color-hex-a0a0a0)",
    },
    {
        id: 10,
        ts: "14:21:14",
        agent: "TEAM-MGR",
        action: "COMPACTION",
        desc: "Context at 81% — scheduling FULLCOMPACT",
        color: "var(--color-hex-d29922)",
    },
    {
        id: 11,
        ts: "14:21:08",
        agent: "SQLI-SPEC",
        action: "SPAWN",
        desc: "Specialist spawned, FRESH context, node SQLI-007",
        color: "var(--color-hex-a0a0a0)",
    },
    {
        id: 12,
        ts: "14:20:59",
        agent: "TEAM-MGR",
        action: "PATH_SCORE",
        desc: "Path RECON→AUTH→SQLI→DB-ACCESS scored 0.61",
        color: "var(--color-hex-a0a0a0)",
    },
];

const NEW_EVENTS: Omit<ActivityEntry, "id">[] = [
    {
        ts: "14:22:11",
        agent: "SQLI-SPEC",
        action: "PAYLOAD_SENT",
        desc: "Time-based blind injection payload dispatched",
        color: "var(--color-hex-a0a0a0)",
    },
    {
        ts: "14:22:14",
        agent: "EVAL-AGENT",
        action: "RESPONSE_PARSE",
        desc: "Response delta 4.2s — timing confirmed",
        color: "var(--color-hex-3fb950)",
    },
    {
        ts: "14:22:17",
        agent: "TEAM-MGR",
        action: "UCB_UPDATE",
        desc: "SQLI-007 UCB updated to 0.891 post-evidence",
        color: "var(--color-hex-e31b23)",
    },
];

// ─── KPI strip data ───────────────────────────────────────────────────────────

const KPI_ITEMS = [
    { label: "ACTIVE MISSIONS", value: "03", red: true },
    { label: "COMPLETED MISSIONS", value: "128", red: false },
    { label: "VALIDATED FINDINGS", value: "421", red: true },
    { label: "VDG NODES", value: "8,492", red: false },
    { label: "SUCCESS RATE", value: "27.4%", red: false },
    { label: "TOTAL COST", value: "$184.22", red: true },
] as const;

const TABLE_HEADERS = [
    "MISSION",
    "TARGET",
    "SURFACE",
    "MODE",
    "STATUS",
    "NODES",
    "FINDINGS",
    "COST",
    "WORKERS",
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

interface DashboardProps {
    onNewMission?: () => void;
    onOpenMission?: (id: string) => void;
}

export default function Dashboard({ onNewMission, onOpenMission }: DashboardProps) {
    const [activity, setActivity] = useState<ActivityEntry[]>(INITIAL_ACTIVITY);
    const [missions, setMissions] = useState<Mission[]>([]);
    const [orchestrators, setOrchestrators] = useState<Record<string, MissionOrchestratorModel>>(
        {},
    );
    const [isLoading, setIsLoading] = useState(true);
    const nextId = useRef(INITIAL_ACTIVITY.length + 1);
    const eventQueue = useRef([...NEW_EVENTS]);

    // Periodically inject new live-feed entries.
    useEffect(() => {
        const interval = setInterval(() => {
            const next = eventQueue.current.shift();
            if (!next) {
                return;
            }
            const entry: ActivityEntry = { ...next, id: nextId.current++ };
            setActivity((prev) => [entry, ...prev].slice(0, 40));
        }, 2800);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        void Promise.all([
            MissionRepository.getMissions(),
            SpecialistRepository.getSpecialists(),
        ]).then(([missionData, specsData]) => {
            setMissions(missionData);
            const orchs: Record<string, MissionOrchestratorModel> = {};
            missionData.forEach((m) => {
                const workers = specsData.map((s) => ({
                    id: s.id,
                    role: s.role,
                    status: s.status,
                    missionId: m.id,
                }));
                orchs[m.id] = new MissionOrchestratorModel(m.id, m.status, workers);
            });
            setOrchestrators(orchs);
            setIsLoading(false);
        });
    }, []);

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Page header */}
            <div className="flex-shrink-0 border-b border-[var(--color-hex-1e1e1e)] px-6 pt-5 pb-4">
                <div className="page-eyebrow">OPERATIONS</div>
                <div className="flex items-baseline gap-3">
                    <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        COMMAND CENTER
                    </h1>
                </div>
            </div>

            {/* KPI strip */}
            <div className="grid flex-shrink-0 grid-cols-6 border-b border-[var(--color-hex-1e1e1e)]">
                {KPI_ITEMS.map((kpi, i) => (
                    <MetricTile
                        key={kpi.label}
                        label={kpi.label}
                        value={kpi.value}
                        variant="dashboard"
                        borderRight={i < 5}
                        valueColor={kpi.red ? "var(--color-hex-e31b23)" : "var(--color-hex-f2f2f2)"}
                    />
                ))}
            </div>

            {/* Body: missions table + live feed */}
            <div className="flex min-h-0 flex-1 overflow-hidden">
                {/* Active missions table */}
                <div className="flex flex-1 flex-col overflow-hidden border-r border-[var(--color-hex-1e1e1e)]">
                    <div className="flex flex-shrink-0 items-center justify-between border-b border-[var(--color-hex-1e1e1e)] px-6 py-3">
                        <span className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-hex-a0a0a0)]">
                            ACTIVE MISSIONS
                        </span>
                        <button
                            onClick={onNewMission}
                            className="cursor-pointer rounded-[2px] border border-[var(--color-hex-6f171b)] bg-transparent px-[8px] py-[2px] text-[9px] tracking-[0.14em] text-[var(--color-hex-e31b23)] transition-colors duration-100 hover:border-[var(--color-hex-e31b23)] hover:bg-[var(--color-hex-1a0608)]"
                        >
                            + NEW MISSION
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full border-collapse text-[11px]">
                            <thead>
                                <tr className="bg-[var(--color-hex-111111)]">
                                    {TABLE_HEADERS.map((h) => (
                                        <th
                                            key={h}
                                            className="border-b border-[var(--color-hex-1e1e1e)] px-[16px] py-[6px] text-left text-[8.5px] font-semibold tracking-[0.18em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    if (isLoading) {
                                        return (
                                            <EmptyState
                                                message="LOADING MISSIONS..."
                                                isTable
                                                colSpan={9}
                                            />
                                        );
                                    }
                                    if (missions.length === 0) {
                                        return (
                                            <EmptyState
                                                message="NO MISSIONS FOUND"
                                                isTable
                                                colSpan={9}
                                            />
                                        );
                                    }
                                    return missions.map((m) => (
                                        <tr
                                            key={m.id}
                                            onClick={() => onOpenMission?.(m.id)}
                                            className="cursor-pointer border-b border-[var(--color-hex-191919)] transition-colors duration-75 hover:bg-[var(--color-hex-131313)]"
                                        >
                                            <td className="px-[16px] py-[8px] font-semibold tracking-[0.08em] whitespace-nowrap text-[var(--color-hex-e31b23)]">
                                                {m.id}
                                            </td>
                                            <td className="cell-truncate max-w-[180px] px-[16px] py-[8px] whitespace-nowrap text-[var(--color-hex-a0a0a0)]">
                                                {m.target}
                                            </td>
                                            <td className="px-[16px] py-[8px] text-[10px] whitespace-nowrap text-[var(--color-hex-666666)]">
                                                {m.surface}
                                            </td>
                                            <td className="px-[16px] py-[8px] text-[10px] whitespace-nowrap text-[var(--color-hex-666666)]">
                                                {m.mode}
                                            </td>
                                            <td className="px-[16px] py-[8px] whitespace-nowrap">
                                                <StatusBadge status={m.status} />
                                            </td>
                                            <td className="px-[16px] py-[8px] text-right text-[var(--color-hex-a0a0a0)]">
                                                {m.nodes}
                                            </td>
                                            <td
                                                className="px-[16px] py-[8px] text-right"
                                                style={{
                                                    color:
                                                        m.findings > 0
                                                            ? "var(--color-hex-ff2a32)"
                                                            : "var(--color-hex-666666)",
                                                    fontWeight: m.findings > 0 ? 600 : 400,
                                                }}
                                            >
                                                {m.findings}
                                            </td>
                                            <td className="px-[16px] py-[8px] text-right text-[var(--color-hex-a0a0a0)]">
                                                {m.cost}
                                            </td>
                                            <td className="px-[16px] py-[8px] text-center text-[var(--color-hex-a0a0a0)]">
                                                {orchestrators[m.id].hasActiveWorkers() ? (
                                                    <span className="text-[9px] font-semibold tracking-[0.1em] text-[var(--color-hex-3fb950)]">
                                                        ACTIVE
                                                    </span>
                                                ) : (
                                                    <span className="text-[9px] tracking-[0.1em] text-[var(--color-hex-666666)]">
                                                        IDLE
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ));
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Live activity feed */}
                <div className="flex w-[340px] flex-shrink-0 flex-col overflow-hidden">
                    <div className="flex flex-shrink-0 items-center gap-2 border-b border-[var(--color-hex-1e1e1e)] px-4 py-3">
                        <div
                            className="h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--color-hex-ff2a32)]"
                            style={{ animation: "pulse 1.4s ease-in-out infinite" }}
                            aria-hidden="true"
                        />
                        <span className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-hex-a0a0a0)]">
                            LIVE ACTIVITY
                        </span>
                    </div>

                    <div
                        className="flex-1 overflow-y-auto py-2"
                        aria-live="polite"
                        aria-label="Live agent activity feed"
                    >
                        {activity.map((entry) => (
                            <div
                                key={entry.id}
                                className="border-b border-[var(--color-hex-111111)] px-4 py-2"
                            >
                                <div className="mb-0.5 flex items-center gap-2">
                                    <span className="shrink-0 text-[9px] tracking-[0.06em] text-[var(--color-hex-444444)]">
                                        {entry.ts}
                                    </span>
                                    <span className="text-[9px] font-semibold tracking-[0.1em] text-[var(--color-hex-e31b23)]">
                                        {entry.agent}
                                    </span>
                                    <span
                                        className="text-[9px] tracking-[0.1em] text-[var(--color-hex-333333)]"
                                        aria-hidden="true"
                                    >
                                        ·
                                    </span>
                                    <span className="text-[9px] tracking-[0.1em] text-[var(--color-hex-555555)]">
                                        {entry.action}
                                    </span>
                                </div>
                                <div
                                    className="text-[10px] leading-[1.4] tracking-[0.02em]"
                                    style={{ color: entry.color }}
                                >
                                    {entry.desc}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
