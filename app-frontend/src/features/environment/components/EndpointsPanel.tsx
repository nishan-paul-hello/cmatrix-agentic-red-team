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
import { METHOD_COLOR, type Endpoint } from "@/features/environment/data/mockData";

export default function EndpointsPanel() {
    const [ENDPOINTS, setData] = useState<Endpoint[]>([]);
    useEffect(() => {
        void new EnvironmentRepository()
            .fetchAll<Endpoint>({ collection: "ENDPOINTS", limit: 1000 })
            .then(setData);
    }, []);

    if (ENDPOINTS.length === 0) {
        return null;
    }

    return (
        <>
            <div className="bg-background border-border flex items-center justify-between border-b px-6 py-2">
                <span className="text-muted-foreground text-sm tracking-widest">
                    {ENDPOINTS.length} OBSERVED ENDPOINTS · SOURCE: SPIDER + INFERENCE · OBSERVED
                </span>
                <span className="text-success text-sm tracking-widest">E_ord ≥ 3 — CLEAR</span>
            </div>
            <Table className="w-full border-collapse text-xs">
                <TableHeader>
                    <TableRow className="bg-card">
                        {["ENDPOINT", "METHOD", "AUTH", "PARAMETERS", "SOURCE", "LAST SEEN"].map(
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
                    {ENDPOINTS.map((row) => (
                        <TableRow
                            key={`${row.method}-${row.endpoint}`}
                            className="border-border hover:bg-border cursor-pointer border-b transition-colors duration-75"
                        >
                            <TableCell className="font-inherit text-muted-foreground px-4 py-1.5 whitespace-nowrap">
                                {row.endpoint}
                            </TableCell>
                            <TableCell className="px-4 py-1.5 whitespace-nowrap">
                                <span
                                    className={`rounded-sm px-1 py-px text-base font-semibold tracking-normal ${METHOD_COLOR[row.method] ? "" : "text-muted-foreground"}`}
                                    style={
                                        METHOD_COLOR[row.method]
                                            ? {
                                                  color: METHOD_COLOR[row.method],
                                                  backgroundColor: `${METHOD_COLOR[row.method]}15`,
                                                  borderColor: `${METHOD_COLOR[row.method]}33`,
                                                  borderWidth: 1,
                                                  borderStyle: "solid",
                                              }
                                            : undefined
                                    }
                                >
                                    {row.method}
                                </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground px-4 py-1.5 text-base whitespace-nowrap">
                                {row.auth}
                            </TableCell>
                            <TableCell className="text-muted-foreground px-4 py-1.5 text-base">
                                {row.params}
                            </TableCell>
                            <TableCell className="text-muted-foreground px-4 py-1.5 text-base tracking-normal">
                                {row.source}
                            </TableCell>
                            <TableCell className="text-muted-foreground px-4 py-1.5 text-base whitespace-nowrap">
                                {row.seen}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
