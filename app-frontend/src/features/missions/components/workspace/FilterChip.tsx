import React from "react";

export function FilterChip({
    label,
    active,
    onClick,
    red,
    dim,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
    red?: boolean;
    dim?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className="font-inherit text-base-tight cursor-pointer rounded-[2px] px-[7px] py-[2px] tracking-wide"
            style={{
                color: (() => {
                    if (active && red) {
                        return "var(--color-danger)";
                    }
                    if (active) {
                        return "var(--color-fg)";
                    }
                    if (dim) {
                        return "var(--color-hex-383838)";
                    }
                    return "var(--color-hex-555555)";
                })(),
                background: (() => {
                    if (active && red) {
                        return "var(--color-hex-1a0608)";
                    }
                    if (active) {
                        return "var(--color-hex-191919)";
                    }
                    return "transparent";
                })(),
                border: `1px solid ${(() => {
                    if (active && red) {
                        return "var(--color-hex-6f171b)";
                    }
                    if (active) {
                        return "var(--color-hex-333333)";
                    }
                    return "var(--color-hex-1e1e1e)";
                })()}`,
                whiteSpace: "nowrap" as const,
            }}
            onMouseEnter={(e) => {
                if (!active) {
                    e.currentTarget.style.color = "var(--color-hex-888888)";
                }
            }}
            onMouseLeave={(e) => {
                if (!active) {
                    e.currentTarget.style.color = dim
                        ? "var(--color-hex-383838)"
                        : "var(--color-hex-555555)";
                }
            }}
        >
            {label}
        </button>
    );
}
