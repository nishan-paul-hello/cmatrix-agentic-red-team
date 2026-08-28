import React from "react";

export function KPI({ label, value, red }: { label: string; value: string; red?: boolean }) {
    return (
        <div className="flex flex-col items-end">
            <div className="text-sm-tight tracking-wider-3 mb-[2px] text-[var(--color-hex-444444)]">
                {label}
            </div>
            <div
                className="text-4xl font-bold"
                style={{
                    color: red ? "var(--color-brand)" : "var(--color-fg)",
                }}
            >
                {value}
            </div>
        </div>
    );
}
