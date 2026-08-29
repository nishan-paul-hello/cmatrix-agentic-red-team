import { RadioGroupItem, RadioGroup as ShadcnRadioGroup } from "@/components/ui/radio-group";
import { type ModeType } from "@/features/missions/data/fixtures/wizardMockData";
import { useWizardData } from "@/features/missions/hooks/useWizardData";

export default function ModeCards({
    value,
    onChange,
}: {
    value?: ModeType;
    onChange?: (v: ModeType) => void;
}) {
    const { modeOptions } = useWizardData();

    return (
        <ShadcnRadioGroup
            value={value}
            onValueChange={onChange}
            className="flex items-stretch gap-5"
        >
            {modeOptions.map((opt) => {
                const selected = value === opt.value;
                return (
                    <label
                        key={opt.value}
                        htmlFor={`mode-${opt.value}`}
                        className={`flex h-auto flex-1 cursor-pointer flex-col items-stretch justify-start rounded-sm border border-solid px-5 pt-[22px] pb-[18px] text-left whitespace-normal transition-colors duration-100 ${selected ? "border-primary bg-transparent" : "border-border bg-background hover:border-muted-foreground hover:bg-card"}`}
                    >
                        <RadioGroupItem
                            value={opt.value}
                            id={`mode-${opt.value}`}
                            className="sr-only"
                        />
                        {/* Top row: icon + title + selected dot */}
                        <div className="mb-1 flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                                <span
                                    className={`text-xs leading-none ${selected ? "text-primary" : "text-muted-foreground"}`}
                                >
                                    {opt.icon}
                                </span>
                                <span
                                    className={`text-xs font-bold tracking-widest ${selected ? "text-primary" : "text-muted-foreground"}`}
                                >
                                    {opt.value}
                                </span>
                            </div>
                            {selected && (
                                <div className="bg-primary mt-1 h-2 w-2 shrink-0 rounded-full" />
                            )}
                        </div>

                        {/* Hint + badges row */}
                        <div className="mb-4 flex items-center gap-2">
                            <span
                                className={`text-[10px] font-semibold tracking-widest uppercase ${selected ? "text-primary" : "text-muted-foreground"}`}
                            >
                                {opt.hint}
                            </span>
                            <span
                                className="rounded-sm px-1.5 py-0.5 text-[10px] font-semibold tracking-widest uppercase"
                                style={{
                                    color: opt.badgeColor,
                                    background: `${opt.badgeColor}18`,
                                    border: `1px solid ${opt.badgeColor}44`,
                                }}
                            >
                                {opt.badge}
                            </span>
                            <span className="border-border text-muted-foreground rounded-sm border-[1px] border-solid bg-transparent px-1.5 py-0.5 text-[10px] tracking-widest uppercase">
                                {opt.difficulty}
                            </span>
                        </div>

                        {/* Description */}
                        <div className="text-muted-foreground mb-4 grow text-xs leading-relaxed tracking-normal">
                            {opt.description}
                        </div>

                        {/* Implications list */}
                        <div className="flex flex-col gap-2">
                            {opt.implications.map((imp: { label: string; detail: string }) => (
                                <div key={imp.label} className="flex items-start gap-2">
                                    <span
                                        className={`min-w-[96px] shrink-0 text-[10px] font-semibold tracking-widest uppercase ${selected ? "text-primary" : "text-muted-foreground"}`}
                                    >
                                        {imp.label}
                                    </span>
                                    <span className="text-muted-foreground text-xs leading-relaxed tracking-normal">
                                        {imp.detail}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </label>
                );
            })}
        </ShadcnRadioGroup>
    );
}
