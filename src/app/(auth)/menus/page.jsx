"use client";

import React from "react";
import MenuList from "./components/MenuList";

const MenuPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Menus Management</h2>
      <MenuList />
    </div>
  );
};

export default MenuPage;
