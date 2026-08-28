import { useEffect, useState } from "react";

import { EnvironmentRepository } from "@/features/environment/data/EnvironmentRepository";
import { type Parameter } from "@/types/domain-types";

export default function ParametersPanel() {
    const [PARAMS, setData] = useState<Parameter[]>([]);
    useEffect(() => {
        void new EnvironmentRepository()
            .fetchAll<Parameter>({ collection: "PARAMS", limit: 1000 })
            .then(setData);
    }, []);

    if (PARAMS.length === 0) {
        return null;
    }

    return (
        <div className="flex-1 overflow-auto">
            <div className="bg-background border-border flex flex-shrink-0 items-center gap-2 border-b px-4 py-2">
                <span className="text-muted-foreground text-sm tracking-widest">
                    DISCOVERED PARAMETERS
                </span>
                <span className="text-primary ml-auto text-sm tracking-wide">
                    {PARAMS.filter((p) => p.injectable).length} INJECTION ELIGIBLE
                </span>
            </div>
            <table className="w-full border-collapse text-xs">
                <thead>
                    <tr className="bg-card sticky top-0">
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
                                className="text-muted-foreground border-border border-b px-3 py-1.5 text-left text-sm font-semibold tracking-widest whitespace-nowrap"
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
                                borderBottom: "1px solid var(--border)",
                                background: i % 2 ? "var(--background)" : "transparent",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--border)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                    i % 2 ? "var(--background)" : "transparent")
                            }
                        >
                            <td className="text-primary px-3 py-1.5 text-base font-bold">{p.id}</td>
                            <td className="text-muted-foreground px-3 py-1.5 text-base">
                                {p.endpoint}
                            </td>
                            <td className="text-muted-foreground px-3 py-1.5 font-semibold">
                                {p.param}
                            </td>
                            <td className="text-muted-foreground px-3 py-1.5 text-base">
                                {p.type}
                            </td>
                            <td className="text-muted-foreground px-3 py-1.5 text-base">
                                {p.source}
                            </td>
                            <td className="px-3 py-1.5">
                                <span
                                    className="text-sm font-semibold tracking-wide"
                                    style={{
                                        color: p.injectable
                                            ? "var(--destructive)"
                                            : "var(--border)",
                                    }}
                                >
                                    {p.injectable ? "YES" : "—"}
                                </span>
                            </td>
                            <td className="text-muted-foreground px-3 py-1.5 text-base">
                                {p.lastVal}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
