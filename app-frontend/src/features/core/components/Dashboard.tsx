import { useEffect, useRef, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { MetricTile } from "@/components/ui/MetricTile";
import StatusBadge from "@/components/ui/StatusBadge";
import {
    INITIAL_ACTIVITY,
    KPI_ITEMS,
    NEW_EVENTS,
    TABLE_HEADERS,
    type ActivityEntry,
} from "@/features/core/components/DashboardConstants";
import { MissionOrchestratorModel } from "@/features/missions/domain/Orchestrator";
import { useServices } from "@/lib/services-context";
import { type Mission } from "@/types/domain-types";

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
    const { missionRepository, specialistRepository } = useServices();
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
            missionRepository.fetchAll({ limit: 1000 }),
            specialistRepository.fetchAll(),
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
    }, [missionRepository, specialistRepository]);

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Page header */}
            <div className="flex-shrink-0 border-b border-[var(--color-hex-1e1e1e)] px-6 pt-5 pb-4">
                <div className="page-eyebrow">OPERATIONS</div>
                <div className="flex items-baseline gap-3">
                    <h1 className="text-9xl font-bold tracking-wide text-[var(--color-fg)]">
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
                        valueColor={kpi.red ? "var(--color-brand)" : "var(--color-fg)"}
                    />
                ))}
            </div>

            {/* Body: missions table + live feed */}
            <div className="flex min-h-0 flex-1 overflow-hidden">
                {/* Active missions table */}
                <div className="flex flex-1 flex-col overflow-hidden border-r border-[var(--color-hex-1e1e1e)]">
                    <div className="flex flex-shrink-0 items-center justify-between border-b border-[var(--color-hex-1e1e1e)] px-6 py-3">
                        <span className="tracking-wider-2 text-xl font-semibold text-[var(--color-hex-a0a0a0)]">
                            ACTIVE MISSIONS
                        </span>
                        <button
                            onClick={onNewMission}
                            className="tracking-wider-1 cursor-pointer rounded-[2px] border border-[var(--color-hex-6f171b)] bg-transparent px-[8px] py-[2px] text-base text-[var(--color-brand)] transition-colors duration-100 hover:border-[var(--color-brand)] hover:bg-[var(--color-hex-1a0608)]"
                        >
                            + NEW MISSION
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full border-collapse text-xl">
                            <thead>
                                <tr className="bg-[var(--color-hex-111111)]">
                                    {TABLE_HEADERS.map((h) => (
                                        <th
                                            key={h}
                                            className="text-base-tight tracking-wider-3 border-b border-[var(--color-hex-1e1e1e)] px-[16px] py-[6px] text-left font-semibold whitespace-nowrap text-[var(--color-hex-444444)]"
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
                                            <td className="px-[16px] py-[8px] font-semibold tracking-tight whitespace-nowrap text-[var(--color-brand)]">
                                                {m.id}
                                            </td>
                                            <td className="cell-truncate max-w-[var(--width-cell-max)] px-[16px] py-[8px] whitespace-nowrap text-[var(--color-hex-a0a0a0)]">
                                                {m.target}
                                            </td>
                                            <td className="px-[16px] py-[8px] text-lg whitespace-nowrap text-[var(--color-hex-666666)]">
                                                {m.surface}
                                            </td>
                                            <td className="px-[16px] py-[8px] text-lg whitespace-nowrap text-[var(--color-hex-666666)]">
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
                                                            ? "var(--color-danger)"
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
                                                    <span className="text-base font-semibold tracking-normal text-[var(--color-success)]">
                                                        ACTIVE
                                                    </span>
                                                ) : (
                                                    <span className="text-base tracking-normal text-[var(--color-hex-666666)]">
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
                <div className="flex w-[var(--width-drawer-lg)] flex-shrink-0 flex-col overflow-hidden">
                    <div className="flex flex-shrink-0 items-center gap-2 border-b border-[var(--color-hex-1e1e1e)] px-4 py-3">
                        <div
                            className="h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--color-danger)]"
                            style={{ animation: "pulse 1.4s ease-in-out infinite" }}
                            aria-hidden="true"
                        />
                        <span className="tracking-wider-2 text-xl font-semibold text-[var(--color-hex-a0a0a0)]">
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
                                    <span className="tracking-tight-1 shrink-0 text-base text-[var(--color-hex-444444)]">
                                        {entry.ts}
                                    </span>
                                    <span className="text-base font-semibold tracking-normal text-[var(--color-brand)]">
                                        {entry.agent}
                                    </span>
                                    <span
                                        className="text-base tracking-normal text-[var(--color-hex-333333)]"
                                        aria-hidden="true"
                                    >
                                        ·
                                    </span>
                                    <span className="text-base tracking-normal text-[var(--color-hex-555555)]">
                                        {entry.action}
                                    </span>
                                </div>
                                <div
                                    className="tracking-tighter-2 text-lg leading-tight"
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
