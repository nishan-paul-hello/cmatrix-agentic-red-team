import React from "react";

export function Chips({
    options,
    value,
    onChange,
}: {
    options: string[];
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((o) => (
                <button
                    key={o}
                    onClick={() => onChange(o)}
                    className="font-inherit cursor-pointer rounded-[2px] px-[12px] py-[4px] text-[9px] tracking-[0.12em]"
                    style={{
                        background: value === o ? "var(--color-hex-1a0608)" : "transparent",
                        border: `1px solid ${value === o ? "var(--color-hex-e31b23)" : "var(--color-hex-292929)"}`,
                        color: value === o ? "var(--color-hex-ff2a32)" : "var(--color-hex-555555)",
                    }}
                >
                    {o}
                </button>
            ))}
        </div>
    );
}
