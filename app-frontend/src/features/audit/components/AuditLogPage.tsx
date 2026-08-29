import React, { useCallback, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    drawerFields,
    RESULT_FILTERS,
    TABLE_HEADERS,
    TYPE_FILTERS,
} from "@/features/audit/components/AuditLogConstants";
// ─── Static data ──────────────────────────────────────────────────────────────

import {
    AuditLogRow,
    RESULT_C,
    TYPE_C,
    type ColorPair,
} from "@/features/audit/components/AuditLogRow";
import { useAuditFeed } from "@/features/audit/hooks/useAuditFeed";
import { useAuditFilters } from "@/features/audit/hooks/useAuditFilters";
import { type AuditEntry, type AuditResultValue } from "@/types/domain-types";

export default React.memo(function AuditLogPage() {
    const entries = useAuditFeed();
    const { typeFilter, setTypeFilter, resultFilter, setResultFilter, search, setSearch, visible } =
        useAuditFilters(entries);
    const [sel, setSel] = useState<AuditEntry | null>(null);
    const parentRef = useRef<HTMLDivElement>(null);

    const toggleSel = useCallback((entry: AuditEntry) => {
        setSel((prev) => (prev?.id === entry.id ? null : entry));
    }, []);

    const rowVirtualizer = useVirtualizer({
        count: visible.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 33, // Approx height of a row
        overscan: 10,
    });

    const virtualItems = rowVirtualizer.getVirtualItems();
    const paddingTop = virtualItems.length > 0 ? (virtualItems[0]?.start ?? 0) : 0;
    const paddingBottom =
        virtualItems.length > 0
            ? rowVirtualizer.getTotalSize() - (virtualItems[virtualItems.length - 1]?.end ?? 0)
            : 0;

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Header */}
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-4">
                <div className="page-eyebrow">SYSTEM</div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-foreground text-xs font-bold tracking-wide">AUDIT LOG</h1>
                    <div className="flex items-center gap-4">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="SEARCH…"
                            aria-label="Search audit log"
                            className="bg-background text-muted-foreground focus-visible:border-primary h-auto w-[160px] rounded-sm px-2.5 py-1 text-base tracking-tight shadow-none"
                        />
                        <span className="text-muted-foreground text-sm tracking-wide">
                            {visible.length} EVENTS
                        </span>
                    </div>
                </div>
            </div>

            {/* Filter strip */}
            <div className="border-border bg-background flex flex-shrink-0 flex-wrap items-center gap-3 border-b px-6 py-2">
                {/* Type filters */}
                <div className="flex gap-1" role="group" aria-label="Filter by event type">
                    {TYPE_FILTERS.map((t) => {
                        const active = typeFilter === t;
                        const cc: ColorPair | undefined = t === "ALL" ? undefined : TYPE_C[t];
                        return (
                            <Button
                                key={t}
                                variant="outline"
                                onClick={() => setTypeFilter(t)}
                                aria-pressed={active}
                                className={`h-auto rounded-sm border border-solid px-2 py-0.5 text-xs tracking-wide transition-colors ${active ? `${cc?.bg ?? "bg-border"} ${cc?.c ?? "text-foreground"} ${cc?.border ?? "border-foreground/30"}` : "border-border text-muted-foreground bg-transparent"}`}
                            >
                                {t}
                            </Button>
                        );
                    })}
                </div>

                <div className="bg-muted h-4 w-px" aria-hidden="true" />

                {/* Result filters */}
                <div className="flex gap-1" role="group" aria-label="Filter by result">
                    {RESULT_FILTERS.map((r) => {
                        const active = resultFilter === r;
                        const color: string | undefined = RESULT_C[r as AuditResultValue];
                        return (
                            <Button
                                key={r}
                                variant="outline"
                                onClick={() => setResultFilter(r)}
                                aria-pressed={active}
                                className={`h-auto rounded-sm border border-solid bg-transparent px-2 py-0.5 text-xs tracking-wide hover:bg-transparent ${active ? `border-current ${color}` : "border-border text-muted-foreground"}`}
                            >
                                {r}
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Table + detail drawer */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
                {/* Table */}
                <div ref={parentRef} className="flex flex-1 flex-col overflow-y-auto">
                    <div className="w-full overflow-x-auto">
                        <Table className="w-full border-collapse">
                            <TableHeader>
                                <TableRow className="bg-card z-header sticky top-0">
                                    {TABLE_HEADERS.map((h) => (
                                        <TableHead
                                            key={h}
                                            className="border-border text-muted-foreground border-b px-3 py-1 text-left text-xs font-semibold tracking-widest whitespace-nowrap"
                                        >
                                            {h}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paddingTop > 0 && (
                                    <TableRow>
                                        <TableCell style={{ height: `${paddingTop}px` }} />
                                    </TableRow>
                                )}
                                {virtualItems.map((virtualRow) => {
                                    const e = visible[virtualRow.index];
                                    return (
                                        <AuditLogRow
                                            key={e.id}
                                            e={e}
                                            isSelected={sel?.id === e.id}
                                            onClick={toggleSel}
                                        />
                                    );
                                })}
                                {paddingBottom > 0 && (
                                    <TableRow>
                                        <TableCell style={{ height: `${paddingBottom}px` }} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Detail drawer */}
                {sel && (
                    <div className="border-border bg-background lg:w-panel-md flex w-full flex-shrink-0 flex-col overflow-y-auto border-t lg:border-t-0 lg:border-l">
                        <div className="border-border flex items-start justify-between border-b px-4 pt-4 pb-3">
                            <div>
                                <div className="text-foreground text-xs font-bold tracking-normal">
                                    {sel.id}
                                </div>
                                <div className="text-muted-foreground mt-0.5 text-sm">{sel.ts}</div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => setSel(null)}
                                aria-label="Close detail drawer"
                                className="text-muted-foreground hover:text-muted-foreground h-auto p-0.5 text-sm hover:bg-transparent"
                            >
                                ✕
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-2">
                            {drawerFields(sel).map((row) => (
                                <div key={row.k}>
                                    <div className="text-muted-foreground mb-0.5 text-xs tracking-widest">
                                        {row.k}
                                    </div>
                                    <div
                                        className={`text-xs leading-normal ${row.c ?? "text-muted-foreground"}`}
                                    >
                                        {row.v}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});
