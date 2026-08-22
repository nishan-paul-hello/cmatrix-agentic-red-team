import React from "react";
import dynamic from "next/dynamic";

import { MetricTile } from "@/components/ui/MetricTile";
import CostDashboard from "@/features/cost/components/CostDashboard";
import EnvironmentalLayer from "@/features/environment/components/EnvironmentalLayer";
import HumanEscalation from "@/features/escalation/components/HumanEscalation";
import ExecutionConsole from "@/features/execution/components/ExecutionConsole";
import FindingsDashboard from "@/features/findings/components/FindingsDashboard";
import MemoryPage from "@/features/memory/components/MemoryPage";
import Meta from "@/features/missions/components/workspace/Meta";
import { type WorkspaceAction } from "@/features/missions/components/workspace/MissionWorkspaceContainer";
import nodeStyle from "@/features/missions/components/workspace/NodeStyle";
import Sep from "@/features/missions/components/workspace/Sep";
import SpecBadge from "@/features/missions/components/workspace/SpecBadge";
import specialistStatusDot from "@/features/missions/components/workspace/SpecialistStatusDot";
import Stat from "@/features/missions/components/workspace/Stat";
import statusBadge from "@/features/missions/components/workspace/StatusBadge";
import {
    SPECIALISTS,
    SUB_NAV,
    VDG_NODES,
    type LogEntry,
    type MissionSubNav,
} from "@/features/missions/data/workspaceMockData";
import { type MissionOrchestratorModel } from "@/features/missions/domain/Orchestrator";
import Specialists from "@/features/specialists/components/Specialists";
import TeamManagerDashboard from "@/features/specialists/components/TeamManagerDashboard";
import TrajectoryPage from "@/features/trajectory/components/TrajectoryPage";
import EvaluationScreen from "@/features/validation/components/EvaluationScreen";
import ValidationCenter from "@/features/validation/components/ValidationCenter";
import { useTelemetry } from "@/hooks/useTelemetry";
import { MISSION_STATUS } from "@/types/domain-types";

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
    const { logEvent } = useTelemetry();
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            {/* ── Mission status strip ── */}
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
                            valueColor={
                                m.red ? "var(--color-hex-e31b23)" : "var(--color-hex-a0a0a0)"
                            }
                            variant="inline"
                            borderRight
                        />
                    ))}
                </div>
            </div>

            {/* ── Three-column workspace ── */}
            <div className="flex min-h-[0px] flex-1 overflow-hidden">
                {/* LEFT: mission sub-nav */}
                <div
                    className="flex w-[168px] flex-shrink-0 flex-col overflow-y-auto bg-[var(--color-hex-0b0b0b)]"
                    style={{
                        borderRight: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <div className="flex-1 py-2">
                        {SUB_NAV.map((item) => {
                            const active = subNav === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() =>
                                        dispatch({ type: "SET_SUB_NAV", payload: item.id })
                                    }
                                    className="font-inherit flex w-full cursor-pointer items-center px-4 py-2 text-left text-[10.5px] tracking-[0.06em]"
                                    style={{
                                        background: active
                                            ? "var(--color-hex-160809)"
                                            : "transparent",
                                        borderLeft: active
                                            ? "2px solid var(--color-hex-e31b23)"
                                            : "2px solid transparent",
                                        color: active
                                            ? "var(--color-hex-f2f2f2)"
                                            : "var(--color-hex-555555)",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!active) {
                                            e.currentTarget.style.color = "var(--color-hex-888888)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!active) {
                                            e.currentTarget.style.color = "var(--color-hex-555555)";
                                        }
                                    }}
                                >
                                    {(() => {
                                        if (item.id === "findings") {
                                            return (
                                                <span className="flex items-center gap-1.5">
                                                    {item.label}
                                                    <span
                                                        className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-6f171b)] bg-[var(--color-hex-1a0608)] text-[8px] tracking-[0.1em] text-[var(--color-hex-e31b23)]"
                                                        style={{
                                                            padding: "0 4px",
                                                        }}
                                                    >
                                                        7
                                                    </span>
                                                </span>
                                            );
                                        }
                                        if (item.id === "escalation") {
                                            return (
                                                <span className="flex items-center gap-1.5">
                                                    {item.label}
                                                    <span
                                                        className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-ff2a3266)] bg-[var(--color-hex-1a0608)] text-[8px] tracking-[0.1em] text-[var(--color-hex-ff2a32)]"
                                                        style={{
                                                            padding: "0 4px",
                                                        }}
                                                    >
                                                        !
                                                    </span>
                                                </span>
                                            );
                                        }
                                        return item.label;
                                    })()}
                                </button>
                            );
                        })}
                    </div>

                    {/* PAUSE / TERMINATE */}
                    <div
                        className="flex flex-col gap-2 p-3"
                        style={{
                            borderTop: "1px solid var(--color-hex-1e1e1e)",
                        }}
                    >
                        <button
                            className="font-inherit w-full cursor-pointer rounded-[2px] bg-[var(--color-hex-111111)] text-[9.5px] font-semibold tracking-[0.16em]"
                            onClick={() => {
                                const newPausedState = !paused;
                                dispatch({ type: "SET_PAUSED", payload: newPausedState });
                                Promise.resolve()
                                    .then(() => new Promise((resolve) => setTimeout(resolve, 500)))
                                    .then(() => {
                                        logEvent(
                                            newPausedState ? "MISSION_PAUSED" : "MISSION_RESUMED",
                                            { missionId },
                                        );
                                    })
                                    .catch(() => {
                                        // Revert state on failure
                                        dispatch({ type: "SET_PAUSED", payload: !newPausedState });
                                    });
                            }}
                            style={{
                                border: `1px solid ${paused ? "var(--color-hex-d29922)" : "var(--color-hex-333333)"}`,
                                color: paused
                                    ? "var(--color-hex-d29922)"
                                    : "var(--color-hex-d29922)",
                                padding: "7px 0",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.borderColor = "var(--color-hex-d29922)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.borderColor = paused
                                    ? "var(--color-hex-d29922)"
                                    : "var(--color-hex-333333)")
                            }
                        >
                            {paused ? "▶ RESUME" : "⏸ PAUSE"}
                        </button>
                        <button
                            className="font-inherit w-full rounded-[2px] text-[9.5px] font-semibold tracking-[0.16em]"
                            onClick={() => {
                                dispatch({ type: "SET_PAUSED", payload: true });
                                dispatch({ type: "SET_TERMINATED", payload: true });
                                Promise.resolve()
                                    .then(() => new Promise((resolve) => setTimeout(resolve, 500)))
                                    .then(() => {
                                        logEvent("MISSION_TERMINATED", { missionId });
                                    })
                                    .catch(() => {
                                        // Revert state on failure
                                        dispatch({ type: "SET_PAUSED", payload: false });
                                        dispatch({ type: "SET_TERMINATED", payload: false });
                                    });
                            }}
                            disabled={terminated}
                            style={{
                                background: terminated
                                    ? "var(--color-hex-0d0808)"
                                    : "var(--color-hex-110808)",
                                border: `1px solid ${terminated ? "var(--color-hex-333333)" : "var(--color-hex-6f171b)"}`,
                                color: terminated
                                    ? "var(--color-hex-555555)"
                                    : "var(--color-hex-e31b23)",
                                padding: "7px 0",
                                cursor: terminated ? "not-allowed" : "pointer",
                            }}
                            onMouseEnter={(e) => {
                                if (!terminated) {
                                    e.currentTarget.style.background = "var(--color-hex-1a0a0b)";
                                    e.currentTarget.style.borderColor = "var(--color-hex-e31b23)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!terminated) {
                                    e.currentTarget.style.background = "var(--color-hex-110808)";
                                    e.currentTarget.style.borderColor = "var(--color-hex-6f171b)";
                                }
                            }}
                        >
                            {terminated ? "— TERMINATED" : "✕ TERMINATE"}
                        </button>
                    </div>
                </div>

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
                            <>
                                {/* CENTER TOP: attack graph canvas */}
                                <div
                                    className="relative flex-shrink-0 overflow-hidden bg-[var(--color-hex-080808)]"
                                    style={{
                                        height: "54%",
                                        borderBottom: "1px solid var(--color-hex-1e1e1e)",
                                    }}
                                >
                                    {/* Grid */}
                                    <div
                                        className="pointer-events-none absolute inset-0"
                                        style={{
                                            backgroundImage:
                                                "linear-gradient(rgba(30,30,30,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30,30,30,0.4) 1px, transparent 1px)",
                                            backgroundSize: "32px 32px",
                                        }}
                                    />

                                    {/* Canvas label */}
                                    <div className="absolute top-3 left-4 flex items-center gap-2">
                                        <span className="text-[8.5px] tracking-[0.2em] text-[var(--color-hex-333333)]">
                                            ATTACK GRAPH — OVERVIEW (4 OF 12 NODES)
                                        </span>
                                        <span className="text-[8px] tracking-[0.12em] text-[var(--color-hex-1e1e1e)]">
                                            VDG / CVE-001
                                        </span>
                                    </div>

                                    {/* Focus path button */}
                                    <div className="absolute top-3 right-4">
                                        <button
                                            onClick={() =>
                                                dispatch({
                                                    type: "SET_SUB_NAV",
                                                    payload: "attack-graph",
                                                })
                                            }
                                            className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-111111)] px-[10px] py-[3px] text-[8.5px] tracking-[0.14em] text-[var(--color-hex-666666)]"
                                        >
                                            FOCUS HIGHEST-SCORE PATH
                                        </button>
                                    </div>

                                    {/* Node chain — centered */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div
                                            className="flex flex-col items-center"
                                            style={{
                                                gap: 0,
                                            }}
                                        >
                                            {VDG_NODES.map((node, i) => {
                                                const s = nodeStyle(node.status);
                                                const badge = statusBadge(node.status);
                                                return (
                                                    <div
                                                        key={node.id}
                                                        className="flex flex-col items-center"
                                                    >
                                                        {/* Connector from previous */}
                                                        {i > 0 && (
                                                            <div
                                                                className="h-[20px] w-[1px]"
                                                                style={{
                                                                    background:
                                                                        node.status === "DEPENDENT"
                                                                            ? "var(--color-hex-222222)"
                                                                            : "var(--color-hex-e31b23)",
                                                                    opacity:
                                                                        node.status === "DEPENDENT"
                                                                            ? 0.4
                                                                            : 1,
                                                                }}
                                                            >
                                                                {/* arrow tip */}
                                                            </div>
                                                        )}
                                                        {/* Arrow tip */}
                                                        {i > 0 && (
                                                            <div
                                                                className="h-[0px] w-[0px]"
                                                                style={{
                                                                    borderLeft:
                                                                        "4px solid transparent",
                                                                    borderRight:
                                                                        "4px solid transparent",
                                                                    borderTop: `5px solid ${node.status === "DEPENDENT" ? "var(--color-hex-222222)" : "var(--color-hex-e31b23)"}`,
                                                                    marginBottom: -1,
                                                                    opacity:
                                                                        node.status === "DEPENDENT"
                                                                            ? 0.4
                                                                            : 1,
                                                                }}
                                                            />
                                                        )}

                                                        {/* Node card */}
                                                        <div
                                                            onClick={() =>
                                                                dispatch({
                                                                    type: "SET_SUB_NAV",
                                                                    payload: "attack-graph",
                                                                })
                                                            }
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key === "Enter" ||
                                                                    e.key === " "
                                                                ) {
                                                                    dispatch({
                                                                        type: "SET_SUB_NAV",
                                                                        payload: "attack-graph",
                                                                    });
                                                                }
                                                            }}
                                                            role="button"
                                                            tabIndex={0}
                                                            className="relative w-[224px] cursor-pointer rounded-[2px] px-[12px] py-[10px]"
                                                            style={{
                                                                background: s.bg,
                                                                border: `1px solid ${s.border}`,
                                                            }}
                                                            title="Click to open Attack Graph"
                                                        >
                                                            {/* Active pulse ring for ELIGIBLE */}
                                                            {node.status === "ELIGIBLE" && (
                                                                <div
                                                                    className="absolute rounded-[3px] border-[1px] border-solid border-[var(--color-hex-e31b2340)]"
                                                                    style={{
                                                                        inset: -3,
                                                                        pointerEvents: "none",
                                                                        animation:
                                                                            "nodeRing 2s ease infinite",
                                                                    }}
                                                                />
                                                            )}

                                                            <div className="mb-1.5 flex items-center justify-between">
                                                                <span
                                                                    className="text-[10px] font-bold tracking-[0.12em]"
                                                                    style={{
                                                                        color: s.labelColor,
                                                                    }}
                                                                >
                                                                    {node.id}
                                                                </span>
                                                                <span
                                                                    className="rounded-[2px] px-[5px] py-[1px] text-[8px] font-semibold tracking-[0.14em]"
                                                                    style={{
                                                                        color: badge.color,
                                                                        background: badge.bg,
                                                                        border: `1px solid ${badge.color}44`,
                                                                    }}
                                                                >
                                                                    {node.status}
                                                                </span>
                                                            </div>

                                                            <div
                                                                className="text-[8.5px] tracking-[0.16em]"
                                                                style={{
                                                                    color: s.typeColor,
                                                                    marginBottom:
                                                                        node.ucb !== undefined
                                                                            ? 8
                                                                            : 0,
                                                                }}
                                                            >
                                                                {node.type}
                                                            </div>

                                                            {node.ucb !== undefined && (
                                                                <div
                                                                    className="flex items-center gap-4"
                                                                    style={{
                                                                        borderTop: `1px solid ${s.border}`,
                                                                        paddingTop: 7,
                                                                    }}
                                                                >
                                                                    <Stat
                                                                        label="UCB"
                                                                        value={node.ucb.toFixed(3)}
                                                                        color={s.labelColor}
                                                                    />
                                                                    <Stat
                                                                        label="E_ord"
                                                                        value={`${node.eord}/${node.eordMax}`}
                                                                        color={s.labelColor}
                                                                    />
                                                                    <Stat
                                                                        label="PATH"
                                                                        value="0.612"
                                                                        color={s.typeColor}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <style>{`
              @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
              @keyframes nodeRing { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.1;transform:scale(1.02)} }
            `}</style>
                                </div>

                                {/* CENTER BOTTOM: live log stream */}
                                <div className="flex min-h-[0px] flex-1 flex-col overflow-hidden">
                                    <div
                                        className="flex flex-shrink-0 items-center gap-2 bg-[var(--color-hex-0d0d0d)] px-4 py-2"
                                        style={{
                                            borderBottom: "1px solid var(--color-hex-1e1e1e)",
                                        }}
                                    >
                                        <div
                                            className="h-[6px] w-[6px] bg-[var(--color-hex-ff2a32)]"
                                            style={{
                                                borderRadius: "50%",
                                                animation: "pulse 1.4s ease infinite",
                                            }}
                                        />
                                        <span className="text-[9.5px] font-semibold tracking-[0.18em] text-[var(--color-hex-666666)]">
                                            EXECUTION LOG
                                        </span>
                                        <span className="ml-auto text-[8.5px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                                            LIVE STREAM
                                        </span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto bg-[var(--color-hex-080808)]">
                                        {log.map((entry) => (
                                            <div
                                                key={entry.id}
                                                className="flex items-start gap-3 px-4 py-1.5"
                                                style={{
                                                    borderBottom:
                                                        "1px solid var(--color-hex-0e0e0e)",
                                                }}
                                            >
                                                <span
                                                    className="shrink-0 text-[9px] tracking-[0.06em] text-[var(--color-hex-333333)]"
                                                    style={{
                                                        paddingTop: 1,
                                                    }}
                                                >
                                                    {entry.ts}
                                                </span>
                                                <span
                                                    className="min-w-[88px] shrink-0 text-[8.5px] font-semibold tracking-[0.12em] text-[var(--color-hex-e31b23)]"
                                                    style={{
                                                        paddingTop: 1,
                                                    }}
                                                >
                                                    {entry.agent}
                                                </span>
                                                <span
                                                    className="min-w-[108px] shrink-0 text-[8.5px] tracking-[0.1em] text-[var(--color-hex-333333)]"
                                                    style={{
                                                        paddingTop: 1,
                                                    }}
                                                >
                                                    {entry.action}
                                                </span>
                                                <span
                                                    className="text-[9.5px] leading-[1.4] tracking-[0.02em]"
                                                    style={{
                                                        color: entry.color,
                                                    }}
                                                >
                                                    {entry.desc}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
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
                ].includes(subNav) && (
                    <div
                        className="flex w-[256px] flex-shrink-0 flex-col overflow-hidden bg-[var(--color-hex-0b0b0b)]"
                        style={{
                            borderLeft: "1px solid var(--color-hex-1e1e1e)",
                        }}
                    >
                        {/* Live state stats */}
                        <div
                            style={{
                                borderBottom: "1px solid var(--color-hex-1e1e1e)",
                            }}
                        >
                            <div className="px-4 pt-4 pb-2 text-[8.5px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                LIVE STATE
                            </div>
                            <div className="grid grid-cols-2 gap-0">
                                {[
                                    {
                                        label: "VDG NODES",
                                        value: "12",
                                        sub: "3 ELIGIBLE",
                                    },
                                    {
                                        label: "EL FACTS",
                                        value: "87",
                                        sub: "23 NEW",
                                    },
                                    {
                                        label: "FINDINGS",
                                        value: "07",
                                        sub: "1 CRITICAL",
                                        red: true,
                                    },
                                    {
                                        label: "COST",
                                        value: "$1.42",
                                        sub: "/ $10.00 CEI",
                                        red: true,
                                    },
                                ].map((s, i) => (
                                    <div
                                        key={s.label}
                                        className="px-[16px] py-[10px]"
                                        style={{
                                            borderRight:
                                                i % 2 === 0
                                                    ? "1px solid var(--color-hex-151515)"
                                                    : "none",
                                            borderBottom:
                                                i < 2
                                                    ? "1px solid var(--color-hex-151515)"
                                                    : "none",
                                        }}
                                    >
                                        <div className="mb-[4px] text-[7.5px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                            {s.label}
                                        </div>
                                        <div
                                            className="text-[20px] leading-[1] font-bold tracking-[0.04em]"
                                            style={{
                                                color: s.red
                                                    ? "var(--color-hex-e31b23)"
                                                    : "var(--color-hex-f2f2f2)",
                                            }}
                                        >
                                            {s.value}
                                        </div>
                                        <div className="mt-[3px] text-[7.5px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                                            {s.sub}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Time */}
                            <div
                                className="flex items-center gap-3 px-4 py-2.5"
                                style={{
                                    borderTop: "1px solid var(--color-hex-151515)",
                                }}
                            >
                                <div>
                                    <div className="mb-[2px] text-[7.5px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                        ELAPSED TIME
                                    </div>
                                    <div className="text-[18px] leading-[1] font-bold tracking-[0.1em] text-[var(--color-hex-a0a0a0)]">
                                        {time}
                                    </div>
                                </div>
                                <div className="ml-auto">
                                    <div className="mb-[2px] text-[7.5px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                        STEP
                                    </div>
                                    <div className="text-[18px] leading-[1] font-bold tracking-[0.06em] text-[var(--color-hex-555555)]">
                                        014
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Specialists */}
                        <div className="flex min-h-[0px] flex-1 flex-col overflow-hidden">
                            <div
                                className="flex flex-shrink-0 items-center justify-between px-4 pt-3 pb-2"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                                }}
                            >
                                <span className="text-[8.5px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                    SPECIALISTS
                                </span>
                                <span className="text-[8px] tracking-[0.12em] text-[var(--color-hex-e31b23)]">
                                    1 RUNNING
                                </span>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {SPECIALISTS.map((spec) => (
                                    <div
                                        key={spec.id}
                                        className="px-4 py-3"
                                        style={{
                                            borderBottom: "1px solid var(--color-hex-111111)",
                                        }}
                                    >
                                        <div className="mb-1.5 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-[6px] shrink-0"
                                                    style={{
                                                        width: spec.status === "IDLE" ? 6 : 6,
                                                        borderRadius: "50%",
                                                        border: `1px solid ${specialistStatusDot(spec.status)}`,
                                                        background:
                                                            spec.status !== "IDLE" &&
                                                            spec.status !== "WAITING"
                                                                ? specialistStatusDot(spec.status)
                                                                : "transparent",
                                                    }}
                                                />
                                                <span
                                                    className="text-[9.5px] font-semibold tracking-[0.08em]"
                                                    style={{
                                                        color:
                                                            spec.status === "IDLE"
                                                                ? "var(--color-hex-444444)"
                                                                : "var(--color-hex-a0a0a0)",
                                                    }}
                                                >
                                                    {spec.role}
                                                </span>
                                            </div>
                                            <SpecBadge status={spec.status} />
                                        </div>
                                        <div className="mb-[2px] text-[8.5px] tracking-[0.08em] text-[var(--color-hex-333333)]">
                                            {spec.task !== "—" && (
                                                <span className="text-[var(--color-hex-555555)]">
                                                    {spec.task}
                                                </span>
                                            )}
                                            {spec.task === "—" && <span>—</span>}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {spec.context !== "—" && (
                                                <span className="text-[7.5px] tracking-[0.12em] text-[var(--color-hex-333333)]">
                                                    CTX: {spec.context}
                                                </span>
                                            )}
                                            {spec.evidence > 0 && (
                                                <span className="text-[7.5px] tracking-[0.1em] text-[var(--color-hex-444444)]">
                                                    EL: {spec.evidence}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
