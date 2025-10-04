"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Spin,
  Tooltip,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import HTTPRequest from "@/services/request";
import { selfMessage } from "@/components/message/SelfMessage";
import "./resource.css"; // custom css
import { formatString } from "@/utils/utils";

const { Option } = Select;

const ResourcePage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [form] = Form.useForm();
  const [allActions, setAllActions] = useState([]);

  // Fetch actions
  const fetchActionData = async () => {
    try {
      const response = await HTTPRequest().getAction(null, "/actions", true);
      setAllActions(response?.data.map((item) => item.name) || []);
    } catch (err) {
      selfMessage.error("Failed to load actions");
    }
  };

  // Fetch resources
  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await HTTPRequest().getAction(null, "/resources", true);
      setResources(response?.data || []);
    } catch (err) {
      selfMessage.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
    fetchActionData();
  }, []);

  // Open modal (add or edit)
  const openModal = (resource = null) => {
    setEditingResource(resource);
    if (resource) {
      form.setFieldsValue({
        name: resource.name,
        actions: resource.actions || [],
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  // Handle save (create or update)
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingResource) {
        // Update
        await HTTPRequest().putAction(
          null,
          values,
          `/resources/${editingResource._id}`,
          true
        );
        selfMessage.success("Resource updated successfully");
      } else {
        // Create
        await HTTPRequest().postAction(null, values, "/resources", true);
        selfMessage.success("Resource created successfully");
      }
      setModalVisible(false);
      fetchResources();
    } catch (err) {
      selfMessage.error("Failed to save resource");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await HTTPRequest().deleteAction(null, null, `/resources/${id}`, true);
      selfMessage.success("Resource deleted successfully");
      fetchResources();
    } catch (err) {
      selfMessage.error("Failed to delete resource");
    }
  };

  const columns = [
    {
      title: "Resource Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="resource-name">{text}</span>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (actions = [], record) => (
        <span className="action-tags">
          {Array.isArray(actions) &&
            actions.map((a, idx) => (
              <span key={`${record._id}-${a}-${idx}`} className="action-tag">
                {formatString(a)}
              </span>
            ))}
        </span>
      ),
    },
    {
      title: "Operations",
      key: "operations",
      render: (_, record) => (
        <div className="table-actions">
          <Tooltip title="Edit">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => openModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this resource?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Tooltip title="Delete">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="resource-container">
      <div className="resource-header">
        <h2>Resource Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
        >
          Add Resource
        </Button>
      </div>

      {loading ? (
        <div className="loading-box">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={resources}
          columns={columns}
          rowKey="_id"
          bordered
          className="resource-table"
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        title={editingResource ? "Edit Resource" : "Add Resource"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        okText="Save"
        className="resource-modal"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Resource Name"
            name="name"
            rules={[{ required: true, message: "Please enter resource name" }]}
          >
            <Input placeholder="Enter resource name" />
          </Form.Item>
          <Form.Item
            label="Actions"
            name="actions"
            rules={[
              { required: true, message: "Please select at least one action" },
            ]}
          >
            <Select mode="multiple" placeholder="Select actions">
              {allActions.map((action) => (
                <Option key={action} value={action}>
                  {formatString(action)}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ResourcePage;
