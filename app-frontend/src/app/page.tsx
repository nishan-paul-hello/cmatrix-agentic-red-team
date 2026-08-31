import { cookies } from "next/headers";
import Image from "next/image";
import { User } from "lucide-react";

import ArchitectureAnimation from "@/components/ArchitectureAnimation";
import { LandingProfileMenu } from "@/components/LandingProfileMenu";
import GeometricMark from "@/components/ui/GeometricMark";
import { TerminalCTA } from "@/components/ui/TerminalCTA";
import { LoginButton } from "@/features/auth/components/LoginButton";
import { TerminalLoginCTA } from "@/features/auth/components/TerminalLoginCTA";

export default async function LandingPage() {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get("auth")?.value === "1";
    return (
        <div className="bg-background text-foreground flex min-h-screen flex-col">
            {/* Header / Navbar */}
            <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
                    <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
                        <GeometricMark className="h-6 w-6" />
                        <span>RedGrid</span>
                    </div>
                    <nav>
                        {isAuthenticated ? (
                            <LandingProfileMenu />
                        ) : (
                            <LoginButton
                                text="Log in"
                                icon={<User className="h-3.5 w-3.5" />}
                                className="group h-8 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-black transition-all duration-300 hover:scale-105 hover:bg-white/90 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                            />
                        )}
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden p-6 text-center lg:p-12">
                <div className="z-10 max-w-3xl space-y-8">
                    <div className="group bg-background relative inline-flex items-center justify-center px-6 py-2.5">
                        <div className="border-foreground/10 absolute inset-0 border" />
                        <div className="border-foreground/80 group-hover:border-foreground absolute top-[-1px] left-[-1px] h-2.5 w-2.5 border-t-2 border-l-2 transition-colors" />
                        <div className="border-foreground/80 group-hover:border-foreground absolute right-[-1px] bottom-[-1px] h-2.5 w-2.5 border-r-2 border-b-2 transition-colors" />

                        <div className="text-foreground relative flex items-center gap-2 font-mono text-sm font-medium tracking-tight">
                            <span>LLM-orchestrated multi-agent framework for autonomous VAPT</span>
                        </div>
                    </div>

                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
                        Agentic <span className="text-primary">Red Team</span>
                    </h1>

                    <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
                        A secure research environment to run autonomous VAPT on hosted benchmarks.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
                        {isAuthenticated ? (
                            <TerminalCTA
                                href="/dashboard"
                                className="h-14 w-full px-8 text-base sm:w-auto sm:min-w-[200px]"
                            />
                        ) : (
                            <TerminalLoginCTA className="h-14 w-full px-8 text-base sm:w-auto sm:min-w-[200px]" />
                        )}
                    </div>
                </div>

                {/* Workflow Animation */}
                <ArchitectureAnimation />
            </main>

            {/* Footer */}
            <footer className="border-border text-muted-foreground bg-background border-t py-8 text-center text-sm">
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <span className="leading-none">Built by</span>
                        <a
                            href="https://kaiofficial.xyz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
                        >
                            <div className="relative h-6 w-6 translate-y-0.5">
                                <Image
                                    src="/logo-company.svg"
                                    alt="KAI Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="leading-none font-medium text-[#00F07C]">KAI</span>
                        </a>
                    </div>
                    <p>&copy; {new Date().getFullYear()} RedGrid, all rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
