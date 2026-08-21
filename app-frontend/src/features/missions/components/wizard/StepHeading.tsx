export default function StepHeading({ step, label }: { step: number; label: string }) {
    return (
        <div className="mb-7 flex items-center gap-3">
            <div className="h-[20px] w-[2px] bg-[var(--color-hex-e31b23)]" />
            <span className="text-[13px] font-semibold tracking-[0.16em] text-[var(--color-hex-f2f2f2)]">
                STEP {step} — {label}
            </span>
        </div>
    );
}
