"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Spin } from "antd";
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
import { getLoggedInUser } from "@/utils/utils";
import PreloaderPage from "@/components/preloader/preloader";
import HTTPRequest from "@/services/request";
import { selfMessage } from "@/components/message/SelfMessage";

const { Header, Sider, Content } = Layout;

const iconMap = {
  DashboardOutlined: <DashboardOutlined />,
  SettingOutlined: <SettingOutlined />,
  UserOutlined: <UserOutlined />,
  UnorderedListOutlined: <UnorderedListOutlined />,
};

export default function AuthLayout({ children }) {
  const user = getLoggedInUser();
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);
  const [menuConfig, setMenuConfig] = useState([]);
  const [loading, setLoading] = useState(false);

  /** ✅ Fetch Menu Config from API */
  const fetchMenuConfig = async () => {
    try {
      setLoading(true);
      const response = await HTTPRequest().getAction(
        null,
        "/menus/main_menu",
        true
      );

      if (response?.success) {
        const config = response.data?.config || response.data || [];
        setMenuConfig(config);
      } else {
        selfMessage.error(response?.message || "Failed to fetch menu", "error");
      }
    } catch (error) {
      console.error("Error fetching main menu:", error);
      selfMessage.error("Failed to load menu configuration", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuConfig();
  }, []);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return null;

  /** Avatar Dropdown Menu */
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

  /** ✅ Build Sidebar Menu Items Recursively */
  const buildMenuItems = (items, role) => {
    return (
      items
        ?.filter((item) => item.status === 1 && !item.is_deleted)
        .map((item) => {
          const hasChildren =
            Array.isArray(item.children) && item.children.length > 0;
          const children = hasChildren
            ? buildMenuItems(item.children, role)
            : [];

          const isAllowed = item.allowed_roles_types?.includes(role);
          if (!isAllowed && children.length === 0) return null;

          let icon =
            iconMap[item.icon] ||
            (item.title?.toLowerCase().includes("setting") ? (
              <SettingOutlined />
            ) : item.title?.toLowerCase().includes("menu") ? (
              <UnorderedListOutlined />
            ) : (
              <DashboardOutlined />
            ));

          return {
            key: item.link || item.key,
            label: item.title,
            icon,
            children: children.length > 0 ? children : undefined,
            onClick:
              children.length === 0 && item.link && item.link !== "#"
                ? () => router.push(item.link)
                : undefined,
          };
        })
        .filter(Boolean) || []
    );
  };

  const sideMenuItems = buildMenuItems(menuConfig, user?.role);

  /** Handle Sidebar Navigation */
  const handleMenuClick = ({ key }) => {
    if (key && key !== "#") router.push(key);
  };

  return (
    <Suspense fallback={<PreloaderPage />}>
      <Layout className="auth-layout">
        {/* Fixed Header */}
        <Header className="auth-header fixed-header">
          <div
            className="logo"
            onClick={() => router.push("/dashboard")}
            style={{ cursor: "pointer" }}
          >
            <span>MyApp</span>
          </div>
          <div className="header-right">
            <Dropdown menu={avatarMenu} placement="bottomRight">
              <div className="user-info">
                <Avatar
                  src={user?.profile?.[0]?.url}
                  style={{ backgroundColor: "#1890ff" }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
                <span className="username">{user?.name}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Layout hasSider>
          {/* Fixed Sidebar */}
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            className="auth-sider fixed-sider"
          >
            {loading ? (
              <div style={{ textAlign: "center", marginTop: "30px" }}>
                <Spin tip="Loading Menu..." />
              </div>
            ) : (
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[pathname]}
                items={sideMenuItems}
                onClick={handleMenuClick}
              />
            )}
          </Sider>

          {/* Scrollable Content */}
          <Layout className="main-layout">
            <Content className="auth-content">{children}</Content>
          </Layout>
        </Layout>
      </Layout>
    </Suspense>
  );
}
