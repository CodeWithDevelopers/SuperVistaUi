"use client";

import React, { useEffect, useState } from "react";
import { Spin, Typography } from "antd";
import SuperAdminDashboard from "./SuperAdminDashboard";
import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

const { Title } = Typography;

export default function DashboardPage() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Simulate fetching user info (you can replace this with your auth context or API)
    const user = JSON.parse(localStorage.getItem("user"));
    setRole(user?.role || "employee"); // default: employee
  }, []);

  if (!role) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {role !== "super-admin" && <Title level={2}>Dashboard</Title>}

      {role === "super-admin" && <SuperAdminDashboard />}
      {role === "admin" && <AdminDashboard />}
      {role === "manager" && <ManagerDashboard />}
      {role === "employee" && <EmployeeDashboard />}
    </div>
  );
}
