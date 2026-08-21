import React from "react";

import { type Finding } from "@/types/domain-types";

export default function ValidationTab({ f }: { f: Finding }) {
    const eord_labels = ["UNSEEN", "NOTHING", "WEAK", "CLEAR", "CONFIRMED", "ORACLE"];
    const steps = [
        {
            ts: f.first,
            label: "SPECIALIST SUBMITTED",
            eord: 2,
            note: "Initial evidence flagged — weak signal from response anomaly",
        },
        {
            ts: "06:30:42",
            label: "EVALUATION AGENT",
            eord: 3,
            note: "Behavioral evidence confirmed — E_ord raised to CLEAR",
        },
        {
            ts: "06:30:51",
            label: "VALIDATION AGENT",
            eord: 4,
            note: "Controlled timing delta confirmed (4.18s, 2× reproduced)",
        },
        {
            ts: f.validated !== "—" ? f.validated : "—",
            label: "ORACLE_CONFIRMED",
            eord: 5,
            note: "CVE-BENCH FILE ACCESS oracle: PASS",
        },
    ].filter((s) => s.ts !== "—" || s.eord < 5);
    return (
        <div
            style={{
                paddingBottom: 24,
            }}
        >
            <div className="mb-[16px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                VALIDATION LIFECYCLE
            </div>
            {steps.map((s, i) => (
                <div
                    key={`step-${s.label}`}
                    className="flex gap-4"
                    style={{
                        marginBottom: i < steps.length - 1 ? 0 : 0,
                    }}
                >
                    <div className="flex w-[24px] shrink-0 flex-col items-center">
                        <div
                            className="h-[8px] w-[8px] shrink-0 border-[1px] border-solid border-[transparent]"
                            style={{
                                borderRadius: "50%",
                                background: (() => {
                                    if (s.eord === 5) {
                                        return "var(--color-hex-3fb950)";
                                    }
                                    if (s.eord >= 4) {
                                        return "var(--color-hex-ff2a32)";
                                    }
                                    if (s.eord >= 3) {
                                        return "var(--color-hex-d29922)";
                                    }
                                    return "var(--color-hex-333333)";
                                })(),
                            }}
                        />
                        {i < steps.length - 1 && (
                            <div
                                className="min-h-[24px] w-[1px] flex-1 bg-[var(--color-hex-1e1e1e)]"
                                style={{
                                    margin: "4px 0",
                                }}
                            />
                        )}
                    </div>
                    <div
                        style={{
                            paddingBottom: 16,
                        }}
                    >
                        <div className="mb-1 flex items-center gap-3">
                            <span
                                className="text-[8.5px] font-bold tracking-[0.1em]"
                                style={{
                                    color:
                                        s.eord === 5
                                            ? "var(--color-hex-3fb950)"
                                            : "var(--color-hex-a0a0a0)",
                                }}
                            >
                                {s.label}
                            </span>
                            <span className="text-[7.5px] text-[var(--color-hex-444444)]">
                                {s.ts}
                            </span>
                            <span
                                className="text-[8px] font-semibold tracking-[0.1em]"
                                style={{
                                    color: (() => {
                                        if (s.eord === 5) {
                                            return "var(--color-hex-3fb950)";
                                        }
                                        if (s.eord >= 4) {
                                            return "var(--color-hex-ff2a32)";
                                        }
                                        if (s.eord >= 3) {
                                            return "var(--color-hex-d29922)";
                                        }
                                        return "var(--color-hex-555555)";
                                    })(),
                                }}
                            >
                                E_ord {s.eord} — {eord_labels[s.eord]}
                            </span>
                        </div>
                        <div className="text-[9.5px] leading-[1.7] text-[var(--color-hex-555555)]">
                            {s.note}
                        </div>
                    </div>
                </div>
            ))}
            <div className="mt-[8px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0a0a0a)] px-[16px] py-[14px]">
                <div className="mb-[8px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                    ORACLE RESULT
                </div>
                <div className="flex gap-6">
                    {[
                        {
                            k: "ORACLE",
                            v: "CVE-BENCH",
                        },
                        {
                            k: "ATTACK TYPE",
                            v: "FILE ACCESS",
                        },
                        {
                            k: "RESULT",
                            v: f.status === "ORACLE_CONFIRMED" ? "PASS" : "PENDING",
                        },
                        {
                            k: "RETRIES",
                            v: "1 / 3",
                        },
                    ].map((r) => (
                        <div key={r.k}>
                            <div className="mb-[2px] text-[7.5px] tracking-[0.14em] text-[var(--color-hex-444444)]">
                                {r.k}
                            </div>
                            <div
                                className="text-[10px] font-bold"
                                style={{
                                    color: (() => {
                                        if (r.k === "RESULT") {
                                            return f.status === "ORACLE_CONFIRMED"
                                                ? "var(--color-hex-3fb950)"
                                                : "var(--color-hex-d29922)";
                                        }
                                        return "var(--color-hex-888888)";
                                    })(),
                                }}
                            >
                                {r.v}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
