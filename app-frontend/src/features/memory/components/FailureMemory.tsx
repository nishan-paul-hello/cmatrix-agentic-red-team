import { useState } from "react";

import { KPIStrip } from "@/components/ui/KPIStrip";
import { useServices } from "@/lib/services-context";
import { type FailureLogEntry } from "@/types/domain-types";

export default function FailureMemory() {
    const { blackboard } = useServices();
    const failures: FailureLogEntry[] = blackboard.readFailures();
    const [selId, setSelId] = useState<string | null>(null);
    const tc: Record<string, string> = {
        TIMEOUT: "text-warning",
        FAILED: "text-destructive",
        ERROR: "text-destructive",
    };
    const sc: Record<string, string> = {
        LOW: "text-muted-foreground",
        MEDIUM: "text-warning",
        HIGH: "text-destructive",
        CRITICAL: "text-destructive",
    };
    const sel = (selId ? failures.find((f) => f.id === selId) : failures[0]) ?? null;
    return (
        <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <KPIStrip
                    variant="card"
                    className="mb-5"
                    items={[
                        { k: "TOTAL FAILURES", v: "3" },
                        { k: "CORRECTABLE", v: "1" },
                        { k: "RULED OUT", v: "2" },
                        { k: "LESSONS ADDED", v: "6" },
                    ]}
                />
                {failures.map((f) => (
                    <button
                        type="button"
                        key={f.id}
                        onClick={() => setSelId(f.id === selId ? null : f.id)}
                        className={`border-border focus:ring-primary hover:bg-background mb-2.5 block w-full cursor-pointer rounded-sm border-[1px] border-solid text-left transition-colors focus:ring-1 focus:outline-none ${sel?.id === f.id ? "bg-background" : "bg-transparent"}`}
                    >
                        <div className="border-border flex items-center gap-3 border-b px-4 py-3">
                            <span className="text-primary text-base font-bold tracking-normal">
                                {f.id}
                            </span>
                            <span className="text-muted-foreground text-sm">{f.action}</span>
                            <span
                                className={`ml-auto text-sm font-semibold tracking-wide ${tc[f.type] ?? "text-muted-foreground"}`}
                            >
                                {f.type}
                            </span>
                            <span
                                className={`text-sm font-semibold tracking-normal ${sc[f.severity]}`}
                            >
                                {f.severity}
                            </span>
                            <span className="text-muted-foreground text-sm">{f.ts}</span>
                        </div>
                        <div className="px-4 py-3">
                            <div className="mb-1.5">
                                <span className="text-muted-foreground text-xs tracking-widest">
                                    DIAGNOSIS ·{" "}
                                </span>
                                <span className="text-muted-foreground text-base leading-relaxed">
                                    {f.diagnosis}
                                </span>
                            </div>
                            <div className="mb-1.5">
                                <span className="text-muted-foreground text-xs tracking-widest">
                                    RESOLUTION ·{" "}
                                </span>
                                <span
                                    className={`text-base leading-relaxed ${f.correctable ? "text-success" : "text-muted-foreground"}`}
                                >
                                    {f.resolution}
                                </span>
                            </div>
                            <div className="border-border mt-3 flex flex-col gap-1 border-t">
                                <div className="text-muted-foreground mb-1 text-xs tracking-widest">
                                    LESSONS LEARNED
                                </div>
                                {f.lessons.map((l) => (
                                    <div key={l} className="flex items-start gap-2">
                                        <span className="text-warning mt-px text-base">◆</span>
                                        <span className="text-muted-foreground text-base leading-normal">
                                            {l}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
