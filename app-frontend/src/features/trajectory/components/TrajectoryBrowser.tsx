"use client";

import { useState } from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MISSION_IDS } from "@/features/missions/data/fixtures/missionOptions";
import TrajectoryPage from "@/features/trajectory/components/TrajectoryPage";

export default function TrajectoryBrowser() {
    const [mission, setMission] = useState<string>(MISSION_IDS[0]);
    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Header */}
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-4">
                <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                    RESEARCH
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-foreground text-xs font-bold tracking-wide">
                        TRAJECTORY BROWSER
                    </h1>
                    {/* Mission selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm tracking-widest">
                            MISSION
                        </span>
                        <Select value={mission} onValueChange={(val) => val && setMission(val)}>
                            <SelectTrigger className="bg-card text-muted-foreground w-panel-2xs h-auto rounded-sm px-2 py-1 text-xs tracking-tight focus:ring-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MISSION_IDS.map((m) => (
                                    <SelectItem key={m} value={m}>
                                        {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Trajectory content for selected mission */}
            <div className="min-h-0 flex-1 overflow-hidden">
                <TrajectoryPage key={mission} />
            </div>
        </div>
    );
}
