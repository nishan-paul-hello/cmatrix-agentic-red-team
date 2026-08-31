import React from "react";
import { useFormContext } from "react-hook-form";

import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";

export default function FieldBlock({
    label,
    hint,
    mb,
    name,
    children,
}: {
    label: string;
    hint?: string;
    mb?: boolean;
    name?: string;
    children: React.ReactNode;
}) {
    const form = useFormContext();

    if (name) {
        return (
            <FormField
                control={form.control}
                name={name}
                render={({ field }) => {
                    const clonedChild = React.isValidElement(children)
                        ? React.cloneElement(
                              children as React.ReactElement,
                              { ...field, onChange: field.onChange } as Record<string, unknown>,
                          )
                        : children;

                    return (
                        <FormItem className={mb ? "mb-7 space-y-0" : "space-y-0"}>
                            <FormLabel className="text-muted-foreground mb-2 text-xs font-semibold tracking-widest uppercase">
                                {label}
                            </FormLabel>
                            <FormControl>
                                <div>{clonedChild}</div>
                            </FormControl>
                            {hint && (
                                <FormDescription className="text-muted-foreground mt-1.5 text-xs">
                                    {hint}
                                </FormDescription>
                            )}
                        </FormItem>
                    );
                }}
            />
        );
    }

    return (
        <div className={mb ? "mb-7" : ""}>
            <label className="text-muted-foreground mb-2 block text-xs font-semibold tracking-widest uppercase">
                {label}
            </label>
            {children}
            {hint && <div className="text-muted-foreground mt-1.5 text-xs">{hint}</div>}
        </div>
    );
}
