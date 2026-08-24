import { useState } from "react";

import TrajectoryPage from "@/features/trajectory/components/TrajectoryPage";

const MISSION_OPTIONS = ["CVE-001", "CVE-002", "CVE-003", "BENCH-014"];
export default function TrajectoryBrowser() {
    const [mission, setMission] = useState("CVE-001");
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            {/* Header */}
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    RESEARCH
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        TRAJECTORY BROWSER
                    </h1>
                    {/* Mission selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                            MISSION
                        </span>
                        <select
                            value={mission}
                            onChange={(e) => setMission(e.target.value)}
                            className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-111111)] px-[8px] py-[4px] text-[10px] tracking-[0.08em] text-[var(--color-hex-a0a0a0)] outline-none"
                        >
                            {MISSION_OPTIONS.map((m) => (
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
