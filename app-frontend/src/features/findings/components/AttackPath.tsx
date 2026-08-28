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
                            className="ml-[12px] h-[16px] w-[1px] bg-[var(--color-brand)]"
                            style={{
                                opacity: 0.5,
                            }}
                        />
                    )}
                    <div
                        className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-e31b2366)] bg-[var(--color-hex-120608)]"
                        style={{
                            padding: large ? "10px 16px" : "7px 12px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <div
                            className="h-[6px] w-[6px] shrink-0 bg-[var(--color-brand)]"
                            style={{
                                borderRadius: "50%",
                            }}
                        />
                        <span
                            className="font-semibold tracking-tight text-[var(--color-hex-a0a0a0)]"
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
