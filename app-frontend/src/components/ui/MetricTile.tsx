import React from "react";

export interface MetricTileProps {
    label: string;
    value: string | React.ReactNode;
    valueColor?: string;
    variant?: "dashboard" | "card";
    borderRight?: boolean;
}

export function MetricTile({
    label,
    value,
    valueColor = "var(--color-hex-f2f2f2)",
    variant = "card",
    borderRight = false,
}: MetricTileProps) {
    if (variant === "dashboard") {
        return (
            <div
                className="flex flex-col justify-center bg-[var(--color-hex-0d0d0d)] px-5 py-4"
                style={{
                    borderRight: borderRight ? "1px solid var(--color-hex-1e1e1e)" : "none",
                }}
            >
                <div className="mb-[6px] text-[8.5px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                    {label}
                </div>
                <div
                    className="text-[26px] leading-none font-bold tracking-[0.04em]"
                    style={{ color: valueColor }}
                >
                    {value}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[16px] py-[10px]">
            <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                {label}
            </div>
            <div className="text-[18px] font-bold" style={{ color: valueColor }}>
                {value}
            </div>
        </div>
    );
}
