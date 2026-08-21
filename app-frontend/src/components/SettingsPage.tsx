import { useState } from "react";

type SettingsTab =
    | "GENERAL"
    | "MODELS"
    | "MISSIONS"
    | "TOOLS"
    | "MEMORY"
    | "VDG"
    | "VALIDATION"
    | "BENCHMARKS"
    | "COST"
    | "SECURITY";
const TABS: SettingsTab[] = [
    "GENERAL",
    "MODELS",
    "MISSIONS",
    "TOOLS",
    "MEMORY",
    "VDG",
    "VALIDATION",
    "BENCHMARKS",
    "COST",
    "SECURITY",
];
export default function SettingsPage() {
    const [tab, setTab] = useState<SettingsTab>("GENERAL");
    return (
        <div className="flex h-full min-h-[0px]">
            {/* Left nav */}
            <div
                className="flex w-[160px] flex-shrink-0 flex-col overflow-y-auto bg-[var(--color-hex-0b0b0b)] py-4"
                style={{
                    borderRight: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div
                    className="mb-[12px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]"
                    style={{
                        paddingLeft: 16,
                    }}
                >
                    SYSTEM / SETTINGS
                </div>
                {TABS.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className="font-inherit w-full cursor-pointer border-none px-4 py-2 text-left text-[10px] tracking-[0.08em]"
                        style={{
                            background: t === tab ? "var(--color-hex-1a0a0b)" : "transparent",
                            borderLeft: `2px solid ${t === tab ? "var(--color-hex-e31b23)" : "transparent"}`,
                            color:
                                t === tab ? "var(--color-hex-f2f2f2)" : "var(--color-hex-555555)",
                        }}
                        onMouseEnter={(e) => {
                            if (t !== tab) {e.currentTarget.style.color = "var(--color-hex-a0a0a0)";}
                        }}
                        onMouseLeave={(e) => {
                            if (t !== tab) {e.currentTarget.style.color = "var(--color-hex-555555)";}
                        }}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="min-h-[0px] flex-1 overflow-hidden">
                {tab === "GENERAL" && <GeneralSettings />}
                {tab === "MODELS" && <ModelSettings />}
                {tab === "MISSIONS" && <MissionsSettings />}
                {tab === "TOOLS" && <ToolsSettings />}
                {tab === "MEMORY" && <MemorySettings />}
                {tab === "VDG" && <VDGSettings />}
                {tab === "VALIDATION" && <ValidationSettings />}
                {tab === "BENCHMARKS" && <BenchmarksSettings />}
                {tab === "COST" && <CostSettings />}
                {tab === "SECURITY" && <SecuritySettings />}
            </div>
        </div>
    );
}

/* ── Shared helpers ── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="mb-[20px]">
            <div className="mb-[8px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                {label}
            </div>
            {children}
        </div>
    );
}
function FieldRow({
    label,
    unit,
    value,
    onChange,
}: {
    label: string;
    unit?: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div
            className="mb-4 flex items-center justify-between"
            style={{
                borderBottom: "1px solid var(--color-hex-111111)",
                paddingBottom: 10,
            }}
        >
            <span className="text-[10px] tracking-[0.06em] text-[var(--color-hex-888888)]">
                {label}
            </span>
            <div className="flex items-center gap-2">
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="font-inherit w-[72px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[8px] py-[5px] text-right text-[10px] text-[var(--color-hex-a0a0a0)] outline-none focus:border-[var(--color-hex-e31b23)]"
                />
                {unit && (
                    <span className="min-w-[52px] text-[8.5px] text-[var(--color-hex-444444)]">
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
}
function TextInput({ value, placeholder }: { value: string; placeholder?: string }) {
    const [v, setV] = useState(value);
    return (
        <input
            value={v}
            onChange={(e) => setV(e.target.value)}
            placeholder={placeholder}
            className="font-inherit w-full rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[12px] py-[7px] text-[10px] tracking-[0.04em] text-[var(--color-hex-a0a0a0)] outline-none"
            style={{
                boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-hex-e31b23)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-hex-1e1e1e)")}
        />
    );
}
function Toggle({ on }: { on: boolean }) {
    const [v, setV] = useState(on);
    return (
        <div
            onClick={() => setV(!v)}
            className="relative h-[16px] w-[32px] shrink-0 cursor-pointer rounded-[8px]"
            style={{
                background: v ? "var(--color-hex-e31b23)" : "var(--color-hex-1e1e1e)",
                border: `1px solid ${v ? "var(--color-hex-e31b23)" : "var(--color-hex-292929)"}`,
                transition: "background 0.15s",
            }}
        >
            <div
                className="absolute top-[1px] h-[12px] w-[12px] bg-[var(--color-hex-f2f2f2)]"
                style={{
                    borderRadius: "50%",
                    left: v ? 16 : 2,
                    transition: "left 0.15s",
                }}
            />
        </div>
    );
}
function ToggleRow({ label, on }: { label: string; on: boolean }) {
    return (
        <div
            className="mb-4 flex items-center justify-between"
            style={{
                borderBottom: "1px solid var(--color-hex-111111)",
                paddingBottom: 10,
            }}
        >
            <span className="text-[10px] tracking-[0.06em] text-[var(--color-hex-888888)]">
                {label}
            </span>
            <Toggle on={on} />
        </div>
    );
}
function SaveBar() {
    const [saved, setSaved] = useState(false);
    return (
        <div className="mt-8 flex gap-3">
            <button
                onClick={() => {
                    setSaved(true);
                    setTimeout(() => setSaved(false), 2000);
                }}
                className="font-inherit cursor-pointer rounded-[2px] border-none bg-[var(--color-hex-e31b23)] px-[20px] py-[7px] text-[9.5px] tracking-[0.14em] text-[var(--color-hex-f2f2f2)]"
            >
                {saved ? "SAVED ✓" : "SAVE CHANGES"}
            </button>
            <button className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[transparent] px-[16px] py-[7px] text-[9.5px] tracking-[0.14em] text-[var(--color-hex-666666)]">
                RESET DEFAULTS
            </button>
        </div>
    );
}
function SectionHead({ label }: { label: string }) {
    return (
        <div
            className="mt-[24px] mb-[16px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]"
            style={{
                borderBottom: "1px solid var(--color-hex-141414)",
                paddingBottom: 6,
            }}
        >
            {label}
        </div>
    );
}
function Chips({
    options,
    value,
    onChange,
}: {
    options: string[];
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((o) => (
                <button
                    key={o}
                    onClick={() => onChange(o)}
                    className="font-inherit cursor-pointer rounded-[2px] px-[12px] py-[4px] text-[9px] tracking-[0.12em]"
                    style={{
                        background: value === o ? "var(--color-hex-1a0608)" : "transparent",
                        border: `1px solid ${value === o ? "var(--color-hex-e31b23)" : "var(--color-hex-292929)"}`,
                        color: value === o ? "var(--color-hex-ff2a32)" : "var(--color-hex-555555)",
                    }}
                >
                    {o}
                </button>
            ))}
        </div>
    );
}

/* ── GENERAL ── */
function GeneralSettings() {
    const [devRef, setDevRef] = useState(false);
    return (
        <div className="max-w-[600px] flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="OPERATOR" />
            <Field label="OPERATOR ID">
                <TextInput value="usr-01" />
            </Field>
            <Field label="DISPLAY NAME">
                <TextInput value="Security Researcher" />
            </Field>
            <Field label="ORGANIZATION">
                <TextInput value="CMatrix Research Lab" />
            </Field>
            <SectionHead label="INTERFACE" />
            {[
                {
                    l: "AUTO-REFRESH LIVE FEED",
                    on: true,
                },
                {
                    l: "SHOW TIMESTAMPS IN UTC",
                    on: true,
                },
                {
                    l: "COMPACT TABLE ROWS",
                    on: false,
                },
                {
                    l: "SOUND ALERTS ON ESCALATION",
                    on: false,
                },
            ].map((s) => (
                <div
                    key={s.l}
                    className="mb-4 flex items-center justify-between"
                    style={{
                        borderBottom: "1px solid var(--color-hex-111111)",
                        paddingBottom: 10,
                    }}
                >
                    <span className="text-[10px] tracking-[0.06em] text-[var(--color-hex-888888)]">
                        {s.l}
                    </span>
                    <Toggle on={s.on} />
                </div>
            ))}
            <SectionHead label="DEFAULT RULES OF ENGAGEMENT" />
            <Field label="MAX RUNTIME">
                <div className="flex items-center gap-2 focus:border-[var(--color-hex-e31b23)]">
                    <input
                        defaultValue="4"
                        className="font-inherit w-[72px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[8px] py-[5px] text-right text-[10px] text-[var(--color-hex-a0a0a0)] outline-none"
                    />
                    <span className="text-[8.5px] text-[var(--color-hex-444444)]">hours</span>
                </div>
            </Field>
            <Field label="COST CEILING">
                <div className="flex items-center gap-2 focus:border-[var(--color-hex-e31b23)]">
                    <input
                        defaultValue="5.00"
                        className="font-inherit w-[72px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[8px] py-[5px] text-right text-[10px] text-[var(--color-hex-a0a0a0)] outline-none"
                    />
                    <span className="text-[8.5px] text-[var(--color-hex-444444)]">USD</span>
                </div>
            </Field>
            <Field label="DEFAULT MODE">
                <Chips options={["ONE-DAY", "ZERO-DAY"]} value="ONE-DAY" onChange={() => {}} />
            </Field>
            <Field label="DEFAULT SURFACE">
                <Chips
                    options={["WEB APPLICATION", "GRAPHQL", "MULTI-HOST"]}
                    value="WEB APPLICATION"
                    onChange={() => {}}
                />
            </Field>
            <Field label="ROE TEXT">
                <textarea
                    defaultValue="No destructive actions. No data exfiltration beyond evidence collection. No lateral movement beyond defined scope. Stop on any sign of production data exposure. Authorized targets only."
                    className="font-inherit min-h-[80px] w-full rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[12px] py-[10px] text-[10px] leading-[1.8] tracking-[0.04em] text-[var(--color-hex-888888)] outline-none"
                    style={{
                        resize: "vertical",
                        boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-hex-e31b23)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--color-hex-1e1e1e)")}
                />
            </Field>
            <SectionHead label="DANGER ZONE" />
            <div className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-ff2a3244)] bg-[var(--color-hex-0a0605)] px-[16px] py-[14px]">
                <div className="mb-[8px] text-[9px] tracking-[0.16em] text-[var(--color-hex-ff2a32)]">
                    DESTRUCTIVE ACTIONS
                </div>
                <div className="flex gap-3">
                    {["CLEAR ALL MISSIONS", "RESET KNOWLEDGE BASE", "FACTORY RESET"].map((a) => (
                        <button
                            key={a}
                            className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-ff2a3266)] bg-[transparent] px-[10px] py-[5px] text-[8.5px] tracking-[0.1em] text-[var(--color-hex-ff2a32)]"
                        >
                            {a}
                        </button>
                    ))}
                </div>
            </div>
            {/* DEV REFERENCE collapsible */}
            <div className="mt-[24px]">
                <button
                    onClick={() => setDevRef(!devRef)}
                    className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[transparent] px-[10px] py-[4px] text-[8px] tracking-[0.14em] text-[var(--color-hex-333333)]"
                >
                    {devRef ? "▾" : "▸"} DEV REFERENCE
                </button>
                {devRef && (
                    <div className="mt-[10px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a1a1a)] bg-[var(--color-hex-0b0b0b)] px-[14px] py-[10px] text-[9px] leading-[1.8] tracking-[0.06em] text-[var(--color-hex-444444)]">
                        Modal states: ELIGIBLE · IN_PROGRESS · EXPLOITED · BLOCKED · INFEASIBLE ·
                        DEPRIORITIZED
                        <br />
                        Finding states: PENDING · RETRY · VALIDATED · RULED OUT
                        <br />
                        Mission states: RUNNING · PAUSED · VALIDATING · QUEUED · COMPLETED ·
                        TERMINATED
                    </div>
                )}
            </div>
            <SaveBar />
        </div>
    );
}

