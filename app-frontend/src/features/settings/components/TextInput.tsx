import React, { useState } from "react";

import { sanitizeInput } from "@/utils/sanitize";

export function TextInput({ value, placeholder }: { value: string; placeholder?: string }) {
    const [v, setV] = useState(value);
    return (
        <input
            value={v}
            onChange={(e) => setV(sanitizeInput(e.target.value))}
            placeholder={placeholder}
            className="font-inherit w-full rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[12px] py-[7px] text-[10px] tracking-[0.04em] text-[var(--color-hex-a0a0a0)] outline-none"
            style={{
                boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-hex-e31b23)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-hex-1e1e1e)")}
        />
    );
}
