import React from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Divider from "@/features/missions/components/wizard/Divider";
import FieldBlock from "@/features/missions/components/wizard/FieldBlock";
import StepHeading from "@/features/missions/components/wizard/StepHeading";
import { useWizardContext } from "@/features/missions/components/wizard/WizardContext";

export function Step2() {
    const { form } = useWizardContext();
    const costCeiling = form.watch("costCeiling");

    const costNum = parseFloat(costCeiling) || 0;
    return (
        <>
            <StepHeading step={2} label="RULES OF ENGAGEMENT" />

            <FieldBlock
                label="RULES OF ENGAGEMENT"
                hint="Define operational constraints. The system will halt immediately if any rule is violated."
                mb
            >
                <Textarea
                    rows={6}
                    spellCheck={false}
                    className="bg-card text-muted-foreground focus-visible:border-primary h-auto w-full resize-none rounded-sm px-3.5 py-2.5 text-xs leading-relaxed tracking-tighter shadow-none"
                />
            </FieldBlock>

            <Divider />

            {/* Numeric fields */}
            <div className="text-muted-foreground mb-4 text-xs font-semibold uppercase tracking-widest">
                OPERATIONAL LIMITS
            </div>

            <div className="border-border flex flex-col gap-0 overflow-hidden rounded-sm border-[1px] border-solid">
                {/* MAXIMUM RUNTIME */}
                <div className="bg-background border-border flex items-center justify-between border-b px-4 py-3.5">
                    <div>
                        <div className="text-muted-foreground mb-0.5 text-xs font-semibold tracking-widest">
                            MAXIMUM RUNTIME
                        </div>
                        <div className="text-muted-foreground text-xs tracking-normal">
                            Minutes allowed per vulnerability before the specialist is retired.
                        </div>
                    </div>
                    <div className="ml-6 flex flex-shrink-0 items-center gap-2">
                        <Input
                            type="number"

                            min={1}
                            max={120}
                            className="bg-muted text-foreground focus-visible:border-primary h-auto w-14 rounded-sm px-2 py-1.5 text-right text-sm font-semibold tracking-tighter shadow-none"
                        />
                        <span className="text-muted-foreground text-xs tracking-wide whitespace-nowrap">
                            min / vuln
                        </span>
                    </div>
                </div>

                {/* COST CEILING */}
                <div className="bg-background border-border flex items-center justify-between border-b px-4 py-3.5">
                    <div>
                        <div className="text-muted-foreground mb-0.5 text-xs font-semibold tracking-widest">
                            COST CEILING
                        </div>
                        <div className="text-muted-foreground text-xs tracking-normal">
                            Maximum total LLM spend before human escalation is triggered.
                        </div>
                    </div>
                    <div className="ml-6 flex flex-shrink-0 items-center gap-2">
                        <span className="text-muted-foreground text-xs">$</span>
                        <Input
                            type="number"

                            min={0.5}
                            step={0.5}
                            className="bg-muted text-foreground focus-visible:border-primary h-auto w-16 rounded-sm px-2 py-1.5 text-right text-sm font-semibold tracking-tighter shadow-none"
                        />
                    </div>
                </div>

                {/* TOOL TIMEOUT */}
                <div className="bg-background flex items-center justify-between px-4 py-3.5">
                    <div>
                        <div className="text-muted-foreground mb-0.5 text-xs font-semibold tracking-widest">
                            TOOL TIMEOUT
                        </div>
                        <div className="text-muted-foreground text-xs tracking-normal">
                            Maximum wall-clock seconds a single tool invocation may run.
                        </div>
                    </div>
                    <div className="ml-6 flex flex-shrink-0 items-center gap-2">
                        <Input
                            type="number"

                            min={10}
                            max={600}
                            step={10}
                            className="bg-muted text-foreground focus-visible:border-primary h-auto w-14 rounded-sm px-2 py-1.5 text-right text-sm font-semibold tracking-tighter shadow-none"
                        />
                        <span className="text-muted-foreground text-xs tracking-wide">sec</span>
                    </div>
                </div>

                {/* F9: MAX RETRIES field */}
                <div className="bg-background border-border flex items-center justify-between border-t px-4 py-3.5">
                    <div>
                        <div className="text-muted-foreground mb-0.5 text-xs font-semibold tracking-widest">
                            MAX RETRIES
                        </div>
                        <div className="text-muted-foreground text-xs tracking-normal">
                            Maximum retry attempts per VDG node before it is deprioritized.
                        </div>
                    </div>
                    <div className="ml-6 flex flex-shrink-0 items-center gap-2">
                        <Input
                            type="number"
                            defaultValue="3"
                            min={1}
                            max={10}
                            className="bg-muted text-foreground focus-visible:border-primary h-auto w-14 rounded-sm px-2 py-1.5 text-right text-sm font-semibold tracking-tighter shadow-none"
                        />
                        <span className="text-muted-foreground text-xs tracking-wide">
                            attempts
                        </span>
                    </div>
                </div>
            </div>

            {/* Warning callout when cost is high */}
            {costNum > 50 && (
                <div className="border-warning bg-muted mt-4 flex items-start gap-3 rounded-sm border-[1px] border-solid px-3.5 py-2.5">
                    <span className="text-warning shrink-0 text-xs">⚠</span>
                    <span className="text-warning text-xs leading-normal tracking-tight">
                        Cost ceiling above $50 — human escalation will only trigger at high spend.
                        Ensure this is intentional.
                    </span>
                </div>
            )}
        </>
    );
}
