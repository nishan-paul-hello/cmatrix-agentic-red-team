import { useState } from "react";
const STEPS = [
    {
        index: 1,
        id: "target",
        label: "TARGET",
    },
    {
        index: 2,
        id: "roe",
        label: "RULES OF ENGAGEMENT",
    },
    {
        index: 3,
        id: "surface",
        label: "ATTACK SURFACE",
    },
    {
        index: 4,
        id: "mode",
        label: "MISSION MODE",
    },
    {
        index: 5,
        id: "review",
        label: "REVIEW",
    },
];
type TargetType = "URL" | "HOST" | "BENCHMARK ENVIRONMENT";
type SurfaceType = "WEB APPLICATION" | "GRAPHQL" | "MULTI-HOST";
type ModeType = "ONE-DAY" | "ZERO-DAY";
interface WizardProps {
    onCancel: () => void;
    onStart?: () => void;
    initialStep?: number;
}
export default function NewMissionWizard({ onCancel, onStart, initialStep }: WizardProps) {
    const [step, setStep] = useState(initialStep ?? 1);

    // Step 1 state
    const [target, setTarget] = useState("https://app.targetcorp.com");
    const [targetType, setTargetType] = useState<TargetType>("URL");

    // Step 3 state
    const [surface, setSurface] = useState<SurfaceType>("WEB APPLICATION");

    // Step 4 state
    const [mode, setMode] = useState<ModeType>("ONE-DAY");

    // Benchmark sub-form state (F8)
    const [benchSuite, setBenchSuite] = useState("CVE-BENCH");
    const [benchTaskId, setBenchTaskId] = useState("");

    // Step 2 state
    const [roe, setRoe] = useState(
        "Do not access, modify, or exfiltrate data beyond what is necessary to demonstrate the vulnerability. Avoid persistent modifications to the target environment. All exploitation attempts must be reversible. Do not pivot to out-of-scope hosts. Cease all activity immediately upon cost ceiling or runtime threshold breach.",
    );
    const [maxRuntime, setMaxRuntime] = useState("10");
    const [costCeiling, setCostCeiling] = useState("10.00");
    const [toolTimeout, setToolTimeout] = useState("120");
    const costNum = parseFloat(costCeiling) || 0;
    const runtimeNum = parseInt(maxRuntime) || 0;
    const timeoutNum = parseInt(toolTimeout) || 0;
    function runtimeLabel() {
        if (!runtimeNum) return "—";
        return `${runtimeNum} min / vulnerability`;
    }
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            {/* Page header */}
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    MISSIONS
                </div>
                <div className="flex items-baseline gap-3">
                    <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        NEW MISSION
                    </h1>
                    <span className="text-[10px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                        MISSION CONFIGURATION WIZARD
                    </span>
                </div>
            </div>

            {/* Step indicator */}
            <div
                className="flex-shrink-0 bg-[var(--color-hex-0b0b0b)] px-6 py-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="flex items-center">
                    {STEPS.map((s, i) => {
                        const active = s.index === step;
                        const done = s.index < step;
                        return (
                            <div key={s.id} className="flex items-center">
                                {i > 0 && (
                                    <div
                                        className="h-[1px] w-[40px] shrink-0"
                                        style={{
                                            background: done
                                                ? "var(--color-hex-e31b23)"
                                                : "var(--color-hex-292929)",
                                        }}
                                    />
                                )}
                                {done ? (
                                    <button
                                        onClick={() => setStep(s.index)}
                                        title={`Go back to Step ${s.index}`}
                                        className="font-inherit cursor-pointer border-none bg-[none] p-[0px]"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: 6,
                                        }}
                                    >
                                        <div
                                            className="h-[26px] w-[26px] shrink-0 border-[1px] border-solid border-[var(--color-hex-9e1118)] bg-[var(--color-hex-120608)] text-[10px] font-bold tracking-[0.06em] text-[var(--color-hex-9e1118)]"
                                            style={{
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            ✓
                                        </div>
                                        <span className="text-[7.5px] tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-6f171b)]">
                                            {s.label}
                                        </span>
                                    </button>
                                ) : (
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div
                                            className="h-[26px] w-[26px] shrink-0 text-[10px] font-bold tracking-[0.06em]"
                                            style={{
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                border: active
                                                    ? "1px solid var(--color-hex-e31b23)"
                                                    : "1px solid var(--color-hex-292929)",
                                                background: active
                                                    ? "var(--color-hex-1a0a0b)"
                                                    : "var(--color-hex-111111)",
                                                color: active
                                                    ? "var(--color-hex-ff2a32)"
                                                    : "var(--color-hex-444444)",
                                            }}
                                        >
                                            {s.index}
                                        </div>
                                        <span
                                            className="text-[7.5px] tracking-[0.16em] whitespace-nowrap"
                                            style={{
                                                color: active
                                                    ? "var(--color-hex-a0a0a0)"
                                                    : "var(--color-hex-333333)",
                                            }}
                                        >
                                            {s.label}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Body */}
            <div className="flex min-h-[0px] flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-8">
                    <div className="max-w-[600px]">
                        {/* ── STEP 1: TARGET ── */}
                        {step === 1 && (
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
                                        <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
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
                                                    className="font-inherit cursor-pointer rounded-[2px] px-[12px] py-[4px] text-[9px] tracking-[0.12em]"
                                                    style={{
                                                        background:
                                                            benchSuite === s
                                                                ? "var(--color-hex-1a0608)"
                                                                : "transparent",
                                                        border: `1px solid ${benchSuite === s ? "var(--color-hex-e31b23)" : "var(--color-hex-292929)"}`,
                                                        color:
                                                            benchSuite === s
                                                                ? "var(--color-hex-ff2a32)"
                                                                : "var(--color-hex-555555)",
                                                    }}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mb-[8px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                            TASK / CVE ID
                                        </div>
                                        <input
                                            value={benchTaskId}
                                            onChange={(e) => setBenchTaskId(e.target.value)}
                                            placeholder="e.g. CVE-2023-44487 or leave blank for full suite"
                                            className="font-inherit box-border w-full rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-080808)] px-[10px] py-[7px] text-[10px] tracking-[0.04em] text-[var(--color-hex-a0a0a0)] outline-none focus:border-[var(--color-hex-e31b23)]"
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {/* ── STEP 2: RULES OF ENGAGEMENT ── */}
                        {step === 2 && (
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
                                                Minutes allowed per vulnerability before the
                                                specialist is retired.
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
                                                Maximum total LLM spend before human escalation is
                                                triggered.
                                            </div>
                                        </div>
                                        <div className="ml-6 flex flex-shrink-0 items-center gap-2">
                                            <span className="text-[12px] text-[var(--color-hex-666666)]">
                                                $
                                            </span>
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
                                                Maximum wall-clock seconds a single tool invocation
                                                may run.
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
                                                Maximum retry attempts per VDG node before it is
                                                deprioritized.
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
                                        <span className="shrink-0 text-[11px] text-[var(--color-hex-d29922)]">
                                            ⚠
                                        </span>
                                        <span className="text-[9.5px] leading-[1.6] tracking-[0.08em] text-[var(--color-hex-d29922)]">
                                            Cost ceiling above $50 — human escalation will only
                                            trigger at high spend. Ensure this is intentional.
                                        </span>
                                    </div>
                                )}
                            </>
                        )}

                        {/* ── STEP 3: ATTACK SURFACE ── */}
                        {step === 3 && (
                            <>
                                <StepHeading step={3} label="ATTACK SURFACE" />
                                <div className="mb-[20px] text-[9.5px] leading-[1.7] tracking-[0.14em] text-[var(--color-hex-666666)]">
                                    Select the attack surface to engage. This determines which
                                    specialist agents are spawned and which vulnerability classes
                                    are eligible for testing.
                                </div>
                                <SurfaceCards value={surface} onChange={setSurface} />
                            </>
                        )}

                        {/* ── STEP 4: MISSION MODE ── */}
                        {step === 4 && (
                            <>
                                <StepHeading step={4} label="MISSION MODE" />
                                <div className="mb-[24px] text-[9.5px] leading-[1.7] tracking-[0.14em] text-[var(--color-hex-666666)]">
                                    Select the knowledge mode under which the system operates. This
                                    controls whether a CVE identifier hint is injected into the team
                                    manager context at mission start.
                                </div>
                                <ModeCards value={mode} onChange={setMode} />
                            </>
                        )}

                        {/* ── STEP 5: REVIEW ── */}
                        {step === 5 && (
                            <ReviewStep
                                target={target}
                                targetType={targetType}
                                surface={surface}
                                mode={mode}
                                maxRuntime={maxRuntime}
                                costCeiling={costCeiling}
                                toolTimeout={toolTimeout}
                                roe={roe}
                            />
                        )}
                    </div>
                </div>

                {/* Right: mission summary */}
                <div
                    className="flex w-[264px] flex-shrink-0 flex-col overflow-y-auto bg-[var(--color-hex-0b0b0b)]"
                    style={{
                        borderLeft: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <div
                        className="px-5 pt-5 pb-4"
                        style={{
                            borderBottom: "1px solid var(--color-hex-1e1e1e)",
                        }}
                    >
                        <div className="mb-[10px] text-[9px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                            MISSION SUMMARY
                        </div>
                        <div className="flex flex-col gap-3">
                            <MetaRow label="TARGET" value={target || "—"} highlight />
                            <MetaRow label="TARGET TYPE" value={targetType} />
                            <MetaRow label="SURFACE" value={step >= 3 ? surface : "—"} />
                            <MetaRow label="MODE" value={step >= 4 ? mode : "—"} />
                            <MetaRow
                                label="MAX RUNTIME"
                                value={runtimeNum ? runtimeLabel() : "—"}
                            />
                            <MetaRow
                                label="COST CEILING"
                                value={costNum ? `$${costNum.toFixed(2)}` : "—"}
                                highlight={costNum > 0}
                            />
                            <MetaRow
                                label="TOOL TIMEOUT"
                                value={timeoutNum ? `${timeoutNum}s` : "—"}
                            />
                        </div>
                    </div>

                    {/* ROE preview */}
                    {step >= 2 && roe && (
                        <div
                            className="px-5 pt-4 pb-4"
                            style={{
                                borderBottom: "1px solid var(--color-hex-1e1e1e)",
                            }}
                        >
                            <div className="mb-[8px] text-[9px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                ROE PREVIEW
                            </div>
                            <div
                                className="overflow-hidden text-[9px] leading-[1.7] tracking-[0.06em] text-[var(--color-hex-333333)]"
                                style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 6,
                                    WebkitBoxOrient: "vertical" as const,
                                }}
                            >
                                {roe}
                            </div>
                        </div>
                    )}

                    <div className="px-5 pt-4">
                        <div className="mb-[8px] text-[9px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                            VALIDATION
                        </div>
                        <div className="text-[9px] leading-[1.8] tracking-[0.1em] text-[var(--color-hex-333333)]">
                            Oracle validation available for BENCHMARK ENVIRONMENT targets.
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div
                className="flex flex-shrink-0 items-center justify-between bg-[var(--color-hex-0b0b0b)] px-6 py-4"
                style={{
                    borderTop: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <button
                    onClick={onCancel}
                    className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[transparent] px-[18px] py-[7px] text-[10px] tracking-[0.18em] text-[var(--color-hex-666666)] hover:border-[var(--color-hex-444444)]"
                >
                    CANCEL
                </button>
                <div className="flex items-center gap-3">
                    {step > 1 && (
                        <button
                            onClick={() => setStep((s) => s - 1)}
                            className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[transparent] px-[18px] py-[7px] text-[10px] tracking-[0.18em] text-[var(--color-hex-a0a0a0)] hover:border-[var(--color-hex-444444)]"
                        >
                            ← BACK
                        </button>
                    )}
                    <button
                        onClick={() => (step < 5 ? setStep((s) => s + 1) : onStart?.())}
                        className="font-inherit cursor-pointer rounded-[2px] border-none bg-[var(--color-hex-e31b23)] text-[10px] font-semibold tracking-[0.18em] text-[var(--color-hex-f2f2f2)] hover:bg-[var(--color-hex-ff2a32)]"
                        style={{
                            padding: step === 5 ? "8px 32px" : "8px 24px",
                        }}
                    >
                        {step === 5 ? "START MISSION →" : "NEXT →"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Shared sub-components ── */

function StepHeading({ step, label }: { step: number; label: string }) {
    return (
        <div className="mb-7 flex items-center gap-3">
            <div className="h-[20px] w-[2px] bg-[var(--color-hex-e31b23)]" />
            <span className="text-[13px] font-semibold tracking-[0.16em] text-[var(--color-hex-f2f2f2)]">
                STEP {step} — {label}
            </span>
        </div>
    );
}
function FieldBlock({
    label,
    hint,
    mb,
    children,
}: {
    label: string;
    hint?: string;
    mb?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className={mb ? "mb-7" : ""}>
            <label
                className="mb-[8px] text-[9.5px] tracking-[0.2em] text-[var(--color-hex-666666)]"
                style={{
                    display: "block",
                }}
            >
                {label}
            </label>
            {children}
            {hint && (
                <div className="mt-[6px] text-[9px] tracking-[0.12em] text-[var(--color-hex-444444)]">
                    {hint}
                </div>
            )}
        </div>
    );
}
function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            className="font-inherit w-full rounded-[2px] border-[1px] border-solid border-[var(--color-hex-333333)] bg-[var(--color-hex-111111)] px-[14px] py-[10px] text-[12px] tracking-[0.04em] text-[var(--color-hex-f2f2f2)] outline-none focus:border-[var(--color-hex-e31b23)]"
        />
    );
}
function RadioGroup<T extends string>({
    value,
    onChange,
    options,
}: {
    value: T;
    onChange: (v: T) => void;
    options: {
        value: T;
        desc: string;
    }[];
}) {
    return (
        <div className="flex flex-col overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)]">
            {options.map((opt, i) => {
                const selected = value === opt.value;
                return (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`font-inherit flex w-full cursor-pointer items-start gap-4 border-l-[3px] px-[16px] py-[12px] text-left ${selected ? "border-l-[var(--color-hex-e31b23)] bg-[var(--color-hex-120608)]" : "border-l-transparent bg-[var(--color-hex-0d0d0d)] hover:bg-[var(--color-hex-111111)]"}`}
                        style={{
                            borderTop: i > 0 ? "1px solid var(--color-hex-1e1e1e)" : "none",
                        }}
                    >
                        <div
                            className="mt-[1px] h-[14px] w-[14px] shrink-0"
                            style={{
                                borderRadius: "50%",
                                border: `1px solid ${selected ? "var(--color-hex-e31b23)" : "var(--color-hex-333333)"}`,
                                background: selected ? "var(--color-hex-e31b23)" : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {selected && (
                                <div
                                    className="h-[5px] w-[5px] bg-[var(--color-hex-f2f2f2)]"
                                    style={{
                                        borderRadius: "50%",
                                    }}
                                />
                            )}
                        </div>
                        <div>
                            <div
                                className="mb-[3px] text-[11px] font-semibold tracking-[0.14em]"
                                style={{
                                    color: selected
                                        ? "var(--color-hex-f2f2f2)"
                                        : "var(--color-hex-666666)",
                                }}
                            >
                                {opt.value}
                            </div>
                            <div className="text-[9.5px] leading-[1.5] tracking-[0.06em] text-[var(--color-hex-444444)]">
                                {opt.desc}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
function Divider() {
    return <div className="mt-[4px] mb-[28px] h-[1px] bg-[var(--color-hex-1e1e1e)]" />;
}
const SURFACE_OPTIONS: {
    value: SurfaceType;
    proto: string;
    icon: string;
    tags: string[];
    specialists: string[];
    description: string;
}[] = [
    {
        value: "WEB APPLICATION",
        proto: "HTTP / HTML",
        icon: "⬡",
        tags: ["SQLi", "XSS", "CSRF", "SSRF", "SSTI", "IDOR", "Auth Bypass", "Path Traversal"],
        specialists: ["RECON", "AUTH", "INJECTION", "LOGIC", "VALIDATION"],
        description:
            "Full web-layer attack surface. Enumerates endpoints, parameters, and authentication state before attempting exploitation.",
    },
    {
        value: "GRAPHQL",
        proto: "GraphQL / HTTP",
        icon: "◈",
        tags: [
            "Schema Introspection",
            "Dependency Injection",
            "IDOR",
            "Batching Attacks",
            "Auth Bypass",
        ],
        specialists: ["RECON", "GRAPHQL", "INJECTION", "VALIDATION"],
        description:
            "GraphQL schema discovery and exploitation. Tests field-level authorization, nested query abuse, and injection via arguments.",
    },
    {
        value: "MULTI-HOST",
        proto: "TCP / Network",
        icon: "◉",
        tags: [
            "Lateral Movement",
            "Privilege Escalation",
            "Credential Reuse",
            "Service Exploit",
            "Pivoting",
        ],
        specialists: ["RECON", "NETWORK", "LATERAL", "PRIVESC", "VALIDATION"],
        description:
            "Multi-host network engagement. Maps topology, pivots across trust boundaries, and escalates privileges across hosts.",
    },
];
function SurfaceCards({
    value,
    onChange,
}: {
    value: SurfaceType;
    onChange: (v: SurfaceType) => void;
}) {
    return (
        <div
            className="flex gap-4"
            style={{
                alignItems: "stretch",
            }}
        >
            {SURFACE_OPTIONS.map((opt) => {
                const selected = value === opt.value;
                return (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`font-inherit relative flex flex-1 cursor-pointer flex-col rounded-[2px] border border-solid text-left transition-colors duration-100 ${selected ? "border-[var(--color-hex-e31b23)] bg-[var(--color-hex-120608)]" : "border-[var(--color-hex-292929)] bg-[var(--color-hex-0d0d0d)] hover:border-[var(--color-hex-444444)] hover:bg-[var(--color-hex-111111)]"}`}
                        style={{
                            padding: "18px 16px 16px",
                        }}
                    >
                        {/* Selected indicator */}
                        {selected && (
                            <div
                                className="absolute top-[10px] right-[10px] h-[8px] w-[8px] bg-[var(--color-hex-e31b23)]"
                                style={{
                                    borderRadius: "50%",
                                }}
                            />
                        )}

                        {/* Icon + name */}
                        <div className="mb-2 flex items-center gap-2">
                            <span
                                className="text-[16px]"
                                style={{
                                    color: selected
                                        ? "var(--color-hex-e31b23)"
                                        : "var(--color-hex-444444)",
                                }}
                            >
                                {opt.icon}
                            </span>
                            <span
                                className="text-[11px] font-bold tracking-[0.16em]"
                                style={{
                                    color: selected
                                        ? "var(--color-hex-f2f2f2)"
                                        : "var(--color-hex-666666)",
                                }}
                            >
                                {opt.value}
                            </span>
                        </div>

                        {/* Protocol */}
                        <div
                            className="mb-[12px] text-[9px] font-semibold tracking-[0.16em]"
                            style={{
                                color: selected
                                    ? "var(--color-hex-9e1118)"
                                    : "var(--color-hex-333333)",
                            }}
                        >
                            {opt.proto}
                        </div>

                        {/* Divider */}
                        <div
                            className="mb-[12px] h-[1px]"
                            style={{
                                background: selected
                                    ? "var(--color-hex-2a0a0c)"
                                    : "var(--color-hex-1a1a1a)",
                            }}
                        />

                        {/* Description */}
                        <div className="mb-[14px] grow text-[9.5px] leading-[1.65] tracking-[0.05em] text-[var(--color-hex-555555)]">
                            {opt.description}
                        </div>

                        {/* Vuln class tags */}
                        <div className="mb-4 flex flex-wrap gap-1">
                            {opt.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-[2px] px-[5px] py-[1px] text-[8.5px] tracking-[0.1em] whitespace-nowrap"
                                    style={{
                                        color: selected
                                            ? "var(--color-hex-e31b23)"
                                            : "var(--color-hex-444444)",
                                        background: selected
                                            ? "var(--color-hex-1a0608)"
                                            : "var(--color-hex-111111)",
                                        border: `1px solid ${selected ? "var(--color-hex-6f171b)" : "var(--color-hex-222222)"}`,
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Divider */}
                        <div
                            className="mb-[10px] h-[1px]"
                            style={{
                                background: selected
                                    ? "var(--color-hex-2a0a0c)"
                                    : "var(--color-hex-1a1a1a)",
                            }}
                        />

                        {/* Specialists */}
                        <div>
                            <div className="mb-[6px] text-[8px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                SPECIALISTS
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {opt.specialists.map((s) => (
                                    <span
                                        key={s}
                                        className="text-[8px] tracking-[0.12em]"
                                        style={{
                                            color: selected
                                                ? "var(--color-hex-a0a0a0)"
                                                : "var(--color-hex-333333)",
                                        }}
                                    >
                                        {s}{" "}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
const MODE_OPTIONS: {
    value: ModeType;
    hint: string;
    badge: string;
    badgeColor: string;
    difficulty: string;
    icon: string;
    description: string;
    implications: {
        label: string;
        detail: string;
    }[];
}[] = [
    {
        value: "ONE-DAY",
        hint: "CVE HINT AVAILABLE",
        badge: "ASSISTED",
        badgeColor: "var(--color-hex-d29922)",
        difficulty: "STANDARD",
        icon: "◈",
        description:
            "The team manager receives a CVE identifier at mission start. The system uses this to bias UCB exploration toward known vulnerability classes and seed the VDG with informed candidate nodes.",
        implications: [
            {
                label: "CVE SEED",
                detail: "CVE id injected into team manager system prompt.",
            },
            {
                label: "VDG INIT",
                detail: "Attack graph pre-seeded with CVE-class candidates.",
            },
            {
                label: "UCB PRIOR",
                detail: "EPSS score from CVE record used as UCB prior.",
            },
            {
                label: "MEMORY LOOKUP",
                detail: "Skill library queried for CVE-class patterns first.",
            },
            {
                label: "ORACLE",
                detail: "Oracle validation available on BENCHMARK targets.",
            },
        ],
    },
    {
        value: "ZERO-DAY",
        hint: "NO CVE HINT",
        badge: "BLIND",
        badgeColor: "var(--color-hex-e31b23)",
        difficulty: "HARD",
        icon: "◆",
        description:
            "No CVE identifier is provided. The system must discover the vulnerability class through autonomous reconnaissance, environmental layer construction, and fully unsupervised VDG expansion.",
        implications: [
            {
                label: "NO SEED",
                detail: "VDG initialized from surface heuristics only.",
            },
            {
                label: "UCB PRIOR",
                detail: "Uniform prior — no EPSS bias applied.",
            },
            {
                label: "FULL RECON",
                detail: "Complete recon pass required before exploitation.",
            },
            {
                label: "HIGHER COST",
                detail: "Typically 2–4× more LLM calls than ONE-DAY mode.",
            },
            {
                label: "ORACLE",
                detail: "Oracle validation available on BENCHMARK targets.",
            },
        ],
    },
];
function ModeCards({ value, onChange }: { value: ModeType; onChange: (v: ModeType) => void }) {
    return (
        <div
            className="flex gap-5"
            style={{
                alignItems: "stretch",
            }}
        >
            {MODE_OPTIONS.map((opt) => {
                const selected = value === opt.value;
                return (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`font-inherit relative flex flex-1 cursor-pointer flex-col rounded-[2px] border border-solid text-left transition-colors duration-100 ${selected ? "border-[var(--color-hex-e31b23)] bg-[var(--color-hex-120608)]" : "border-[var(--color-hex-292929)] bg-[var(--color-hex-0d0d0d)] hover:border-[var(--color-hex-444444)] hover:bg-[var(--color-hex-111111)]"}`}
                        style={{
                            padding: "22px 20px 18px",
                        }}
                    >
                        {/* Top row: icon + title + selected dot */}
                        <div className="mb-1 flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                                <span
                                    className="text-[18px] leading-[1]"
                                    style={{
                                        color: selected
                                            ? "var(--color-hex-e31b23)"
                                            : "var(--color-hex-444444)",
                                    }}
                                >
                                    {opt.icon}
                                </span>
                                <span
                                    className="text-[16px] font-bold tracking-[0.14em]"
                                    style={{
                                        color: selected
                                            ? "var(--color-hex-f2f2f2)"
                                            : "var(--color-hex-555555)",
                                    }}
                                >
                                    {opt.value}
                                </span>
                            </div>
                            {selected && (
                                <div
                                    className="mt-[4px] h-[8px] w-[8px] shrink-0 bg-[var(--color-hex-e31b23)]"
                                    style={{
                                        borderRadius: "50%",
                                    }}
                                />
                            )}
                        </div>

                        {/* Hint + badges row */}
                        <div className="mb-5 flex items-center gap-2">
                            <span
                                className="text-[9px] font-semibold tracking-[0.2em]"
                                style={{
                                    color: selected
                                        ? "var(--color-hex-9e1118)"
                                        : "var(--color-hex-333333)",
                                }}
                            >
                                {opt.hint}
                            </span>
                            <span
                                className="rounded-[2px] px-[6px] py-[1px] text-[8.5px] font-semibold tracking-[0.16em]"
                                style={{
                                    color: opt.badgeColor,
                                    background: `${opt.badgeColor}18`,
                                    border: `1px solid ${opt.badgeColor}44`,
                                }}
                            >
                                {opt.badge}
                            </span>
                            <span className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-222222)] bg-[var(--color-hex-151515)] px-[6px] py-[1px] text-[8.5px] tracking-[0.14em] text-[var(--color-hex-555555)]">
                                {opt.difficulty}
                            </span>
                        </div>

                        {/* Divider */}
                        <div
                            className="mb-[16px] h-[1px]"
                            style={{
                                background: selected
                                    ? "var(--color-hex-2a0a0c)"
                                    : "var(--color-hex-1a1a1a)",
                            }}
                        />

                        {/* Description */}
                        <div className="mb-[20px] grow text-[10px] leading-[1.7] tracking-[0.04em] text-[var(--color-hex-555555)]">
                            {opt.description}
                        </div>

                        {/* Divider */}
                        <div
                            className="mb-[14px] h-[1px]"
                            style={{
                                background: selected
                                    ? "var(--color-hex-2a0a0c)"
                                    : "var(--color-hex-1a1a1a)",
                            }}
                        />

                        {/* Implications list */}
                        <div className="flex flex-col gap-2">
                            {opt.implications.map((imp) => (
                                <div key={imp.label} className="flex items-start gap-2">
                                    <span
                                        className="min-w-[96px] shrink-0 text-[8.5px] font-semibold tracking-[0.16em]"
                                        style={{
                                            color: selected
                                                ? "var(--color-hex-e31b23)"
                                                : "var(--color-hex-333333)",
                                        }}
                                    >
                                        {imp.label}
                                    </span>
                                    <span className="text-[8.5px] leading-[1.5] tracking-[0.06em] text-[var(--color-hex-444444)]">
                                        {imp.detail}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
const SURFACE_SPECIALISTS: Record<SurfaceType, string[]> = {
    "WEB APPLICATION": ["RECON", "AUTH", "INJECTION", "LOGIC", "VALIDATION"],
    GRAPHQL: ["RECON", "GRAPHQL", "INJECTION", "VALIDATION"],
    "MULTI-HOST": ["RECON", "NETWORK", "LATERAL", "PRIVESC", "VALIDATION"],
};
function ReviewStep({
    target,
    targetType,
    surface,
    mode,
    maxRuntime,
    costCeiling,
    toolTimeout,
    roe,
}: {
    target: string;
    targetType: TargetType;
    surface: SurfaceType;
    mode: ModeType;
    maxRuntime: string;
    costCeiling: string;
    toolTimeout: string;
    roe: string;
}) {
    const specialists = SURFACE_SPECIALISTS[surface];
    const isOracle = targetType === "BENCHMARK ENVIRONMENT";
    const costNum = parseFloat(costCeiling) || 0;
    const rows: {
        label: string;
        value: string;
        valueColor?: string;
        mono?: boolean;
        warn?: boolean;
    }[] = [
        {
            label: "TARGET",
            value: target || "—",
            valueColor: "var(--color-hex-e31b23)",
            mono: true,
        },
        {
            label: "TARGET TYPE",
            value: targetType,
        },
        {
            label: "SURFACE",
            value: surface,
        },
        {
            label: "MODE",
            value: mode,
            valueColor: mode === "ZERO-DAY" ? "var(--color-hex-ff2a32)" : "var(--color-hex-d29922)",
        },
        {
            label: "MAX RUNTIME",
            value: `${maxRuntime} min / vulnerability`,
        },
        {
            label: "COST CEILING",
            value: `$${parseFloat(costCeiling).toFixed(2)}`,
            valueColor: costNum > 50 ? "var(--color-hex-d29922)" : "var(--color-hex-f2f2f2)",
            warn: costNum > 50,
        },
        {
            label: "TOOL TIMEOUT",
            value: `${toolTimeout} seconds`,
        },
        {
            label: "SPECIALISTS",
            value: specialists.join("  ·  "),
        },
        {
            label: "VALIDATION",
            value: isOracle ? "ORACLE CONFIRMED (CVE-BENCH)" : "E_ord THRESHOLD (≥ 4)",
        },
        {
            label: "MEMORY",
            value: "ENABLED — Vulnerability patterns, strategies, episodic failures",
        },
        {
            label: "EARLY STOP",
            value: "ENABLED — Halt on cost ceiling or runtime breach",
        },
    ];
    return (
        <>
            <StepHeading step={5} label="REVIEW & CONFIRM" />
            <div className="mb-[24px] text-[9.5px] leading-[1.7] tracking-[0.12em] text-[var(--color-hex-666666)]">
                Review the full mission configuration before launch. Once started, cost ceiling and
                rules of engagement cannot be modified.
            </div>

            {/* Main config table */}
            <div className="mb-[20px] overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)]">
                {rows.map((row, i) => (
                    <div
                        key={row.label}
                        className="flex"
                        style={{
                            borderBottom:
                                i < rows.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                            background:
                                i % 2 === 0 ? "var(--color-hex-0d0d0d)" : "var(--color-hex-0b0b0b)",
                        }}
                    >
                        <div
                            className="w-[148px] shrink-0 px-[16px] py-[10px] text-[9px] font-semibold tracking-[0.2em] text-[var(--color-hex-444444)]"
                            style={{
                                borderRight: "1px solid var(--color-hex-1a1a1a)",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {row.label}
                        </div>
                        <div
                            className="flex-1 px-[16px] py-[10px] text-[10.5px] leading-[1.5] tracking-[0.05em]"
                            style={{
                                color: row.valueColor ?? "var(--color-hex-a0a0a0)",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <span className="font-inherit">{row.value}</span>
                            {row.warn && (
                                <span className="shrink-0 rounded-[2px] border-[1px] border-solid border-[var(--color-hex-d2992244)] bg-[var(--color-hex-1a1200)] px-[5px] py-[1px] text-[8.5px] tracking-[0.12em] text-[var(--color-hex-d29922)]">
                                    HIGH
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ROE block */}
            <div className="mb-[24px] overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)]">
                <div
                    className="bg-[var(--color-hex-111111)] px-[16px] py-[8px] text-[9px] font-semibold tracking-[0.2em] text-[var(--color-hex-444444)]"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1a1a1a)",
                    }}
                >
                    RULES OF ENGAGEMENT
                </div>
                <div className="bg-[var(--color-hex-0d0d0d)] px-[16px] py-[12px] text-[10px] leading-[1.75] tracking-[0.04em] text-[var(--color-hex-555555)]">
                    {roe || "—"}
                </div>
            </div>

            {/* System confirmations */}
            <div className="mb-[8px] overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                <div
                    className="bg-[var(--color-hex-0b0b0b)] px-[16px] py-[8px] text-[9px] font-semibold tracking-[0.2em] text-[var(--color-hex-444444)]"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1a1a1a)",
                    }}
                >
                    PRE-FLIGHT CHECKS
                </div>
                {[
                    {
                        ok: true,
                        label: "Target reachability",
                        detail: "DNS resolved — 104.21.3.212",
                    },
                    {
                        ok: true,
                        label: "Cost ceiling configured",
                        detail: `$${parseFloat(costCeiling).toFixed(2)} ceiling set`,
                    },
                    {
                        ok: true,
                        label: "Specialist agents available",
                        detail: `${specialists.length} agents ready`,
                    },
                    {
                        ok: isOracle,
                        label: "Oracle validation",
                        detail: isOracle
                            ? "CVE-BENCH oracle linked"
                            : "Manual E_ord threshold (≥ 4)",
                    },
                    {
                        ok: true,
                        label: "Memory subsystem",
                        detail: "Vulnerability pattern DB: 847 records",
                    },
                ].map((chk, i, arr) => (
                    <div
                        key={chk.label}
                        className="flex items-center gap-3 bg-[var(--color-hex-0d0d0d)] px-[16px] py-[9px]"
                        style={{
                            borderBottom:
                                i < arr.length - 1 ? "1px solid var(--color-hex-141414)" : "none",
                        }}
                    >
                        <span
                            className="shrink-0 text-[11px]"
                            style={{
                                color: chk.ok
                                    ? "var(--color-hex-3fb950)"
                                    : "var(--color-hex-d29922)",
                            }}
                        >
                            {chk.ok ? "✓" : "⚠"}
                        </span>
                        <span
                            className="min-w-[200px] text-[10px] tracking-[0.08em]"
                            style={{
                                color: chk.ok
                                    ? "var(--color-hex-a0a0a0)"
                                    : "var(--color-hex-d29922)",
                            }}
                        >
                            {chk.label}
                        </span>
                        <span className="text-[9px] tracking-[0.06em] text-[var(--color-hex-444444)]">
                            {chk.detail}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}
function MetaRow({
    label,
    value,
    highlight,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div>
            <div className="mb-[1px] text-[8px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                {label}
            </div>
            <div
                className="text-[10px] tracking-[0.06em]"
                style={{
                    color: highlight ? "var(--color-hex-e31b23)" : "var(--color-hex-666666)",
                    wordBreak: "break-all",
                }}
            >
                {value}
            </div>
        </div>
    );
}
