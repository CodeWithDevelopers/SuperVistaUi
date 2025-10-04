"use client";

import React from "react";
import { Card, Typography, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./profile.css";

const { Title, Text } = Typography;

export default function ProfilePage() {
  return (
    <div className="profile-container">
      <Card className="profile-card">
        <Avatar size={100} icon={<UserOutlined />} />
        <Title level={3}>John Doe</Title>
        <Text>Email: johndoe@example.com</Text>
        <br />
        <Text>Role: Admin</Text>
      </Card>
    </div>
  );
}
