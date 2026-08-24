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
        <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-red-900/30 bg-neutral-950 p-8 text-center text-red-500">
            <h2 className="mb-4 font-mono text-xl text-red-400">Error in Module</h2>
            <p className="mb-6 text-sm text-red-400/70">
                {error.message || "An unexpected error occurred."}
            </p>
            <button
                onClick={() => reset()}
                className="rounded bg-red-950 px-4 py-2 font-mono text-sm text-red-300 transition-colors hover:bg-red-900"
            >
                Retry
            </button>
        </div>
    );
}
