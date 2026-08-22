import React from "react";

import { Toggle } from "./Toggle";

export function ToggleRow({ label, on }: { label: string; on: boolean }) {
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
            <Toggle on={on} />
        </div>
    );
}
