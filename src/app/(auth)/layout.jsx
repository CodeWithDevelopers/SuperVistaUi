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
import PreloaderPage from "@/components/preloader/preloader";

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

  /**
   * ✅ Recursively build menu items and only add `onClick` for final items
   */
  const filterMenuByRole = (menu, role) => {
    return menu
      .filter((item) => item.role.includes(role))
      .map((item) => {
        const hasChildren = item.children && item.children.length > 0;

        return {
          key: item.link,
          label: item.label,
          icon: iconMap[item.icon] || null,
          children: hasChildren
            ? filterMenuByRole(item.children, role)
            : undefined,
          onClick:
            !hasChildren && item.link !== "#"
              ? () => router.push(item.link)
              : undefined, // only leaf nodes navigate
        };
      });
  };

  const sideMenuItems = filterMenuByRole(menuConfig, user?.role);

  /**
   * ✅ Handle menu clicks properly
   * This ensures only leaf node clicks trigger navigation.
   */
  const handleMenuClick = (info) => {
    const { key } = info;
    if (key && key !== "#") {
      router.push(key);
    }
  };

  return (
    <Suspense fallback={<PreloaderPage />}>
      <Layout className="auth-layout">
        {/* Header */}
        <Header className="auth-header">
          <div
            className="logo"
            onClick={() => router.push("/dashboard")}
            style={{ cursor: "pointer" }}
          >
            <span>MyApp</span>
          </div>
          <div className="header-right">
            <Dropdown menu={avatarMenu} placement="bottomRight">
              <div className="user-info" style={{ cursor: "pointer" }}>
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
              onClick={handleMenuClick}
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
