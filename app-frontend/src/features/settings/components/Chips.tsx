"use client";

import React from "react";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";

import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

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
        <ToggleGroupPrimitive
            multiple={false}
            value={value ? [value] : []}
            onValueChange={(values) => {
                const next = values[0];
                if (next) {
                    onChange?.(next);
                }
            }}
            className="flex flex-wrap gap-2"
        >
            {options.map((o) => (
                <TogglePrimitive
                    key={o}
                    value={o}
                    className={cn(
                        toggleVariants({ variant: "outline", size: "sm" }),
                        "data-[state=on]:border-primary data-[state=on]:text-destructive text-xs tracking-wide uppercase",
                    )}
                >
                    {o}
                </TogglePrimitive>
            ))}
        </ToggleGroupPrimitive>
    );
}
