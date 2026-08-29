"use client";

import { useEffect, useRef, useState } from "react";
// ─── Component ────────────────────────────────────────────────────────────────

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { KPIStrip } from "@/components/ui/KPIStrip";
import StatusBadge from "@/components/ui/StatusBadge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    INITIAL_ACTIVITY,
    KPI_ITEMS,
    NEW_EVENTS,
    TABLE_HEADERS,
    type ActivityEntry,
} from "@/features/core/components/DashboardConstants";
import { MissionOrchestratorModel } from "@/features/missions/domain/Orchestrator";
import { useMission } from "@/lib/mission-context";
import { useServices } from "@/lib/services-context";
import { type Mission } from "@/types/domain-types";

interface DashboardProps {
    onNewMission?: () => void;
    onOpenMission?: (id: string) => void;
}

export default function Dashboard({ onNewMission, onOpenMission }: DashboardProps) {
    const router = useRouter();
    const { setActiveMissionId } = useMission();

    const handleNewMission = () => {
        if (onNewMission) {
            onNewMission();
        } else {
            router.push("/missions/new");
        }
    };

    const handleOpenMission = (id: string) => {
        if (onOpenMission) {
            onOpenMission(id);
        } else {
            setActiveMissionId(id);
            router.push(`/missions/${id}`);
        }
    };
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
        ])
            .then(([missionData, specsData]) => {
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
            })
            .catch(console.error);
    }, [missionRepository, specialistRepository]);

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Page header */}
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-4">
                <div className="page-eyebrow">OPERATIONS</div>
                <div className="flex items-baseline gap-3">
                    <h1 className="text-foreground text-xs font-bold tracking-wide">
                        COMMAND CENTER
                    </h1>
                </div>
            </div>

            {/* KPI strip */}
            <KPIStrip
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
                items={KPI_ITEMS.map((kpi) => ({
                    k: kpi.label,
                    v: kpi.value,
                    c: kpi.red ? "text-primary" : "var(--foreground)",
                }))}
            />

            {/* Body: missions table + live feed */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
                {/* Active missions table */}
                <div className="border-border flex flex-1 flex-col overflow-hidden border-b lg:border-r lg:border-b-0">
                    <div className="border-border flex flex-shrink-0 items-center justify-between border-b px-6 py-3">
                        <span className="text-muted-foreground text-xs font-semibold tracking-widest">
                            ACTIVE MISSIONS
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNewMission}
                            className="border-border text-primary hover:border-primary hover:bg-muted h-auto rounded-sm px-2 py-0.5 text-base tracking-widest transition-colors duration-100"
                        >
                            + NEW MISSION
                        </Button>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <Table className="w-full border-collapse text-xs">
                            <TableHeader>
                                <TableRow className="bg-card">
                                    {TABLE_HEADERS.map((h) => (
                                        <TableHead
                                            key={h}
                                            className="border-border text-muted-foreground border-b px-4 py-1.5 text-left text-sm font-semibold tracking-widest whitespace-nowrap"
                                        >
                                            {h}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
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
                                        <TableRow
                                            key={m.id}
                                            onClick={() => handleOpenMission(m.id)}
                                            className="border-border hover:bg-muted cursor-pointer border-b transition-colors duration-75"
                                        >
                                            <TableCell className="text-primary px-4 py-2 font-semibold tracking-tight whitespace-nowrap">
                                                {m.id}
                                            </TableCell>
                                            <TableCell className="cell-truncate text-muted-foreground max-w-cell-max px-4 py-2 whitespace-nowrap">
                                                {m.target}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground px-4 py-2 text-xs whitespace-nowrap">
                                                {m.surface}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground px-4 py-2 text-xs whitespace-nowrap">
                                                {m.mode}
                                            </TableCell>
                                            <TableCell className="px-4 py-2 whitespace-nowrap">
                                                <StatusBadge status={m.status} />
                                            </TableCell>
                                            <TableCell className="text-muted-foreground px-4 py-2 text-right">
                                                {m.nodes}
                                            </TableCell>
                                            <TableCell
                                                className={`px-4 py-2 text-right ${m.findings > 0 ? "text-destructive font-semibold" : "text-muted-foreground font-normal"}`}
                                            >
                                                {m.findings}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground px-4 py-2 text-right">
                                                {m.cost}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground px-4 py-2 text-center">
                                                {orchestrators[m.id].hasActiveWorkers() ? (
                                                    <span className="text-success text-base font-semibold tracking-normal">
                                                        ACTIVE
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground text-base tracking-normal">
                                                        IDLE
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ));
                                })()}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Live activity feed */}
                <div className="lg:w-drawer-lg flex w-full flex-shrink-0 flex-col overflow-hidden">
                    <div className="border-border flex flex-shrink-0 items-center gap-2 border-b px-4 py-3">
                        <div
                            className="bg-destructive pulse-dot h-1.5 w-1.5 shrink-0 rounded-full"

                            aria-hidden="true"
                        />
                        <span className="text-muted-foreground text-xs font-semibold tracking-widest">
                            LIVE ACTIVITY
                        </span>
                    </div>

                    <div
                        className="flex-1 overflow-y-auto py-2"
                        aria-live="polite"
                        aria-label="Live agent activity feed"
                    >
                        {activity.map((entry) => (
                            <div key={entry.id} className="border-border border-b px-4 py-2">
                                <div className="mb-0.5 flex items-center gap-2">
                                    <span className="text-muted-foreground shrink-0 text-base tracking-tight">
                                        {entry.ts}
                                    </span>
                                    <span className="text-primary text-base font-semibold tracking-normal">
                                        {entry.agent}
                                    </span>
                                    <span
                                        className="text-muted-foreground text-base tracking-normal"
                                        aria-hidden="true"
                                    >
                                        ·
                                    </span>
                                    <span className="text-muted-foreground text-base tracking-normal">
                                        {entry.action}
                                    </span>
                                </div>
                                <div
                                    className="text-xs leading-tight tracking-tighter"
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
