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
import { type Parameter } from "@/types/domain-types";

export default function ParametersPanel() {
    const [PARAMS, setData] = useState<Parameter[]>([]);
    useEffect(() => {
        void new EnvironmentRepository()
            .fetchAll<Parameter>({ collection: "PARAMS", limit: 1000 })
            .then(setData);
    }, []);

    if (PARAMS.length === 0) {
        return null;
    }

    return (
        <div className="flex-1 overflow-auto">
            <div className="bg-background border-border flex flex-shrink-0 items-center gap-2 border-b px-4 py-2">
                <span className="text-muted-foreground text-sm tracking-widest">
                    DISCOVERED PARAMETERS
                </span>
                <span className="text-primary ml-auto text-sm tracking-wide">
                    {PARAMS.filter((p) => p.injectable).length} INJECTION ELIGIBLE
                </span>
            </div>
            <Table className="w-full border-collapse text-xs">
                <TableHeader>
                    <TableRow className="bg-card sticky top-0">
                        {[
                            "ID",
                            "ENDPOINT",
                            "PARAMETER",
                            "TYPE",
                            "SOURCE",
                            "INJECTABLE",
                            "LAST VALUE",
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
                    {PARAMS.map((p, i) => (
                        <TableRow
                            key={p.id}
                            className={`border-border hover:bg-border border-b transition-colors ${i % 2 ? "bg-background" : "bg-transparent"}`}
                        >
                            <TableCell className="text-primary px-3 py-1.5 text-base font-bold">
                                {p.id}
                            </TableCell>
                            <TableCell className="text-muted-foreground px-3 py-1.5 text-base">
                                {p.endpoint}
                            </TableCell>
                            <TableCell className="text-muted-foreground px-3 py-1.5 font-semibold">
                                {p.param}
                            </TableCell>
                            <TableCell className="text-muted-foreground px-3 py-1.5 text-base">
                                {p.type}
                            </TableCell>
                            <TableCell className="text-muted-foreground px-3 py-1.5 text-base">
                                {p.source}
                            </TableCell>
                            <TableCell className="px-3 py-1.5">
                                <span
                                    className={`text-sm font-semibold tracking-wide ${p.injectable ? "text-destructive" : "text-border"}`}
                                >
                                    {p.injectable ? "YES" : "\u2014"}
                                </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground px-3 py-1.5 text-base">
                                {p.lastVal}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
