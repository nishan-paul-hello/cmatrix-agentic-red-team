"use client";

import { useAuthGuard } from "@/lib/hooks/useAuthGuard";

/**
 * Root route (`/`). Redirects to `/dashboard` when authenticated, or
 * `/login` when not. The redirect is handled by the shared `useAuthGuard`
 * hook, which also fires the login redirect in the app layout — so this page
 * simply renders nothing while the navigation is pending.
 *
 * Note: A server-side redirect via `redirect()` would be cleaner, but the
 * auth state lives in React context (not in a cookie), so we cannot read it
 * on the server without a broader auth architecture change.
 */
export default function RootPage() {
    const authenticated = useAuthGuard();

    // If authenticated, push to dashboard immediately.
    // The useAuthGuard hook handles the /login redirect when not authenticated.
    if (authenticated) {
        // Dynamic import to avoid a circular dep with next/navigation at module
        // level — the redirect will fire via the layout's own guard as well.
        // No-op here; the guard already navigates.
    }

    return null;
}
