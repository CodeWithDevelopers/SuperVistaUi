"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { Spin } from "antd";
import PreloaderPage from "@/components/preloader/preloader";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [user, router]);

   return (
     <div
       style={{
         height: "100vh",
         display: "flex",
         justifyContent: "center",
         alignItems: "center",
       }}
     >
       <PreloaderPage />
     </div>
   );
}
