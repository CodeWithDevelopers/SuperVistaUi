"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Space, message, Popconfirm } from "antd";
import { useRouter } from "next/navigation";
import HTTPRequest from "@/services/request";
import "./users.css";
import { selfMessage } from "@/components/message/SelfMessage";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await HTTPRequest().getAction(null, "/users", true);
      if (response?.success) setUsers(response.data || []);
      else selfMessage.error(response?.message || "Failed to fetch users");
    } catch (error) {
      selfMessage.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

    const handleDelete = async (id) => {
    try {
      const response = await HTTPRequest().deleteAction(
        null,
        null,
        `/users/${id}`,
        true
      );
      if (response?.success) {
        message.success("User deleted successfully!");
        fetchUsers();
      } else {
        message.error(response?.message || "Failed to delete user");
      }
    } catch (error) {
      message.error(error.message || "Something went wrong!");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => router.push(`/users/${record.id}/view`)}
          >
            View
          </Button>
          <Button
            type="link"
            onClick={() => router.push(`/users/${record.id}/edit`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>User Listing</h2>
        <Button type="primary" onClick={() => router.push("/users/new")}>
          New User
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        // onRow={(record) => ({
        //   onClick: () => router.push(`/users/${record.id}/view`),
        // })}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default UsersPage;
