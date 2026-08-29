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
import { type ElFinding } from "@/types/domain-types";

export default function ELFindingsPanel() {
    const [EL_FINDINGS, setData] = useState<ElFinding[]>([]);
    useEffect(() => {
        void new EnvironmentRepository()
            .fetchAll<ElFinding>({ collection: "EL_FINDINGS", limit: 1000 })
            .then(setData);
    }, []);

    if (EL_FINDINGS.length === 0) {
        return null;
    }

    return (
        <div className="flex-1 overflow-auto">
            <div className="bg-background border-border flex flex-shrink-0 items-center gap-2 border-b px-4 py-2">
                <span className="text-muted-foreground text-sm tracking-widest">
                    EL FINDINGS CROSS-REFERENCE
                </span>
                <span className="text-muted-foreground ml-2 text-sm">
                    confirmed findings linked to EL evidence artifacts
                </span>
            </div>
            <Table className="w-full border-collapse text-xs">
                <TableHeader>
                    <TableRow className="bg-card sticky top-0">
                        {[
                            "FINDING",
                            "TYPE",
                            "TARGET",
                            "E_ORD",
                            "LINKED VDG NODE",
                            "EVIDENCE ARTIFACTS",
                        ].map((h) => (
                            <TableHead
                                key={h}
                                className="text-muted-foreground border-border border-b px-3 py-1.5 text-left text-sm font-semibold tracking-widest whitespace-nowrap"
                            >
                                {h}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {EL_FINDINGS.map((f) => (
                        <TableRow
                            key={f.id}
                            className="border-border hover:bg-border border-b bg-transparent transition-colors"
                        >
                            <TableCell className="text-primary px-3 py-1.5 text-base font-bold">
                                {f.id}
                            </TableCell>
                            <TableCell className="text-muted-foreground px-3 py-1.5">
                                {f.type}
                            </TableCell>
                            <TableCell className="text-muted-foreground px-3 py-1.5 text-base">
                                {f.target}
                            </TableCell>
                            <TableCell className="text-muted-foreground px-3 py-1.5">
                                {f.eord}/5
                            </TableCell>
                            <TableCell className="text-primary px-3 py-1.5 text-base font-bold">
                                {f.vdgNode}
                            </TableCell>
                            <TableCell className="px-3 py-1.5">
                                <div className="flex flex-wrap gap-1">
                                    {f.evidence.map((e: string) => (
                                        <span
                                            key={e}
                                            className="border-border bg-card text-muted-foreground rounded-sm border-[1px] border-solid px-1 py-px text-xs tracking-tight"
                                        >
                                            {e}
                                        </span>
                                    ))}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
