import React from "react";

import { type ExecEntry } from "@/types/domain-types";

export function ExecDrawerTrajectoryTab({ entry }: { entry: ExecEntry }) {
    return (
        <div className="pt-1">
            <div className="text-muted-foreground mb-2.5 text-sm tracking-widest">
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
                    className="border-border flex gap-0 overflow-hidden rounded-sm border-[1px] border-solid"
                >
                    {[
                        ["STEP", r.step],
                        ["VDG DELTA", r.vdgDelta],
                        ["EL DELTA", r.elDelta],
                        ["COST", r.cost],
                    ].map(([k, v]) => (
                        <div
                            key={k}
                            className="bg-background border-border flex-1 border-r px-3 py-2"
                        >
                            <div className="text-muted-foreground mb-1 text-xs tracking-widest">
                                {k}
                            </div>
                            <div className="text-muted-foreground text-xs font-semibold">{v}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
