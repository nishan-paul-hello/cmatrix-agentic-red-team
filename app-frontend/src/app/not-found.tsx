import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "404 — Page Not Found",
};

/**
 * Displayed by Next.js whenever a route cannot be matched.
 * Styled to match the app's dark monospace theme.
 */
export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-fg)]">
            {/* Decorative grid background */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(41,41,41,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(41,41,41,0.18) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
                aria-hidden="true"
            />

            <div className="relative flex flex-col items-center gap-6 px-6 text-center">
                {/* Error code */}
                <div
                    className="text-huge leading-none font-bold tracking-tight"
                    style={{ color: "var(--color-brand)" }}
                >
                    404
                </div>

                {/* Divider */}
                <div
                    className="h-[1px] w-[200px]"
                    style={{
                        background:
                            "linear-gradient(90deg, var(--color-brand) 0%, var(--color-hex-9e1118) 60%, transparent 100%)",
                    }}
                />

                <div className="flex flex-col gap-1">
                    <p className="text-3xl font-semibold tracking-widest text-[var(--color-hex-a0a0a0)]">
                        PAGE NOT FOUND
                    </p>
                    <p className="text-lg tracking-wide text-[var(--color-hex-444444)]">
                        The route you requested does not exist in this system.
                    </p>
                </div>

                <Link
                    href="/dashboard"
                    className="tracking-wider-3 mt-2 rounded-[2px] border border-[var(--color-hex-6f171b)] px-[16px] py-[6px] text-lg font-semibold text-[var(--color-brand)] transition-colors duration-150 hover:border-[var(--color-brand)] hover:bg-[var(--color-hex-1a0608)]"
                >
                    ← RETURN TO DASHBOARD
                </Link>
            </div>
        </div>
    );
}
