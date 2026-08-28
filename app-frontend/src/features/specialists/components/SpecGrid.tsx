import React from "react";

import { SPEC_STATUS, type Specialist, type SpecStatus } from "@/types/domain-types";

export const DOT: Record<SpecStatus, string> = {
    [SPEC_STATUS.RUNNING]: "var(--color-brand)",
    [SPEC_STATUS.IDLE]: "var(--color-hex-333333)",
    [SPEC_STATUS.QUEUED]: "var(--color-hex-555555)",
    [SPEC_STATUS.WAITING]: "var(--color-warning)",
    [SPEC_STATUS.VALIDATING]: "var(--color-danger)",
    [SPEC_STATUS.COMPLETED]: "var(--color-success)",
    [SPEC_STATUS.FAILED]: "var(--color-danger)",
    [SPEC_STATUS.BLOCKED]: "var(--color-hex-6f171b)",
};

export const BADGE_BG: Record<SpecStatus, string> = {
    [SPEC_STATUS.RUNNING]: "var(--color-hex-1a0608)",
    [SPEC_STATUS.IDLE]: "transparent",
    [SPEC_STATUS.QUEUED]: "transparent",
    [SPEC_STATUS.WAITING]: "var(--color-hex-1a1200)",
    [SPEC_STATUS.VALIDATING]: "var(--color-hex-1a0608)",
    [SPEC_STATUS.COMPLETED]: "var(--color-hex-0a1a10)",
    [SPEC_STATUS.FAILED]: "var(--color-hex-1a0608)",
    [SPEC_STATUS.BLOCKED]: "var(--color-hex-0d0808)",
};

export function Kv({ k, v, red }: { k: string; v: string; red?: boolean }) {
    return (
        <div>
            <div className="tracking-wider-1 text-xs text-[var(--color-hex-333333)]">{k}</div>
            <div
                className="tracking-tight-1 overflow-hidden text-base whitespace-nowrap"
                style={{
                    color: red ? "var(--color-brand)" : "var(--color-hex-555555)",
                    textOverflow: "ellipsis",
                }}
            >
                {v}
            </div>
        </div>
    );
}

function SpecCard({
    s,
    onSelect,
    layerAccent,
}: {
    s: Specialist;
    onSelect: (s: Specialist) => void;
    layerAccent?: string;
}) {
    const dot = DOT[s.status];
    const bg = BADGE_BG[s.status];
    const running = s.status === SPEC_STATUS.RUNNING || s.status === SPEC_STATUS.VALIDATING;

    return (
        <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`font-inherit relative flex cursor-pointer flex-col rounded-[2px] border border-solid bg-[var(--color-hex-0d0d0d)] text-left transition-colors duration-100 ${running ? "border-[var(--color-brand)] hover:border-[var(--color-danger)]" : "border-[var(--color-hex-1e1e1e)] hover:border-[var(--color-hex-333333)]"}`}
            style={{ padding: "14px 14px 12px" }}
        >
            {running && (
                <div
                    className="absolute rounded-[3px] border-[1px] border-solid border-[var(--color-hex-e31b2330)]"
                    style={{ inset: -3, pointerEvents: "none", animation: "ring 2s ease infinite" }}
                />
            )}
            {/* Layer badge — top-left micro-label */}
            {layerAccent && (
                <div
                    className="tracking-wider-3 mb-[6px] text-xs font-semibold"
                    style={{ color: layerAccent }}
                >
                    {s.layer === 3 ? "L3 SPECIALIST" : "L4 VALIDATION"}
                    {s.phase != null && s.phaseTotal != null && (
                        <span className="ml-[6px] text-[var(--color-hex-333333)]">
                            {s.phase}/{s.phaseTotal}
                        </span>
                    )}
                </div>
            )}
            <div className="mb-2 flex items-center justify-between">
                <div
                    className="h-[8px] w-[8px] shrink-0"
                    style={{
                        borderRadius: "50%",
                        background:
                            s.status !== SPEC_STATUS.IDLE && s.status !== SPEC_STATUS.QUEUED
                                ? dot
                                : "transparent",
                        border: `1px solid ${dot}`,
                        animation: running ? "pulse 1.4s ease infinite" : "none",
                    }}
                />
                <span
                    className="rounded-[2px] px-[5px] py-[1px] text-sm font-semibold tracking-wide"
                    style={{ color: dot, background: bg, border: `1px solid ${dot}44` }}
                >
                    {s.status}
                </span>
            </div>
            <div className="leading-tight-1 mb-[4px] text-lg font-bold tracking-normal text-[var(--color-hex-a0a0a0)]">
                {s.role}
            </div>
            <div className="text-base-tight tracking-tight-1 mb-[10px] min-h-[28px] text-[var(--color-hex-444444)]">
                {s.task}
            </div>
            <div className="mb-[8px] h-[1px] bg-[var(--color-hex-1a1a1a)]" />
            <div className="grid grid-cols-2 gap-1">
                <Kv k="NODE" v={s.node} />
                <Kv k="CTX" v={s.context} />
                <Kv k="EL" v={String(s.evidence)} />
                <Kv k="FAILURES" v={String(s.failures)} red={s.failures > 0} />
            </div>
        </button>
    );
}

