"use client";

import React from "react";
import { Card, Typography, Row, Col, Statistic, Divider, Progress } from "antd";
import {
  TeamOutlined,
  ApartmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import "./dashboard.css";

const { Title } = Typography;

/** 📊 Sample Data */
const attendanceData = [
  { day: "Mon", hours: 7.5 },
  { day: "Tue", hours: 8 },
  { day: "Wed", hours: 7 },
  { day: "Thu", hours: 8.5 },
  { day: "Fri", hours: 6.5 },
];

const departmentData = [
  { name: "HR", value: 12 },
  { name: "IT", value: 30 },
  { name: "Finance", value: 10 },
  { name: "Marketing", value: 8 },
  { name: "Operations", value: 15 },
];

const projectCompletionData = [
  { name: "Project Alpha", completion: 95 },
  { name: "Project Beta", completion: 75 },
  { name: "Project Gamma", completion: 50 },
  { name: "Project Delta", completion: 90 },
];

const COLORS = ["#1890ff", "#13c2c2", "#faad14", "#722ed1", "#ff4d4f"];

export default function SuperAdminDashboard() {
  return (
    <div className="dashboard-container">
      <Title level={2} className="dashboard-title">
        Super Admin Dashboard — Office Management System
      </Title>

      {/* Summary Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="dashboard-card" bordered={false}>
            <Statistic
              title="Total Employees"
              value={250}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="dashboard-card" bordered={false}>
            <Statistic
              title="Departments"
              value={6}
              prefix={<ApartmentOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="dashboard-card" bordered={false}>
            <Statistic
              title="Avg Working Hours"
              value={7.6}
              suffix="hrs/day"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#13c2c2" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="dashboard-card" bordered={false}>
            <Statistic
              title="Monthly Expenses"
              value={125000}
              prefix={<DollarOutlined />}
              precision={0}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Charts Section */}
      <Row gutter={[16, 16]}>
        {/* Attendance Trend */}
        <Col xs={24} lg={14}>
          <Card
            title="Average Working Hours per Day"
            className="chart-card"
            bordered={false}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#1890ff"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Department Distribution */}
        <Col xs={24} lg={10}>
          <Card
            title="Department Distribution"
            className="chart-card"
            bordered={false}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {departmentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Project Completion */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card
            title="Project Completion Rates"
            className="chart-card"
            bordered={false}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completion" fill="#52c41a" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
