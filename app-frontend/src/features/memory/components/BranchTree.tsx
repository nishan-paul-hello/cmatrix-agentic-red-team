import { type BRANCHES } from "@/features/memory/data/mockData";

export default function BranchTree({
    nodes,
    depth = 0,
}: {
    nodes: typeof BRANCHES;
    depth?: number;
}) {
    return (
        <>
            {nodes.map((b) => (
                <div
                    key={b.id}
                    style={{
                        marginLeft: depth * 24,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "stretch",
                            gap: 0,
                        }}
                    >
                        {depth > 0 && (
                            <div
                                className="mb-[8px] w-[20px] shrink-0"
                                style={{
                                    borderLeft: "1px solid var(--color-hex-1e1e1e)",
                                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                                }}
                            />
                        )}
                        <div className="mb-[10px] flex-1 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                            <div
                                className="flex items-center gap-3 bg-[var(--color-hex-0d0d0d)] px-4 py-2"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-141414)",
                                }}
                            >
                                <span className="text-[9px] font-bold tracking-[0.1em] text-[var(--color-hex-e31b23)]">
                                    {b.id}
                                </span>
                                <span className="flex-1 text-[8.5px] text-[var(--color-hex-a0a0a0)]">
                                    {b.decision}
                                </span>
                                <span className="text-[8px] text-[var(--color-hex-333333)]">
                                    {b.ts}
                                </span>
                                <span
                                    className="text-[8px] font-semibold tracking-[0.12em]"
                                    style={{
                                        color: (() => {
                                            if (b.outcome === "SUCCESS") {
                                                return "var(--color-hex-3fb950)";
                                            }
                                            if (
                                                b.outcome === "IN PROGRESS" ||
                                                b.outcome === "RUNNING"
                                            ) {
                                                return "var(--color-hex-d29922)";
                                            }
                                            return "var(--color-hex-e31b23)";
                                        })(),
                                    }}
                                >
                                    {b.outcome}
                                </span>
                            </div>
                            <div className="px-4 py-3">
                                <div className="mb-[8px]">
                                    <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                        CHOSEN PATH
                                    </div>
                                    <div className="text-[10px] font-semibold tracking-[0.06em] text-[var(--color-hex-3fb950)]">
                                        {b.chosen}
                                    </div>
                                </div>
                                <div className="mb-[8px]">
                                    <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                        ALTERNATIVES REJECTED
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {b.alternatives.map((a) => (
                                            <span
                                                key={a}
                                                className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a1a1a)] bg-[var(--color-hex-111111)] px-[7px] py-[2px] text-[8.5px] text-[var(--color-hex-333333)]"
                                                style={{
                                                    textDecoration: "line-through",
                                                }}
                                            >
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-[6px]">
                                    <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                        RATIONALE
                                    </div>
                                    <div className="text-[9.5px] leading-[1.7] text-[var(--color-hex-555555)]">
                                        {b.reason}
                                    </div>
                                </div>
                                <div
                                    className="mt-[8px]"
                                    style={{
                                        borderTop: "1px solid var(--color-hex-141414)",
                                        paddingTop: 8,
                                    }}
                                >
                                    <div className="mb-[3px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                        IMPACT
                                    </div>
                                    <div className="text-[9.5px] leading-[1.6] text-[var(--color-hex-666666)]">
                                        {b.impact}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {b.children.length > 0 && <BranchTree nodes={b.children} depth={depth + 1} />}
                </div>
            ))}
        </>
    );
}
