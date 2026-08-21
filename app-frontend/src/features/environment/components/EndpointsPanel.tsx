import { ENDPOINTS, METHOD_COLOR } from "@/features/environment/data/mockData";

export default function EndpointsPanel() {
    return (
        <>
            <div
                className="flex items-center justify-between bg-[var(--color-hex-0b0b0b)] px-6 py-2"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <span className="text-[8.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                    {ENDPOINTS.length} OBSERVED ENDPOINTS · SOURCE: SPIDER + INFERENCE · OBSERVED
                </span>
                <span className="text-[8px] tracking-[0.14em] text-[var(--color-hex-3fb950)]">
                    E_ord ≥ 3 — CLEAR
                </span>
            </div>
            <table className="w-full border-collapse text-[10.5px]">
                <thead>
                    <tr className="bg-[var(--color-hex-0f0f0f)]">
                        {["ENDPOINT", "METHOD", "AUTH", "PARAMETERS", "SOURCE", "LAST SEEN"].map(
                            (h) => (
                                <th
                                    key={h}
                                    className="px-[16px] py-[6px] text-left text-[8px] font-semibold tracking-[0.18em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                    style={{
                                        borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                    }}
                                >
                                    {h}
                                </th>
                            ),
                        )}
                    </tr>
                </thead>
                <tbody>
                    {ENDPOINTS.map((row) => (
                        <tr
                            key={`${row.method}-${row.endpoint}`}
                            className="cursor-pointer"
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--color-hex-0f0f0f)")
                            }
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            <td className="font-inherit px-[16px] py-[7px] whitespace-nowrap text-[var(--color-hex-a0a0a0)]">
                                {row.endpoint}
                            </td>
                            <td className="px-[16px] py-[7px] whitespace-nowrap">
                                <span
                                    className="rounded-[2px] px-[5px] py-[1px] text-[9px] font-semibold tracking-[0.1em]"
                                    style={{
                                        color: METHOD_COLOR[row.method] ?? "#666",
                                        background: `${METHOD_COLOR[row.method]}15`,
                                        border: `1px solid ${METHOD_COLOR[row.method]}33`,
                                    }}
                                >
                                    {row.method}
                                </span>
                            </td>
                            <td className="px-[16px] py-[7px] text-[9.5px] whitespace-nowrap text-[var(--color-hex-555555)]">
                                {row.auth}
                            </td>
                            <td className="px-[16px] py-[7px] text-[9.5px] text-[var(--color-hex-444444)]">
                                {row.params}
                            </td>
                            <td className="px-[16px] py-[7px] text-[9px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                                {row.source}
                            </td>
                            <td className="px-[16px] py-[7px] text-[9px] whitespace-nowrap text-[var(--color-hex-333333)]">
                                {row.seen}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
