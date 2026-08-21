import React from "react";

export default function Stat({
    label,
    value,
    color,
}: {
    label: string;
    value: string;
    color: string;
}) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-[7.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                {label}
            </span>
            <span
                className="text-[10px] font-bold tracking-[0.06em]"
                style={{
                    color,
                }}
            >
                {value}
            </span>
        </div>
    );
}
