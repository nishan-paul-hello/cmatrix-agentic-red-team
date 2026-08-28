export default function Meta({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <span className="tracking-wider-3 text-sm text-[var(--color-hex-444444)]">{label}</span>
            <span className="text-base tracking-normal text-[var(--color-hex-a0a0a0)]">
                {value}
            </span>
        </div>
    );
}
