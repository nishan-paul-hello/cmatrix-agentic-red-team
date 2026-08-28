import { useState } from "react";

import { ABLATIONS, type AblationSpec } from "@/features/research/data/fixtures/researchMockData";

import { AblationLabDetailPanel } from "./AblationLabDetailPanel";
import { AblationLabTable } from "./AblationLabTable";

export default function AblationLab() {
    const [sel, setSel] = useState<AblationSpec>(ABLATIONS[0]);
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            {/* Left: 8-ablation list + selected table */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* A1-A8 selection buttons */}
                <div className="mb-[14px] flex flex-wrap gap-[6px]">
                    {ABLATIONS.map((abl) => {
                        const isSelected = sel.id === abl.id;
                        const isCORE = abl.category === "CORE";
                        return (
                            <button
                                key={abl.id}
                                onClick={() => setSel(abl)}
                                className="font-inherit text-base-tight cursor-pointer rounded-[2px] px-[10px] py-[4px] tracking-wide"
                                style={{
                                    background: (() => {
                                        if (isSelected) {
                                            return isCORE
                                                ? "var(--color-brand)"
                                                : "var(--color-hex-2a2a2a)";
                                        }
                                        return "transparent";
                                    })(),
                                    border: `1px solid ${(() => {
                                        if (isSelected) {
                                            return isCORE
                                                ? "var(--color-brand)"
                                                : "var(--color-hex-444444)";
                                        }
                                        return "var(--color-hex-1e1e1e)";
                                    })()}`,
                                    color: isSelected
                                        ? "var(--color-fg)"
                                        : "var(--color-hex-444444)",
                                }}
                            >
                                <span className="mr-[5px] font-bold">{abl.id}</span>
                                {/* CORE vs SECONDARY badge */}
                                <span
                                    className="tracking-wider-1 mr-[5px] text-xs"
                                    style={{
                                        color: (() => {
                                            if (isSelected) {
                                                return "var(--color-fg)";
                                            }
                                            return isCORE
                                                ? "var(--color-brand)"
                                                : "var(--color-hex-333333)";
                                        })(),
                                    }}
                                >
                                    {abl.category}
                                </span>
                                {abl.name}
                            </button>
                        );
                    })}
                </div>

                {/* Selected ablation description */}
                <div
                    className="mb-[14px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] px-[14px] py-[12px]"
                    style={{
                        background: "var(--color-hex-0d0d0d)",
                    }}
                >
                    <div className="mb-[4px] flex items-baseline gap-2">
                        <span className="tracking-wider-1 text-base font-bold text-[var(--color-fg)]">
                            {sel.id} — {sel.name}
                        </span>
                        <span
                            className="tracking-wider-1 rounded-[2px] px-[5px] py-[1px] text-xs font-semibold"
                            style={{
                                background:
                                    sel.category === "CORE"
                                        ? "var(--color-hex-1a0608)"
                                        : "var(--color-hex-1a1a1a)",
                                color:
                                    sel.category === "CORE"
                                        ? "var(--color-brand)"
                                        : "var(--color-hex-666666)",
                                border:
                                    sel.category === "CORE"
                                        ? "1px solid var(--color-hex-e31b2333)"
                                        : "1px solid var(--color-hex-222222)",
                            }}
                        >
                            {sel.category}
                        </span>
                    </div>
                    <div className="text-base-tight mb-[6px] leading-snug text-[var(--color-hex-555555)]">
                        {sel.description}
                    </div>
                    <div className="text-sm tracking-wide text-[var(--color-success)]">
                        CONTRIBUTION: {sel.contribution}
                    </div>
                    {sel.discriminatingNote && (
                        <div className="mt-[6px] text-sm leading-tight tracking-normal text-[var(--color-warning)]">
                            ◈ {sel.discriminatingNote}
                        </div>
                    )}
                </div>

                {/* Conditions table */}
                <AblationLabTable sel={sel} />
            </div>
            {/* Right: detail panel */}
            <AblationLabDetailPanel sel={sel} />
        </div>
    );
}
