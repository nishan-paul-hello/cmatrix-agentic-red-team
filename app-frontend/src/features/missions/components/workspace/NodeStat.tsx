import React from "react";

export function NodeStat({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-2xs tracking-wider-2 text-[var(--color-hex-333333)]">
                {label}
            </span>
            <span
                className="text-base font-bold tracking-tighter"
                style={{
                    color,
                }}
            >
                {value}
            </span>
        </div>
    );
}
