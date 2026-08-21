import { AUDIT_EVENT } from "@/features/audit/hooks/useAuditFeed";
import Divider from "@/features/missions/components/wizard/Divider";
import FieldBlock from "@/features/missions/components/wizard/FieldBlock";
import MetaRow from "@/features/missions/components/wizard/MetaRow";
import ModeCards from "@/features/missions/components/wizard/ModeCards";
import RadioGroup from "@/features/missions/components/wizard/RadioGroup";
import ReviewStep from "@/features/missions/components/wizard/ReviewStep";
import StepHeading from "@/features/missions/components/wizard/StepHeading";
import SurfaceCards from "@/features/missions/components/wizard/SurfaceCards";
import TextInput from "@/features/missions/components/wizard/TextInput";
import { STEPS, type TargetType, type WizardProps } from "@/features/missions/data/wizardMockData";
import { useNewMissionWizard } from "@/features/missions/hooks/useNewMissionWizard";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useServices } from "@/lib/services-context";
import { type AuditEntry } from "@/types/domain-types";

export default function NewMissionWizard({ onCancel, onStart }: WizardProps) {
    const {
        step,
        setStep,
        target,
        setTarget,
        targetType,
        setTargetType,
        benchSuite,
        setBenchSuite,
        benchTaskId,
        setBenchTaskId,
        roe,
        setRoe,
        maxRuntime,
        setMaxRuntime,
        costCeiling,
        setCostCeiling,
        toolTimeout,
        setToolTimeout,
        surface,
        setSurface,
        mode,
        setMode,
    } = useNewMissionWizard();
    const { eventBus } = useServices();
    const { logEvent } = useTelemetry();

    const costNum = parseFloat(costCeiling) || 0;
    const runtimeNum = parseInt(maxRuntime) || 0;
    const timeoutNum = parseInt(toolTimeout) || 0;
    function runtimeLabel() {
        if (!runtimeNum) {
            return "—";
        }
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
                        onClick={() => {
                            if (step < 5) {
                                setStep((s) => s + 1);
                            } else {
                                logEvent("MISSION_CREATED", { target, targetType, surface, mode });
                                eventBus.publish<AuditEntry>(AUDIT_EVENT, {
                                    id: `EV-${Date.now().toString().slice(-6)}`,
                                    ts: new Date().toLocaleTimeString("en-US", {
                                        hour12: false,
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    }),
                                    type: "MISSION",
                                    actor: "user",
                                    action: "CREATE",
                                    resource: `mission/${target}`,
                                    result: "SUCCESS",
                                    ip: "127.0.0.1",
                                    detail: `Created mission for ${target} (${surface}, ${mode})`,
                                });
                                onStart?.();
                            }
                        }}
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
