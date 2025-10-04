"use client";

import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import HTTPRequest from "@/services/request";
import "../users.css";
import { selfMessage } from "@/components/message/SelfMessage";

const { Title } = Typography;

export default function NewUserPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await HTTPRequest().postAction(
        null,
        values,
        "/users",
        true
      );
      if (response?.success) {
        selfMessage.success(response.message || "User created successfully!");
        router.push("/users");
      } else {
        selfMessage.error(response?.message || "Failed to create user");
      }
    } catch (error) {
      selfMessage.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="users-page">
      <Card className="user-form-card">
        <Title level={3}>Create New User</Title>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter user name" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter valid email" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please enter phone" },
              { pattern: /^[0-9]{10}$/, message: "Phone must be 10 digits" },
            ]}
          >
            <Input placeholder="Enter phone" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Create User
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
