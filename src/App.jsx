import React, { useState } from 'react';
import { Layout, Typography, theme } from 'antd';
import Navbar from './Components/Layout/Navbar';
import Dashboard from './Components/Dashboard';
import Sale from './Components/Sale/Sale';

const { Content } = Layout;
const { Text } = Typography;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('1');
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Render content based on selected menu
  const renderContent = () => {
    switch (selectedMenu) {
      case '1':
        return <Dashboard />;
      case '2':
        return <Sale />;
      case '3':
        return <UnderDevelopment title="Order History" />;
      case '4':
        return <UnderDevelopment title="Products" />;
      case '5':
        return <UnderDevelopment title="Reports" />;
      case '6':
        return <UnderDevelopment title="Settings" />;
      default:
        return <UnderDevelopment title="Page" />;
    }
  };

  return (
    <Layout style={{ minHeight: '100%' }}>
      {/* Navbar Component */}
      <Navbar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
      />

      {/* Main Content Area */}
      <Layout style={{ marginLeft: collapsed ? 80 : 250 }}>
        <Content style={{ height: '100%' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

// Under Development Component
const UnderDevelopment = ({ title }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
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
      <div>
        <Text type="secondary" style={{ fontSize: 18, fontWeight: 'bold', display: 'block', marginBottom: 8 }}>
          {title}
        </Text>
        <Text type="secondary" style={{ fontSize: 14 }}>
          This section is under development
        </Text>
      </div>
    </div>
  );
};

export default App;