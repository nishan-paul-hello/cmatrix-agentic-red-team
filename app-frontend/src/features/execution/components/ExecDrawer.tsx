import React, { useState } from "react";
import { FocusTrap } from "focus-trap-react";

import { type ExecEntry } from "@/types/domain-types";
import { getStatusColor } from "@/utils/statusColors";

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
                className="flex w-[var(--width-drawer-lg)] flex-shrink-0 flex-col overflow-hidden bg-[var(--color-hex-0d0d0d)]"
                style={{
                    borderLeft: "1px solid var(--color-hex-292929)",
                }}
            >
                <div
                    className="flex items-center justify-between px-4 pt-4 pb-3"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <div>
                        <div
                            id="exec-drawer-title"
                            className="text-2xl font-bold tracking-wide text-[var(--color-fg)]"
                        >
                            EXECUTION #{entry.id}
                        </div>
                        <div className="text-base-tight mt-[2px] tracking-wide text-[var(--color-hex-444444)]">
                            {entry.specialist} · {entry.command.tool.id}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="font-inherit cursor-pointer border-none bg-[transparent] text-4xl text-[var(--color-hex-444444)]"
                    >
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div
                    className="flex flex-shrink-0"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    {(
                        [
                            "SUMMARY",
                            "RAW OUTPUT",
                            "PARSED OUTPUT",
                            "EL CHANGES",
                            "TRAJECTORY",
                        ] as const
                    ).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className="font-inherit cursor-pointer border-none bg-[transparent] px-[8px] py-[5px] text-sm tracking-normal whitespace-nowrap"
                            style={{
                                borderBottom:
                                    t === tab
                                        ? "2px solid var(--color-brand)"
                                        : "2px solid transparent",
                                color: t === tab ? "var(--color-fg)" : "var(--color-hex-444444)",
                            }}
                        >
                            {t}
                        </button>
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
