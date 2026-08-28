import React from "react";

import Divider from "@/features/missions/components/wizard/Divider";
import FieldBlock from "@/features/missions/components/wizard/FieldBlock";
import RadioGroup from "@/features/missions/components/wizard/RadioGroup";
import StepHeading from "@/features/missions/components/wizard/StepHeading";
import TextInput from "@/features/missions/components/wizard/TextInput";
import { useWizardContext } from "@/features/missions/components/wizard/WizardContext";
import { type TargetType } from "@/features/missions/data/fixtures/wizardMockData";

export function Step1() {
    const {
        target,
        setTarget,
        targetType,
        setTargetType,
        benchSuite,
        setBenchSuite,
        benchTaskId,
        setBenchTaskId,
    } = useWizardContext();
    return (
        <>
            <StepHeading step={1} label="TARGET" />
            <FieldBlock
                label="TARGET"
                hint="Enter a URL, hostname, or IP address / CIDR range to test."
                mb
            >
                <TextInput value={target} onChange={setTarget} />
            </FieldBlock>
            <Divider />
            <FieldBlock label="TARGET TYPE">
                <RadioGroup<TargetType>
                    value={targetType}
                    onChange={setTargetType}
                    options={[
                        {
                            value: "URL",
                            desc: "HTTP/HTTPS web application endpoint. Enables web-layer attack surface.",
                        },
                        {
                            value: "HOST",
                            desc: "Hostname or IP address / CIDR range. Enables network and multi-host surface.",
                        },
                        {
                            value: "BENCHMARK ENVIRONMENT",
                            desc: "Sandboxed benchmark target (CVE-Bench, PrediQL, MH-Bench). Oracle validation available.",
                        },
                    ]}
                />
            </FieldBlock>
            {/* F8: Benchmark sub-form — visible only when BENCHMARK ENVIRONMENT is selected */}
            {targetType === "BENCHMARK ENVIRONMENT" && (
                <div className="mt-[16px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[16px] py-[14px]">
                    <div className="mb-[12px] text-sm tracking-widest text-[var(--color-hex-444444)]">
                        BENCHMARK SUITE
                    </div>
                    <div
                        className="mb-[14px]"
                        style={{
                            display: "flex",
                            gap: 6,
                        }}
                    >
                        {["CVE-BENCH", "PREDIQL", "MHBENCH"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setBenchSuite(s)}
                                className="font-inherit cursor-pointer rounded-[2px] px-[12px] py-[4px] text-base tracking-wide"
                                style={{
                                    background:
                                        benchSuite === s
                                            ? "var(--color-hex-1a0608)"
                                            : "transparent",
                                    border: `1px solid ${benchSuite === s ? "var(--color-brand)" : "var(--color-hex-292929)"}`,
                                    color:
                                        benchSuite === s
                                            ? "var(--color-danger)"
                                            : "var(--color-hex-555555)",
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <div className="mb-[8px] text-sm tracking-widest text-[var(--color-hex-444444)]">
                        TASK / CVE ID
                    </div>
                    <input
                        value={benchTaskId}
                        onChange={(e) => setBenchTaskId(e.target.value)}
                        placeholder="e.g. CVE-2023-44487 or leave blank for full suite"
                        className="font-inherit box-border w-full rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-bg)] px-[10px] py-[7px] text-lg tracking-tighter text-[var(--color-hex-a0a0a0)] outline-none focus:border-[var(--color-brand)]"
                    />
                </div>
            )}
        </>
    );
}
