import { useState } from "react";
import TrajectoryPage from "./TrajectoryPage";
const MISSION_OPTIONS = ["CVE-001", "CVE-002", "CVE-003", "BENCH-014"];
export default function TrajectoryBrowser() {
  const [mission, setMission] = useState("CVE-001");
  return <div className="flex flex-col h-full min-h-[0px]">
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{
      borderBottom: "1px solid var(--color-hex-1e1e1e)"
    }}>
        <div className="text-[9px] text-[var(--color-hex-666666)] tracking-[0.22em] mb-[3px]">RESEARCH</div>
        <div className="flex items-baseline justify-between">
          <h1 className="text-[20px] font-bold text-[var(--color-hex-f2f2f2)] tracking-[0.12em]">TRAJECTORY BROWSER</h1>
          {/* Mission selector */}
          <div className="flex items-center gap-2">
            <span className="text-[8px] text-[var(--color-hex-444444)] tracking-[0.18em]">MISSION</span>
            <select value={mission} onChange={e => setMission(e.target.value)} className="bg-[var(--color-hex-111111)] border-[1px] border-solid border-[var(--color-hex-292929)] rounded-[2px] text-[var(--color-hex-a0a0a0)] text-[10px] py-[4px] px-[8px] font-inherit tracking-[0.08em] cursor-pointer outline-none">
              {MISSION_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Trajectory content for selected mission */}
      <div className="flex-1 overflow-hidden min-h-[0px]">
        <TrajectoryPage key={mission} />
      </div>
    </div>;
}