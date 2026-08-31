"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Crosshair } from "lucide-react";

interface TerminalCTAProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    originalText: string;
    href?: string;
}

export const TerminalCTA = React.forwardRef<HTMLElement, TerminalCTAProps>(
    ({ className, originalText, href, onClick, ...props }, ref) => {
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
                            .join("")
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
            <div className="relative w-full h-full flex items-center justify-center px-4 py-4">
                <span className="relative z-10 flex items-center text-left">
                    <Crosshair className="text-primary mr-3 w-5 h-5 transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110" />
                    <span className="tracking-[0.15em] font-semibold text-primary transition-all">{text}</span>
                </span>
            </div>
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
                "cursor-pointer relative group bg-transparent font-mono text-sm inline-flex outline-none",
                className
            )
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
    }
);
TerminalCTA.displayName = "TerminalCTA";
