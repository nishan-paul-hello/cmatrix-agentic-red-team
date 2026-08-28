"use client";

import { useState } from "react";

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
        <div className="flex h-full min-h-[0px] flex-col">
            {/* Browser header — matches TrajectoryBrowser header pattern exactly */}
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{ borderBottom: "1px solid var(--color-hex-1e1e1e)" }}
            >
                <div className="tracking-widest-2 mb-[3px] text-base text-[var(--color-hex-666666)]">
                    KNOWLEDGE
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-9xl font-bold tracking-wide text-[var(--color-fg)]">
                        MEMORY BROWSER
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="tracking-wider-3 text-sm text-[var(--color-hex-444444)]">
                            SCOPE
                        </span>
                        <select
                            value={selected}
                            onChange={(e) => setSelected(e.target.value)}
                            className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-111111)] px-[8px] py-[4px] text-lg tracking-tight text-[var(--color-hex-a0a0a0)] outline-none"
                        >
                            {MISSION_OPTIONS.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* C2 cross-mission label — visible when aggregate mode is active */}
                {isAggregate && (
                    <div className="tracking-wider-2 mt-[6px] text-sm text-[var(--color-success)]">
                        ◈ CROSS-MISSION AGGREGATE — skill promotion and 3-tier memory transfer
                        across all missions (§10.2 / C2)
                    </div>
                )}
            </div>

            {/* Content: pass missionId only when a specific mission is selected */}
            <div className="min-h-[0px] flex-1 overflow-hidden">
                <MemoryPage
                    key={selected}
                    initialTab={initialTab}
                    missionId={isAggregate ? undefined : selected}
                />
            </div>
        </div>
    );
}
