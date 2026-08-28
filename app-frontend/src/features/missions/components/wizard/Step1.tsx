import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Divider from "@/features/missions/components/wizard/Divider";
import FieldBlock from "@/features/missions/components/wizard/FieldBlock";
import RadioGroup from "@/features/missions/components/wizard/RadioGroup";
import StepHeading from "@/features/missions/components/wizard/StepHeading";
import TextInput from "@/features/missions/components/wizard/TextInput";
import { useWizardContext } from "@/features/missions/components/wizard/WizardContext";
import { type TargetType } from "@/features/missions/data/fixtures/wizardMockData";

export function Step1() {
    const { form } = useWizardContext();
    const targetType = form.watch("targetType");
    const benchSuite = form.watch("benchSuite");
    const benchTaskId = form.watch("benchTaskId");
    const setBenchSuite = (val: string) => form.setValue("benchSuite", val);
    const setBenchTaskId = (val: string) => form.setValue("benchTaskId", val);
    return (
        <>
            <StepHeading step={1} label="TARGET" />
            <FieldBlock
                label="TARGET"
                hint="Enter a URL, hostname, or IP address / CIDR range to test."
                mb
                name="target"
            >
                <TextInput />
            </FieldBlock>
            <Divider />
            <FieldBlock label="TARGET TYPE" name="targetType">
                <RadioGroup<TargetType>
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
                <div className="border-border bg-background mt-4 rounded-sm border-[1px] border-solid px-4 py-3.5">
                    <div className="text-muted-foreground mb-3 text-sm tracking-widest">
                        BENCHMARK SUITE
                    </div>
                    <div
                        className="mb-3.5"
                        style={{
                            display: "flex",
                            gap: 6,
                        }}
                    >
                        {["CVE-BENCH", "PREDIQL", "MHBENCH"].map((s) => (
                            <Button
                                key={s}
                                variant="outline"
                                onClick={() => setBenchSuite(s)}
                                className="h-auto rounded-sm px-3 py-1 text-base tracking-wide"
                                style={{
                                    background: benchSuite === s ? "var(--border)" : "transparent",
                                    border: `1px solid ${benchSuite === s ? "var(--primary)" : "var(--border)"}`,
                                    color:
                                        benchSuite === s
                                            ? "var(--destructive)"
                                            : "var(--muted-foreground)",
                                }}
                            >
                                {s}
                            </Button>
                        ))}
                    </div>
                    <div className="text-muted-foreground mb-2 text-sm tracking-widest">
                        TASK / CVE ID
                    </div>
                    <Input
                        value={benchTaskId}
                        onChange={(e) => setBenchTaskId(e.target.value)}
                        placeholder="e.g. CVE-2023-44487 or leave blank for full suite"
                        className="bg-background text-muted-foreground focus-visible:border-primary h-auto w-full rounded-sm px-2.5 py-1.5 text-xs tracking-tighter shadow-none"
                    />
                </div>
            )}
        </>
    );
}
