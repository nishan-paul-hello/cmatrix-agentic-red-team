export default function MetaRow({
    label,
    value,
    highlight,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div>
            <div className="tracking-wider-3 mb-[1px] text-sm text-[var(--color-hex-444444)]">
                {label}
            </div>
            <div
                className="tracking-tight-1 text-lg"
                style={{
                    color: highlight ? "var(--color-brand)" : "var(--color-hex-666666)",
                    wordBreak: "break-all",
                }}
            >
                {value}
            </div>
        </div>
    );
}
