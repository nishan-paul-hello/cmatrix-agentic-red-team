export default function RadioGroup<T extends string>({
    value,
    onChange,
    options,
}: {
    value: T;
    onChange: (v: T) => void;
    options: {
        value: T;
        desc: string;
    }[];
}) {
    return (
        <div className="flex flex-col overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)]">
            {options.map((opt, i) => {
                const selected = value === opt.value;
                return (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`font-inherit flex w-full cursor-pointer items-start gap-4 border-l-[3px] px-[16px] py-[12px] text-left ${selected ? "border-l-[var(--color-hex-e31b23)] bg-[var(--color-hex-120608)]" : "border-l-transparent bg-[var(--color-hex-0d0d0d)] hover:bg-[var(--color-hex-111111)]"}`}
                        style={{
                            borderTop: i > 0 ? "1px solid var(--color-hex-1e1e1e)" : "none",
                        }}
                    >
                        <div
                            className="mt-[1px] h-[14px] w-[14px] shrink-0"
                            style={{
                                borderRadius: "50%",
                                border: `1px solid ${selected ? "var(--color-hex-e31b23)" : "var(--color-hex-333333)"}`,
                                background: selected ? "var(--color-hex-e31b23)" : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {selected && (
                                <div
                                    className="h-[5px] w-[5px] bg-[var(--color-hex-f2f2f2)]"
                                    style={{
                                        borderRadius: "50%",
                                    }}
                                />
                            )}
                        </div>
                        <div>
                            <div
                                className="mb-[3px] text-[11px] font-semibold tracking-[0.14em]"
                                style={{
                                    color: selected
                                        ? "var(--color-hex-f2f2f2)"
                                        : "var(--color-hex-666666)",
                                }}
                            >
                                {opt.value}
                            </div>
                            <div className="text-[9.5px] leading-[1.5] tracking-[0.06em] text-[var(--color-hex-444444)]">
                                {opt.desc}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
