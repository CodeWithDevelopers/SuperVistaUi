export const menuConfig = [
    {
        key: "dashboard",
        link: "/dashboard",
        label: "Dashboard",
        icon: "DashboardOutlined",
        role: ["super-admin", "admin", "employee","manager"],
    },
    {
        key: "tasks",
        link: "/tasks",
        label: "Tasks",
        icon: "UnorderedListOutlined",
        role: ["super-admin", "admin", "employee","manager"],
    },
    {
        key: "users",
        link: "/users",
        label: "Users",
        icon: "UserOutlined",
        role: ["super-admin", "admin", "employee","manager"],
    },
    {
        key: "settings",
        link: "#",
        label: "Settings",
        icon: "SettingOutlined",
        role: ["super-admin", "admin"],
        children: [
            {
                key: "module",
                link: "/settings/module",
                label: "Module",
                icon: "DashboardOutlined",
                role: ["super-admin", "admin"],
            },
            {
                key: "resource-mapping",
                link: "/settings/resource-mapping",
                label: "Resource Mapping",
                icon: "DashboardOutlined",
                role: ["super-admin", "admin"],
            },
            {
                key: "acl",
                link: "/settings/acl",
                label: "Acl",
                icon: "DashboardOutlined",
                role: ["super-admin", "admin"],
            },
        ],
    },
];
