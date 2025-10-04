"use client";

import React, { useState } from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { LockOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import HTTPRequest from "@/services/request";
import "./resetPassword.css"; // custom css file

const { Title, Paragraph } = Typography;

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const { token } = useParams();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const response = await HTTPRequest().putAction(
        null,
        { token, newPassword: values.password },
        `/auth/password/reset`,
        true
      );

      if (response && response.success && response.code === 200) {
        setSuccess(true); // switch UI to success card
      } else {
        message.error(response.message || "Password reset failed!");
      }
    } catch (error) {
      message.error(error.message || "Password reset failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      {!success ? (
        <Card className="reset-card">
          <div className="reset-header">
            <Title level={3}>Reset Your Password</Title>
            <Paragraph>
              Enter a new password below. Make sure it’s strong and secure.
            </Paragraph>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
          >
            <Form.Item
              name="password"
              label="New Password"
              rules={[
                { required: true, message: "Please enter your new password!" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long.",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter new password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm new password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="reset-btn"
                loading={loading}
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <Card className="reset-success-card">
          <div className="reset-success">
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              style={{ fontSize: 48 }}
            />
            <Title level={3}>Password Reset Successful</Title>
            <Paragraph>
              Your password has been updated successfully. You can now log in
              with your new password.
            </Paragraph>
            <Button
              type="primary"
              className="login-btn"
              onClick={() => router.push("/login")}
            >
              Go to Login
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
