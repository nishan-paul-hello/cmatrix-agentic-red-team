import { useEffect } from "react";

export default function OraclePanel({ onClose }: { onClose: () => void }) {
    // F10: ESC key closes panel
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") {
                onClose();
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);
    const oracles = [
        {
            oracle: "CVE-BENCH",
            type: "FILE ACCESS",
            result: "PASS",
            severity: "CRITICAL",
            details: "Flag file /flag.txt read — exploit confirmed",
        },
        {
            oracle: "PREDIQL",
            type: "IDOR",
            result: "PASS",
            severity: "HIGH",
            details: "Unauthorized record access validated",
        },
        {
            oracle: "MHBENCH",
            type: "HOST COMPROMISED",
            result: "FAIL",
            severity: "HIGH",
            details: "Lateral pivot objective not satisfied",
        },
    ];
    return (
        <div
            className="w-panel-md flex flex-shrink-0 flex-col overflow-y-auto bg-[var(--color-hex-0b0b0b)]"
            style={{
                borderLeft: "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            <div
                className="flex items-center justify-between px-4 pt-4 pb-3"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <span className="tracking-wider-2 text-lg font-semibold text-[var(--color-hex-a0a0a0)]">
                    ORACLE PANEL
                </span>
                <button
                    onClick={onClose}
                    className="cursor-pointer border-none bg-[transparent] text-3xl text-[var(--color-hex-444444)]"
                >
                    ✕
                </button>
            </div>
            {oracles.map((o) => (
                <div
                    key={o.oracle}
                    className="px-4 py-4"
                    style={{
                        borderBottom: "1px solid var(--color-hex-141414)",
                    }}
                >
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-lg font-bold tracking-normal text-[var(--color-fg)]">
                            {o.oracle}
                        </span>
                        <span
                            className="rounded-[2px] px-[6px] py-[1px] text-base font-bold tracking-wide"
                            style={{
                                color:
                                    o.result === "PASS"
                                        ? "var(--color-success)"
                                        : "var(--color-danger)",
                                background:
                                    o.result === "PASS"
                                        ? "var(--color-hex-0a1a10)"
                                        : "var(--color-hex-1a0608)",
                                border: `1px solid ${o.result === "PASS" ? "var(--color-hex-3fb95044)" : "var(--color-hex-ff2a3244)"}`,
                            }}
                        >
                            {o.result}
                        </span>
                    </div>
                    {[
                        {
                            k: "ATTACK TYPE",
                            v: o.type,
                        },
                        {
                            k: "SEVERITY",
                            v: o.severity,
                        },
                        {
                            k: "DETAILS",
                            v: o.details,
                        },
                    ].map((r) => (
                        <div key={r.k} className="mb-[6px]">
                            <div className="text-sm-tight tracking-wider-3 mb-[1px] text-[var(--color-hex-444444)]">
                                {r.k}
                            </div>
                            <div className="text-lg-tight leading-snug tracking-tighter text-[var(--color-hex-666666)]">
                                {r.v}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
