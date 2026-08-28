import React from "react";

import { Button } from "@/components/ui/button";
import { SPEC_STATUS, type Specialist, type SpecStatus } from "@/types/domain-types";

export const DOT: Record<SpecStatus, string> = {
    [SPEC_STATUS.RUNNING]: "var(--primary)",
    [SPEC_STATUS.IDLE]: "var(--border)",
    [SPEC_STATUS.QUEUED]: "var(--muted-foreground)",
    [SPEC_STATUS.WAITING]: "var(--warning)",
    [SPEC_STATUS.VALIDATING]: "var(--destructive)",
    [SPEC_STATUS.COMPLETED]: "var(--success)",
    [SPEC_STATUS.FAILED]: "var(--destructive)",
    [SPEC_STATUS.BLOCKED]: "var(--border)",
};

export const BADGE_BG: Record<SpecStatus, string> = {
    [SPEC_STATUS.RUNNING]: "var(--border)",
    [SPEC_STATUS.IDLE]: "transparent",
    [SPEC_STATUS.QUEUED]: "transparent",
    [SPEC_STATUS.WAITING]: "var(--border)",
    [SPEC_STATUS.VALIDATING]: "var(--border)",
    [SPEC_STATUS.COMPLETED]: "var(--border)",
    [SPEC_STATUS.FAILED]: "var(--border)",
    [SPEC_STATUS.BLOCKED]: "var(--border)",
};

export function Kv({ k, v, red }: { k: string; v: string; red?: boolean }) {
    return (
        <div>
            <div className="text-muted-foreground text-xs tracking-widest">{k}</div>
            <div
                className="overflow-hidden text-base tracking-tight whitespace-nowrap"
                style={{
                    color: red ? "var(--primary)" : "var(--muted-foreground)",
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
        <Button
            key={s.id}
            variant="outline"
            onClick={() => onSelect(s)}
            className={`bg-background relative flex h-auto w-full cursor-pointer flex-col items-start rounded-sm border border-solid text-left font-normal transition-colors duration-100 ${running ? "border-primary hover:border-destructive" : "border-border hover:border-border"}`}
            style={{ padding: "14px 14px 12px" }}
        >
            {running && (
                <div
                    className="border-border absolute rounded-[3px] border-[1px] border-solid"
                    style={{ inset: -3, pointerEvents: "none", animation: "ring 2s ease infinite" }}
                />
            )}
            {/* Layer badge — top-left micro-label */}
            {layerAccent && (
                <div
                    className="mb-1.5 text-xs font-semibold tracking-widest"
                    style={{ color: layerAccent }}
                >
                    {s.layer === 3 ? "L3 SPECIALIST" : "L4 VALIDATION"}
                    {s.phase != null && s.phaseTotal != null && (
                        <span className="text-muted-foreground ml-1.5">
                            {s.phase}/{s.phaseTotal}
                        </span>
                    )}
                </div>
            )}
            <div className="mb-2 flex items-center justify-between">
                <div
                    className="h-2 w-2 shrink-0"
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
                    className="rounded-sm px-1 py-px text-sm font-semibold tracking-wide"
                    style={{ color: dot, background: bg, border: `1px solid ${dot}44` }}
                >
                    {s.status}
                </span>
            </div>
            <div className="leading-tight-1 text-muted-foreground mb-1 text-xs font-bold tracking-normal">
                {s.role}
            </div>
            <div className="text-muted-foreground mb-2.5 min-h-7 text-sm tracking-tight">
                {s.task}
            </div>
            <div className="bg-card mb-2 h-px" />
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                <Kv k="NODE" v={s.node} />
                <Kv k="CTX" v={s.context} />
                <Kv k="EL" v={String(s.evidence)} />
                <Kv k="FAILURES" v={String(s.failures)} red={s.failures > 0} />
            </div>
        </Button>
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
        <div className="mb-6">
            <div className="mb-2.5 flex items-center gap-3">
                <div className="text-sm font-semibold tracking-widest" style={{ color: accent }}>
                    {title}
                </div>
                <div className="h-px flex-1" style={{ background: `${accent}22` }} />
                <div className="text-muted-foreground text-xs tracking-widest">{label}</div>
                <div
                    className="rounded-sm px-1 py-px text-xs font-bold"
                    style={{
                        color: accent,
                        border: `1px solid ${accent}44`,
                        background: `${accent}11`,
                    }}
                >
                    {specs.length}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="flex h-full min-h-0 flex-col">
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-4">
                <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                    MISSION
                </div>
                <div className="flex items-baseline gap-3">
                    <h1 className="text-foreground text-xs font-bold tracking-wide">SPECIALISTS</h1>
                    <span className="text-muted-foreground text-xs tracking-widest">
                        AGENT ROSTER · CVE-001
                    </span>
                    {/* Layer breakdown badge */}
                    {!isLoading && (
                        <span className="text-muted-foreground ml-auto text-sm tracking-widest">
                            L3:{layer3.length + layerless.length} · L4:{layer4.length}
                        </span>
                    )}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
                {isLoading ? (
                    <div className="text-muted-foreground mt-10 text-center text-xs tracking-normal">
                        LOADING SPECIALISTS...
                    </div>
                ) : (
                    <>
                        {/* Layer 3 — Specialist Agents */}
                        <LayerSection
                            title="LAYER 3 — SPECIALIST AGENTS"
                            label="Perform targeted attack; produce structured evidence"
                            accent="var(--primary)"
                            specs={[...layer3, ...layerless]}
                            onSelect={onSelect}
                        />
                        {/* Layer 4 — Validation / Execution Agents */}
                        <LayerSection
                            title="LAYER 4 — VALIDATION / EXECUTION"
                            label="Oracle assertion, multi-host pivot, rate-limited execution"
                            accent="var(--warning)"
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
