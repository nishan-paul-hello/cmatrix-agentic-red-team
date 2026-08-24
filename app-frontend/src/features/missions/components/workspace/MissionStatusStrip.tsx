import React from "react";

import { MetricTile } from "@/components/ui/MetricTile";
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
        <div
            className="flex-shrink-0 bg-[var(--color-hex-0b0b0b)]"
            style={{
                borderBottom: "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            {/* Identity row */}
            <div
                className="flex items-center gap-6 px-4 py-2"
                style={{
                    borderBottom: "1px solid var(--color-hex-151515)",
                }}
            >
                <div className="flex items-center gap-2">
                    <span className="text-[9px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                        MISSION
                    </span>
                    <span className="text-[9px] font-bold tracking-[0.16em] text-[var(--color-hex-e31b23)]">
                        {missionId}
                    </span>
                </div>
                <Sep />
                <Meta label="TARGET" value="app.targetcorp.com" />
                <Meta label="MODE" value="ONE-DAY" />
                <Meta label="SURFACE" value="WEB APPLICATION" />
                <Sep />
                <div className="ml-auto flex items-center gap-1.5">
                    <div
                        className="h-[6px] w-[6px] bg-[var(--color-hex-3fb950)]"
                        style={{
                            borderRadius: "50%",
                            animation: "pulse 1.4s ease infinite",
                        }}
                    />
                    <span className="text-[9px] font-semibold tracking-[0.16em] text-[var(--color-hex-3fb950)]">
                        {MISSION_STATUS.RUNNING}
                    </span>
                </div>
            </div>
            {/* Metrics row */}
            <div className="flex items-center gap-0">
                {[
                    {
                        label: "VDG NODES",
                        value: "12",
                    },
                    {
                        label: "EL FACTS",
                        value: "87",
                    },
                    {
                        label: "FINDINGS",
                        value: "07",
                        red: true,
                    },
                    {
                        label: "COST",
                        value: "$1.42",
                        red: true,
                    },
                    {
                        label: "TIME",
                        value: time,
                    },
                ].map((m) => (
                    <MetricTile
                        key={m.label}
                        label={m.label}
                        value={m.value}
                        valueColor={m.red ? "var(--color-hex-e31b23)" : "var(--color-hex-a0a0a0)"}
                        variant="inline"
                        borderRight
                    />
                ))}
            </div>
        </div>
    );
}