/* ── MODELS ── */
const MODEL_OPTIONS = ["claude-opus-5", "claude-sonnet-5", "claude-haiku-4-5"];
function ModelSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[12px] py-[7px] text-[10px] text-[var(--color-hex-a0a0a0)] outline-none"
        >
            {MODEL_OPTIONS.map((m) => (
                <option key={m} value={m}>
                    {m}
                </option>
            ))}
        </select>
    );
}
function ModelSettings() {
    const [specialist, setSpecialist] = useState("claude-sonnet-5");
    const [manager, setManager] = useState("claude-opus-5");
    const [validator, setValidator] = useState("claude-haiku-4-5");
    return (
        <div className="max-w-[600px] flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="MODEL ASSIGNMENTS" />
            <Field label="SPECIALIST AGENTS">
                <ModelSelect value={specialist} onChange={setSpecialist} />
            </Field>
            <Field label="TEAM MANAGER">
                <ModelSelect value={manager} onChange={setManager} />
            </Field>
            <Field label="VALIDATION AGENT">
                <ModelSelect value={validator} onChange={setValidator} />
            </Field>
            <SectionHead label="INFERENCE SETTINGS" />
            <Field label="MAX TOKENS PER CALL">
                <div className="flex items-center gap-2 focus:border-[var(--color-hex-e31b23)]">
                    <input
                        defaultValue="8192"
                        className="font-inherit w-[80px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[8px] py-[5px] text-right text-[10px] text-[var(--color-hex-a0a0a0)] outline-none"
                    />
                    <span className="text-[8.5px] text-[var(--color-hex-444444)]">tokens</span>
                </div>
            </Field>
            <Field label="TEMPERATURE">
                <input
                    defaultValue="0.7"
                    className="font-inherit w-[80px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[8px] py-[5px] text-right text-[10px] text-[var(--color-hex-a0a0a0)] outline-none focus:border-[var(--color-hex-e31b23)]"
                />
            </Field>
            {[
                {
                    l: "ENABLE PROMPT CACHING",
                    on: true,
                },
                {
                    l: "STREAMING RESPONSES",
                    on: true,
                },
            ].map((s) => (
                <div key={s.l} className="mb-4 flex items-center justify-between">
                    <span className="text-[10px] text-[var(--color-hex-888888)]">{s.l}</span>
                    <Toggle on={s.on} />
                </div>
            ))}
            <SaveBar />
        </div>
    );
}

