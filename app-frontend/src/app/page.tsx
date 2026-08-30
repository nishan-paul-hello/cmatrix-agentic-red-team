import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowRight, Shield, Zap } from "lucide-react";

import { LandingProfileMenu } from "@/components/LandingProfileMenu";
import GeometricMark from "@/components/ui/GeometricMark";
import { LoginButton } from "@/features/auth/components/LoginButton";

export default async function LandingPage() {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get("auth")?.value === "1";
    return (
        <div className="bg-background text-foreground flex min-h-screen flex-col">
            {/* Header / Navbar */}
            <header className="border-border bg-background/80 sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6 backdrop-blur-sm lg:px-12">
                <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
                    <GeometricMark className="h-6 w-6" />
                    <span>RedGrid</span>
                </div>
                <nav>
                    {isAuthenticated ? (
                        <LandingProfileMenu />
                    ) : (
                        <LoginButton text="Login to Dashboard" className="h-9 px-4 py-2" />
                    )}
                </nav>
            </header>

            {/* Main Content */}
            <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden p-6 text-center lg:p-12">
                <div className="z-10 max-w-3xl space-y-8">
                    <div className="group relative inline-flex items-center justify-center bg-background px-6 py-2.5">
                        <div className="absolute inset-0 border border-foreground/10" />
                        <div className="absolute left-[-1px] top-[-1px] h-2.5 w-2.5 border-l-2 border-t-2 border-foreground/80 transition-colors group-hover:border-foreground" />
                        <div className="absolute bottom-[-1px] right-[-1px] h-2.5 w-2.5 border-b-2 border-r-2 border-foreground/80 transition-colors group-hover:border-foreground" />
                        
                        <div className="relative flex items-center gap-2 font-mono text-sm font-medium tracking-tight text-foreground">
                            <span className="mr-1 font-bold text-foreground/50 transition-colors group-hover:text-foreground/80">&#47;&#47;</span>
                            <span>LLM-orchestrated multi-agent framework for autonomous VAPT</span>
                            <span className="ml-1 inline-block h-4 w-1.5 bg-foreground/80 animate-pulse transition-colors group-hover:bg-foreground" />
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
                            <Link
                                href="/dashboard"
                                className="focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 group inline-flex h-12 w-full items-center justify-center gap-2 rounded-md px-8 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none sm:w-auto"
                            >
                                Go to Dashboard
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        ) : (
                            <LoginButton
                                text="Get Started"
                                showArrow
                                className="group h-12 w-full gap-2 px-8 text-base sm:w-auto"
                            />
                        )}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="z-10 mt-24 grid w-full max-w-5xl grid-cols-1 gap-6 text-left md:grid-cols-3">
                    <div className="border-border bg-card/30 hover:bg-card/80 group rounded-xl border p-6 backdrop-blur-sm transition-colors">
                        <div className="bg-primary/10 text-primary group-hover:bg-primary/20 mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
                            <Activity className="h-5 w-5" />
                        </div>
                        <h3 className="text-foreground mb-2 text-lg font-semibold">
                            Real-time Monitoring
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Live dashboard tracking agent operations and security posture across
                            your entire infrastructure.
                        </p>
                    </div>
                    <div className="border-border bg-card/30 hover:bg-card/80 group rounded-xl border p-6 backdrop-blur-sm transition-colors">
                        <div className="bg-primary/10 text-primary group-hover:bg-primary/20 mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
                            <Zap className="h-5 w-5" />
                        </div>
                        <h3 className="text-foreground mb-2 text-lg font-semibold">
                            Autonomous Execution
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Deploy self-directed agents that adapt to your environment and chain
                            vulnerabilities intelligently.
                        </p>
                    </div>
                    <div className="border-border bg-card/30 hover:bg-card/80 group rounded-xl border p-6 backdrop-blur-sm transition-colors">
                        <div className="bg-primary/10 text-primary group-hover:bg-primary/20 mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
                            <Shield className="h-5 w-5" />
                        </div>
                        <h3 className="text-foreground mb-2 text-lg font-semibold">
                            Comprehensive Coverage
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Continuous scanning mapped against MITRE ATT&CK framework for full
                            spectrum visibility.
                        </p>
                    </div>
                </div>
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
