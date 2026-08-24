export default function TextInput({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            className="font-inherit w-full rounded-[2px] border-[1px] border-solid border-[var(--color-hex-333333)] bg-[var(--color-hex-111111)] px-[14px] py-[10px] text-[12px] tracking-[0.04em] text-[var(--color-hex-f2f2f2)] outline-none focus:border-[var(--color-hex-e31b23)]"
        />
    );
}
