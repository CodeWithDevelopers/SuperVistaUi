"use client";

import React, { useEffect, useState } from "react";
import { Card, Typography, Spin, message } from "antd";
import { useParams } from "next/navigation";
import HTTPRequest from "@/services/request";
import "../../users.css";

const { Title, Text } = Typography;

export default function ViewUserPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await HTTPRequest().getAction(
        null,
        `/users/${id}`,
        true
      );
      if (response?.success) setUser(response.data);
      else message.error(response?.message || "Failed to fetch user");
    } catch (error) {
      message.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) return <Spin size="large" className="users-loading" />;

  if (!user) return <Text>No user found.</Text>;

  return (
    <div className="users-page">
      <Card className="user-detail-card">
        <Title level={3}>User Details</Title>
        <Text>
          <strong>ID:</strong> {user.id}
        </Text>
        <br />
        <Text>
          <strong>Name:</strong> {user.name}
        </Text>
        <br />
        <Text>
          <strong>Email:</strong> {user.email}
        </Text>
        <br />
        <Text>
          <strong>Phone:</strong> {user.phone}
        </Text>
      </Card>
    </div>
  );
}
