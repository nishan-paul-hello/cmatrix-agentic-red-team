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
            <div className="bg-background border-border flex flex-shrink-0 items-center gap-2 border-b px-4 py-2">
                <span className="text-success text-sm tracking-widest">CONFIRMED</span>
                <span className="text-muted-foreground ml-2 text-sm tracking-wide">
                    Active authentication sessions observed by Specialists
                </span>
            </div>
            <table className="w-full border-collapse text-xs">
                <thead>
                    <tr className="bg-card sticky top-0">
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
                                className="text-muted-foreground border-border border-b px-3 py-1.5 text-left text-sm font-semibold tracking-widest whitespace-nowrap"
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
                                borderBottom: "1px solid var(--border)",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--border)")
                            }
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            <td className="text-primary px-3 py-1.5 text-base font-bold">{a.id}</td>
                            <td className="text-muted-foreground px-3 py-1.5 text-base">
                                {a.session}
                            </td>
                            <td className="text-muted-foreground px-3 py-1.5">{a.user}</td>
                            <td className="px-3 py-1.5">
                                <span
                                    className="text-sm font-semibold tracking-normal"
                                    style={{
                                        color:
                                            a.role === "ADMIN"
                                                ? "var(--destructive)"
                                                : "var(--muted-foreground)",
                                    }}
                                >
                                    {a.role}
                                </span>
                            </td>
                            <td className="text-muted-foreground px-3 py-1.5 text-base">
                                {a.method}
                            </td>
                            <td className="text-muted-foreground px-3 py-1.5 text-base">
                                {a.issued}
                            </td>
                            <td
                                className="px-3 py-1.5 text-base"
                                style={{
                                    color:
                                        a.status === "EXPIRED"
                                            ? "var(--border)"
                                            : "var(--muted-foreground)",
                                }}
                            >
                                {a.expiry}
                            </td>
                            <td className="px-3 py-1.5">
                                <span
                                    className="text-sm font-semibold tracking-wide"
                                    style={{
                                        color:
                                            a.status === "ACTIVE"
                                                ? "var(--success)"
                                                : "var(--muted-foreground)",
                                    }}
                                >
                                    {a.status}
                                </span>
                            </td>
                            <td className="text-muted-foreground px-3 py-1.5 text-base tracking-tight">
                                {a.csrf}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
