"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Crosshair } from "lucide-react";

import { cn } from "@/lib/utils";

interface TerminalCTAProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    originalText?: string;
    href?: string;
}

export const TerminalCTA = React.forwardRef<HTMLElement, TerminalCTAProps>(
    ({ className, originalText = "DEPLOY HACKING AGENT", href, onClick, ...props }, ref) => {
        const [text, setText] = useState(originalText);
        const [isHovering, setIsHovering] = useState(false);
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

        useEffect(() => {
            let interval: ReturnType<typeof setInterval> | undefined;
            if (isHovering) {
                let iteration = 0;
                interval = setInterval(() => {
                    setText(() =>
                        originalText
                            .split("")
                            .map((letter, index) => {
                                if (index < iteration) {
                                    return originalText[index];
                                }
                                return letters[Math.floor(Math.random() * letters.length)];
                            })
                            .join(""),
                    );
                    if (iteration >= originalText.length) {
                        clearInterval(interval);
                    }
                    iteration += 1 / 3;
                }, 30);
            }
            return () => clearInterval(interval);
        }, [isHovering, originalText]);

        const content = (
            <>
                <div className="border-foreground/10 absolute inset-0 border" />
                <div className="border-primary absolute top-[-1px] left-[-1px] h-3 w-3 border-t-2 border-l-2" />
                <div className="border-primary absolute right-[-1px] bottom-[-1px] h-3 w-3 border-r-2 border-b-2" />

                <span className="relative z-10 flex h-full w-full items-center justify-center text-left">
                    <div className="mr-3 transition-transform duration-500 group-hover:scale-110">
                        <Crosshair className="text-primary h-[1.25em] w-[1.25em] group-hover:animate-[spin_0.5s_linear_infinite]" />
                    </div>
                    <span className="text-primary font-extrabold tracking-[0.15em] transition-all">
                        {text}
                    </span>
                </span>
            </>
        );

        const commonProps = {
            onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
                setIsHovering(true);
                props.onMouseEnter?.(e as React.MouseEvent<HTMLButtonElement>);
            },
            onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
                setIsHovering(false);
                setText(originalText);
                props.onMouseLeave?.(e as React.MouseEvent<HTMLButtonElement>);
            },
            className: cn(
                "cursor-pointer relative group bg-foreground/10 font-mono text-sm inline-flex outline-none",
                className,
            ),
        };

        if (href) {
            return (
                <Link
                    href={href}
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    {...commonProps}
                    onClick={onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}
                >
                    {content}
                </Link>
            );
        }

        return (
            <button
                ref={ref as React.Ref<HTMLButtonElement>}
                type="button"
                {...commonProps}
                onClick={onClick}
            >
                {content}
            </button>
        );
    },
);
TerminalCTA.displayName = "TerminalCTA";
