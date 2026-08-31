import React from "react";
import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function Field({
    label,
    name,
    children,
}: {
    label: string;
    name?: string;
    children: React.ReactNode;
}) {
    const form = useFormContext();

    if (name) {
        return (
            <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                    <FormItem className="mb-5">
                        <FormLabel className="text-muted-foreground mb-2 block text-sm leading-none font-normal tracking-widest">
                            {label}
                        </FormLabel>
                        <FormControl>
                            {React.isValidElement(children)
                                ? React.cloneElement(children as React.ReactElement, { ...field })
                                : children}
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                    </FormItem>
                )}
            />
        );
    }

    return (
        <div className="mb-5">
            <div className="text-muted-foreground mb-2 text-sm tracking-widest">{label}</div>
            {children}
        </div>
    );
}
