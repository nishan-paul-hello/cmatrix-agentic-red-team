import React from "react";

import { type WorkspaceAction } from "@/features/missions/components/workspace/MissionWorkspaceContainer";
import { type MissionSubNav } from "@/features/missions/data/fixtures/workspaceMockData";
import { useWorkspaceData } from "@/features/missions/hooks/useWorkspaceData";
import { useTelemetry } from "@/hooks/useTelemetry";

export default function MissionSubNavPanel({
    missionId,
    subNav,
    paused,
    terminated,
    dispatch,
}: {
    missionId: string;
    subNav: MissionSubNav;
    paused: boolean;
    terminated: boolean;
    dispatch: React.Dispatch<WorkspaceAction>;
}) {
    const { logEvent } = useTelemetry();
    const { subNav: subNavItems } = useWorkspaceData();

    return (
        <div
            className="flex w-[168px] flex-shrink-0 flex-col overflow-y-auto bg-[var(--color-hex-0b0b0b)]"
            style={{
                borderRight: "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            <div className="flex-1 py-2">
                {subNavItems.map((item) => {
                    const active = subNav === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => dispatch({ type: "SET_SUB_NAV", payload: item.id })}
                            className="font-inherit flex w-full cursor-pointer items-center px-4 py-2 text-left text-[10.5px] tracking-[0.06em]"
                            style={{
                                background: active ? "var(--color-hex-160809)" : "transparent",
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
                                logEvent(newPausedState ? "MISSION_PAUSED" : "MISSION_RESUMED", {
                                    missionId,
                                });
                            })
                            .catch(() => {
                                // Revert state on failure
                                dispatch({ type: "SET_PAUSED", payload: !newPausedState });
                            });
                    }}
                    style={{
                        border: `1px solid ${paused ? "var(--color-hex-d29922)" : "var(--color-hex-333333)"}`,
                        color: paused ? "var(--color-hex-d29922)" : "var(--color-hex-d29922)",
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
                        color: terminated ? "var(--color-hex-555555)" : "var(--color-hex-e31b23)",
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
    );
}
