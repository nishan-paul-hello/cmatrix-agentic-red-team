"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

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
        <div className="border-destructive/30 text-destructive flex h-full w-full flex-col items-center justify-center rounded-lg border bg-neutral-950 p-8 text-center">
            <h2 className="text-destructive mb-4 font-mono text-xs">Error in Module</h2>
            <p className="text-destructive/70 mb-6 text-sm">
                {error.message || "An unexpected error occurred."}
            </p>
            <Button
                variant="destructive"
                onClick={() => reset()}
                className="rounded font-mono text-sm transition-colors"
            >
                Retry
            </Button>
        </div>
    );
}
