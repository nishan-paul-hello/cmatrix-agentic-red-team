import { DATA, SEV_C, STATUS_C } from "@/features/findings/data/findingsMockData";
import { type Finding, type Severity } from "@/types/domain-types";

export default function FindingsList({ onSelect }: { onSelect: (f: Finding) => void }) {
    const counts: Record<Severity, number> = {
        CRITICAL: 0,
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0,
    };
    DATA.forEach((f) => counts[f.severity]++);
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    MISSION / CVE-001
                </div>
                <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                    VALIDATED FINDINGS
                </h1>
            </div>
            {/* Severity KPIs */}
            <div
                className="grid flex-shrink-0 grid-cols-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as Severity[]).map((s, i) => (
                    <div
                        key={s}
                        className="bg-[var(--color-hex-0d0d0d)] px-[20px] py-[14px]"
                        style={{
                            borderRight: i < 3 ? "1px solid var(--color-hex-1e1e1e)" : "none",
                        }}
                    >
                        <div className="mb-[6px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                            {s}
                        </div>
                        <div
                            className="text-[28px] leading-[1] font-bold"
                            style={{
                                color: SEV_C[s].color,
                            }}
                        >
                            {String(counts[s]).padStart(2, "0")}
                        </div>
                    </div>
                ))}
            </div>
            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse text-[10.5px]">
                    <thead>
                        <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                            {[
                                "ID",
                                "TYPE",
                                "TARGET",
                                "SEVERITY",
                                "E_ORD",
                                "STATUS",
                                "FIRST SEEN",
                                "VALIDATED",
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="px-[14px] py-[6px] text-left text-[8px] font-semibold tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-444444)]"
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
                        {DATA.map((f) => {
                            const sc = SEV_C[f.severity],
                                stc = STATUS_C[f.status] ?? "var(--color-hex-666666)";
                            return (
                                <tr
                                    key={f.id}
                                    className="cursor-pointer"
                                    style={{
                                        borderBottom: "1px solid var(--color-hex-111111)",
                                    }}
                                    onClick={() => onSelect(f)}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.background =
                                            "var(--color-hex-0f0f0f)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.background = "transparent")
                                    }
                                >
                                    <td className="px-[14px] py-[8px] font-bold tracking-[0.08em] text-[var(--color-hex-e31b23)]">
                                        {f.id}
                                    </td>
                                    <td className="px-[14px] py-[8px] text-[var(--color-hex-a0a0a0)]">
                                        {f.type}
                                    </td>
                                    <td className="px-[14px] py-[8px] text-[9.5px] text-[var(--color-hex-555555)]">
                                        {f.target}
                                    </td>
                                    <td className="px-[14px] py-[8px]">
                                        <span
                                            className="rounded-[2px] px-[5px] py-[1px] text-[9px] font-semibold tracking-[0.1em]"
                                            style={{
                                                color: sc.color,
                                                background: sc.bg,
                                                border: `1px solid ${sc.color}33`,
                                            }}
                                        >
                                            {f.severity}
                                        </span>
                                    </td>
                                    <td className="px-[14px] py-[8px] text-center text-[var(--color-hex-666666)]">
                                        {f.eord}/5
                                    </td>
                                    <td className="px-[14px] py-[8px]">
                                        <span
                                            className="text-[9px] font-semibold tracking-[0.1em]"
                                            style={{
                                                color: stc,
                                            }}
                                        >
                                            {f.status}
                                        </span>
                                    </td>
                                    <td className="px-[14px] py-[8px] text-[9px] text-[var(--color-hex-444444)]">
                                        {f.first}
                                    </td>
                                    <td className="px-[14px] py-[8px] text-[9px] text-[var(--color-hex-444444)]">
                                        {f.validated}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
