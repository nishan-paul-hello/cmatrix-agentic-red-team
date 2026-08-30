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
        <div className="bg-background border-border lg:w-panel-xs flex w-full flex-shrink-0 flex-col border-b lg:overflow-y-auto lg:border-r lg:border-b-0">
            <div className="flex flex-row overflow-x-auto lg:flex-1 lg:flex-col">
                {subNavItems.map((item) => {
                    const active = subNav === item.id;
                    return (
                        <Button
                            key={item.id}
                            variant="ghost"
                            onClick={() => dispatch({ type: "SET_SUB_NAV", payload: item.id })}
                            aria-current={active ? "page" : undefined}
                            className={`border-border h-auto w-max shrink-0 justify-start rounded-none border-l px-4 py-2 text-left text-xs tracking-tight uppercase lg:w-full ${active ? "text-primary" : "text-muted-foreground hover:text-muted-foreground"}`}
                        >
                            {(() => {
                                if (item.id === "findings") {
                                    return (
                                        <span className="flex items-center gap-1.5">
                                            {item.label}
                                            <span className="border-border bg-muted text-primary rounded-sm border-[1px] border-solid px-1 text-sm tracking-normal">
                                                7
                                            </span>
                                        </span>
                                    );
                                }
                                if (item.id === "escalation") {
                                    return (
                                        <span className="flex items-center gap-1.5">
                                            {item.label}
                                            <span className="border-border bg-muted text-destructive rounded-sm border-[1px] border-solid px-1 text-sm tracking-normal">
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
                    className={`bg-card hover:bg-card hover:border-warning h-auto w-full rounded-sm py-[7px] text-base font-semibold tracking-widest ${paused ? "border-warning text-warning" : "border-border text-muted-foreground"}`}
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
                >
                    {paused ? "▶ RESUME" : "⏸ PAUSE"}
                </Button>
                <Button
                    variant="outline"
                    className={`h-auto w-full rounded-sm py-[7px] text-base font-semibold tracking-widest ${
                        terminated
                            ? "bg-border border-border text-muted-foreground cursor-not-allowed"
                            : "border-primary text-primary hover:bg-border hover:border-primary cursor-pointer bg-transparent"
                    }`}
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
                >
                    {terminated ? "— TERMINATED" : "✕ TERMINATE"}
                </Button>
            </div>
        </div>
    );
}
