"use client";

import React from "react";
import { Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import UserList from "./components/UserList";

const UsersPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <Card
        title={
          <span>
            <UserOutlined style={{ marginRight: 8 }} />
            User Management
          </span>
        }
        bordered={false}
      >
        <UserList />
      </Card>
    </div>
  );
};

export default UsersPage;
