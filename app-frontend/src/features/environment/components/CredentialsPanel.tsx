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
                <span className="text-base-tight tracking-wider-2 text-[var(--color-hex-444444)]">
                    {CREDS.length} CREDENTIALS EXTRACTED · SOURCE: DB DUMP + RESPONSE BODY ·
                    OBSERVED
                </span>
                <span className="tracking-wider-1 text-sm text-[var(--color-warning)]">
                    4 CRACKED · 2 UNCRACKED
                </span>
            </div>
            <table className="text-xl-tight w-full border-collapse">
                <thead>
                    <tr className="bg-[var(--color-hex-0f0f0f)]">
                        {["USERNAME", "PASSWORD / HASH", "SOURCE", "SCOPE", "STATUS", ""].map(
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
                                <td className="tracking-tight-1 px-[16px] py-[8px] font-semibold text-[var(--color-hex-a0a0a0)]">
                                    {row.username}
                                </td>
                                <td className="px-[16px] py-[8px]">
                                    {isRev && cracked ? (
                                        <span className="tracking-tight-1 text-[var(--color-brand)]">
                                            {row.plain}
                                        </span>
                                    ) : (
                                        <span className="font-inherit tracking-wide text-[var(--color-hex-333333)]">
                                            {"●".repeat(12)}
                                        </span>
                                    )}
                                    {!cracked && (
                                        <span className="tracking-tight-1 ml-[8px] text-base text-[var(--color-hex-333333)]">
                                            {row.hash.slice(0, 16)}…
                                        </span>
                                    )}
                                </td>
                                <td className="px-[16px] py-[8px] text-base text-[var(--color-hex-444444)]">
                                    {row.source}
                                </td>
                                <td className="px-[16px] py-[8px]">
                                    <span
                                        className="text-base tracking-wide"
                                        style={{
                                            color: (() => {
                                                if (row.scope === "ADMIN") {
                                                    return "var(--color-brand)";
                                                }
                                                if (row.scope === "SERVICE") {
                                                    return "var(--color-warning)";
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
                                        className="text-base font-semibold tracking-wide"
                                        style={{
                                            color: cracked
                                                ? "var(--color-success)"
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
                                            className="font-inherit text-base-tight cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-111111)] px-[8px] py-[2px] tracking-wide text-[var(--color-hex-666666)] hover:border-[var(--color-brand)]"
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
