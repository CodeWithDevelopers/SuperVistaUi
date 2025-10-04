"use client";

import React, { useEffect, useState } from "react";
import { Card, Select, Table, Checkbox, Button, message, Spin } from "antd";
import HTTPRequest from "@/services/request";
import { selfMessage } from "@/components/message/SelfMessage";

const { Option } = Select;

const ResourceMappingPage = () => {
  const [roles, setRoles] = useState([]);
  const [resources, setResources] = useState([]);
  const [actions, setActions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState({}); // { resourceKey: { enabled: true, actions: {action: bool} } }
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [resourceMapped, setResourceMapped] = useState([]);

  // Fetch all initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingData(true);

        const [resRes, resAct, resRoles, resMap] = await Promise.all([
          HTTPRequest().getAction(null, `/resources`, true),
          HTTPRequest().getAction(null, `/actions`, true),
          HTTPRequest().getAction(null, `/roles`, true),
          HTTPRequest().getAction(null, `/resource-mapped`, true),
        ]);

        setResources(resRes?.data || []);
        setActions(resAct?.data || []);
        setRoles(resRoles?.data || []);
        setResourceMapped(resMap?.data || []);

        const initialRole =
          resMap?.data?.[0]?.role ||
          (resRoles?.data?.length > 0 ? resRoles.data[0].key : null);

        setSelectedRole(initialRole);

        const mappedForRole = resMap?.data?.find(
          (item) => item.role === initialRole
        );

        if (mappedForRole) {
          const initialPerms = {};
          mappedForRole.permissions.forEach((perm) => {
            initialPerms[perm.resource] = {
              enabled: true,
              actions: perm.actions,
            };
          });
          setPermissions(initialPerms);
        }
      } catch (error) {
        console.error(error);
        message.error("Failed to fetch initial data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchInitialData();
  }, []);

  // When role changes
  useEffect(() => {
    if (!selectedRole || !resourceMapped.length) return;

    const mapped = resourceMapped.find((item) => item.role === selectedRole);
    if (mapped) {
      const rolePerms = {};
      mapped.permissions.forEach((perm) => {
        rolePerms[perm.resource] = {
          enabled: true,
          actions: perm.actions,
        };
      });
      setPermissions(rolePerms);
    } else {
      const emptyPerms = {};
      resources.forEach((res) => {
        const emptyActions = {};
        actions.forEach((act) => (emptyActions[act.name] = false));
        emptyPerms[res.key] = { enabled: false, actions: emptyActions };
      });
      setPermissions(emptyPerms);
    }
  }, [selectedRole, resourceMapped, resources, actions]);

  // Toggle resource enable/disable
  const toggleResource = (resourceKey, checked) => {
    setPermissions((prev) => ({
      ...prev,
      [resourceKey]: {
        ...(prev[resourceKey] || { actions: {} }),
        enabled: checked,
      },
    }));
  };

  // Toggle action checkbox
  const toggleAction = (resourceKey, action, checked) => {
    setPermissions((prev) => ({
      ...prev,
      [resourceKey]: {
        ...(prev[resourceKey] || { enabled: true, actions: {} }),
        enabled: true, // enable automatically when user toggles an action
        actions: {
          ...(prev[resourceKey]?.actions || {}),
          [action]: checked,
        },
      },
    }));
  };

  // Save permissions
  const handleSave = async () => {
    if (!selectedRole) return message.error("Please select a role");

    // Include only enabled resources in payload
    const mappedPermissions = Object.entries(permissions)
      .filter(([_, value]) => value.enabled)
      .map(([resource, data]) => ({
        resource,
        actions: data.actions,
      }));

    const payload = {
      role: selectedRole,
      mappedPermissions,
    };

    try {
      setLoading(true);
      const res = await HTTPRequest().postAction(
        null,
        payload,
        `/resource-mapped`,
        true
      );
      selfMessage.success(res.message || "Permissions saved successfully!");

      // Refresh mapping data
      const updated = await HTTPRequest().getAction(
        null,
        `/resource-mapped`,
        true
      );
      setResourceMapped(updated?.data || []);
    } catch (error) {
      console.error(error);
      message.error("Failed to save permissions");
    } finally {
      setLoading(false);
    }
  };

  // Build columns dynamically
  const columns = [
    {
      title: <div style={{ fontWeight: "bold" }}>Resource</div>,
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Checkbox
          checked={permissions[record.key]?.enabled || false}
          onChange={(e) => toggleResource(record.key, e.target.checked)}
        >
          {text}
        </Checkbox>
      ),
    },
    ...actions.map((action) => ({
      title: action.name.charAt(0).toUpperCase() + action.name.slice(1),
      key: action.name,
      render: (_, record) => {
        const resPerm = permissions[record.key];
        const isEnabled = resPerm?.enabled || false;
        return (
          <Checkbox
            checked={resPerm?.actions?.[action.name] || false}
            disabled={!isEnabled}
            onChange={(e) =>
              toggleAction(record.key, action.name, e.target.checked)
            }
          />
        );
      },
    })),
  ];

  return (
    <Card title="Resource Mapping" bordered className="shadow-md">
      {loadingData ? (
        <div style={{ textAlign: "center", padding: "30px" }}>
          <Spin tip="Loading resources, roles, and permissions..." />
        </div>
      ) : (
        <>
          {/* Role Selector */}
          <div style={{ marginBottom: 20 }}>
            <span style={{ marginRight: 10 }}>Select Role:</span>
            <Select
              style={{ width: 220 }}
              placeholder="Select role"
              value={selectedRole}
              onChange={(value) => setSelectedRole(value)}
            >
              {roles.map((role) => (
                <Option key={role.key} value={role.key}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Table */}
          <Table
            rowKey="key"
            columns={columns}
            dataSource={resources}
            pagination={false}
          />

          {/* Save */}
          <div style={{ marginTop: 20, textAlign: "right" }}>
            <Button
              type="primary"
              onClick={handleSave}
              loading={loading}
              disabled={!selectedRole}
            >
              Save Permissions
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default ResourceMappingPage;
