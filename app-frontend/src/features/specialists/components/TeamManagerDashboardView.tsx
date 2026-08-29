import React from "react";

import { KPIStrip } from "@/components/ui/KPIStrip";
import { UCBModal } from "@/features/specialists/components/UCBModal";
import { VDGScoringTable } from "@/features/specialists/components/VDGScoringTable";
import {
    type SchedEntry,
    type SpecialistEntry,
    type VDGEntry,
} from "@/features/specialists/data/fixtures/teamDashboardMockData";
import { SPEC_STATUS } from "@/types/domain-types";

const SPEC_C: Record<string, string> = {
    [SPEC_STATUS.COMPLETED]: "text-success",
    [SPEC_STATUS.RUNNING]: "text-destructive",
    [SPEC_STATUS.WAITING]: "text-warning",
    [SPEC_STATUS.IDLE]: "text-border",
};
const TeamManagerDashboardView = React.memo(function ({
    ucbEntry,
    setUcbEntry,
    vdg,
    specialists,
    sched,
}: {
    ucbEntry: VDGEntry | null;
    setUcbEntry: (v: VDGEntry | null) => void;
    vdg: VDGEntry[];
    specialists: SpecialistEntry[];
    sched: SchedEntry[];
}) {
    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Header */}
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-4">
                <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                    MISSION / CVE-001
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-foreground text-xs font-bold tracking-wide">
                        TEAM MANAGER
                    </h1>
                    <KPIStrip
                        variant="inline"
                        className="gap-6"
                        items={[
                            { k: "ACTIVE SPECIALISTS", v: "1" },
                            {
                                k: "VDG ELIGIBLE",
                                v: String(vdg.filter((v) => v.status === "ELIGIBLE").length),
                                c: "var(--primary)",
                            },
                            { k: "TOTAL COST", v: "$1.42" },
                            { k: "RUNTIME", v: "00:19:04" },
                        ]}
                    />
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
                {/* LEFT: VDG scoring table */}
                <VDGScoringTable vdg={vdg} setUcbEntry={setUcbEntry} />

                {/* RIGHT: specialists + schedule */}
                <div className="border-border lg:w-panel-sm flex w-full flex-shrink-0 flex-col overflow-y-auto border-t lg:border-t-0 lg:border-l">
                    {/* Specialists */}
                    <div className="bg-background text-muted-foreground border-border border-b text-sm tracking-widest">
                        SPECIALIST STATUS
                    </div>
                    {specialists.map((s) => (
                        <div key={s.id} className="border-border border-b px-4 py-2.5">
                            <div className="mb-1 flex items-center gap-2">
                                <div
                                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${(SPEC_C[s.status] ?? "text-border").replace("text-", "bg-")}`}
                                />
                                <span className="text-muted-foreground flex-1 text-xs font-bold tracking-tight">
                                    {s.role}
                                </span>
                                <span
                                    className={`text-sm font-semibold tracking-normal ${SPEC_C[s.status] ?? "text-border"}`}
                                >
                                    {" "}
                                    {s.status}
                                </span>
                            </div>
                            <div className="text-muted-foreground mb-px text-sm tracking-tight">
                                {s.task}
                            </div>
                            {s.score > 0 && (
                                <div className="text-primary text-sm tracking-normal">
                                    UCB={s.score.toFixed(3)}
                                </div>
                            )}
                        </div>
                    ))}
                    {/* Schedule */}
                    <div className="bg-background text-muted-foreground border-border border-b text-sm tracking-widest">
                        NEXT SCHEDULED
                    </div>
                    {sched.map((s, i) => (
                        <div key={s.node} className="border-border border-b px-4 py-2.5">
                            <div className="mb-1 flex items-center gap-2">
                                <span
                                    className={`min-w-12 text-sm font-bold tracking-widest ${i === 0 ? "text-warning" : "text-border"}`}
                                >
                                    {s.step}
                                </span>
                                <span className="text-primary text-xs font-bold tracking-tight">
                                    {s.node}
                                </span>
                                <span className="text-success ml-auto text-base font-bold">
                                    {s.ucb.toFixed(3)}
                                </span>
                            </div>
                            <div className="text-muted-foreground text-sm leading-snug tracking-tight">
                                {s.reason}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {ucbEntry && (
                <UCBModal
                    entry={ucbEntry}
                    totalVisits={vdg.reduce((s, v) => s + v.visits, 0)}
                    onClose={() => setUcbEntry(null)}
                />
            )}
        </div>
    );
});

/* ── screen 37: UCB BREAKDOWN MODAL ── */

export default TeamManagerDashboardView;
TeamManagerDashboardView.displayName = "TeamManagerDashboardView";
