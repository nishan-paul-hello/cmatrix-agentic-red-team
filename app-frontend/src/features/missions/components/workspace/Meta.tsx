export default function Meta({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <span className="text-[8px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                {label}
            </span>
            <span className="text-[9px] tracking-[0.1em] text-[var(--color-hex-a0a0a0)]">
                {value}
            </span>
        </div>
    );
}
