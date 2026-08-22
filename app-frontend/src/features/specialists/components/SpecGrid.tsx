import React from "react";

import { SPEC_STATUS, type Specialist, type SpecStatus } from "@/types/domain-types";

export const DOT: Record<SpecStatus, string> = {
    [SPEC_STATUS.RUNNING]: "var(--color-hex-e31b23)",
    [SPEC_STATUS.IDLE]: "var(--color-hex-333333)",
    [SPEC_STATUS.QUEUED]: "var(--color-hex-555555)",
    [SPEC_STATUS.WAITING]: "var(--color-hex-d29922)",
    [SPEC_STATUS.VALIDATING]: "var(--color-hex-ff2a32)",
    [SPEC_STATUS.COMPLETED]: "var(--color-hex-3fb950)",
    [SPEC_STATUS.FAILED]: "var(--color-hex-ff2a32)",
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
            <div className="text-[7px] tracking-[0.14em] text-[var(--color-hex-333333)]">{k}</div>
            <div
                className="overflow-hidden text-[9px] tracking-[0.06em] whitespace-nowrap"
                style={{
                    color: red ? "var(--color-hex-e31b23)" : "var(--color-hex-555555)",
                    textOverflow: "ellipsis",
                }}
            >
                {v}
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
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    MISSION
                </div>
                <div className="flex items-baseline gap-3">
                    <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        SPECIALISTS
                    </h1>
                    <span className="text-[10px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                        AGENT ROSTER · CVE-001
                    </span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
                {isLoading ? (
                    <div className="mt-10 text-center text-[10px] tracking-[0.1em] text-[var(--color-hex-666666)]">
                        LOADING SPECIALISTS...
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-3">
                        {specialists.map((s) => {
                            const dot = DOT[s.status],
                                bg = BADGE_BG[s.status];
                            const running =
                                s.status === SPEC_STATUS.RUNNING ||
                                s.status === SPEC_STATUS.VALIDATING;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => onSelect(s)}
                                    className={`font-inherit relative flex cursor-pointer flex-col rounded-[2px] border border-solid bg-[var(--color-hex-0d0d0d)] text-left transition-colors duration-100 ${running ? "border-[var(--color-hex-e31b23)] hover:border-[var(--color-hex-ff2a32)]" : "border-[var(--color-hex-1e1e1e)] hover:border-[var(--color-hex-333333)]"}`}
                                    style={{
                                        padding: "14px 14px 12px",
                                    }}
                                >
                                    {running && (
                                        <div
                                            className="absolute rounded-[3px] border-[1px] border-solid border-[var(--color-hex-e31b2330)]"
                                            style={{
                                                inset: -3,
                                                pointerEvents: "none",
                                                animation: "ring 2s ease infinite",
                                            }}
                                        />
                                    )}
                                    <div className="mb-2 flex items-center justify-between">
                                        <div
                                            className="h-[8px] w-[8px] shrink-0"
                                            style={{
                                                borderRadius: "50%",
                                                background:
                                                    s.status !== SPEC_STATUS.IDLE &&
                                                    s.status !== SPEC_STATUS.QUEUED
                                                        ? dot
                                                        : "transparent",
                                                border: `1px solid ${dot}`,
                                                animation: running
                                                    ? "pulse 1.4s ease infinite"
                                                    : "none",
                                            }}
                                        />
                                        <span
                                            className="rounded-[2px] px-[5px] py-[1px] text-[8px] font-semibold tracking-[0.12em]"
                                            style={{
                                                color: dot,
                                                background: bg,
                                                border: `1px solid ${dot}44`,
                                            }}
                                        >
                                            {s.status}
                                        </span>
                                    </div>
                                    <div className="mb-[4px] text-[10px] leading-[1.3] font-bold tracking-[0.1em] text-[var(--color-hex-a0a0a0)]">
                                        {s.role}
                                    </div>
                                    <div className="mb-[10px] min-h-[28px] text-[8.5px] tracking-[0.06em] text-[var(--color-hex-444444)]">
                                        {s.task}
                                    </div>
                                    <div className="mb-[8px] h-[1px] bg-[var(--color-hex-1a1a1a)]" />
                                    <div className="grid grid-cols-2 gap-1">
                                        <Kv k="NODE" v={s.node} />
                                        <Kv k="CTX" v={s.context} />
                                        <Kv k="EL" v={String(s.evidence)} />
                                        <Kv
                                            k="FAILURES"
                                            v={String(s.failures)}
                                            red={s.failures > 0}
                                        />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
            <style>{`@keyframes ring{0%,100%{opacity:.5}50%{opacity:.1}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
        </div>
    );
}
