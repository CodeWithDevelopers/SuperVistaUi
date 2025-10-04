"use client";

import { AuthProvider } from "../components/AuthProvider";
import { ConfigProvider } from "antd";
import SelfMessage from "@/components/message/SelfMessage";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider>
          <AuthProvider>
            {children}
            {/* Mount once so selfMessage works globally */}
            <SelfMessage />
          </AuthProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
