import React from "react";

import { sanitizeInput } from "@/utils/sanitize";

export function FieldRow({
    label,
    unit,
    value,
    onChange,
}: {
    label: string;
    unit?: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div
            className="mb-4 flex items-center justify-between"
            style={{
                borderBottom: "1px solid var(--color-hex-111111)",
                paddingBottom: 10,
            }}
        >
            <span className="text-[10px] tracking-[0.06em] text-[var(--color-hex-888888)]">
                {label}
            </span>
            <div className="flex items-center gap-2">
                <input
                    value={value}
                    onChange={(e) => onChange(sanitizeInput(e.target.value))}
                    className="font-inherit w-[72px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[8px] py-[5px] text-right text-[10px] text-[var(--color-hex-a0a0a0)] outline-none focus:border-[var(--color-hex-e31b23)]"
                />
                {unit && (
                    <span className="min-w-[52px] text-[8.5px] text-[var(--color-hex-444444)]">
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
}