function LayerSection({
    title,
    label,
    accent,
    specs,
    onSelect,
}: {
    title: string;
    label: string;
    accent: string;
    specs: Specialist[];
    onSelect: (s: Specialist) => void;
}) {
    if (specs.length === 0) {
        return null;
    }
    return (
        <div className="mb-[24px]">
            <div className="mb-[10px] flex items-center gap-3">
                <div className="tracking-widest-2 text-sm font-semibold" style={{ color: accent }}>
                    {title}
                </div>
                <div className="h-[1px] flex-1" style={{ background: `${accent}22` }} />
                <div className="tracking-wider-1 text-xs text-[var(--color-hex-444444)]">
                    {label}
                </div>
                <div
                    className="rounded-[2px] px-[5px] py-[1px] text-xs font-bold"
                    style={{
                        color: accent,
                        border: `1px solid ${accent}44`,
                        background: `${accent}11`,
                    }}
                >
                    {specs.length}
                </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
                {specs.map((s) => (
                    <SpecCard key={s.id} s={s} onSelect={onSelect} layerAccent={accent} />
                ))}
            </div>
        </div>
    );
}

export function SpecGrid({
    onSelect,
    specialists,
    isLoading,
}: {
    onSelect: (s: Specialist) => void;
    specialists: Specialist[];
    isLoading: boolean;
}) {
    // Layer 3 = Specialist, Layer 4 = Validation/Execution Agent
    const layer3 = specialists.filter((s) => s.layer === 3);
    const layer4 = specialists.filter((s) => s.layer === 4);
    // Any without layer field (legacy) — show in layer 3 bucket
    const layerless = specialists.filter((s) => s.layer == null);

    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{ borderBottom: "1px solid var(--color-hex-1e1e1e)" }}
            >
                <div className="tracking-widest-2 mb-[3px] text-base text-[var(--color-hex-666666)]">
                    MISSION
                </div>
                <div className="flex items-baseline gap-3">
                    <h1 className="text-9xl font-bold tracking-wide text-[var(--color-fg)]">
                        SPECIALISTS
                    </h1>
                    <span className="tracking-wider-3 text-lg text-[var(--color-hex-444444)]">
                        AGENT ROSTER · CVE-001
                    </span>
                    {/* Layer breakdown badge */}
                    {!isLoading && (
                        <span className="tracking-wider-1 ml-auto text-sm text-[var(--color-hex-333333)]">
                            L3:{layer3.length + layerless.length} · L4:{layer4.length}
                        </span>
                    )}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
                {isLoading ? (
                    <div className="mt-10 text-center text-lg tracking-normal text-[var(--color-hex-666666)]">
                        LOADING SPECIALISTS...
                    </div>
                ) : (
                    <>
                        {/* Layer 3 — Specialist Agents */}
                        <LayerSection
                            title="LAYER 3 — SPECIALIST AGENTS"
                            label="Perform targeted attack; produce structured evidence"
                            accent="var(--color-brand)"
                            specs={[...layer3, ...layerless]}
                            onSelect={onSelect}
                        />
                        {/* Layer 4 — Validation / Execution Agents */}
                        <LayerSection
                            title="LAYER 4 — VALIDATION / EXECUTION"
                            label="Oracle assertion, multi-host pivot, rate-limited execution"
                            accent="var(--color-warning)"
                            specs={layer4}
                            onSelect={onSelect}
                        />
                    </>
                )}
            </div>
            <style>{`@keyframes ring{0%,100%{opacity:.5}50%{opacity:.1}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
        </div>
    );
}
