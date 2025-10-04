"use client";

import React from "react";
import { Card, Typography, Row, Col } from "antd";
import "./dashboard.css";

const { Title } = Typography;

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      <Title level={2}>Dashboard</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Users" variant={false}>
            120 Active Users
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Sales" variant={false}>
            $5,430 this month
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Tasks" variant={false}>
            24 Pending Tasks
          </Card>
        </Col>
      </Row>
    </div>
  );
}
