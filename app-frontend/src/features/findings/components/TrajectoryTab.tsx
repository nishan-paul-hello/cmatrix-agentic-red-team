import { type Finding } from "@/types/domain-types";

export default function TrajectoryTab({ f }: { f: Finding }) {
    return (
        <div>
            <div className="mb-[16px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                ATTACK TRAJECTORY FOR {f.id}
            </div>
            {f.path.map((node, i) => (
                <div key={node} className="mb-[0px] flex gap-3">
                    <div className="flex w-[24px] shrink-0 flex-col items-center">
                        <div className="mt-[3px] h-[8px] w-[8px] shrink-0 rounded-[1px] bg-[var(--color-hex-e31b23)]" />
                        {i < f.path.length - 1 && (
                            <div
                                className="min-h-[20px] w-[1px] flex-1 bg-[var(--color-hex-e31b2344)]"
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
                        <div className="mb-[2px] text-[10px] font-bold tracking-[0.08em] text-[var(--color-hex-a0a0a0)]">
                            {node}
                        </div>
                        <div className="text-[8.5px] text-[var(--color-hex-444444)]">
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
