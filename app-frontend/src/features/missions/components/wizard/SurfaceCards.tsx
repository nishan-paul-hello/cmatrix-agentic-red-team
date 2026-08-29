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
                        className={`h-[160px] flex-1 flex-col items-start justify-start rounded-sm border border-solid px-5 pt-5 pb-4 text-left whitespace-normal transition-colors duration-100 ${selected ? "border-primary bg-muted" : "border-border bg-background hover:border-muted-foreground hover:bg-card"}`}
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
                                className={`text-xs font-bold tracking-widest ${selected ? "text-foreground" : "text-muted-foreground"}`}
                            >
                                {opt.value}
                            </span>
                        </div>

                        {/* Protocol */}
                        <div className="text-border mb-3 text-base font-semibold tracking-widest">
                            {opt.proto}
                        </div>

                        {/* Divider */}
                        <div className="bg-border mb-3 h-px" />

                        {/* Description */}
                        <div className="leading-normal-2 text-muted-foreground mb-3.5 grow text-base tracking-tight">
                            {opt.description}
                        </div>

                        {/* Vuln class tags */}
                        <div className="mb-4 flex flex-wrap gap-1">
                            {opt.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className={`rounded-sm border border-solid px-1 py-px text-sm tracking-normal whitespace-nowrap ${selected ? "text-primary bg-border border-border" : "text-muted-foreground bg-border border-border"}`}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="bg-border mb-2.5 h-px" />

                        {/* Specialists */}
                        <div>
                            <div className="text-muted-foreground mb-1.5 text-sm tracking-widest">
                                SPECIALISTS
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {opt.specialists.map((s: string) => (
                                    <span
                                        key={s}
                                        className={`text-sm tracking-wide ${selected ? "text-muted-foreground" : "text-border"}`}
                                    >
                                        {s}{" "}
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
