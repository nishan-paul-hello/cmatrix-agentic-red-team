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
                <span className="tracking-wider-3 text-sm text-[var(--color-success)]">
                    CONFIRMED
                </span>
                <span className="ml-[8px] text-sm tracking-wide text-[var(--color-hex-555555)]">
                    Active authentication sessions observed by Specialists
                </span>
            </div>
            <table className="text-xl-tight w-full border-collapse">
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
                            <td className="px-[12px] py-[7px] text-base font-bold text-[var(--color-brand)]">
                                {a.id}
                            </td>
                            <td className="px-[12px] py-[7px] text-base text-[var(--color-hex-555555)]">
                                {a.session}
                            </td>
                            <td className="px-[12px] py-[7px] text-[var(--color-hex-a0a0a0)]">
                                {a.user}
                            </td>
                            <td className="px-[12px] py-[7px]">
                                <span
                                    className="text-base-tight font-semibold tracking-normal"
                                    style={{
                                        color:
                                            a.role === "ADMIN"
                                                ? "var(--color-danger)"
                                                : "var(--color-hex-666666)",
                                    }}
                                >
                                    {a.role}
                                </span>
                            </td>
                            <td className="px-[12px] py-[7px] text-base text-[var(--color-hex-666666)]">
                                {a.method}
                            </td>
                            <td className="px-[12px] py-[7px] text-base text-[var(--color-hex-444444)]">
                                {a.issued}
                            </td>
                            <td
                                className="px-[12px] py-[7px] text-base"
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
                                    className="text-base-tight font-semibold tracking-wide"
                                    style={{
                                        color:
                                            a.status === "ACTIVE"
                                                ? "var(--color-success)"
                                                : "var(--color-hex-444444)",
                                    }}
                                >
                                    {a.status}
                                </span>
                            </td>
                            <td className="tracking-tight-1 px-[12px] py-[7px] text-base text-[var(--color-hex-444444)]">
                                {a.csrf}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
