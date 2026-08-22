import React from "react";

export function NodeStat({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-[6.5px] tracking-[0.16em] text-[var(--color-hex-333333)]">
                {label}
            </span>
            <span
                className="text-[9px] font-bold tracking-[0.04em]"
                style={{
                    color,
                }}
            >
                {value}
            </span>
        </div>
    );
}
