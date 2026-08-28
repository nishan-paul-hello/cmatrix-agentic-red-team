import { useEffect, useState } from "react";

import { EnvironmentRepository } from "@/features/environment/data/EnvironmentRepository";
import { METHOD_COLOR, type Endpoint } from "@/features/environment/data/mockData";

export default function EndpointsPanel() {
    const [ENDPOINTS, setData] = useState<Endpoint[]>([]);
    useEffect(() => {
        void new EnvironmentRepository()
            .fetchAll<Endpoint>({ collection: "ENDPOINTS", limit: 1000 })
            .then(setData);
    }, []);

    if (ENDPOINTS.length === 0) {
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
                <span className="text-base-tight tracking-wider-2 text-[var(--color-hex-444444)]">
                    {ENDPOINTS.length} OBSERVED ENDPOINTS · SOURCE: SPIDER + INFERENCE · OBSERVED
                </span>
                <span className="tracking-wider-1 text-sm text-[var(--color-success)]">
                    E_ord ≥ 3 — CLEAR
                </span>
            </div>
            <table className="text-xl-tight w-full border-collapse">
                <thead>
                    <tr className="bg-[var(--color-hex-0f0f0f)]">
                        {["ENDPOINT", "METHOD", "AUTH", "PARAMETERS", "SOURCE", "LAST SEEN"].map(
                            (h) => (
                                <th
                                    key={h}
                                    className="tracking-wider-3 px-[16px] py-[6px] text-left text-sm font-semibold whitespace-nowrap text-[var(--color-hex-444444)]"
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
                                    className="rounded-[2px] px-[5px] py-[1px] text-base font-semibold tracking-normal"
                                    style={{
                                        color: METHOD_COLOR[row.method] ?? "#666",
                                        background: `${METHOD_COLOR[row.method]}15`,
                                        border: `1px solid ${METHOD_COLOR[row.method]}33`,
                                    }}
                                >
                                    {row.method}
                                </span>
                            </td>
                            <td className="text-lg-tight px-[16px] py-[7px] whitespace-nowrap text-[var(--color-hex-555555)]">
                                {row.auth}
                            </td>
                            <td className="text-lg-tight px-[16px] py-[7px] text-[var(--color-hex-444444)]">
                                {row.params}
                            </td>
                            <td className="px-[16px] py-[7px] text-base tracking-normal text-[var(--color-hex-333333)]">
                                {row.source}
                            </td>
                            <td className="px-[16px] py-[7px] text-base whitespace-nowrap text-[var(--color-hex-333333)]">
                                {row.seen}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
