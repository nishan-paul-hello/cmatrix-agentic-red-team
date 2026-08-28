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
            <div className="bg-background border-border flex items-center justify-between border-b px-6 py-2">
                <span className="text-muted-foreground text-sm tracking-widest">
                    {ENDPOINTS.length} OBSERVED ENDPOINTS · SOURCE: SPIDER + INFERENCE · OBSERVED
                </span>
                <span className="text-success text-sm tracking-widest">E_ord ≥ 3 — CLEAR</span>
            </div>
            <table className="w-full border-collapse text-xs">
                <thead>
                    <tr className="bg-card">
                        {["ENDPOINT", "METHOD", "AUTH", "PARAMETERS", "SOURCE", "LAST SEEN"].map(
                            (h) => (
                                <th
                                    key={h}
                                    className="text-muted-foreground border-border border-b px-4 py-1.5 text-left text-sm font-semibold tracking-widest whitespace-nowrap"
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
                            className="border-border hover:bg-border cursor-pointer border-b transition-colors duration-75"
                        >
                            <td className="font-inherit text-muted-foreground px-4 py-1.5 whitespace-nowrap">
                                {row.endpoint}
                            </td>
                            <td className="px-4 py-1.5 whitespace-nowrap">
                                <span
                                    className="rounded-sm px-1 py-px text-base font-semibold tracking-normal"
                                    style={{
                                        color:
                                            METHOD_COLOR[row.method] ?? "var(--muted-foreground)",
                                        background: `${METHOD_COLOR[row.method]}15`,
                                        border: `1px solid ${METHOD_COLOR[row.method]}33`,
                                    }}
                                >
                                    {row.method}
                                </span>
                            </td>
                            <td className="text-muted-foreground px-4 py-1.5 text-base whitespace-nowrap">
                                {row.auth}
                            </td>
                            <td className="text-muted-foreground px-4 py-1.5 text-base">
                                {row.params}
                            </td>
                            <td className="text-muted-foreground px-4 py-1.5 text-base tracking-normal">
                                {row.source}
                            </td>
                            <td className="text-muted-foreground px-4 py-1.5 text-base whitespace-nowrap">
                                {row.seen}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
