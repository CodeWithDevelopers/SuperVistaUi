"use client";

import React, { useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { MailOutlined } from "@ant-design/icons";
import HTTPRequest from "@/services/request";
import { useRouter } from "next/navigation";
import { selfMessage } from "@/components/message/SelfMessage";

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { postAction } = HTTPRequest();
      const response = await postAction(
        null,
        { verificationMethod: "email", email: values.email },
        "/auth/password/forgot",
        true
      );

     if (response.success) {
       selfMessage.success("Reset link sent to your email!");
       router.push("/forgot-password/success?email=" + values.email);
     } else {
       selfMessage.error(response.message || "Failed to send OTP");
     }
    } catch (err) {
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Card style={{ width: 400, padding: 24, borderRadius: 12 }}>
        <Title level={3}>Forgot Password?</Title>
        <Text type="secondary">
          Enter your email and we’ll send you an OTP to reset your password.
        </Text>

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 16 }}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email"
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
            Send OTP
          </Button>
        </Form>
      </Card>
    </div>
  );
}
