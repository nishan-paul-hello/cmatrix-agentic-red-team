import { Button } from "@/components/ui/button";
import { type SurfaceType } from "@/features/missions/data/fixtures/wizardMockData";
import { useWizardData } from "@/features/missions/hooks/useWizardData";

export default function SurfaceCards({
    value,
    onChange,
}: {
    value?: SurfaceType;
    onChange?: (v: SurfaceType) => void;
}) {
    const { surfaceOptions } = useWizardData();

    return (
        <div className="flex items-stretch gap-4">
            {surfaceOptions.map((opt) => {
                const selected = value === opt.value;
                return (
                    <Button
                        key={opt.value}
                        variant="outline"
                        onClick={() => onChange?.(opt.value)}
                        className={`h-auto min-h-[160px] flex-1 flex-col items-start justify-start rounded-sm border border-solid px-5 pt-5 pb-4 text-left whitespace-normal transition-colors duration-100 ${selected ? "border-primary bg-transparent" : "border-border bg-background hover:border-muted-foreground hover:bg-card"} cursor-pointer`}
                    >
                        {/* Selected indicator */}
                        {selected && (
                            <div className="bg-primary absolute top-2.5 right-2.5 h-2 w-2 rounded-full" />
                        )}

                        {/* Icon + name */}
                        <div className="mb-2 flex items-center gap-2">
                            <span
                                className={`text-base ${selected ? "text-primary" : "text-muted-foreground"}`}
                            >
                                {opt.icon}
                            </span>
                            <span
                                className={`text-xs font-bold tracking-widest ${selected ? "text-primary" : "text-muted-foreground"}`}
                            >
                                {opt.value}
                            </span>
                        </div>

                        {/* Protocol */}
                        <div
                            className={`mb-3 text-xs font-semibold tracking-widest uppercase ${selected ? "text-primary" : "text-muted-foreground"}`}
                        >
                            {opt.proto}
                        </div>

                        {/* Description */}
                        <div className="text-muted-foreground mb-4 text-xs leading-relaxed tracking-normal">
                            {opt.description}
                        </div>

                        {/* Vuln class tags */}
                        <div className="mb-5 flex flex-wrap gap-1">
                            {opt.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className={`rounded-sm border border-solid px-1.5 py-0.5 text-[10px] font-semibold tracking-widest whitespace-nowrap uppercase ${selected ? "border-primary text-primary bg-transparent" : "border-border text-muted-foreground bg-transparent"}`}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Specialists */}
                        <div className="mt-auto">
                            <div className="text-muted-foreground mb-1 text-[10px] font-semibold tracking-widest uppercase">
                                SPECIALISTS
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {opt.specialists.map((s: string) => (
                                    <span
                                        key={s}
                                        className={`text-[10px] font-semibold tracking-widest uppercase ${selected ? "text-muted-foreground" : "text-muted-foreground/60"}`}
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Button>
                );
            })}
        </div>
    );
}
