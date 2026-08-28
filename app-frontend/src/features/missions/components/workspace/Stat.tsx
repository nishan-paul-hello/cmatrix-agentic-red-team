export default function Stat({
    label,
    value,
    color,
}: {
    label: string;
    value: string;
    color: string;
}) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-sm-tight tracking-wider-2 text-[var(--color-hex-444444)]">
                {label}
            </span>
            <span
                className="tracking-tight-1 text-lg font-bold"
                style={{
                    color,
                }}
            >
                {value}
            </span>
        </div>
    );
}
