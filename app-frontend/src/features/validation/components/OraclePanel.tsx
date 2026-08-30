import { Button } from "@/components/ui/button";

export default function OraclePanel({ onClose }: { onClose: () => void }) {
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
        <div className="bg-background border-border lg:w-panel-md flex w-full flex-shrink-0 flex-col overflow-y-auto border-t lg:border-t-0 lg:border-l">
            <div className="border-border flex items-center justify-between border-b px-4 pt-4 pb-3">
                <span className="text-muted-foreground text-xs font-semibold tracking-widest">
                    ORACLE PANEL
                </span>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onClose}
                    className="text-muted-foreground cursor-pointer"
                    aria-label="Close"
                >
                    ✕
                </Button>
            </div>
            {oracles.map((o) => (
                <div key={o.oracle} className="border-border border-b px-4 py-4">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-foreground text-xs font-bold tracking-normal">
                            {o.oracle}
                        </span>
                        <span
                            className={`rounded-sm border border-solid px-1.5 py-px text-base font-bold tracking-wide ${o.result === "PASS" ? "text-success bg-border border-border" : "text-destructive bg-border border-border"}`}
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
                        <div key={r.k} className="mb-1.5">
                            <div className="text-muted-foreground mb-px text-xs tracking-widest">
                                {r.k}
                            </div>
                            <div className="text-muted-foreground text-base leading-snug tracking-tighter">
                                {r.v}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
