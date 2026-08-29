import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
            <Table className="w-full border-collapse text-xs">
                <TableHeader>
                    <TableRow className="bg-card">
                        {["USERNAME", "PASSWORD / HASH", "SOURCE", "SCOPE", "STATUS", ""].map(
                            (h) => (
                                <TableHead
                                    key={h}
                                    className="text-muted-foreground border-border border-b px-4 py-1.5 text-left text-sm font-semibold tracking-widest whitespace-nowrap"
                                >
                                    {h}
                                </TableHead>
                            ),
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {CREDS.map((row) => {
                        const isRev = revealed.has(row.username);
                        const cracked = row.status === "CRACKED";
                        return (
                            <TableRow
                                key={row.username}
                                className="border-border hover:bg-border border-b bg-transparent transition-colors"
                            >
                                <TableCell className="text-muted-foreground px-4 py-2 font-semibold tracking-tight">
                                    {row.username}
                                </TableCell>
                                <TableCell className="px-4 py-2">
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
                                </TableCell>
                                <TableCell className="text-muted-foreground px-4 py-2 text-base">
                                    {row.source}
                                </TableCell>
                                <TableCell className="px-4 py-2">
                                    <span
                                        className={`text-base tracking-wide ${(() => {
                                            if (row.scope === "ADMIN") {
                                                return "text-primary";
                                            }
                                            if (row.scope === "SERVICE") {
                                                return "text-warning";
                                            }
                                            return "text-muted-foreground";
                                        })()}`}
                                    >
                                        {row.scope}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-2">
                                    <span
                                        className={`text-base font-semibold tracking-wide ${
                                            cracked ? "text-success" : "text-muted-foreground"
                                        }`}
                                    >
                                        {row.status}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-2">
                                    {cracked && (
                                        <Button
                                            variant="outline"
                                            onClick={() => toggle(row.username)}
                                            className="bg-card text-muted-foreground hover:border-primary border-border h-auto cursor-pointer rounded-sm border-[1px] px-2 py-0.5 text-sm tracking-wide"
                                        >
                                            {isRev ? "HIDE" : "REVEAL"}
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}
