"use client";

import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Space,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  NodeExpandOutlined,
} from "@ant-design/icons";

const roleOptions = ["super-admin", "admin", "employee", "manager"];

const MenuConfigForm = ({ configs, setConfigs }) => {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [parentKey, setParentKey] = useState(null);
  const [form] = Form.useForm();

  // Find an item in the tree by key
  const findItemInTree = (list, key) => {
    for (const item of list) {
      if (item.key === key) return item;
      if (item.children && item.children.length > 0) {
        const found = findItemInTree(item.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  // immutable recursive helpers
  const updateTree = (list, key, callback) =>
    list.map((item) =>
      item.key === key
        ? callback(item)
        : item.children && item.children.length > 0
        ? { ...item, children: updateTree(item.children, key, callback) }
        : item
    );

  const deleteItem = (key, list) =>
    list.reduce((acc, item) => {
      if (item.key === key) return acc;
      const newItem = { ...item };
      if (newItem.children && newItem.children.length > 0) {
        newItem.children = deleteItem(key, newItem.children);
      }
      acc.push(newItem);
      return acc;
    }, []);

  const generateKeyFromTitle = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 50);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    // Only auto-generate key when adding new item (not editing)
    if (!editingItem) {
      const generatedKey = generateKeyFromTitle(title);
      form.setFieldsValue({ key: generatedKey });
    }
  };

  const addOrUpdate = (values) => {
    let updated;

    if (editingItem) {
      // Editing existing item - update it in place
      updated = updateTree(configs, editingItem.key, (node) => ({
        ...node,
        ...values,
        // Preserve existing children
        children: node.children || [],
      }));
    } else if (parentKey) {
      // Adding child under a parent
      const newNode = {
        ...values,
        key: values.key || `menu_${Date.now()}`,
        children: [],
      };
      updated = updateTree(configs, parentKey, (node) => ({
        ...node,
        children: [...(node.children || []), newNode],
      }));
    } else {
      // Adding top-level item
      const newNode = {
        ...values,
        key: values.key || `menu_${Date.now()}`,
        children: [],
      };
      updated = [...configs, newNode];
    }

    setConfigs(updated);
    form.resetFields();
    setEditingItem(null);
    setParentKey(null);
    setOpen(false);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    setParentKey(null);
    // Set form values for editing
    form.setFieldsValue({
      title: record.title,
      key: record.key,
      link: record.link,
      icon: record.icon,
      description: record.description,
      order_by: record.order_by,
      allowed_roles_types: record.allowed_roles_types,
      status: record.status !== undefined ? record.status : true,
    });
    setOpen(true);
  };

  const handleAddChild = (record) => {
    setParentKey(record.key);
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({ status: true });
    setOpen(true);
  };

  const handleDelete = (key) => {
    setConfigs(deleteItem(key, configs));
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (t) => <span style={{ fontWeight: 500 }}>{t}</span>,
    },
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
      width: 150,
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      width: 150,
      render: (text) => text || "-",
    },
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      width: 100,
      render: (text) => text || "-",
    },
    {
      title: "Order",
      dataIndex: "order_by",
      key: "order_by",
      width: 80,
      render: (text) => text || "-",
    },
    {
      title: "Roles",
      dataIndex: "allowed_roles_types",
      key: "roles",
      width: 200,
      render: (roles) => (
        <>
          {roles && roles.length > 0
            ? roles.map((r) => (
                <Tag key={r} color="geekblue" style={{ marginBottom: 4 }}>
                  {r}
                </Tag>
              ))
            : "-"}
        </>
      ),
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
    {
      title: "Actions",
      key: "actions",
      width: 240,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<NodeExpandOutlined />}
            size="small"
            onClick={() => handleAddChild(record)}
          >
            Add Child
          </Button>

          <Button
            icon={<EditOutlined />}
            size="small"
            type="link"
            onClick={() => handleEdit(record)}
          />

          <Button
            icon={<DeleteOutlined />}
            size="small"
            type="link"
            danger
            onClick={() => handleDelete(record.key)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingItem(null);
          setParentKey(null);
          form.resetFields();
          form.setFieldsValue({ status: true });
          setOpen(true);
        }}
        style={{ marginBottom: 12, width: "100%" }}
      >
        Add Top Level Menu Item
      </Button>

      {configs.length > 0 ? (
        <Table
          dataSource={configs}
          columns={columns}
          rowKey="key"
          pagination={false}
          bordered
          size="small"
          scroll={{ x: 1200 }}
          expandable={{
            childrenColumnName: "children",
            defaultExpandAllRows: false,
            indentSize: 25,
          }}
        />
      ) : (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            color: "#999",
            border: "1px dashed #d9d9d9",
            borderRadius: "4px",
            backgroundColor: "#fafafa",
          }}
        >
          No submenu items added yet. Click the button above to add your first
          menu item.
        </div>
      )}

      <Modal
        title={
          editingItem
            ? "Edit Menu Item"
            : parentKey
            ? "Add Child Menu Item"
            : "Add Menu Item"
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setEditingItem(null);
          setParentKey(null);
        }}
        onOk={() => form.submit()}
        okText={editingItem ? "Update" : "Add"}
        destroyOnClose
        width={600}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={addOrUpdate}
          initialValues={{ status: true }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input
              placeholder="Enter menu title"
              onChange={handleTitleChange}
            />
          </Form.Item>

          <Form.Item
            name="key"
            label="Key"
            rules={[{ required: true, message: "Please enter key" }]}
          >
            <Input
              placeholder="Auto-generated from title"
              disabled={!!editingItem}
            />
          </Form.Item>

          <Form.Item name="link" label="Link">
            <Input placeholder="Enter link (e.g., /dashboard)" />
          </Form.Item>

          <Form.Item name="icon" label="Icon">
            <Input placeholder="Enter icon name" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Enter description" />
          </Form.Item>

          <Form.Item name="order_by" label="Order">
            <Input type="number" placeholder="Enter order number" />
          </Form.Item>

          <Form.Item name="allowed_roles_types" label="Allowed Roles">
            <Select
              mode="multiple"
              placeholder="Select allowed roles"
              options={roleOptions.map((r) => ({ value: r, label: r }))}
            />
          </Form.Item>

          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MenuConfigForm;
