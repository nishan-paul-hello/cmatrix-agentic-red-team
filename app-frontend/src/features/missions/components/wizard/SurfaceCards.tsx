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
        <div
            className="flex gap-4"
            style={{
                alignItems: "stretch",
            }}
        >
            {surfaceOptions.map((opt) => {
                const selected = value === opt.value;
                return (
                    <Button
                        key={opt.value}
                        variant="outline"
                        onClick={() => onChange?.(opt.value)}
                        className={`h-[160px] flex-1 flex-col items-start justify-start rounded-sm border border-solid text-left whitespace-normal transition-colors duration-100 ${selected ? "border-primary bg-muted" : "border-border bg-background hover:border-muted-foreground hover:bg-card"}`}
                        style={{
                            padding: "20px 20px 16px",
                        }}
                    >
                        {/* Selected indicator */}
                        {selected && (
                            <div
                                className="bg-primary absolute top-2.5 right-2.5 h-2 w-2"
                                style={{
                                    borderRadius: "50%",
                                }}
                            />
                        )}

                        {/* Icon + name */}
                        <div className="mb-2 flex items-center gap-2">
                            <span
                                className="text-base"
                                style={{
                                    color: selected ? "var(--primary)" : "var(--muted-foreground)",
                                }}
                            >
                                {opt.icon}
                            </span>
                            <span
                                className="text-xs font-bold tracking-widest"
                                style={{
                                    color: selected
                                        ? "var(--foreground)"
                                        : "var(--muted-foreground)",
                                }}
                            >
                                {opt.value}
                            </span>
                        </div>

                        {/* Protocol */}
                        <div
                            className="mb-3 text-base font-semibold tracking-widest"
                            style={{
                                color: selected ? "var(--border)" : "var(--border)",
                            }}
                        >
                            {opt.proto}
                        </div>

                        {/* Divider */}
                        <div
                            className="mb-3 h-px"
                            style={{
                                background: selected ? "var(--border)" : "var(--border)",
                            }}
                        />

                        {/* Description */}
                        <div className="leading-normal-2 text-muted-foreground mb-3.5 grow text-base tracking-tight">
                            {opt.description}
                        </div>

                        {/* Vuln class tags */}
                        <div className="mb-4 flex flex-wrap gap-1">
                            {opt.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="rounded-sm px-1 py-px text-sm tracking-normal whitespace-nowrap"
                                    style={{
                                        color: selected
                                            ? "var(--primary)"
                                            : "var(--muted-foreground)",
                                        background: selected ? "var(--border)" : "var(--border)",
                                        border: `1px solid ${selected ? "var(--border)" : "var(--border)"}`,
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Divider */}
                        <div
                            className="mb-2.5 h-px"
                            style={{
                                background: selected ? "var(--border)" : "var(--border)",
                            }}
                        />

                        {/* Specialists */}
                        <div>
                            <div className="text-muted-foreground mb-1.5 text-sm tracking-widest">
                                SPECIALISTS
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {opt.specialists.map((s: string) => (
                                    <span
                                        key={s}
                                        className="text-sm tracking-wide"
                                        style={{
                                            color: selected
                                                ? "var(--muted-foreground)"
                                                : "var(--border)",
                                        }}
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
