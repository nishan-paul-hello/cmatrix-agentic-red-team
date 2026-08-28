import React, { useState } from "react";
import { FocusTrap } from "focus-trap-react";

import { Button } from "@/components/ui/button";
import { getStatusColor } from "@/components/ui/StatusBadge";
import { type ExecEntry } from "@/types/domain-types";

import { ExecDrawerElChangesTab } from "./exec-drawer-tabs/ExecDrawerElChangesTab";
import { ExecDrawerParsedTab } from "./exec-drawer-tabs/ExecDrawerParsedTab";
import { ExecDrawerRawTab } from "./exec-drawer-tabs/ExecDrawerRawTab";
import { ExecDrawerSummaryTab } from "./exec-drawer-tabs/ExecDrawerSummaryTab";
import { ExecDrawerTrajectoryTab } from "./exec-drawer-tabs/ExecDrawerTrajectoryTab";

export function ExecDrawer({
    entry,
    parsedRows,
    onClose,
}: {
    entry: ExecEntry;
    parsedRows: Record<string, string | number | boolean>[];
    onClose: () => void;
}) {
    const drawerRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        function handler(e: MouseEvent | KeyboardEvent) {
            if (e.type === "keydown" && (e as KeyboardEvent).key === "Escape") {
                onClose();
            }
            if (
                e.type === "mousedown" &&
                drawerRef.current &&
                !drawerRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handler);
        document.addEventListener("keydown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("keydown", handler);
        };
    }, [onClose]);

    const [tab, setTab] = useState<
        "SUMMARY" | "RAW OUTPUT" | "PARSED OUTPUT" | "EL CHANGES" | "TRAJECTORY"
    >("SUMMARY");
    const sc = getStatusColor(entry.status).color;
    return (
        <FocusTrap focusTrapOptions={{ escapeDeactivates: false, clickOutsideDeactivates: false }}>
            <div
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="exec-drawer-title"
                className="bg-background border-border flex w-full flex-shrink-0 flex-col overflow-hidden border-t md:w-[var(--width-drawer-lg)] md:border-t-0 md:border-l"
            >
                <div className="border-border flex items-center justify-between border-b px-4 pt-4 pb-3">
                    <div>
                        <div
                            id="exec-drawer-title"
                            className="text-foreground text-xs font-bold tracking-wide"
                        >
                            EXECUTION #{entry.id}
                        </div>
                        <div className="text-muted-foreground mt-0.5 text-sm tracking-wide">
                            {entry.specialist} · {entry.command.tool.id}
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={onClose}
                        className="text-muted-foreground"
                    >
                        ✕
                    </Button>
                </div>

                {/* Tabs */}
                <div className="border-border flex flex-shrink-0 overflow-x-auto border-b">
                    {(
                        [
                            "SUMMARY",
                            "RAW OUTPUT",
                            "PARSED OUTPUT",
                            "EL CHANGES",
                            "TRAJECTORY",
                        ] as const
                    ).map((t) => (
                        <Button
                            key={t}
                            variant="ghost"
                            onClick={() => setTab(t)}
                            className="h-auto rounded-none px-2 py-1 text-sm tracking-normal whitespace-nowrap hover:bg-transparent"
                            style={{
                                borderBottom:
                                    t === tab
                                        ? "2px solid var(--primary)"
                                        : "2px solid transparent",
                                color: t === tab ? "var(--foreground)" : "var(--muted-foreground)",
                            }}
                        >
                            {t}
                        </Button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                    {tab === "SUMMARY" && <ExecDrawerSummaryTab entry={entry} statusColor={sc} />}
                    {tab === "PARSED OUTPUT" && (
                        <ExecDrawerParsedTab entry={entry} parsedRows={parsedRows} />
                    )}
                    {tab === "RAW OUTPUT" && <ExecDrawerRawTab />}
                    {tab === "EL CHANGES" && <ExecDrawerElChangesTab />}
                    {tab === "TRAJECTORY" && <ExecDrawerTrajectoryTab entry={entry} />}
                </div>
            </div>
        </FocusTrap>
    );
}
