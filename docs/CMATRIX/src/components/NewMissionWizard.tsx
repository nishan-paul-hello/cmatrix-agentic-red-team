import { useState } from "react";

const STEPS = [
  { index: 1, id: "target",  label: "TARGET" },
  { index: 2, id: "roe",     label: "RULES OF ENGAGEMENT" },
  { index: 3, id: "surface", label: "ATTACK SURFACE" },
  { index: 4, id: "mode",    label: "MISSION MODE" },
  { index: 5, id: "review",  label: "REVIEW" },
];

type TargetType   = "URL" | "HOST" | "BENCHMARK ENVIRONMENT";
type SurfaceType  = "WEB APPLICATION" | "GRAPHQL" | "MULTI-HOST";
type ModeType     = "ONE-DAY" | "ZERO-DAY";

interface WizardProps {
  onCancel: () => void;
  initialStep?: number;
}

export default function NewMissionWizard({ onCancel, initialStep }: WizardProps) {
  const [step, setStep] = useState(initialStep ?? 1);

  // Step 1 state
  const [target, setTarget]         = useState("https://app.targetcorp.com");
  const [targetType, setTargetType] = useState<TargetType>("URL");

  // Step 3 state
  const [surface, setSurface] = useState<SurfaceType>("WEB APPLICATION");

  // Step 4 state
  const [mode, setMode] = useState<ModeType>("ONE-DAY");

  // Step 2 state
  const [roe, setRoe]               = useState("Do not access, modify, or exfiltrate data beyond what is necessary to demonstrate the vulnerability. Avoid persistent modifications to the target environment. All exploitation attempts must be reversible. Do not pivot to out-of-scope hosts. Cease all activity immediately upon cost ceiling or runtime threshold breach.");
  const [maxRuntime, setMaxRuntime] = useState("10");
  const [costCeiling, setCostCeiling] = useState("10.00");
  const [toolTimeout, setToolTimeout] = useState("120");

  const costNum    = parseFloat(costCeiling) || 0;
  const runtimeNum = parseInt(maxRuntime) || 0;
  const timeoutNum = parseInt(toolTimeout) || 0;

  function runtimeLabel() {
    if (!runtimeNum) return "—";
    return `${runtimeNum} min / vulnerability`;
  }

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
      {/* Page header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #1E1E1E" }}>
        <div style={{ fontSize: 9, color: "#666666", letterSpacing: "0.22em", marginBottom: 3 }}>MISSIONS</div>
        <div className="flex items-baseline gap-3">
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F2F2F2", letterSpacing: "0.12em" }}>NEW MISSION</h1>
          <span style={{ fontSize: 10, color: "#444444", letterSpacing: "0.18em" }}>MISSION CONFIGURATION WIZARD</span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex-shrink-0 px-6 py-4" style={{ borderBottom: "1px solid #1E1E1E", background: "#0B0B0B" }}>
        <div className="flex items-center">
          {STEPS.map((s, i) => {
            const active = s.index === step;
            const done   = s.index < step;
            return (
              <div key={s.id} className="flex items-center">
                {i > 0 && <div style={{ width: 40, height: 1, background: done ? "#E31B23" : "#292929", flexShrink: 0 }} />}
                <div className="flex flex-col items-center gap-1.5">
                  <div style={{
                    width: 26, height: 26, borderRadius: 2, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                    border: active ? "1px solid #E31B23" : done ? "1px solid #9E1118" : "1px solid #292929",
                    background: active ? "#1A0A0B" : done ? "#120608" : "#111111",
                    color: active ? "#FF2A32" : done ? "#9E1118" : "#444444",
                  }}>
                    {done ? "✓" : s.index}
                  </div>
                  <span style={{ fontSize: 7.5, color: active ? "#A0A0A0" : done ? "#6F171B" : "#333333", letterSpacing: "0.16em", whiteSpace: "nowrap" }}>
                    {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div style={{ maxWidth: 600 }}>

            {/* ── STEP 1: TARGET ── */}
            {step === 1 && (
              <>
                <StepHeading step={1} label="TARGET" />
                <FieldBlock label="TARGET" hint="Enter a URL, hostname, or IP address / CIDR range to test." mb>
                  <TextInput value={target} onChange={setTarget} />
                </FieldBlock>
                <Divider />
                <FieldBlock label="TARGET TYPE">
                  <RadioGroup<TargetType>
                    value={targetType}
                    onChange={setTargetType}
                    options={[
                      { value: "URL",                  desc: "HTTP/HTTPS web application endpoint. Enables web-layer attack surface." },
                      { value: "HOST",                 desc: "Hostname or IP address / CIDR range. Enables network and multi-host surface." },
                      { value: "BENCHMARK ENVIRONMENT",desc: "Sandboxed benchmark target (CVE-Bench, PrediQL, MH-Bench). Oracle validation available." },
                    ]}
                  />
                </FieldBlock>
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
                    className="w-full outline-none resize-none"
                    style={{
                      background: "#111111",
                      border: "1px solid #333333",
                      borderRadius: 2,
                      color: "#A0A0A0",
                      fontSize: 11,
                      padding: "10px 14px",
                      fontFamily: "inherit",
                      letterSpacing: "0.03em",
                      lineHeight: 1.7,
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#E31B23")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#333333")}
                  />
                </FieldBlock>

                <Divider />

                {/* Numeric fields */}
                <div style={{ fontSize: 9.5, color: "#666666", letterSpacing: "0.2em", marginBottom: 16 }}>
                  OPERATIONAL LIMITS
                </div>

                <div className="flex flex-col gap-0" style={{ border: "1px solid #292929", borderRadius: 2, overflow: "hidden" }}>
                  {/* MAXIMUM RUNTIME */}
                  <div
                    className="flex items-center justify-between"
                    style={{ padding: "14px 16px", borderBottom: "1px solid #1E1E1E", background: "#0D0D0D" }}
                  >
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "#A0A0A0", letterSpacing: "0.16em", marginBottom: 3 }}>MAXIMUM RUNTIME</div>
                      <div style={{ fontSize: 9, color: "#444444", letterSpacing: "0.1em" }}>Minutes allowed per vulnerability before the specialist is retired.</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-6">
                      <input
                        type="number"
                        value={maxRuntime}
                        onChange={(e) => setMaxRuntime(e.target.value)}
                        min={1}
                        max={120}
                        className="outline-none text-right"
                        style={{
                          width: 56,
                          background: "#151515",
                          border: "1px solid #333333",
                          borderRadius: 2,
                          color: "#F2F2F2",
                          fontSize: 13,
                          fontWeight: 600,
                          padding: "6px 8px",
                          fontFamily: "inherit",
                          letterSpacing: "0.04em",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#E31B23")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#333333")}
                      />
                      <span style={{ fontSize: 9.5, color: "#444444", letterSpacing: "0.12em", whiteSpace: "nowrap" }}>min / vuln</span>
                    </div>
                  </div>

                  {/* COST CEILING */}
                  <div
                    className="flex items-center justify-between"
                    style={{ padding: "14px 16px", borderBottom: "1px solid #1E1E1E", background: "#0D0D0D" }}
                  >
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "#A0A0A0", letterSpacing: "0.16em", marginBottom: 3 }}>COST CEILING</div>
                      <div style={{ fontSize: 9, color: "#444444", letterSpacing: "0.1em" }}>Maximum total LLM spend before human escalation is triggered.</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-6">
                      <span style={{ fontSize: 12, color: "#666666" }}>$</span>
                      <input
                        type="number"
                        value={costCeiling}
                        onChange={(e) => setCostCeiling(e.target.value)}
                        min={0.5}
                        step={0.5}
                        className="outline-none text-right"
                        style={{
                          width: 64,
                          background: "#151515",
                          border: "1px solid #333333",
                          borderRadius: 2,
                          color: "#F2F2F2",
                          fontSize: 13,
                          fontWeight: 600,
                          padding: "6px 8px",
                          fontFamily: "inherit",
                          letterSpacing: "0.04em",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#E31B23")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#333333")}
                      />
                    </div>
                  </div>

                  {/* TOOL TIMEOUT */}
                  <div
                    className="flex items-center justify-between"
                    style={{ padding: "14px 16px", background: "#0D0D0D" }}
                  >
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "#A0A0A0", letterSpacing: "0.16em", marginBottom: 3 }}>TOOL TIMEOUT</div>
                      <div style={{ fontSize: 9, color: "#444444", letterSpacing: "0.1em" }}>Maximum wall-clock seconds a single tool invocation may run.</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-6">
                      <input
                        type="number"
                        value={toolTimeout}
                        onChange={(e) => setToolTimeout(e.target.value)}
                        min={10}
                        max={600}
                        step={10}
                        className="outline-none text-right"
                        style={{
                          width: 56,
                          background: "#151515",
                          border: "1px solid #333333",
                          borderRadius: 2,
                          color: "#F2F2F2",
                          fontSize: 13,
                          fontWeight: 600,
                          padding: "6px 8px",
                          fontFamily: "inherit",
                          letterSpacing: "0.04em",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#E31B23")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#333333")}
                      />
                      <span style={{ fontSize: 9.5, color: "#444444", letterSpacing: "0.12em" }}>sec</span>
                    </div>
                  </div>
                </div>

                {/* Warning callout when cost is high */}
                {costNum > 50 && (
                  <div className="flex items-start gap-3 mt-4" style={{ background: "#120F00", border: "1px solid #D29922", borderRadius: 2, padding: "10px 14px" }}>
                    <span style={{ fontSize: 11, color: "#D29922", flexShrink: 0 }}>⚠</span>
                    <span style={{ fontSize: 9.5, color: "#D29922", letterSpacing: "0.08em", lineHeight: 1.6 }}>
                      Cost ceiling above $50 — human escalation will only trigger at high spend. Ensure this is intentional.
                    </span>
                  </div>
                )}
              </>
            )}

            {/* ── STEP 3: ATTACK SURFACE ── */}
            {step === 3 && (
              <>
                <StepHeading step={3} label="ATTACK SURFACE" />
                <div style={{ fontSize: 9.5, color: "#666666", letterSpacing: "0.14em", marginBottom: 20, lineHeight: 1.7 }}>
                  Select the attack surface to engage. This determines which specialist agents are spawned and which vulnerability classes are eligible for testing.
                </div>
                <SurfaceCards value={surface} onChange={setSurface} />
              </>
            )}

            {/* ── STEP 4: MISSION MODE ── */}
            {step === 4 && (
              <>
                <StepHeading step={4} label="MISSION MODE" />
                <div style={{ fontSize: 9.5, color: "#666666", letterSpacing: "0.14em", marginBottom: 24, lineHeight: 1.7 }}>
                  Select the knowledge mode under which the system operates. This controls whether a CVE identifier hint is injected into the team manager context at mission start.
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
        <div className="flex-shrink-0 flex flex-col overflow-y-auto" style={{ width: 264, borderLeft: "1px solid #1E1E1E", background: "#0B0B0B" }}>
          <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid #1E1E1E" }}>
            <div style={{ fontSize: 9, color: "#444444", letterSpacing: "0.2em", marginBottom: 10 }}>MISSION SUMMARY</div>
            <div className="flex flex-col gap-3">
              <MetaRow label="TARGET"       value={target || "—"} highlight />
              <MetaRow label="TARGET TYPE"  value={targetType} />
              <MetaRow label="SURFACE"      value={step >= 3 ? surface : "—"} />
              <MetaRow label="MODE"         value={step >= 4 ? mode : "—"} />
              <MetaRow label="MAX RUNTIME"  value={runtimeNum ? runtimeLabel() : "—"} />
              <MetaRow label="COST CEILING" value={costNum ? `$${costNum.toFixed(2)}` : "—"} highlight={costNum > 0} />
              <MetaRow label="TOOL TIMEOUT" value={timeoutNum ? `${timeoutNum}s` : "—"} />
            </div>
          </div>

          {/* ROE preview */}
          {step >= 2 && roe && (
            <div className="px-5 pt-4 pb-4" style={{ borderBottom: "1px solid #1E1E1E" }}>
              <div style={{ fontSize: 9, color: "#444444", letterSpacing: "0.2em", marginBottom: 8 }}>ROE PREVIEW</div>
              <div style={{ fontSize: 9, color: "#333333", letterSpacing: "0.06em", lineHeight: 1.7, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 6, WebkitBoxOrient: "vertical" as const }}>
                {roe}
              </div>
            </div>
          )}

          <div className="px-5 pt-4">
            <div style={{ fontSize: 9, color: "#444444", letterSpacing: "0.2em", marginBottom: 8 }}>VALIDATION</div>
            <div style={{ fontSize: 9, color: "#333333", letterSpacing: "0.1em", lineHeight: 1.8 }}>
              Oracle validation available for BENCHMARK ENVIRONMENT targets.
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4" style={{ borderTop: "1px solid #1E1E1E", background: "#0B0B0B" }}>
        <button
          onClick={onCancel}
          style={{ background: "transparent", border: "1px solid #292929", borderRadius: 2, color: "#666666", fontSize: 10, letterSpacing: "0.18em", padding: "7px 18px", cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#444444")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#292929")}
        >
          CANCEL
        </button>
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              style={{ background: "transparent", border: "1px solid #292929", borderRadius: 2, color: "#A0A0A0", fontSize: 10, letterSpacing: "0.18em", padding: "7px 18px", cursor: "pointer", fontFamily: "inherit" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#444444")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#292929")}
            >
              ← BACK
            </button>
          )}
          <button
            onClick={() => step < 5 && setStep((s) => s + 1)}
            style={{
              background: "#E31B23", border: "none", borderRadius: 2, color: "#F2F2F2",
              fontSize: 10, fontWeight: 600, letterSpacing: "0.18em",
              padding: step === 5 ? "8px 32px" : "8px 24px",
              cursor: "pointer", fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FF2A32")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#E31B23")}
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
    <div className="flex items-center gap-3 mb-7">
      <div style={{ width: 2, height: 20, background: "#E31B23" }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: "#F2F2F2", letterSpacing: "0.16em" }}>
        STEP {step} — {label}
      </span>
    </div>
  );
}

function FieldBlock({ label, hint, mb, children }: { label: string; hint?: string; mb?: boolean; children: React.ReactNode }) {
  return (
    <div className={mb ? "mb-7" : ""}>
      <label style={{ display: "block", fontSize: 9.5, color: "#666666", letterSpacing: "0.2em", marginBottom: 8 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 9, color: "#444444", marginTop: 6, letterSpacing: "0.12em" }}>{hint}</div>}
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
      className="w-full outline-none"
      style={{ background: "#111111", border: "1px solid #333333", borderRadius: 2, color: "#F2F2F2", fontSize: 12, padding: "10px 14px", fontFamily: "inherit", letterSpacing: "0.04em" }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#E31B23")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#333333")}
    />
  );
}

function RadioGroup<T extends string>({ value, onChange, options }: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; desc: string }[];
}) {
  return (
    <div className="flex flex-col" style={{ border: "1px solid #292929", borderRadius: 2, overflow: "hidden" }}>
      {options.map((opt, i) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="flex items-start gap-4 text-left w-full"
            style={{
              background: selected ? "#120608" : "#0D0D0D",
              borderLeft: selected ? "3px solid #E31B23" : "3px solid transparent",
              borderTop: i > 0 ? "1px solid #1E1E1E" : "none",
              padding: "12px 16px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = "#111111"; }}
            onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = "#0D0D0D"; }}
          >
            <div style={{ width: 14, height: 14, borderRadius: "50%", border: `1px solid ${selected ? "#E31B23" : "#333333"}`, background: selected ? "#E31B23" : "transparent", flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {selected && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#F2F2F2" }} />}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: selected ? "#F2F2F2" : "#666666", letterSpacing: "0.14em", marginBottom: 3 }}>{opt.value}</div>
              <div style={{ fontSize: 9.5, color: "#444444", letterSpacing: "0.06em", lineHeight: 1.5 }}>{opt.desc}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#1E1E1E", marginBottom: 28, marginTop: 4 }} />;
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
    description: "Full web-layer attack surface. Enumerates endpoints, parameters, and authentication state before attempting exploitation.",
  },
  {
    value: "GRAPHQL",
    proto: "GraphQL / HTTP",
    icon: "◈",
    tags: ["Schema Introspection", "Dependency Injection", "IDOR", "Batching Attacks", "Auth Bypass"],
    specialists: ["RECON", "GRAPHQL", "INJECTION", "VALIDATION"],
    description: "GraphQL schema discovery and exploitation. Tests field-level authorization, nested query abuse, and injection via arguments.",
  },
  {
    value: "MULTI-HOST",
    proto: "TCP / Network",
    icon: "◉",
    tags: ["Lateral Movement", "Privilege Escalation", "Credential Reuse", "Service Exploit", "Pivoting"],
    specialists: ["RECON", "NETWORK", "LATERAL", "PRIVESC", "VALIDATION"],
    description: "Multi-host network engagement. Maps topology, pivots across trust boundaries, and escalates privileges across hosts.",
  },
];

function SurfaceCards({ value, onChange }: { value: SurfaceType; onChange: (v: SurfaceType) => void }) {
  return (
    <div className="flex gap-4" style={{ alignItems: "stretch" }}>
      {SURFACE_OPTIONS.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="flex flex-col text-left flex-1"
            style={{
              background: selected ? "#120608" : "#0D0D0D",
              border: `1px solid ${selected ? "#E31B23" : "#292929"}`,
              borderRadius: 2,
              padding: "18px 16px 16px",
              cursor: "pointer",
              fontFamily: "inherit",
              position: "relative",
              transition: "border-color 0.1s, background 0.1s",
            }}
            onMouseEnter={(e) => { if (!selected) { e.currentTarget.style.borderColor = "#444444"; e.currentTarget.style.background = "#111111"; } }}
            onMouseLeave={(e) => { if (!selected) { e.currentTarget.style.borderColor = "#292929"; e.currentTarget.style.background = "#0D0D0D"; } }}
          >
            {/* Selected indicator */}
            {selected && (
              <div style={{ position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: "50%", background: "#E31B23" }} />
            )}

            {/* Icon + name */}
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: 16, color: selected ? "#E31B23" : "#444444" }}>{opt.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: selected ? "#F2F2F2" : "#666666", letterSpacing: "0.16em" }}>
                {opt.value}
              </span>
            </div>

            {/* Protocol */}
            <div style={{ fontSize: 9, color: selected ? "#9E1118" : "#333333", letterSpacing: "0.16em", marginBottom: 12, fontWeight: 600 }}>
              {opt.proto}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: selected ? "#2A0A0C" : "#1A1A1A", marginBottom: 12 }} />

            {/* Description */}
            <div style={{ fontSize: 9.5, color: "#555555", letterSpacing: "0.05em", lineHeight: 1.65, marginBottom: 14, flexGrow: 1 }}>
              {opt.description}
            </div>

            {/* Vuln class tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {opt.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 8.5,
                    color: selected ? "#E31B23" : "#444444",
                    background: selected ? "#1A0608" : "#111111",
                    border: `1px solid ${selected ? "#6F171B" : "#222222"}`,
                    borderRadius: 2,
                    padding: "1px 5px",
                    letterSpacing: "0.1em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: selected ? "#2A0A0C" : "#1A1A1A", marginBottom: 10 }} />

            {/* Specialists */}
            <div>
              <div style={{ fontSize: 8, color: "#444444", letterSpacing: "0.18em", marginBottom: 6 }}>SPECIALISTS</div>
              <div className="flex flex-wrap gap-1">
                {opt.specialists.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 8,
                      color: selected ? "#A0A0A0" : "#333333",
                      letterSpacing: "0.12em",
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
  implications: { label: string; detail: string }[];
}[] = [
  {
    value: "ONE-DAY",
    hint: "CVE HINT AVAILABLE",
    badge: "ASSISTED",
    badgeColor: "#D29922",
    difficulty: "STANDARD",
    icon: "◈",
    description: "The team manager receives a CVE identifier at mission start. The system uses this to bias UCB exploration toward known vulnerability classes and seed the VDG with informed candidate nodes.",
    implications: [
      { label: "CVE SEED",         detail: "CVE id injected into team manager system prompt." },
      { label: "VDG INIT",         detail: "Attack graph pre-seeded with CVE-class candidates." },
      { label: "UCB PRIOR",        detail: "EPSS score from CVE record used as UCB prior." },
      { label: "MEMORY LOOKUP",    detail: "Skill library queried for CVE-class patterns first." },
      { label: "ORACLE",           detail: "Oracle validation available on BENCHMARK targets." },
    ],
  },
  {
    value: "ZERO-DAY",
    hint: "NO CVE HINT",
    badge: "BLIND",
    badgeColor: "#E31B23",
    difficulty: "HARD",
    icon: "◆",
    description: "No CVE identifier is provided. The system must discover the vulnerability class through autonomous reconnaissance, environmental layer construction, and fully unsupervised VDG expansion.",
    implications: [
      { label: "NO SEED",          detail: "VDG initialized from surface heuristics only." },
      { label: "UCB PRIOR",        detail: "Uniform prior — no EPSS bias applied." },
      { label: "FULL RECON",       detail: "Complete recon pass required before exploitation." },
      { label: "HIGHER COST",      detail: "Typically 2–4× more LLM calls than ONE-DAY mode." },
      { label: "ORACLE",           detail: "Oracle validation available on BENCHMARK targets." },
    ],
  },
];

function ModeCards({ value, onChange }: { value: ModeType; onChange: (v: ModeType) => void }) {
  return (
    <div className="flex gap-5" style={{ alignItems: "stretch" }}>
      {MODE_OPTIONS.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="flex flex-col text-left flex-1"
            style={{
              background: selected ? "#120608" : "#0D0D0D",
              border: `1px solid ${selected ? "#E31B23" : "#292929"}`,
              borderRadius: 2,
              padding: "22px 20px 18px",
              cursor: "pointer",
              fontFamily: "inherit",
              position: "relative",
              transition: "border-color 0.1s, background 0.1s",
            }}
            onMouseEnter={(e) => { if (!selected) { e.currentTarget.style.borderColor = "#444444"; e.currentTarget.style.background = "#111111"; } }}
            onMouseLeave={(e) => { if (!selected) { e.currentTarget.style.borderColor = "#292929"; e.currentTarget.style.background = "#0D0D0D"; } }}
          >
            {/* Top row: icon + title + selected dot */}
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2.5">
                <span style={{ fontSize: 18, color: selected ? "#E31B23" : "#444444", lineHeight: 1 }}>{opt.icon}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: selected ? "#F2F2F2" : "#555555", letterSpacing: "0.14em" }}>
                  {opt.value}
                </span>
              </div>
              {selected && (
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E31B23", flexShrink: 0, marginTop: 4 }} />
              )}
            </div>

            {/* Hint + badges row */}
            <div className="flex items-center gap-2 mb-5">
              <span style={{ fontSize: 9, color: selected ? "#9E1118" : "#333333", letterSpacing: "0.2em", fontWeight: 600 }}>
                {opt.hint}
              </span>
              <span style={{ fontSize: 8.5, color: opt.badgeColor, background: `${opt.badgeColor}18`, border: `1px solid ${opt.badgeColor}44`, borderRadius: 2, padding: "1px 6px", letterSpacing: "0.16em", fontWeight: 600 }}>
                {opt.badge}
              </span>
              <span style={{ fontSize: 8.5, color: "#555555", background: "#151515", border: "1px solid #222222", borderRadius: 2, padding: "1px 6px", letterSpacing: "0.14em" }}>
                {opt.difficulty}
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: selected ? "#2A0A0C" : "#1A1A1A", marginBottom: 16 }} />

            {/* Description */}
            <div style={{ fontSize: 10, color: "#555555", letterSpacing: "0.04em", lineHeight: 1.7, marginBottom: 20, flexGrow: 1 }}>
              {opt.description}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: selected ? "#2A0A0C" : "#1A1A1A", marginBottom: 14 }} />

            {/* Implications list */}
            <div className="flex flex-col gap-2">
              {opt.implications.map((imp) => (
                <div key={imp.label} className="flex items-start gap-2">
                  <span style={{ fontSize: 8.5, color: selected ? "#E31B23" : "#333333", letterSpacing: "0.16em", fontWeight: 600, flexShrink: 0, minWidth: 96 }}>
                    {imp.label}
                  </span>
                  <span style={{ fontSize: 8.5, color: "#444444", letterSpacing: "0.06em", lineHeight: 1.5 }}>
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
  "GRAPHQL":         ["RECON", "GRAPHQL", "INJECTION", "VALIDATION"],
  "MULTI-HOST":      ["RECON", "NETWORK", "LATERAL", "PRIVESC", "VALIDATION"],
};

function ReviewStep({
  target, targetType, surface, mode, maxRuntime, costCeiling, toolTimeout, roe,
}: {
  target: string; targetType: TargetType; surface: SurfaceType; mode: ModeType;
  maxRuntime: string; costCeiling: string; toolTimeout: string; roe: string;
}) {
  const specialists = SURFACE_SPECIALISTS[surface];
  const isOracle    = targetType === "BENCHMARK ENVIRONMENT";
  const costNum     = parseFloat(costCeiling) || 0;

  const rows: { label: string; value: string; valueColor?: string; mono?: boolean; warn?: boolean }[] = [
    { label: "TARGET",       value: target || "—",                     valueColor: "#E31B23", mono: true },
    { label: "TARGET TYPE",  value: targetType },
    { label: "SURFACE",      value: surface },
    { label: "MODE",         value: mode,                               valueColor: mode === "ZERO-DAY" ? "#FF2A32" : "#D29922" },
    { label: "MAX RUNTIME",  value: `${maxRuntime} min / vulnerability` },
    { label: "COST CEILING", value: `$${parseFloat(costCeiling).toFixed(2)}`,
      valueColor: costNum > 50 ? "#D29922" : "#F2F2F2",
      warn: costNum > 50 },
    { label: "TOOL TIMEOUT", value: `${toolTimeout} seconds` },
    { label: "SPECIALISTS",  value: specialists.join("  ·  ") },
    { label: "VALIDATION",   value: isOracle ? "ORACLE CONFIRMED (CVE-BENCH)" : "E_ord THRESHOLD (≥ 4)" },
    { label: "MEMORY",       value: "ENABLED — Vulnerability patterns, strategies, episodic failures" },
    { label: "EARLY STOP",   value: "ENABLED — Halt on cost ceiling or runtime breach" },
  ];

  return (
    <>
      <StepHeading step={5} label="REVIEW & CONFIRM" />
      <div style={{ fontSize: 9.5, color: "#666666", letterSpacing: "0.12em", marginBottom: 24, lineHeight: 1.7 }}>
        Review the full mission configuration before launch. Once started, cost ceiling and rules of engagement cannot be modified.
      </div>

      {/* Main config table */}
      <div style={{ border: "1px solid #292929", borderRadius: 2, overflow: "hidden", marginBottom: 20 }}>
        {rows.map((row, i) => (
          <div
            key={row.label}
            className="flex"
            style={{ borderBottom: i < rows.length - 1 ? "1px solid #1A1A1A" : "none", background: i % 2 === 0 ? "#0D0D0D" : "#0B0B0B" }}
          >
            <div style={{ width: 148, flexShrink: 0, padding: "10px 16px", fontSize: 9, color: "#444444", letterSpacing: "0.2em", fontWeight: 600, borderRight: "1px solid #1A1A1A", display: "flex", alignItems: "center" }}>
              {row.label}
            </div>
            <div style={{ flex: 1, padding: "10px 16px", fontSize: 10.5, color: row.valueColor ?? "#A0A0A0", letterSpacing: "0.05em", lineHeight: 1.5, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "inherit" }}>{row.value}</span>
              {row.warn && (
                <span style={{ fontSize: 8.5, color: "#D29922", background: "#1A1200", border: "1px solid #D2992244", borderRadius: 2, padding: "1px 5px", letterSpacing: "0.12em", flexShrink: 0 }}>HIGH</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ROE block */}
      <div style={{ border: "1px solid #292929", borderRadius: 2, overflow: "hidden", marginBottom: 24 }}>
        <div style={{ padding: "8px 16px", background: "#111111", borderBottom: "1px solid #1A1A1A", fontSize: 9, color: "#444444", letterSpacing: "0.2em", fontWeight: 600 }}>
          RULES OF ENGAGEMENT
        </div>
        <div style={{ padding: "12px 16px", background: "#0D0D0D", fontSize: 10, color: "#555555", letterSpacing: "0.04em", lineHeight: 1.75 }}>
          {roe || "—"}
        </div>
      </div>

      {/* System confirmations */}
      <div style={{ border: "1px solid #1E1E1E", borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
        <div style={{ padding: "8px 16px", background: "#0B0B0B", borderBottom: "1px solid #1A1A1A", fontSize: 9, color: "#444444", letterSpacing: "0.2em", fontWeight: 600 }}>
          PRE-FLIGHT CHECKS
        </div>
        {[
          { ok: true,  label: "Target reachability",        detail: "DNS resolved — 104.21.3.212" },
          { ok: true,  label: "Cost ceiling configured",     detail: `$${parseFloat(costCeiling).toFixed(2)} ceiling set` },
          { ok: true,  label: "Specialist agents available", detail: `${specialists.length} agents ready` },
          { ok: isOracle, label: "Oracle validation",        detail: isOracle ? "CVE-BENCH oracle linked" : "Manual E_ord threshold (≥ 4)" },
          { ok: true,  label: "Memory subsystem",            detail: "Vulnerability pattern DB: 847 records" },
        ].map((chk, i, arr) => (
          <div
            key={chk.label}
            className="flex items-center gap-3"
            style={{ padding: "9px 16px", borderBottom: i < arr.length - 1 ? "1px solid #141414" : "none", background: "#0D0D0D" }}
          >
            <span style={{ fontSize: 11, color: chk.ok ? "#3FB950" : "#D29922", flexShrink: 0 }}>{chk.ok ? "✓" : "⚠"}</span>
            <span style={{ fontSize: 10, color: chk.ok ? "#A0A0A0" : "#D29922", letterSpacing: "0.08em", minWidth: 200 }}>{chk.label}</span>
            <span style={{ fontSize: 9, color: "#444444", letterSpacing: "0.06em" }}>{chk.detail}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function MetaRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 8, color: "#444444", letterSpacing: "0.18em", marginBottom: 1 }}>{label}</div>
      <div style={{ fontSize: 10, color: highlight ? "#E31B23" : "#666666", letterSpacing: "0.06em", wordBreak: "break-all" }}>{value}</div>
    </div>
  );
}
