import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AblationLabDetailPanel } from "@/features/research/components/AblationLabDetailPanel";
import { AblationLabTable } from "@/features/research/components/AblationLabTable";
import { ABLATIONS, type AblationSpec } from "@/features/research/data/fixtures/researchMockData";

export default function AblationLab() {
    const [sel, setSel] = useState<AblationSpec>(ABLATIONS[0]);
    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
            {/* Left: 8-ablation list + selected table */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* A1-A8 selection buttons */}
                <div className="mb-3.5 flex flex-wrap gap-1.5">
                    {ABLATIONS.map((abl) => {
                        const isSelected = sel.id === abl.id;
                        const isCORE = abl.category === "CORE";
                        let btnClass = "border-border text-muted-foreground bg-transparent";
                        if (isSelected) {
                            btnClass = isCORE
                                ? "bg-primary border-primary text-foreground"
                                : "bg-border border-muted-foreground text-foreground";
                        }
                        let textClass = "text-border";
                        if (isSelected) {
                            textClass = "text-foreground";
                        } else if (isCORE) {
                            textClass = "text-primary";
                        }

                        return (
                            <Button
                                key={abl.id}
                                variant="outline"
                                onClick={() => setSel(abl)}
                                className={`h-auto rounded-sm border border-solid px-2.5 py-1 text-sm tracking-wide ${btnClass} cursor-pointer`}
                            >
                                <span className="mr-1 font-bold">{abl.id}</span>
                                {/* CORE vs SECONDARY badge */}
                                <span className={`mr-1 text-xs tracking-widest ${textClass}`}>
                                    {abl.category}
                                </span>
                                {abl.name}
                            </Button>
                        );
                    })}
                </div>

                {/* Selected ablation description */}
                <div className="bg-background border-border mb-3.5 rounded-sm border-[1px] border-solid px-3.5 py-3">
                    <div className="mb-1 flex items-baseline gap-2">
                        <span className="text-foreground text-base font-bold tracking-widest">
                            {sel.id} — {sel.name}
                        </span>
                        <span
                            className={`bg-border border-border rounded-sm border border-solid px-1 py-px text-xs font-semibold tracking-widest ${sel.category === "CORE" ? "text-primary" : "text-muted-foreground"}`}
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
