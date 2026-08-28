import { useState } from "react";

import { MISSION_IDS } from "@/features/missions/data/fixtures/missionOptions";
import TrajectoryPage from "@/features/trajectory/components/TrajectoryPage";

export default function TrajectoryBrowser() {
    const [mission, setMission] = useState<string>(MISSION_IDS[0]);
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
                    RESEARCH
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-9xl font-bold tracking-wide text-[var(--color-fg)]">
                        TRAJECTORY BROWSER
                    </h1>
                    {/* Mission selector */}
                    <div className="flex items-center gap-2">
                        <span className="tracking-wider-3 text-sm text-[var(--color-hex-444444)]">
                            MISSION
                        </span>
                        <select
                            value={mission}
                            onChange={(e) => setMission(e.target.value)}
                            className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-111111)] px-[8px] py-[4px] text-lg tracking-tight text-[var(--color-hex-a0a0a0)] outline-none"
                        >
                            {MISSION_IDS.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Trajectory content for selected mission */}
            <div className="min-h-[0px] flex-1 overflow-hidden">
                <TrajectoryPage key={mission} />
            </div>
        </div>
    );
}
