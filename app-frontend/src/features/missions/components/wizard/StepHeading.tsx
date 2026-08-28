export default function StepHeading({ step, label }: { step: number; label: string }) {
    return (
        <div className="mb-7 flex items-center gap-3">
            <div className="h-[20px] w-[2px] bg-[var(--color-brand)]" />
            <span className="tracking-wider-2 text-3xl font-semibold text-[var(--color-fg)]">
                STEP {step} — {label}
            </span>
        </div>
    );
}
