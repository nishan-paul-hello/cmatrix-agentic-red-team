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
            <div
                className="flex flex-shrink-0 items-center gap-2 bg-[var(--color-hex-0a0a0a)] px-4 py-2"
                style={{
                    borderBottom: "1px solid var(--color-hex-141414)",
                }}
            >
                <span className="tracking-wider-3 text-sm text-[var(--color-hex-444444)]">
                    DISCOVERED PARAMETERS
                </span>
                <span className="ml-auto text-sm tracking-wide text-[var(--color-brand)]">
                    {PARAMS.filter((p) => p.injectable).length} INJECTION ELIGIBLE
                </span>
            </div>
            <table className="text-xl-tight w-full border-collapse">
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
                                className="tracking-wider-2 px-[12px] py-[6px] text-left text-sm font-semibold whitespace-nowrap text-[var(--color-hex-444444)]"
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
                            <td className="px-[12px] py-[7px] text-base font-bold text-[var(--color-brand)]">
                                {p.id}
                            </td>
                            <td className="px-[12px] py-[7px] text-base text-[var(--color-hex-555555)]">
                                {p.endpoint}
                            </td>
                            <td className="px-[12px] py-[7px] font-semibold text-[var(--color-hex-a0a0a0)]">
                                {p.param}
                            </td>
                            <td className="px-[12px] py-[7px] text-base text-[var(--color-hex-666666)]">
                                {p.type}
                            </td>
                            <td className="px-[12px] py-[7px] text-base text-[var(--color-hex-555555)]">
                                {p.source}
                            </td>
                            <td className="px-[12px] py-[7px]">
                                <span
                                    className="text-base-tight font-semibold tracking-wide"
                                    style={{
                                        color: p.injectable
                                            ? "var(--color-danger)"
                                            : "var(--color-hex-333333)",
                                    }}
                                >
                                    {p.injectable ? "YES" : "—"}
                                </span>
                            </td>
                            <td className="px-[12px] py-[7px] text-base text-[var(--color-hex-444444)]">
                                {p.lastVal}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
