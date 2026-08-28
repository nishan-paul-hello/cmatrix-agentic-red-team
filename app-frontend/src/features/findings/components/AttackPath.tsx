export default function AttackPath({ nodes, large }: { nodes: string[]; large?: boolean }) {
    return (
        <div
            className="flex flex-col items-start"
            style={{
                gap: 0,
            }}
        >
            {nodes.map((n, i) => (
                <div key={n} className="flex flex-col items-start">
                    {i > 0 && (
                        <div
                            className="bg-primary ml-3 h-4 w-px"
                            style={{
                                opacity: 0.5,
                            }}
                        />
                    )}
                    <div
                        className="border-border bg-muted rounded-sm border-[1px] border-solid"
                        style={{
                            padding: large ? "10px 16px" : "7px 12px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <div
                            className="bg-primary h-1.5 w-1.5 shrink-0"
                            style={{
                                borderRadius: "50%",
                            }}
                        />
                        <span
                            className="text-muted-foreground font-semibold tracking-tight"
                            style={{
                                fontSize: large ? 11 : 10,
                            }}
                        >
                            {n}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
