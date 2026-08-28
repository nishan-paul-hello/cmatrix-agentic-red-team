import React from "react";

import { type ExecEntry } from "@/types/domain-types";

export function ExecDrawerTrajectoryTab({ entry }: { entry: ExecEntry }) {
    return (
        <div
            style={{
                paddingTop: 4,
            }}
        >
            <div className="mb-[10px] text-sm tracking-widest text-[var(--color-hex-444444)]">
                TRAJECTORY CONTRIBUTION
            </div>
            {[
                {
                    step: `STEP ${String(entry.id).padStart(3, "0")}`,
                    vdgDelta: entry.command.name.toUpperCase(),
                    elDelta: "+2 facts",
                    cost: entry.duration !== "—" ? `~$0.0${entry.id.slice(-2)}` : "$0.00",
                },
            ].map((r) => (
                <div
                    key={r.step}
                    className="overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]"
                    style={{
                        display: "flex",
                        gap: 0,
                    }}
                >
                    {[
                        ["STEP", r.step],
                        ["VDG DELTA", r.vdgDelta],
                        ["EL DELTA", r.elDelta],
                        ["COST", r.cost],
                    ].map(([k, v], j, a) => (
                        <div
                            key={k}
                            className="flex-1 bg-[var(--color-hex-0d0d0d)] px-[12px] py-[9px]"
                            style={{
                                borderRight:
                                    j < a.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                            }}
                        >
                            <div className="text-sm-tight tracking-wider-3 mb-[4px] text-[var(--color-hex-444444)]">
                                {k}
                            </div>
                            <div className="text-lg font-semibold text-[var(--color-hex-888888)]">
                                {v}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
