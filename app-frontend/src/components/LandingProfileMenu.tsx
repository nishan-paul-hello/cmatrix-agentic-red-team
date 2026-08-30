"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Power } from "lucide-react";

import { Button } from "@/components/ui/button";

export function LandingProfileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="hover:bg-accent hover:text-accent-foreground border-border bg-card/50 flex cursor-pointer items-center gap-2 rounded-full border p-1 pr-3 text-sm transition-colors"
            >
                <div className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    NP
                </div>
                <span className="text-sm font-medium">Nishan Paul</span>
            </button>

            {isOpen && (
                <div className="border-border bg-popover absolute top-full right-0 z-50 mt-2 flex w-max min-w-52 flex-col rounded-md border shadow-md">
                    <div className="flex flex-col px-3 py-3 text-left">
                        <span className="text-foreground text-sm leading-none font-medium">
                            Nishan Paul
                        </span>
                        <span className="text-muted-foreground mt-1.5 text-xs">
                            nishan.paul@example.com
                        </span>
                    </div>
                    <div className="bg-border h-px w-full" />
                    <div className="flex flex-col p-1">
                        <Button
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-auto w-full justify-start gap-2 rounded-sm px-2 py-1.5 text-sm font-normal"
                            onClick={() => {
                                setIsOpen(false);
                                document.cookie = "auth=; max-age=0; path=/";
                                router.push("/");
                                router.refresh();
                            }}
                        >
                            <Power className="size-4" />
                            Log out
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
