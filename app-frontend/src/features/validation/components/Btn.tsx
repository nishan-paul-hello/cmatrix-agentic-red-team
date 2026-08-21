import React from "react";

export default function Btn({
    onClick,
    label,
    red,
}: {
    onClick: () => void;
    label: string;
    red?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className="font-inherit cursor-pointer rounded-[2px] bg-[transparent] px-[12px] py-[4px] text-[9px] tracking-[0.14em]"
            style={{
                color: red ? "var(--color-hex-e31b23)" : "var(--color-hex-666666)",
                border: `1px solid ${red ? "var(--color-hex-6f171b)" : "var(--color-hex-292929)"}`,
            }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = red
                    ? "var(--color-hex-e31b23)"
                    : "var(--color-hex-444444)")
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = red
                    ? "var(--color-hex-6f171b)"
                    : "var(--color-hex-292929)")
            }
        >
            {label}
        </button>
    );
}
