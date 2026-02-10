import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  HistoryOutlined,
  SettingOutlined,
  ShopOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { Text } = Typography;

const Navbar = ({ collapsed, setCollapsed, selectedMenu, setSelectedMenu }) => {
  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '2',
      icon: <ShoppingCartOutlined />,
      label: 'Sale',
    },
    {
      key: '3',
      icon: <HistoryOutlined />,
      label: 'Order History',
    },
    {
      key: '4',
      icon: <ShopOutlined />,
      label: 'Products',
    },
    {
      key: '5',
      icon: <FileTextOutlined />,
      label: 'Reports',
    },
    {
      key: '6',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleLogout = () => {
    console.log('Logout clicked');
    // Add your logout logic here
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      breakpoint="lg"
      collapsedWidth="80"
      width={250}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      {/* Logo/Header */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        {!collapsed ? (
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
            🏨 POS Hotel
          </Text>
        ) : (
          <Text style={{ fontSize: 24 }}>🏨</Text>
        )}
      </div>

      {/* Main Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedMenu]}
        onClick={({ key }) => setSelectedMenu(key)}
        items={menuItems}
      />

      {/* Logout Button */}
      <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <Menu
          theme="dark"
          mode="inline"
          items={[
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Logout',
              onClick: handleLogout,
            },
          ]}
        />
      </div>
    </Sider>
  );
};

export default Navbar;