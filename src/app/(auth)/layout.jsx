"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import "./auth-layout.css";
import { menuConfig } from "@/staticData/data";
import { getLoggedInUser } from "@/utils/utils";

const { Header, Sider, Content } = Layout;

// Map string to actual AntD icon
const iconMap = {
  DashboardOutlined: <DashboardOutlined />,
  UserOutlined: <UserOutlined />,
  SettingOutlined: <SettingOutlined />,
  UnorderedListOutlined: <UnorderedListOutlined />,
};

export default function AuthLayout({ children }) {
  const user = getLoggedInUser();
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  // Dropdown menu for avatar
  const avatarMenu = {
    items: [
      {
        key: "profile",
        label: "Profile",
        icon: <ProfileOutlined />,
        onClick: () => router.push("/profile"),
      },
      {
        key: "logout",
        label: "Logout",
        icon: <LogoutOutlined />,
        onClick: async () => {
          await logout();
          router.push("/login");
        },
      },
    ],
  };

  // Recursive function to filter menu based on role
  const filterMenuByRole = (menu, role) => {
    return menu
      .filter((item) => item.role.includes(role))
      .map((item) => ({
        key: item.link,
        label: item.label,
        icon: iconMap[item.icon] || null,
        children: item.children ? filterMenuByRole(item.children, role) : null,
        onClick: item.link !== "#" ? () => router.push(item.link) : undefined,
      }));
  };

  const sideMenuItems = filterMenuByRole(menuConfig, user?.role);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Layout className="auth-layout">
        {/* Header */}
        <Header className="auth-header">
          <div className="logo" onClick={() => router.push("/dashboard")}>
            <span>MyApp</span>
          </div>
          <div className="header-right">
            <Dropdown menu={avatarMenu} placement="bottomRight">
              <div className="user-info">
                <Avatar style={{ backgroundColor: "#1890ff" }}>
                  {user?.name?.charAt(0) || "U"}
                </Avatar>
                <span className="username">{user?.name}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Layout>
          {/* Sidebar */}
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            className="auth-sider"
          >
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[pathname]}
              items={sideMenuItems}
            />
          </Sider>

          {/* Content */}
          <Layout>
            <Content className="auth-content">{children}</Content>
          </Layout>
        </Layout>
      </Layout>
    </Suspense>
  );
}
