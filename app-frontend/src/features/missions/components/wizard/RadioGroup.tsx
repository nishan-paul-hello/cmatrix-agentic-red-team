import { RadioGroupItem, RadioGroup as ShadcnRadioGroup } from "@/components/ui/radio-group";

export default function RadioGroup<T extends string>({
    value,
    onChange,
    options,
}: {
    value?: T;
    onChange?: (v: T) => void;
    options: {
        value?: T;
        desc: string;
    }[];
}) {
    return (
        <ShadcnRadioGroup
            value={value}
            onValueChange={onChange}
            className="border-border divide-border flex flex-col gap-0 divide-y overflow-hidden rounded-sm border-[1px] border-solid"
        >
            {options.map((opt) => {
                const selected = value === opt.value;
                return (
                    <label
                        key={opt.value}
                        htmlFor={`radio-${opt.value}`}
                        className={`flex h-auto w-full cursor-pointer items-start gap-4 rounded-none border-l-[3px] px-4 py-3 text-left whitespace-normal transition-colors ${selected ? "bg-muted border-l-primary" : "bg-background hover:bg-card border-l-transparent"}`}
                    >
                        <RadioGroupItem
                            value={opt.value}
                            id={`radio-${opt.value}`}
                            className="mt-0.5 h-3.5 w-3.5"
                        />
                        <div>
                            <div
                                className={`mb-0.5 text-xs font-semibold tracking-widest ${selected ? "text-foreground" : "text-muted-foreground"}`}
                            >
                                {opt.value}
                            </div>
                            <div className="text-muted-foreground text-base leading-snug tracking-tight">
                                {opt.desc}
                            </div>
                        </div>
                    </label>
                );
            })}
        </ShadcnRadioGroup>
    );
}
