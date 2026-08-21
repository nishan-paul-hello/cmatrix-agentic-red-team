"use client";

import { useRouter } from "next/navigation";
import Login from "@/components/Login";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  return (
    <Login
      onLogin={() => {
        login();
        router.push("/dashboard");
      }}
    />
  );
}
