import React from "react";

export interface MetricTileProps {
    label: string;
    value: string | React.ReactNode;
    valueColor?: string;
    variant?: "dashboard" | "card" | "inline";
    borderRight?: boolean;
    sub?: string;
}

export function MetricTile({
    label,
    value,
    valueColor = "var(--color-hex-f2f2f2)",
    variant = "card",
    borderRight = false,
    sub,
}: MetricTileProps) {
    if (variant === "inline") {
        return (
            <div
                className="flex items-center gap-2 px-4 py-1.5"
                style={{
                    borderRight: borderRight ? "1px solid var(--color-hex-151515)" : "none",
                }}
            >
                <span className="text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                    {label}
                </span>
                <span
                    className="text-[11px] font-bold tracking-[0.06em]"
                    style={{ color: valueColor }}
                >
                    {value}
                </span>
                {sub && (
                    <span className="text-[11px] tracking-[0.06em] text-[var(--color-hex-333333)]">
                        {sub}
                    </span>
                )}
            </div>
        );
    }

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
                {sub && (
                    <div className="mt-[2px] text-[8px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                        {sub}
                    </div>
                )}
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
            {sub && (
                <div className="mt-[2px] text-[8px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                    {sub}
                </div>
            )}
        </div>
    );
}
