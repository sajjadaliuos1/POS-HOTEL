import React, { useState } from 'react';
import { Layout, Menu, Typography, theme } from 'antd';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  HistoryOutlined,
  SettingOutlined,
  ShopOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Dashboard from './Components/Dashboard';

const { Sider, Content } = Layout;
const { Text } = Typography;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('1');
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '2',
      icon: <ShoppingCartOutlined />,
      label: 'Orders',
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

  return (
    <Layout style={{ minHeight: '100%' }}>
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

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenu]}
          onClick={({ key }) => setSelectedMenu(key)}
          items={menuItems}
        />

        <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <Menu
            theme="dark"
            mode="inline"
            items={[
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Logout',
              },
            ]}
          />
        </div>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 250 }}>
        <Content style={{ height: '100%' }}>
          {/* Dashboard */}
          {selectedMenu === '1' && <Dashboard />}

          {/* Other menus */}
          {selectedMenu !== '1' && (
            <div
              style={{
                background: colorBgContainer,
                padding: 40,
                margin: 24,
                borderRadius: borderRadiusLG,
                textAlign: 'center',
                minHeight: 'calc(100vh - 48px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text type="secondary" style={{ fontSize: 16 }}>
                This section is under development
              </Text>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;