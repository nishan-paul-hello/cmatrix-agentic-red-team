import React from "react";

export default function MetaRow({
    label,
    value,
    highlight,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div>
            <div className="mb-[1px] text-[8px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                {label}
            </div>
            <div
                className="text-[10px] tracking-[0.06em]"
                style={{
                    color: highlight ? "var(--color-hex-e31b23)" : "var(--color-hex-666666)",
                    wordBreak: "break-all",
                }}
            >
                {value}
            </div>
        </div>
    );
}
