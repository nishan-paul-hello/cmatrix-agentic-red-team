"use client";

import React, { createContext, useContext } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

import { CAT_STYLE, HELP_KEYS, type PaletteItem } from "./CommandPaletteConstants";

export interface CommandPaletteContextType {
    query: string;
    updateQuery: (q: string) => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
    handleKey: (e: React.KeyboardEvent) => void;
    listRef: React.RefObject<HTMLDivElement | null>;
    filtered: PaletteItem[];
    cats: string[];
    cursor: number;
    setCursor: (c: number) => void;
    onNavigate: (id: string) => void;
    onClose: () => void;
}
export const CommandPaletteContext = createContext<CommandPaletteContextType | null>(null);

export function useCommandPaletteContext() {
    const ctx = useContext(CommandPaletteContext);
    if (!ctx) {
        throw new Error("Missing CommandPaletteContext");
    }
    return ctx;
}

// ─── Props ────────────────────────────────────────────────────────────────────

// ─── Component ────────────────────────────────────────────────────────────────

export default function CommandPaletteView(props: CommandPaletteContextType) {
    const { onClose } = props;

    return (
        <CommandPaletteContext.Provider value={props}>
            <div
                className="fixed inset-0 z-[100] flex items-start justify-center bg-[var(--color-hex-00000099)] pt-[120px]"
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        onClose();
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        onClose();
                    }
                }}
                role="presentation"
            >
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Command palette"
                    className="w-[600px] overflow-hidden rounded-[3px] border border-[var(--color-hex-292929)] bg-[var(--color-hex-0d0d0d)]"
                    style={{ boxShadow: "0 24px 48px var(--color-hex-000000cc)" }}
                >
                    <CommandPaletteView.SearchInput />
                    <CommandPaletteView.ResultList />
                    <CommandPaletteView.FooterHint />
                </div>
            </div>
        </CommandPaletteContext.Provider>
    );
}

CommandPaletteView.SearchInput = function SearchInput() {
    const { query, updateQuery, inputRef, handleKey } = useCommandPaletteContext();
    return (
        <div className="flex h-[48px] items-center gap-3 border-b border-[var(--color-hex-1e1e1e)] px-4">
            <span className="text-[14px] text-[var(--color-hex-333333)]" aria-hidden="true">
                ⌘
            </span>
            <input
                ref={inputRef}
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search missions, findings, actions…"
                aria-label="Search command palette"
                aria-autocomplete="list"
                className="flex-1 border-none bg-transparent text-[12px] tracking-[0.04em] text-[var(--color-hex-f2f2f2)] outline-none"
            />
            {query && (
                <button
                    onClick={() => updateQuery("")}
                    aria-label="Clear search"
                    className="cursor-pointer border-none bg-transparent text-[12px] text-[var(--color-hex-333333)] transition-colors duration-100 hover:text-[var(--color-hex-666666)]"
                >
                    ✕
                </button>
            )}
            <kbd className="rounded-[2px] border border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[6px] py-[2px] text-[8px] text-[var(--color-hex-333333)]">
                ESC
            </kbd>
        </div>
    );
};

CommandPaletteView.ResultList = function ResultList() {
    const { listRef, filtered, cats, cursor, setCursor, onNavigate, onClose } =
        useCommandPaletteContext();
    return (
        <div ref={listRef} className="max-h-[420px] overflow-y-auto">
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                    <div
                        className="mb-[8px] text-[20px] text-[var(--color-hex-1e1e1e)]"
                        aria-hidden="true"
                    >
                        ◇
                    </div>
                    <div className="text-[10px] tracking-[0.14em] text-[var(--color-hex-333333)]">
                        NO RESULTS
                    </div>
                </div>
            ) : (
                cats.map((cat) => (
                    <div key={cat}>
                        {/* Category header */}
                        <div className="border-t border-[var(--color-hex-111111)] bg-[var(--color-hex-0a0a0a)] px-[16px] py-[6px] pb-[3px] text-[7.5px] tracking-[0.2em] text-[var(--color-hex-333333)]">
                            {cat}
                        </div>

                        {/* Items */}
                        {filtered
                            .filter((i) => i.category === cat)
                            .map((item) => {
                                const idx = filtered.indexOf(item);
                                const cc = CAT_STYLE[item.category];
                                const active = idx === cursor;
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => {
                                            onNavigate(item.id);
                                            onClose();
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                onNavigate(item.id);
                                                onClose();
                                            }
                                        }}
                                        onMouseEnter={() => setCursor(idx)}
                                        role="option"
                                        aria-selected={active}
                                        tabIndex={0}
                                        className={[
                                            "flex cursor-pointer items-center gap-3 border-l-2 px-[16px] py-[9px] transition-colors duration-75",
                                            active
                                                ? "border-[var(--color-hex-e31b23)] bg-[var(--color-hex-141414)]"
                                                : "border-transparent",
                                        ].join(" ")}
                                    >
                                        {/* Category badge */}
                                        <span
                                            className="shrink-0 rounded-[2px] px-[6px] py-[1px] text-[9px] font-semibold tracking-[0.1em]"
                                            style={{
                                                color: cc.color,
                                                background: cc.bg,
                                                border: `1px solid ${cc.color}33`,
                                            }}
                                        >
                                            {item.category}
                                        </span>

                                        {/* Label + sub */}
                                        <div className="min-w-0 flex-1">
                                            <div
                                                className="overflow-hidden text-[10.5px] tracking-[0.04em] text-ellipsis whitespace-nowrap"
                                                style={{
                                                    color: active
                                                        ? "var(--color-hex-f2f2f2)"
                                                        : "var(--color-hex-a0a0a0)",
                                                    fontWeight: active ? 700 : 400,
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                            <div className="mt-[1px] overflow-hidden text-[8.5px] tracking-[0.04em] text-ellipsis whitespace-nowrap text-[var(--color-hex-444444)]">
                                                {item.sub}
                                            </div>
                                        </div>

                                        {/* Keyboard shortcut */}
                                        {item.kbd && (
                                            <kbd className="shrink-0 rounded-[2px] border border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[6px] py-[2px] text-[8px] text-[var(--color-hex-333333)]">
                                                {item.kbd}
                                            </kbd>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                ))
            )}
        </div>
    );
};

CommandPaletteView.FooterHint = function FooterHint() {
    const { filtered } = useCommandPaletteContext();
    return (
        <div className="flex items-center justify-between border-t border-[var(--color-hex-141414)] bg-[var(--color-hex-0a0a0a)] px-4 py-2">
            <div className="flex items-center gap-4">
                {HELP_KEYS.map((h) => (
                    <div key={h.k} className="flex items-center gap-1">
                        <kbd className="rounded-[2px] border border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[5px] py-[1px] text-[7.5px] text-[var(--color-hex-333333)]">
                            {h.k}
                        </kbd>
                        <span className="text-[7.5px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                            {h.v}
                        </span>
                    </div>
                ))}
            </div>
            <span className="text-[7.5px] tracking-[0.12em] text-[var(--color-hex-222222)]">
                {filtered.length} RESULTS
            </span>
        </div>
    );
};