/* ── MISSIONS ── */
function MissionsSettings() {
    const [surface, setSurface] = useState("WEB APPLICATION");
    const [mode, setMode] = useState("ONE-DAY");
    return (
        <div className="max-w-[600px] flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="MISSION DEFAULTS" />
            <Field label="DEFAULT SURFACE">
                <Chips
                    options={["WEB APPLICATION", "GRAPHQL", "MULTI-HOST"]}
                    value={surface}
                    onChange={setSurface}
                />
            </Field>
            <Field label="DEFAULT MODE">
                <Chips options={["ONE-DAY", "ZERO-DAY"]} value={mode} onChange={setMode} />
            </Field>
            <SectionHead label="AUTOMATION" />
            <ToggleRow label="AUTO-START VALIDATION AFTER EXPLOIT" on />
            <ToggleRow label="EARLY-STOP ON CRITICAL FINDING" on={false} />
            <SaveBar />
        </div>
    );
}

/* ── TOOLS ── */
function ToolsSettings() {
    const [timeout, setTimeout_] = useState("30");
    const [parallel, setParallel] = useState("4");
    const tools = ["nmap", "sqlmap", "curl", "ffuf", "nuclei", "gobuster", "hydra"];
    return (
        <div className="max-w-[600px] flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="EXECUTION LIMITS" />
            <FieldRow label="TOOL TIMEOUT" unit="seconds" value={timeout} onChange={setTimeout_} />
            <FieldRow label="MAX PARALLEL TOOL CALLS" value={parallel} onChange={setParallel} />
            <SectionHead label="TOOL ALLOWLIST" />
            {tools.map((t) => (
                <div
                    key={t}
                    className="mb-4 flex items-center justify-between"
                    style={{
                        borderBottom: "1px solid var(--color-hex-111111)",
                        paddingBottom: 10,
                    }}
                >
                    <span className="font-inherit text-[10px] tracking-[0.08em] text-[var(--color-hex-888888)]">
                        {t}
                    </span>
                    <Toggle on={["nmap", "sqlmap", "curl", "ffuf", "nuclei"].includes(t)} />
                </div>
            ))}
            <SaveBar />
        </div>
    );
}

