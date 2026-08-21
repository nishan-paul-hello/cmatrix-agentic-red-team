import type { Metadata } from "next";
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-hex-080808)] text-[var(--color-hex-f2f2f2)]">
      {/* Decorative grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(41,41,41,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(41,41,41,0.18) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center gap-6 text-center px-6">
        {/* Error code */}
        <div
          className="text-[72px] font-bold leading-none tracking-tight"
          style={{ color: "var(--color-hex-e31b23)" }}
        >
          404
        </div>

        {/* Divider */}
        <div
          className="w-[200px] h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, var(--color-hex-e31b23) 0%, var(--color-hex-9e1118) 60%, transparent 100%)",
          }}
        />

        <div className="flex flex-col gap-1">
          <p className="text-[13px] font-semibold tracking-[0.2em] text-[var(--color-hex-a0a0a0)]">
            PAGE NOT FOUND
          </p>
          <p className="text-[10px] tracking-[0.12em] text-[var(--color-hex-444444)]">
            The route you requested does not exist in this system.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="mt-2 text-[10px] font-semibold tracking-[0.18em] text-[var(--color-hex-e31b23)] border border-[var(--color-hex-6f171b)] rounded-[2px] py-[6px] px-[16px] hover:bg-[var(--color-hex-1a0608)] hover:border-[var(--color-hex-e31b23)] transition-colors duration-150"
        >
          ← RETURN TO DASHBOARD
        </Link>
      </div>
    </div>
  );
}
