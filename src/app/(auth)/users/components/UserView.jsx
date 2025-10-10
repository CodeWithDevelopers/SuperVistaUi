"use client";

import React from "react";
import { Descriptions, Tag, Avatar, Image, Card, Space, Empty } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const UserView = ({ user }) => {
  if (!user) {
    return <Empty description="No user data available" />;
  }

  const getRoleBadge = (role) => {
    const colors = {
      admin: "red",
      manager: "blue",
      employee: "green",
    };
    return <Tag color={colors[role] || "default"}>{role?.toUpperCase()}</Tag>;
  };

  const formatDate = (date) => {
    return date ? dayjs(date).format("DD MMM YYYY") : "-";
  };

  const imageProfiles = user.profile?.filter((p) => p.type === "image") || [];
  const otherFiles = user.profile?.filter((p) => p.type !== "image") || [];

  return (
    <div style={{ padding: "10px 0" }}>
      {/* Profile Images */}
      {imageProfiles.length > 0 && (
        <Card
          title="Profile Pictures"
          size="small"
          style={{ marginBottom: 16 }}
        >
          <Space size="middle" wrap>
            {imageProfiles.map((profile, index) => (
              <Image
                key={index}
                src={profile.url}
                alt={`Profile ${index + 1}`}
                width={100}
                height={100}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
            ))}
          </Space>
        </Card>
      )}

      {/* Basic Information */}
      <Card title="Basic Information" size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="ID" span={2}>
            <strong>{user.id}</strong>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <UserOutlined /> Name
              </>
            }
            span={2}
          >
            <strong>{user.name}</strong>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <MailOutlined /> Email
              </>
            }
          >
            {user.email}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <PhoneOutlined /> Phone
              </>
            }
          >
            {user.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            {user.gender || "-"}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <CalendarOutlined /> Date of Birth
              </>
            }
          >
            {formatDate(user.dob)}
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            {getRoleBadge(user.role)}
          </Descriptions.Item>
          <Descriptions.Item label="Account Verified">
            {user.accountVerified ? (
              <Tag icon={<CheckCircleOutlined />} color="success">
                Verified
              </Tag>
            ) : (
              <Tag icon={<CloseCircleOutlined />} color="warning">
                Not Verified
              </Tag>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Address Information */}
      {user.address && (
        <Card
          title={
            <>
              <HomeOutlined /> Address
            </>
          }
          size="small"
          style={{ marginBottom: 16 }}
        >
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Address Line 1" span={2}>
              {user.address.line1 || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Address Line 2" span={2}>
              {user.address.line2 || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="City">
              {user.address.city || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="State">
              {user.address.state || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Zip Code">
              {user.address.zipCode || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Country">
              {user.address.country || "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Other Files */}
      {otherFiles.length > 0 && (
        <Card title="Attached Files" size="small" style={{ marginBottom: 16 }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            {otherFiles.map((file, index) => (
              <Card.Grid key={index} style={{ width: "100%", padding: "12px" }}>
                <Space>
                  <Tag color="blue">{file.type?.toUpperCase()}</Tag>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.publicId || `File ${index + 1}`}
                  </a>
                </Space>
              </Card.Grid>
            ))}
          </Space>
        </Card>
      )}

      {/* Account Statistics */}
      <Card title="Account Statistics" size="small">
        <Descriptions column={2} size="small">
          <Descriptions.Item label="Login Attempts">
            {user.attemptedCount || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Reset Attempts">
            {user.resetAttempts || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Created At" span={2}>
            {formatDate(user.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At" span={2}>
            {formatDate(user.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default UserView;
