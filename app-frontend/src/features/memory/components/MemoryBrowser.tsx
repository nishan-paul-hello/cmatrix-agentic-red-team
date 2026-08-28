"use client";

import { useState } from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import MemoryPage from "@/features/memory/components/MemoryPage";
import { type MemTab } from "@/features/memory/data/mockData";
import {
    ALL_MISSIONS_OPTION,
    MISSION_OPTIONS,
} from "@/features/missions/data/fixtures/missionOptions";

/**
 * MemoryBrowser — global cross-mission memory view (reached from KNOWLEDGE nav group).
 *
 * Pattern: identical to TrajectoryBrowser.tsx.
 * - "ALL MISSIONS" selector → renders MemoryPage with no missionId (cross-mission aggregate view).
 * - Per-mission selector → renders MemoryPage with missionId prop (mission-scoped view).
 *
 * This directly demonstrates C2 (Cross-Mission Memory, §10.2 / §10.5): the Skill Library and
 * 3-tier memory are cross-mission stores — this browser visualizes them as such.
 */
export default function MemoryBrowser({ initialTab }: { initialTab?: MemTab }) {
    const [selected, setSelected] = useState<string>(ALL_MISSIONS_OPTION);
    const isAggregate = selected === ALL_MISSIONS_OPTION;

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Browser header — matches TrajectoryBrowser header pattern exactly */}
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-4">
                <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                    KNOWLEDGE
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-foreground text-xs font-bold tracking-wide">
                        MEMORY BROWSER
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm tracking-widest">SCOPE</span>
                        <Select value={selected} onValueChange={(val) => val && setSelected(val)}>
                            <SelectTrigger className="bg-card text-muted-foreground h-auto w-[140px] rounded-sm px-2 py-1 text-xs tracking-tight focus:ring-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MISSION_OPTIONS.map((m) => (
                                    <SelectItem key={m} value={m}>
                                        {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {/* C2 cross-mission label — visible when aggregate mode is active */}
                {isAggregate && (
                    <div className="text-success mt-1.5 text-sm tracking-widest">
                        ◈ CROSS-MISSION AGGREGATE — skill promotion and 3-tier memory transfer
                        across all missions (§10.2 / C2)
                    </div>
                )}
            </div>

            {/* Content: pass missionId only when a specific mission is selected */}
            <div className="min-h-0 flex-1 overflow-hidden">
                <MemoryPage
                    key={selected}
                    initialTab={initialTab}
                    missionId={isAggregate ? undefined : selected}
                />
            </div>
        </div>
    );
}
