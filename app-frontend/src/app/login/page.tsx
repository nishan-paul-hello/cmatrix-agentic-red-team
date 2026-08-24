"use client";

import { useRouter } from "next/navigation";

import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import Login from "@/features/auth/components/Login";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    return (
        <PanelErrorBoundary>
            <Login
                onLogin={() => {
                    login();
                    router.push("/dashboard");
                }}
            />
        </PanelErrorBoundary>
    );
}
