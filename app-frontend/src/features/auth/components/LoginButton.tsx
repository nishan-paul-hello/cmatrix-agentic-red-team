"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/features/auth/components/LoginDialog";

interface LoginButtonProps {
    text: string;
    className?: string;
    showArrow?: boolean;
    icon?: React.ReactNode;
}

export function LoginButton({ text, className, showArrow, icon }: LoginButtonProps) {
    return (
        <LoginDialog>
            <Button className={className}>
                {icon && <span className="mr-2">{icon}</span>}
                {text}
                {showArrow && (
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
            </Button>
        </LoginDialog>
    );
}
