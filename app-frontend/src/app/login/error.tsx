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
        <div className="flex h-screen flex-col items-center justify-center bg-[var(--color-bg)]">
            <h1 className="text-11xl mb-4 font-bold text-[var(--color-brand)]">SYSTEM FAILURE</h1>
            <p className="mb-6 text-2xl text-[var(--color-hex-a0a0a0)]">{error.message}</p>
            <button
                onClick={reset}
                className="cursor-pointer border-[1px] border-[var(--color-brand)] bg-[transparent] px-6 py-2 text-lg tracking-widest text-[var(--color-brand)] hover:bg-[var(--color-hex-1a0608)]"
            >
                REBOOT SUBSYSTEM
            </button>
        </div>
    );
}
