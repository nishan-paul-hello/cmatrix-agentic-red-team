"use client";

import React from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function Chips({
    options,
    value,
    onChange,
}: {
    options: string[];
    value?: string;
    onChange?: (v: string) => void;
}) {
    return (
        <ToggleGroup
            multiple={false}
            value={value ? [value] : []}
            onValueChange={(values) => {
                const next = values[0];
                if (next) {
                    onChange?.(next);
                }
            }}
            variant="outline"
            size="sm"
            className="flex flex-wrap gap-2"
        >
            {options.map((o) => (
                <ToggleGroupItem
                    key={o}
                    value={o}
                    className="data-[state=on]:border-primary data-[state=on]:text-destructive text-xs tracking-wide uppercase"
                >
                    {o}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
}
