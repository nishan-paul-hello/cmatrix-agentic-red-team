import React from "react";

import { KPI } from "@/features/specialists/components/KPI";
import { UCBModal } from "@/features/specialists/components/UCBModal";
import { VDGScoringTable } from "@/features/specialists/components/VDGScoringTable";
import {
    type SchedEntry,
    type SpecialistEntry,
    type VDGEntry,
} from "@/features/specialists/data/fixtures/teamDashboardMockData";
import { SPEC_STATUS } from "@/types/domain-types";

const SPEC_C: Record<string, string> = {
    [SPEC_STATUS.COMPLETED]: "var(--color-success)",
    [SPEC_STATUS.RUNNING]: "var(--color-danger)",
    [SPEC_STATUS.WAITING]: "var(--color-warning)",
    [SPEC_STATUS.IDLE]: "var(--color-hex-333333)",
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
        <div className="flex h-full min-h-[0px] flex-col">
            {/* Header */}
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="tracking-widest-2 mb-[3px] text-base text-[var(--color-hex-666666)]">
                    MISSION / CVE-001
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-9xl font-bold tracking-wide text-[var(--color-fg)]">
                        TEAM MANAGER
                    </h1>
                    <div className="flex items-center gap-6">
                        <KPI label="ACTIVE SPECIALISTS" value="1" />
                        <KPI
                            label="VDG ELIGIBLE"
                            value={String(vdg.filter((v) => v.status === "ELIGIBLE").length)}
                            red
                        />
                        <KPI label="TOTAL COST" value="$1.42" />
                        <KPI label="RUNTIME" value="00:19:04" />
                    </div>
                </div>
            </div>

            <div className="flex min-h-[0px] flex-1 overflow-hidden">
                {/* LEFT: VDG scoring table */}
                <VDGScoringTable vdg={vdg} setUcbEntry={setUcbEntry} />

                {/* RIGHT: specialists + schedule */}
                <div className="w-panel-sm flex flex-shrink-0 flex-col overflow-y-auto">
                    {/* Specialists */}
                    <div
                        className="bg-[var(--color-hex-0a0a0a)] text-sm tracking-widest text-[var(--color-hex-444444)]"
                        style={{
                            padding: "10px 16px 8px",
                            borderBottom: "1px solid var(--color-hex-111111)",
                        }}
                    >
                        SPECIALIST STATUS
                    </div>
                    {specialists.map((s) => (
                        <div
                            key={s.id}
                            className="px-[16px] py-[10px]"
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                            }}
                        >
                            <div className="mb-1 flex items-center gap-2">
                                <div
                                    className="h-[6px] w-[6px] shrink-0"
                                    style={{
                                        borderRadius: "50%",
                                        background: SPEC_C[s.status] ?? "var(--color-hex-333333)",
                                    }}
                                />
                                <span className="tracking-tight-1 flex-1 text-lg font-bold text-[var(--color-hex-a0a0a0)]">
                                    {s.role}
                                </span>
                                <span
                                    className="text-sm font-semibold tracking-normal"
                                    style={{
                                        color: SPEC_C[s.status] ?? "var(--color-hex-333333)",
                                    }}
                                >
                                    {s.status}
                                </span>
                            </div>
                            <div className="text-base-tight tracking-tight-1 mb-[1px] text-[var(--color-hex-333333)]">
                                {s.task}
                            </div>
                            {s.score > 0 && (
                                <div className="text-sm tracking-normal text-[var(--color-brand)]">
                                    UCB={s.score.toFixed(3)}
                                </div>
                            )}
                        </div>
                    ))}
                    {/* Schedule */}
                    <div
                        className="bg-[var(--color-hex-0a0a0a)] text-sm tracking-widest text-[var(--color-hex-444444)]"
                        style={{
                            padding: "10px 16px 8px",
                            borderBottom: "1px solid var(--color-hex-111111)",
                            borderTop: "1px solid var(--color-hex-1e1e1e)",
                        }}
                    >
                        NEXT SCHEDULED
                    </div>
                    {sched.map((s, i) => (
                        <div
                            key={s.node}
                            className="px-[16px] py-[10px]"
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                            }}
                        >
                            <div className="mb-1 flex items-center gap-2">
                                <span
                                    className="tracking-wider-1 min-w-[48px] text-sm font-bold"
                                    style={{
                                        color:
                                            i === 0
                                                ? "var(--color-warning)"
                                                : "var(--color-hex-333333)",
                                    }}
                                >
                                    {s.step}
                                </span>
                                <span className="tracking-tight-1 text-lg font-bold text-[var(--color-brand)]">
                                    {s.node}
                                </span>
                                <span className="ml-auto text-base font-bold text-[var(--color-success)]">
                                    {s.ucb.toFixed(3)}
                                </span>
                            </div>
                            <div className="tracking-tight-1 text-sm leading-snug text-[var(--color-hex-333333)]">
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
