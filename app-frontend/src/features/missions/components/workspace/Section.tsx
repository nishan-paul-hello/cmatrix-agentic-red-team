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
            <div className="tracking-widest-2 mb-[8px] text-sm text-[var(--color-hex-444444)]">
                {label}
            </div>
            {children}
        </div>
    );
}
