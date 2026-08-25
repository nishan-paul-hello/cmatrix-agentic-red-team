import React, { useState } from "react";
import Image from "next/image";

import GeometricMark from "@/components/ui/GeometricMark";

interface LoginProps {
    onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        // TODO: replace with real auth API call
        setTimeout(() => {
            setLoading(false);
            onLogin();
        }, 1200);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-hex-080808)]">
            {/* Decorative grid background */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(41,41,41,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(41,41,41,0.18) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
                aria-hidden="true"
            />

            <div className="relative flex w-[360px] flex-col items-center">
                {/* Brand header */}
                <div className="mb-8 flex items-center gap-3">
                    <GeometricMark size={28} />
                    <div className="flex flex-col">
                        <span className="text-[22px] font-bold tracking-[0.22em] text-[var(--color-hex-f2f2f2)]">
                            RedGrid
                        </span>
                    </div>
                </div>

                {/* Red gradient divider */}
                <div
                    className="mb-8 h-[1px] w-full"
                    style={{
                        background:
                            "linear-gradient(90deg, var(--color-hex-e31b23) 0%, var(--color-hex-9e1118) 60%, transparent 100%)",
                    }}
                    aria-hidden="true"
                />

                {/* Form card */}
                <div className="w-full rounded-[2px] border border-[var(--color-hex-292929)] bg-[var(--color-hex-111111)] px-8 pt-8 pb-7">
                    <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                        {/* Username */}
                        <div className="mb-4">
                            <label
                                htmlFor="username"
                                className="mb-1.5 block text-[10px] tracking-[0.18em] text-[var(--color-hex-666666)]"
                            >
                                USERNAME
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                spellCheck={false}
                                aria-required="true"
                                className="w-full rounded-[2px] border border-[var(--color-hex-292929)] bg-[var(--color-hex-191919)] px-[12px] py-[9px] text-[12px] text-[var(--color-hex-f2f2f2)] transition-colors duration-100 outline-none focus:border-[var(--color-hex-e31b23)]"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-6">
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-[10px] tracking-[0.18em] text-[var(--color-hex-666666)]"
                            >
                                PASSWORD
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                aria-required="true"
                                className="w-full rounded-[2px] border border-[var(--color-hex-292929)] bg-[var(--color-hex-191919)] px-[12px] py-[9px] text-[12px] text-[var(--color-hex-f2f2f2)] transition-colors duration-100 outline-none focus:border-[var(--color-hex-e31b23)]"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            aria-busy={loading}
                            className={[
                                "w-full rounded-[2px] py-[11px] text-[11px] font-semibold tracking-[0.22em] text-[var(--color-hex-f2f2f2)]",
                                "transition-colors duration-100",
                                loading
                                    ? "cursor-not-allowed bg-[var(--color-hex-9e1118)]"
                                    : "cursor-pointer bg-[var(--color-hex-e31b23)] hover:bg-[var(--color-hex-ff2a32)]",
                            ].join(" ")}
                        >
                            {loading ? "AUTHENTICATING..." : "SIGN IN"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 h-[1px] bg-[var(--color-hex-1e1e1e)]" />

                    {/* Footer status */}
                    <div className="flex items-center justify-center gap-2">
                        <div
                            className="h-[5px] w-[5px] shrink-0 rounded-full bg-[var(--color-hex-3fb950)]"
                            aria-hidden="true"
                        />
                        <span className="text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                            SECURE RESEARCH ENVIRONMENT
                        </span>
                    </div>
                </div>

                {/* Version / copyright */}
                <div className="mt-5 flex w-full items-center justify-between">
                    <span className="text-[9px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                        v1.1.1
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                        <a
                            href="https://kaiofficial.xyz/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-[#00F07C] transition-opacity hover:opacity-80"
                        >
                            <Image
                                src="/logo-company.svg"
                                alt="KAI Logo"
                                width={16}
                                height={16}
                                className="inline-block"
                            />
                            <span>KAI</span>
                        </a>{" "}
                        © 2026
                    </span>
                </div>
            </div>
        </div>
    );
}
