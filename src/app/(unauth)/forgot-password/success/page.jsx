"use client";

import React from "react";
import { Result, Button } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

export default function ForgotPasswordSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // we’ll pass email as query param

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
        padding: 24,
      }}
    >
      <Result
        status="success"
        title="Password Reset Link Sent!"
        subTitle={`We’ve sent a password reset link to ${
          email || "your email"
        }. Please check your inbox (and spam folder).`}
        extra={[
          <Button
            type="primary"
            key="login"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </Button>,
        ]}
      />
    </div>
  );
}
