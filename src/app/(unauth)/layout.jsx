"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { getLoggedInUser } from "@/utils/utils";
import PreloaderPage from "@/components/preloader/preloader";

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

  return (
    <Suspense fallback={<PreloaderPage/>}>
      {children}
    </Suspense>
  );
}
