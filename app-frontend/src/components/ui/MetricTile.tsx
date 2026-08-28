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
    valueColor = "var(--color-fg)",
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
                <span className="text-sm tracking-widest text-[var(--color-hex-444444)]">
                    {label}
                </span>
                <span className="tracking-tight-1 text-xl font-bold" style={{ color: valueColor }}>
                    {value}
                </span>
                {sub && (
                    <span className="tracking-tight-1 text-xl text-[var(--color-hex-333333)]">
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
                <div className="text-base-tight mb-[6px] tracking-widest text-[var(--color-hex-444444)]">
                    {label}
                </div>
                <div
                    className="text-12xl leading-none font-bold tracking-tighter"
                    style={{ color: valueColor }}
                >
                    {value}
                </div>
                {sub && (
                    <div className="mt-[2px] text-sm tracking-normal text-[var(--color-hex-333333)]">
                        {sub}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[16px] py-[10px]">
            <div className="text-sm-tight tracking-wider-3 mb-[4px] text-[var(--color-hex-444444)]">
                {label}
            </div>
            <div className="text-8xl font-bold" style={{ color: valueColor }}>
                {value}
            </div>
            {sub && (
                <div className="mt-[2px] text-sm tracking-normal text-[var(--color-hex-333333)]">
                    {sub}
                </div>
            )}
        </div>
    );
}
