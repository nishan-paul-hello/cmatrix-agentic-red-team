"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth-context";

interface LoginButtonProps {
    text: string;
    className?: string;
    showArrow?: boolean;
    icon?: React.ReactNode;
}

export function LoginButton({ text, className, showArrow, icon }: LoginButtonProps) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    function handleGoogleLogin() {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            login();
            setOpen(false);
            router.push("/dashboard");
        }, 1200);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button className={className} />}>
                {icon && <span className="mr-2">{icon}</span>}
                {text}
                {showArrow && (
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
            </DialogTrigger>
            <DialogContent className="bg-background border-none shadow-[0_0_60px_-15px_rgba(255,255,255,0.05)] sm:max-w-[500px]">
                <DialogHeader className="flex flex-col items-center justify-center pt-8 pb-1">
                    <DialogTitle className="text-foreground text-center text-3xl font-bold tracking-tight">
                        Sign in to RedGrid
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground/80 mx-auto mt-3 text-center font-sans text-[15px] leading-relaxed font-light tracking-wide">
                        Your private evaluation platform for autonomous
                        <br />
                        VAPT on hosted benchmarks.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6 px-8 pt-6 pb-8">
                    <Button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="h-12 w-full rounded-full border border-transparent bg-white text-sm font-medium tracking-wide text-black shadow-sm hover:bg-gray-100"
                    >
                        {loading ? (
                            "Authenticating..."
                        ) : (
                            <>
                                <svg
                                    className="mr-3 h-5 w-5"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
