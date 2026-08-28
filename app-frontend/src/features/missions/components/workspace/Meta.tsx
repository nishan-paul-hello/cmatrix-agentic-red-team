export default function Meta({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-sm tracking-widest">{label}</span>
            <span className="text-muted-foreground text-base tracking-normal">{value}</span>
        </div>
    );
}
