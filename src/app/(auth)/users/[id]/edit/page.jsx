"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useRouter, useParams } from "next/navigation";
import HTTPRequest from "@/services/request";
import "../../users.css";

const { Title } = Typography;

export default function EditUserPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const response = await HTTPRequest().getAction(
        null,
        `/users/${id}`,
        true
      );
      if (response?.success) form.setFieldsValue(response.data);
      else message.error(response?.message || "Failed to fetch user");
    } catch (error) {
      message.error(error.message || "Something went wrong!");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await HTTPRequest().putAction(
        null,
        values,
        `/users/${id}`,
        true
      );
      if (response?.success) {
        message.success("User updated successfully!");
        router.push("/users");
      } else {
        message.error(response?.message || "Failed to update user");
      }
    } catch (error) {
      message.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="users-page">
      <Card className="user-form-card">
        <Title level={3}>Edit User</Title>
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
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Update User
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
