"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { getLoggedInUser } from "@/utils/utils";

export default function UnauthLayout({ children }) {
  const user = getLoggedInUser()
  // const { user } = useAuth();
  const router = useRouter();
console.log("user", user);
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return <>{children}</>;
}
