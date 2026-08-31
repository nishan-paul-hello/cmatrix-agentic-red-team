"use client";

import { TerminalCTA } from "@/components/ui/TerminalCTA";
import { LoginDialog } from "@/features/auth/components/LoginDialog";

interface TerminalLoginCTAProps {
    className?: string;
}

export function TerminalLoginCTA({ className }: TerminalLoginCTAProps) {
    return (
        <LoginDialog>
            <TerminalCTA className={className} />
        </LoginDialog>
    );
}
