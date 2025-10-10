"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Popconfirm,
  Spin,
  Tag,
  Avatar,
  Space,
  Input,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import HTTPRequest from "@/services/request";
import { selfMessage } from "@/components/message/SelfMessage";
import UserForm from "./UserForm";
import UserView from "./UserView";

const { Search } = Input;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await HTTPRequest().getAction(null, "/users", true);
      if (response?.success) {
        const userData = response.data || [];
        setUsers(userData);
        setFilteredUsers(userData);
      } else {
        selfMessage.error(
          response?.message || "Failed to fetch users",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      selfMessage.error("Error fetching users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and role
  useEffect(() => {
    let filtered = users;

    if (searchText) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
          user.phone?.includes(searchText)
      );
    }

    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [searchText, roleFilter, users]);

  const deleteUser = async (id) => {
    try {
      const response = await HTTPRequest().deleteAction(
        null,
        null,
        `/users/${id}`,
        true
      );
      if (response?.success) {
        selfMessage.success(response.message || "User deleted successfully");
        fetchUsers();
      } else {
        selfMessage.error(response.message || "Failed to delete user", "error");
      }
    } catch (err) {
      console.error(err);
      selfMessage.error("Error deleting user", "error");
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: "red",
      manager: "blue",
      employee: "green",
    };
    return <Tag color={colors[role] || "default"}>{role?.toUpperCase()}</Tag>;
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Profile",
      dataIndex: "profile",
      key: "profile",
      width: 80,
      render: (profile, record) => {
        const imageProfile = profile?.find((p) => p.type === "image");
        return (
          <Avatar
            src={imageProfile?.url}
            size={40}
            style={{ backgroundColor: "#1890ff" }}
          >
            {record.name?.charAt(0).toUpperCase()}
          </Avatar>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 130,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      render: (text) => text || "-",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role) => getRoleBadge(role),
      filters: [
        { text: "Admin", value: "admin" },
        { text: "Manager", value: "manager" },
        { text: "Employee", value: "employee" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Verified",
      dataIndex: "accountVerified",
      key: "accountVerified",
      width: 100,
      render: (verified) => (
        <Tag color={verified ? "green" : "orange"}>
          {verified ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            size="small"
            type="link"
            onClick={() => {
              setViewingUser(record);
              setOpenViewModal(true);
            }}
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            type="link"
            onClick={() => {
              setEditingUser(record);
              setOpenModal(true);
            }}
          />
          <Popconfirm
            title="Delete this user?"
            description="This action cannot be undone."
            onConfirm={() => deleteUser(record.id)}
          >
            <Button icon={<DeleteOutlined />} size="small" type="link" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 16, width: "100%" }} wrap>
          <Search
            placeholder="Search by name, email, or phone"
            allowClear
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
          />
          <Select
            placeholder="Filter by role"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setRoleFilter(value)}
            options={[
              { value: "admin", label: "Admin" },
              { value: "manager", label: "Manager" },
              { value: "employee", label: "Employee" },
            ]}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingUser(null);
              setOpenModal(true);
            }}
          >
            Add User
          </Button>
        </Space>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          bordered
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
          }}
        />
      )}

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={openModal}
        footer={null}
        onCancel={() => setOpenModal(false)}
        width={800}
        destroyOnClose
      >
        <UserForm
          initialData={editingUser}
          onClose={() => {
            setOpenModal(false);
            fetchUsers();
          }}
        />
      </Modal>

      <Modal
        title="User Details"
        open={openViewModal}
        footer={null}
        onCancel={() => setOpenViewModal(false)}
        width={700}
        destroyOnClose
      >
        <UserView user={viewingUser} />
      </Modal>
    </>
  );
};

export default UserList;
