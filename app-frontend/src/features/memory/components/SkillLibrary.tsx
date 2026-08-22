import { useState } from "react";

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
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div
                className="flex w-[280px] flex-shrink-0 flex-col overflow-hidden"
                style={{
                    borderRight: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div
                    className="px-[12px] py-[10px]"
                    style={{
                        borderBottom: "1px solid var(--color-hex-111111)",
                    }}
                >
                    <input
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="FILTER SKILLS…"
                        className="font-inherit w-full rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[8px] py-[5px] text-[9px] tracking-[0.08em] text-[var(--color-hex-a0a0a0)] outline-none"
                        style={{
                            boxSizing: "border-box",
                        }}
                    />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filtered.map((sk) => (
                        <div
                            key={sk.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelId(sk.id)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    setSelId(sk.id);
                                }
                            }}
                            className="cursor-pointer px-[14px] py-[11px]"
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                                background:
                                    sel.id === sk.id ? "var(--color-hex-120608)" : "transparent",
                                borderLeft:
                                    sel.id === sk.id
                                        ? "2px solid var(--color-hex-e31b23)"
                                        : "2px solid transparent",
                            }}
                            onMouseEnter={(e) => {
                                if (sel.id !== sk.id) {
                                    e.currentTarget.style.background = "var(--color-hex-0d0d0d)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (sel.id !== sk.id) {
                                    e.currentTarget.style.background = "transparent";
                                }
                            }}
                        >
                            <div className="font-inherit mb-[2px] text-[10px] font-bold tracking-[0.06em] text-[var(--color-hex-a0a0a0)]">
                                {sk.name}()
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a1a1a)] bg-[var(--color-hex-111111)] px-[5px] py-[1px] text-[7.5px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                                    {sk.cat}
                                </span>
                                <span className="ml-auto text-[7.5px] text-[var(--color-hex-3fb950)]">
                                    {sk.success}/{sk.calls} OK
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mb-2 flex items-baseline gap-3">
                    <h2 className="font-inherit text-[14px] font-bold text-[var(--color-hex-f2f2f2)]">
                        {sel.name}()
                    </h2>
                    <span className="text-[9px] tracking-[0.1em] text-[var(--color-hex-444444)]">
                        {sel.id}
                    </span>
                </div>
                <div className="mb-5 flex items-center gap-3">
                    <span className="text-[8.5px] font-semibold tracking-[0.1em] text-[var(--color-hex-e31b23)]">
                        {sel.spec}
                    </span>
                    <span className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a1a1a)] bg-[var(--color-hex-111111)] px-[6px] py-[1px] text-[8px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                        {sel.cat}
                    </span>
                </div>
                <Sub label="DESCRIPTION">
                    <p
                        className="text-[10px] leading-[1.8] text-[var(--color-hex-666666)]"
                        style={{
                            margin: 0,
                        }}
                    >
                        {sel.desc}
                    </p>
                </Sub>
                <Sub label="PARAMETERS">
                    <div className="overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                        {sel.params.map((p, i, a) => (
                            <div
                                key={p.k}
                                className="flex items-start gap-4 px-[12px] py-[8px]"
                                style={{
                                    borderBottom:
                                        i < a.length - 1
                                            ? "1px solid var(--color-hex-141414)"
                                            : "none",
                                    background:
                                        i % 2
                                            ? "var(--color-hex-0b0b0b)"
                                            : "var(--color-hex-0d0d0d)",
                                }}
                            >
                                <span className="font-inherit min-w-[80px] shrink-0 text-[10px] font-bold text-[var(--color-hex-a0a0a0)]">
                                    {p.k}
                                </span>
                                <span className="min-w-[28px] shrink-0 text-[8.5px] text-[var(--color-hex-333333)]">
                                    {p.t}
                                </span>
                                <span className="text-[9px] text-[var(--color-hex-555555)]">
                                    {p.desc}
                                </span>
                            </div>
                        ))}
                    </div>
                </Sub>
                <Sub label="USAGE STATS">
                    <div className="grid grid-cols-4 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
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
                        ].map((m, i, a) => (
                            <div
                                key={m.k}
                                className="bg-[var(--color-hex-0d0d0d)] px-[12px] py-[10px]"
                                style={{
                                    borderRight:
                                        i < a.length - 1
                                            ? "1px solid var(--color-hex-1a1a1a)"
                                            : "none",
                                }}
                            >
                                <div className="mb-[4px] text-[7.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                                    {m.k}
                                </div>
                                <div
                                    className="text-[14px] font-bold"
                                    style={{
                                        color: (() => {
                                            if (m.k === "SUCCESS") {
                                                return "var(--color-hex-3fb950)";
                                            }
                                            if (m.k === "E_ORD DELTA") {
                                                return "var(--color-hex-e31b23)";
                                            }
                                            return "var(--color-hex-f2f2f2)";
                                        })(),
                                    }}
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
