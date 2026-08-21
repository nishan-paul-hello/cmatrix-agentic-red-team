"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

/**
 * Redirects the user to `/login` when they are not authenticated.
 *
 * Returns `true` once the auth state is confirmed as authenticated (safe to
 * render children). Returns `false` while unauthenticated or during the
 * initial render before the redirect fires.
 *
 * Usage:
 * ```tsx
 * function ProtectedLayout({ children }: { children: React.ReactNode }) {
 *   const isReady = useAuthGuard();
 *   if (!isReady) return null;
 *   return <>{children}</>;
 * }
 * ```
 */
export function useAuthGuard(): boolean {
    const router = useRouter();
    const { authenticated } = useAuth();

    useEffect(() => {
        if (!authenticated) {
            router.replace("/login");
        }
    }, [authenticated, router]);

    return authenticated;
}
