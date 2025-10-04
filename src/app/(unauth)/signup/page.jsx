"use client";

import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  message,
  Select,
  Row,
  Col,
  Card,
  Divider,
} from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import HTTPRequest from "@/services/request";
import "./signup.css";
import Image from "next/image";
import LoginImage from "../../../../public/images/login-illustartion.png";
import { selfMessage } from "@/components/message/SelfMessage";

const { Title, Text } = Typography;
const { Option } = Select;

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        verificationMethod: values.verificationMethod,
      };

      const response = await HTTPRequest().postAction(
        null,
        payload,
        "/auth/register",
        true
      );

      if (response?.success) {
        selfMessage.success(`Account created for ${values.name}`);
        login({ email: values.email, name: values.name });

        sessionStorage.setItem("otpEmail", values.email);
        router.push("/otp-verify");
      } else {
        selfMessage.error(response?.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* Left section */}
      <div className="signup-left">
        <div className="signup-left-content">
          <div className="login-image-box">
            <Image
              width={500}
              height={350}
              src={LoginImage}
              alt="Login Illustration"
              className="login-image"
            />
          </div>
          <Title level={2} className="signup-left-title">
            Welcome to Our Platform
          </Title>
          <Text className="signup-left-text">
            Join us and explore amazing features. Create an account to get
            started with personalized experiences, exclusive content, and
            seamless services.
          </Text>
        </div>
      </div>

      {/* Right section - Signup form */}
      <div className="signup-right">
        <Card className="signup-card" bordered={false}>
          <Title level={2} className="signup-title">
            Sign Up
          </Title>
          <Text type="secondary" className="signup-subtitle">
            Create your account to get started
          </Text>

          <Form layout="vertical" onFinish={onFinish} className="signup-form">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please enter your full name" },
                  ]}
                >
                  <Input placeholder="Enter your name" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your phone number",
                    },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Phone number must be 10 digits",
                    },
                  ]}
                >
                  <Input placeholder="Enter your phone number" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
                  ]}
                >
                  <Input.Password placeholder="Enter your password" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Verification Method"
                  name="verificationMethod"
                  rules={[
                    {
                      required: true,
                      message: "Please select a verification method",
                    },
                  ]}
                >
                  <Select placeholder="Select verification method">
                    <Option value="email">Email</Option>
                    <Option value="phone">Phone</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>or</Divider>
          <div className="signup-footer-text">
            <Text>
              Already have an account? <Link href="/login">Login</Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}
