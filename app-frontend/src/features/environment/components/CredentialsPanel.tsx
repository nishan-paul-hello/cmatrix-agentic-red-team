import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { EnvironmentRepository } from "@/features/environment/data/EnvironmentRepository";
import { type CredentialEntry } from "@/types/domain-types";

export default function CredentialsPanel() {
    const [CREDS, setData] = useState<CredentialEntry[]>([]);
    useEffect(() => {
        void new EnvironmentRepository()
            .fetchAll<CredentialEntry>({ collection: "CREDS", limit: 1000 })
            .then(setData);
    }, []);

    const [revealed, setRevealed] = useState<Set<string>>(new Set());

    if (CREDS.length === 0) {
        return null;
    }

    const toggle = (u: string) =>
        setRevealed((p) => {
            const n = new Set(p);
            if (n.has(u)) {
                n.delete(u);
            } else {
                n.add(u);
            }
            return n;
        });
    return (
        <>
            <div className="bg-background border-border flex items-center justify-between border-b px-6 py-2">
                <span className="text-muted-foreground text-sm tracking-widest">
                    {CREDS.length} CREDENTIALS EXTRACTED · SOURCE: DB DUMP + RESPONSE BODY ·
                    OBSERVED
                </span>
                <span className="text-warning text-sm tracking-widest">
                    4 CRACKED · 2 UNCRACKED
                </span>
            </div>
            <table className="w-full border-collapse text-xs">
                <thead>
                    <tr className="bg-card">
                        {["USERNAME", "PASSWORD / HASH", "SOURCE", "SCOPE", "STATUS", ""].map(
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
                    {CREDS.map((row) => {
                        const isRev = revealed.has(row.username);
                        const cracked = row.status === "CRACKED";
                        return (
                            <tr
                                key={row.username}
                                style={{
                                    borderBottom: "1px solid var(--border)",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--border)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = "transparent")
                                }
                            >
                                <td className="text-muted-foreground px-4 py-2 font-semibold tracking-tight">
                                    {row.username}
                                </td>
                                <td className="px-4 py-2">
                                    {isRev && cracked ? (
                                        <span className="text-primary tracking-tight">
                                            {row.plain}
                                        </span>
                                    ) : (
                                        <span className="font-inherit text-muted-foreground tracking-wide">
                                            {"●".repeat(12)}
                                        </span>
                                    )}
                                    {!cracked && (
                                        <span className="text-muted-foreground ml-2 text-base tracking-tight">
                                            {row.hash.slice(0, 16)}…
                                        </span>
                                    )}
                                </td>
                                <td className="text-muted-foreground px-4 py-2 text-base">
                                    {row.source}
                                </td>
                                <td className="px-4 py-2">
                                    <span
                                        className="text-base tracking-wide"
                                        style={{
                                            color: (() => {
                                                if (row.scope === "ADMIN") {
                                                    return "var(--primary)";
                                                }
                                                if (row.scope === "SERVICE") {
                                                    return "var(--warning)";
                                                }
                                                return "var(--muted-foreground)";
                                            })(),
                                        }}
                                    >
                                        {row.scope}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    <span
                                        className="text-base font-semibold tracking-wide"
                                        style={{
                                            color: cracked
                                                ? "var(--success)"
                                                : "var(--muted-foreground)",
                                        }}
                                    >
                                        {row.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    {cracked && (
                                        <Button
                                            variant="outline"
                                            onClick={() => toggle(row.username)}
                                            className="bg-card text-muted-foreground hover:border-primary border-border h-auto cursor-pointer rounded-sm border-[1px] px-2 py-0.5 text-sm tracking-wide"
                                        >
                                            {isRev ? "HIDE" : "REVEAL"}
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}
