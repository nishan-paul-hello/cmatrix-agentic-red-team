import React from "react";

import { EORD_LABELS } from "@/lib/constants";

export function EOrdIndicator({ value, caption }: { value: number; caption?: React.ReactNode }) {
    return (
        <div>
            <div className="relative flex items-end justify-between pb-5">
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
                    <div key={lbl} className="z-node-base flex flex-col items-center">
                        <div
                            className={`mb-0.5 h-1.5 w-1.5 rounded-none border border-solid ${i <= value ? "border-primary" : "border-border"} ${(() => {
                                if (i < value) {
                                    return "bg-primary";
                                }
                                if (i === value) {
                                    return "bg-destructive";
                                }
                                return "bg-transparent";
                            })()}`}
                        />
                        {i === value && (
                            <div className="border-t-destructive absolute top-2.5 h-0 w-0 border-x-[4px] border-t-[5px] border-x-transparent" />
                        )}
                        <span
                            className={`mt-3.5 text-xs tracking-normal whitespace-nowrap ${i === value ? "text-primary" : "text-border"}`}
                        >
                            {lbl}
                        </span>
                    </div>
                ))}
            </div>
            {caption !== undefined ? (
                caption
            ) : (
                <div className="text-muted-foreground mt-1 text-sm tracking-normal">
                    Current:{" "}
                    <span className="text-primary">
                        E_ord {value} - {EORD_LABELS[value]}
                    </span>
                </div>
            )}
        </div>
    );
}
