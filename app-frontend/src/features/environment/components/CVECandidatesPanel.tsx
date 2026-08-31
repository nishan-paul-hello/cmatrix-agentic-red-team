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
import { type CveCandidate } from "@/types/domain-types";

export default function CVECandidatesPanel() {
    const [CVE_CANDIDATES, setData] = useState<CveCandidate[]>([]);
    useEffect(() => {
        void new EnvironmentRepository()
            .fetchAll<CveCandidate>({ collection: "CVE_CANDIDATES", limit: 1000 })
            .then(setData)
            .catch(console.error);
    }, []);

    if (CVE_CANDIDATES.length === 0) {
        return null;
    }

    return (
        <div className="flex-1 overflow-auto">
            <div className="bg-background border-border flex flex-shrink-0 items-center gap-2 border-b px-4 py-2">
                <span className="text-muted-foreground text-sm tracking-widest">
                    VDG HYPOTHESIS CANDIDATES
                </span>
                <span className="text-warning ml-auto text-sm tracking-wide">
                    {CVE_CANDIDATES.filter((c) => c.poc).length} WITH PoC
                </span>
            </div>
            <Table className="w-full border-collapse text-xs">
                <TableHeader>
                    <TableRow className="bg-card sticky top-0">
                        {[
                            "CVE ID",
                            "TECHNOLOGY",
                            "VULN CLASS",
                            "EPSS",
                            "PoC",
                            "LINKED VDG NODE",
                            "E_ORD",
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
                    {[...CVE_CANDIDATES]
                        .sort((a, b) => b.epss - a.epss)
                        .map((c) => (
                            <TableRow
                                key={c.id}
                                className="border-border hover:bg-border border-b bg-transparent transition-colors"
                            >
                                <TableCell className="text-primary px-3 py-1.5 text-base font-bold tracking-tight">
                                    {c.id}
                                </TableCell>
                                <TableCell className="text-muted-foreground px-3 py-1.5">
                                    {c.tech}
                                </TableCell>
                                <TableCell className="text-muted-foreground px-3 py-1.5 text-base">
                                    {c.class}
                                </TableCell>
                                <TableCell className="px-3 py-1.5">
                                    <span
                                        className={`text-xs font-bold ${(() => {
                                            if (c.epss > 0.5) {
                                                return "text-destructive";
                                            }
                                            if (c.epss > 0.3) {
                                                return "text-warning";
                                            }
                                            return "text-muted-foreground";
                                        })()}`}
                                    >
                                        {c.epss.toFixed(2)}
                                    </span>
                                </TableCell>
                                <TableCell className="px-3 py-1.5">
                                    <span
                                        className={`text-sm tracking-wide ${c.poc ? "text-success" : "text-border"}`}
                                    >
                                        {c.poc ? "YES" : "NO"}
                                    </span>
                                </TableCell>
                                <TableCell
                                    className={`px-3 py-1.5 text-base ${c.node !== "\u2014" ? "text-primary font-bold" : "text-border font-normal"}`}
                                >
                                    {c.node}
                                </TableCell>
                                <TableCell className="text-muted-foreground px-3 py-1.5">
                                    {c.eord}/5
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}
