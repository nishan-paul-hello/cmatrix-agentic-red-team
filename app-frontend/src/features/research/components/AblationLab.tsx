import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ABLATIONS, type AblationSpec } from "@/features/research/data/fixtures/researchMockData";

import { AblationLabDetailPanel } from "./AblationLabDetailPanel";
import { AblationLabTable } from "./AblationLabTable";

export default function AblationLab() {
    const [sel, setSel] = useState<AblationSpec>(ABLATIONS[0]);
    return (
        <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Left: 8-ablation list + selected table */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* A1-A8 selection buttons */}
                <div className="mb-3.5 flex flex-wrap gap-1.5">
                    {ABLATIONS.map((abl) => {
                        const isSelected = sel.id === abl.id;
                        const isCORE = abl.category === "CORE";
                        return (
                            <Button
                                key={abl.id}
                                variant="outline"
                                onClick={() => setSel(abl)}
                                className="h-auto rounded-sm px-2.5 py-1 text-sm tracking-wide"
                                style={{
                                    background: (() => {
                                        if (isSelected) {
                                            return isCORE ? "var(--primary)" : "var(--border)";
                                        }
                                        return "transparent";
                                    })(),
                                    border: `1px solid ${(() => {
                                        if (isSelected) {
                                            return isCORE
                                                ? "var(--primary)"
                                                : "var(--muted-foreground)";
                                        }
                                        return "var(--border)";
                                    })()}`,
                                    color: isSelected
                                        ? "var(--foreground)"
                                        : "var(--muted-foreground)",
                                }}
                            >
                                <span className="mr-1 font-bold">{abl.id}</span>
                                {/* CORE vs SECONDARY badge */}
                                <span
                                    className="mr-1 text-xs tracking-widest"
                                    style={{
                                        color: (() => {
                                            if (isSelected) {
                                                return "var(--foreground)";
                                            }
                                            return isCORE ? "var(--primary)" : "var(--border)";
                                        })(),
                                    }}
                                >
                                    {abl.category}
                                </span>
                                {abl.name}
                            </Button>
                        );
                    })}
                </div>

                {/* Selected ablation description */}
                <div
                    className="border-border mb-3.5 rounded-sm border-[1px] border-solid px-3.5 py-3"
                    style={{
                        background: "var(--background)",
                    }}
                >
                    <div className="mb-1 flex items-baseline gap-2">
                        <span className="text-foreground text-base font-bold tracking-widest">
                            {sel.id} — {sel.name}
                        </span>
                        <span
                            className="rounded-sm px-1 py-px text-xs font-semibold tracking-widest"
                            style={{
                                background:
                                    sel.category === "CORE" ? "var(--border)" : "var(--border)",
                                color:
                                    sel.category === "CORE"
                                        ? "var(--primary)"
                                        : "var(--muted-foreground)",
                                border:
                                    sel.category === "CORE"
                                        ? "1px solid var(--border)"
                                        : "1px solid var(--border)",
                            }}
                        >
                            {sel.category}
                        </span>
                    </div>
                    <div className="text-muted-foreground mb-1.5 text-sm leading-snug">
                        {sel.description}
                    </div>
                    <div className="text-success text-sm tracking-wide">
                        CONTRIBUTION: {sel.contribution}
                    </div>
                    {sel.discriminatingNote && (
                        <div className="text-warning mt-1.5 text-sm leading-tight tracking-normal">
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
