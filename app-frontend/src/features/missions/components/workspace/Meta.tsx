export default function Meta({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col justify-center gap-0.5">
            <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                {label}
            </span>
            <span className="text-foreground text-sm font-medium tracking-tight">
                {value}
            </span>
        </div>
    );
}
