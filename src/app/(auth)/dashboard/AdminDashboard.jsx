"use client";
import React from "react";
import { Card, Row, Col } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", attendance: 90 },
  { month: "Feb", attendance: 87 },
  { month: "Mar", attendance: 92 },
  { month: "Apr", attendance: 95 },
  { month: "May", attendance: 89 },
];

export default function AdminDashboard() {
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Total Employees">120</Card>
        </Col>
        <Col span={8}>
          <Card title="Active Projects">15</Card>
        </Col>
        <Col span={8}>
          <Card title="Leaves Pending">8</Card>
        </Col>
      </Row>

      <Card title="Employee Attendance Trend" style={{ marginTop: 24 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="attendance" stroke="#1890ff" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
