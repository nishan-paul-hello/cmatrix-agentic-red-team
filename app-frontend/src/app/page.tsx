"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Page() {
  const router = useRouter();
  const { authenticated } = useAuth();

  useEffect(() => {
    router.replace(authenticated ? "/dashboard" : "/login");
  }, [authenticated, router]);

  return null;
}
