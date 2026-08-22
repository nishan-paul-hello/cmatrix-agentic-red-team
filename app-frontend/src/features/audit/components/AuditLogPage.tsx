import React, { useCallback, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { useAuditFeed } from "@/features/audit/hooks/useAuditFeed";
import { useAuditFilters } from "@/features/audit/hooks/useAuditFilters";
import {
    AUDIT_RESULT,
    type AuditEntry,
    type AuditEventType,
    type AuditResultValue,
} from "@/types/domain-types";

// ─── Static data ──────────────────────────────────────────────────────────────

// ─── Style maps ───────────────────────────────────────────────────────────────

interface ColorPair {
    c: string;
    bg: string;
}

const TYPE_C: Record<AuditEventType, ColorPair> = {
    AUTH: { c: "var(--color-hex-a0a0a0)", bg: "var(--color-hex-111111)" },
    MISSION: { c: "var(--color-hex-e31b23)", bg: "var(--color-hex-120608)" },
    EXECUTION: { c: "var(--color-hex-666666)", bg: "var(--color-hex-0d0d0d)" },
    ESCALATION: { c: "var(--color-hex-d29922)", bg: "var(--color-hex-110e00)" },
    SYSTEM: { c: "var(--color-hex-3fb950)", bg: "var(--color-hex-061a0c)" },
    CONFIG: { c: "var(--color-hex-a0a0a0)", bg: "var(--color-hex-111111)" },
};

const RESULT_C: Record<AuditResultValue, string> = {
    SUCCESS: "var(--color-hex-3fb950)",
    FAILURE: "var(--color-hex-ff2a32)",
    WARNING: "var(--color-hex-d29922)",
};

// ─── Filter options ───────────────────────────────────────────────────────────

const TYPE_FILTERS = [
    "ALL",
    "AUTH",
    "MISSION",
    "EXECUTION",
    "ESCALATION",
    "SYSTEM",
    "CONFIG",
] as const;

const RESULT_FILTERS = [
    "ALL",
    AUDIT_RESULT.SUCCESS,
    AUDIT_RESULT.FAILURE,
    AUDIT_RESULT.WARNING,
] as const;

const TABLE_HEADERS = ["ID", "TIMESTAMP", "TYPE", "ACTOR", "ACTION", "RESOURCE", "RESULT"] as const;

// ─── Detail drawer field definition ──────────────────────────────────────────

interface DrawerField {
    k: string;
    v: string;
    c?: string;
}

function drawerFields(sel: AuditEntry): DrawerField[] {
    return [
        { k: "TYPE", v: sel.type, c: TYPE_C[sel.type].c },
        { k: "ACTOR", v: sel.actor },
        { k: "ACTION", v: sel.action },
        { k: "RESOURCE", v: sel.resource },
        { k: "RESULT", v: sel.result, c: RESULT_C[sel.result] },
        { k: "IP / SOURCE", v: sel.ip },
        { k: "DETAIL", v: sel.detail },
    ];
}

// ─── Component ────────────────────────────────────────────────────────────────

const AuditLogRow = React.memo(function AuditLogRowInner({
    e,
    isSelected,
    onClick,
}: {
    e: AuditEntry;
    isSelected: boolean;
    onClick: () => void;
}) {
    const tc = TYPE_C[e.type];
    const rc = RESULT_C[e.result];
    return (
        <tr
            onClick={onClick}
            className={[
                "cursor-pointer border-b border-[var(--color-hex-0e0e0e)] transition-colors duration-75",
                isSelected ? "bg-[var(--color-hex-0d0d0d)]" : "hover:bg-[var(--color-hex-0a0a0a)]",
            ].join(" ")}
        >
            <td className="px-[12px] py-[7px] text-[8.5px] text-[var(--color-hex-333333)]">
                {e.id}
            </td>
            <td className="px-[12px] py-[7px] text-[8.5px] whitespace-nowrap text-[var(--color-hex-333333)]">
                {e.ts}
            </td>
            <td className="px-[12px] py-[7px]">
                <span
                    className="rounded-[2px] px-[5px] py-[1px] text-[8px] font-semibold tracking-[0.1em]"
                    style={{
                        color: tc.c,
                        background: tc.bg,
                        border: `1px solid ${tc.c}33`,
                    }}
                >
                    {e.type}
                </span>
            </td>
            <td className="px-[12px] py-[7px] text-[9px] tracking-[0.04em] text-[var(--color-hex-666666)]">
                {e.actor}
            </td>
            <td className="px-[12px] py-[7px] text-[9px] font-semibold tracking-[0.04em] text-[var(--color-hex-a0a0a0)]">
                {e.action}
            </td>
            <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-444444)]">
                {e.resource}
            </td>
            <td className="px-[12px] py-[7px]">
                <span className="text-[8.5px] font-semibold tracking-[0.1em]" style={{ color: rc }}>
                    {e.result}
                </span>
            </td>
        </tr>
    );
});

