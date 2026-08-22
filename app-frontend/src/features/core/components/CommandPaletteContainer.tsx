"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

import CommandPaletteView, { ALL_ITEMS } from "@/features/core/components/CommandPaletteView";
import { useDebounce } from "@/hooks/useDebounce";
import { sanitizeInput } from "@/utils/sanitize";

interface CommandPaletteProps {
    onClose: () => void;
    onNavigate: (id: string) => void;
}

export default function CommandPaletteContainer({ onClose, onNavigate }: CommandPaletteProps) {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 300);
    const [cursor, setCursor] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const cleanQuery = sanitizeInput(debouncedQuery.trim());
    const filtered = cleanQuery
        ? ALL_ITEMS.filter(
              (i) =>
                  i.label.toLowerCase().includes(cleanQuery.toLowerCase()) ||
                  i.sub.toLowerCase().includes(cleanQuery.toLowerCase()) ||
                  i.category.includes(cleanQuery.toUpperCase()),
          )
        : ALL_ITEMS;

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    function updateQuery(value: string) {
        setQuery(value);
        setCursor(0);
    }

    const handleKey = useCallback(
        (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setCursor((c) => Math.min(c + 1, filtered.length - 1));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setCursor((c) => Math.max(c - 1, 0));
                    break;
                case "Enter":
                    if (filtered[cursor]) {
                        onNavigate(filtered[cursor].id);
                        onClose();
                    }
                    break;
                case "Escape":
                    onClose();
                    break;
                default:
                    break;
            }
        },
        [filtered, cursor, onNavigate, onClose],
    );

    useEffect(() => {
        const el = listRef.current?.children[cursor] as HTMLElement | undefined;
        el?.scrollIntoView({ block: "nearest" });
    }, [cursor]);

    const cats = Array.from(new Set(filtered.map((i) => i.category)));

    return (
        <CommandPaletteView
            query={query}
            updateQuery={updateQuery}
            cursor={cursor}
            setCursor={setCursor}
            inputRef={inputRef}
            listRef={listRef}
            filtered={filtered}
            cats={cats}
            handleKey={handleKey}
            onClose={onClose}
            onNavigate={onNavigate}
        />
    );
}
