import React from "react";

import { Input } from "@/components/ui/input";

export function TextInput({ value, onChange, ...props }: React.ComponentProps<typeof Input>) {
    return (
        <Input
            value={value}
            onChange={onChange}
            className="text-muted-foreground text-xs"
            {...props}
        />
    );
}
