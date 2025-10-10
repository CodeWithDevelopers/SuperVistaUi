"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Upload,
  Card,
  Row,
  Col,
  Space,
  message,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import HTTPRequest from "@/services/request";
import { selfMessage } from "@/components/message/SelfMessage";
import dayjs from "dayjs";
import LocationSelect from "./LocationSelect";

const { TextArea } = Input;

const UserForm = ({ initialData, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    if (initialData) {
      const formData = {
        ...initialData,
        dob: initialData.dob ? dayjs(initialData.dob) : null,
        address_line1: initialData.address?.line1,
        address_line2: initialData.address?.line2,
        address_city: initialData.address?.city,
        address_state: initialData.address?.state,
        address_zipCode: initialData.address?.zipCode,
        address_country: initialData.address?.country,
      };
      form.setFieldsValue(formData);

      // Set location states for cascading
      // Support both ID (number) and name (string) formats
      if (initialData.address?.country) {
        const countryValue =
          typeof initialData.address.country === "object"
            ? initialData.address.country.id
            : initialData.address.country;
        setSelectedCountry(countryValue);
      }
      if (initialData.address?.state) {
        const stateValue =
          typeof initialData.address.state === "object"
            ? initialData.address.state.id
            : initialData.address.state;
        setSelectedState(stateValue);
      }

      // Set existing profile files
      if (initialData.profile && initialData.profile.length > 0) {
        const existingFiles = initialData.profile.map((file, index) => ({
          uid: `existing-${index}`,
          name: file.publicId || `file-${index}`,
          status: "done",
          url: file.url,
          type: file.type,
          publicId: file.publicId,
        }));
        setFileList(existingFiles);
        setUploadedFiles(initialData.profile);
      }
    } else {
      form.resetFields();
      setFileList([]);
      setUploadedFiles([]);
      setSelectedCountry(null);
      setSelectedState(null);
    }
  }, [initialData, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        gender: values.gender,
        role: values.role,
        dob: values.dob ? values.dob.toISOString() : null,
        address: {
          line1: values.address_line1,
          line2: values.address_line2,
          city: values.address_city,
          state: values.address_state,
          zipCode: values.address_zipCode,
          country: values.address_country,
        },
        profile: uploadedFiles,
      };

      // Only include password if creating new user or if password is provided
      if (!initialData) {
        payload.password = values.password;
      } else if (values.password) {
        payload.password = values.password;
      }

      let response;
      if (initialData) {
        response = await HTTPRequest().putAction(
          null,
          payload,
          `/users/${initialData.id}`,
          true
        );
      } else {
        response = await HTTPRequest().postAction(
          null,
          payload,
          "/users",
          true
        );
      }

      if (response?.success) {
        selfMessage.success(
          response.message ||
            `User ${initialData ? "updated" : "created"} successfully`
        );
        onClose();
      } else {
        selfMessage.error(response.message || "Failed to save user", "error");
      }
    } catch (err) {
      console.error(err);
      selfMessage.error("Error saving user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Use the common upload endpoint
      // Don't pass customHeader - let the function detect FormData automatically
      const response = await HTTPRequest().postAction(
        null,
        formData,
        "/common/upload-file",
        true,
        null // Pass null for customHeader to trigger auto-detection
      );

      if (response?.success) {
        const uploadedFile = {
          url: response.data.url,
          publicId: response.data.publicId,
          type: response.data.type,
        };
        setUploadedFiles([...uploadedFiles, uploadedFile]);
        onSuccess(response.data);
        selfMessage.success(`${file.name} uploaded successfully`);
      } else {
        onError(new Error(response?.message || "Upload failed"));
        selfMessage.error(`${file.name} upload failed`);
      }
    } catch (error) {
      console.error(error);
      onError(error);
      message.error(`${file.name} upload failed`);
    }
  };

  const handleRemove = (file) => {
    if (file.publicId) {
      // Remove from uploadedFiles array
      setUploadedFiles(
        uploadedFiles.filter((f) => f.publicId !== file.publicId)
      );
    }
    return true;
  };

  const uploadProps = {
    fileList,
    customRequest: handleUpload,
    onChange: ({ fileList: newFileList }) => setFileList(newFileList),
    onRemove: handleRemove,
    multiple: true,
    accept: "image/*,video/*,audio/*,.pdf,.xlsx,.docx",
    listType: "picture",
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        role: "employee",
        gender: "male",
      }}
    >
      <Card title="Basic Information" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter valid email" },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[
                { required: true, message: "Please enter phone number" },
                {
                  pattern: /^[6-9]\d{9}$/,
                  message: "Invalid phone number format",
                },
              ]}
            >
              <Input placeholder="Enter 10-digit phone number" maxLength={10} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="gender" label="Gender">
              <Select
                placeholder="Select gender"
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="dob" label="Date of Birth">
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Select date of birth"
                format="DD/MM/YYYY"
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select role" }]}
            >
              <Select
                placeholder="Select role"
                options={[
                  { value: "super-admin", label: "Super Admin" },
                  { value: "admin", label: "Admin" },
                  { value: "manager", label: "Manager" },
                  { value: "employee", label: "Employee" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="Authentication" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: !initialData,
                  message: "Please enter password",
                },
                {
                  min: 8,
                  message: "Password must be at least 8 characters",
                },
                {
                  max: 32,
                  message: "Password cannot exceed 32 characters",
                },
              ]}
              extra={
                initialData ? "Leave blank to keep current password" : undefined
              }
            >
              <Input.Password
                placeholder={
                  initialData ? "Leave blank to keep current" : "Enter password"
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                {
                  required: !initialData && form.getFieldValue("password"),
                  message: "Please confirm password",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm password" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="Address" style={{ marginBottom: 16 }}>
        <Form.Item name="address_line1" label="Address Line 1">
          <Input placeholder="Enter street address" />
        </Form.Item>

        <Form.Item name="address_line2" label="Address Line 2">
          <Input placeholder="Enter apartment, suite, etc." />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="address_country" label="Country">
              <LocationSelect
                type="country"
                placeholder="Select country"
                onChange={(value) => {
                  setSelectedCountry(value);
                  setSelectedState(null);
                  form.setFieldsValue({
                    address_state: null,
                    address_city: null,
                  });
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="address_state" label="State">
              <LocationSelect
                type="state"
                placeholder="Select state"
                countryId={selectedCountry}
                disabled={!selectedCountry}
                onChange={(value) => {
                  setSelectedState(value);
                  form.setFieldsValue({ address_city: null });
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="address_city" label="City">
              <LocationSelect
                type="city"
                placeholder="Select city"
                stateId={selectedState}
                disabled={!selectedState}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="address_zipCode" label="Zip Code">
              <Input placeholder="Enter zip code" type="number" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="Profile Files" style={{ marginBottom: 16 }}>
        <Form.Item
          label="Upload Files"
          extra="Supported: Images, Videos, Audio, PDF, Excel, Word documents"
        >
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Select Files</Button>
          </Upload>
        </Form.Item>
      </Card>

      <Card bordered={false} style={{ textAlign: "right" }}>
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button loading={loading} type="primary" htmlType="submit">
            {initialData ? "Update User" : "Create User"}
          </Button>
        </Space>
      </Card>
    </Form>
  );
};

export default UserForm;
