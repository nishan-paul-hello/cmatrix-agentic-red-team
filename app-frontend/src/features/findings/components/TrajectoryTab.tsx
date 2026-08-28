import { type Finding } from "@/types/domain-types";

export default function TrajectoryTab({ f }: { f: Finding }) {
    return (
        <div>
            <div className="text-muted-foreground mb-4 text-sm tracking-widest">
                ATTACK TRAJECTORY FOR {f.id}
            </div>
            {f.path.map((node, i) => (
                <div key={node} className="mb-0 flex gap-3">
                    <div className="flex w-6 shrink-0 flex-col items-center">
                        <div className="bg-primary mt-0.5 h-2 w-2 shrink-0 rounded-none" />
                        {i < f.path.length - 1 && (
                            <div
                                className="bg-muted min-h-5 w-px flex-1"
                                style={{
                                    margin: "4px 0",
                                }}
                            />
                        )}
                    </div>
                    <div
                        style={{
                            paddingBottom: i < f.path.length - 1 ? 12 : 0,
                        }}
                    >
                        <div className="text-muted-foreground mb-0.5 text-xs font-bold tracking-tight">
                            {node}
                        </div>
                        <div className="text-muted-foreground text-sm">
                            {(() => {
                                if (i === 0) {
                                    return "Initial discovery via enumeration";
                                }
                                if (i === f.path.length - 1) {
                                    return "Terminal — finding confirmed";
                                }
                                return "Prerequisite satisfied — enabled downstream nodes";
                            })()}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
