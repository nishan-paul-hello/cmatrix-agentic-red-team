import React from "react";
import dynamic from "next/dynamic";

import CostDashboard from "@/features/cost/components/CostDashboard";
import EnvironmentalLayer from "@/features/environment/components/EnvironmentalLayer";
import HumanEscalation from "@/features/escalation/components/HumanEscalation";
import ExecutionConsole from "@/features/execution/components/ExecutionConsole";
import FindingsDashboard from "@/features/findings/components/FindingsDashboard";
import MemoryPage from "@/features/memory/components/MemoryPage";
import MissionLiveState from "@/features/missions/components/workspace/MissionLiveState";
import MissionOverview from "@/features/missions/components/workspace/MissionOverview";
import MissionStatusStrip from "@/features/missions/components/workspace/MissionStatusStrip";
import MissionSubNavPanel from "@/features/missions/components/workspace/MissionSubNavPanel";
import { type WorkspaceAction } from "@/features/missions/components/workspace/MissionWorkspaceContainer";
import {
    type LogEntry,
    type MissionSubNav,
} from "@/features/missions/data/fixtures/workspaceMockData";
import { type MissionOrchestratorModel } from "@/features/missions/domain/Orchestrator";
import Specialists from "@/features/specialists/components/Specialists";
import TeamManagerDashboard from "@/features/specialists/components/TeamManagerDashboard";
import TrajectoryPage from "@/features/trajectory/components/TrajectoryPage";
import EvaluationScreen from "@/features/validation/components/EvaluationScreen";
import ValidationCenter from "@/features/validation/components/ValidationCenter";

const AttackGraphCanvas = dynamic(
    () => import("@/features/missions/components/workspace/AttackGraphCanvas"),
    { ssr: false },
);

export default function MissionWorkspaceView({
    missionId,
    subNav,
    log,
    paused,
    terminated,
    time,
    dispatch,
}: {
    missionId: string;
    subNav: MissionSubNav;
    log: LogEntry[];
    paused: boolean;
    terminated: boolean;
    time: string;
    dispatch: React.Dispatch<WorkspaceAction>;
    orchestrator?: MissionOrchestratorModel | null;
}) {
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            {/* ── Mission status strip ── */}
            <MissionStatusStrip missionId={missionId} time={time} />

            {/* ── Three-column workspace ── */}
            <div className="flex min-h-[0px] flex-1 overflow-hidden">
                {/* LEFT: mission sub-nav */}
                <MissionSubNavPanel
                    missionId={missionId}
                    subNav={subNav}
                    paused={paused}
                    terminated={terminated}
                    dispatch={dispatch}
                />

                {/* CENTER: overview split or full-bleed graph */}
                <div className="flex min-h-[0px] flex-1 flex-col overflow-hidden">
                    {subNav === "attack-graph" && <AttackGraphCanvas />}
                    {subNav === "environment" && <EnvironmentalLayer />}
                    {subNav === "specialists" && <Specialists />}
                    {subNav === "execution" && <ExecutionConsole />}
                    {subNav === "evaluation" && <EvaluationScreen />}
                    {subNav === "validation" && <ValidationCenter />}
                    {subNav === "findings" && <FindingsDashboard />}
                    {subNav === "memory" && <MemoryPage />}
                    {subNav === "trajectory" && <TrajectoryPage />}
                    {subNav === "cost" && <CostDashboard />}
                    {subNav === "team-manager" && <TeamManagerDashboard />}
                    {subNav === "escalation" && <HumanEscalation />}
                    {subNav !== "attack-graph" &&
                        subNav !== "environment" &&
                        subNav !== "specialists" &&
                        subNav !== "execution" &&
                        subNav !== "evaluation" &&
                        subNav !== "validation" &&
                        subNav !== "findings" &&
                        subNav !== "memory" &&
                        subNav !== "trajectory" &&
                        subNav !== "cost" &&
                        subNav !== "team-manager" &&
                        subNav !== "escalation" && (
                            <MissionOverview log={log} dispatch={dispatch} />
                        )}
                </div>

                {/* RIGHT: stats + specialists — hidden in full-bleed views */}
                {![
                    "attack-graph",
                    "environment",
                    "specialists",
                    "execution",
                    "evaluation",
                    "validation",
                    "findings",
                    "memory",
                    "trajectory",
                    "cost",
                    "team-manager",
                    "escalation",
                ].includes(subNav) && <MissionLiveState time={time} />}
            </div>
        </div>
    );
}
