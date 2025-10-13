"use client";
import React from "react";
import { Card, Row, Col, Progress } from "antd";

export default function EmployeeDashboard() {
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Today's Tasks">5 Tasks</Card>
        </Col>
        <Col span={8}>
          <Card title="Completed Tasks">3 Done</Card>
        </Col>
        <Col span={8}>
          <Card title="Pending Leaves">1 Request</Card>
        </Col>
      </Row>

      <Card title="Performance Overview" style={{ marginTop: 24 }}>
        <p>Monthly Performance</p>
        <Progress percent={78} status="active" />
      </Card>
    </div>
  );
}
