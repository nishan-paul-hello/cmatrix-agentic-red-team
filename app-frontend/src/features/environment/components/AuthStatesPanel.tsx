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
import { type AuthState } from "@/types/domain-types";

export default function AuthStatesPanel() {
    const [AUTH_STATES, setData] = useState<AuthState[]>([]);
    useEffect(() => {
        void new EnvironmentRepository()
            .fetchAll<AuthState>({ collection: "AUTH_STATES", limit: 1000 })
            .then(setData)
            .catch(console.error);
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
            <Table className="w-full border-collapse text-xs">
                <TableHeader>
                    <TableRow className="bg-card sticky top-0">
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
                    {AUTH_STATES.map((a: AuthState) => (
                        <TableRow
                            key={a.id}
                            className="border-border hover:bg-border border-b bg-transparent transition-colors"
                        >
                            <TableCell className="text-primary px-3 py-1.5 text-base font-bold">
                                {a.id}
                            </TableCell>
                            <TableCell className="text-muted-foreground px-3 py-1.5 text-base">
                                {a.session}
                            </TableCell>
                            <TableCell className="text-muted-foreground px-3 py-1.5">
                                {a.user}
                            </TableCell>
                            <TableCell className="px-3 py-1.5">
                                <span
                                    className={`text-sm font-semibold tracking-normal ${a.role === "ADMIN" ? "text-destructive" : "text-muted-foreground"}`}
                                >
                                    {a.role}
                                </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground px-3 py-1.5 text-base">
                                {a.method}
                            </TableCell>
                            <TableCell className="text-muted-foreground px-3 py-1.5 text-base">
                                {a.issued}
                            </TableCell>
                            <TableCell
                                className={`px-3 py-1.5 text-base ${a.status === "EXPIRED" ? "text-border" : "text-muted-foreground"}`}
                            >
                                {a.expiry}
                            </TableCell>
                            <TableCell className="px-3 py-1.5">
                                <span
                                    className={`text-sm font-semibold tracking-wide ${a.status === "ACTIVE" ? "text-success" : "text-muted-foreground"}`}
                                >
                                    {a.status}
                                </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground px-3 py-1.5 text-base tracking-tight">
                                {a.csrf}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
