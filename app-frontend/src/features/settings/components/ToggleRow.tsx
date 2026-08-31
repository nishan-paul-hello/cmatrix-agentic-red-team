import React from "react";
import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Toggle } from "@/features/settings/components/Toggle";

export function ToggleRow({ label, name, on }: { label: string; name?: string; on?: boolean }) {
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
                            <Toggle
                                value={Boolean(field.value)}
                                onChange={field.onChange as (val: boolean) => void}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
        );
    }

    return (
        <div className="border-border mb-4 flex flex-col items-start gap-2 border-b pb-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <span className="text-muted-foreground text-xs tracking-tight">{label}</span>
            <Toggle on={on} />
        </div>
    );
}
