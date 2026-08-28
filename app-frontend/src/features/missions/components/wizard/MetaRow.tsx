export default function MetaRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="text-muted-foreground mb-px text-sm tracking-widest">{label}</div>
            <div
                className="text-primary flex-1 text-sm font-medium break-all"
                style={{
                    minWidth: 0,
                }}
            >
                {value}
            </div>
        </div>
    );
}
