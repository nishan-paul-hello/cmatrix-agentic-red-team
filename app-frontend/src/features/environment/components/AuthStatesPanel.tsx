import { useEffect, useState } from "react";

import { EnvironmentRepository } from "@/features/environment/data/EnvironmentRepository";
import { type AuthState } from "@/types/domain-types";

export default function AuthStatesPanel() {
    const [AUTH_STATES, setData] = useState<AuthState[]>([]);
    useEffect(() => {
        void new EnvironmentRepository()
            .fetchAll<AuthState>({ collection: "AUTH_STATES", limit: 1000 })
            .then(setData);
    }, []);

    if (AUTH_STATES.length === 0) {
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
                <span className="text-[8px] tracking-[0.18em] text-[var(--color-hex-3fb950)]">
                    CONFIRMED
                </span>
                <span className="ml-[8px] text-[8px] tracking-[0.12em] text-[var(--color-hex-555555)]">
                    Active authentication sessions observed by Specialists
                </span>
            </div>
            <table className="w-full border-collapse text-[10.5px]">
                <thead>
                    <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                        {[
                            "ID",
                            "SESSION",
                            "USER",
                            "ROLE",
                            "METHOD",
                            "ISSUED",
                            "EXPIRY",
                            "STATUS",
                            "CSRF TOKEN",
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
                    {AUTH_STATES.map((a: AuthState) => (
                        <tr
                            key={a.id}
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--color-hex-0f0f0f)")
                            }
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            <td className="px-[12px] py-[7px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                                {a.id}
                            </td>
                            <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-555555)]">
                                {a.session}
                            </td>
                            <td className="px-[12px] py-[7px] text-[var(--color-hex-a0a0a0)]">
                                {a.user}
                            </td>
                            <td className="px-[12px] py-[7px]">
                                <span
                                    className="text-[8.5px] font-semibold tracking-[0.1em]"
                                    style={{
                                        color:
                                            a.role === "ADMIN"
                                                ? "var(--color-hex-ff2a32)"
                                                : "var(--color-hex-666666)",
                                    }}
                                >
                                    {a.role}
                                </span>
                            </td>
                            <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-666666)]">
                                {a.method}
                            </td>
                            <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-444444)]">
                                {a.issued}
                            </td>
                            <td
                                className="px-[12px] py-[7px] text-[9px]"
                                style={{
                                    color:
                                        a.status === "EXPIRED"
                                            ? "var(--color-hex-333333)"
                                            : "var(--color-hex-444444)",
                                }}
                            >
                                {a.expiry}
                            </td>
                            <td className="px-[12px] py-[7px]">
                                <span
                                    className="text-[8.5px] font-semibold tracking-[0.12em]"
                                    style={{
                                        color:
                                            a.status === "ACTIVE"
                                                ? "var(--color-hex-3fb950)"
                                                : "var(--color-hex-444444)",
                                    }}
                                >
                                    {a.status}
                                </span>
                            </td>
                            <td className="px-[12px] py-[7px] text-[9px] tracking-[0.06em] text-[var(--color-hex-444444)]">
                                {a.csrf}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
