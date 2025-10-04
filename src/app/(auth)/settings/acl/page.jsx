"use client";

import React, { useEffect, useState } from "react";
import { Card, Typography, Spin, Select, Tree, Button } from "antd";
import HTTPRequest from "@/services/request";
import { selfMessage } from "@/components/message/SelfMessage";

const { Title } = Typography;
const { Option } = Select;

const AclPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [checkedKeys, setCheckedKeys] = useState([]);

  // Fetch permissions
  const fetchPermissionData = async () => {
    try {
      setLoading(true);
      const response = await HTTPRequest().getAction(
        null,
        "/permissions",
        true
      );
      setData(response?.data || []);
      if (response?.data?.length > 0) {
        setSelectedRole(response.data[0].role);
      }
    } catch (err) {
      selfMessage.error("Failed to load permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissionData();
  }, []);

  const selectedRoleData = data.find((d) => d.role === selectedRole);

  // Build tree like your screenshot
  const buildTreeData = (roleData) => {
    if (!roleData) return [];

    return roleData.permissions.map((perm) => ({
      title: perm.resource.charAt(0).toUpperCase() + perm.resource.slice(1),
      key: perm.resource,
      children: perm.allowed_actions.map((action) => ({
        title: action.charAt(0).toUpperCase() + action.slice(1),
        key: `${perm.resource}-${action}`,
      })),
    }));
  };

  // Get pre-checked keys
  const getCheckedKeys = (roleData) => {
    if (!roleData) return [];
    const keys = [];
    roleData.permissions.forEach((perm) => {
      perm.actions.forEach((action) => {
        keys.push(`${perm.resource}-${action}`);
      });
    });
    return keys;
  };

  const treeData = buildTreeData(selectedRoleData);

  useEffect(() => {
    setCheckedKeys(getCheckedKeys(selectedRoleData));
  }, [selectedRoleData]);

  const onCheck = (checked) => {
    setCheckedKeys(checked);
  };

  // Save updated permissions
  const handleSave = async () => {
    if (!selectedRole) return;
    try {
      setSaving(true);

      const roleData = data.find((d) => d.role === selectedRole);
      const updatedPermissions = roleData.permissions
        .map((perm) => {
          const selectedActions = perm.allowed_actions.filter((a) =>
            checkedKeys.includes(`${perm.resource}-${a}`)
          );
          return selectedActions.length > 0
            ? { resource: perm.resource, actions: selectedActions }
            : null;
        })
        .filter(Boolean);

      await HTTPRequest().putAction(
        null,
        { permissions: updatedPermissions },
        `/permissions/${selectedRole}`,
        true
      );

      selfMessage.success("Permissions updated successfully");
      fetchPermissionData();
    } catch (err) {
      selfMessage.error("Failed to update permissions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card style={{ margin: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Title level={3}>Access Control List (ACL)</Title>
        <Select
          style={{ width: 200 }}
          placeholder="Select Role"
          value={selectedRole}
          onChange={(value) => setSelectedRole(value)}
        >
          {data.map((roleItem) => (
            <Option key={roleItem.role} value={roleItem.role}>
              {roleItem.role.toUpperCase()}
            </Option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 30 }}>
          <Spin size="large" />
        </div>
      ) : selectedRoleData ? (
        <>
          <Tree
            checkable
            showLine
            checkedKeys={checkedKeys}
            onCheck={onCheck}
            treeData={treeData}
          />

          <div style={{ textAlign: "right", marginTop: 20 }}>
            <Button
              type="primary"
              loading={saving}
              onClick={handleSave}
              disabled={!checkedKeys.length}
            >
              Save Changes
            </Button>
          </div>
        </>
      ) : (
        <p>No permissions found for this role.</p>
      )}
    </Card>
  );
};

export default AclPage;
