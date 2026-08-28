import React from "react";

import SpecBadge from "@/features/missions/components/workspace/SpecBadge";
import specialistStatusDot from "@/features/missions/components/workspace/SpecialistStatusDot";
import { useWorkspaceData } from "@/features/missions/hooks/useWorkspaceData";
import { SPEC_STATUS } from "@/types/domain-types";

const MissionLiveState = React.memo(function ({ time }: { time: string }) {
    const { specialists } = useWorkspaceData();

    return (
        <div
            className="flex w-[256px] flex-shrink-0 flex-col overflow-hidden bg-[var(--color-hex-0b0b0b)]"
            style={{
                borderLeft: "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            {/* Live state stats */}
            <div
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="text-base-tight px-4 pt-4 pb-2 tracking-widest text-[var(--color-hex-444444)]">
                    LIVE STATE
                </div>
                <div className="grid grid-cols-2 gap-0">
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
                    ].map((s, i) => (
                        <div
                            key={s.label}
                            className="px-[16px] py-[10px]"
                            style={{
                                borderRight:
                                    i % 2 === 0 ? "1px solid var(--color-hex-151515)" : "none",
                                borderBottom: i < 2 ? "1px solid var(--color-hex-151515)" : "none",
                            }}
                        >
                            <div className="text-sm-tight mb-[4px] tracking-widest text-[var(--color-hex-444444)]">
                                {s.label}
                            </div>
                            <div
                                className="text-9xl leading-none font-bold tracking-tighter"
                                style={{
                                    color: s.red ? "var(--color-brand)" : "var(--color-fg)",
                                }}
                            >
                                {s.value}
                            </div>
                            <div className="text-sm-tight mt-[3px] tracking-normal text-[var(--color-hex-333333)]">
                                {s.sub}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Time */}
                <div
                    className="flex items-center gap-3 px-4 py-2.5"
                    style={{
                        borderTop: "1px solid var(--color-hex-151515)",
                    }}
                >
                    <div>
                        <div className="text-sm-tight mb-[2px] tracking-widest text-[var(--color-hex-444444)]">
                            ELAPSED TIME
                        </div>
                        <div className="text-8xl leading-none font-bold tracking-normal text-[var(--color-hex-a0a0a0)]">
                            {time}
                        </div>
                    </div>
                    <div className="ml-auto">
                        <div className="text-sm-tight mb-[2px] tracking-widest text-[var(--color-hex-444444)]">
                            STEP
                        </div>
                        <div className="tracking-tight-1 text-8xl leading-none font-bold text-[var(--color-hex-555555)]">
                            014
                        </div>
                    </div>
                </div>
            </div>

            {/* Specialists */}
            <div className="flex min-h-[0px] flex-1 flex-col overflow-hidden">
                <div
                    className="flex flex-shrink-0 items-center justify-between px-4 pt-3 pb-2"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <span className="text-base-tight tracking-widest text-[var(--color-hex-444444)]">
                        SPECIALISTS
                    </span>
                    <span className="text-sm tracking-wide text-[var(--color-brand)]">
                        1 RUNNING
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {specialists.map((spec) => (
                        <div
                            key={spec.id}
                            className="px-4 py-3"
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                            }}
                        >
                            <div className="mb-1.5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-[6px] shrink-0"
                                        style={{
                                            width: spec.status === SPEC_STATUS.IDLE ? 6 : 6,
                                            borderRadius: "50%",
                                            border: `1px solid ${specialistStatusDot(spec.status)}`,
                                            background:
                                                spec.status !== SPEC_STATUS.IDLE &&
                                                spec.status !== SPEC_STATUS.WAITING
                                                    ? specialistStatusDot(spec.status)
                                                    : "transparent",
                                        }}
                                    />
                                    <span
                                        className="text-lg-tight font-semibold tracking-tight"
                                        style={{
                                            color:
                                                spec.status === SPEC_STATUS.IDLE
                                                    ? "var(--color-hex-444444)"
                                                    : "var(--color-hex-a0a0a0)",
                                        }}
                                    >
                                        {spec.role}
                                    </span>
                                </div>
                                <SpecBadge status={spec.status} />
                            </div>
                            <div className="text-base-tight mb-[2px] tracking-tight text-[var(--color-hex-333333)]">
                                {spec.task !== "—" && (
                                    <span className="text-[var(--color-hex-555555)]">
                                        {spec.task}
                                    </span>
                                )}
                                {spec.task === "—" && <span>—</span>}
                            </div>
                            <div className="flex items-center gap-3">
                                {spec.context !== "—" && (
                                    <span className="text-sm-tight tracking-wide text-[var(--color-hex-333333)]">
                                        CTX: {spec.context}
                                    </span>
                                )}
                                {spec.evidence > 0 && (
                                    <span className="text-sm-tight tracking-normal text-[var(--color-hex-444444)]">
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
