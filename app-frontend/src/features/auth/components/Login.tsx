import React, { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import GeometricMark from "@/components/ui/GeometricMark";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginProps {
    onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    function onSubmit(_data: LoginFormValues) {
        setLoading(true);
        // TODO: replace with real auth API call
        setTimeout(() => {
            setLoading(false);
            onLogin();
        }, 1200);
    }

    return (
        <div className="bg-background flex min-h-dvh flex-col items-center justify-center">
            {/* Decorative grid background */}
            <div
                className="grid-bg-lg pointer-events-none absolute inset-0 opacity-20"
                aria-hidden="true"
            />

            <div className="relative flex w-full max-w-[360px] flex-col items-center sm:w-[360px]">
                {/* Brand header */}
                <div className="mb-8 flex items-center gap-3">
                    <GeometricMark className="h-7 w-7" />
                    <div className="flex flex-col">
                        <span className="text-foreground text-sm font-bold tracking-widest">
                            RedGrid
                        </span>
                    </div>
                </div>

                {/* Red gradient divider */}
                <div
                    className="from-primary mb-8 h-px w-full bg-gradient-to-r to-transparent"
                    aria-hidden="true"
                />

                {/* Form card */}
                <div className="border-border bg-card w-full rounded-md border px-8 pt-8 pb-7 shadow-sm">
                    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
                        {/* Username */}
                        <div className="mb-4">
                            <Label
                                htmlFor="username"
                                className="text-muted-foreground mb-1.5 block text-xs tracking-widest uppercase"
                            >
                                USERNAME
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                {...register("username")}
                                autoComplete="username"
                                spellCheck={false}
                                aria-required="true"
                                className="bg-background text-xs"
                            />
                            {errors.username && (
                                <p className="text-destructive mt-1 text-sm">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="mb-6">
                            <Label
                                htmlFor="password"
                                className="text-muted-foreground mb-1.5 block text-xs tracking-widest uppercase"
                            >
                                PASSWORD
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                                autoComplete="current-password"
                                aria-required="true"
                                className="bg-background text-xs"
                            />
                            {errors.password && (
                                <p className="text-destructive mt-1 text-sm">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full text-sm font-semibold tracking-widest uppercase"
                            size="lg"
                        >
                            {loading ? "AUTHENTICATING..." : "SIGN IN"}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="bg-border my-6 h-px" />

                    {/* Footer status */}
                    <div className="flex items-center justify-center gap-2">
                        <div
                            className="bg-success h-1.5 w-1.5 shrink-0 rounded-full"
                            aria-hidden="true"
                        />
                        <span className="text-muted-foreground text-xs tracking-widest uppercase">
                            SECURE RESEARCH ENVIRONMENT
                        </span>
                    </div>
                </div>

                {/* Version / copyright */}
                <div className="mt-5 flex w-full items-center justify-between">
                    <span className="text-muted-foreground text-xs">v1.1.1</span>
                    <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                        <a
                            href="https://kaiofficial.xyz/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-success inline-flex items-center gap-1 font-semibold transition-opacity hover:opacity-80"
                        >
                            <div className="relative inline-block h-3 w-3">
                                <Image
                                    src="/logo-company.svg"
                                    alt="KAI Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span>KAI</span>
                        </a>{" "}
                        © 2026
                    </span>
                </div>
            </div>
        </div>
    );
}