export default function AuditLogPage() {
    const entries = useAuditFeed();
    const { typeFilter, setTypeFilter, resultFilter, setResultFilter, search, setSearch, visible } =
        useAuditFilters(entries);
    const [sel, setSel] = useState<AuditEntry | null>(null);

    const toggleSel = useCallback((entry: AuditEntry) => {
        setSel((prev) => (prev?.id === entry.id ? null : entry));
    }, []);

    const parentRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line react-hooks/incompatible-library
    const rowVirtualizer = useVirtualizer({
        count: visible.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 37, // Approximate row height
        overscan: 10,
    });

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Header */}
            <div className="flex-shrink-0 border-b border-[var(--color-hex-1e1e1e)] px-6 pt-5 pb-4">
                <div className="page-eyebrow">SYSTEM</div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        AUDIT LOG
                    </h1>
                    <div className="flex items-center gap-4">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="SEARCH…"
                            aria-label="Search audit log"
                            className="w-[160px] rounded-[2px] border border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[10px] py-[4px] text-[9px] tracking-[0.08em] text-[var(--color-hex-a0a0a0)] transition-colors duration-100 outline-none focus:border-[var(--color-hex-e31b23)]"
                        />
                        <span className="text-[8.5px] tracking-[0.12em] text-[var(--color-hex-333333)]">
                            {visible.length} EVENTS
                        </span>
                    </div>
                </div>
            </div>

            {/* Filter strip */}
            <div className="flex flex-shrink-0 flex-wrap items-center gap-3 border-b border-[var(--color-hex-141414)] bg-[var(--color-hex-0a0a0a)] px-6 py-2">
                {/* Type filters */}
                <div className="flex gap-1" role="group" aria-label="Filter by event type">
                    {TYPE_FILTERS.map((t) => {
                        const active = typeFilter === t;
                        const cc: ColorPair | undefined = t === "ALL" ? undefined : TYPE_C[t];
                        return (
                            <button
                                key={t}
                                onClick={() => setTypeFilter(t)}
                                aria-pressed={active}
                                className="cursor-pointer rounded-[2px] px-[8px] py-[2px] text-[7.5px] tracking-[0.12em] transition-colors duration-100"
                                style={{
                                    background: active
                                        ? (cc?.bg ?? "var(--color-hex-1e1e1e)")
                                        : "transparent",
                                    border: `1px solid ${active ? (cc?.c ?? "var(--color-hex-f2f2f2)") : "var(--color-hex-1e1e1e)"}`,
                                    color: active
                                        ? (cc?.c ?? "var(--color-hex-f2f2f2)")
                                        : "var(--color-hex-444444)",
                                }}
                            >
                                {t}
                            </button>
                        );
                    })}
                </div>

                <div className="h-[16px] w-[1px] bg-[var(--color-hex-1e1e1e)]" aria-hidden="true" />

                {/* Result filters */}
                <div className="flex gap-1" role="group" aria-label="Filter by result">
                    {RESULT_FILTERS.map((r) => {
                        const active = resultFilter === r;
                        const color: string | undefined = RESULT_C[r as AuditResultValue];
                        return (
                            <button
                                key={r}
                                onClick={() => setResultFilter(r)}
                                aria-pressed={active}
                                className="cursor-pointer rounded-[2px] bg-transparent px-[8px] py-[2px] text-[7.5px] tracking-[0.12em] transition-colors duration-100"
                                style={{
                                    border: `1px solid ${active ? color : "var(--color-hex-1e1e1e)"}`,
                                    color: active ? color : "var(--color-hex-444444)",
                                }}
                            >
                                {r}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Table + detail drawer */}
            <div className="flex min-h-0 flex-1 overflow-hidden">
                {/* Table */}
                <div className="flex-1 overflow-y-auto" ref={parentRef}>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="sticky top-0 z-10 bg-[var(--color-hex-0f0f0f)]">
                                {TABLE_HEADERS.map((h) => (
                                    <th
                                        key={h}
                                        className="border-b border-[var(--color-hex-1a1a1a)] px-[12px] py-[5px] text-left text-[7.5px] font-semibold tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rowVirtualizer.getVirtualItems().length > 0 && (
                                <tr>
                                    <td
                                        style={{
                                            height: `${rowVirtualizer.getVirtualItems()[0].start}px`,
                                        }}
                                        colSpan={7}
                                    />
                                </tr>
                            )}
                            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const e = visible[virtualRow.index];
                                return (
                                    <AuditLogRow
                                        key={e.id}
                                        e={e}
                                        isSelected={sel?.id === e.id}
                                        onClick={() => toggleSel(e)}
                                    />
                                );
                            })}
                            {rowVirtualizer.getVirtualItems().length > 0 && (
                                <tr>
                                    <td
                                        style={{
                                            height: `${
                                                rowVirtualizer.getTotalSize() -
                                                rowVirtualizer.getVirtualItems()[
                                                    rowVirtualizer.getVirtualItems().length - 1
                                                ].end
                                            }px`,
                                        }}
                                        colSpan={7}
                                    />
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Detail drawer */}
                {sel && (
                    <div className="flex w-[300px] flex-shrink-0 flex-col overflow-y-auto border-l border-[var(--color-hex-292929)] bg-[var(--color-hex-0d0d0d)]">
                        <div className="flex items-start justify-between border-b border-[var(--color-hex-1e1e1e)] px-4 pt-4 pb-3">
                            <div>
                                <div className="text-[11px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                                    {sel.id}
                                </div>
                                <div className="mt-[2px] text-[8.5px] text-[var(--color-hex-444444)]">
                                    {sel.ts}
                                </div>
                            </div>
                            <button
                                onClick={() => setSel(null)}
                                aria-label="Close detail drawer"
                                className="cursor-pointer border-none bg-transparent text-[14px] text-[var(--color-hex-444444)] transition-colors duration-100 hover:text-[var(--color-hex-a0a0a0)]"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex flex-col gap-4 px-4 py-4">
                            {drawerFields(sel).map((row) => (
                                <div key={row.k}>
                                    <div className="mb-[3px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                        {row.k}
                                    </div>
                                    <div
                                        className="text-[10px] leading-[1.6]"
                                        style={{ color: row.c ?? "var(--color-hex-888888)" }}
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
}
