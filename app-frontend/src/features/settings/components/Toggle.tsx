import { Switch } from "@/components/ui/switch";

export function Toggle({
    on,
    value,
    onChange,
}: {
    on?: boolean;
    value?: boolean;
    onChange?: (val: boolean) => void;
}) {
    const checked = on ?? value;
    return <Switch checked={checked} onCheckedChange={onChange} />;
}
