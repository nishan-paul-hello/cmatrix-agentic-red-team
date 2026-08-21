import { type Metadata, type Viewport } from "next";

import { AuthProvider } from "@/lib/auth-context";

import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "CMATRIX - Agentic Red Team",
        template: "%s | CMATRIX",
    },
    description:
        "CMATRIX is an LLM-orchestrated multi-agent framework designed for autonomous vulnerability assessment and penetration testing.",
    metadataBase: new URL("https://cmatrix.internal"),
    openGraph: {
        title: "CMATRIX - Agentic Red Team",
        description: "Autonomous vulnerability assessment and penetration testing.",
        siteName: "CMATRIX",
        type: "website",
    },
    robots: {
        // Internal tool — no indexing needed.
        index: false,
        follow: false,
    },
    icons: {
        icon: "/logo-brand.svg",
        shortcut: "/logo-brand.svg",
        apple: "/logo-brand.svg",
    },
};

/**
 * `themeColor` and `colorScheme` must be exported via `viewport` (not
 * `metadata`) as of Next.js 15. This avoids the build-time warnings.
 */
export const viewport: Viewport = {
    themeColor: "#080808",
    colorScheme: "dark",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            {/*
             * suppressHydrationWarning is required here because Next.js server-renders
             * the <body> without the class that the browser may inject for OS-level
             * dark-mode detection, causing a harmless mismatch on first hydration.
             */}
            <body suppressHydrationWarning>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
