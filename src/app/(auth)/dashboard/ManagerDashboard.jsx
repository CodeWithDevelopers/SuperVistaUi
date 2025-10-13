"use client";
import React from "react";
import { Card, Row, Col } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const projectData = [
  { project: "Alpha", progress: 80 },
  { project: "Beta", progress: 65 },
  { project: "Gamma", progress: 95 },
];

export default function ManagerDashboard() {
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Team Members">10</Card>
        </Col>
        <Col span={8}>
          <Card title="Ongoing Projects">3</Card>
        </Col>
        <Col span={8}>
          <Card title="Pending Approvals">2</Card>
        </Col>
      </Row>

      <Card title="Project Progress" style={{ marginTop: 24 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectData}>
            <XAxis dataKey="project" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="progress" fill="#52c41a" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
