import { useEffect, useState } from "react";

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
            <div
                className="flex items-center justify-between bg-[var(--color-hex-0b0b0b)] px-6 py-2"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <span className="text-[8.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                    {CREDS.length} CREDENTIALS EXTRACTED · SOURCE: DB DUMP + RESPONSE BODY ·
                    OBSERVED
                </span>
                <span className="text-[8px] tracking-[0.14em] text-[var(--color-hex-d29922)]">
                    4 CRACKED · 2 UNCRACKED
                </span>
            </div>
            <table className="w-full border-collapse text-[10.5px]">
                <thead>
                    <tr className="bg-[var(--color-hex-0f0f0f)]">
                        {["USERNAME", "PASSWORD / HASH", "SOURCE", "SCOPE", "STATUS", ""].map(
                            (h) => (
                                <th
                                    key={h}
                                    className="px-[16px] py-[6px] text-left text-[8px] font-semibold tracking-[0.18em] whitespace-nowrap text-[var(--color-hex-444444)]"
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
                    {CREDS.map((row) => {
                        const isRev = revealed.has(row.username);
                        const cracked = row.status === "CRACKED";
                        return (
                            <tr
                                key={row.username}
                                style={{
                                    borderBottom: "1px solid var(--color-hex-111111)",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--color-hex-0f0f0f)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = "transparent")
                                }
                            >
                                <td className="px-[16px] py-[8px] font-semibold tracking-[0.06em] text-[var(--color-hex-a0a0a0)]">
                                    {row.username}
                                </td>
                                <td className="px-[16px] py-[8px]">
                                    {isRev && cracked ? (
                                        <span className="tracking-[0.06em] text-[var(--color-hex-e31b23)]">
                                            {row.plain}
                                        </span>
                                    ) : (
                                        <span className="font-inherit tracking-[0.12em] text-[var(--color-hex-333333)]">
                                            {"●".repeat(12)}
                                        </span>
                                    )}
                                    {!cracked && (
                                        <span className="ml-[8px] text-[9px] tracking-[0.06em] text-[var(--color-hex-333333)]">
                                            {row.hash.slice(0, 16)}…
                                        </span>
                                    )}
                                </td>
                                <td className="px-[16px] py-[8px] text-[9px] text-[var(--color-hex-444444)]">
                                    {row.source}
                                </td>
                                <td className="px-[16px] py-[8px]">
                                    <span
                                        className="text-[9px] tracking-[0.12em]"
                                        style={{
                                            color: (() => {
                                                if (row.scope === "ADMIN") {
                                                    return "var(--color-hex-e31b23)";
                                                }
                                                if (row.scope === "SERVICE") {
                                                    return "var(--color-hex-d29922)";
                                                }
                                                return "var(--color-hex-666666)";
                                            })(),
                                        }}
                                    >
                                        {row.scope}
                                    </span>
                                </td>
                                <td className="px-[16px] py-[8px]">
                                    <span
                                        className="text-[9px] font-semibold tracking-[0.12em]"
                                        style={{
                                            color: cracked
                                                ? "var(--color-hex-3fb950)"
                                                : "var(--color-hex-555555)",
                                        }}
                                    >
                                        {row.status}
                                    </span>
                                </td>
                                <td className="px-[16px] py-[8px]">
                                    {cracked && (
                                        <button
                                            onClick={() => toggle(row.username)}
                                            className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-111111)] px-[8px] py-[2px] text-[8.5px] tracking-[0.12em] text-[var(--color-hex-666666)] hover:border-[var(--color-hex-e31b23)]"
                                        >
                                            {isRev ? "HIDE" : "REVEAL"}
                                        </button>
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
