import React from "react";

import Divider from "@/features/missions/components/wizard/Divider";
import FieldBlock from "@/features/missions/components/wizard/FieldBlock";
import StepHeading from "@/features/missions/components/wizard/StepHeading";
import { useWizardContext } from "@/features/missions/components/wizard/WizardContext";

export function Step2() {
    const {
        roe,
        setRoe,
        maxRuntime,
        setMaxRuntime,
        costCeiling,
        setCostCeiling,
        toolTimeout,
        setToolTimeout,
    } = useWizardContext();
    const costNum = parseFloat(costCeiling) || 0;
    return (
        <>
            <StepHeading step={2} label="RULES OF ENGAGEMENT" />

            <FieldBlock
                label="RULES OF ENGAGEMENT"
                hint="Define operational constraints. The system will halt immediately if any rule is violated."
                mb
            >
                <textarea
                    value={roe}
                    onChange={(e) => setRoe(e.target.value)}
                    rows={6}
                    spellCheck={false}
                    className="font-inherit w-full resize-none rounded-[2px] border-[1px] border-solid border-[var(--color-hex-333333)] bg-[var(--color-hex-111111)] px-[14px] py-[10px] text-[11px] leading-[1.7] tracking-[0.03em] text-[var(--color-hex-a0a0a0)] outline-none focus:border-[var(--color-hex-e31b23)]"
                />
            </FieldBlock>

            <Divider />

            {/* Numeric fields */}
            <div className="mb-[16px] text-[9.5px] tracking-[0.2em] text-[var(--color-hex-666666)]">
                OPERATIONAL LIMITS
            </div>

            <div className="flex flex-col gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)]">
                {/* MAXIMUM RUNTIME */}
                <div
                    className="flex items-center justify-between bg-[var(--color-hex-0d0d0d)] px-[16px] py-[14px]"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <div>
                        <div className="mb-[3px] text-[10px] font-semibold tracking-[0.16em] text-[var(--color-hex-a0a0a0)]">
                            MAXIMUM RUNTIME
                        </div>
                        <div className="text-[9px] tracking-[0.1em] text-[var(--color-hex-444444)]">
                            Minutes allowed per vulnerability before the specialist is retired.
                        </div>
                    </div>
                    <div className="ml-6 flex flex-shrink-0 items-center gap-2">
                        <input
                            type="number"
                            value={maxRuntime}
                            onChange={(e) => setMaxRuntime(e.target.value)}
                            min={1}
                            max={120}
                            className="font-inherit w-[56px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-333333)] bg-[var(--color-hex-151515)] px-[8px] py-[6px] text-right text-[13px] font-semibold tracking-[0.04em] text-[var(--color-hex-f2f2f2)] outline-none focus:border-[var(--color-hex-e31b23)]"
                        />
                        <span className="text-[9.5px] tracking-[0.12em] whitespace-nowrap text-[var(--color-hex-444444)]">
                            min / vuln
                        </span>
                    </div>
                </div>

                {/* COST CEILING */}
                <div
                    className="flex items-center justify-between bg-[var(--color-hex-0d0d0d)] px-[16px] py-[14px]"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <div>
                        <div className="mb-[3px] text-[10px] font-semibold tracking-[0.16em] text-[var(--color-hex-a0a0a0)]">
                            COST CEILING
                        </div>
                        <div className="text-[9px] tracking-[0.1em] text-[var(--color-hex-444444)]">
                            Maximum total LLM spend before human escalation is triggered.
                        </div>
                    </div>
                    <div className="ml-6 flex flex-shrink-0 items-center gap-2">
                        <span className="text-[12px] text-[var(--color-hex-666666)]">$</span>
                        <input
                            type="number"
                            value={costCeiling}
                            onChange={(e) => setCostCeiling(e.target.value)}
                            min={0.5}
                            step={0.5}
                            className="font-inherit w-[64px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-333333)] bg-[var(--color-hex-151515)] px-[8px] py-[6px] text-right text-[13px] font-semibold tracking-[0.04em] text-[var(--color-hex-f2f2f2)] outline-none focus:border-[var(--color-hex-e31b23)]"
                        />
                    </div>
                </div>

                {/* TOOL TIMEOUT */}
                <div className="flex items-center justify-between bg-[var(--color-hex-0d0d0d)] px-[16px] py-[14px]">
                    <div>
                        <div className="mb-[3px] text-[10px] font-semibold tracking-[0.16em] text-[var(--color-hex-a0a0a0)]">
                            TOOL TIMEOUT
                        </div>
                        <div className="text-[9px] tracking-[0.1em] text-[var(--color-hex-444444)]">
                            Maximum wall-clock seconds a single tool invocation may run.
                        </div>
                    </div>
                    <div className="ml-6 flex flex-shrink-0 items-center gap-2">
                        <input
                            type="number"
                            value={toolTimeout}
                            onChange={(e) => setToolTimeout(e.target.value)}
                            min={10}
                            max={600}
                            step={10}
                            className="font-inherit w-[56px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-333333)] bg-[var(--color-hex-151515)] px-[8px] py-[6px] text-right text-[13px] font-semibold tracking-[0.04em] text-[var(--color-hex-f2f2f2)] outline-none focus:border-[var(--color-hex-e31b23)]"
                        />
                        <span className="text-[9.5px] tracking-[0.12em] text-[var(--color-hex-444444)]">
                            sec
                        </span>
                    </div>
                </div>

                {/* F9: MAX RETRIES field */}
                <div
                    className="flex items-center justify-between bg-[var(--color-hex-0d0d0d)] px-[16px] py-[14px]"
                    style={{
                        borderTop: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <div>
                        <div className="mb-[3px] text-[10px] font-semibold tracking-[0.16em] text-[var(--color-hex-a0a0a0)]">
                            MAX RETRIES
                        </div>
                        <div className="text-[9px] tracking-[0.1em] text-[var(--color-hex-444444)]">
                            Maximum retry attempts per VDG node before it is deprioritized.
                        </div>
                    </div>
                    <div className="ml-6 flex flex-shrink-0 items-center gap-2">
                        <input
                            type="number"
                            defaultValue="3"
                            min={1}
                            max={10}
                            className="font-inherit w-[56px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-333333)] bg-[var(--color-hex-151515)] px-[8px] py-[6px] text-right text-[13px] font-semibold tracking-[0.04em] text-[var(--color-hex-f2f2f2)] outline-none focus:border-[var(--color-hex-e31b23)]"
                        />
                        <span className="text-[9.5px] tracking-[0.12em] text-[var(--color-hex-444444)]">
                            attempts
                        </span>
                    </div>
                </div>
            </div>

            {/* Warning callout when cost is high */}
            {costNum > 50 && (
                <div className="mt-4 flex items-start gap-3 rounded-[2px] border-[1px] border-solid border-[var(--color-hex-d29922)] bg-[var(--color-hex-120f00)] px-[14px] py-[10px]">
                    <span className="shrink-0 text-[11px] text-[var(--color-hex-d29922)]">⚠</span>
                    <span className="text-[9.5px] leading-[1.6] tracking-[0.08em] text-[var(--color-hex-d29922)]">
                        Cost ceiling above $50 — human escalation will only trigger at high spend.
                        Ensure this is intentional.
                    </span>
                </div>
            )}
        </>
    );
}
