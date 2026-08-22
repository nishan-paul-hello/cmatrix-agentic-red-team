import {
    ABLATION_FLAG_KEYS,
    ABLATION_RUNS,
    type AblationRun,
} from "@/features/research/data/fixtures/researchMockData";

export function AblationLabTable({
    sel,
    setSel,
}: {
    sel: AblationRun;
    setSel: (r: AblationRun) => void;
}) {
    return (
        <table className="mb-[24px] w-full border-collapse">
            <thead>
                <tr className="bg-[var(--color-hex-0f0f0f)]">
                    {[
                        "RUN",
                        "NAME",
                        "UCB",
                        "E_ORD",
                        "COMPACT",
                        "PARALLEL",
                        "SCORE",
                        "Δ SCORE",
                        "COST",
                        "TIME",
                    ].map((h) => (
                        <th
                            key={h}
                            className="px-[12px] py-[5px] text-left text-[7.5px] font-semibold tracking-[0.14em] whitespace-nowrap text-[var(--color-hex-444444)]"
                            style={{
                                borderBottom: "1px solid var(--color-hex-1a1a1a)",
                            }}
                        >
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {ABLATION_RUNS.map((r) => (
                    <tr
                        key={r.id}
                        onClick={() => setSel(r)}
                        className="cursor-pointer"
                        style={{
                            borderBottom: "1px solid var(--color-hex-111111)",
                            background: sel.id === r.id ? "var(--color-hex-0d0d0d)" : "transparent",
                            borderLeft:
                                sel.id === r.id
                                    ? "2px solid var(--color-hex-e31b23)"
                                    : "2px solid transparent",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "var(--color-hex-0a0a0a)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                                sel.id === r.id ? "var(--color-hex-0d0d0d)" : "transparent")
                        }
                    >
                        <td className="px-[12px] py-[8px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                            {r.id}
                        </td>
                        <td className="px-[12px] py-[8px] text-[9.5px] text-[var(--color-hex-888888)]">
                            {r.name}
                        </td>
                        {ABLATION_FLAG_KEYS.map((k) => (
                            <td key={k} className="px-[12px] py-[8px] text-center">
                                <span
                                    className="text-[10px] font-bold"
                                    style={{
                                        color: r[k]
                                            ? "var(--color-hex-3fb950)"
                                            : "var(--color-hex-333333)",
                                    }}
                                >
                                    {r[k] ? "✓" : "✗"}
                                </span>
                            </td>
                        ))}
                        <td
                            className="px-[12px] py-[8px] text-[10px] font-bold"
                            style={{
                                color: (() => {
                                    if (r.score > 0.75) {
                                        return "var(--color-hex-3fb950)";
                                    }
                                    if (r.score > 0.55) {
                                        return "var(--color-hex-d29922)";
                                    }
                                    return "var(--color-hex-ff2a32)";
                                })(),
                            }}
                        >
                            {(r.score * 100).toFixed(1)}%
                        </td>
                        <td
                            className="px-[12px] py-[8px] text-[9px] font-bold"
                            style={{
                                color: (() => {
                                    if (r.delta === 0) {
                                        return "var(--color-hex-555555)";
                                    }
                                    if (r.delta > -0.05) {
                                        return "var(--color-hex-d29922)";
                                    }
                                    return "var(--color-hex-ff2a32)";
                                })(),
                            }}
                        >
                            {r.delta === 0 ? "—" : `${(r.delta * 100).toFixed(1)}%`}
                        </td>
                        <td className="px-[12px] py-[8px] text-[9px] text-[var(--color-hex-444444)]">
                            {r.cost}
                        </td>
                        <td className="px-[12px] py-[8px] text-[9px] text-[var(--color-hex-444444)]">
                            {r.time}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
