import React from "react";

export function Section({
    label,
    children,
    last,
}: {
    label: string;
    children: React.ReactNode;
    last?: boolean;
}) {
    return (
        <div
            className="px-4 py-3"
            style={{
                borderBottom: last ? "none" : "1px solid var(--color-hex-141414)",
            }}
        >
            <div className="mb-[8px] text-[8px] tracking-[0.22em] text-[var(--color-hex-444444)]">
                {label}
            </div>
            {children}
        </div>
    );
}
