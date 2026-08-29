export default function MetaRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="text-muted-foreground mb-px text-sm tracking-widest">{label}</div>
            <div className="text-primary min-w-0 flex-1 text-sm font-medium break-all">{value}</div>
        </div>
    );
}
