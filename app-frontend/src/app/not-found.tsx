import { type Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "404 — Page Not Found",
};

/**
 * Displayed by Next.js whenever a route cannot be matched.
 * Styled to match the app's dark monospace theme.
 */
export default function NotFound() {
    return (
        <div className="bg-background flex min-h-dvh flex-col items-center justify-center p-6">
            {/* Decorative grid background */}
            <div
                className="grid-bg-lg pointer-events-none absolute inset-0 opacity-20"
                aria-hidden="true"
            />

            <div className="relative flex flex-col items-center gap-6 px-6 text-center">
                {/* Error code */}
                <div className="text-primary text-base leading-none font-bold tracking-tight">
                    404
                </div>

                {/* Divider */}
                <div
                    className="h-px w-[200px]"
                    style={{
                        background:
                            "linear-gradient(90deg, var(--primary) 0%, var(--border) 60%, transparent 100%)",
                    }}
                />

                <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm font-semibold tracking-widest">
                        PAGE NOT FOUND
                    </p>
                    <p className="text-muted-foreground text-xs tracking-wide">
                        The route you requested does not exist in this system.
                    </p>
                </div>

                <Link
                    href="/dashboard"
                    className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "text-primary border-border hover:border-primary hover:bg-muted mt-2 text-xs font-semibold tracking-widest",
                    )}
                >
                    ← RETURN TO DASHBOARD
                </Link>
            </div>
        </div>
    );
}
