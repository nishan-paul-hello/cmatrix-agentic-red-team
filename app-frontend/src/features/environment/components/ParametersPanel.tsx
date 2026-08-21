import { PARAMS } from "../data/mockData";

export default function ParametersPanel() {
    return (
        <div className="flex-1 overflow-auto">
            <div
                className="flex flex-shrink-0 items-center gap-2 bg-[var(--color-hex-0a0a0a)] px-4 py-2"
                style={{
                    borderBottom: "1px solid var(--color-hex-141414)",
                }}
            >
                <span className="text-[8px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                    DISCOVERED PARAMETERS
                </span>
                <span className="ml-auto text-[8px] tracking-[0.12em] text-[var(--color-hex-e31b23)]">
                    {PARAMS.filter((p) => p.injectable).length} INJECTION ELIGIBLE
                </span>
            </div>
            <table className="w-full border-collapse text-[10.5px]">
                <thead>
                    <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                        {[
                            "ID",
                            "ENDPOINT",
                            "PARAMETER",
                            "TYPE",
                            "SOURCE",
                            "INJECTABLE",
                            "LAST VALUE",
                        ].map((h) => (
                            <th
                                key={h}
                                className="px-[12px] py-[6px] text-left text-[8px] font-semibold tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-444444)]"
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
                    {PARAMS.map((p, i) => (
                        <tr
                            key={p.id}
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                                background: i % 2 ? "var(--color-hex-0b0b0b)" : "transparent",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--color-hex-0f0f0f)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                    i % 2 ? "var(--color-hex-0b0b0b)" : "transparent")
                            }
                        >
                            <td className="px-[12px] py-[7px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                                {p.id}
                            </td>
                            <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-555555)]">
                                {p.endpoint}
                            </td>
                            <td className="px-[12px] py-[7px] font-semibold text-[var(--color-hex-a0a0a0)]">
                                {p.param}
                            </td>
                            <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-666666)]">
                                {p.type}
                            </td>
                            <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-555555)]">
                                {p.source}
                            </td>
                            <td className="px-[12px] py-[7px]">
                                <span
                                    className="text-[8.5px] font-semibold tracking-[0.12em]"
                                    style={{
                                        color: p.injectable
                                            ? "var(--color-hex-ff2a32)"
                                            : "var(--color-hex-333333)",
                                    }}
                                >
                                    {p.injectable ? "YES" : "—"}
                                </span>
                            </td>
                            <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-444444)]">
                                {p.lastVal}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
