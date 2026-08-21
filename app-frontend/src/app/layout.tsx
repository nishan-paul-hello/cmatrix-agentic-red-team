import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CMatrix — Autonomous VAPT",
    template: "%s | CMatrix",
  },
  description:
    "CMatrix is an autonomous vulnerability assessment and penetration testing platform powered by multi-agent AI.",
  metadataBase: new URL("https://cmatrix.internal"),
  openGraph: {
    title: "CMatrix — Autonomous VAPT",
    description:
      "Autonomous vulnerability assessment and penetration testing.",
    siteName: "CMatrix",
    type: "website",
  },
  robots: {
    // Internal tool — no indexing needed.
    index: false,
    follow: false,
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
