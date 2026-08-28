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
            <div className="bg-background border-border flex items-center justify-between border-b px-6 py-2">
                <span className="text-muted-foreground text-sm tracking-widest">
                    {SERVICES.length} SERVICES DETECTED · SOURCE: NMAP 7.94 · DISCOVERED
                </span>
                <span className="text-success text-sm tracking-widest">E_ord ≥ 4 — CONFIRMED</span>
            </div>
            <table className="w-full border-collapse text-xs">
                <thead>
                    <tr className="bg-card">
                        {["HOST", "PORT", "SERVICE", "VERSION", "BANNER", "STATUS"].map((h) => (
                            <th
                                key={h}
                                className="text-muted-foreground border-border border-b px-4 py-1.5 text-left text-sm font-semibold tracking-widest whitespace-nowrap"
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
                            className="border-border cursor-pointer border-b"
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--border)")
                            }
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            <td className="text-muted-foreground px-4 py-1.5 whitespace-nowrap">
                                {row.host}
                            </td>
                            <td className="text-muted-foreground px-4 py-1.5 text-right font-bold">
                                {row.port}
                            </td>
                            <td className="text-muted-foreground px-4 py-1.5 tracking-tight">
                                {row.service}
                            </td>
                            <td className="text-muted-foreground px-4 py-1.5 text-base">
                                {row.version}
                            </td>
                            <td className="text-muted-foreground px-4 py-1.5 text-base">
                                {row.banner}
                            </td>
                            <td className="px-4 py-1.5 whitespace-nowrap">
                                <span
                                    className="text-base font-semibold tracking-wide"
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
