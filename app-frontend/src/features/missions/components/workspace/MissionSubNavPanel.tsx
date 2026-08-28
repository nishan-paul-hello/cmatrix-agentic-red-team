import React from "react";

import { Button } from "@/components/ui/button";
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
        <div className="bg-background border-border flex w-full flex-shrink-0 flex-col border-b lg:w-[168px] lg:overflow-y-auto lg:border-r lg:border-b-0">
            <div className="flex flex-row overflow-x-auto py-2 lg:flex-1 lg:flex-col">
                {subNavItems.map((item) => {
                    const active = subNav === item.id;
                    return (
                        <Button
                            key={item.id}
                            variant="ghost"
                            onClick={() => dispatch({ type: "SET_SUB_NAV", payload: item.id })}
                            className="border-border h-auto w-max shrink-0 justify-start rounded-none border-l px-4 py-2 text-left text-xs tracking-tight uppercase lg:w-full"
                            onMouseEnter={(e) => {
                                if (!active) {
                                    e.currentTarget.style.color = "var(--muted-foreground)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!active) {
                                    e.currentTarget.style.color = "var(--muted-foreground)";
                                }
                            }}
                        >
                            {(() => {
                                if (item.id === "findings") {
                                    return (
                                        <span className="flex items-center gap-1.5">
                                            {item.label}
                                            <span
                                                className="border-border bg-muted text-primary rounded-sm border-[1px] border-solid text-sm tracking-normal"
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
                                                className="border-border bg-muted text-destructive rounded-sm border-[1px] border-solid text-sm tracking-normal"
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
                        </Button>
                    );
                })}
            </div>

            {/* PAUSE / TERMINATE */}
            <div className="border-border flex flex-row gap-2 border-t p-3 lg:flex-col">
                <Button
                    variant="outline"
                    className="bg-card hover:bg-card h-auto w-full rounded-sm text-base font-semibold tracking-widest"
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
                        border: `1px solid ${paused ? "var(--warning)" : "var(--border)"}`,
                        color: paused ? "var(--warning)" : "var(--warning)",
                        padding: "7px 0",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--warning)")}
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = paused
                            ? "var(--warning)"
                            : "var(--border)")
                    }
                >
                    {paused ? "▶ RESUME" : "⏸ PAUSE"}
                </Button>
                <Button
                    variant="outline"
                    className="h-auto w-full rounded-sm text-base font-semibold tracking-widest"
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
                        background: terminated ? "var(--border)" : "var(--border)",
                        border: `1px solid ${terminated ? "var(--border)" : "var(--border)"}`,
                        color: terminated ? "var(--muted-foreground)" : "var(--primary)",
                        padding: "7px 0",
                        cursor: terminated ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={(e) => {
                        if (!terminated) {
                            e.currentTarget.style.background = "var(--border)";
                            e.currentTarget.style.borderColor = "var(--primary)";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!terminated) {
                            e.currentTarget.style.background = "var(--border)";
                            e.currentTarget.style.borderColor = "var(--border)";
                        }
                    }}
                >
                    {terminated ? "— TERMINATED" : "✕ TERMINATE"}
                </Button>
            </div>
        </div>
    );
}
