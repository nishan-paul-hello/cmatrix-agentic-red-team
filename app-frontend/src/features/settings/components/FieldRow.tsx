import React from "react";
import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sanitizeInput } from "@/utils/sanitize";

export function FieldRow({
    label,
    unit,
    name,
    value,
    onChange,
}: {
    label: string;
    unit?: string;
    name?: string;
    value?: string;
    onChange?: (v: string) => void;
}) {
    const form = useFormContext();

    if (name) {
        return (
            <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                    <FormItem className="border-border mb-4 flex flex-col items-start gap-2 border-b pb-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:space-y-0">
                        <FormLabel className="text-muted-foreground text-xs leading-none font-normal tracking-tight">
                            {label}
                        </FormLabel>
                        <FormControl>
                            <div className="flex items-center gap-2">
                                <Input
                                    {...field}
                                    className="text-muted-foreground w-[72px] text-right text-xs"
                                />
                                {unit && (
                                    <span className="text-muted-foreground min-w-[52px] text-sm">
                                        {unit}
                                    </span>
                                )}
                            </div>
                        </FormControl>
                    </FormItem>
                )}
            />
        );
    }

    return (
        <div className="border-border mb-4 flex flex-col items-start gap-2 border-b pb-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <span className="text-muted-foreground text-xs tracking-tight">{label}</span>
            <div className="flex items-center gap-2">
                <Input
                    value={value}
                    onChange={(e) => onChange?.(sanitizeInput(e.target.value))}
                    className="text-muted-foreground w-[72px] text-right text-xs"
                />
                {unit && <span className="text-muted-foreground min-w-[52px] text-sm">{unit}</span>}
            </div>
        </div>
    );
}
