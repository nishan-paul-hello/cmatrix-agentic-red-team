"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-screen flex-col items-center justify-center bg-[var(--color-hex-080808)]">
            <h1 className="mb-4 text-[24px] font-bold text-[var(--color-hex-e31b23)]">
                SYSTEM FAILURE
            </h1>
            <p className="mb-6 text-[12px] text-[var(--color-hex-a0a0a0)]">{error.message}</p>
            <button
                onClick={reset}
                className="cursor-pointer border-[1px] border-[var(--color-hex-e31b23)] bg-[transparent] px-6 py-2 text-[10px] tracking-[0.2em] text-[var(--color-hex-e31b23)] hover:bg-[var(--color-hex-1a0608)]"
            >
                REBOOT SUBSYSTEM
            </button>
        </div>
    );
}
