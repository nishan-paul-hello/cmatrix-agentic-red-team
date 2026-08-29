"use client";

import React, { createContext, useContext } from "react";

import { Button } from "@/components/ui/button";
// ─── Props ────────────────────────────────────────────────────────────────────

// ─── Component ────────────────────────────────────────────────────────────────

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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

export default function CommandPaletteView(props: CommandPaletteContextType) {
    const { onClose } = props;

    return (
        <CommandPaletteContext.Provider value={props}>
            <Dialog
                open
                onOpenChange={(open) => {
                    if (!open) {
                        onClose();
                    }
                }}
            >
                <DialogContent
                    showCloseButton={false}
                    aria-label="Command palette"
                    className="border-border bg-background sm:w-panel-xl sm:max-w-panel-xl top-6 w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] translate-y-0 gap-0 overflow-hidden rounded-[3px] border p-0 sm:top-[120px]"
                    style={{ boxShadow: "0 24px 48px var(--border)" }}
                >
                    <CommandPaletteView.SearchInput />
                    <CommandPaletteView.ResultList />
                    <CommandPaletteView.FooterHint />
                </DialogContent>
            </Dialog>
        </CommandPaletteContext.Provider>
    );
}

CommandPaletteView.SearchInput = function SearchInput() {
    const { query, updateQuery, inputRef, handleKey } = useCommandPaletteContext();
    return (
        <div className="border-border flex h-12 items-center gap-3 border-b px-4">
            <span className="text-muted-foreground text-sm" aria-hidden="true">
                ⌘
            </span>
            <Input
                ref={inputRef}
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search missions, findings, actions…"
                aria-label="Search command palette"
                aria-autocomplete="list"
                className="text-foreground flex-1 border-none bg-transparent px-0 text-xs tracking-tighter shadow-none outline-none focus-visible:ring-0"
            />
            {query && (
                <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => updateQuery("")}
                    aria-label="Clear search"
                    className="text-muted-foreground hover:text-muted-foreground cursor-pointer hover:bg-transparent"
                >
                    ✕
                </Button>
            )}
            <kbd className="border-border bg-card text-muted-foreground rounded-sm border px-1.5 py-0.5 text-sm">
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
                    <div className="text-muted-foreground mb-2 text-xs" aria-hidden="true">
                        ◇
                    </div>
                    <div className="text-muted-foreground text-xs tracking-widest">NO RESULTS</div>
                </div>
            ) : (
                cats.map((cat) => (
                    <div key={cat}>
                        {/* Category header */}
                        <div className="border-border bg-background text-muted-foreground border-t px-4 py-1.5 pb-0.5 text-xs tracking-widest">
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
                                            "flex cursor-pointer items-center gap-3 border-l-2 px-4 py-2 transition-colors duration-75",
                                            active
                                                ? "border-primary bg-card"
                                                : "border-transparent",
                                        ].join(" ")}
                                    >
                                        {/* Category badge */}
                                        <span
                                            className="shrink-0 rounded-sm px-1.5 py-px text-base font-semibold tracking-normal"
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
                                                className="overflow-hidden text-xs tracking-tighter text-ellipsis whitespace-nowrap"
                                                style={{
                                                    color: active
                                                        ? "var(--foreground)"
                                                        : "var(--muted-foreground)",
                                                    fontWeight: active ? 700 : 400,
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                            <div className="text-muted-foreground mt-px overflow-hidden text-sm tracking-tighter text-ellipsis whitespace-nowrap">
                                                {item.sub}
                                            </div>
                                        </div>

                                        {/* Keyboard shortcut */}
                                        {item.kbd && (
                                            <kbd className="border-border bg-card text-muted-foreground shrink-0 rounded-sm border px-1.5 py-0.5 text-sm">
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
        <div className="border-border bg-background flex items-center justify-between border-t px-4 py-2">
            <div className="flex items-center gap-4">
                {HELP_KEYS.map((h) => (
                    <div key={h.k} className="flex items-center gap-1">
                        <kbd className="border-border bg-card text-muted-foreground rounded-sm border px-1 py-px text-xs">
                            {h.k}
                        </kbd>
                        <span className="text-muted-foreground text-xs tracking-normal">{h.v}</span>
                    </div>
                ))}
            </div>
            <span className="text-muted-foreground text-xs tracking-wide">
                {filtered.length} RESULTS
            </span>
        </div>
    );
};
