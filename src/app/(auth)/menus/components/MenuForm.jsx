"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Switch, Card, Divider } from "antd";
import HTTPRequest from "@/services/request";
import { selfMessage } from "@/components/message/SelfMessage";
import MenuConfigForm from "./MenuConfigForm";

const { TextArea } = Input;
const roleOptions = ["super-admin", "admin", "employee", "manager"];

const MenuForm = ({ initialData, onClose }) => {
  const [form] = Form.useForm();
  // configs must reflect the real `children` tree structure (deep clone when editing)
  const [configs, setConfigs] = useState([]);
  const [loader, setLoader] = useState(false);

  // sync initialData to form and configs when opening edit modal
  useEffect(() => {
    if (initialData) {
      // deep clone to avoid mutating parent state
      const clonedConfig = initialData.config
        ? JSON.parse(JSON.stringify(initialData.config))
        : [];
      setConfigs(clonedConfig);

      // convert status (0/1) to boolean for Switch
      const initVals = {
        ...initialData,
        status:
          typeof initialData.status !== "undefined"
            ? Boolean(initialData.status)
            : true,
      };
      form.setFieldsValue(initVals);
    } else {
      // reset for create
      setConfigs([]);
      form.resetFields();
    }
  }, [initialData, form]);

  const onFinish = async (values) => {
    setLoader(true);
    try {
      const payload = {
        ...values,
        // if editing, keep existing key (avoid changing it)
        key:
          initialData?.key ||
          (values.title || "").toLowerCase().replace(/\s+/g, "_"),
        config: configs,
      };

      let response;
      if (initialData) {
        response = await HTTPRequest().putAction(
          null,
          payload,
          `/menus/${initialData.key}`,
          true
        );
      } else {
        response = await HTTPRequest().postAction(
          null,
          payload,
          "/menus",
          true
        );
      }

      if (response?.success) {
        selfMessage.success(
          response.message ||
            `Menu ${initialData ? "updated" : "created"} successfully`
        );
        onClose();
      } else {
        selfMessage.error(response.message || "Failed to save menu", "error");
      }
    } catch (err) {
      console.error(err);
      selfMessage.error("Error saving menu", "error");
    } finally {
      setLoader(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ status: true }}
    >
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <TextArea rows={2} />
      </Form.Item>

      <Form.Item name="icon" label="Icon">
        <Input placeholder="AntD icon name (optional)" />
      </Form.Item>

      <Form.Item
        name="allowed_roles_types"
        label="Allowed Roles"
        rules={[{ required: true }]}
      >
        <Select
          mode="multiple"
          options={roleOptions.map((r) => ({ value: r, label: r }))}
        />
      </Form.Item>

      <Form.Item name="status" label="Status" valuePropName="checked">
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>

      <Divider orientation="left">Config (Submenu Items)</Divider>
      <MenuConfigForm configs={configs} setConfigs={setConfigs} />

      <Card bordered={false} style={{ textAlign: "right", marginTop: 16 }}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button loading={loader} type="primary" htmlType="submit">
          {initialData ? "Update" : "Create"}
        </Button>
      </Card>
    </Form>
  );
};

export default MenuForm;
