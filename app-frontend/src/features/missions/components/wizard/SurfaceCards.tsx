import { type SurfaceType } from "@/features/missions/data/fixtures/wizardMockData";
import { useWizardData } from "@/features/missions/hooks/useWizardData";

export default function SurfaceCards({
    value,
    onChange,
}: {
    value: SurfaceType;
    onChange: (v: SurfaceType) => void;
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
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`font-inherit relative flex flex-1 cursor-pointer flex-col rounded-[2px] border border-solid text-left transition-colors duration-100 ${selected ? "border-[var(--color-brand)] bg-[var(--color-hex-120608)]" : "border-[var(--color-hex-292929)] bg-[var(--color-hex-0d0d0d)] hover:border-[var(--color-hex-444444)] hover:bg-[var(--color-hex-111111)]"}`}
                        style={{
                            padding: "18px 16px 16px",
                        }}
                    >
                        {/* Selected indicator */}
                        {selected && (
                            <div
                                className="absolute top-[10px] right-[10px] h-[8px] w-[8px] bg-[var(--color-brand)]"
                                style={{
                                    borderRadius: "50%",
                                }}
                            />
                        )}

                        {/* Icon + name */}
                        <div className="mb-2 flex items-center gap-2">
                            <span
                                className="text-6xl"
                                style={{
                                    color: selected
                                        ? "var(--color-brand)"
                                        : "var(--color-hex-444444)",
                                }}
                            >
                                {opt.icon}
                            </span>
                            <span
                                className="tracking-wider-2 text-xl font-bold"
                                style={{
                                    color: selected ? "var(--color-fg)" : "var(--color-hex-666666)",
                                }}
                            >
                                {opt.value}
                            </span>
                        </div>

                        {/* Protocol */}
                        <div
                            className="tracking-wider-2 mb-[12px] text-base font-semibold"
                            style={{
                                color: selected
                                    ? "var(--color-hex-9e1118)"
                                    : "var(--color-hex-333333)",
                            }}
                        >
                            {opt.proto}
                        </div>

                        {/* Divider */}
                        <div
                            className="mb-[12px] h-[1px]"
                            style={{
                                background: selected
                                    ? "var(--color-hex-2a0a0c)"
                                    : "var(--color-hex-1a1a1a)",
                            }}
                        />

                        {/* Description */}
                        <div className="text-lg-tight leading-normal-2 tracking-tight-2 mb-[14px] grow text-[var(--color-hex-555555)]">
                            {opt.description}
                        </div>

                        {/* Vuln class tags */}
                        <div className="mb-4 flex flex-wrap gap-1">
                            {opt.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="text-base-tight rounded-[2px] px-[5px] py-[1px] tracking-normal whitespace-nowrap"
                                    style={{
                                        color: selected
                                            ? "var(--color-brand)"
                                            : "var(--color-hex-444444)",
                                        background: selected
                                            ? "var(--color-hex-1a0608)"
                                            : "var(--color-hex-111111)",
                                        border: `1px solid ${selected ? "var(--color-hex-6f171b)" : "var(--color-hex-222222)"}`,
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Divider */}
                        <div
                            className="mb-[10px] h-[1px]"
                            style={{
                                background: selected
                                    ? "var(--color-hex-2a0a0c)"
                                    : "var(--color-hex-1a1a1a)",
                            }}
                        />

                        {/* Specialists */}
                        <div>
                            <div className="tracking-wider-3 mb-[6px] text-sm text-[var(--color-hex-444444)]">
                                SPECIALISTS
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {opt.specialists.map((s: string) => (
                                    <span
                                        key={s}
                                        className="text-sm tracking-wide"
                                        style={{
                                            color: selected
                                                ? "var(--color-hex-a0a0a0)"
                                                : "var(--color-hex-333333)",
                                        }}
                                    >
                                        {s}{" "}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
