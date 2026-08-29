import { useEffect, useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { EnvironmentRepository } from "@/features/environment/data/EnvironmentRepository";
import { type EvidenceArtifact } from "@/types/domain-types";

export default function EvidencePanel() {
    const [EVIDENCE_ARTIFACTS, setData] = useState<EvidenceArtifact[]>([]);
    useEffect(() => {
        void new EnvironmentRepository()
            .fetchAll<EvidenceArtifact>({ collection: "EVIDENCE_ARTIFACTS", limit: 1000 })
            .then(setData);
    }, []);

    const [sel, setSel] = useState<string | null>(null);

    if (EVIDENCE_ARTIFACTS.length === 0) {
        return null;
    }
    return (
        <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
                <div className="bg-background border-border flex flex-shrink-0 items-center gap-2 border-b px-4 py-2">
                    <span className="text-muted-foreground text-sm tracking-widest">
                        RAW EVIDENCE ARTIFACTS
                    </span>
                    <span className="text-muted-foreground ml-auto text-sm">
                        {EVIDENCE_ARTIFACTS.length} ARTIFACTS
                    </span>
                </div>
                <Table className="w-full border-collapse text-xs">
                    <TableHeader>
                        <TableRow className="bg-card sticky top-0">
                            {["ARTIFACT ID", "TYPE", "FINDING", "TIMESTAMP", "SIZE", "NOTE"].map(
                                (h) => (
                                    <TableHead
                                        key={h}
                                        className="text-muted-foreground border-border border-b px-3 py-1.5 text-left text-sm font-semibold tracking-widest whitespace-nowrap"
                                    >
                                        {h}
                                    </TableHead>
                                ),
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {EVIDENCE_ARTIFACTS.map((a, i) => (
                            <TableRow
                                key={a.id}
                                onClick={() => setSel(a.id === sel ? null : a.id)}
                                className={`border-border hover:bg-border cursor-pointer border-b transition-colors ${(() => {
                                    if (sel === a.id) {
                                        return "bg-border";
                                    }
                                    if (i % 2) {
                                        return "bg-background";
                                    }
                                    return "bg-transparent";
                                })()}`}
                            >
                                <TableCell className="text-primary px-3 py-1.5 text-base font-bold">
                                    {a.id}
                                </TableCell>
                                <TableCell className="text-muted-foreground px-3 py-1.5 text-base">
                                    {a.type}
                                </TableCell>
                                <TableCell className="text-primary px-3 py-1.5 text-base font-bold">
                                    {a.finding}
                                </TableCell>
                                <TableCell className="text-muted-foreground px-3 py-1.5 text-base">
                                    {a.ts}
                                </TableCell>
                                <TableCell className="text-muted-foreground px-3 py-1.5 text-right text-base">
                                    {a.size}
                                </TableCell>
                                <TableCell className="text-muted-foreground px-3 py-1.5">
                                    {a.note}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {sel && (
                <div className="w-panel-sm bg-background border-border shrink-0 overflow-y-auto border-l px-3.5 py-4">
                    {(() => {
                        const a = EVIDENCE_ARTIFACTS.find((x) => x.id === sel);
                        if (!a) {
                            return null;
                        }
                        return (
                            <>
                                <div className="text-muted-foreground mb-3 text-sm tracking-widest">
                                    ARTIFACT DETAIL
                                </div>
                                {[
                                    {
                                        k: "ID",
                                        v: a.id,
                                    },
                                    {
                                        k: "TYPE",
                                        v: a.type,
                                    },
                                    {
                                        k: "FINDING",
                                        v: a.finding,
                                    },
                                    {
                                        k: "TIMESTAMP",
                                        v: a.ts,
                                    },
                                    {
                                        k: "SIZE",
                                        v: a.size,
                                    },
                                ].map((r) => (
                                    <div key={r.k} className="mb-2">
                                        <div className="text-muted-foreground mb-0.5 text-xs tracking-widest">
                                            {r.k}
                                        </div>
                                        <div className="text-muted-foreground text-xs">{r.v}</div>
                                    </div>
                                ))}
                                <div className="border-border bg-card text-muted-foreground mt-3 rounded-sm border-[1px] border-solid px-2.5 py-2 text-base leading-loose">
                                    {a.note}
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}
