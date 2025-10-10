"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Popconfirm, Spin, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import HTTPRequest from "@/services/request";
import { selfMessage } from "@/components/message/SelfMessage";
import MenuForm from "./MenuForm";

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await HTTPRequest().getAction(null, "/menus", true);
      if (response?.success) {
        setMenus(response.data || []);
      } else {
        selfMessage.error(
          response?.message || "Failed to fetch menus",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      selfMessage.error("Error fetching menus", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const deleteMenu = async (key) => {
    try {
      const response = await HTTPRequest().deleteAction(
        null,
        null,
        `/menus/${key}`,
        true
      );
      if (response?.success) {
        selfMessage.success(response.message || "Menu deleted successfully");
        fetchMenus();
      } else {
        selfMessage.error(response.message || "Failed to delete menu", "error");
      }
    } catch (err) {
      console.error(err);
      selfMessage.error("Error deleting menu", "error");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (t) => <b>{t}</b>,
    },
    { title: "Key", dataIndex: "key", key: "key" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Roles",
      dataIndex: "allowed_roles_types",
      key: "allowed_roles_types",
      render: (roles) =>
        roles?.map((r) => (
          <Tag key={r} color="blue">
            {r}
          </Tag>
        )),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v) => (
        <Tag color={v ? "green" : "red"}>{v ? "Active" : "Inactive"}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            size="small"
            type="link"
            onClick={() => {
              setEditingMenu(record);
              setOpenModal(true);
            }}
          />
          <Popconfirm
            title="Delete this menu?"
            onConfirm={() => deleteMenu(record.key)}
          >
            <Button icon={<DeleteOutlined />} size="small" type="link" danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  const childColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (t) => <span style={{ fontWeight: 500 }}>{t}</span>,
    },
    { title: "Key", dataIndex: "key", key: "key" },
    { title: "Link", dataIndex: "link", key: "link" },
    { title: "Icon", dataIndex: "icon", key: "icon" },
    { title: "Order", dataIndex: "order_by", key: "order_by", width: 80 },
    {
      title: "Roles",
      dataIndex: "allowed_roles_types",
      key: "roles",
      render: (roles) =>
        roles?.map((r) => (
          <Tag key={r} color="geekblue">
            {r}
          </Tag>
        )),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (v) => (
        <Tag color={v ? "green" : "red"}>{v ? "Active" : "Inactive"}</Tag>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => {
          setEditingMenu(null);
          setOpenModal(true);
        }}
      >
        Add Menu
      </Button>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={menus}
          columns={columns}
          rowKey="id"
          bordered
          expandable={{
            expandedRowRender: (record) => {
              const flatChildren = record.config || [];
              return flatChildren.length > 0 ? (
                <Table
                  dataSource={flatChildren}
                  columns={childColumns}
                  rowKey="key"
                  pagination={false}
                  size="small"
                  bordered
                  expandable={{
                    childrenColumnName: "children",
                    indentSize: 25,
                  }}
                />
              ) : (
                <div style={{ padding: "8px 0", color: "#999" }}>
                  No submenu items
                </div>
              );
            },
          }}
        />
      )}

      <Modal
        title={editingMenu ? "Edit Menu" : "Add Menu"}
        open={openModal}
        footer={null}
        onCancel={() => setOpenModal(false)}
        width={900}
        destroyOnClose
      >
        <MenuForm
          initialData={editingMenu}
          onClose={() => {
            setOpenModal(false);
            fetchMenus();
          }}
        />
      </Modal>
    </>
  );
};

export default MenuList;