/* ── MEMORY ── */
function MemorySettings() {
    const [thresh, setThresh] = useState("85");
    const [maxEp, setMaxEp] = useState("500");
    const [skillProm, setSkillProm] = useState("3");
    return (
        <div className="max-w-[600px] flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="CONTEXT MANAGEMENT" />
            <FieldRow
                label="COMPACTION THRESHOLD"
                unit="% context used"
                value={thresh}
                onChange={setThresh}
            />
            <FieldRow label="MAX EPISODIC ENTRIES" value={maxEp} onChange={setMaxEp} />
            <SectionHead label="SKILL LIBRARY" />
            <FieldRow
                label="SKILL PROMOTION THRESHOLD"
                unit="successful uses"
                value={skillProm}
                onChange={setSkillProm}
            />
            <SaveBar />
        </div>
    );
}

/* ── VDG ── */
function VDGSettings() {
    const [c, setC] = useState("0.40");
    const [eordThresh, setEordThresh] = useState("3");
    const [retryCap, setRetryCap] = useState("3");
    return (
        <div className="max-w-[600px] flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="UCB POLICY" />
            <FieldRow label="UCB EXPLORATION CONSTANT c" value={c} onChange={setC} />
            <SectionHead label="DISPATCH THRESHOLDS" />
            <FieldRow
                label="E_ORD DISPATCH THRESHOLD"
                unit="min E_ord to dispatch"
                value={eordThresh}
                onChange={setEordThresh}
            />
            <FieldRow
                label="RETRY CAP PER NODE"
                unit="attempts"
                value={retryCap}
                onChange={setRetryCap}
            />
            <SaveBar />
        </div>
    );
}

