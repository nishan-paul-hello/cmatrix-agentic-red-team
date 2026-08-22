import React from "react";

import { sanitizeInput } from "@/utils/sanitize";

const MODEL_OPTIONS = ["claude-opus-5", "claude-sonnet-5", "claude-haiku-4-5"];

export function ModelSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(sanitizeInput(e.target.value))}
            className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[12px] py-[7px] text-[10px] text-[var(--color-hex-a0a0a0)] outline-none"
        >
            {MODEL_OPTIONS.map((m) => (
                <option key={m} value={m}>
                    {m}
                </option>
            ))}
        </select>
    );
}
