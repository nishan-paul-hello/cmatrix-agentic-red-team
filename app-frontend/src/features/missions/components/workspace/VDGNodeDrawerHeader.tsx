import React from "react";

import { useNodeDrawerContext } from "@/features/missions/components/workspace/VDGNodeDrawerContext";

export function VDGNodeDrawerHeader() {
    const { node, onClose, statusColor, statusBg, statusBorder } = useNodeDrawerContext();
    return (
        <div
            className="flex items-start justify-between px-4 pt-4 pb-3"
            style={{
                borderBottom: "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            <div>
                <div className="mb-1 flex items-center gap-2">
                    <span className="text-[13px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        {node.id}
                    </span>
                    <span
                        className="rounded-[2px] px-[6px] py-[1px] text-[8.5px] font-semibold tracking-[0.14em]"
                        style={{
                            color: statusColor,
                            background: statusBg,
                            border: `1px solid ${statusBorder}`,
                        }}
                    >
                        {node.status}
                    </span>
                </div>
                <div className="text-[9px] tracking-[0.18em] text-[var(--color-hex-6f171b)]">
                    {node.type}
                </div>
            </div>
            <button
                onClick={onClose}
                className="cursor-pointer border-none bg-[transparent] p-[2px] text-[14px] leading-[1] text-[var(--color-hex-444444)] hover:text-[var(--color-hex-a0a0a0)]"
            >
                ✕
            </button>
        </div>
    );
}
