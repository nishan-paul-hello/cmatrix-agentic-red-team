import React from "react";

import { Button } from "@/components/ui/button";
import { useNodeDrawerContext } from "@/features/missions/components/workspace/VDGNodeDrawerContext";

export function VDGNodeDrawerHeader() {
    const { node, onClose, statusColor, statusBg, statusBorder } = useNodeDrawerContext();
    return (
        <div className="border-border flex items-start justify-between border-b px-4 pt-4 pb-3">
            <div>
                <div className="mb-1 flex items-center gap-2">
                    <span
                        id="vdg-node-drawer-title"
                        className="text-foreground text-sm font-bold tracking-wide"
                    >
                        {node.id}
                    </span>
                    <span
                        className="rounded-sm px-1.5 py-px text-sm font-semibold tracking-widest"
                        style={{
                            color: statusColor,
                            background: statusBg,
                            border: `1px solid ${statusBorder}`,
                        }}
                    >
                        {node.status}
                    </span>
                </div>
                <div className="text-muted-foreground text-base tracking-widest">{node.type}</div>
            </div>
            <Button
                variant="ghost"
                size="icon-xs"
                onClick={onClose}
                className="text-muted-foreground hover:text-muted-foreground h-auto p-0.5 text-sm leading-none hover:bg-transparent"
                aria-label="Close"
            >
                ✕
            </Button>
        </div>
    );
}
