"use client";

// ─── Props ────────────────────────────────────────────────────────────────────
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import StatusBadge from "@/components/ui/StatusBadge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMissionsData } from "@/features/missions/hooks/useMissionsData";
import { type MissionFilter } from "@/features/missions/utils";
import { useMission } from "@/lib/mission-context";
import { MISSION_STATUS } from "@/types/domain-types";

// ─── Types & constants ────────────────────────────────────────────────────────

const FILTERS: MissionFilter[] = [
    "ALL",
    MISSION_STATUS.RUNNING,
    MISSION_STATUS.PAUSED,
    MISSION_STATUS.VALIDATING,
    MISSION_STATUS.QUEUED,
    MISSION_STATUS.COMPLETED,
];

const TABLE_HEADERS = [
    "ID",
    "TARGET",
    "SURFACE",
    "MODE",
    "STATUS",
    "NODES",
    "FINDINGS",
    "COST",
    "STARTED",
] as const;

interface MissionsPageProps {
    onNewMission?: () => void;
    onOpenMission?: (id: string) => void;
}

export default function MissionsPage({ onNewMission, onOpenMission }: MissionsPageProps) {
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
    const { filter, setFilter, isLoading, filtered } = useMissionsData();

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Page header */}
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-4">
                <div className="page-eyebrow">OPERATIONS</div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-foreground text-xs font-bold tracking-wide">MISSIONS</h1>
                    <Button
                        variant="outline"
                        onClick={handleNewMission}
                        className="text-primary hover:border-primary hover:bg-muted flex h-auto cursor-pointer items-center gap-2 rounded-sm px-3 py-1 text-base font-semibold tracking-widest transition-colors duration-100"
                    >
                        <Plus className="h-4 w-4" />
                        NEW MISSION
                    </Button>
                </div>
            </div>

            {/* Filter strip */}
            <div
                className="border-border bg-background flex flex-shrink-0 items-center gap-1 border-b px-6 py-3"
                role="group"
                aria-label="Filter missions by status"
            >
                {FILTERS.map((f) => (
                    <Button
                        key={f}
                        variant="outline"
                        onClick={() => setFilter(f)}
                        aria-pressed={filter === f}
                        className={`cursor-pointer ${[
                            "filter-btn h-auto transition-colors duration-100",
                            filter === f
                                ? "border-primary bg-muted text-destructive"
                                : "text-muted-foreground hover:text-muted-foreground bg-transparent",
                        ].join(" ")}`}
                    >
                        {f}
                    </Button>
                ))}
                <span className="text-muted-foreground ml-auto text-sm tracking-wide">
                    {filtered.length} MISSIONS
                </span>
            </div>

            {/* Missions table */}
            <div className="flex-1 overflow-auto">
                <Table className="w-full border-collapse text-xs">
                    <TableHeader>
                        <TableRow className="bg-card z-sticky sticky top-0">
                            {TABLE_HEADERS.map((h) => (
                                <TableHead
                                    key={h}
                                    className={`border-border text-muted-foreground border-b px-4 py-1.5 text-sm font-semibold tracking-widest whitespace-nowrap ${
                                        ["NODES", "FINDINGS", "COST"].includes(h)
                                            ? "text-right"
                                            : "text-left"
                                    }`}
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
                                    <EmptyState message="LOADING MISSIONS..." isTable colSpan={9} />
                                );
                            }
                            if (filtered.length === 0) {
                                return (
                                    <EmptyState message="NO MISSIONS FOUND" isTable colSpan={9} />
                                );
                            }
                            return filtered.map((m) => (
                                <TableRow
                                    key={m.id}
                                    onClick={() => handleOpenMission(m.id)}
                                    className="border-border hover:bg-muted cursor-pointer border-b transition-colors duration-75"
                                >
                                    <TableCell className="text-primary px-4 py-2 font-semibold tracking-tight whitespace-nowrap">
                                        {m.id}
                                    </TableCell>
                                    <TableCell className="cell-truncate text-muted-foreground max-w-cell-max px-4 py-2 whitespace-nowrap">
                                        <Tooltip>
                                            <TooltipTrigger render={<span className="truncate" />}>
                                                {m.target}
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom" align="start">
                                                {m.target}
                                            </TooltipContent>
                                        </Tooltip>
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
                                        className={`px-4 py-2 text-right ${m.findings > 0 ? "text-destructive font-[600]" : "text-muted-foreground font-[400]"}`}
                                    >
                                        {m.findings}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground px-4 py-2 text-right">
                                        {m.cost}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground px-4 py-2 text-base whitespace-nowrap">
                                        {m.started}
                                    </TableCell>
                                </TableRow>
                            ));
                        })()}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
