import { Input } from "@/components/ui/input";

export default function WizardTextInput(props: Record<string, unknown>) {
    return (
        <Input
            spellCheck={false}
            className="bg-card text-foreground focus-visible:border-primary h-auto w-full rounded-sm px-3.5 py-2.5 text-sm shadow-none"
            {...props}
        />
    );
}
