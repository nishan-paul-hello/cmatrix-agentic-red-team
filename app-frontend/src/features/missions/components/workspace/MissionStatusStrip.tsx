import React from "react";

import { KPIStrip } from "@/components/ui/KPIStrip";
import Meta from "@/features/missions/components/workspace/Meta";
import Sep from "@/features/missions/components/workspace/Sep";
import { MISSION_STATUS } from "@/types/domain-types";

export default function MissionStatusStrip({
    missionId,
    time,
}: {
    missionId: string;
    time: string;
}) {
    return (
        <div className="bg-background border-border flex-shrink-0 border-b">
            {/* Identity row */}
            <div className="border-border flex items-center gap-6 border-b px-4 py-2">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-base tracking-widest">MISSION</span>
                    <span className="text-primary text-base font-bold tracking-widest">
                        {missionId}
                    </span>
                </div>
                <Sep />
                <Meta label="TARGET" value="app.targetcorp.com" />
                <Meta label="MODE" value="ONE-DAY" />
                <Meta label="SURFACE" value="WEB APPLICATION" />
                <Sep />
                <div className="ml-auto flex items-center gap-1.5">
                    <div className="bg-success h-1.5 w-1.5 pulse-dot rounded-full" />
                    <span className="text-success text-base font-semibold tracking-widest">
                        {MISSION_STATUS.RUNNING}
                    </span>
                </div>
            </div>
            {/* Metrics row */}
            <div className="flex w-full items-center gap-0 overflow-x-auto">
                <KPIStrip
                    className="flex min-w-max flex-1 rounded-none border-0 border-t"
                    items={[
                        { k: "VDG NODES", v: "12" },
                        { k: "EL FACTS", v: "87" },
                        { k: "FINDINGS", v: "07", c: "var(--primary)" },
                        { k: "COST", v: "$1.42", c: "var(--primary)" },
                        { k: "TIME", v: time },
                    ]}
                />
            </div>
        </div>
    );
}
