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
        <div className="bg-background flex min-h-dvh flex-col items-center justify-center p-6 text-center">
            <h1 className="text-primary mb-4 text-xs font-bold">SYSTEM FAILURE</h1>
            <p className="text-muted-foreground mb-6 text-xs">{error.message}</p>
            <Button
                onClick={reset}
                variant="outline"
                className="text-primary border-primary hover:bg-muted text-xs tracking-widest uppercase"
            >
                REBOOT SUBSYSTEM
            </Button>
        </div>
    );
}
