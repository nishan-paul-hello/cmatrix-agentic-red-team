export default function StepHeading({ step, label }: { step: number; label: string }) {
    return (
        <div className="mb-7 flex items-center gap-3">
            <div className="bg-primary h-5 w-0.5" />
            <span className="text-foreground text-xs font-semibold tracking-widest uppercase">
                STEP {step} — {label}
            </span>
        </div>
    );
}
