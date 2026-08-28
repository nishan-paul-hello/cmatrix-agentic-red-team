import React from "react";

import { EORD_LABELS } from "@/lib/constants";

export function EOrdIndicator({ value }: { value: number }) {
    return (
        <div>
            <div
                className="relative flex items-end justify-between"
                style={{
                    paddingBottom: 20,
                }}
            >
                {/* track */}
                <div className="bg-muted absolute top-1.5 right-1 left-1 h-px" />
                {/* filled */}
                <div
                    className="bg-primary absolute top-1.5 left-1 h-px"
                    style={{
                        width: `${(value / 5) * 92}%`,
                    }}
                />
                {EORD_LABELS.map((lbl, i) => (
                    <div
                        key={lbl}
                        className="flex flex-col items-center"
                        style={{
                            zIndex: 1,
                        }}
                    >
                        <div
                            className="mb-0.5 h-1.5 w-1.5 rounded-none"
                            style={{
                                border: `1px solid ${i <= value ? "var(--primary)" : "var(--border)"}`,
                                background: (() => {
                                    if (i < value) {
                                        return "var(--primary)";
                                    }
                                    if (i === value) {
                                        return "var(--destructive)";
                                    }
                                    return "transparent";
                                })(),
                            }}
                        />
                        {i === value && (
                            <div
                                className="absolute top-2.5 h-0 w-0"
                                style={{
                                    borderLeft: "4px solid transparent",
                                    borderRight: "4px solid transparent",
                                    borderTop: "5px solid var(--destructive)",
                                }}
                            />
                        )}
                        <span
                            className="mt-3.5 text-xs tracking-normal whitespace-nowrap"
                            style={{
                                color: i === value ? "var(--primary)" : "var(--border)",
                            }}
                        >
                            {lbl}
                        </span>
                    </div>
                ))}
            </div>
            <div className="text-muted-foreground mt-1 text-sm tracking-normal">
                Current:{" "}
                <span className="text-primary">
                    E_ord {value} — {EORD_LABELS[value]}
                </span>
            </div>
        </div>
    );
}
