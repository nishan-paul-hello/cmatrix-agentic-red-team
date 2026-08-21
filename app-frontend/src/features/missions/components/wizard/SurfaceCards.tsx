import { SURFACE_OPTIONS, type SurfaceType } from "@/features/missions/data/wizardMockData";

export default function SurfaceCards({
    value,
    onChange,
}: {
    value: SurfaceType;
    onChange: (v: SurfaceType) => void;
}) {
    return (
        <div
            className="flex gap-4"
            style={{
                alignItems: "stretch",
            }}
        >
            {SURFACE_OPTIONS.map((opt) => {
                const selected = value === opt.value;
                return (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`font-inherit relative flex flex-1 cursor-pointer flex-col rounded-[2px] border border-solid text-left transition-colors duration-100 ${selected ? "border-[var(--color-hex-e31b23)] bg-[var(--color-hex-120608)]" : "border-[var(--color-hex-292929)] bg-[var(--color-hex-0d0d0d)] hover:border-[var(--color-hex-444444)] hover:bg-[var(--color-hex-111111)]"}`}
                        style={{
                            padding: "18px 16px 16px",
                        }}
                    >
                        {/* Selected indicator */}
                        {selected && (
                            <div
                                className="absolute top-[10px] right-[10px] h-[8px] w-[8px] bg-[var(--color-hex-e31b23)]"
                                style={{
                                    borderRadius: "50%",
                                }}
                            />
                        )}

                        {/* Icon + name */}
                        <div className="mb-2 flex items-center gap-2">
                            <span
                                className="text-[16px]"
                                style={{
                                    color: selected
                                        ? "var(--color-hex-e31b23)"
                                        : "var(--color-hex-444444)",
                                }}
                            >
                                {opt.icon}
                            </span>
                            <span
                                className="text-[11px] font-bold tracking-[0.16em]"
                                style={{
                                    color: selected
                                        ? "var(--color-hex-f2f2f2)"
                                        : "var(--color-hex-666666)",
                                }}
                            >
                                {opt.value}
                            </span>
                        </div>

                        {/* Protocol */}
                        <div
                            className="mb-[12px] text-[9px] font-semibold tracking-[0.16em]"
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
                        <div className="mb-[14px] grow text-[9.5px] leading-[1.65] tracking-[0.05em] text-[var(--color-hex-555555)]">
                            {opt.description}
                        </div>

                        {/* Vuln class tags */}
                        <div className="mb-4 flex flex-wrap gap-1">
                            {opt.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-[2px] px-[5px] py-[1px] text-[8.5px] tracking-[0.1em] whitespace-nowrap"
                                    style={{
                                        color: selected
                                            ? "var(--color-hex-e31b23)"
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
                            <div className="mb-[6px] text-[8px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                SPECIALISTS
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {opt.specialists.map((s) => (
                                    <span
                                        key={s}
                                        className="text-[8px] tracking-[0.12em]"
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
