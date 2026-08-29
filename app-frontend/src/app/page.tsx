import { redirect } from "next/navigation";

/**
 * Root route (`/`). Redirects to `/dashboard`.
 * Unauthenticated users are handled by the Next.js middleware,
 * so if execution reaches here, the user is authenticated.
 */
export default function RootPage() {
    redirect("/dashboard");
}
