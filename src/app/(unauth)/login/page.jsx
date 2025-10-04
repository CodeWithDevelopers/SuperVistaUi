"use client";

import React, { useState } from "react";
import { Form, Input, Button, Typography, Divider, Card } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../components/AuthProvider";
import HTTPRequest from "../../../services/request";
import Cookies from "js-cookie";
import "./login.css";
import Image from "next/image";
import Link from "next/link";
import LoginImage from "../../../../public/images/login-illustartion.png";
import { selfMessage } from "@/components/message/SelfMessage";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();


  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { postAction, getAction } = HTTPRequest();
      const response = await postAction(
        null,
        { email: values.email, password: values.password },
        "/auth/login",
        true
      );

      if (response.success) {
        const { token, userData } = response.data;

        localStorage.setItem("token", token);
        Cookies.set("token", token, { expires: 7 });

        await login({ token, userData });

        selfMessage.success("Login successful!");

        await getAction(null, "/auth/session", true, {
          Authorization: `Bearer ${token}`,
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        selfMessage.error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      selfMessage.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-wrapper">
        {/* Left Side */}
        <div className="login-left">
          <div className="content-box">
            <div className="login-image-box">
              <Image
                width={500}
                height={350}
                src={LoginImage}
                alt="Login Illustration"
                className="login-image"
              />
            </div>
            <Title level={2} className="login-welcome-title">
              Welcome Back!
            </Title>
            <Text className="login-subtitle">
              Manage your tasks, users, and permissions in one place. Stay
              organized and boost productivity 🚀
            </Text>
          </div>
        </div>

        {/* Right Side */}
        <div className="login-right">
          <Card className="login-card">
            <div className="login-card-header">
              <Title level={2} className="login-title">
                Login
              </Title>
              <Text type="secondary" className="login-subtitle">
                Please login to your account
              </Text>
            </div>

            <Form layout="vertical" onFinish={onFinish} className="login-form">
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Email"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  size="large"
                />
              </Form.Item>

              <Form.Item className="forgot-password-row">
                <Link href="/forgot-password">Forgot Password?</Link>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                className="login-btn"
              >
                Login Now
              </Button>
            </Form>

            <Divider plain>or</Divider>
            <Text>
              Don’t have an account? <Link href="/signup">Sign Up</Link>
            </Text>
          </Card>
        </div>
      </div>
    </>
  );
}
