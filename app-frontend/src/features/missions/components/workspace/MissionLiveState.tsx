import React from "react";

import SpecBadge from "@/features/missions/components/workspace/SpecBadge";
import specialistStatusDot from "@/features/missions/components/workspace/SpecialistStatusDot";
import { useWorkspaceData } from "@/features/missions/hooks/useWorkspaceData";
import { SPEC_STATUS } from "@/types/domain-types";

const MissionLiveState = React.memo(function ({ time }: { time: string }) {
    const { specialists } = useWorkspaceData();

    return (
        <div className="bg-background border-border lg:w-panel-sm-alt flex w-full flex-shrink-0 flex-col overflow-hidden border-t lg:border-t-0 lg:border-l">
            {/* Live state stats */}
            <div className="border-border border-b border-solid">
                <div className="text-muted-foreground px-4 pt-4 pb-2 text-sm tracking-widest">
                    LIVE STATE
                </div>
                <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {[
                        {
                            label: "VDG NODES",
                            value: "12",
                            sub: "3 ELIGIBLE",
                        },
                        {
                            label: "EL FACTS",
                            value: "87",
                            sub: "23 NEW",
                        },
                        {
                            label: "FINDINGS",
                            value: "07",
                            sub: "1 CRITICAL",
                            red: true,
                        },
                        {
                            label: "COST",
                            value: "$1.42",
                            sub: "/ $10.00 CEI",
                            red: true,
                        },
                    ].map((s) => (
                        <div key={s.label} className="border-border border-b px-4 py-2.5">
                            <div className="text-muted-foreground mb-1 text-xs tracking-widest">
                                {s.label}
                            </div>
                            <div
                                className={`text-xs leading-none font-bold tracking-tighter ${s.red ? "text-primary" : "text-foreground"}`}
                            >
                                {s.value}
                            </div>
                            <div className="text-muted-foreground mt-0.5 text-xs tracking-normal">
                                {s.sub}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Time */}
                <div className="border-border flex items-center gap-3 border-t px-4 py-2.5">
                    <div>
                        <div className="text-muted-foreground mb-0.5 text-xs tracking-widest">
                            ELAPSED TIME
                        </div>
                        <div className="text-muted-foreground text-xs leading-none font-bold tracking-normal">
                            {time}
                        </div>
                    </div>
                    <div className="ml-auto">
                        <div className="text-muted-foreground mb-0.5 text-xs tracking-widest">
                            STEP
                        </div>
                        <div className="text-muted-foreground text-xs leading-none font-bold tracking-tight">
                            014
                        </div>
                    </div>
                </div>
            </div>

            {/* Specialists */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="border-border flex flex-shrink-0 items-center justify-between border-b px-4 pt-3 pb-2">
                    <span className="text-muted-foreground text-sm tracking-widest">
                        SPECIALISTS
                    </span>
                    <span className="text-primary text-sm tracking-wide">1 RUNNING</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {specialists.map((spec) => (
                        <div key={spec.id} className="border-border border-b px-4 py-3">
                            <div className="mb-1.5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`h-1.5 w-[6px] shrink-0 rounded-full border border-solid ${specialistStatusDot(spec.status).replace("text-", "border-")} ${spec.status !== SPEC_STATUS.IDLE && spec.status !== SPEC_STATUS.WAITING ? specialistStatusDot(spec.status).replace("text-", "bg-") : "bg-transparent"}`}
                                    />
                                    <span className="text-muted-foreground text-base font-semibold tracking-tight">
                                        {spec.role}
                                    </span>
                                </div>
                                <SpecBadge status={spec.status} />
                            </div>
                            <div className="text-muted-foreground mb-0.5 text-sm tracking-tight">
                                {spec.task !== "—" && (
                                    <span className="text-muted-foreground">{spec.task}</span>
                                )}
                                {spec.task === "—" && <span>—</span>}
                            </div>
                            <div className="flex items-center gap-3">
                                {spec.context !== "—" && (
                                    <span className="text-muted-foreground text-xs tracking-wide">
                                        CTX: {spec.context}
                                    </span>
                                )}
                                {spec.evidence > 0 && (
                                    <span className="text-muted-foreground text-xs tracking-normal">
                                        EL: {spec.evidence}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default MissionLiveState;
MissionLiveState.displayName = "MissionLiveState";
