export default function AttackPath({ nodes, large }: { nodes: string[]; large?: boolean }) {
    return (
        <div className="flex flex-col items-start">
            {nodes.map((n, i) => (
                <div key={n} className="flex flex-col items-start">
                    {i > 0 && <div className="bg-primary/50 ml-3 h-4 w-px" />}
                    <div
                        className={`border-border bg-muted flex items-center gap-2 rounded-sm border-[1px] border-solid ${large ? "px-4 py-2.5" : "px-3 py-[7px]"}`}
                    >
                        <div className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full" />
                        <span
                            className={`text-muted-foreground font-semibold tracking-tight ${large ? "text-[11px]" : "text-[10px]"}`}
                        >
                            {n}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