/* ── VALIDATION ── */
function ValidationSettings() {
    const [retries, setRetries] = useState("3");
    const [timeout, setTimeout_] = useState("60");
    return (
        <div className="max-w-[600px] flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="ORACLE SETTINGS" />
            <FieldRow label="MAX ORACLE RETRIES" value={retries} onChange={setRetries} />
            <FieldRow
                label="ORACLE TIMEOUT"
                unit="seconds"
                value={timeout}
                onChange={setTimeout_}
            />
            <SectionHead label="REQUIREMENTS" />
            <ToggleRow label="REQUIRE ORACLE FOR CRITICAL FINDINGS" on />
            <SaveBar />
        </div>
    );
}

/* ── BENCHMARKS ── */
function BenchmarksSettings() {
    const [suite, setSuite] = useState("CVE-BENCH");
    const [runs, setRuns] = useState("3");
    const [budget, setBudget] = useState("5.00");
    return (
        <div className="max-w-[600px] flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="DEFAULT SUITE" />
            <Field label="BENCHMARK SUITE">
                <Chips
                    options={["CVE-BENCH", "PREDIQL", "MHBENCH"]}
                    value={suite}
                    onChange={setSuite}
                />
            </Field>
            <SectionHead label="RUN PARAMETERS" />
            <FieldRow label="RUNS PER CONDITION" value={runs} onChange={setRuns} />
            <FieldRow
                label="COMPUTE BUDGET PER RUN"
                unit="USD"
                value={budget}
                onChange={setBudget}
            />
            <SaveBar />
        </div>
    );
}

/* ── COST ── */
function CostSettings() {
    const [ceiling, setCeiling] = useState("10.00");
    const [perSpec, setPerSpec] = useState("2.00");
    const [alertPct, setAlertPct] = useState("80");
    return (
        <div className="max-w-[600px] flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="COST LIMITS" />
            <FieldRow
                label="GLOBAL COST CEILING"
                unit="USD"
                value={ceiling}
                onChange={setCeiling}
            />
            <FieldRow
                label="PER-SPECIALIST COST CAP"
                unit="USD"
                value={perSpec}
                onChange={setPerSpec}
            />
            <SectionHead label="ALERTS" />
            <FieldRow
                label="COST ALERT THRESHOLD"
                unit="% of ceiling"
                value={alertPct}
                onChange={setAlertPct}
            />
            <SaveBar />
        </div>
    );
}

/* ── SECURITY ── */
function SecuritySettings() {
    const [sessionTimeout, setSessionTimeout] = useState("60");
    const [retention, setRetention] = useState("90");
    return (
        <div className="max-w-[600px] flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="AUTHENTICATION" />
            <ToggleRow label="REQUIRE MFA" on />
            <FieldRow
                label="SESSION TIMEOUT"
                unit="minutes"
                value={sessionTimeout}
                onChange={setSessionTimeout}
            />
            <SectionHead label="AUDIT" />
            <FieldRow
                label="AUDIT LOG RETENTION"
                unit="days"
                value={retention}
                onChange={setRetention}
            />
            <SaveBar />
        </div>
    );
}
