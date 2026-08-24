import { useEffect, useState } from "react";

import { EnvironmentRepository } from "@/features/environment/data/EnvironmentRepository";
import { STATUS_COLOR } from "@/features/environment/data/mockData";
import { type Service } from "@/types/domain-types";

export default function ServicesPanel() {
    const [SERVICES, setData] = useState<Service[]>([]);
    useEffect(() => {
        void new EnvironmentRepository()
            .fetchAll<Service>({ collection: "SERVICES", limit: 1000 })
            .then(setData);
    }, []);

    if (SERVICES.length === 0) {
        return null;
    }

    return (
        <>
            <div
                className="flex items-center justify-between bg-[var(--color-hex-0b0b0b)] px-6 py-2"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <span className="text-[8.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                    {SERVICES.length} SERVICES DETECTED · SOURCE: NMAP 7.94 · DISCOVERED
                </span>
                <span className="text-[8px] tracking-[0.14em] text-[var(--color-hex-3fb950)]">
                    E_ord ≥ 4 — CONFIRMED
                </span>
            </div>
            <table className="w-full border-collapse text-[10.5px]">
                <thead>
                    <tr className="bg-[var(--color-hex-0f0f0f)]">
                        {["HOST", "PORT", "SERVICE", "VERSION", "BANNER", "STATUS"].map((h) => (
                            <th
                                key={h}
                                className="px-[16px] py-[6px] text-left text-[8px] font-semibold tracking-[0.18em] whitespace-nowrap text-[var(--color-hex-444444)]"
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
                    {SERVICES.map((row) => (
                        <tr
                            key={`${row.host}-${row.port}`}
                            className="cursor-pointer"
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--color-hex-0f0f0f)")
                            }
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            <td className="px-[16px] py-[7px] whitespace-nowrap text-[var(--color-hex-666666)]">
                                {row.host}
                            </td>
                            <td className="px-[16px] py-[7px] text-right font-bold text-[var(--color-hex-a0a0a0)]">
                                {row.port}
                            </td>
                            <td className="px-[16px] py-[7px] tracking-[0.08em] text-[var(--color-hex-a0a0a0)]">
                                {row.service}
                            </td>
                            <td className="px-[16px] py-[7px] text-[9.5px] text-[var(--color-hex-555555)]">
                                {row.version}
                            </td>
                            <td className="px-[16px] py-[7px] text-[9px] text-[var(--color-hex-444444)]">
                                {row.banner}
                            </td>
                            <td className="px-[16px] py-[7px] whitespace-nowrap">
                                <span
                                    className="text-[9px] font-semibold tracking-[0.12em]"
                                    style={{
                                        color: STATUS_COLOR[row.status],
                                    }}
                                >
                                    {row.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
