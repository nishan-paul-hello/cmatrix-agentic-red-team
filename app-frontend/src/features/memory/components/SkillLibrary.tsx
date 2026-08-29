import { useState } from "react";

import { Input } from "@/components/ui/input";
import Sub from "@/features/memory/components/Sub";
import { useServices } from "@/lib/services-context";
import { type SkillEntry } from "@/types/domain-types";

export default function SkillLibrary() {
    const { blackboard } = useServices();
    const skills: SkillEntry[] = blackboard.readSkills();
    const [filter, setFilter] = useState("");
    const [selId, setSelId] = useState<string | null>(null);
    const q = filter.toLowerCase();
    const filtered = skills.filter(
        (s) =>
            s.name.includes(q) ||
            s.cat.toLowerCase().includes(q) ||
            s.desc.toLowerCase().includes(q) ||
            s.spec.toLowerCase().includes(q),
    );
    const sel = (selId ? skills.find((s) => s.id === selId) : skills[0]) as unknown as SkillEntry;
    return (
        <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="w-panel-sm border-border flex flex-shrink-0 flex-col overflow-hidden border-r">
                <div className="border-border border-b px-3 py-2.5">
                    <Input
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="FILTER SKILLS..."
                        className="bg-card text-muted-foreground focus-visible:border-primary box-border h-auto w-full rounded-sm px-2 py-1 text-base tracking-tight shadow-none"
                    />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filtered.map((sk) => (
                        <button
                            type="button"
                            key={sk.id}
                            onClick={() => setSelId(sk.id)}
                            className={`border-border focus:ring-primary hover:bg-background block w-full cursor-pointer border-b px-3.5 py-2.5 text-left transition-colors focus:ring-1 focus:outline-none ${sel.id === sk.id ? "bg-background" : "bg-transparent"}`}
                        >
                            <div className="font-inherit text-muted-foreground mb-0.5 text-xs font-bold tracking-tight">
                                {sk.name}()
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="border-border bg-card text-muted-foreground rounded-sm border-[1px] border-solid px-1 py-px text-xs tracking-normal">
                                    {sk.cat}
                                </span>
                                <span className="text-success ml-auto text-xs">
                                    {sk.success}/{sk.calls} OK
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mb-2 flex items-baseline gap-3">
                    <h2 className="font-inherit text-foreground text-sm font-bold">{sel.name}()</h2>
                    <span className="text-muted-foreground text-base tracking-normal">
                        {sel.id}
                    </span>
                </div>
                <div className="mb-5 flex items-center gap-3">
                    <span className="text-primary text-sm font-semibold tracking-normal">
                        {sel.spec}
                    </span>
                    <span className="border-border bg-card text-muted-foreground rounded-sm border-[1px] border-solid px-1.5 py-px text-sm tracking-normal">
                        {sel.cat}
                    </span>
                </div>
                <Sub label="DESCRIPTION">
                    <p className="text-muted-foreground m-0 text-xs leading-loose">{sel.desc}</p>
                </Sub>
                <Sub label="PARAMETERS">
                    <div className="border-border overflow-hidden rounded-sm border-[1px] border-solid">
                        {sel.params.map((p) => (
                            <div
                                key={p.k}
                                className="border-border flex items-start gap-4 border-b px-3 py-2"
                            >
                                <span className="font-inherit text-muted-foreground min-w-[80px] shrink-0 text-xs font-bold">
                                    {p.k}
                                </span>
                                <span className="text-muted-foreground min-w-7 shrink-0 text-sm">
                                    {p.t}
                                </span>
                                <span className="text-muted-foreground text-base">{p.desc}</span>
                            </div>
                        ))}
                    </div>
                </Sub>
                <Sub label="USAGE STATS">
                    <div className="border-border grid grid-cols-1 gap-0 overflow-hidden rounded-sm border-[1px] border-solid sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                k: "CALLS",
                                v: String(sel.calls),
                            },
                            {
                                k: "SUCCESS",
                                v: String(sel.success),
                            },
                            {
                                k: "LAST CALL",
                                v: sel.lastCall,
                            },
                            {
                                k: "E_ORD DELTA",
                                v: (sel as unknown as Record<string, string>).eordDelta,
                            },
                        ].map((m) => (
                            <div
                                key={m.k}
                                className="bg-background border-border border-r px-3 py-2.5"
                            >
                                <div className="text-muted-foreground mb-1 text-xs tracking-widest">
                                    {m.k}
                                </div>
                                <div
                                    className={`text-sm font-bold ${(() => {
                                        if (m.k === "SUCCESS") {
                                            return "text-success";
                                        }
                                        if (m.k === "E_ORD DELTA") {
                                            return "text-primary";
                                        }
                                        return "text-foreground";
                                    })()}`}
                                >
                                    {m.v}
                                </div>
                            </div>
                        ))}
                    </div>
                </Sub>
            </div>
        </div>
    );
}
