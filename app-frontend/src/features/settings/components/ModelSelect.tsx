import React from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { sanitizeInput } from "@/utils/sanitize";

const MODEL_OPTIONS = ["claude-opus-5", "claude-sonnet-5", "claude-haiku-4-5"];

export function ModelSelect({
    value,
    onChange,
    ...props
}: Omit<React.ComponentProps<typeof Select>, "value" | "onValueChange"> & {
    value?: string;
    onChange: (value: string) => void;
}) {
    return (
        <Select
            value={value}
            onValueChange={(v) => onChange(sanitizeInput(v as string))}
            {...props}
        >
            <SelectTrigger className="text-muted-foreground w-panel-sm-narrow text-xs">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {MODEL_OPTIONS.map((m) => (
                    <SelectItem key={m} value={m} className="text-xs">
                        {m}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
