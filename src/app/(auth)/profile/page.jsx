"use client";

import { useEffect, useState } from "react";
import React from "react";
import { Typography, Spin, Card, Alert } from "antd";
import "./profile.css";
import HTTPRequest from "@/services/request";
import { selfMessage } from "@/components/message/SelfMessage";
import UserView from "../users/components/UserView";
import { getLoggedInUserId } from "@/utils/utils";

const { Title } = Typography;

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = getLoggedInUserId();

      if (!userId) {
        setError("User ID not found. Please login again.");
        setLoading(false);
        return;
      }

      // ✅ FIXED: Added await here
      const response = await HTTPRequest().getAction(
        null,
        `/users/${userId}`,
        true
      );

      if (response?.success) {
        setUser(response.data);
      } else {
        const errorMessage =
          response?.message || "Failed to fetch user profile";
        setError(errorMessage);
        selfMessage.error(errorMessage, "error");
      }
    } catch (error) {
      console.error("Error in Fetch user profile:", error);
      const errorMessage = "Error fetching user profile. Please try again.";
      setError(errorMessage);
      selfMessage.error(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="profile-container">
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="small" tip="Loading profile..." />
        </div>
      ) : error ? (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginTop: 20 }}
        />
      ) : user ? (
        <Card
          title={
            <Title level={3} style={{ margin: 0 }}>
              My Profile
            </Title>
          }
          style={{ minHeight: "400px" }}
        >
          <UserView user={user} />
        </Card>
      ) : (
        <Alert
          message="No Data"
          description="User profile data not available."
          type="info"
          showIcon
          style={{ marginTop: 20 }}
        />
      )}
    </div>
  );
}
