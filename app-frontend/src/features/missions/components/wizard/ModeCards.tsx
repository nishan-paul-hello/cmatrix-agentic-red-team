import { type ModeType } from "@/features/missions/data/fixtures/wizardMockData";
import { useWizardData } from "@/features/missions/hooks/useWizardData";

export default function ModeCards({
    value,
    onChange,
}: {
    value: ModeType;
    onChange: (v: ModeType) => void;
}) {
    const { modeOptions } = useWizardData();

    return (
        <div
            className="flex gap-5"
            style={{
                alignItems: "stretch",
            }}
        >
            {modeOptions.map((opt) => {
                const selected = value === opt.value;
                return (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`font-inherit relative flex flex-1 cursor-pointer flex-col rounded-[2px] border border-solid text-left transition-colors duration-100 ${selected ? "border-[var(--color-brand)] bg-[var(--color-hex-120608)]" : "border-[var(--color-hex-292929)] bg-[var(--color-hex-0d0d0d)] hover:border-[var(--color-hex-444444)] hover:bg-[var(--color-hex-111111)]"}`}
                        style={{
                            padding: "22px 20px 18px",
                        }}
                    >
                        {/* Top row: icon + title + selected dot */}
                        <div className="mb-1 flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                                <span
                                    className="text-8xl leading-none"
                                    style={{
                                        color: selected
                                            ? "var(--color-brand)"
                                            : "var(--color-hex-444444)",
                                    }}
                                >
                                    {opt.icon}
                                </span>
                                <span
                                    className="tracking-wider-1 text-6xl font-bold"
                                    style={{
                                        color: selected
                                            ? "var(--color-fg)"
                                            : "var(--color-hex-555555)",
                                    }}
                                >
                                    {opt.value}
                                </span>
                            </div>
                            {selected && (
                                <div
                                    className="mt-[4px] h-[8px] w-[8px] shrink-0 bg-[var(--color-brand)]"
                                    style={{
                                        borderRadius: "50%",
                                    }}
                                />
                            )}
                        </div>

                        {/* Hint + badges row */}
                        <div className="mb-5 flex items-center gap-2">
                            <span
                                className="text-base font-semibold tracking-widest"
                                style={{
                                    color: selected
                                        ? "var(--color-hex-9e1118)"
                                        : "var(--color-hex-333333)",
                                }}
                            >
                                {opt.hint}
                            </span>
                            <span
                                className="text-base-tight tracking-wider-2 rounded-[2px] px-[6px] py-[1px] font-semibold"
                                style={{
                                    color: opt.badgeColor,
                                    background: `${opt.badgeColor}18`,
                                    border: `1px solid ${opt.badgeColor}44`,
                                }}
                            >
                                {opt.badge}
                            </span>
                            <span className="text-base-tight tracking-wider-1 rounded-[2px] border-[1px] border-solid border-[var(--color-hex-222222)] bg-[var(--color-hex-151515)] px-[6px] py-[1px] text-[var(--color-hex-555555)]">
                                {opt.difficulty}
                            </span>
                        </div>

                        {/* Divider */}
                        <div
                            className="mb-[16px] h-[1px]"
                            style={{
                                background: selected
                                    ? "var(--color-hex-2a0a0c)"
                                    : "var(--color-hex-1a1a1a)",
                            }}
                        />

                        {/* Description */}
                        <div className="mb-[20px] grow text-lg leading-relaxed tracking-tighter text-[var(--color-hex-555555)]">
                            {opt.description}
                        </div>

                        {/* Divider */}
                        <div
                            className="mb-[14px] h-[1px]"
                            style={{
                                background: selected
                                    ? "var(--color-hex-2a0a0c)"
                                    : "var(--color-hex-1a1a1a)",
                            }}
                        />

                        {/* Implications list */}
                        <div className="flex flex-col gap-2">
                            {opt.implications.map((imp: { label: string; detail: string }) => (
                                <div key={imp.label} className="flex items-start gap-2">
                                    <span
                                        className="text-base-tight tracking-wider-2 min-w-[96px] shrink-0 font-semibold"
                                        style={{
                                            color: selected
                                                ? "var(--color-brand)"
                                                : "var(--color-hex-333333)",
                                        }}
                                    >
                                        {imp.label}
                                    </span>
                                    <span className="text-base-tight tracking-tight-1 leading-snug text-[var(--color-hex-444444)]">
                                        {imp.detail}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
