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
                <div className="absolute top-[6px] right-[4px] left-[4px] h-[1px] bg-[var(--color-hex-292929)]" />
                {/* filled */}
                <div
                    className="absolute top-[6px] left-[4px] h-[1px] bg-[var(--color-brand)]"
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
                            className="mb-[2px] h-[6px] w-[6px] rounded-[1px]"
                            style={{
                                border: `1px solid ${i <= value ? "var(--color-brand)" : "var(--color-hex-292929)"}`,
                                background: (() => {
                                    if (i < value) {
                                        return "var(--color-brand)";
                                    }
                                    if (i === value) {
                                        return "var(--color-danger)";
                                    }
                                    return "transparent";
                                })(),
                            }}
                        />
                        {i === value && (
                            <div
                                className="absolute top-[10px] h-[0px] w-[0px]"
                                style={{
                                    borderLeft: "4px solid transparent",
                                    borderRight: "4px solid transparent",
                                    borderTop: "5px solid var(--color-danger)",
                                }}
                            />
                        )}
                        <span
                            className="text-2xs mt-[14px] tracking-normal whitespace-nowrap"
                            style={{
                                color:
                                    i === value ? "var(--color-brand)" : "var(--color-hex-333333)",
                            }}
                        >
                            {lbl}
                        </span>
                    </div>
                ))}
            </div>
            <div className="text-base-tight mt-[4px] tracking-normal text-[var(--color-hex-666666)]">
                Current:{" "}
                <span className="text-[var(--color-brand)]">
                    E_ord {value} — {EORD_LABELS[value]}
                </span>
            </div>
        </div>
    );
}
