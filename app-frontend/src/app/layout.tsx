import React from "react";
import { type Metadata, type Viewport } from "next";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { ServicesProvider } from "@/lib/services-context";

import "@/app/globals.css";

import { Geist, JetBrains_Mono } from "next/font/google";

import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const jbMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
    title: {
        default: "RedGrid - Agentic Red Team",
        template: "%s | RedGrid",
    },
    description: "A secure research environment to run autonomous VAPT on hosted benchmarks.",
    metadataBase: new URL("https://redgrid.kaiofficial.xyz"),
    openGraph: {
        title: "RedGrid - Agentic Red Team",
        description: "A secure research environment to run autonomous VAPT on hosted benchmarks.",
        siteName: "RedGrid",
        url: "https://redgrid.kaiofficial.xyz",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "RedGrid - Agentic Red Team",
        description: "A secure research environment to run autonomous VAPT on hosted benchmarks.",
    },
    robots: {
        index: true,
        follow: true,
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
        <html lang="en" className={cn("dark", "font-sans", geist.variable, jbMono.variable)}>
            {/*
             * suppressHydrationWarning is required here because Next.js server-renders
             * the <body> without the class that the browser may inject for OS-level
             * dark-mode detection, causing a harmless mismatch on first hydration.
             */}
            <body suppressHydrationWarning>
                <div className="bg-background mx-auto min-h-dvh w-full">
                    <ServicesProvider>
                        <AuthProvider>
                            <TooltipProvider>{children}</TooltipProvider>
                        </AuthProvider>
                    </ServicesProvider>
                </div>
            </body>
        </html>
    );
}
