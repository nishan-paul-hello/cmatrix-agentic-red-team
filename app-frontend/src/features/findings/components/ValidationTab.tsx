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
            <div className="text-muted-foreground mb-4 text-sm tracking-widest">
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
                    <div className="flex w-6 shrink-0 flex-col items-center">
                        <div
                            className="h-2 w-2 shrink-0 border-[1px] border-solid border-[transparent]"
                            style={{
                                borderRadius: "50%",
                                background: (() => {
                                    if (s.eord === 5) {
                                        return "var(--success)";
                                    }
                                    if (s.eord >= 4) {
                                        return "var(--destructive)";
                                    }
                                    if (s.eord >= 3) {
                                        return "var(--warning)";
                                    }
                                    return "var(--border)";
                                })(),
                            }}
                        />
                        {i < steps.length - 1 && (
                            <div
                                className="bg-muted min-h-6 w-px flex-1"
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
                                className="text-sm font-bold tracking-normal"
                                style={{
                                    color:
                                        s.eord === 5 ? "var(--success)" : "var(--muted-foreground)",
                                }}
                            >
                                {s.label}
                            </span>
                            <span className="text-muted-foreground text-xs">{s.ts}</span>
                            <span
                                className="text-sm font-semibold tracking-normal"
                                style={{
                                    color: (() => {
                                        if (s.eord === 5) {
                                            return "var(--success)";
                                        }
                                        if (s.eord >= 4) {
                                            return "var(--destructive)";
                                        }
                                        if (s.eord >= 3) {
                                            return "var(--warning)";
                                        }
                                        return "var(--muted-foreground)";
                                    })(),
                                }}
                            >
                                E_ord {s.eord} — {eord_labels[s.eord]}
                            </span>
                        </div>
                        <div className="text-muted-foreground text-base leading-relaxed">
                            {s.note}
                        </div>
                    </div>
                </div>
            ))}
            <div className="border-border bg-background mt-2 rounded-sm border-[1px] border-solid px-4 py-3.5">
                <div className="text-muted-foreground mb-2 text-sm tracking-widest">
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
                            <div className="text-muted-foreground mb-0.5 text-xs tracking-widest">
                                {r.k}
                            </div>
                            <div
                                className="text-xs font-bold"
                                style={{
                                    color: (() => {
                                        if (r.k === "RESULT") {
                                            return f.status === "ORACLE_CONFIRMED"
                                                ? "var(--success)"
                                                : "var(--warning)";
                                        }
                                        return "var(--muted-foreground)";
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
